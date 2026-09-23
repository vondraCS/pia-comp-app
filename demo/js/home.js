/* Home tab: Discover swipe deck + Likes you (design doc §6.2) */
(function () {
  const { D, Store, $, $$, esc, icon, icons, person, fullName, avatar } = App;
  App.init("home");
  const screen = $("#screen");
  let view = App.param("view") === "likes" ? "likes" : "discover";
  /* How the deck should arrive on the next render. The screen is rebuilt from
     scratch every time, so the card promoted to the top is born in its final
     position with nothing to transition from — it has to be told to animate in,
     and only when a swipe or an undo actually moved the deck. */
  let deckEnter = "";

  const deckIds = () => {
    const s = Store.get();
    return D.deck.filter((id) => !s.passed.includes(id) && !s.connected.includes(id) && !s.pending.includes(id) && !s.blocked.includes(id));
  };
  const likeIds = () => {
    const s = Store.get();
    return D.likesYou.filter((id) => !s.likesHandled.includes(id) && !s.blocked.includes(id));
  };

  const cardHTML = App.swipeCardHTML;

  function render() {
    const likes = likeIds();
    let body;
    if (view === "discover") {
      const ids = deckIds();
      if (!ids.length) {
        body = `<div class="empty" style="padding-top:96px"><h2 class="title">You've seen everyone for now.</h2>
          <p>New students join every day. Meanwhile, see what's happening in the Forum.</p>
          <a class="btn btn-secondary" href="forum.html">Go to Forum</a>
          ${Store.get().undo ? `<div style="margin-top:16px"><button class="btn btn-ghost" data-undo>${icon("undo-2")}Undo last pass</button></div>` : ""}</div>`;
      } else {
        body = `<div class="deck${deckEnter}">${ids.slice(0, 2).reverse().map((id, i, arr) => cardHTML(person(id), arr.length === 2 && i === 0)).join("")}</div>
          <div class="deck-actions">
            <button class="round-btn undo" data-undo ${Store.get().undo ? "" : "disabled"} aria-label="Undo last pass">${icon("undo-2")}</button>
            <button class="round-btn pass" data-pass aria-label="Pass">${icon("x")}</button>
            <button class="round-btn connect" data-connect aria-label="Connect">${icon("check")}</button>
          </div>`;
      }
    } else {
      body = likes.length
        ? `<div class="pad"><h2 class="title likes-head">${likes.length} ${likes.length === 1 ? "person wants" : "people want"} to connect with you.</h2>
            <div class="likes-grid">
            ${likes.map((id) => { const p = person(id); return `<button class="card like-cell" data-like="${id}">
              ${avatar(p, "lg")}
              <div class="like-name">${esc(fullName(p))}</div>
              <div class="meta">${esc(p.year)} · ${esc(p.major)}</div>
              ${p.goals[0] ? `<div class="chips card-tag"><span class="chip static static-on sm">${esc(p.goals[0])}</span></div>` : ""}</button>`; }).join("")}
            </div></div>`
        : `<div class="empty" style="padding-top:96px"><h2 class="title">No one yet.</h2><p>Great prompts get noticed. Want to polish yours?</p><a class="btn btn-secondary" href="profile.html">Edit prompts</a></div>`;
    }
    screen.innerHTML = `<header class="appbar"><span class="wordmark">SunLinks</span><span class="spacer"></span>
        <button class="icon-btn" data-prefs aria-label="Deck preferences">${icon("sliders-horizontal")}</button></header>
      <div class="pad"><div class="segmented" role="tablist">
        <button class="${view === "discover" ? "is-on" : ""}" data-view="discover">Discover</button>
        <button class="${view === "likes" ? "is-on" : ""}" data-view="likes">Likes you ${likes.length ? `<span class="badge">${likes.length}</span>` : ""}</button>
      </div></div>${body}`;
    deckEnter = "";
    icons();
    bind();
  }

  function bind() {
    App.segmented(".segmented", "home-view");
    $("[data-prefs]").onclick = App.openPrefs;
    $$("[data-view]").forEach((b) => (b.onclick = () => { view = b.dataset.view; history.replaceState(null, "", view === "likes" ? "?view=likes" : location.pathname); render(); }));
    $$("[data-undo]").forEach((b) => (b.onclick = undo));
    const pass = $("[data-pass]"), con = $("[data-connect]");
    if (pass) pass.onclick = () => decide("pass");
    if (con) con.onclick = () => decide("connect");
    const top = $$(".swipe-card:not(.is-behind)").pop();
    if (top) makeSwipeable(top);
    $$("[data-like]").forEach((c) => (c.onclick = () => {
      const id = c.dataset.like;
      App.openProfile(id, {
        ctx: "likes",
        onPass() { const s = Store.get(); s.likesHandled.push(id); Store.save(); App.refreshTabbar(); render(); App.toast(`Passed on ${person(id).first}`); },
        onConnect() { App.connect(id); render(); },
      });
    }));
  }

  function makeSwipeable(card) {
    let sx = 0, sy = 0, dx = 0, dragging = false, down = false;
    const lc = $(".swipe-label.connect", card), lp = $(".swipe-label.pass", card);
    card.onpointerdown = (e) => { down = true; dragging = false; sx = e.clientX; sy = e.clientY; dx = 0; card.style.transition = "none"; };
    card.onpointermove = (e) => {
      if (!down) return;
      dx = e.clientX - sx; const dy = e.clientY - sy;
      if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { dragging = true; card.setPointerCapture(e.pointerId); }
      if (!dragging) return;
      const rot = Math.max(-8, Math.min(8, dx / 18));
      card.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
      lc.style.opacity = Math.max(0, Math.min(1, dx / 90));
      lp.style.opacity = Math.max(0, Math.min(1, -dx / 90));
    };
    const end = () => {
      if (!down) return; down = false;
      if (!dragging) { openCard(card.dataset.id); return; }
      if (dx > 100) decide("connect");
      else if (dx < -100) decide("pass");
      else { card.style.transition = "transform 300ms var(--spring)"; card.style.transform = ""; lc.style.opacity = 0; lp.style.opacity = 0; }
    };
    card.onpointerup = end; card.onpointercancel = end;
  }

  function openCard(id) {
    App.openProfile(id, { ctx: "deck", onPass: () => decide("pass", true), onConnect: () => decide("connect", true) });
  }

  let busy = false;
  function decide(kind, instant) {
    const card = $$(".swipe-card:not(.is-behind)").pop();
    if (!card || busy) return;
    busy = true;
    const id = card.dataset.id;
    const commit = () => {
      busy = false;
      const s = Store.get();
      // App.connect dispatches demo:changed, which re-renders and would consume
      // deckEnter before the deck is rebuilt. Flag it for the render we own.
      if (kind === "pass") { s.passed.push(id); s.undo = id; Store.save(); deckEnter = " is-advancing"; render(); }
      else { s.undo = null; Store.save(); App.connect(id); deckEnter = " is-advancing"; render(); }
    };
    if (instant) return commit();
    const dir = kind === "connect" ? 1 : -1;
    $(`.swipe-label.${kind}`, card).style.opacity = 1;
    card.style.transition = "transform 380ms var(--ease), opacity 380ms";
    card.style.transform = `translateX(${dir * 480}px) rotate(${dir * 14}deg)`;
    card.style.opacity = 0;
    setTimeout(commit, 330);
  }

  function undo() {
    const s = Store.get();
    if (!s.undo) return;
    s.passed = s.passed.filter((x) => x !== s.undo);
    const who = person(s.undo).first;
    // Put the undone card back on top of the deck.
    D.deck = [s.undo, ...D.deck.filter((x) => x !== s.undo)];
    s.undo = null; Store.save();
    deckEnter = " is-returning";
    render();
    App.toast(`${who} is back`);
  }

  document.addEventListener("demo:changed", render);
  render();
})();
