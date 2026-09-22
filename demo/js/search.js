/* Search tab: people + posts (design doc §6.4) */
(function () {
  const { D, Store, $, $$, esc, icon, icons, person, fullName, avatar } = App;
  App.init("search");
  const screen = $("#screen");
  let q = App.param("q") || "";
  let tab = "people";
  const flt = { major: [], year: [], goals: [] };

  const norm = (s) => String(s || "").toLowerCase().replace(/[\s#]/g, "");
  const hit = (fields, query) => { const n = norm(query); return fields.some((f) => norm(f).includes(n)); };
  const majorBucket = (m) => D.majors.find((b) => m.toLowerCase().includes(b.toLowerCase().split(" ")[0])) || m;

  function people() {
    const s = Store.get();
    return Object.keys(D.people).map(person).filter((p) =>
      !s.blocked.includes(p.id) &&
      hit([fullName(p), p.major, p.now, p.dream, p.bio, ...p.goals, ...(p.classes || [])], q) &&
      (!flt.major.length || flt.major.some((m) => majorBucket(p.major) === m || p.major.includes(m))) &&
      (!flt.year.length || flt.year.includes(p.year)) &&
      (!flt.goals.length || flt.goals.some((g) => p.goals.includes(g))));
  }
  function posts() {
    return App.allPosts().filter((p) => hit([p.body, ...(p.tags || []), p.classCode, p.role, p.org, App.typeName(p.type)], q));
  }

  function personRow(p) {
    const tag = App.isConnected(p.id) ? `<span class="pill-label">${icon("check")}Connected</span>` : App.isPending(p.id) ? `<span class="meta">Requested</span>` : "";
    return `<button class="list-row" data-person="${p.id}">${avatar(p)}
      <span class="grow"><span style="display:flex;justify-content:space-between;gap:8px"><span class="serif" style="font-size:18px;font-weight:500">${Posts.highlight(fullName(p), q)}</span>${tag}</span>
      <span class="truncate" style="display:block;font-size:14px">Now: ${Posts.highlight(p.now, q)} <span class="muted">→</span> ${Posts.highlight(p.dream, q)}</span>
      <span class="meta">${esc(p.year)} · ${Posts.highlight(p.major, q)}</span></span></button>`;
  }

  function render(keepFocus) {
    const s = Store.get();
    const me = person("me");
    let body;
    if (!q.trim()) {
      const suggested = Object.keys(D.people).map(person).filter((p) => p.goals.some((g) => me.goals.includes(g)) && !s.blocked.includes(p.id)).slice(0, 6);
      body = `<div class="pad">
        ${s.recentSearches.length ? `<div class="section" style="margin-top:24px"><div class="overline">Recent</div>${s.recentSearches.map((r, i) => `<div class="list-row"><span class="muted">${icon("history")}</span><button class="grow" style="text-align:left" data-q="${esc(r)}">${esc(r)}</button><button class="icon-btn" data-rm="${i}" aria-label="Remove">${icon("x")}</button></div>`).join("")}</div>` : ""}
        <div class="section" style="margin-top:24px"><div class="overline">Suggested tags</div><div class="chips">${["#internships", "#CSE205", "#startups", "#resume", "#research"].map((t) => `<button class="chip" data-q="${t}">${t}</button>`).join("")}</div></div>
        <div class="section" style="margin-top:24px"><div class="overline">People with your goals</div>
          <div class="chips scroll" style="padding-bottom:4px">${suggested.map((p) => `<button class="card" data-person="${p.id}" style="width:132px;flex:none;margin:0;text-align:left">${avatar(p)}<div class="serif" style="font-weight:500;margin-top:8px;line-height:1.2">${esc(fullName(p))}</div><div class="meta truncate">${esc(p.major)}</div></button>`).join("")}</div></div>
      </div>`;
    } else {
      const P = people(), T = posts();
      const fchip = (k, label) => `<button class="chip ${flt[k].length ? "is-on" : ""}" data-flt="${k}">${flt[k].length ? `${label}: ${esc(flt[k].length === 1 ? flt[k][0] : flt[k].length)}` : label}${icon("chevron-down")}</button>`;
      body = `<div class="pad" style="padding-top:8px"><div class="segmented">
          <button class="${tab === "people" ? "is-on" : ""}" data-tab="people">People · ${P.length}</button>
          <button class="${tab === "posts" ? "is-on" : ""}" data-tab="posts">Posts · ${T.length}</button></div></div>
        ${tab === "people"
          ? `<div class="pad"><div class="chips scroll" style="margin-top:12px">${fchip("major", "Major")}${fchip("year", "Year")}${fchip("goals", "Goals")}</div>
             ${P.length ? `<div style="margin-top:8px">${P.map(personRow).join("")}</div>` : `<div class="empty"><h2 class="title">No results for “${esc(q)}”.</h2><p>Try a class code or a major.</p></div>`}</div>`
          : T.length ? `<div style="margin-top:8px">${T.map((p) => Posts.postHTML(p, { q })).join("")}</div>` : `<div class="empty"><h2 class="title">No posts for “${esc(q)}”.</h2><p>Try a class code or a major.</p></div>`}
        <div style="height:24px"></div>`;
    }
    screen.innerHTML = `<header class="appbar" style="padding-top:12px">
        <div class="input-wrap" style="flex:1"><span class="prefix">${icon("search")}</span>
          <input class="input" data-input type="search" enterkeyhint="search" placeholder="Search people and posts" value="${esc(q)}" style="border-radius:var(--r-pill);padding-right:40px">
          ${q ? `<button class="icon-btn" data-clear style="position:absolute;right:8px" aria-label="Clear">${icon("x")}</button>` : ""}</div></header>${body}`;
    icons();
    bind();
    if (keepFocus) { const i = $("[data-input]"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  }

  function setQuery(v, save) {
    q = v;
    history.replaceState(null, "", q ? `?q=${encodeURIComponent(q)}` : location.pathname);
    if (save && q.trim()) {
      const s = Store.get();
      s.recentSearches = [q.trim(), ...s.recentSearches.filter((r) => r !== q.trim())].slice(0, 5); Store.save();
    }
  }

  function bind() {
    const input = $("[data-input]");
    input.oninput = () => { setQuery(input.value, false); render(true); };
    input.onkeydown = (e) => { if (e.key === "Enter") { setQuery(input.value, true); input.blur(); } };
    const clr = $("[data-clear]"); if (clr) clr.onclick = () => { setQuery("", false); render(true); };
    $$("[data-q]").forEach((b) => (b.onclick = () => { setQuery(b.dataset.q, true); render(); }));
    $$("[data-rm]").forEach((b) => (b.onclick = () => { Store.get().recentSearches.splice(+b.dataset.rm, 1); Store.save(); render(); }));
    $$("[data-tab]").forEach((b) => (b.onclick = () => { tab = b.dataset.tab; render(); }));
    $$("[data-person]").forEach((b) => (b.onclick = () => { if (q) setQuery(q, true); App.openProfile(b.dataset.person); }));
    $$("[data-flt]").forEach((b) => (b.onclick = () => {
      const k = b.dataset.flt;
      App.chipPicker({ title: { major: "Major", year: "Year", goals: "Goals" }[k], options: { major: D.majors, year: D.years, goals: D.goalsAll }[k], selected: flt[k], onSave(sel) { flt[k] = sel; render(); } });
    }));
    if (tab === "posts") Posts.bindPosts(screen, render);
  }

  document.addEventListener("demo:changed", () => render());
  render();
})();
