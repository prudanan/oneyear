/* =====================================================================
   BOUQUET.JS — "Build a Bouquet".
   Drag a flower into the vase (or simply tap it). The bouquet grows
   with each bloom. Reach the target for a finished-bouquet moment.
   Works with mouse, touch, and keyboard.
   ===================================================================== */
(function () {
  "use strict";
  window.Games = window.Games || {};

  const FLOWERS = ["🌷", "🌹", "🌻", "🌸", "💐", "🪷", "🌼"];

  window.Games.bouquet = function (mount) {
    const TARGET = ((window.CONFIG.games || {}).bouquet || {}).target || 7;
    let count = 0;
    let ghost = null, dragSym = null, startX = 0, startY = 0, moved = false, done = false;

    mount.innerHTML =
      '<div class="game-bar">' +
        '<span class="game-stat">Bouquet <b id="b-count">0</b>/' + TARGET + "</span>" +
      "</div>" +
      '<div class="bouquet-wrap">' +
        '<div class="bouquet-stage" id="b-stage" aria-label="The vase. Drop or tap flowers to add them.">' +
          '<div class="bouquet-vase"><span class="bouquet-vase__label">for you</span></div>' +
        "</div>" +
        '<div class="flower-tray" id="b-tray" aria-label="Flowers to choose from"></div>' +
        '<p class="game-stat" style="text-align:center;opacity:.8">Tap a flower, or drag it into the vase</p>' +
      "</div>";

    const stage = mount.querySelector("#b-stage");
    const tray = mount.querySelector("#b-tray");
    const countEl = mount.querySelector("#b-count");

    FLOWERS.forEach((sym) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "flower-pick";
      b.textContent = sym;
      b.setAttribute("aria-label", "Add flower " + sym);
      b.addEventListener("pointerdown", (e) => beginDrag(e, sym, b));
      b.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); addBloom(sym); }
      });
      tray.appendChild(b);
    });

    function beginDrag(e, sym, btn) {
      if (done) return;
      dragSym = sym; moved = false; startX = e.clientX; startY = e.clientY;
      ghost = document.createElement("div");
      ghost.textContent = sym;
      ghost.style.cssText = "position:fixed;z-index:120;font-size:2.4rem;pointer-events:none;transform:translate(-50%,-50%) scale(1.1);filter:drop-shadow(0 6px 10px rgba(0,0,0,.35));";
      ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px";
      document.body.appendChild(ghost);
      btn.classList.add("is-dragging");
      btn.setPointerCapture && btn.setPointerCapture(e.pointerId);

      const move = (ev) => {
        if (Math.abs(ev.clientX - startX) > 6 || Math.abs(ev.clientY - startY) > 6) moved = true;
        ghost.style.left = ev.clientX + "px"; ghost.style.top = ev.clientY + "px";
        const r = stage.getBoundingClientRect();
        const over = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
        stage.classList.toggle("is-target", over);
      };
      const up = (ev) => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
        if (ghost) { ghost.remove(); ghost = null; }
        btn.classList.remove("is-dragging");
        stage.classList.remove("is-target");
        const r = stage.getBoundingClientRect();
        const over = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
        if (!moved || over) addBloom(sym);   // tap, or dropped on the vase
        dragSym = null;
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    }

    function addBloom(sym) {
      if (done) return;
      const i = count;
      const total = TARGET;
      const bloom = document.createElement("div");
      bloom.className = "bloom";
      bloom.textContent = sym;

      // Fan the blooms in a gentle arc across the vase mouth.
      const t = total > 1 ? (i / (total - 1)) - 0.5 : 0;   // -0.5 .. 0.5
      const angle = t * 80;                                 // degrees of spread
      const left = 50 + Math.sin(angle * Math.PI / 180) * 24;
      const lift = Math.cos(angle * Math.PI / 180) * 26;
      bloom.style.left = left + "%";
      bloom.style.bottom = (96 + lift) + "px";
      bloom.style.fontSize = (1.8 + Math.random() * 0.5) + "rem";
      bloom.style.zIndex = String(10 + i);
      stage.appendChild(bloom);

      // Keep the fanned tilt after the grow-in animation finishes.
      bloom.addEventListener("animationend", () => {
        bloom.style.transform = "translateX(-50%) rotate(" + angle * 0.5 + "deg)";
      }, { once: true });

      count++;
      countEl.textContent = count;
      if (window.App) { window.App.haptic(10); window.App.sparkleBurst(stage); }

      if (count >= TARGET) finish();
    }

    function finish() {
      done = true;
      if (window.App) window.App.confetti(2600);
      const note = document.createElement("div");
      note.className = "victory";
      note.style.marginTop = "16px";
      note.innerHTML =
        '<p class="victory__title">For you, always 💐</p>' +
        '<p class="victory__sub">A whole bouquet, one bloom at a time.</p>' +
        '<button class="btn btn--ghost btn--small" id="b-reset" type="button">Start a new one</button>';
      mount.querySelector(".bouquet-wrap").appendChild(note);
      mount.querySelector("#b-reset").addEventListener("click", () => window.Games.bouquet(mount));
    }

    return { destroy() { if (ghost) ghost.remove(); } };
  };
})();
