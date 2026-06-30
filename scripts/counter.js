/* =====================================================================
   COUNTER.JS — live "time together" counter.
   Reads CONFIG.anniversaryDate, updates every second, animates ticks.
   ===================================================================== */
(function () {
  "use strict";

  const cfg = window.CONFIG || {};
  const start = new Date(cfg.anniversaryDate || Date.now()).getTime();

  const els = {
    days:    document.getElementById("count-days"),
    hours:   document.getElementById("count-hours"),
    minutes: document.getElementById("count-minutes"),
    seconds: document.getElementById("count-seconds")
  };

  // Remember last values so we only animate the digits that change.
  const last = { days: null, hours: null, minutes: null, seconds: null };

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function render() {
    let diff = Date.now() - start;
    if (diff < 0) diff = 0; // date set in the future → show zeros until it arrives

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    update("days", days, days);
    update("hours", hours, pad(hours));
    update("minutes", minutes, pad(minutes));
    update("seconds", seconds, pad(seconds));
  }

  function update(unit, raw, text) {
    if (last[unit] === raw) return;
    last[unit] = raw;
    const el = els[unit];
    if (!el) return;
    el.textContent = text;
    // Re-trigger the pop animation
    el.classList.remove("is-tick");
    void el.offsetWidth;        // force reflow so the animation restarts
    el.classList.add("is-tick");
  }

  let timer = null;
  const Counter = {
    start() {
      if (timer) return;
      render();
      // Align ticks roughly to the second boundary for a clean feel.
      timer = setInterval(render, 1000);
    },
    stop() { if (timer) { clearInterval(timer); timer = null; } }
  };

  window.Counter = Counter;
})();
