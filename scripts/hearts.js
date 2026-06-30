/* =====================================================================
   HEARTS.JS — "Catch the Hearts".
   Move the basket with finger or mouse. Catch falling hearts to fill the
   love meter; misses cost you. Reach the goal to win.
   ===================================================================== */
(function () {
  "use strict";
  window.Games = window.Games || {};

  window.Games.catch = function (mount) {
    const gcfg = ((window.CONFIG.games || {}).catch) || {};
    const WIN = gcfg.winScore || 20;
    const MISS_LIMIT = gcfg.missLimit || 10;

    let score = 0, misses = 0, running = true;
    let basketX = 0.5;        // 0..1 across the stage
    let hearts = [];
    let raf = null, lastSpawn = 0, lastTime = 0;

    mount.innerHTML =
      '<div class="game-bar">' +
        '<span class="game-stat">Caught <b id="c-score">0</b>/' + WIN + "</span>" +
        '<span class="game-stat">Missed <b id="c-miss">0</b>/' + MISS_LIMIT + "</span>" +
      "</div>" +
      '<div class="catch-stage" id="c-stage" aria-label="Move the basket left and right to catch hearts">' +
        '<div class="catch-basket" id="c-basket">🧺</div>' +
      "</div>" +
      '<div class="love-meter" aria-hidden="true"><span class="love-meter__fill" id="c-meter"></span></div>' +
      '<p class="game-stat" style="text-align:center;margin-top:10px;opacity:.8">Drag anywhere on the box to move the basket</p>';

    const stage = mount.querySelector("#c-stage");
    const basket = mount.querySelector("#c-basket");
    const scoreEl = mount.querySelector("#c-score");
    const missEl = mount.querySelector("#c-miss");
    const meter = mount.querySelector("#c-meter");

    function rect() { return stage.getBoundingClientRect(); }

    function setBasket(clientX) {
      const r = rect();
      basketX = Math.max(0.06, Math.min(0.94, (clientX - r.left) / r.width));
      basket.style.left = basketX * 100 + "%";
    }
    function onPointer(e) {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setBasket(x);
    }
    stage.addEventListener("pointermove", onPointer);
    stage.addEventListener("pointerdown", onPointer);
    // Keyboard support
    function onKey(e) {
      if (e.key === "ArrowLeft") { basketX = Math.max(0.06, basketX - 0.08); basket.style.left = basketX * 100 + "%"; }
      if (e.key === "ArrowRight") { basketX = Math.min(0.94, basketX + 0.08); basket.style.left = basketX * 100 + "%"; }
    }
    stage.tabIndex = 0;
    stage.addEventListener("keydown", onKey);
    basket.style.left = "50%";

    function spawn() {
      const r = rect();
      const el = document.createElement("div");
      el.className = "falling-heart";
      const kinds = ["❤️", "💗", "💕", "💞", "🩷"];
      el.textContent = kinds[Math.floor(Math.random() * kinds.length)];
      const x = 0.06 + Math.random() * 0.88;
      const h = { el, x, y: -30, speed: 90 + Math.random() * 90 }; // px/sec
      el.style.left = x * 100 + "%";
      el.style.transform = "translateY(-30px)";
      stage.appendChild(el);
      hearts.push(h);
    }

    function caught(h) {
      const r = rect();
      const heartX = h.x;
      const near = Math.abs(heartX - basketX) < 0.12;
      const atBottom = h.y > r.height - 70;
      return near && atBottom;
    }

    function tick(now) {
      if (!running) return;
      if (!lastTime) lastTime = now;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (now - lastSpawn > 700) { spawn(); lastSpawn = now; }

      const r = rect();
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y += h.speed * dt;
        h.el.style.transform = "translateY(" + h.y + "px)";

        if (caught(h)) {
          h.el.remove(); hearts.splice(i, 1);
          score++; scoreEl.textContent = score;
          meter.style.width = Math.min(100, (score / WIN) * 100) + "%";
          if (window.App) { window.App.haptic(10); window.App.sparkleBurstAt(r.left + h.x * r.width, r.top + r.height - 50); }
          if (score >= WIN) return win();
        } else if (h.y > r.height + 10) {
          h.el.remove(); hearts.splice(i, 1);
          misses++; missEl.textContent = misses;
          score = Math.max(0, score - 1); scoreEl.textContent = score;
          meter.style.width = Math.min(100, (score / WIN) * 100) + "%";
          stage.classList.add("shake");
          setTimeout(() => stage.classList.remove("shake"), 450);
          if (misses >= MISS_LIMIT) return lose();
        }
      }
      raf = requestAnimationFrame(tick);
    }

    function cleanupHearts() { hearts.forEach((h) => h.el.remove()); hearts = []; }

    function endScreen(title, sub) {
      running = false;
      cancelAnimationFrame(raf);
      cleanupHearts();
      mount.innerHTML =
        '<div class="victory">' +
          '<p class="victory__title">' + title + "</p>" +
          '<p class="victory__sub">' + sub + "</p>" +
          '<button class="btn btn--gold" id="c-again" type="button">Play again</button>' +
        "</div>";
      mount.querySelector("#c-again").addEventListener("click", () => window.Games.catch(mount));
    }

    function win() { if (window.App) window.App.confetti(2600); endScreen("Love meter full ♥", "You caught them all."); }
    function lose() { endScreen("So close 💗", "You caught " + score + ". Try again?"); }

    raf = requestAnimationFrame(tick);

    return {
      destroy() {
        running = false;
        cancelAnimationFrame(raf);
        cleanupHearts();
        stage.removeEventListener("pointermove", onPointer);
        stage.removeEventListener("pointerdown", onPointer);
        stage.removeEventListener("keydown", onKey);
      }
    };
  };
})();
