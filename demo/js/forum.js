/* Forum tab: feed, filters, campus events, new post (design doc §6.3) */
(function () {
  const { D, Store, $, $$, esc, icon, icons, person, fullName, avatar } = App;
  App.init("forum");
  const screen = $("#screen");
  let filter = App.param("tag") || "all";

  const filters = [["all", "All"], ["question", "Questions"], ["opportunity", "Opportunities"], ["study", "Study groups"], ["events", "Events"], ["#CSE205", "#CSE205"], ["#startups", "#startups"], ["#internships", "#internships"]];
  if (filter.startsWith("#") && !filters.some((f) => f[0] === filter)) filters.push([filter, filter]);

  const eventCard = (e) => {
    const s = Store.get();
    const conns = e.interested.filter((id) => s.connected.includes(id)).length;
    const n = e.interested.length + e.others;
    return `<button class="event-card" data-event="${e.id}">
      <span class="date-block"><small>${e.mon}</small><b>${e.day}</b></span>
      <span style="min-width:0"><span style="display:block;font-weight:500;line-height:1.3">${esc(e.title)}</span>
      <span class="meta" style="display:block">${esc(e.place.split(",")[0])}</span>
      <span class="meta" style="display:flex;gap:4px;align-items:center;margin-top:4px">${s.eventsInterested.includes(e.id) ? `${icon("check", 'style="width:14px;height:14px;color:var(--accent)"')}You're interested` : conns ? `${conns} ${conns === 1 ? "connection" : "connections"} interested` : `${n} students interested`}</span></span>
    </button>`;
  };

  function render() {
    const s = Store.get();
    const posts = App.allPosts().filter((p) => {
      if (s.blocked.includes(p.author)) return false;
      if (filter === "all") return true;
      if (filter.startsWith("#")) return (p.tags || []).some((t) => t.toLowerCase() === filter.toLowerCase());
      return p.type === filter;
    });
    const showEvents = filter === "all" || filter === "events";
    screen.innerHTML = `<header class="appbar"><h1 class="page-title">Forum</h1><span class="spacer"></span>
        <a class="icon-btn" href="search.html" aria-label="Search">${icon("search")}</a></header>
      <div class="pad"><div class="chips scroll">${filters.map(([k, l]) => `<button class="chip ${filter === k ? "is-on" : ""}" data-filter="${esc(k)}">${esc(l)}</button>`).join("")}</div></div>
      ${showEvents && filter !== "events" ? `<section class="events-band"><div class="pad section-head"><div class="overline">Happening at ASU</div><button class="link" style="font-size:13px" data-filter="events">See all</button></div>
        <div class="chips scroll" style="padding-left:20px;padding-right:20px;margin:0">${D.events.map(eventCard).join("")}</div></section>` : ""}
      ${filter === "events" ? `<div class="pad" style="padding-top:16px;display:grid;gap:12px">${D.events.map((e) => eventCard(e).replace('class="event-card"', 'class="event-card" style="width:100%"')).join("")}</div>` :
        posts.length ? posts.map((p) => Posts.postHTML(p)).join("") : `<div class="empty"><h2 class="title">Nothing here yet.</h2><p>Be the first to post about ${esc(filter)}.</p></div>`}
      <div style="height:88px"></div>`;
    if (!$(".fab")) $(".phone").insertAdjacentHTML("beforeend", `<button class="btn btn-primary fab" data-new>${icon("pencil")}Post</button>`);
    icons();
    $$("[data-filter]").forEach((b) => (b.onclick = () => { filter = b.dataset.filter; history.replaceState(null, "", filter.startsWith("#") ? `?tag=${encodeURIComponent(filter)}` : location.pathname); render(); screen.scrollTop = 0; }));
    $$("[data-event]").forEach((b) => (b.onclick = () => openEvent(b.dataset.event)));
    Posts.bindPosts(screen, render);
    $("[data-new]").onclick = newPost;
  }

  function openEvent(id) {
    const e = D.events.find((x) => x.id === id);
    const s = Store.get();
    const on = s.eventsInterested.includes(id);
    const names = e.interested.map((pid) => person(pid).first);
    App.sheet({
      body: `<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:16px"><span class="date-block" style="width:56px"><small>${e.mon}</small><b style="font-size:26px">${e.day}</b></span>
          <div><h2 class="title" style="font-size:22px">${esc(e.title)}</h2><div class="meta">${esc(e.host)}</div></div></div>
        <div class="list-row">${icon("clock")}<span>${esc(e.time)}</span></div>
        <div class="list-row">${icon("map-pin")}<span>${esc(e.place)}</span></div>
        <p style="margin:16px 0">${esc(e.desc)}</p>
        ${names.length ? `<div class="card flat" style="display:flex;align-items:center;gap:12px"><span class="stack">${e.interested.map((pid) => avatar(person(pid), "sm")).join("")}</span>
          <span style="font-size:14px">${esc(names.slice(0, 2).join(", "))}${names.length > 2 ? ` and ${names.length - 2 + e.others} others` : ` and ${e.others} others`} are interested</span></div>` : `<p class="meta">${e.others} students are interested.</p>`}`,
      foot: `<div style="display:flex;gap:12px"><button class="btn btn-secondary" style="flex:1" data-cal>${icon("calendar-plus")}Add to calendar</button>
        <button class="btn ${on ? "btn-secondary is-on" : "btn-primary"}" style="flex:1" data-int>${on ? icon("check") + "Interested" : "I'm interested"}</button></div>`,
      onMount(root, close) {
        $("[data-cal]", root).onclick = () => App.toast("Added to your calendar");
        $("[data-int]", root).onclick = () => {
          s.eventsInterested = on ? s.eventsInterested.filter((x) => x !== id) : [...s.eventsInterested, id];
          Store.save(); close(); render();
          if (!on) App.toast(names.length ? `Nice. ${names[0]} is going too.` : "We'll remind you the day before");
        };
      },
    });
  }

  function newPost() {
    let type = "post";
    const placeholders = { post: "Share an update, a win, or some advice…", question: "What do you want to ask?", opportunity: "Describe the opportunity…", study: "What will the group work on?" };
    const tags = [];
    App.sheet({
      full: true,
      title: "New post",
      body: `<div class="chips" style="margin-bottom:16px">${[["post", "Post"], ["question", "Question"], ["opportunity", "Opportunity"], ["study", "Study group"]].map(([k, l]) => `<button class="chip ${k === type ? "is-on" : ""}" data-type="${k}">${l}</button>`).join("")}</div>
        <textarea class="textarea" data-body style="min-height:140px" placeholder="${placeholders.post}"></textarea>
        <div data-extra style="margin-top:16px"></div>
        <div class="section" style="margin-top:16px"><div class="overline">Tags</div>
          <div class="input-wrap"><span class="prefix">${icon("hash")}</span><input class="input" data-tag placeholder="Add a class code or topic, e.g. CSE 205"></div>
          <div class="chips" data-tags style="margin-top:8px"></div>
          <div class="chips" data-sugg style="margin-top:8px">${["#internships", "#resume", "#startups", "#CSE205", "#MAT265"].map((t) => `<button class="chip" data-add="${t}">${t}</button>`).join("")}</div></div>
        <button class="btn btn-ghost" style="padding:0;margin-top:16px" data-photo>${icon("image-plus")}Add photo</button>`,
      foot: `<button class="btn btn-primary btn-block" data-post disabled>Post</button>`,
      onMount(root, close) {
        const body = $("[data-body]", root), postBtn = $("[data-post]", root), extra = $("[data-extra]", root);
        let photo = false;
        const drawExtra = () => {
          extra.innerHTML = type === "opportunity"
            ? `<label class="field"><span>Role</span><input class="input" data-x="role" placeholder="e.g., Marketing intern"></label><label class="field"><span>Organization</span><input class="input" data-x="org" placeholder="e.g., Sun Devil Startup"></label><label class="field"><span>Deadline (optional)</span><input class="input" data-x="deadline" placeholder="e.g., Oct 15"></label>`
            : type === "study"
            ? `<label class="field"><span>Class code</span><input class="input" data-x="classCode" placeholder="e.g., MAT 265"></label><label class="field"><span>How often</span><input class="input" data-x="cadence" placeholder="e.g., Weekly"></label><label class="field"><span>Where</span><input class="input" data-x="where" placeholder="e.g., Hayden Library"></label>`
            : "";
        };
        const drawTags = () => { $("[data-tags]", root).innerHTML = tags.map((t) => `<button class="chip is-on" data-rm="${t}">${t}${icon("x")}</button>`).join(""); icons(); $$("[data-rm]", root).forEach((b) => (b.onclick = () => { tags.splice(tags.indexOf(b.dataset.rm), 1); drawTags(); })); };
        const addTag = (t) => { t = t.trim(); if (!t) return; if (!t.startsWith("#")) t = "#" + t.replace(/\s+/g, ""); if (!tags.includes(t)) tags.push(t); drawTags(); };
        $$("[data-type]", root).forEach((b) => (b.onclick = () => { type = b.dataset.type; $$("[data-type]", root).forEach((x) => x.classList.toggle("is-on", x === b)); body.placeholder = placeholders[type]; drawExtra(); }));
        $$("[data-add]", root).forEach((b) => (b.onclick = () => addTag(b.dataset.add)));
        $("[data-tag]", root).onkeydown = (e) => { if (e.key === "Enter") { addTag(e.target.value); e.target.value = ""; } };
        $("[data-photo]", root).onclick = (e) => { photo = !photo; e.currentTarget.innerHTML = photo ? icon("check") + "Photo added" : icon("image-plus") + "Add photo"; icons(); };
        body.oninput = () => (postBtn.disabled = !body.value.trim());
        postBtn.onclick = () => {
          const x = {}; $$("[data-x]", root).forEach((i) => (x[i.dataset.x] = i.value.trim()));
          const p = { id: "u" + Date.now(), type, author: "me", time: "now", body: body.value.trim(), tags: tags.slice(), replies: 0, helpful: 0, photo };
          if (type === "opportunity") Object.assign(p, { role: x.role || "Open role", org: x.org || "Student project", deadline: x.deadline ? `Apply by ${x.deadline}` : "Rolling" });
          if (type === "study") Object.assign(p, { classCode: (x.classCode || "CSE 205").toUpperCase(), cadence: `Meets ${(x.cadence || "weekly").toLowerCase()} · ${x.where || "Tempe campus"}`, members: ["me"] });
          Store.get().myPosts.unshift(p); Store.save();
          close(); filter = "all"; render(); screen.scrollTop = 0; App.toast("Posted");
        };
        drawExtra();
      },
    });
  }

  render();
})();
