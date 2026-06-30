/* =====================================================================
   MEMORY.JS — memory match game.
   Mounts into a container, returns { destroy }. Uses love-themed
   symbols as placeholder "images" (swap for real photos if you like).
   ===================================================================== */
(function () {
  "use strict";
  window.Games = window.Games || {};

  const SYMBOLS = ["🌷", "💖", "🌙", "✨", "🕊️", "🍓", "🎀", "🌹", "☕", "📷", "🎵", "🫶"];

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  window.Games.memory = function (mount) {
    const pairs = ((window.CONFIG.games || {}).memory || {}).pairs || 8;
    let first = null, lock = false, matched = 0, moves = 0;
    let seconds = 0, timer = null, started = false;

    mount.innerHTML =
      '<div class="game-bar">' +
        '<span class="game-stat">Moves <b id="m-moves">0</b></span>' +
        '<span class="game-stat">Time <b id="m-time">0:00</b></span>' +
        '<button class="btn btn--ghost btn--small" id="m-restart" type="button">Restart</button>' +
      "</div>" +
      '<div class="memory-grid" id="m-grid" role="grid" aria-label="Memory cards"></div>';

    const grid = mount.querySelector("#m-grid");
    const movesEl = mount.querySelector("#m-moves");
    const timeEl = mount.querySelector("#m-time");

    function fmt(s) { return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); }

    function startTimer() {
      if (started) return;
      started = true;
      timer = setInterval(() => { seconds++; timeEl.textContent = fmt(seconds); }, 1000);
    }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

    function deal() {
      stopTimer(); started = false; seconds = 0; moves = 0; matched = 0; first = null; lock = false;
      movesEl.textContent = "0"; timeEl.textContent = "0:00";

      const deck = shuffle(SYMBOLS.slice(0, pairs).flatMap((s) => [s, s]));
      grid.innerHTML = "";
      deck.forEach((sym) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "mcard";
        card.setAttribute("role", "gridcell");
        card.setAttribute("aria-label", "Hidden card");
        card.innerHTML =
          '<span class="mcard__inner">' +
            '<span class="mcard__face mcard__back" aria-hidden="true">♥</span>' +
            '<span class="mcard__face mcard__front">' + sym + "</span>" +
          "</span>";
        card.dataset.sym = sym;
        card.addEventListener("click", () => flip(card));
        grid.appendChild(card);
      });
    }

    function flip(card) {
      if (lock || card.classList.contains("is-flipped") || card.classList.contains("is-matched")) return;
      startTimer();
      card.classList.add("is-flipped");
      card.setAttribute("aria-label", "Card showing " + card.dataset.sym);
      if (window.App) window.App.haptic(8);

      if (!first) { first = card; return; }

      moves++; movesEl.textContent = moves;

      if (first.dataset.sym === card.dataset.sym) {
        first.classList.add("is-matched");
        card.classList.add("is-matched");
        first.classList.add("pop"); card.classList.add("pop");
        first = null;
        matched++;
        if (window.App) window.App.haptic(14);
        if (matched === pairs) win();
      } else {
        lock = true;
        const a = first, b = card;
        setTimeout(() => {
          a.classList.remove("is-flipped"); b.classList.remove("is-flipped");
          a.setAttribute("aria-label", "Hidden card"); b.setAttribute("aria-label", "Hidden card");
          first = null; lock = false;
        }, 760);
      }
    }

    function win() {
      stopTimer();
      if (window.App) window.App.confetti(2400);
      setTimeout(() => {
        mount.innerHTML =
          '<div class="victory">' +
            '<p class="victory__title">You found every pair ♥</p>' +
            '<p class="victory__sub">' + moves + " moves · " + fmt(seconds) + "</p>" +
            '<button class="btn btn--gold" id="m-again" type="button">Play again</button>' +
          "</div>";
        mount.querySelector("#m-again").addEventListener("click", () => {
          window.Games.memory(mount); // remount fresh
        });
      }, 700);
    }

    mount.querySelector("#m-restart").addEventListener("click", deal);
    deal();

    return { destroy() { stopTimer(); } };
  };
})();
