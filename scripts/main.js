/* =====================================================================
   MAIN.JS — orchestrates the whole experience.
   - Applies theme + content from CONFIG
   - Ambient effects (particles, floating hearts) and shared helpers
     exposed as window.App (confetti, sparkles, haptics)
   - Intro → app reveal, view navigation, game modal, typewriter letter
   ===================================================================== */
(function () {
  "use strict";

  const CONFIG = window.CONFIG || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  /* ===================================================================
     1. APPLY THEME + CONTENT FROM CONFIG
  =================================================================== */
  function applyConfig() {
    const root = document.documentElement.style;
    const c = (CONFIG.theme && CONFIG.theme.colors) || {};
    const map = {
      "--bg-deep": c.bgDeep, "--bg-mid": c.bgMid, "--bg-rose": c.bgRose,
      "--blush": c.blush, "--gold": c.gold, "--gold-deep": c.goldDeep,
      "--cream": c.cream, "--ink": c.ink
    };
    Object.keys(map).forEach((k) => { if (map[k]) root.setProperty(k, map[k]); });

    const f = (CONFIG.theme && CONFIG.theme.fonts) || {};
    if (f.display) root.setProperty("--font-display", f.display);
    if (f.body) root.setProperty("--font-body", f.body);

    // Names + copy
    const name = CONFIG.girlfriendName || "love";
    const herName = $("#her-name"); if (herName) herName.textContent = name;
    const sub = $("#intro-subtitle"); if (sub && CONFIG.introSubtitle) sub.textContent = CONFIG.introSubtitle;

    // theme-color meta to match deep background
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && c.bgDeep) meta.setAttribute("content", c.bgDeep);
  }

  /* ===================================================================
     2. SHARED EFFECTS  →  window.App
  =================================================================== */

  // --- haptics ---
  function haptic(ms) { try { if (navigator.vibrate && !reduceMotion) navigator.vibrate(ms); } catch (e) {} }

  // --- sparkle burst at an element or coords ---
  function sparkleAt(x, y) {
    if (reduceMotion) return;
    const n = 7;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.textContent = "✦";
      const ang = (Math.PI * 2 * i) / n + Math.random();
      const dist = 26 + Math.random() * 30;
      s.style.cssText =
        "position:fixed;left:" + x + "px;top:" + y + "px;z-index:90;pointer-events:none;" +
        "color:var(--gold);font-size:" + (10 + Math.random() * 10) + "px;" +
        "transform:translate(-50%,-50%);transition:transform .6s cubic-bezier(.22,1,.36,1),opacity .6s;";
      document.body.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = "translate(" + (Math.cos(ang) * dist - 0) + "px," + (Math.sin(ang) * dist) + "px) translate(-50%,-50%) scale(0.4) rotate(120deg)";
        s.style.opacity = "0";
      });
      setTimeout(() => s.remove(), 650);
    }
  }
  function sparkleBurst(el) {
    const r = el.getBoundingClientRect();
    sparkleAt(r.left + r.width / 2, r.top + r.height / 2);
  }

  // --- confetti (canvas) ---
  const confettiCanvas = $("#confetti-canvas");
  const cctx = confettiCanvas.getContext("2d");
  let confettiParts = [], confettiRAF = null, confettiUntil = 0;

  function sizeConfetti() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    confettiCanvas.width = innerWidth * dpr;
    confettiCanvas.height = innerHeight * dpr;
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function confettiColors() {
    const cs = getComputedStyle(document.documentElement);
    return ["--gold", "--bg-rose", "--blush", "--cream", "--gold-deep"]
      .map((v) => cs.getPropertyValue(v).trim() || "#F2C879");
  }
  function confetti(duration) {
    if (reduceMotion) return;
    sizeConfetti();
    const colors = confettiColors();
    const count = 120;
    for (let i = 0; i < count; i++) {
      confettiParts.push({
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight * 0.4,
        r: 4 + Math.random() * 7,
        c: colors[Math.floor(Math.random() * colors.length)],
        vx: -2 + Math.random() * 4,
        vy: 2 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
        shape: Math.random() < 0.5 ? "rect" : "circle"
      });
    }
    confettiUntil = performance.now() + (duration || 2000);
    if (!confettiRAF) confettiRAF = requestAnimationFrame(confettiTick);
  }
  function confettiTick(now) {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    const spawning = now < confettiUntil;
    confettiParts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.rot += p.vr;
      cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.rot);
      cctx.fillStyle = p.c; cctx.globalAlpha = 0.92;
      if (p.shape === "rect") cctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      else { cctx.beginPath(); cctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); cctx.fill(); }
      cctx.restore();
    });
    confettiParts = confettiParts.filter((p) => p.y < innerHeight + 40);
    if (spawning || confettiParts.length) {
      confettiRAF = requestAnimationFrame(confettiTick);
    } else {
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiRAF = null;
    }
  }

  window.App = { haptic, sparkleBurst, sparkleBurstAt: sparkleAt, confetti };

  /* ===================================================================
     3. AMBIENT BACKDROP — soft particles + floating hearts
  =================================================================== */
  // Soft drifting bokeh particles
  const pCanvas = $("#particle-canvas");
  const pctx = pCanvas.getContext("2d");
  let particles = [], pRAF = null;
  function sizeParticles() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    pCanvas.width = innerWidth * dpr; pCanvas.height = innerHeight * dpr;
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function initParticles() {
    sizeParticles();
    const n = reduceMotion ? 0 : Math.min(46, Math.round(innerWidth / 26));
    particles = [];
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * innerWidth, y: Math.random() * innerHeight,
        r: 1 + Math.random() * 3, a: 0.08 + Math.random() * 0.22,
        vy: 0.15 + Math.random() * 0.45, vx: -0.15 + Math.random() * 0.3,
        tw: Math.random() * Math.PI * 2
      });
    }
    if (n && !pRAF) pRAF = requestAnimationFrame(particleTick);
  }
  function particleTick() {
    pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    const cs = getComputedStyle(document.documentElement);
    const blush = (cs.getPropertyValue("--blush").trim()) || "#F8D5E0";
    particles.forEach((p) => {
      p.y -= p.vy; p.x += p.vx; p.tw += 0.02;
      if (p.y < -10) { p.y = innerHeight + 10; p.x = Math.random() * innerWidth; }
      const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
      pctx.beginPath(); pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pctx.fillStyle = blush; pctx.globalAlpha = alpha; pctx.fill();
    });
    pRAF = requestAnimationFrame(particleTick);
  }

  // Floating hearts rising through the backdrop
  const heartsLayer = $("#hearts-layer");
  let heartTimer = null;
  const HEART_GLYPHS = ["❤", "💗", "💕", "🤍", "💛"];
  function spawnHeart() {
    if (reduceMotion) return;
    if (heartsLayer.childElementCount > 18) return; // cap for performance
    const h = document.createElement("span");
    h.textContent = HEART_GLYPHS[Math.floor(Math.random() * HEART_GLYPHS.length)];
    const size = 12 + Math.random() * 26;
    const dur = 9 + Math.random() * 8;
    h.style.cssText =
      "position:absolute;bottom:-40px;left:" + (Math.random() * 100) + "%;" +
      "font-size:" + size + "px;will-change:transform,opacity;" +
      "--drift:" + (-60 + Math.random() * 120) + "px;--rot:" + (-30 + Math.random() * 60) + "deg;" +
      "--s:" + (0.7 + Math.random() * 0.7) + ";--o:" + (0.25 + Math.random() * 0.4) + ";" +
      "animation:heartRise " + dur + "s linear forwards;";
    heartsLayer.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000 + 200);
  }
  function startHearts() {
    if (reduceMotion || heartTimer) return;
    for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 600);
    heartTimer = setInterval(spawnHeart, 1400);
  }

  window.addEventListener("resize", () => { sizeParticles(); sizeConfetti(); });

  /* ===================================================================
     4. PHOTOS
  =================================================================== */
  function buildPhotos() {
    const strip = $("#photo-strip");
    const list = (CONFIG.photos || []).filter(Boolean);
    strip.innerHTML = "";
    if (!list.length) {
      ["💞", "🌅", "🥂"].forEach((g) => {
        const d = document.createElement("div");
        d.className = "photo photo--placeholder";
        d.textContent = g;
        d.setAttribute("aria-hidden", "true");
        strip.appendChild(d);
      });
      return;
    }
    list.slice(0, 6).forEach((src, i) => {
      const fig = document.createElement("div");
      fig.className = "photo";
      const img = document.createElement("img");
      img.src = src; img.loading = "lazy"; img.decoding = "async";
      img.alt = "A favorite memory of us, photo " + (i + 1);
      fig.appendChild(img);
      strip.appendChild(fig);
    });
  }

  /* ===================================================================
     5. NAVIGATION (views + tab bar)
  =================================================================== */
  const VIEWS = ["home", "reasons", "games", "letter"];
  let current = "home";

  function goTo(name) {
    if (!VIEWS.includes(name)) return;
    current = name;
    VIEWS.forEach((v) => {
      const el = $("#view-" + v);
      el.classList.toggle("is-active", v === name);
      if (v === name) { el.removeAttribute("aria-hidden"); }
      else el.setAttribute("aria-hidden", "true");
    });
    // tab bar state
    $$(".tabbar__btn").forEach((b) => {
      const on = b.dataset.goto === name;
      b.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    // reset scroll to top of the active view
    const scroll = $("#view-" + name + " .view__scroll");
    if (scroll) scroll.scrollTop = 0;

    // calm mode + letter behavior
    document.body.classList.toggle("is-letter", name === "letter");
    if (name === "letter") { if (window.Music) window.Music.duck(); startLetter(); }
    else { if (window.Music) window.Music.unduck(); }

    haptic(8);
  }

  function wireNav() {
    $$("[data-goto]").forEach((btn) => {
      btn.addEventListener("click", () => goTo(btn.dataset.goto));
    });
  }

  /* ===================================================================
     6. GAME MODAL
  =================================================================== */
  const modal = $("#modal");
  const modalBody = $("#modal-body");
  const modalTitle = $("#modal-title");
  let activeGame = null, lastFocused = null;
  const GAME_TITLES = { memory: "Memory Match", catch: "Catch the Hearts", bouquet: "Build a Bouquet", quotes: "Guess Who Said It" };

  function openGame(name) {
    if (!window.Games || !window.Games[name]) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = GAME_TITLES[name] || "Game";
    modalBody.innerHTML = "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    activeGame = window.Games[name](modalBody);
    const closeBtn = $(".modal__close");
    if (closeBtn) closeBtn.focus();
    haptic(10);
  }
  function closeGame() {
    if (activeGame && activeGame.destroy) activeGame.destroy();
    activeGame = null;
    modal.hidden = true;
    modalBody.innerHTML = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function wireGames() {
    $$("[data-game]").forEach((b) => b.addEventListener("click", () => openGame(b.dataset.game)));
    $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeGame));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeGame();
    });
  }

  /* ===================================================================
     7. TYPEWRITER LETTER
  =================================================================== */
  const letterBody = $("#letter-body");
  const letterSign = $("#letter-sign");
  const letterReplay = $("#letter-replay");
  let letterTyped = false, typingRAF = null;

  function typeLetter() {
    const text = CONFIG.letter || "";
    letterSign.hidden = true;
    letterReplay.hidden = true;
    letterBody.textContent = "";
    const cursor = document.createElement("span");
    cursor.className = "letter__cursor";

    if (reduceMotion) {
      letterBody.textContent = text;
      endLetter();
      return;
    }

    letterBody.appendChild(cursor);
    let i = 0;
    let lastT = 0;
    function step(now) {
      if (now - lastT >= 0) {
        const ch = text[i] || "";
        const node = document.createTextNode(ch);
        letterBody.insertBefore(node, cursor);
        i++;
        // pacing: brief pause after punctuation, quicker otherwise
        let delay = 26;
        if (".,!?".indexOf(ch) >= 0) delay = 260;
        else if (ch === "\n") delay = 120;
        lastT = now + delay;
      }
      if (i < text.length) typingRAF = setTimeout(() => requestAnimationFrame(step), 0);
      else { cursor.remove(); endLetter(); }
    }
    requestAnimationFrame(step);
  }
  function endLetter() {
    letterSign.textContent = CONFIG.letterSignature || "Happy One Year ❤️";
    letterSign.hidden = false;
    letterReplay.hidden = false;
    letterTyped = true;
    if (!reduceMotion) setTimeout(() => confetti(2200), 400);
  }
  function startLetter() {
    if (letterTyped) {
      // Already read once: show it complete (replay button can retype).
      letterBody.textContent = CONFIG.letter || "";
      letterSign.hidden = false; letterReplay.hidden = false;
      return;
    }
    typeLetter();
  }
  letterReplay.addEventListener("click", () => { letterTyped = false; typeLetter(); });

  /* ===================================================================
     8. INTRO → APP
  =================================================================== */
  const intro = $("#intro");
  const app = $("#app");
  let begun = false;

  function begin() {
    if (begun) return;
    begun = true;
    if (window.Music) window.Music.start();
    intro.classList.add("is-hiding");
    app.hidden = false;
    // activate home now so it fades in behind the intro
    goTo("home");
    haptic(14);
    setTimeout(() => { intro.style.display = "none"; }, 1100);
    if (window.Counter) window.Counter.start();
  }
  intro.addEventListener("click", begin);
  intro.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); begin(); }
  });

  /* ===================================================================
     9. SCROLL REVEAL (gentle entrance for sections)
  =================================================================== */
  function wireReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$(".counter, .photos, .home__card, .game-card, .section-head").forEach((el, i) => {
      el.classList.add("reveal", "stagger");
      el.style.setProperty("--i", (i % 6));
      io.observe(el);
    });
  }

  /* ===================================================================
     INIT
  =================================================================== */
  function init() {
    applyConfig();
    initParticles();
    startHearts();
    buildPhotos();
    if (window.Reasons) window.Reasons.init();
    wireNav();
    wireGames();
    wireReveal();
    // Counter starts on intro tap, but render once now so it's correct if reduced-motion users land fast.
    if (window.Counter && reduceMotion) window.Counter.start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
