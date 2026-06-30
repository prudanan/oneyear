/* =====================================================================
   REASONS.JS — 100 openable envelopes (the centerpiece).
   - Fills to exactly 100 if CONFIG.reasons has fewer.
   - Opened state persists in localStorage (falls back to memory).
   - Opening shows an in-envelope reveal + a focused popup + sparkles.
   ===================================================================== */
(function () {
  "use strict";

  const TOTAL = 100;
  const STORE_KEY = "anniv_reasons_opened_v1";

  const grid = document.getElementById("reasons-grid");
  const fill = document.getElementById("reasons-fill");
  const openedEl = document.getElementById("reasons-opened");
  const totalEl = document.getElementById("reasons-total");
  const resetBtn = document.getElementById("reasons-reset");

  // Build a guaranteed-100 list. Pad gently if the user wrote fewer.
  function buildReasons() {
    const src = (window.CONFIG && window.CONFIG.reasons) || [];
    const list = src.slice(0, TOTAL);
    const fillers = [
      "Just… you. All of you.",
      "For a thousand small reasons I'll never finish listing.",
      "Because every day with you adds another.",
      "For the way you make this all feel easy.",
      "Because loving you is the best thing I do."
    ];
    let i = 0;
    while (list.length < TOTAL) { list.push(fillers[i % fillers.length]); i++; }
    return list;
  }

  const reasons = buildReasons();
  const opened = new Set();

  /* ---- persistence (safe even if storage is blocked) ---- */
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) JSON.parse(raw).forEach((n) => opened.add(n));
    } catch (e) { /* private mode etc. — stay in memory */ }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...opened])); }
    catch (e) { /* ignore */ }
  }

  /* ---- popup reveal element (built once) ---- */
  const pop = document.createElement("div");
  pop.className = "reason-pop";
  pop.setAttribute("role", "dialog");
  pop.setAttribute("aria-modal", "true");
  pop.innerHTML =
    '<div class="reason-pop__card glass">' +
    '<p class="reason-pop__num"></p>' +
    '<p class="reason-pop__text"></p>' +
    '<button class="btn btn--gold" type="button">Close</button>' +
    "</div>";
  document.body.appendChild(pop);
  const popNum = pop.querySelector(".reason-pop__num");
  const popText = pop.querySelector(".reason-pop__text");
  const popClose = pop.querySelector(".btn");

  function showPopup(index) {
    popNum.textContent = "Reason " + (index + 1);
    popText.textContent = reasons[index];
    pop.classList.add("is-open");
    popClose.focus();
  }
  function hidePopup() { pop.classList.remove("is-open"); }
  popClose.addEventListener("click", hidePopup);
  pop.addEventListener("click", (e) => { if (e.target === pop) hidePopup(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pop.classList.contains("is-open")) hidePopup();
  });

  /* ---- progress ---- */
  function updateProgress() {
    const n = opened.size;
    openedEl.textContent = n;
    fill.style.width = (n / TOTAL) * 100 + "%";
  }

  /* ---- open one envelope ---- */
  function openEnvelope(envEl, index, viaUser) {
    if (envEl.classList.contains("is-opened")) {
      if (viaUser) showPopup(index);   // already open → just re-show the words
      return;
    }
    envEl.classList.add("is-opened");
    envEl.setAttribute("aria-expanded", "true");
    opened.add(index);
    save();
    updateProgress();

    if (viaUser) {
      if (window.App) {
        window.App.haptic(12);
        window.App.sparkleBurst(envEl);
        if (opened.size === TOTAL) window.App.confetti(2600);
      }
      showPopup(index);
    }
  }

  /* ---- build the grid ---- */
  function render() {
    const frag = document.createDocumentFragment();
    reasons.forEach((reason, i) => {
      const env = document.createElement("button");
      env.type = "button";
      env.className = "envelope";
      env.setAttribute("role", "listitem");
      env.setAttribute("aria-expanded", "false");
      env.setAttribute("aria-label", "Reason " + (i + 1) + " of 100. Tap to open.");
      env.innerHTML =
        '<span class="envelope__body" aria-hidden="true"></span>' +
        '<span class="envelope__flap" aria-hidden="true"></span>' +
        '<span class="envelope__seal" aria-hidden="true"></span>' +
        '<span class="envelope__reason"></span>' +
        '<span class="envelope__num" aria-hidden="true">' + (i + 1) + "</span>";
      env.querySelector(".envelope__reason").textContent = reason;

      if (opened.has(i)) {
        env.classList.add("is-opened");
        env.setAttribute("aria-expanded", "true");
      }
      env.addEventListener("click", () => openEnvelope(env, i, true));
      frag.appendChild(env);
    });
    grid.innerHTML = "";
    grid.appendChild(frag);
    updateProgress();
  }

  function reset() {
    opened.clear();
    save();
    grid.querySelectorAll(".envelope").forEach((el) => {
      el.classList.remove("is-opened");
      el.setAttribute("aria-expanded", "false");
    });
    updateProgress();
    if (window.App) window.App.haptic(20);
  }

  resetBtn.addEventListener("click", reset);

  const Reasons = {
    init() {
      totalEl.textContent = TOTAL;
      load();
      render();
    }
  };

  window.Reasons = Reasons;
})();
