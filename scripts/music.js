/* =====================================================================
   MUSIC.JS — background music. Starts only after the first tap
   (browsers block autoplay). Exposes window.Music for other modules.
   ===================================================================== */
(function () {
  "use strict";

  const cfg = (window.CONFIG && window.CONFIG.music) || {};
  const audio = document.getElementById("bg-music");
  const toggle = document.getElementById("music-toggle");

  let enabled = true;       // user preference
  let started = false;      // has playback begun at least once
  let baseVolume = typeof cfg.volume === "number" ? cfg.volume : 0.5;

  // No track configured → hide the control and no-op everything.
  const hasTrack = !!(cfg.src && cfg.src.trim());
  if (hasTrack) {
    audio.src = cfg.src;
    audio.volume = baseVolume;
  }

  function fadeTo(target, ms) {
    if (!hasTrack) return;
    const start = audio.volume;
    const t0 = performance.now();
    function step(now) {
      const k = Math.min(1, (now - t0) / ms);
      audio.volume = start + (target - start) * k;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const Music = {
    /* Called on the very first user tap (from the intro). */
    start() {
      if (!hasTrack || started || !enabled) { if (hasTrack) toggle.hidden = false; return; }
      audio.volume = 0;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {/* user can toggle manually */});
      started = true;
      fadeTo(baseVolume, 1400);
      toggle.hidden = false;
    },

    setEnabled(on) {
      enabled = on;
      toggle.setAttribute("aria-pressed", String(on));
      if (!hasTrack) return;
      if (on) {
        if (audio.paused) { const p = audio.play(); if (p && p.catch) p.catch(() => {}); }
        fadeTo(baseVolume, 600);
      } else {
        fadeTo(0, 500);
        setTimeout(() => { if (!enabled) audio.pause(); }, 520);
      }
    },

    toggle() { this.setEnabled(!enabled); },

    /* Dip volume for the final letter, then restore. */
    duck() { if (enabled) fadeTo(cfg.fadeOnLetter ?? baseVolume * 0.25, 1200); },
    unduck() { if (enabled) fadeTo(baseVolume, 1200); },

    isEnabled() { return enabled; }
  };

  if (toggle) {
    toggle.addEventListener("click", () => Music.toggle());
  }

  window.Music = Music;
})();
