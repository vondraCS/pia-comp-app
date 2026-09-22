/* Messages tab: inbox + chat with coffee-chat nudge (design doc §6.5) */
(function () {
  const { D, Store, $, $$, esc, icon, icons, person, fullName, avatar } = App;
  App.init("messages");
  const screen = $("#screen");

  const nowLabel = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const threadTitle = (t) => (t.group ? t.title : fullName(person(t.with)));
  const lastMsg = (t) => t.messages[t.messages.length - 1];

  function threadAvatar(t, cls = "") {
    if (t.group) return `<span class="stack" style="width:44px;position:relative;height:44px">${t.members.slice(0, 2).map((m, i) => `<span style="position:absolute;${i ? "right:0;bottom:0" : "left:0;top:0"}">${avatar(person(m), "sm round")}</span>`).join("")}</span>`;
    return avatar(person(t.with), cls);
  }

  function renderInbox() {
    const s = Store.get();
    const entries = Object.entries(s.threads).filter(([id, t]) => t.messages.length && !(t.with && s.blocked.includes(t.with)));
    entries.sort((a, b) => (b[1].updated || 0) - (a[1].updated || 0));
    const fresh = s.connected.filter((id) => !s.blocked.includes(id) && !(s.threads[id] && s.threads[id].messages.length));
    screen.innerHTML = `<header class="appbar"><h1 class="page-title">Messages</h1></header>
      <div class="pad">
        ${fresh.length ? `<div class="overline" style="margin-top:8px">New connections</div>
          <div class="new-conns">${fresh.map((id) => { const p = person(id); return `<button data-open="${id}">${avatar(p, "round")}<span>${esc(p.first)}</span></button>`; }).join("")}</div>` : ""}
        ${entries.length ? `<div class="overline" style="margin-top:16px">Conversations</div>
          ${entries.map(([id, t]) => { const m = lastMsg(t); const unread = s.unread.includes(id); const conn = t.with && App.isConnected(t.with);
            return `<button class="list-row convo ${unread ? "unread" : ""}" data-open="${id}">${threadAvatar(t, conn ? "round" : "")}
              <span class="grow"><span style="display:flex;align-items:center;gap:8px"><span class="name truncate">${esc(threadTitle(t))}</span>${conn ? `<span class="pill-label" style="font-size:10px">Connected</span>` : ""}${t.group ? `<span class="meta">${t.members.length + 1} members</span>` : ""}</span>
              <span class="preview truncate" style="display:block">${m.from === "me" ? "You: " : t.group ? esc(person(m.from).first) + ": " : ""}${esc(m.text)}</span></span>
              <span class="time">${esc(m.at && !m.at.startsWith("Today") ? m.at : t.updated ? "now" : m.at || "")}</span>${unread ? '<span class="dot"></span>' : ""}</button>`; }).join("")}`
        : `<div class="empty"><h2 class="title">No messages yet.</h2><p>Connect with someone or reply to a post to get talking.</p></div>`}
      </div>`;
    icons();
    $$("[data-open]").forEach((b) => (b.onclick = () => openChat(b.dataset.open)));
  }

  function starters(p) {
    if (p.starters) return p.starters;
    const me = person("me");
    const out = [];
    if (p.prompts[0]) { const q = p.prompts[0].q.replace("…", ""); out.push({ label: `Ask about their answer to “${q}…”`, text: `Loved your answer to “${q}.” How did that come about?` }); }
    const g = p.goals.find((x) => me.goals.includes(x));
    if (g) out.push({ label: `You both picked ${g.toLowerCase()}. Compare notes.`, text: `Looks like we're both into ${g.toLowerCase()}. What are you working on right now?` });
    return out;
  }

  function openChat(id) {
    const s = Store.get();
    const t = s.threads[id] || App.ensureThread(id);
    s.unread = s.unread.filter((x) => x !== id); Store.save(); App.refreshTabbar();
    const p = t.with ? person(t.with) : null;
    const connected = p && App.isConnected(p.id);

    const header = t.group
      ? `<span style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">${threadAvatar(t)}<span><span class="serif" style="display:block;font-size:18px;font-weight:500;line-height:1.2">${esc(t.title)}</span><span class="meta">${t.members.map((m) => person(m).first).join(", ")} and you</span></span></span>`
      : `<button data-who style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;text-align:left">${avatar(p, connected ? "round sm" : "sm")}<span style="min-width:0"><span style="display:flex;align-items:center;gap:6px"><span class="serif" style="font-size:18px;font-weight:500;line-height:1.2">${esc(fullName(p))}</span>${connected ? `<span class="pill-label" style="font-size:10px">Connected</span>` : ""}</span><span class="meta truncate" style="display:block">${esc(p.year)} · ${esc(p.major)}</span></span></button>`;

    const pg = App.page({
      noHeader: true,
      html: "",
      foot: `<div class="composer" style="padding:0;border:0;width:100%"><button class="icon-btn" style="margin:0" aria-label="Add photo" data-photo>${icon("image")}</button><textarea class="input" rows="1" data-text placeholder="Message ${esc(t.group ? t.title : p.first)}…"></textarea><button class="send-btn" data-send disabled aria-label="Send">${icon("arrow-up")}</button></div>`,
      onClose() { history.replaceState(null, "", location.pathname); renderInbox(); },
      onMount(root, close) {
        const scr = $(".screen", root);
        scr.insertAdjacentHTML("beforebegin", `<header class="appbar" style="border-bottom:1px solid var(--hairline)"><button class="icon-btn" data-back aria-label="Back">${icon("arrow-left")}</button>${header}<button class="icon-btn" data-more aria-label="More">${icon("ellipsis")}</button></header>`);
        icons();
        $("[data-back]", root).onclick = close;
        const who = $("[data-who]", root); if (who) who.onclick = () => App.openProfile(p.id);
        $("[data-more]", root).onclick = () => p ? App.reportBlock(p, close) : App.actionSheet([{ label: "Mute group", icon: "bell-off", fn: () => App.toast("Muted") }, { label: "Leave group", icon: "log-out", danger: true, fn: () => { delete Store.get().threads[id]; Store.save(); close(); App.toast("You left the group"); } }]);
        const ta = $("[data-text]", root), send = $("[data-send]", root);
        const setText = (v) => { ta.value = v; ta.oninput(); ta.focus(); };
        ta.oninput = () => { send.disabled = !ta.value.trim(); ta.style.height = "auto"; ta.style.height = Math.min(120, ta.scrollHeight) + "px"; };
        $("[data-photo]", root).onclick = () => App.toast("Photo sharing isn't part of the demo");

        const draw = () => {
          const mine = t.messages.filter((m) => m.from === "me").length;
          const showNudge = connected && mine < 3 && !s.nudgeDismissed[id];
          const st = p ? starters(p) : [];
          scr.innerHTML = `${showNudge ? `<div class="nudge"><button class="icon-btn x" data-dismiss aria-label="Dismiss">${icon("x")}</button>
              <h3>${icon("coffee")}Grab coffee?</h3>
              <p class="muted" style="margin:0 0 12px;font-size:14px">Most coffee chats take 20–30 minutes. Pick a spot on campus that works for both of you.</p>
              ${st.length ? `<div class="overline">Conversation starters</div>${st.map((x, i) => `<button class="starter" data-starter="${i}"><span>${esc(x.label)}</span>${icon("arrow-up-right")}</button>`).join("")}` : ""}
              <button class="btn btn-primary btn-block" data-coffee style="margin-top:4px">${icon("coffee")}Suggest a coffee chat</button></div>` : ""}
            <div class="thread">
              ${!t.messages.length ? `<div class="empty" style="padding:32px 0 8px"><div style="display:grid;place-items:center;margin-bottom:12px">${t.group ? "" : avatar(p, connected ? "round lg" : "lg")}</div><p style="margin:0">${connected ? `You and ${esc(p.first)} connected. Say hi!` : `Start a conversation with ${esc(t.group ? t.title : p.first)}.`}</p></div>` : ""}
              ${t.messages.map((m) => `${m.at ? `<div class="stamp">${esc(m.at)}</div>` : ""}<div class="bubble ${m.from === "me" ? "out" : "in"}">${t.group && m.from !== "me" ? `<span class="from">${esc(person(m.from).first)}</span>` : ""}${esc(m.text)}</div>`).join("")}
            </div>`;
          icons();
          const d = $("[data-dismiss]", scr); if (d) d.onclick = () => { s.nudgeDismissed[id] = true; Store.save(); draw(); };
          $$("[data-starter]", scr).forEach((b) => (b.onclick = () => setText(st[+b.dataset.starter].text)));
          const c = $("[data-coffee]", scr); if (c) c.onclick = () => setText(`Hey ${p.first}! Would you want to grab coffee on campus sometime this week?`);
          scr.scrollTop = scr.scrollHeight;
        };

        const reply = () => {
          const key = t.group ? id : t.with;
          const list = D.replies[key] || D.replies.default;
          const n = s.replyIdx[key] || 0;
          if (n >= list.length) return;
          const thread = $(".thread", scr);
          setTimeout(() => {
            thread.insertAdjacentHTML("beforeend", '<div class="typing"><i></i><i></i><i></i></div>');
            scr.scrollTop = scr.scrollHeight;
            setTimeout(() => {
              let text = list[n], from = t.with;
              if (t.group) { const [who, ...rest] = text.split(": "); from = Object.keys(D.people).find((k) => D.people[k].first === who) || t.members[0]; text = rest.join(": "); }
              t.messages.push({ from, text }); t.updated = Date.now();
              s.replyIdx[key] = n + 1; Store.save(); draw();
            }, 1400);
          }, 700);
        };

        send.onclick = () => {
          const text = ta.value.trim(); if (!text) return;
          if (!t.messages.some((m) => m.at && m.at.startsWith("Today"))) t.messages.push({ from: "me", text, at: `Today ${nowLabel()}` });
          else t.messages.push({ from: "me", text });
          t.updated = Date.now(); Store.save();
          ta.value = ""; ta.oninput(); draw(); reply();
        };
        ta.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send.onclick(); } };
        draw();
      },
    });
    history.replaceState(null, "", `?c=${encodeURIComponent(id)}`);
    return pg;
  }

  renderInbox();
  const c = App.param("c");
  if (c && (Store.get().threads[c] || D.people[c])) openChat(c);
})();
