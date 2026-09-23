/* Design-direction switcher, for review only. Loaded in <head>, before the
   body paints, so a non-default direction applies without a flash.

   Court is the chosen direction and lives in css/tokens.css, so it is the
   state with no data-theme attribute. The alternates in css/themes.css are
   kept for comparison.

   The panel stays hidden unless asked for, because this prototype gets shown
   in a presentation and a floating dev control would be in the way.
   Press T to show or hide it, or link one direction with ?theme=signal. */
(function () {
  var KEY = "pia-demo-theme";
  var DEFAULT = "court";

  var THEMES = [
    { id: "court",      name: "Court",      note: "Current",         sw: ["#F2F2F1", "#BE2853", "#262626"] },
    { id: "editorial",  name: "Editorial",  note: "Original, serif", sw: ["#F7F3EC", "#2F4F43", "#A85A40"] },
    { id: "signal",     name: "Signal",     note: "Cool, cobalt",    sw: ["#F3F5F8", "#2B57D4", "#C2352B"] },
    { id: "nightshift", name: "Nightshift", note: "Dark, citrus",    sw: ["#131619", "#B8F04A", "#F2A65A"] },
    { id: "grove",      name: "Grove",      note: "Sage, olive",     sw: ["#EDF0E8", "#46702B", "#B23A26"] }
  ];

  var valid = THEMES.map(function (t) { return t.id; });
  var current = DEFAULT;
  var panel = null;
  var altFontsLoaded = false;

  /* The pages only ship Court's two faces. The alternates need four more,
     which are not worth downloading unless someone actually compares them. */
  function loadAltFonts() {
    if (altFontsLoaded) return;
    altFontsLoaded = true;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2" +
      "?family=Instrument+Sans:wght@400;500;600;700" +
      "&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500" +
      "&family=Outfit:wght@400;500;600" +
      "&family=Space+Grotesk:wght@400;500;600;700" +
      "&display=swap";
    (document.head || document.documentElement).appendChild(l);
  }

  function read() {
    // ?theme=signal wins over the stored choice, so a single direction can be
    // linked directly when sharing the prototype for review.
    var q = (location.search.match(/[?&]theme=([a-z]+)/) || [])[1];
    if (valid.indexOf(q) > -1) return q;
    var v;
    try { v = localStorage.getItem(KEY); } catch (e) { v = null; }
    return valid.indexOf(v) > -1 ? v : DEFAULT;
  }

  function apply(id) {
    if (id === DEFAULT) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      loadAltFonts();
      document.documentElement.setAttribute("data-theme", id);
    }
    try { localStorage.setItem(KEY, id); } catch (e) {}
    current = id;
    if (panel) paint();
  }

  // Runs immediately, before <body> exists. No flash of the wrong direction.
  apply(read());

  function paint() {
    Array.prototype.forEach.call(panel.querySelectorAll("button"), function (b) {
      var on = b.dataset.theme === current;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function build() {
    if (panel) return;
    loadAltFonts();
    panel = document.createElement("div");
    panel.className = "theme-switch";
    panel.hidden = true;
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
      '<p class="tip">Press <kbd>T</kbd> to hide</p>';

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
    build();
    panel.hidden = !panel.hidden;
  });

  // A linked direction is being reviewed, so show the panel straight away.
  if (/[?&]theme=/.test(location.search)) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { build(); panel.hidden = false; });
    } else { build(); panel.hidden = false; }
  }
})();
