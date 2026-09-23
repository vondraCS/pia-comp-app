/* ==========================================================================
   Shared runtime for the clickable demo: state, chrome, overlays and the
   components used on more than one tab (profile view, connection moment,
   Experience Translator, deck preferences).
   ========================================================================== */
(function () {
  const D = window.DATA;
  const KEY = "appname-demo-v1";

  /* ---------- State (persists across tabs via localStorage) ---------- */
  function freshState() {
    return {
      onboarded: false,
      me: JSON.parse(JSON.stringify(D.me)),
      connected: D.connected.slice(),
      pending: [],
      passed: [],
      likesHandled: [],
      blocked: [],
      threads: JSON.parse(JSON.stringify(D.threads)),
      unread: ["diego"],
      replyIdx: {},
      nudgeDismissed: {},
      myPosts: [],
      postState: {},
      eventsInterested: [],
      prefs: { order: ["goals", "major", "year"], goals: ["Entrepreneurship", "Finding a mentor"], major: ["Business", "Design"], year: ["Junior", "Senior", "Graduate"] },
      recentSearches: ["product design", "#internships"],
      undo: null,
    };
  }
  let memoryState = null;
  const Store = {
    get() {
      if (memoryState) return memoryState;
      try { memoryState = JSON.parse(localStorage.getItem(KEY)); } catch (e) { memoryState = null; }
      if (!memoryState) memoryState = freshState();
      return memoryState;
    },
    save() { try { localStorage.setItem(KEY, JSON.stringify(memoryState)); } catch (e) {} },
    reset() { memoryState = freshState(); try { localStorage.removeItem(KEY); } catch (e) {} },
  };

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (n, extra = "") => `<i data-lucide="${n}" ${extra}></i>`;
  const icons = () => window.lucide && window.lucide.createIcons();
  const param = (k) => new URLSearchParams(location.search).get(k);

  function person(id) {
    if (id === "me") return Object.assign({ id: "me" }, Store.get().me);
    const p = D.people[id];
    return p ? Object.assign({ id }, p) : null;
  }
  const fullName = (p) => `${p.first} ${p.last}`;
  const initials = (p) => (p.first[0] + p.last[0]).toUpperCase();
  const isConnected = (id) => Store.get().connected.includes(id);
  const isPending = (id) => Store.get().pending.includes(id);

  function avatar(p, cls = "") {
    const showPhoto = p.photo && (p.id === "me" || isConnected(p.id));
    return `<span class="mono ${cls}" data-tint="${p.tint || 1}">${showPhoto ? `<img src="${p.photo}" alt="${esc(fullName(p))}">` : initials(p)}</span>`;
  }

  /* ---------- Chrome ---------- */
  function statusbar() {
    return `<span>9:41</span><span class="sys">${icon("signal")}${icon("wifi")}${icon("battery-full")}</span>`;
  }
  function tabbar(active) {
    const s = Store.get();
    const likesLeft = D.likesYou.filter((id) => !s.likesHandled.includes(id)).length;
    const me = person("me");
    const tabs = [
      ["home", "Home", icon("layers"), likesLeft > 0],
      ["forum", "Forum", icon("messages-square"), false],
      ["search", "Search", icon("search"), false],
      ["messages", "Messages", icon("send"), s.unread.length > 0],
      ["profile", "Profile", `<span class="me">${me.photo ? `<img src="${me.photo}" alt="">` : ""}</span>`, false],
    ];
    return tabs.map(([id, label, ico, dot]) => `<a href="${id}.html" class="${id === active ? "is-on" : ""}" aria-label="${label}">${ico}${dot ? '<span class="dot"></span>' : ""}<span>${label}</span></a>`).join("");
  }
  function refreshTabbar() {
    const nav = $("#tabbar");
    if (nav) { nav.innerHTML = tabbar(nav.dataset.active); icons(); }
  }

  function init(active) {
    if (active && !Store.get().onboarded && !param("skip")) {
      // Jumping straight to a tab still works; onboarding is optional for demo navigation.
      Store.get().onboarded = true; Store.save();
    }
    const sb = $(".statusbar"); if (sb) sb.innerHTML = statusbar();
    const nav = $("#tabbar"); if (nav) { nav.dataset.active = active; nav.innerHTML = tabbar(active); }
    if (!$(".toast-host")) $(".phone").insertAdjacentHTML("beforeend", '<div class="toast-host"></div>');
    icons();
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg, action) {
    const host = $(".toast-host");
    host.innerHTML = `<div class="toast"><span>${esc(msg)}</span>${action ? `<button>${esc(action.label)}</button>` : ""}</div>`;
    const t = host.firstChild;
    if (!$("#tabbar") || $(".layer, .page.is-open")) host.style.bottom = "24px"; else host.style.bottom = "";
    requestAnimationFrame(() => t.classList.add("is-on"));
    if (action) t.querySelector("button").onclick = () => { action.fn(); t.classList.remove("is-on"); };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.classList.remove("is-on"); setTimeout(() => t.remove(), 300); }, action ? 4000 : 2400);
  }

  /* ---------- Bottom sheet ---------- */
  function sheet({ title = "", body = "", foot = "", full = false, onMount, onClose } = {}) {
    const layer = document.createElement("div");
    layer.className = "layer";
    layer.innerHTML = `<div class="scrim"></div>
      <div class="sheet ${full ? "full" : ""}" role="dialog" aria-label="${esc(title)}">
        ${full ? "" : '<div class="grab"></div>'}
        ${title || full ? `<div class="sheet-head">${full ? `<button class="icon-btn" data-close aria-label="Close">${icon("x")}</button>` : ""}<h2 class="title" style="font-size:20px">${esc(title)}</h2>${full ? "" : `<button class="icon-btn" data-close aria-label="Close">${icon("x")}</button>`}</div>` : ""}
        <div class="sheet-body">${body}</div>
        ${foot ? `<div class="sheet-foot">${foot}</div>` : ""}
      </div>`;
    $(".phone").appendChild(layer);
    const close = () => {
      layer.classList.remove("is-open");
      setTimeout(() => layer.remove(), 320);
      onClose && onClose();
    };
    layer.querySelector(".scrim").onclick = close;
    $$("[data-close]", layer).forEach((b) => (b.onclick = close));
    icons();
    requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add("is-open")));
    onMount && onMount(layer, close);
    return { root: layer, close };
  }

  function actionSheet(items) {
    return sheet({
      body: `<div class="action-list">${items.map((it, i) => `<button data-i="${i}" class="${it.danger ? "danger" : ""}">${icon(it.icon || "circle")}<span>${esc(it.label)}</span></button>`).join("")}</div>`,
      onMount(root, close) {
        $$("[data-i]", root).forEach((b) => (b.onclick = () => { close(); items[+b.dataset.i].fn(); }));
      },
    });
  }

  /* ---------- Full-screen page (push) ---------- */
  function page({ title = "", html = "", foot = "", right = "", cls = "", fade = false, noHeader = false, onMount, onClose } = {}) {
    const el = document.createElement("section");
    el.className = `page ${fade ? "fade" : ""} ${cls}`;
    el.innerHTML = `${$(".statusbar") ? '<div class="statusbar">' + statusbar() + "</div>" : ""}
      ${noHeader ? "" : `<header class="appbar"><button class="icon-btn" data-back aria-label="Back">${icon("arrow-left")}</button><div class="spacer serif" style="font-size:18px">${esc(title)}</div>${right}</header>`}
      <div class="screen">${html}</div>
      ${foot ? `<div class="page-foot">${foot}</div>` : ""}`;
    $(".phone").appendChild(el);
    const close = () => {
      el.classList.remove("is-open");
      setTimeout(() => el.remove(), 330);
      onClose && onClose();
    };
    $$("[data-back]", el).forEach((b) => (b.onclick = close));
    icons();
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-open")));
    onMount && onMount(el, close);
    return { root: el, close };
  }

  /* ---------- Profile view (shared by every tab) ---------- */
  function profileBody(p, { preview = false } = {}) {
    const posts = allPosts().filter((x) => x.author === p.id).slice(0, 3);
    const connected = isConnected(p.id);
    const exps = p.experiences.filter((e) => e.visible !== false);
    return `<div class="pad" style="padding-bottom:32px">
      <div class="profile-head">
        ${avatar(p, "xl")}
        <div>
          <h1 class="display">${esc(fullName(p))}</h1>
          <div class="meta" style="margin-top:4px">${esc(p.year)} · ${esc(p.major)}</div>
          ${connected && p.id !== "me" ? `<div style="margin-top:8px"><span class="pill-label">${icon("check")}Connected</span></div>` : ""}
        </div>
        <div class="titles">
          <div><div class="overline">Now</div><div>${esc(p.now)}</div></div>
          <div><div class="overline">Dream</div><div>${esc(p.dream)}</div></div>
        </div>
      </div>
      <div class="section"><div class="overline">Goals</div><div class="chips">${p.goals.map((g) => `<span class="chip static">${esc(g)}</span>`).join("")}</div></div>
      <div class="section"><div class="overline">About</div><p style="margin:0">${esc(p.bio)}</p></div>
      ${p.prompts.length ? `<div class="section"><div class="overline">Prompts</div>
        ${p.prompts.map((pr, i) => `<div class="card prompt-card" data-prompt="${i}">
          <p class="prompt-q">${esc(pr.q)}</p>
          ${pr.photo ? `<div style="aspect-ratio:4/3;border-radius:12px;background:var(--sand);display:grid;place-items:center;color:var(--ink-muted);margin:8px 0">${icon("image")}</div>` : ""}
          <p style="margin:0">${esc(pr.a)}</p>
          ${!preview && p.id !== "me" && !connected ? `<div class="connect-hint">${icon("message-circle-plus")}</div>` : ""}
        </div>`).join("")}</div>` : ""}
      ${exps.length ? `<div class="section"><div class="overline">Experiences</div><div class="card" style="padding:0 16px">${exps.map(expHTML).join("")}</div></div>` : ""}
      ${p.resume ? `<div class="section"><div class="overline">Resume</div><button class="card doc-card" data-resume><span class="doc-ico">${icon("file-text")}</span><span><b style="font-weight:500">Resume</b><div class="meta">PDF · Updated Sep 2026</div></span></button></div>` : ""}
      ${posts.length ? `<div class="section"><div class="section-head"><div class="overline">Posts</div><a class="link" href="forum.html" style="font-size:14px">See all</a></div>
        <div class="card" style="padding:0 16px">${posts.map((x) => `<div class="list-row"><div class="grow"><div class="type-label">${typeName(x.type)}</div><div class="truncate">${esc(x.body)}</div></div></div>`).join("")}</div></div>` : ""}
    </div>`;
  }
  function expHTML(e) {
    return `<div class="exp"><h4>${esc(e.role)}</h4><div class="meta">${esc(e.org)} · ${esc(e.dates)}</div>
      <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <div class="chips">${(e.skills || []).map((s) => `<span class="chip static static-on" style="min-height:28px;font-size:13px">${esc(s)}</span>`).join("")}</div></div>`;
  }

  /** ctx: "deck" | "likes" | "other" */
  function openProfile(id, { ctx = "other", onPass, onConnect } = {}) {
    const p = person(id);
    const footFor = () => {
      if (ctx === "deck" || ctx === "likes") return `<button class="btn btn-secondary" data-pass>${icon("x")}Pass</button><button class="btn btn-primary" data-connect>${icon("check")}Connect</button>`;
      if (isConnected(id)) return `<button class="btn btn-secondary" disabled style="opacity:.6">${icon("check")}Connected</button><button class="btn btn-primary" data-message>${icon("send")}Message</button>`;
      if (isPending(id)) return `<button class="btn btn-secondary" data-message>${icon("send")}Message</button><button class="btn btn-primary" disabled>Request sent</button>`;
      return `<button class="btn btn-secondary" data-message>${icon("send")}Message</button><button class="btn btn-primary" data-connect>${icon("check")}Connect</button>`;
    };
    return page({
      title: "",
      html: profileBody(p),
      foot: footFor(),
      right: `<button class="icon-btn" data-more aria-label="More">${icon("ellipsis")}</button>`,
      onMount(root, close) {
        const bind = () => {
          const pass = $("[data-pass]", root), con = $("[data-connect]", root), msg = $("[data-message]", root);
          if (pass) pass.onclick = () => { close(); onPass && onPass(); };
          if (con) con.onclick = () => { close(); onConnect ? onConnect() : connect(id); };
          if (msg) msg.onclick = () => (location.href = `messages.html?c=${id}`);
        };
        bind();
        $("[data-more]", root).onclick = () => reportBlock(p, close);
        const r = $("[data-resume]", root); if (r) r.onclick = () => openResume(p);
        $$("[data-prompt]", root).forEach((c) => (c.onclick = () => {
          if (isConnected(id)) return;
          connectWithNote(p, p.prompts[+c.dataset.prompt], () => { close(); onConnect ? onConnect() : connect(id); });
        }));
      },
    });
  }

  function connectWithNote(p, prompt, done) {
    sheet({
      title: `Connect with ${p.first}`,
      body: `<div class="card" style="background:var(--paper)"><p class="prompt-q">${esc(prompt.q)}</p><p style="margin:0" class="muted">${esc(prompt.a)}</p></div>
        <label class="field" style="margin-top:16px"><span>Add a note (it becomes your first message)</span>
        <textarea class="textarea" data-note style="min-height:96px">That sounds great. How'd you get into it?</textarea></label>`,
      foot: `<button class="btn btn-primary btn-block" data-send>${icon("check")}Connect with note</button>`,
      onMount(root, close) {
        $("[data-send]", root).onclick = () => {
          Store.get()._pendingNote = { id: p.id, text: $("[data-note]", root).value.trim() };
          close(); done();
        };
      },
    });
  }

  function openResume(p) {
    page({
      title: "Resume",
      html: `<div class="resume-sheet"><h1>${esc(fullName(p))}</h1><div>${esc(p.major)} · Arizona State University · ${p.first.toLowerCase()}@asu.edu</div>
        <h2>Experience</h2>${(p.experiences.length ? p.experiences : [{ role: p.now, org: "", dates: "", bullets: ["Details available on request."] }]).map((e) => `<b>${esc(e.role)}</b>${e.org ? ", " + esc(e.org) : ""} <span style="float:right">${esc(e.dates)}</span><ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`).join("")}
        <h2>Education</h2><b>Arizona State University</b>, ${esc(p.major)}<br>Expected ${p.year === "Graduate" ? "2027" : p.year === "Senior" ? "2027" : p.year === "Junior" ? "2028" : p.year === "Sophomore" ? "2029" : "2030"}
        <h2>Skills</h2>${esc([...new Set(p.experiences.flatMap((e) => e.skills || []))].join(" · ") || "Communication · Teamwork")}</div>`,
    });
  }

  function reportBlock(p, closeParent) {
    actionSheet([
      { label: `Report ${p.first}`, icon: "flag", fn: () => toast("Thanks. Our team will review this.") },
      { label: `Block ${p.first}`, icon: "ban", danger: true, fn: () => {
        sheet({
          title: `Block ${p.first}?`,
          body: `<p class="muted" style="margin-top:0">They won't be able to see your profile or message you. They won't be notified.</p>`,
          foot: `<button class="btn btn-primary btn-block" style="background:var(--error)" data-yes>Block</button>`,
          onMount(root, close) {
            $("[data-yes]", root).onclick = () => {
              const s = Store.get(); s.blocked.push(p.id); Store.save();
              close(); closeParent && closeParent(); toast(`${p.first} is blocked`);
              document.dispatchEvent(new CustomEvent("demo:changed"));
            };
          },
        });
      } },
    ]);
  }

  /* ---------- Connecting ---------- */
  function ensureThread(id) {
    const s = Store.get();
    if (!s.threads[id]) s.threads[id] = { with: id, messages: [], createdAt: Date.now() };
    return s.threads[id];
  }
  function connect(id, { silent = false } = {}) {
    const s = Store.get();
    const p = person(id);
    if (s.connected.includes(id)) return;
    if (p.mutual || p.likesYou) {
      s.connected.push(id);
      s.pending = s.pending.filter((x) => x !== id);
      if (p.likesYou && !s.likesHandled.includes(id)) s.likesHandled.push(id);
      const t = ensureThread(id);
      if (s._pendingNote && s._pendingNote.id === id && s._pendingNote.text) t.messages.push({ from: "me", text: s._pendingNote.text });
      delete s._pendingNote;
      Store.save();
      refreshTabbar();
      if (!silent) connectionMoment(p);
    } else {
      if (!s.pending.includes(id)) s.pending.push(id);
      if (s._pendingNote && s._pendingNote.id === id) delete s._pendingNote;
      Store.save();
      if (!silent) toast(`Sent. We'll let you know if ${p.first} connects back.`);
    }
    document.dispatchEvent(new CustomEvent("demo:changed"));
  }

  function connectionMoment(p) {
    const me = person("me");
    const shared = p.goals.find((g) => me.goals.includes(g));
    const line = shared ? D.goalPhrase[shared] : "You're both here to meet people who build.";
    const tile = (x) => `<div class="tile ${x === me ? "left" : "right"}"><span class="mono" data-tint="${x.tint || 1}">${initials(x)}</span>${x.photo ? `<img src="${x.photo}" alt="${esc(fullName(x))}">` : ""}</div>`;
    page({
      fade: true, noHeader: true,
      html: `<div class="moment">
        <div class="pair">${tile(me)}${tile(p)}</div>
        <h1 class="display">You and ${esc(p.first)} connected.</h1>
        <div class="underline"></div>
        <p class="muted" style="margin:0">${esc(line)}</p>
      </div>`,
      foot: `<div style="display:grid;gap:8px;width:100%"><button class="btn btn-primary btn-block" data-hi>Say hi</button><button class="btn btn-ghost" data-keep>Keep swiping</button></div>`,
      cls: "moment-page",
      onMount(root, close) {
        root.querySelector(".page-foot").style.borderTop = "0";
        setTimeout(() => $(".moment", root).classList.add("go"), 120);
        $("[data-hi]", root).onclick = () => (location.href = `messages.html?c=${p.id}`);
        $("[data-keep]", root).onclick = close;
      },
    });
  }

  /* ---------- Forum helpers used across tabs ---------- */
  function allPosts() {
    const s = Store.get();
    return [...s.myPosts, ...D.posts];
  }
  const typeName = (t) => ({ question: "Question", opportunity: "Opportunity", study: "Study group", post: "Post" }[t] || "Post");

  /* ---------- Deck preferences (sheet + onboarding) ---------- */
  const prefLabels = { goals: "Goals", major: "Major / field", year: "Year" };
  const prefOptions = () => ({ goals: D.goalsAll, major: D.majors, year: D.years });
  function prefsHTML() {
    const s = Store.get();
    return `<div data-prefs>${s.prefs.order.map((k, i) => `<div class="reorder-row" data-key="${k}">
        <span class="rank">${i + 1}</span>
        <div class="grow" data-edit="${k}"><div style="font-weight:500">${prefLabels[k]}</div><div class="meta truncate">${esc(s.prefs[k].join(", ") || "Anyone")}</div></div>
        <span class="handle" aria-label="Drag to reorder">${icon("grip-vertical")}</span>
      </div>`).join("")}</div>`;
  }
  function bindPrefs(root) {
    const list = $("[data-prefs]", root);
    const rerender = () => { list.outerHTML = prefsHTML(); icons(); bindPrefs(root); };
    if (window.Sortable) {
      Sortable.create(list, {
        handle: ".handle", animation: 180,
        onEnd() {
          Store.get().prefs.order = $$(".reorder-row", list).map((r) => r.dataset.key);
          Store.save(); rerender();
        },
      });
    }
    $$("[data-edit]", list).forEach((row) => (row.onclick = () => {
      const k = row.dataset.edit;
      chipPicker({ title: prefLabels[k], options: prefOptions()[k], selected: Store.get().prefs[k], onSave(sel) { Store.get().prefs[k] = sel; Store.save(); rerender(); } });
    }));
  }
  function openPrefs() {
    sheet({
      title: "Who do you want to meet first?",
      body: `<p class="muted" style="margin-top:0">We'll show these people first, and still mix in others. Drag to rank what matters most.</p>${prefsHTML()}`,
      foot: `<button class="btn btn-primary btn-block" data-save>Save</button>`,
      onMount(root, close) { bindPrefs(root); $("[data-save]", root).onclick = () => { close(); toast("Saved"); }; },
    });
  }

  function chipPicker({ title, options, selected = [], max = 0, onSave }) {
    let sel = selected.slice();
    sheet({
      title,
      body: `${max ? `<p class="muted" style="margin-top:0">Pick up to ${max}.</p>` : ""}<div class="chips">${options.map((o) => `<button class="chip lg ${sel.includes(o) ? "is-on" : ""}" data-o="${esc(o)}">${sel.includes(o) ? icon("check") : ""}${esc(o)}</button>`).join("")}</div>`,
      foot: `<button class="btn btn-primary btn-block" data-save>Save</button>`,
      onMount(root, close) {
        $$("[data-o]", root).forEach((b) => (b.onclick = () => {
          const o = b.dataset.o;
          if (sel.includes(o)) sel = sel.filter((x) => x !== o);
          else { if (max && sel.length >= max) { toast(`Pick up to ${max}`); return; } sel.push(o); }
          b.classList.toggle("is-on", sel.includes(o));
          b.innerHTML = (sel.includes(o) ? icon("check") : "") + esc(o); icons();
        }));
        $("[data-save]", root).onclick = () => { close(); onSave(sel); };
      },
    });
  }

  /* ---------- Experience Translator (full-screen flow) ---------- */
  function openTranslator({ onSave } = {}) {
    const T = D.translator;
    const st = { type: null, role: "", org: "", start: "", end: "Current", text: "", variant: "base", show: true };
    let pg;
    const steps = ["type", "basics", "describe", "loading", "results"];
    let i = 0;

    function render() {
      const step = steps[i];
      const scr = $(".screen", pg.root), foot = $(".page-foot", pg.root);
      foot.style.display = step === "loading" ? "none" : "";
      if (step === "type") {
        scr.innerHTML = `<div class="pad" style="padding-top:8px"><h1 class="display" style="margin-bottom:24px">What kind of experience is it?</h1>
          ${T.types.map((t) => `<button class="type-row ${st.type === t.id ? "is-on" : ""}" data-type="${t.id}">${icon(t.icon)}${t.label}</button>`).join("")}</div>`;
        foot.innerHTML = `<button class="btn btn-primary btn-block" data-next ${st.type ? "" : "disabled"}>Continue</button>`;
        $$("[data-type]", scr).forEach((b) => (b.onclick = () => { st.type = b.dataset.type; render(); }));
      } else if (step === "basics") {
        scr.innerHTML = `<div class="pad" style="padding-top:8px"><h1 class="display" style="margin-bottom:24px">The basics.</h1>
          <label class="field"><span>Role or title</span><input class="input" data-f="role" placeholder="e.g., Barista" value="${esc(st.role)}"></label>
          <label class="field"><span>Organization or class</span><input class="input" data-f="org" placeholder="e.g., Campus Coffee Co." value="${esc(st.org)}"></label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <label class="field"><span>Start</span><input class="input" data-f="start" placeholder="Aug 2025" value="${esc(st.start)}"></label>
            <label class="field"><span>End</span><input class="input" data-f="end" placeholder="Current" value="${esc(st.end)}"></label>
          </div>
          <button class="link" data-fill>Use the demo example</button></div>`;
        foot.innerHTML = `<button class="btn btn-primary btn-block" data-next>Continue</button>`;
        const sync = () => { $$("[data-f]", scr).forEach((x) => (st[x.dataset.f] = x.value)); $("[data-next]", foot).disabled = !st.role.trim(); };
        $$("[data-f]", scr).forEach((x) => (x.oninput = sync));
        $("[data-fill]", scr).onclick = () => { Object.assign(st, { role: "Barista", org: "Campus Coffee Co.", start: "Aug 2025", end: "Current" }); render(); };
        sync();
      } else if (step === "describe") {
        scr.innerHTML = `<div class="pad" style="padding-top:8px"><h1 class="display" style="margin-bottom:16px">Tell us what you did, in your own words.</h1>
          <textarea class="textarea" data-text style="min-height:180px" placeholder="Don't worry about sounding professional. That's our job.">${esc(st.text)}</textarea>
          <p class="hint" data-hint>${T.hints[0]}</p>
          <button class="link" data-example>See an example</button></div>`;
        foot.innerHTML = `<button class="btn btn-primary btn-block" data-next ${st.text.trim() ? "" : "disabled"}>${icon("wand-sparkles")}Translate</button>`;
        const ta = $("[data-text]", scr);
        ta.oninput = () => { st.text = ta.value; $("[data-next]", foot).disabled = !st.text.trim(); };
        $("[data-example]", scr).onclick = () => { st.text = T.example; ta.value = T.example; ta.oninput(); };
        let h = 0; const hint = $("[data-hint]", scr);
        const iv = setInterval(() => { if (!document.body.contains(hint)) return clearInterval(iv); h = (h + 1) % T.hints.length; hint.textContent = T.hints[h]; }, 2600);
      } else if (step === "loading") {
        scr.innerHTML = `<div class="pad" style="display:grid;place-items:center;height:100%;text-align:center"><div style="width:100%"><h1 class="title">Finding the right words…</h1><div class="progress-line"><i></i></div></div></div>`;
        setTimeout(() => { i++; render(); }, 1500);
      } else if (step === "results") {
        const bullets = T.variants[st.variant];
        scr.innerHTML = `<div class="pad" style="padding-top:8px;padding-bottom:24px">
          <div class="overline">Your experience, translated</div>
          <h1 class="title" style="margin-bottom:4px">${esc(st.role || "Barista")}</h1>
          <div class="meta" style="margin-bottom:16px">${esc(st.org || "Campus Coffee Co.")} · ${esc(st.start || "Aug 2025")} – ${esc(st.end || "Current")}</div>
          <div class="card"><ul class="bullets" data-bullets>${bullets.map((b) => `<li><span contenteditable="true">${esc(b)}</span></li>`).join("")}</ul></div>
          <div class="section" style="margin-top:24px"><div class="overline">Skills shown</div><div class="chips">${T.skills.map((s) => `<span class="chip static static-on">${esc(s)}</span>`).join("")}</div></div>
          <div class="section" style="margin-top:24px"><div class="overline">Refine</div><div class="chips">
            ${[["shorter", "Shorter"], ["detail", "More detail"], ["leadership", "Emphasize leadership"], ["technical", "Emphasize technical skills"]].map(([k, l]) => `<button class="chip ${st.variant === k ? "is-on" : ""}" data-variant="${k}">${l}</button>`).join("")}
          </div></div>
          <details class="card" style="margin-top:24px"><summary class="overline" style="margin:0;cursor:pointer">Your words</summary><p class="serif" style="font-style:var(--prompt-style);font-weight:var(--prompt-weight);color:var(--ink-muted);margin:8px 0 0">${esc(st.text)}</p></details>
          <div class="list-row" style="margin-top:16px;border:0"><div class="grow"><div style="font-weight:500">Show on my profile</div><div class="meta">Connections and people you meet will see this</div></div><label class="switch"><input type="checkbox" data-show ${st.show ? "checked" : ""}><span></span></label></div>
        </div>`;
        foot.innerHTML = `<button class="btn btn-secondary" data-copy>${icon("copy")}Copy</button><button class="btn btn-primary" data-save>Save experience</button>`;
        $$("[data-variant]", scr).forEach((b) => (b.onclick = () => {
          st.variant = st.variant === b.dataset.variant ? "base" : b.dataset.variant;
          const ul = $("[data-bullets]", scr); ul.classList.add("swap");
          setTimeout(() => { const y = scr.scrollTop; render(); $(".screen", pg.root).scrollTop = y; }, 220);
        }));
        $("[data-show]", scr).onchange = (e) => (st.show = e.target.checked);
        const current = () => $$("[data-bullets] [contenteditable]", scr).map((x) => x.textContent.trim()).filter(Boolean);
        $("[data-copy]", foot).onclick = () => {
          const text = current().map((b) => "• " + b).join("\n");
          (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).catch(() => {}).finally(() => toast("Copied, ready for your resume"));
        };
        $("[data-save]", foot).onclick = () => {
          const exp = { role: st.role || "Barista", org: st.org || "Campus Coffee Co.", dates: `${st.start || "Aug 2025"} – ${st.end || "Current"}`, bullets: current(), skills: T.skills.slice(), visible: st.show };
          const s = Store.get(); s.me.experiences.unshift(exp); Store.save();
          pg.close(); toast("Experience saved");
          onSave && onSave(exp);
        };
      }
      const next = $("[data-next]", foot);
      if (next) next.onclick = () => { i++; render(); };
      $(".appbar .spacer", pg.root).textContent = step === "results" || step === "loading" ? "" : `Step ${i + 1} of 3`;
      icons();
    }

    pg = page({ title: "", cls: "sand-page", foot: " ", right: `<button class="icon-btn" data-x aria-label="Close">${icon("x")}</button>`,
      onMount(root, close) {
        $("[data-back]", root).onclick = () => { if (i === 0 || steps[i] === "results") close(); else { i--; if (steps[i] === "loading") i--; render(); } };
        $("[data-x]", root).onclick = close;
      } });
    render();
    return pg;
  }

  function swipeCardHTML(p, behind) {
    const pr = p.prompts[0];
    return `<article class="swipe-card ${behind ? "is-behind" : ""}" data-id="${p.id}">
      <span class="swipe-label pass">Pass</span><span class="swipe-label connect">Connect</span>
      ${avatar(p, "lg")}
      <h2 class="display" style="margin-top:16px">${esc(fullName(p))}</h2>
      <div class="meta" style="margin:4px 0 16px">${esc(p.year)} · ${esc(p.major)}</div>
      <div class="titles"><div><div class="overline">Now</div><div>${esc(p.now)}</div></div><div><div class="overline">Dream</div><div>${esc(p.dream)}</div></div></div>
      <div class="chips" style="margin:16px 0 12px">${p.goals.map((g) => `<span class="chip static">${esc(g)}</span>`).join("")}</div>
      <p class="bio" style="margin:0 0 16px">${esc(p.bio)}</p>
      ${pr ? `<p class="prompt-q">${esc(pr.q)}</p><p style="margin:0">${esc(pr.a)}</p>` : ""}
      <div class="fade-out"><span>${icon("chevrons-down")}Tap for full profile</span></div>
    </article>`;
  }

  /* ---------- Prompt picker + answer (onboarding + profile) ---------- */
  function pickPrompt({ exclude = [], onPick }) {
    sheet({
      title: "Choose a prompt",
      body: Object.entries(D.promptLibrary).map(([group, list]) => `<div class="overline" style="margin-top:16px">${group}</div>
        ${list.filter((q) => !exclude.includes(q)).map((q) => `<button class="list-row" data-q="${esc(q)}"><span class="grow prompt-q" style="margin:0;font-size:17px">${esc(q)}</span>${icon("chevron-right", 'class="chev"')}</button>`).join("")}`).join(""),
      onMount(root, close) { $$("[data-q]", root).forEach((b) => (b.onclick = () => { close(); setTimeout(() => answerPrompt({ q: b.dataset.q, onSave: onPick }), 200); })); },
    });
  }
  function answerPrompt({ q, a = "", onSave, onRemove }) {
    sheet({
      full: true, title: "",
      body: `<p class="prompt-q" style="font-size:24px;margin:8px 0 16px">${esc(q)}</p>
        <textarea class="textarea" data-a maxlength="200" style="min-height:160px" placeholder="Write your answer…">${esc(a)}</textarea>
        <div class="counter"><span data-n>${a.length}</span>/200</div>
        <p class="hint">${icon("lightbulb", 'style="width:14px;height:14px;vertical-align:-2px"')} Strong answers mention what you did and what changed because of it.</p>
        ${onRemove ? `<button class="btn btn-ghost" style="color:var(--error);padding:0" data-remove>Remove prompt</button>` : ""}`,
      foot: `<button class="btn btn-primary btn-block" data-save ${a ? "" : "disabled"}>Save</button>`,
      onMount(root, close) {
        const ta = $("[data-a]", root), save = $("[data-save]", root);
        ta.oninput = () => { $("[data-n]", root).textContent = ta.value.length; save.disabled = !ta.value.trim(); };
        save.onclick = () => { close(); onSave({ q, a: ta.value.trim() }); };
        const rm = $("[data-remove]", root); if (rm) rm.onclick = () => { close(); onRemove(); };
        setTimeout(() => ta.focus(), 350);
      },
    });
  }

  /* ---------- Expose ---------- */
  window.App = {
    D, Store, $, $$, esc, icon, icons, param, person, fullName, initials, avatar, isConnected, isPending,
    init, toast, sheet, actionSheet, page, refreshTabbar,
    profileBody, expHTML, openProfile, openResume, reportBlock, connect, connectionMoment, ensureThread,
    allPosts, typeName, prefsHTML, bindPrefs, openPrefs, chipPicker, openTranslator, pickPrompt, answerPrompt, swipeCardHTML,
  };
})();
