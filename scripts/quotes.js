/* =====================================================================
   QUOTES.JS — "Guess Who Said It".
   Shows a quote; you guess who said it. Tracks your score.
   Quotes come from CONFIG.quotes; labels use the two names.
   ===================================================================== */
(function () {
  "use strict";
  window.Games = window.Games || {};

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  window.Games.quotes = function (mount) {
    const cfg = window.CONFIG || {};
    const meLabel = cfg.yourName || "Me";
    const herLabel = cfg.girlfriendName || "Her";
    const quotes = shuffle((cfg.quotes && cfg.quotes.length) ? cfg.quotes : [
      { text: "I think I like you more than fries, and that's saying a lot.", who: "me" }
    ]);

    let idx = 0, score = 0, answered = false;

    mount.innerHTML =
      '<div class="game-bar">' +
        '<span class="game-stat">Score <b id="q-score">0</b></span>' +
        '<span class="game-stat">Quote <b id="q-idx">1</b>/' + quotes.length + "</span>" +
      "</div>" +
      '<div class="quote-card">' +
        '<blockquote class="quote-bubble" id="q-text"></blockquote>' +
        '<div class="quote-choices">' +
          '<button class="btn btn--ghost quote-btn" id="q-me" type="button" data-who="me"></button>' +
          '<button class="btn btn--ghost quote-btn" id="q-her" type="button" data-who="her"></button>' +
        "</div>" +
        '<p class="quote-reveal" id="q-reveal" aria-live="polite"></p>' +
        '<button class="btn btn--gold" id="q-next" type="button" hidden>Next quote</button>' +
      "</div>";

    const textEl = mount.querySelector("#q-text");
    const meBtn = mount.querySelector("#q-me");
    const herBtn = mount.querySelector("#q-her");
    const revealEl = mount.querySelector("#q-reveal");
    const nextBtn = mount.querySelector("#q-next");
    const scoreEl = mount.querySelector("#q-score");
    const idxEl = mount.querySelector("#q-idx");

    meBtn.textContent = meLabel;
    herBtn.textContent = herLabel;

    function load() {
      answered = false;
      const q = quotes[idx];
      textEl.textContent = "“" + q.text + "”";
      idxEl.textContent = idx + 1;
      revealEl.textContent = "";
      revealEl.className = "quote-reveal";
      [meBtn, herBtn].forEach((b) => { b.disabled = false; b.className = "btn btn--ghost quote-btn"; });
      nextBtn.hidden = true;
    }

    function choose(who) {
      if (answered) return;
      answered = true;
      const q = quotes[idx];
      const correct = who === q.who;
      const right = q.who === "me" ? meBtn : herBtn;
      const picked = who === "me" ? meBtn : herBtn;

      right.classList.add("is-right");
      if (!correct) picked.classList.add("is-wrong");
      meBtn.disabled = herBtn.disabled = true;

      if (correct) {
        score++; scoreEl.textContent = score;
        revealEl.textContent = "Yes — that was " + (q.who === "me" ? meLabel : herLabel) + ".";
        revealEl.classList.add("is-right");
        if (window.App) { window.App.haptic(12); window.App.sparkleBurst(textEl); }
      } else {
        revealEl.textContent = "Actually, that was " + (q.who === "me" ? meLabel : herLabel) + ".";
        revealEl.classList.add("is-wrong");
        textEl.classList.add("shake");
        setTimeout(() => textEl.classList.remove("shake"), 450);
      }
      nextBtn.hidden = false;
      nextBtn.focus();
    }

    function next() {
      idx++;
      if (idx >= quotes.length) return finish();
      load();
    }

    function finish() {
      const pct = Math.round((score / quotes.length) * 100);
      if (pct >= 70 && window.App) window.App.confetti(2200);
      mount.querySelector(".quote-card").innerHTML =
        '<div class="victory">' +
          '<p class="victory__title">' + score + " / " + quotes.length + "</p>" +
          '<p class="victory__sub">You know us ' + pct + "% well 💛</p>" +
          '<button class="btn btn--gold" id="q-again" type="button">Play again</button>' +
        "</div>";
      mount.querySelector("#q-again").addEventListener("click", () => window.Games.quotes(mount));
    }

    meBtn.addEventListener("click", () => choose("me"));
    herBtn.addEventListener("click", () => choose("her"));
    nextBtn.addEventListener("click", next);

    load();
    return { destroy() {} };
  };
})();
