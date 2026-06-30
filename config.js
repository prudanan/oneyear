/* =====================================================================
   CONFIG.JS  —  THE ONLY FILE YOU NEED TO EDIT
   ---------------------------------------------------------------------
   Everything personal lives here: her name, your date, the 100 reasons,
   the quotes, the letter, colors, fonts and music. Change values below
   and the whole site updates. You should never have to touch the code
   in /scripts or /styles to personalize this.
   ===================================================================== */

const CONFIG = {

  /* ------------------------------------------------------------------
     1. THE BASICS
  ------------------------------------------------------------------ */
  // Her name (shown throughout the site).
  girlfriendName: "My Love",

  // Your name (used in the "Guess Who Said It" game labels).
  yourName: "Connor",

  // The day you became official. Format: "2025-07-01T00:00:00"
  // The live counter measures from this exact moment.
  anniversaryDate: "2024-06-30T19:30:00",

  // Short line shown on the intro screen under the title.
  introSubtitle: "For the most amazing girl.",


  /* ------------------------------------------------------------------
     2. MUSIC
     Drop an .mp3 into /assets/music/ and put its path here.
     Music starts only after the first tap (browser rule).
     Leave as "" to disable music — the button simply won't appear.
  ------------------------------------------------------------------ */
  music: {
    src: "assets/music/song.mp3",   // e.g. "assets/music/our-song.mp3"
    volume: 0.5,                     // 0.0 (silent) to 1.0 (full)
    fadeOnLetter: 0.12               // music dips to this volume during the final letter
  },


  /* ------------------------------------------------------------------
     3. THEME — colors & fonts
     Colors accept any CSS color (hex, rgb, hsl).
     Fonts must be loaded in index.html (Google Fonts links are there).
  ------------------------------------------------------------------ */
  theme: {
    colors: {
      bgDeep:   "#2B1430",  // deepest background tone (aubergine)
      bgMid:    "#7A3B5E",  // mid gradient tone (mulberry)
      bgRose:   "#C75B7A",  // brightest gradient tone (rose)
      blush:    "#F8D5E0",  // soft blush highlight
      gold:     "#F2C879",  // signature warm-gold foil accent
      goldDeep: "#C9972E",  // darker gold for gradients/shadows
      cream:    "#FBF4EE",  // near-white text on dark backgrounds
      ink:      "#2A1B2E"   // dark text on light glass
    },
    fonts: {
      display: "'Cormorant Garamond', Georgia, serif",  // elegant headings
      body:    "'Inter', system-ui, sans-serif"          // UI & paragraphs
    }
  },


  /* ------------------------------------------------------------------
     4. PHOTOS (optional but lovely)
     Drop images into /assets/photos/ and list their paths here.
     They appear as floating polaroids on the home screen.
     Leave the array empty [] to show elegant gradient cards instead.
  ------------------------------------------------------------------ */
  photos: [
    // "assets/photos/1.jpg",
    // "assets/photos/2.jpg",
    // "assets/photos/3.jpg"
  ],


  /* ------------------------------------------------------------------
     5. THE 100 REASONS
     One string per reason. Edit freely. If you write fewer than 100,
     the site automatically fills the rest with gentle placeholders so
     nothing ever breaks. Keep each reason short and heartfelt.
  ------------------------------------------------------------------ */
  reasons: [
    "The way your eyes light up when you laugh.",
    "You make ordinary days feel like something worth remembering.",
    "Your hugs feel like home.",
    "You believe in me even when I forget to believe in myself.",
    "The little dance you do when you're happy.",
    "You let me ragebait.",
    "Your kindness to people who can do nothing for you.",
    "The way you steal the blanket and pretend you didn't.",
    "You make me want to be a better person.",
    "Your terrible taste in jokes.",
    "That ass.",
    "You make me food.",
    "The way you say my name.",
    "You forgive me faster than I deserve.",
    "Your curiosity about everything.",
    "You play roblox with me.",
    "boobs.",
    "You call me when you see something that excites you/drama.",
    "Your courage in the moments that scare you.",
    "The way you fall asleep mid-sentence.",
    "You make me laugh until it hurts.",
    "Your patience with my chaos.",
    "How you light up a room without trying.",
    "You ask how my day was and actually listen.",
    "Putting me on your romance shows.",
    "Your unstoppable warmth.",
    "You see the good in mostly everyone.",
    "How you cry at the happy/sad parts of movies.",
    "Your stubborn, beautiful heart.",
    "The way you look at me when you think I'm not watching.",
    "You make plans for our future.",
    "Your handwriting on notes you leave behind.",
    "How you sing slightly off key with full confidence.",
    "You never make me feel like a burden.",
    "Your hands, and the way they fit mine.",
    "How you turn my bad days around.",
    "Your loyalty.",
    "You celebrate my wins like they're your own.",
    "The way you scrunch your nose when you concentrate.",
    "You make me feel chosen.",
    "Your soft heart for animals. Specifically cats.",
    "You listen to my bad ideas.",
    "You're my favorite person to do nothing with.",
    "Your honesty, even when it's hard.",
    "Your glasses.",
    "You make me feel understood.",
    "Your laugh especially the real, ugly one.",
    "How you fight for the people you love.",
    "You make me brave.",
    "Freak in da bed",
    "Your stupid music taste.",
    "How you always know when something's wrong.",
    "You make compromise feel easy.",
    "Your big dreams.",
    "The way you reach for me in your sleep.",
    "You make me feel like enough.",
    "Your gentleness.",
    "How you find beauty in ordinary things.",
    "You're awesome.",
    "The way you light candles for no occasion.",
    "Your fierce little opinions.",
    "How you make me feel at peace.",
    "You laugh at my jokes even when they're bad.",
    "Your warmth on cold mornings.",
    "The way you say 'we' instead of 'I'.",
    "You make me feel lucky every single day.",
    "Your quiet strength.",
    "How you always save me the last bite. (sometimes)",
    "You make the future feel exciting instead of scary.",
    "Your soft sleepy voice.",
    "The way you decorate everything with care.",
    "You never give up on the people you love.",
    "Your wild, wonderful imagination.",
    "How you make me feel seen.",
    "You hold space for my feelings.",
    "Your generous heart.",
    "The way you light up around your friends.",
    "You make me feel like I belong somewhere.",
    "Your gentle teasing.",
    "How your body is.",
    "You make hard things feel possible.",
    "Your beautiful mind.",
    "The way you hum while you cook.",
    "You make me want to stay.",
    "Your tenderness.",
    "How you remember things I'd forget.",
    "You make love feel simple.",
    "Your bright, hopeful eyes.",
    "The way you hold me when I'm tired.",
    "You make me feel like myself.",
    "Your forgiveness.",
    "How you turn small moments into memories.",
    "You make my world bigger.",
    "Your soft laughter in the dark.",
    "The way you say 'I love you' like you mean it.",
    "You make every season feel like spring.",
    "Your grace.",
    "How you make me feel home no matter where we are.",
    "You're my best friend.",
    "And after a whole year, I'd choose you all over again."
  ],


  /* ------------------------------------------------------------------
     6. "GUESS WHO SAID IT" QUOTES
     'who' must be "me" or "her".
     Edit the text to real things you've actually said to each other.
  ------------------------------------------------------------------ */
  quotes: [
    { text: "Okay but I genuinely think we should adopt that cat.", who: "her" },
    { text: "God I do not want to go to work today.", who: "me" },
    { text: "Five more minutes and then I'll get up, I promise.", who: "her" },
    { text: "Are you mad at me?", who: "her" },
    { text: "This movie sucks.", who: "me" },
    { text: "I saved the tiktok to show you later.", who: "her" },
    { text: "You're literally my favorite person.", who: "her" },
    { text: "Wanna play roblox?", who: "me" },
    { text: "Stop being cute, I'm trying to be mad.", who: "her" },
    { text: "I already know what you're going to order.", who: "me" },
    { text: "Let's stay in and do absolutely nothing.", who: "me" },
    { text: "I texted you good morning before I even got up.", who: "her" },
    { text: "Why are you like this.", who: "her" },
    { text: "You've got this don't worry.", who: "me" },
    { text: "Come here, I want a hug right now.", who: "her" },
    { text: "Are you going to be on top?", who: "me" },
    { text: "Is it in yet?", who: "her" },
    { text: "Get out of bed.", who: "her" },
    { text: "RUB MY BACK.", who: "her" },
    { text: "I want a coke zero.", who: "me" }
  ],


  /* ------------------------------------------------------------------
     7. THE FINAL LETTER
     Use \n for a line break, and a blank line for a new paragraph.
     This types itself out at the end. Make it yours.
  ------------------------------------------------------------------ */
  letter:
`My love, \n One year ago today, I never thought I'd be able to find true love again, but you proved me wrong. I never thought I would be able to do the things I enjoy, while also being in love. You proved me wrong. Thank you for proving me wrong. Thank you for this past year for being the most wonderful girlfriend I could ever ask for. It means the world to me. You alweays check in on me, ask if I'm okay, give me everything I need, and I adore that. I really do look forward to building a future with you, a future that you and I will both enjoy. I cant wait for the mysterious adventures that await us. We have built so many memories between the time we met eachother until now, and I want to keep making more memories with you. I want to do everything together as a team. This is going to be the toughest time of our entire lives, but I want to do it with you. Thank you for being you, and I hope you continue to be you. Grow and grow as a better person for yourself, and not just me. Thats what attracts me to you. You're an outstanding person, smart, and cute. Anyways, heres to a happy one year, and many more to come. I cannot wait to see what the years ahead of us hold, and hell, even the lifetimes after that. I love you.`,

  // The closing line shown after the letter finishes typing.
  letterSignature: "Happy One Year ❤️",


  /* ------------------------------------------------------------------
     8. GAME SETTINGS (tweak only if you want a different difficulty)
  ------------------------------------------------------------------ */
  games: {
    memory: { pairs: 8 },                         // 8 pairs = 16 cards
    catch:  { winScore: 20, missLimit: 10 },      // reach 20 to win, 10 misses ends it
    bouquet:{ target: 7 }                          // flowers needed to complete the bouquet
  }
};

// Expose globally (classic script — works when opening index.html directly).
window.CONFIG = CONFIG;
