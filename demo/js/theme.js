/* Theme switcher for the design review. Loaded in <head>, before the body
   paints, so the saved theme applies without a flash of the default palette.
   This is a demo control only; none of the product code reads from it. */
(function () {
  var KEY = "pia-demo-theme";

  var THEMES = [
    { id: "editorial",  name: "Editorial",  note: "Current, serif",   sw: ["#F7F3EC", "#2F4F43", "#B5654A"] },
    { id: "signal",     name: "Signal",     note: "Cool, cobalt",     sw: ["#F3F5F8", "#2B57D4", "#C2352B"] },
    { id: "nightshift", name: "Nightshift", note: "Dark, citrus",     sw: ["#131619", "#B8F04A", "#F2A65A"] },
    { id: "grove",      name: "Grove",      note: "Sage, olive",      sw: ["#EDF0E8", "#46702B", "#B23A26"] },
    { id: "court",      name: "Court",      note: "Mono, raspberry",  sw: ["#F2F2F1", "#BE2853", "#262626"] }
  ];

  var valid = THEMES.map(function (t) { return t.id; });

  function read() {
    // ?theme=signal wins over the stored choice, so a single direction can be
    // linked directly when sharing the prototype for review.
    var q = (location.search.match(/[?&]theme=([a-z]+)/) || [])[1];
    if (valid.indexOf(q) > -1) return q;
    var v;
    try { v = localStorage.getItem(KEY); } catch (e) { v = null; }
    return valid.indexOf(v) > -1 ? v : "editorial";
  }

  function apply(id) {
    if (id === "editorial") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
    try { localStorage.setItem(KEY, id); } catch (e) {}
    current = id;
    if (panel) paint();
  }

  var current = read();
  var panel = null;

  // Runs immediately, before <body> exists. No FOUC.
  apply(current);

  function paint() {
    Array.prototype.forEach.call(panel.querySelectorAll("button"), function (b) {
      var on = b.dataset.theme === current;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function build() {
    if (document.querySelector(".theme-switch")) return;
    panel = document.createElement("div");
    panel.className = "theme-switch";
    panel.innerHTML =
      "<h6>Design direction</h6>" +
      THEMES.map(function (t) {
        return '<button type="button" data-theme="' + t.id + '">' +
          '<span class="sw" aria-hidden="true">' +
            t.sw.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") +
          "</span>" +
          '<span class="nm">' + t.name + "<small>" + t.note + "</small></span>" +
        "</button>";
      }).join("") +
      '<p class="tip">Press <kbd>T</kbd> to cycle</p>';

    panel.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-theme]");
      if (b) apply(b.dataset.theme);
    });

    document.body.appendChild(panel);
    paint();
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "t" && e.key !== "T") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var el = document.activeElement;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    apply(valid[(valid.indexOf(current) + 1) % valid.length]);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
