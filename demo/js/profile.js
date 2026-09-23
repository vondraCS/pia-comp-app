/* Profile tab: my profile, Edit / Preview, Experience Translator, settings (design doc §6.6) */
(function () {
  const { D, Store, $, $$, esc, icon, icons, person, fullName, avatar } = App;
  App.init("profile");
  const screen = $("#screen");
  let mode = "edit";

  function strength(me) {
    const checks = [
      [me.goals.length > 0, "Pick your goals so the right people find you."],
      [me.bio.length > 40, "Write a few lines about yourself."],
      [me.prompts.length >= 2, "Answer one more prompt. Great prompts get noticed."],
      [me.experiences.length > 0, "Add one experience to help people understand what you've done."],
      [me.resume, "Share your resume so connections can see your background."],
    ];
    const done = checks.filter((c) => c[0]).length;
    const next = checks.find((c) => !c[0]);
    return { pct: Math.round((done / checks.length) * 100), next: next ? next[1] : "Your profile is looking strong." };
  }

  const editLink = (k) => `<button class="link" style="font-size:14px" data-edit="${k}">Edit</button>`;

  function render() {
    const me = person("me");
    const st = strength(me);
    const s = Store.get();
    const myPosts = s.myPosts.length;
    const saved = Object.values(s.postState).filter((x) => x.saved).length;
    const hidden = Object.assign({}, me, { photo: null });

    const head = `<div class="pad"><div class="profile-head">
        <header class="card-id">
          <span class="avatar-lock">${avatar(me, "xl")}<i>${icon("lock")}</i></span>
          <div class="txt">
            <h1 class="card-name">${esc(fullName(me))}</h1>
            <div class="meta card-sub">${esc(me.year)} · ${esc(me.major)}</div>
            <div class="card-tag"><span class="lock-label">${icon("eye-off")}Visible to connections only</span></div></div>
        </header>
        ${App.dataPanel([["Now", me.now], ["Dream", me.dream]])}
      </div>
      <div style="text-align:right;margin-top:8px">${editLink("basics")}</div></div>`;

    const toggle = `<div class="pad" style="margin-top:8px"><div class="segmented"><button class="${mode === "edit" ? "is-on" : ""}" data-mode="edit">${icon("pencil", 'style="width:16px;height:16px"')}Edit</button><button class="${mode === "preview" ? "is-on" : ""}" data-mode="preview">${icon("eye", 'style="width:16px;height:16px"')}Preview</button></div></div>`;

    let body;
    if (mode === "preview") {
      body = `<div class="pad" style="margin-top:16px"><p class="meta" style="margin:0 0 12px">${icon("info", 'style="width:14px;height:14px;vertical-align:-2px"')} This is what other students see before you connect. Your photo stays hidden.</p></div>
        <div class="deck" style="margin-top:0">${App.swipeCardHTML(hidden)}</div>
        <div class="pad" style="margin-top:32px"><div class="overline">Full profile</div></div>
        <div style="border-top:1px solid var(--hairline);padding-top:24px">${App.profileBody(hidden, { preview: true })}</div>`;
    } else {
      body = `<div class="pad">
        <div class="card" style="margin-top:16px"><div style="display:flex;justify-content:space-between"><span class="overline" style="margin:0">Profile strength</span><span class="meta">${st.pct}%</span></div>
          <div class="strength"><i style="width:${st.pct}%"></i></div><div class="meta">${esc(st.next)}</div></div>

        <div class="section"><div class="section-head"><div class="overline">Goals</div>${editLink("goals")}</div>
          <div class="chips">${me.goals.map((g) => `<span class="chip static static-on">${esc(g)}</span>`).join("")}</div></div>

        <div class="section"><div class="section-head"><div class="overline">About</div>${editLink("bio")}</div><p style="margin:0">${esc(me.bio)}</p></div>

        <div class="section"><div class="section-head"><div class="overline">Prompts</div>${me.prompts.length < 3 ? `<button class="link" style="font-size:14px" data-add-prompt>Add</button>` : ""}</div>
          ${me.prompts.map((p, i) => `<button class="card" data-prompt="${i}" style="display:block;width:100%;text-align:left"><p class="prompt-q">${esc(p.q)}</p><p style="margin:0">${esc(p.a)}</p></button>`).join("")}
          ${me.prompts.length < 2 ? `<button class="prompt-slot" data-add-prompt style="margin-top:12px">${icon("plus")}Choose a prompt</button>` : ""}</div>

        <div class="section"><div class="overline">Experiences</div>
          ${me.experiences.length ? `<div class="card list">${me.experiences.map((e, i) => App.expHTML(e).replace('<div class="exp">', `<div class="exp" data-exp="${i}">`).replace("</h4>", `</h4>${e.visible === false ? '<span class="meta">Hidden from profile</span>' : ""}`)).join("")}</div>` : ""}
          <button class="add-row" data-translate><span class="plus">${icon("plus")}</span><span><b style="font-weight:500">Add experience</b><div class="meta">We'll help you put it into words.</div></span></button></div>

        <div class="section"><div class="section-head"><div class="overline">Resume</div></div>
          <div class="card" style="display:flex;align-items:center;gap:12px">
            <button class="doc-card" data-resume style="flex:1"><span class="doc-ico">${icon("file-text")}</span><span><b style="font-weight:500">Resume</b><div class="meta">PDF · Updated Sep 2026</div></span></button>
            <label class="switch" title="Show on my profile"><input type="checkbox" data-resume-toggle ${me.resume ? "checked" : ""}><span></span></label></div>
          <div class="meta" style="margin-top:6px">${me.resume ? "Shown on your profile" : "Hidden from your profile"}</div></div>

        <div class="section"><div class="overline">My activity</div>
          <div class="card list">
            <button class="list-row" data-activity="posts">${icon("pen-line")}<span class="grow">My posts</span><span class="meta">${myPosts}</span>${icon("chevron-right", 'class="chev"')}</button>
            <button class="list-row" data-activity="saved">${icon("bookmark")}<span class="grow">Saved</span><span class="meta">${saved}</span>${icon("chevron-right", 'class="chev"')}</button>
          </div></div>
        <div style="height:32px"></div></div>`;
    }

    screen.innerHTML = `<header class="appbar"><h1 class="page-title">Profile</h1><span class="spacer"></span><button class="icon-btn" data-settings aria-label="Settings">${icon("settings")}</button></header>
      ${head}${toggle}${body}`;
    icons();
    bind();
  }

  function saveMe(patch, msg = "Saved") { Object.assign(Store.get().me, patch); Store.save(); render(); App.refreshTabbar(); App.toast(msg); }

  function bind() {
    const me = Store.get().me;
    App.segmented(".segmented", "profile-mode");
    $("[data-settings]").onclick = settings;
    $$("[data-mode]").forEach((b) => (b.onclick = () => { mode = b.dataset.mode; render(); }));
    $$("[data-edit]").forEach((b) => (b.onclick = () => {
      const k = b.dataset.edit;
      if (k === "goals") App.chipPicker({ title: "What brings you here?", options: D.goalsAll, selected: me.goals, max: 3, onSave: (goals) => saveMe({ goals }) });
      if (k === "bio") editBio();
      if (k === "basics") editBasics();
    }));
    $$("[data-add-prompt]").forEach((b) => (b.onclick = () => App.pickPrompt({ exclude: me.prompts.map((p) => p.q), onPick: (p) => saveMe({ prompts: [...me.prompts, p] }) })));
    $$("[data-prompt]").forEach((b) => (b.onclick = () => {
      const i = +b.dataset.prompt, pr = me.prompts[i];
      App.answerPrompt({ q: pr.q, a: pr.a, onSave: (np) => { me.prompts[i] = np; saveMe({}); }, onRemove: () => { me.prompts.splice(i, 1); saveMe({}, "Prompt removed"); } });
    }));
    const tr = $("[data-translate]"); if (tr) tr.onclick = () => App.openTranslator({ onSave: render });
    $$("[data-exp]").forEach((el) => (el.onclick = () => App.actionSheet([
      { label: "Copy bullets", icon: "copy", fn: () => { const e = me.experiences[+el.dataset.exp]; (navigator.clipboard ? navigator.clipboard.writeText(e.bullets.map((b) => "• " + b).join("\n")) : Promise.reject()).catch(() => {}).finally(() => App.toast("Copied, ready for your resume")); } },
      { label: me.experiences[+el.dataset.exp].visible === false ? "Show on profile" : "Hide from profile", icon: "eye", fn: () => { const e = me.experiences[+el.dataset.exp]; e.visible = e.visible === false; saveMe({}); } },
      { label: "Delete experience", icon: "trash-2", danger: true, fn: () => { me.experiences.splice(+el.dataset.exp, 1); saveMe({}, "Experience deleted"); } },
    ])));
    const r = $("[data-resume]"); if (r) r.onclick = () => App.openResume(person("me"));
    const rt = $("[data-resume-toggle]"); if (rt) rt.onchange = () => saveMe({ resume: rt.checked }, rt.checked ? "Resume shown on profile" : "Resume hidden");
    $$("[data-activity]").forEach((b) => (b.onclick = () => activity(b.dataset.activity)));
  }

  function editBio() {
    const me = Store.get().me;
    App.sheet({
      full: true, title: "About",
      body: `<h2 class="display" style="font-size:28px;margin:8px 0 16px">Introduce yourself in a few lines.</h2>
        <textarea class="textarea" data-bio maxlength="250" style="min-height:160px">${esc(me.bio)}</textarea><div class="counter"><span data-n>${me.bio.length}</span>/250</div>`,
      foot: `<button class="btn btn-primary btn-block" data-save>Save</button>`,
      onMount(root, close) {
        const ta = $("[data-bio]", root);
        ta.oninput = () => ($("[data-n]", root).textContent = ta.value.length);
        $("[data-save]", root).onclick = () => { close(); saveMe({ bio: ta.value.trim() }); };
      },
    });
  }

  function editBasics() {
    const me = Store.get().me;
    App.sheet({
      full: true, title: "The basics",
      body: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px">
          <label class="field"><span>First name</span><input class="input" data-f="first" value="${esc(me.first)}"></label>
          <label class="field"><span>Last name</span><input class="input" data-f="last" value="${esc(me.last)}"></label></div>
        <label class="field"><span>Major</span><input class="input" data-f="major" value="${esc(me.major)}"></label>
        <div class="field"><span>Year</span><div class="chips">${D.years.map((y) => `<button class="chip ${me.year === y ? "is-on" : ""}" data-year="${y}">${y}</button>`).join("")}</div></div>
        <label class="field"><span>Current title</span><input class="input" data-f="now" value="${esc(me.now)}"></label>
        <label class="field"><span>Dream title</span><input class="input" data-f="dream" value="${esc(me.dream)}"></label>`,
      foot: `<button class="btn btn-primary btn-block" data-save>Save</button>`,
      onMount(root, close) {
        let year = me.year;
        $$("[data-year]", root).forEach((b) => (b.onclick = () => { year = b.dataset.year; $$("[data-year]", root).forEach((x) => x.classList.toggle("is-on", x === b)); }));
        $("[data-save]", root).onclick = () => {
          const patch = { year }; $$("[data-f]", root).forEach((i) => (patch[i.dataset.f] = i.value.trim() || me[i.dataset.f]));
          close(); saveMe(patch);
        };
      },
    });
  }

  function activity(kind) {
    const s = Store.get();
    const list = kind === "posts" ? s.myPosts : App.allPosts().filter((p) => (s.postState[p.id] || {}).saved);
    const pg = App.page({
      title: kind === "posts" ? "My posts" : "Saved",
      html: list.length ? list.map((p) => Posts.postHTML(p)).join("") : `<div class="empty"><h2 class="title">${kind === "posts" ? "No posts yet." : "Nothing saved yet."}</h2><p>${kind === "posts" ? "Ask a question or share a win in the Forum." : "Tap the bookmark on any post to save it here."}</p><a class="btn btn-secondary" href="forum.html">Go to Forum</a></div>`,
      onMount(root) { Posts.bindPosts($(".screen", root), () => {}); },
      onClose: render,
    });
    return pg;
  }

  function settings() {
    const s = Store.get();
    const row = (ico, label, attr, right = icon("chevron-right", 'class="chev"')) => `<button class="list-row" ${attr}>${icon(ico)}<span class="grow">${label}</span>${right}</button>`;
    App.page({
      title: "Settings",
      html: `<div class="pad">
        <div class="overline" style="margin-top:8px">Account</div>
        <div class="card list">${row("mail", `ASU email<div class="meta">${esc(s.me.first.toLowerCase())}.${esc(s.me.last.toLowerCase())}@asu.edu</div>`, "data-toast='Verified ASU account'")}${row("bell", "Notifications", "data-notif")}</div>
        <div class="overline" style="margin-top:24px">Preferences</div>
        <div class="card list">${row("sliders-horizontal", "Deck preferences", "data-prefs")}${row("file-text", "Resume visibility", "data-toast='Change this from the Resume section of your profile'", `<span class="meta">${s.me.resume ? "Shown" : "Hidden"}</span>`)}${row("ban", "Blocked users", "data-blocked", `<span class="meta">${s.blocked.length}</span>`)}</div>
        <div class="overline" style="margin-top:24px">Community</div>
        <div class="card list">${row("book-open", "Community guidelines", "data-guidelines")}</div>
        <div class="card list" style="margin-top:24px">${row("log-out", "Log out", "data-logout", "")}</div>
        <div class="overline" style="margin-top:32px">Presenter</div>
        <div class="card list">${row("rotate-ccw", "Reset demo", "data-reset", "")}${row("play", "Replay onboarding", "data-onboard", "")}</div>
        <p class="meta" style="margin:12px 0 32px">Reset clears connections, messages, posts and experiences created during the demo.</p></div>`,
      onMount(root, close) {
        $$("[data-toast]", root).forEach((b) => (b.onclick = () => App.toast(b.dataset.toast)));
        $("[data-prefs]", root).onclick = App.openPrefs;
        $("[data-notif]", root).onclick = () => App.sheet({ title: "Notifications", body: ["New connections", "Messages", "Replies to my posts", "Campus events"].map((n, i) => `<div class="list-row"><span class="grow">${n}</span><label class="switch"><input type="checkbox" ${i < 3 ? "checked" : ""}><span></span></label></div>`).join("") });
        $("[data-blocked]", root).onclick = () => App.sheet({
          title: "Blocked users",
          body: s.blocked.length ? s.blocked.map((id) => `<div class="list-row">${avatar(person(id), "sm")}<span class="grow">${esc(fullName(person(id)))}</span><button class="btn btn-sm btn-secondary" data-unblock="${id}">Unblock</button></div>`).join("") : `<p class="muted">You haven't blocked anyone.</p>`,
          onMount(r, c) { $$("[data-unblock]", r).forEach((b) => (b.onclick = () => { s.blocked = s.blocked.filter((x) => x !== b.dataset.unblock); Store.save(); c(); App.toast("Unblocked"); })); },
        });
        $("[data-guidelines]", root).onclick = () => App.sheet({ title: "Community guidelines", body: `<ol style="padding-left:20px;margin-top:0"><li style="margin-bottom:8px"><b>Keep it professional.</b> This is a place to grow careers, not to date.</li><li style="margin-bottom:8px"><b>Be generous.</b> Answer questions, share opportunities, make intros.</li><li style="margin-bottom:8px"><b>Respect boundaries.</b> If someone doesn't reply, move on.</li><li><b>Report anything off.</b> Every profile and chat has Report and Block.</li></ol>` });
        $("[data-logout]", root).onclick = () => { s.onboarded = false; Store.save(); location.href = "index.html"; };
        $("[data-reset]", root).onclick = () => App.sheet({
          title: "Reset the demo?",
          body: `<p class="muted" style="margin-top:0">Everything goes back to the starting state for a fresh walkthrough.</p>`,
          foot: `<button class="btn btn-primary btn-block" data-yes>Reset demo</button>`,
          onMount(r) { $("[data-yes]", r).onclick = () => { Store.reset(); location.href = "index.html"; }; },
        });
        $("[data-onboard]", root).onclick = () => (location.href = "index.html");
      },
    });
  }

  render();
  if (App.param("translate")) App.openTranslator({ onSave: render });
})();
