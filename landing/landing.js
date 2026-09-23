/* [App Name] landing page. No scroll listeners: IntersectionObserver only. */
(function () {
  document.documentElement.classList.add("js");
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Nav hairline once the hero top has scrolled away */
  const nav = document.querySelector(".nav");
  const hero = document.querySelector(".hero");
  new IntersectionObserver(([e]) => nav.classList.toggle("is-scrolled", !e.isIntersecting), {
    rootMargin: "-80px 0px 0px 0px", threshold: 0.98,
  }).observe(hero);

  /* Enter-on-scroll reveals */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal, #pair").forEach((el) => revealIO.observe(el));

  /* How it works: swap the sticky screen to match the step in the middle of the viewport */
  const steps = document.querySelectorAll(".step");
  const shots = document.querySelectorAll(".phone--sticky img");
  const stepIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = Number(e.target.dataset.screen);
      steps.forEach((s) => s.classList.toggle("is-current", s === e.target));
      shots.forEach((img, j) => img.classList.toggle("is-active", j === i));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => stepIO.observe(s));
  if (steps[0]) steps[0].classList.add("is-current");

  /* Experience Translator: pre-written output, same as the prototype */
  const VARIANTS = {
    base: {
      bullets: [
        "Trained and onboarded 6 new team members on drink preparation, customer service standards and store procedures.",
        "Redesigned the morning-rush workflow, reducing average wait times during peak hours.",
        "Kept quality and accuracy high while serving a steady line of customers in a fast-paced environment.",
      ],
      skills: ["Training & onboarding", "Process improvement", "Customer service", "Working under pressure"],
    },
    shorter: {
      bullets: [
        "Trained 6 new team members.",
        "Redesigned the morning-rush workflow to cut wait times.",
        "Delivered accurate, friendly service at high volume.",
      ],
      skills: ["Training & onboarding", "Process improvement", "Customer service"],
    },
    detail: {
      bullets: [
        "Trained and onboarded 6 new team members on drink preparation, customer service standards, and opening and closing procedures.",
        "Spotted recurring bottlenecks during the morning rush and redesigned station roles and order flow, reducing average wait times during peak hours.",
        "Maintained drink quality and order accuracy in a high-volume environment while supporting newer teammates on shift.",
      ],
      skills: ["Training & onboarding", "Process improvement", "Customer service", "Working under pressure", "Attention to detail"],
    },
    leadership: {
      bullets: [
        "Led onboarding for 6 new team members and became the go-to trainer for drink preparation and service standards.",
        "Took the initiative to redesign the morning-rush workflow and got the team on board, reducing average wait times.",
        "Set the pace on busy shifts, coaching newer teammates while keeping quality and accuracy high.",
      ],
      skills: ["Leadership", "Coaching", "Initiative", "Team coordination"],
    },
    technical: {
      bullets: [
        "Documented drink preparation and store procedures to standardize training for 6 new hires.",
        "Analyzed morning-rush order flow and reassigned station roles to reduce average wait times at peak hours.",
        "Operated POS and espresso equipment accurately under high order volume.",
      ],
      skills: ["Process analysis", "Workflow design", "Documentation", "POS systems"],
    },
  };

  const out = document.getElementById("tr-out");
  const go = document.getElementById("tr-go");
  const bulletsEl = document.getElementById("tr-bullets");
  const skillsEl = document.getElementById("tr-skills");
  const refine = document.querySelectorAll(".chips--refine .chip");
  const copyBtn = document.getElementById("tr-copy");
  let current = "base";
  let timer;

  function render(key) {
    const v = VARIANTS[key];
    bulletsEl.innerHTML = "";
    skillsEl.innerHTML = "";
    v.bullets.forEach((text, n) => {
      const li = document.createElement("li");
      li.textContent = text;
      li.style.setProperty("--n", n);
      bulletsEl.appendChild(li);
    });
    v.skills.forEach((text, n) => {
      const li = document.createElement("li");
      li.textContent = text;
      li.style.setProperty("--n", n + v.bullets.length);
      skillsEl.appendChild(li);
    });
  }

  function translate(key) {
    current = key;
    clearTimeout(timer);
    out.dataset.state = "loading";
    timer = setTimeout(() => {
      render(key);
      out.dataset.state = "done";
    }, reduce ? 0 : 750);
  }

  go.addEventListener("click", () => {
    translate("base");
    go.querySelector("span").textContent = "Translate again";
  });

  refine.forEach((chip) => {
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => {
      const next = chip.getAttribute("aria-pressed") === "true" ? "base" : chip.dataset.variant;
      refine.forEach((c) => c.setAttribute("aria-pressed", String(c === chip && next !== "base")));
      translate(next);
    });
  });

  copyBtn.addEventListener("click", async () => {
    const text = VARIANTS[current].bullets.map((b) => "- " + b).join("\n");
    const label = copyBtn.querySelector("span");
    try {
      await navigator.clipboard.writeText(text);
      label.textContent = "Copied";
    } catch {
      label.textContent = "Couldn't copy";
    }
    setTimeout(() => { label.textContent = "Copy bullets"; }, 1800);
  });

  /* Forum demo toggles (Interested / Join) */
  document.querySelectorAll(".js-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", String(on));
      btn.querySelector("span").textContent = on ? btn.dataset.on : btn.dataset.off;
    });
  });
})();
