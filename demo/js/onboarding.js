/* Onboarding: one question per screen (design doc §6.1, O1–O12) */
(function () {
  const { D, Store, $, $$, esc, icon, icons, person } = App;
  App.init();
  const screen = $("#screen");
  const s = Store.get();
  const me = s.me;
  let photoAdded = !!me.photo;

  // Each step: headline, body markup, optional bind(root, setValid) and next() hook.
  const steps = [
    { id: "welcome" },
    { id: "email", h: "What's your ASU email?",
      body: () => `<div class="input-wrap"><input class="input" data-email value="${esc(me.first.toLowerCase())}.${esc(me.last.toLowerCase())}" autocomplete="off" style="padding-right:90px"><span class="suffix">@asu.edu</span></div>
        <p class="hint">Only ASU students can join. We'll send you a one-time code.</p>`,
      bind: (r, ok) => { const i = $("[data-email]", r); i.oninput = () => ok(!!i.value.trim()); ok(true); } },
    { id: "code", h: "Enter the code we sent.",
      body: () => `<p class="muted" style="margin-top:0">Sent to ${esc(me.first.toLowerCase())}.${esc(me.last.toLowerCase())}@asu.edu</p>
        <div class="code-boxes">${[0, 1, 2, 3, 4, 5].map(() => `<input inputmode="numeric" maxlength="1">`).join("")}</div>
        <button class="link" style="margin-top:16px" data-resend>Resend code</button> <button class="link" style="margin:16px 0 0 16px" data-autofill>Fill demo code</button>`,
      bind: (r, ok) => {
        const boxes = $$(".code-boxes input", r);
        const check = () => ok(boxes.every((b) => b.value));
        boxes.forEach((b, i) => {
          b.oninput = () => { b.value = b.value.replace(/\D/g, ""); if (b.value && boxes[i + 1]) boxes[i + 1].focus(); check(); };
          b.onkeydown = (e) => { if (e.key === "Backspace" && !b.value && boxes[i - 1]) boxes[i - 1].focus(); };
        });
        $("[data-resend]", r).onclick = () => App.toast("New code sent");
        $("[data-autofill]", r).onclick = () => { "482913".split("").forEach((d, i) => (boxes[i].value = d)); check(); };
        setTimeout(() => boxes[0].focus(), 350);
      } },
    { id: "basics", h: "Let's start with the basics.",
      body: () => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label class="field"><span>First name</span><input class="input" data-f="first" value="${esc(me.first)}"></label>
          <label class="field"><span>Last name</span><input class="input" data-f="last" value="${esc(me.last)}"></label></div>
        <label class="field"><span>Major</span><input class="input" data-f="major" list="majors" value="${esc(me.major)}"></label>
        <datalist id="majors">${["Business (Entrepreneurship)", "Computer Science", "Software Engineering", "Mechanical Engineering", "Graphic Design", "Supply Chain Management", "Marketing", "Finance", "Data Science", "Public Policy", "Psychology", "Nursing"].map((m) => `<option value="${m}">`).join("")}</datalist>
        <div class="field"><span>Year</span><div class="chips">${D.years.map((y) => `<button class="chip lg ${me.year === y ? "is-on" : ""}" data-year="${y}">${y}</button>`).join("")}</div></div>`,
      bind: (r, ok) => {
        const check = () => ok($$("[data-f]", r).every((i) => i.value.trim()));
        $$("[data-f]", r).forEach((i) => (i.oninput = () => { me[i.dataset.f] = i.value.trim(); check(); }));
        $$("[data-year]", r).forEach((b) => (b.onclick = () => { me.year = b.dataset.year; $$("[data-year]", r).forEach((x) => x.classList.toggle("is-on", x === b)); }));
        check();
      } },
    { id: "titles", h: "What do you do, and where are you headed?",
      body: () => `<label class="field"><span>Current title</span><input class="input" data-f="now" placeholder="e.g., Barista, Research Assistant, Student" value="${esc(me.now)}"></label>
        <label class="field"><span>Dream title</span><input class="input" data-f="dream" placeholder="e.g., Product Designer at a startup" value="${esc(me.dream)}"></label>
        <p class="hint">Current title can be anything, even “Student.” Every job counts.</p>`,
      bind: (r, ok) => { const check = () => ok($$("[data-f]", r).every((i) => i.value.trim())); $$("[data-f]", r).forEach((i) => (i.oninput = () => { me[i.dataset.f] = i.value.trim(); check(); })); check(); } },
    { id: "goals", h: "What brings you here?", sub: "Pick up to three.",
      body: () => `<div class="chips">${D.goalsAll.map((g) => `<button class="chip lg ${me.goals.includes(g) ? "is-on" : ""}" data-g="${g}">${me.goals.includes(g) ? icon("check") : ""}${g}</button>`).join("")}</div>`,
      bind: (r, ok) => {
        $$("[data-g]", r).forEach((b) => (b.onclick = () => {
          const g = b.dataset.g;
          if (me.goals.includes(g)) me.goals = me.goals.filter((x) => x !== g);
          else if (me.goals.length >= 3) return App.toast("Pick up to three");
          else me.goals.push(g);
          b.classList.toggle("is-on", me.goals.includes(g)); b.innerHTML = (me.goals.includes(g) ? icon("check") : "") + g; icons(); ok(me.goals.length > 0);
        }));
        ok(me.goals.length > 0);
      } },
    { id: "bio", h: "Introduce yourself in a few lines.",
      body: () => `<textarea class="textarea" data-bio maxlength="250" style="min-height:150px">${esc(me.bio)}</textarea><div class="counter"><span data-n>${me.bio.length}</span>/250</div>
        <details style="margin-top:8px"><summary class="link" style="cursor:pointer">Need inspiration?</summary>
          <div class="card" style="margin-top:12px;font-size:14px">“CS junior who likes turning messy spreadsheets into tools people actually use. Looking for a mentor in product.”</div>
          <div class="card" style="font-size:14px">“Nursing student and weekend EMT. Want to meet people working on healthcare startups.”</div></details>`,
      bind: (r, ok) => { const t = $("[data-bio]", r); t.oninput = () => { me.bio = t.value; $("[data-n]", r).textContent = t.value.length; ok(!!t.value.trim()); }; ok(!!me.bio.trim()); } },
    { id: "prompts", h: "Show them what you've done.", sub: "Answer two prompts. A third is optional.",
      body: () => [0, 1, 2].map((i) => {
        const p = me.prompts[i];
        return p ? `<button class="prompt-slot filled" data-slot="${i}"><p class="prompt-q">${esc(p.q)}</p><p style="margin:0">${esc(p.a)}</p></button>`
          : i <= me.prompts.length ? `<button class="prompt-slot" data-slot="${i}">${icon("plus")}${i === 2 ? "Add an optional third prompt" : "Choose a prompt"}</button>` : "";
      }).join(""),
      bind: (r, ok, rerender) => {
        $$("[data-slot]", r).forEach((b) => (b.onclick = () => {
          const i = +b.dataset.slot, p = me.prompts[i];
          if (p) App.answerPrompt({ q: p.q, a: p.a, onSave: (np) => { me.prompts[i] = np; rerender(); }, onRemove: () => { me.prompts.splice(i, 1); rerender(); } });
          else App.pickPrompt({ exclude: me.prompts.map((x) => x.q), onPick: (np) => { me.prompts.push(np); rerender(); } });
        }));
        ok(me.prompts.length >= 2);
      } },
    { id: "photo", h: "Add a photo.", sub: "Your photo stays hidden until you both connect. People meet your work first.",
      body: () => `<button class="photo-slot" data-photo>${photoAdded ? `<img src="img/me.jpg" alt="Your photo">` : `<span style="display:grid;justify-items:center;gap:8px">${icon("camera")}<span style="font-size:14px">Add photo</span></span>`}<span class="lock">${icon("lock", 'style="width:16px;height:16px"')}</span></button>`,
      bind: (r, ok) => { $("[data-photo]", r).onclick = () => { photoAdded = true; me.photo = "img/me.jpg"; r.querySelector("[data-photo]").innerHTML = `<img src="img/me.jpg" alt="Your photo"><span class="lock">${icon("lock", 'style="width:16px;height:16px"')}</span>`; icons(); ok(true); }; ok(photoAdded); },
      skip: "Skip for now" },
    { id: "translator", sand: true, h: "Turn what you've done into words that work.",
      body: () => `<div class="card before-after" style="margin-top:8px">
          <div class="overline" style="margin:0">Your words</div>
          <div class="before">“I worked at the campus coffee shop and trained the new people.”</div>
          <div class="arrow">${icon("arrow-down")}</div>
          <div class="overline" style="margin:0">Resume-ready</div>
          <ul style="margin:0;padding-left:18px"><li>Trained and onboarded 6 new team members on store procedures.</li><li>Redesigned the morning-rush workflow, reducing wait times.</li></ul></div>
        <p class="muted">The Experience Translator helps you describe jobs, class projects, clubs and side projects the way recruiters read them.</p>`,
      primary: "Try it with one experience", skip: "Maybe later",
      onPrimary: (next) => App.openTranslator({ onSave: next }) },
    { id: "resume", h: "Want to share your resume?",
      body: () => `<button class="card doc-card" data-upload style="margin-top:8px">${me.resume ? `<span class="doc-ico">${icon("file-check")}</span><span><b style="font-weight:500">Alex_Rivera_Resume.pdf</b><div class="meta">Uploaded · tap to replace</div></span>` : `<span class="doc-ico">${icon("upload")}</span><span><b style="font-weight:500">Upload PDF</b><div class="meta">Up to 5 MB</div></span>`}</button>
        <div class="list-row" style="margin-top:12px;border:0"><span class="grow">Show on my profile</span><label class="switch"><input type="checkbox" data-show ${me.resume ? "checked" : ""}><span></span></label></div>
        <p class="hint">You can change this anytime.</p>`,
      bind: (r, ok, rerender) => { $("[data-upload]", r).onclick = () => { me.resume = true; rerender(); }; $("[data-show]", r).onchange = (e) => (me.resume = e.target.checked); ok(true); },
      skip: "Skip" },
    { id: "prefs", h: "Who do you want to meet first?", sub: "We'll show these people first, and still mix in others. Drag to rank.",
      body: () => App.prefsHTML(),
      bind: (r, ok) => { App.bindPrefs(r); ok(true); } },
    { id: "done" },
  ];

  let i = App.param("step") ? +App.param("step") : 0;

  function next() { Store.save(); i = Math.min(i + 1, steps.length - 1); render(); }
  function back() { i = Math.max(0, i - 1); render(); }

  function render() {
    const st = steps[i];
    if (st.id === "welcome") return renderWelcome();
    if (st.id === "done") return renderDone();
    const n = steps.length - 2, pct = Math.round((i / n) * 100);
    screen.innerHTML = `<div class="step ${st.sand ? "sand-page" : ""}" style="${st.sand ? "background:var(--sand)" : ""}">
      <header class="appbar" style="background:transparent"><button class="icon-btn" data-back aria-label="Back">${icon("arrow-left")}</button><span class="spacer"></span>${st.skip ? `<button class="link" data-skip>${st.skip}</button>` : ""}</header>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <div class="screen"><h1 class="display">${esc(st.h)}</h1>${st.sub ? `<p class="muted" style="margin:-4px 0 20px">${esc(st.sub)}</p>` : ""}<div data-body>${st.body()}</div></div>
      <div class="page-foot" style="${st.sand ? "background:var(--sand);" : ""}border-top:0"><button class="btn btn-primary btn-block" data-next>${st.primary || "Continue"}</button></div>
    </div>`;
    icons();
    const root = $(".step", screen), btn = $("[data-next]", root);
    const ok = (v) => (btn.disabled = !v);
    $("[data-back]", root).onclick = back;
    const sk = $("[data-skip]", root); if (sk) sk.onclick = next;
    btn.onclick = () => (st.onPrimary ? st.onPrimary(next) : next());
    const rerender = () => { $("[data-body]", root).innerHTML = st.body(); icons(); st.bind && st.bind(root, ok, rerender); };
    if (st.bind) st.bind(root, ok, rerender); else ok(true);
  }

  function renderWelcome() {
    const snippets = ["“The project I'm most proud of…”", "“My favorite internship taught me…”", "“Ask me about…”"];
    screen.innerHTML = `<div class="step">
      <div style="text-align:center;padding-top:24px" class="wordmark">[App Name]</div>
      <div class="screen" style="display:grid;align-content:center;text-align:center">
        <h1 class="display" style="font-size:40px;margin-bottom:16px">Meet the people who'll shape your career.</h1>
        <p class="muted" style="margin:0 0 28px">A professional network, built by and for ASU students.</p>
        <p class="serif" data-snippet style="font-style:italic;color:var(--ink-muted);font-size:18px;transition:opacity 500ms;margin:0">${snippets[0]}</p>
      </div>
      <div class="page-foot" style="flex-direction:column;border-top:0;gap:4px"><button class="btn btn-primary btn-block" data-start>Continue with ASU email</button><button class="btn btn-ghost" data-how>How it works</button></div>
    </div>`;
    let k = 0; const el = $("[data-snippet]", screen);
    const iv = setInterval(() => { if (!document.body.contains(el)) return clearInterval(iv); el.style.opacity = 0; setTimeout(() => { k = (k + 1) % snippets.length; el.textContent = snippets[k]; el.style.opacity = 1; }, 500); }, 2800);
    $("[data-start]", screen).onclick = next;
    $("[data-how]", screen).onclick = () => App.sheet({
      title: "How it works",
      body: [["user-round-pen", "Build a profile around what you've done", "Goals, experiences and prompts first. Your photo stays hidden until you connect."],
        ["layers", "Meet students across ASU", "Swipe to connect with people in other majors, years and campuses."],
        ["coffee", "Grab coffee", "Every connection comes with conversation starters and a nudge to meet in person."],
        ["wand-sparkles", "Put your experience into words", "The Experience Translator turns everyday work into resume-ready bullets."]]
        .map(([ic, t, d]) => `<div class="list-row" style="align-items:flex-start"><span style="color:var(--accent);margin-top:2px">${icon(ic)}</span><span class="grow"><b style="font-weight:600">${t}</b><div class="muted" style="font-size:14px">${d}</div></span></div>`).join(""),
    });
  }

  function renderDone() {
    s.onboarded = true; Store.save();
    screen.innerHTML = `<div class="step">
      <div class="screen" style="padding-top:32px"><h1 class="display">You're all set, ${esc(me.first)}.</h1>
        <p class="muted" style="margin:0 0 20px">Here's how other students will see you before you connect.</p>
        <div style="position:relative;height:430px;pointer-events:none">${App.swipeCardHTML(Object.assign({}, person("me"), { photo: null }))}</div></div>
      <div class="page-foot" style="border-top:0"><a class="btn btn-primary btn-block" href="home.html">Start meeting people</a></div>
    </div>`;
    icons();
  }

  render();
})();
