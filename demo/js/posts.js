/* Forum post rendering + interactions, shared by the Forum and Search tabs (design doc §6.3) */
(function () {
  const { D, Store, $, $$, esc, icon, icons, person, fullName, avatar } = App;

  const ps = (id) => {
    const s = Store.get();
    return (s.postState[id] = s.postState[id] || { helpful: false, saved: false, interested: false, joined: false, replies: [] });
  };
  const findPost = (id) => App.allPosts().find((p) => p.id === id);

  function highlight(text, q) {
    const safe = esc(text);
    if (!q) return safe;
    const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    return safe.replace(re, "<mark>$1</mark>");
  }

  function postHTML(p, { q = "", detail = false } = {}) {
    const a = person(p.author);
    const st = ps(p.id);
    const pinned = (p.thread || []).find((r) => r.pinned);
    const replyCount = p.replies + st.replies.length;
    let special = "";
    if (p.type === "opportunity") {
      special = `<div class="card opp"><div style="display:flex;justify-content:space-between;gap:8px"><div><h4>${highlight(p.role, q)}</h4><div class="meta">${highlight(p.org, q)}</div></div>${icon("briefcase", 'style="color:var(--ink-muted)"')}</div>
        <div class="row"><span class="meta" style="display:flex;gap:6px;align-items:center">${icon("clock", 'style="width:16px;height:16px"')}${esc(p.deadline)}</span>
        <button class="btn btn-sm ${st.interested ? "btn-secondary is-on" : "btn-primary"}" data-interested="${p.id}">${st.interested ? icon("check") + "Interested" : "Interested"}</button></div></div>`;
    } else if (p.type === "study") {
      const members = p.members.length + (st.joined ? 1 : 0);
      special = `<div class="card opp"><div style="display:flex;align-items:center;gap:8px"><span class="chip static" style="font-weight:700;border-color:var(--ink)">${highlight(p.classCode, q)}</span><span class="meta">${esc(p.cadence)}</span></div>
        <div class="row"><span style="display:flex;align-items:center;gap:8px"><span class="stack">${p.members.slice(0, 3).map((m) => avatar(person(m), "sm")).join("")}</span><span class="meta">${members} members</span></span>
        <button class="btn btn-sm ${st.joined ? "btn-secondary is-on" : "btn-primary"}" data-join="${p.id}">${st.joined ? icon("check") + "Joined" : "Join"}</button></div></div>`;
    }
    const answered = p.type === "question" && pinned && !detail
      ? `<div class="answered">${icon("circle-check", 'style="width:16px;height:16px"')}Answered</div><div class="best-answer"><b>${esc(person(pinned.author).first)}:</b> ${esc(pinned.body)}</div>` : "";
    return `<article class="post" data-post="${p.id}">
      <button data-author="${a.id}" aria-label="${esc(fullName(a))}">${avatar(a)}</button>
      <div class="body">
        <div class="who"><b>${esc(fullName(a))}</b><span class="meta">${esc(a.year)} · ${esc(a.major)}</span><span class="meta" style="margin-left:auto">${esc(p.time)}</span></div>
        ${p.type !== "post" ? `<div class="type-label" style="margin-top:4px">${App.typeName(p.type)}</div>` : ""}
        <p ${detail ? 'style="font-size:17px"' : ""}>${highlight(p.body, q)}</p>
        ${p.photo ? `<div class="photo" style="display:grid;place-items:center;color:var(--ink-muted)">${icon("image")}</div>` : ""}
        ${special}
        ${answered}
        ${p.tags && p.tags.length ? `<div>${p.tags.map((t) => `<a class="tag" href="forum.html?tag=${encodeURIComponent(t)}">${highlight(t, q)}</a>`).join("")}</div>` : ""}
        <div class="post-actions">
          <button data-open="${p.id}">${icon("message-circle")}${replyCount}</button>
          <button data-helpful="${p.id}" class="${st.helpful ? "is-on" : ""}">${icon("thumbs-up")}${p.type === "question" ? "Helpful" : "Appreciate"} · ${p.helpful + (st.helpful ? 1 : 0)}</button>
          <button data-save="${p.id}" class="right ${st.saved ? "is-on" : ""}" aria-label="Save">${icon("bookmark")}</button>
        </div>
      </div>
    </article>`;
  }

  /** Wires post interactions inside `root`. `rerender` refreshes the host view. */
  function bindPosts(root, rerender, { detail = false } = {}) {
    $$("[data-author]", root).forEach((b) => (b.onclick = (e) => { e.stopPropagation(); if (b.dataset.author !== "me") App.openProfile(b.dataset.author); else location.href = "profile.html"; }));
    $$("[data-helpful]", root).forEach((b) => (b.onclick = (e) => { e.stopPropagation(); const st = ps(b.dataset.helpful); st.helpful = !st.helpful; Store.save(); rerender(); }));
    $$("[data-save]", root).forEach((b) => (b.onclick = (e) => { e.stopPropagation(); const st = ps(b.dataset.save); st.saved = !st.saved; Store.save(); rerender(); App.toast(st.saved ? "Saved" : "Removed from saved"); }));
    $$("[data-interested]", root).forEach((b) => (b.onclick = (e) => {
      e.stopPropagation(); const p = findPost(b.dataset.interested); const st = ps(p.id); st.interested = !st.interested; Store.save(); rerender();
      if (st.interested) App.toast(`${person(p.author).first} can see you're interested`, { label: "Message", fn: () => (location.href = `messages.html?c=${p.author}`) });
    }));
    $$("[data-join]", root).forEach((b) => (b.onclick = (e) => {
      e.stopPropagation(); const p = findPost(b.dataset.join); const st = ps(p.id); st.joined = !st.joined;
      const s = Store.get(); const tid = "group_" + p.id;
      if (st.joined) {
        s.threads[tid] = s.threads[tid] || { group: p.id, title: `${p.classCode} Study Group`, members: p.members, messages: [{ from: p.author, text: `Welcome to the ${p.classCode} group! We meet ${p.cadence.replace("Meets ", "").toLowerCase()}.` }] };
        if (!s.unread.includes(tid)) s.unread.push(tid);
      } else { delete s.threads[tid]; s.unread = s.unread.filter((x) => x !== tid); }
      Store.save(); rerender(); App.refreshTabbar();
      if (st.joined) App.toast(`Added to the ${p.classCode} group chat`, { label: "Open", fn: () => (location.href = `messages.html?c=${tid}`) });
    }));
    if (detail) { $$("[data-open]", root).forEach((b) => (b.onclick = () => $("[data-reply]") && $("[data-reply]").focus())); return; }
    $$("[data-open]", root).forEach((b) => (b.onclick = (e) => { e.stopPropagation(); openPost(b.dataset.open, rerender); }));
    $$(".post", root).forEach((el) => (el.onclick = (e) => { if (e.target.closest("a,button")) return; openPost(el.dataset.post, rerender); }));
  }

  function openPost(id, rerenderHost) {
    const p = findPost(id);
    const draw = (root) => {
      const st = ps(id);
      const thread = [...(p.thread || []), ...st.replies];
      const sorted = [...thread.filter((r) => r.pinned), ...thread.filter((r) => !r.pinned)];
      $(".screen", root).innerHTML = `${postHTML(p, { detail: true })}
        <div class="pad" style="padding-top:16px;padding-bottom:24px">
          <div class="overline">${thread.length ? `${p.replies + st.replies.length} replies` : "No replies yet"}</div>
          ${sorted.map((r, i) => { const a = person(r.author); return `<div class="reply ${r.pinned ? "pinned" : ""}">
            ${avatar(a, "sm")}<div style="flex:1"><div style="font-size:14px"><b>${esc(fullName(a))}</b> <span class="meta">${esc(a.year)}</span></div>
            ${r.pinned ? `<div class="pill-label" style="margin:4px 0">${icon("pin")}Best answer</div>` : ""}
            <div style="font-size:15px">${esc(r.body)}</div>
            ${r.author !== "me" ? `<button class="meta" data-rhelp="${i}" style="margin-top:4px;display:inline-flex;gap:4px;align-items:center">${icon("thumbs-up", 'style="width:14px;height:14px"')}Helpful · ${r.helpful || 0}</button>` : ""}</div></div>`; }).join("")}
        </div>`;
      icons();
      bindPosts($(".screen", root), () => { draw(root); rerenderHost && rerenderHost(); }, { detail: true });
      $$("[data-rhelp]", root).forEach((b) => (b.onclick = () => { const r = sorted[+b.dataset.rhelp]; r.helpful = (r.helpful || 0) + 1; draw(root); }));
    };
    App.page({
      title: App.typeName(p.type),
      html: "",
      foot: `<div class="composer" style="padding:0;border:0;width:100%"><textarea class="input" rows="1" data-reply placeholder="Add a reply…"></textarea><button class="send-btn" data-send disabled aria-label="Send">${icon("arrow-up")}</button></div>`,
      onMount(root) {
        draw(root);
        const ta = $("[data-reply]", root), send = $("[data-send]", root);
        ta.oninput = () => (send.disabled = !ta.value.trim());
        send.onclick = () => {
          ps(id).replies.push({ author: "me", body: ta.value.trim() }); Store.save();
          ta.value = ""; send.disabled = true; draw(root); rerenderHost && rerenderHost();
          const scr = $(".screen", root); scr.scrollTop = scr.scrollHeight;
        };
      },
    });
  }

  window.Posts = { postHTML, bindPosts, openPost, highlight, ps };
})();
