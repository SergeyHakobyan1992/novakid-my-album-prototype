/* My Album v4 — Kids Area prototype (Novakid candidate task).
   Child screens replicate the current Kids Area layout; images, fonts, music and UI sounds load from Novakid's public CDN.
   New: the "My album" word collection (real Level 1 units and words from the Novakid programme) + a Learning Engine
   that sends each word into an existing Kids Area game depending on its mastery level, and brings old words back
   for a refresh before they are forgotten (spaced repetition).
   Fictional learner (Mia) and teacher (Ms. Anna). No real accounts, no backend. */
(() => {
  "use strict";

  // ---------- assets ----------
  const IMG = "assets/img/";
  const GW = "https://cdn.novakidschool.com/student-area/images/game-world/";
  const SE = "https://cdn.novakidschool.com/student-area/images/skill-exerciser/";
  const FILE = (id) => `https://cdn.novakidschool.com/api/0/files/${id}?ext=.mp3`;
  const A = {
    dq: GW + "dashboard/daily_quest_icon.svg", shop: GW + "dashboard/shop_icon_v2.svg", star: GW + "star_v3.svg",
    avatar: "https://cdn.novakidschool.com/api/0/files/5d6doMuFS9qVFrlhCi1fsQ", back: GW + "back_icon_v2.svg",
    tick: GW + "dashboard/notification-success2.png", hwBack: SE + "back-arrow_pre-lesson.svg", hwStar: SE + "final_screen_reward_star.svg",
    pino: "https://cdn.novakidschool.com/cmp/5df9765a-4177-4c8d-b2c2-f5bdded8ef33.webp",
  };
  // Kids Area main-screen audio (same files the real dashboard loads)
  const SND = { music: FILE("BZ47xW8_Sfq-Uv21m2V3Kg"), hover: FILE("ejzMSSiIRASOJIsUfVq8kg"), click: FILE("tDSSQxBERkS0a_nByYlsug"), open: FILE("O5_02fRtTLW9W5HA5O1yMA"), close: FILE("vwqaBCBNSQqP11P0H3-gaw") };
  const TILES = [
    { key: "streams", area: "tile1", lab: "STREAMS", color: "#CF05C1", side: "l-right", bg: GW + "dashboard/streams_tile_background_v2.svg", img: GW + "dashboard/streams_tile.webp", w: 88 },
    { key: "tales", area: "tile2", lab: "TALES", color: "#11A2CF", side: "l-left", bg: GW + "dashboard/tales-background.webp", img: GW + "dashboard/tales_v2.svg", w: 72 },
    { key: "practice", area: "tile3", lab: "MORE PRACTICE", color: "#18A410", side: "l-full", bg: GW + "dashboard/homework_loop_end_bg.webp", img: GW + "dashboard/more_practice-lion.png", w: 104, tick: true },
    { key: "album", area: "tile4", lab: "MY ALBUM", side: "l-full" },
    { key: "games", area: "tile5", lab: "GAMES", color: "#6D3DE4", side: "l-right", bg: GW + "dashboard/games-background_v2.png", img: GW + "dashboard/games_v2.svg", w: 95 },
    { key: "pinocchio", area: "tile6", lab: "PINOCCHIO", color: "#E8590C", side: "l-left", bg: "https://cdn.novakidschool.com/cmp/00964054-2c84-4dfb-a92e-1e27dccc8f95.jpg", img: A.pino, w: 95 },
  ];
  const TEACHER = "Ms. Anna", KID = "Mia";

  // ---------- content: Novakid Level 1 (Juniors) units; words from the programme's "identify …" competencies ----------
  const UNITS = [
    { n: 1, id: "toys", name: "Toys", ic: "🧸", w: [["doll", "🪆"], ["toy car", "🚗"], ["toy train", "🚂"], ["ball", "⚽"], ["robot", "🤖"], ["puzzle", "🧩"], ["teddy bear", "🧸"], ["bike", "🚲"]] },
    { n: 2, id: "face", name: "The Face", ic: "🙂", w: [["head", "🧑"], ["neck", "🦒"], ["legs", "🦵"], ["arms", "💪"], ["eyes", "👀"], ["ears", "👂"], ["nose", "👃"], ["mouth", "👄"]] },
    { n: 3, id: "feelings", name: "Feelings", ic: "😀", w: [["happy", "😀"], ["sad", "😢"], ["angry", "😠"], ["scared", "😱"], ["hungry", "🤤"], ["thirsty", "😮‍💨"], ["sleepy", "😴"], ["hot", "🥵"], ["cold", "🥶"]] },
    { n: 4, id: "school", name: "School", ic: "🎒", guess: true, w: [["pen", "🖊️"], ["pencil", "✏️"], ["book", "📕"], ["bag", "🎒"], ["ruler", "📏"], ["crayon", "🖍️"], ["scissors", "✂️"], ["notebook", "📓"]] },
    { n: 5, id: "family", name: "Family", ic: "👪", w: [["mum", "👩"], ["dad", "👨"], ["sister", "👧"], ["brother", "👦"], ["grandma", "👵"], ["grandpa", "👴"], ["aunt", "👩‍🦰"], ["uncle", "🧔"], ["cousin", "🧒"]] },
    { n: 6, id: "food", name: "Food", ic: "🍕", w: [["carrot", "🥕"], ["cupcake", "🧁"], ["pizza", "🍕"], ["fish", "🐟"], ["grapes", "🍇"], ["peas", "🫛"], ["hamburger", "🍔"], ["tomato", "🍅"], ["sandwich", "🥪"], ["milk", "🥛"], ["juice", "🧃"]] },
    { n: 7, id: "home", name: "Home", ic: "🛋️", locked: true, w: [["chair", "🪑"], ["mirror", "🪞"], ["table", "🍽️"], ["lamp", "💡"], ["TV", "📺"], ["armchair", "💺"], ["sofa", "🛋️"], ["bookcase", "📚"], ["bed", "🛏️"], ["clock", "🕰️"]] },
    { n: 8, id: "actions", name: "Actions", ic: "🏃", locked: true, w: [["run", "🏃"], ["climb", "🧗"], ["swim", "🏊"], ["fly", "🕊️"], ["jump", "🦘"], ["ride a bike", "🚴"], ["sing", "🎤"], ["paint", "🎨"], ["read", "📖"], ["dance", "💃"]] },
    { n: 9, id: "clothes", name: "Clothes", ic: "👕", locked: true, w: [["boots", "🥾"], ["socks", "🧦"], ["coat", "🧥"], ["hat", "👒"], ["shorts", "🩳"], ["dress", "👗"], ["T-shirt", "👕"], ["trousers", "👖"], ["cap", "🧢"], ["shoes", "👟"]] },
    { n: 10, id: "animals", name: "Animals", ic: "🐶", locked: true, w: [["pig", "🐷"], ["rabbit", "🐰"], ["sheep", "🐑"], ["goat", "🐐"], ["duck", "🦆"], ["horse", "🐴"], ["dog", "🐶"], ["chicken", "🐔"], ["cow", "🐮"], ["cat", "🐱"]] },
  ];
  const CURRENT = "food";
  const WORDS = [];
  UNITS.forEach((u) => u.w.forEach(([w, e]) => WORDS.push({ id: w, word: w, u: u.id, emo: e })));
  // word pictures: Gemini sheets cut into tiles (units 1–6); locked units keep emoji
  WORDS.forEach((w) => { if (!UNITS.find((u) => u.id === w.u).locked) w.img = `assets/img/words/${w.id.replace(/ /g, "-")}.jpg`; });
  const W = (id) => WORDS.find((w) => w.id === id);
  const unitOf = (id) => UNITS.find((u) => u.id === W(id).u);
  const open = (id) => !unitOf(id).locked;

  // ---------- mastery ladder = card level ----------
  const LEVELS = [
    { name: "Not met yet", look: "empty puzzle", ev: "not taught yet" },
    { name: "Met in lesson", look: "1 of 5 pieces", ev: "taught in a 1-1 lesson (from the lesson record)" },
    { name: "Recognises", look: "2 of 5 pieces", ev: "matches the word (heard and written) to the picture — Memo Mix or Box Battle — with ≤ 1 mistake" },
    { name: "Says it", look: "3 of 5 pieces", ev: "produces the word — says it to Pinocchio, or spells it in Bubbles, Racing or Snake — without a hint" },
    { name: "Remembers", look: "4 of 5 pieces", ev: "names the picture again after 3+ days, first try, no hint (Quiz Corner). Then refresh after 7 → 14 → 28 days" },
    { name: "Uses with teacher", look: "full picture + gold frame", ev: "says it to the teacher in a live lesson (teacher taps ✓)" },
  ];
  const GAME = {
    memo: { name: "Memo Mix", col: "#D98DE3", ic: "🃏", skill: "recognise", n: 6, intro: "Find the picture for every sound." },
    boxes: { name: "Box Battle", col: "#43C6CC", ic: "📦", skill: "recognise", n: 4, intro: "Listen and put each card into the right box!" },
    bubbles: { name: "Bubbles", col: "#E9B33D", ic: `<span class="mini-t">ABC</span>`, skill: "spell", n: 3, intro: "Pop the letters to spell the word!" },
    pino: { name: "Pinocchio", col: "#E8590C", ic: "🎤", skill: "say", n: 4, intro: "Say it to Pinocchio!" },
    racing: { name: "Racing", col: "#3E9B5A", ic: "🚀", skill: "spell", n: 3, intro: "Catch the missing letter!" },
    snake: { name: "Snake", col: "#8A7BEA", ic: "🐍", skill: "spell", n: 3, intro: "Eat the first letter of the word!" },
    quiz: { name: "Quiz Corner", col: "#2BB5D6", ic: `<span class="mini-t"><b style="color:#18A410">✓</b><b style="color:#DD0035">✗</b></span>`, skill: "recall", n: 4, intro: "Do you still remember these words?" },
  };
  const LEARN = ["memo", "boxes"], MAKE = ["bubbles", "pino", "racing", "snake"];
  const RECALL = 3, FIRST_IV = 7, STAR_UP = 10, STAR_REFRESH = 5, STAR_CROWN = 20;
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayName = (d) => DAYS[((d % 7) + 7) % 7];

  // ---------- state ----------
  const KEY = "my-album-v4";
  function seed() {
    const lv = {}, up = {}, rev = {}, iv = {};
    const set = (ids, L, d, r, i) => ids.forEach((id) => { lv[id] = L; up[id] = d; if (L >= 4) { rev[id] = r; iv[id] = i; } });
    WORDS.forEach((w) => set([w.id], 0, -99));
    // Unit 1 Toys
    set(["ball", "doll", "toy car"], 5, -40, -12, 28); set(["teddy bear", "robot"], 4, -30, -5, 7); set(["toy train"], 3, -4); set(["puzzle"], 2, -20); set(["bike"], 1, -40);
    // Unit 2 The Face
    set(["eyes", "nose", "mouth", "ears"], 5, -35, -20, 28); set(["head"], 4, -25, -6, 7); set(["arms", "legs"], 3, -1); set(["neck"], 2, -18);
    // Unit 3 Feelings
    set(["happy", "sad"], 5, -30, -10, 14); set(["angry"], 4, -22, -8, 7); set(["scared"], 3, -5); set(["hungry", "thirsty"], 2, -12); set(["sleepy", "hot", "cold"], 1, -21);
    // Unit 4 School items
    set(["book", "bag", "pencil"], 4, -15, -2, 7); set(["pen"], 3, -2); set(["ruler"], 2, -9); set(["crayon", "scissors", "notebook"], 1, -14);
    // Unit 5 Family
    set(["mum", "dad"], 5, -14, -4, 14); set(["sister", "brother"], 4, -10, -3, 7); set(["grandma"], 3, -3); set(["grandpa"], 2, -7); set(["aunt", "uncle", "cousin"], 1, -7);
    // Unit 6 Food — Monday's lesson (Quests 5–8 introduce the rest later)
    set(["carrot", "cupcake", "pizza", "fish", "grapes", "peas"], 1, 0);
    return { lv, up, rev, iv };
  }
  function counts(st) {
    const L = (id) => st.lv[id], dz = (id) => L(id) >= 4 && st.day - st.rev[id] >= st.iv[id];
    return { met: WORDS.filter((w) => L(w.id) >= 1).length, rem: WORDS.filter((w) => L(w.id) >= 4 && !dz(w.id)).length };
  }
  function fresh() {
    const s = Object.assign({
      view: "child", screen: "home", tab: CURRENT, day: 0, engine: true, sound: true, stars: 120,
      popupSeen: false, albumSeen: false, helpSaid: false, crowns: [], tellAsked: {}, plays: {}, events: [], ups: [], session: null, lastSummary: null, hist: [],
    }, seed());
    const c = counts(s);
    for (let k = 8; k >= 1; k--) s.hist.push({ d: -7 * k, met: Math.max(4, Math.round(c.met * (1 - k * 0.1))), rem: Math.max(0, Math.round(c.rem * (1 - k * 0.11))) });
    return s;
  }
  let S = load();
  function load() { try { const r = localStorage.getItem(KEY); if (r) return Object.assign(fresh(), JSON.parse(r)); } catch (e) {} return fresh(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const hash = (s) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };
  const lv = (id) => S.lv[id];
  const dusty = (id) => lv(id) >= 4 && S.day - S.rev[id] >= S.iv[id];
  const prim = (t, size, extra = "") => `<span class="t-primary ${extra}" data-text="${esc(t)}" style="font-size:${size}px">${esc(t)}</span>`;
  // custom UI icons (Gemini sheets cut into round badges) instead of emoji
  const ICO = (n, cls = "") => `<img class="ico ${cls}" src="assets/img/ui/${n}.jpg" alt="">`;
  const TICO = (u, cls = "") => `<img class="ico tico ${cls}" src="assets/img/ui/t-${u.id || u}.jpg" alt="">`;
  const pic = (id) => { const w = W(id); return `<span class="emo">${w.img ? `<img class="wimg" src="${w.img}" alt="">` : w.emo}</span>`; };
  let toastT;
  function toast(m) { let t = $(".ka-toast"); if (!t) { t = document.createElement("div"); t.className = "ka-toast"; t.setAttribute("role", "status"); document.body.appendChild(t); } t.textContent = m; clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2600); }

  // speech: Chrome's synthesiser can stall after cancel() / long idle — resume and speak on the next tick
  let voice = null;
  function pickVoice() { try { const vs = speechSynthesis.getVoices(); voice = vs.find((v) => /Samantha|Google US English|Karen|Daniel/.test(v.name)) || vs.find((v) => /^en(-|_)(US|GB)/i.test(v.lang)) || null; } catch (e) {} }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function say(text, queue = false) {
    try {
      if (!("speechSynthesis" in window)) return;
      if (!queue) speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.9; if (voice) u.voice = voice;
      setTimeout(() => { try { speechSynthesis.resume(); speechSynthesis.speak(u); } catch (e) {} }, queue ? 90 : 60);
    } catch (e) {}
  }
  // UI sounds + background music from Kids Area
  let music = null, lastHover = null, hoverT = 0;
  // preloaded pool per sound: no network fetch or decoding on every hover/click
  const POOL = {}, POOL_N = 3;
  function pool(name) { if (!POOL[name]) { POOL[name] = { i: 0, a: Array.from({ length: POOL_N }, () => { const a = new Audio(SND[name]); a.preload = "auto"; return a; }) }; } return POOL[name]; }
  ["hover", "click", "close"].forEach((n) => { try { pool(n); } catch (e) {} });
  function sfx(name, vol = 0.45) { if (!S.sound) return; try { const p = pool(name), a = p.a[p.i++ % POOL_N]; a.volume = vol; a.currentTime = 0; a.play().catch(() => {}); } catch (e) {} }
  function startMusic() {
    if (!S.sound) { if (music) music.pause(); return; }
    try { if (!music) { music = new Audio(SND.music); music.loop = true; } music.volume = S.screen === "play" ? 0.06 : 0.16; music.play().catch(() => {}); } catch (e) {}
  }

  function superscore(correct, attempt, hint) { if (!correct) return 0; const l = attempt === 1 ? 1 : attempt <= 3 ? 0.8 : attempt <= 6 ? 0.6 : attempt <= 10 ? 0.4 : 0.2; return +(l * (hint ? 0.6 : 1)).toFixed(2); }
  function zone(x) { return x < 0.5 ? "frustrating" : x < 0.75 ? "suboptimal" : x <= 0.95 ? "optimal" : "boring"; }
  function logEvent(e) { S.events.push(Object.assign({ day: dayName(S.day), dn: S.day, ts: new Date().toISOString().slice(11, 19) }, e)); }
  const compId = (id, skill) => `L1.U${unitOf(id).n}.${W(id).u}.${id.replace(/ /g, "-")}.${skill}`;

  // ---------- Learning Engine ----------
  const playKey = (id) => `${W(id).u}:${lv(id)}`; // rotate games per unit+level, so a session stays on one topic
  const pickGame = (id, list) => list[(hash(W(id).u) + (S.plays[playKey(id)] || 0)) % list.length];
  function nextStep(id) {
    const L = lv(id);
    if (L === 0) return { k: "locked" };
    if (L === 1) return { k: "learn", game: pickGame(id, LEARN) };
    if (L === 2) return { k: "make", game: pickGame(id, MAKE) };
    if (L === 3) { const since = S.day - S.up[id]; return since >= RECALL ? { k: "recall", game: "quiz", over: since - RECALL } : { k: "wait", left: RECALL - since }; }
    if (dusty(id)) return { k: "review", game: "quiz", over: S.day - S.rev[id] - S.iv[id] };
    return L === 4 ? { k: "teacher" } : { k: "done" };
  }
  // Priority: words about to be forgotten first, then retention checks, then the latest lesson, then older units.
  function queue() {
    return WORDS.filter((w) => open(w.id)).map((w) => ({ id: w.id, ...nextStep(w.id) })).filter((q) => q.game)
      .map((q) => {
        let p = q.k === "review" ? 95 + Math.min(q.over, 10) : q.k === "recall" ? 90 + Math.min(q.over, 10) : q.k === "learn" ? 60 : 55;
        if (W(q.id).u === CURRENT) p += 30;
        const why = q.k === "review" ? `gold ${S.day - S.rev[q.id]} days ago → refresh before it is forgotten`
          : q.k === "recall" ? `“says it” ${S.day - S.up[q.id]} days ago → retention check`
          : W(q.id).u === CURRENT ? `from ${TEACHER}’s last lesson → ${q.k === "learn" ? "recognise" : "produce"}`
          : `Unit ${unitOf(q.id).n}, stuck at “${LEVELS[lv(q.id)].name}”`;
        return Object.assign(q, { p, why });
      }).sort((a, b) => b.p - a.p);
  }
  const recommended = () => (S.engine ? queue().slice(0, 3).map((q) => q.id) : []);

  // ---------- scaling (same as Kids Area: 616×320 canvas + CSS zoom) ----------
  function fit() { const Wd = window.innerWidth, H = window.innerHeight - 52; $("#stage").style.setProperty("--zoom", Math.max(0.4, Math.min(Wd / 616, H / 320)).toFixed(4)); }
  window.addEventListener("resize", fit);

  // ---------- shared pieces ----------
  function ribbon(text) {
    const Wd = Math.max(220, 128 + text.length * 11.5);
    return `<div class="ka-title"><svg class="rb" width="${Wd}" height="46" viewBox="0 0 ${Wd} 46">
      <polygon fill="#563C9F" points="3,8 55,8 55,36 3,36 14,22"/><polygon fill="#563C9F" points="${Wd - 58},8 ${Wd - 3},8 ${Wd - 14},22 ${Wd - 3},36 ${Wd - 58},36"/>
      <polygon fill="#9171EB" points="9,1 64,1 64,43 9,43 25,22"/><polygon fill="#9171EB" points="${Wd - 64},1 ${Wd - 9},1 ${Wd - 25},22 ${Wd - 9},43 ${Wd - 64},43"/>
      <rect fill="#9171EB" x="64" y="1" width="${Wd - 128}" height="42"/><rect fill="#9171EB" x="50" y="7" width="${Wd - 100}" height="30"/>
      </svg>${prim(text, 17)}</div>`;
  }
  const coins = () => `<div class="ka-coins"><img class="star" src="${A.star}" alt="star">${prim(String(S.stars), 14, "num")}</div>`;
  const innerHeader = (back, title, extra = "") => `<header class="ka-header"><button class="ka-back" data-go="${back}" aria-label="back"><img src="${A.back}" alt="button back"></button>${ribbon(title)}${extra}${coins()}</header>`;
  const gameIcon = (g) => g === "pino" ? `<img src="${A.pino}" alt="">` : GAME[g].ic;

  // A card: picture + word + 5 pips. Tap the card = hear it. Round badge = where the engine sends you next.
  // Puzzle card: 5 jigsaw pieces = 5 mastery levels; the 5th level also gets a gold frame. Only the word as a caption.
  const PZ = (() => {
    const h = 9, w = 7;
    const seg = (x1, y1, x2, y2, n) => { // straight edge with an optional knob; n = absolute knob direction [nx, ny] or null
      if (!n) return `L${x2},${y2}`;
      const len = Math.hypot(x2 - x1, y2 - y1), dx = (x2 - x1) / len, dy = (y2 - y1) / len, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const ax = mx - dx * w, ay = my - dy * w, bx = mx + dx * w, by = my + dy * w;
      return `L${ax},${ay} C${ax + n[0] * h * 1.4 - dx * 4},${ay + n[1] * h * 1.4 - dy * 4} ${bx + n[0] * h * 1.4 + dx * 4},${by + n[1] * h * 1.4 + dy * 4} ${bx},${by} L${x2},${y2}`;
    };
    const t3 = 100 / 3, T = 2 * t3;
    // three cut patterns (knob directions are absolute, so neighbours get a matching tab / blank)
    const A = [
      `M0,0 L50,0 ${seg(50, 0, 50, 50, [1, 0])} ${seg(50, 50, t3, 50, null)} ${seg(t3, 50, 0, 50, [0, 1])} Z`,
      `M50,0 L100,0 L100,50 ${seg(100, 50, T, 50, [0, -1])} ${seg(T, 50, 50, 50, null)} ${seg(50, 50, 50, 0, [1, 0])} Z`,
      `M0,50 ${seg(0, 50, t3, 50, [0, 1])} ${seg(t3, 50, t3, 100, [-1, 0])} L0,100 Z`,
      `M${t3},50 L${T},50 ${seg(T, 50, T, 100, [1, 0])} L${t3},100 ${seg(t3, 100, t3, 50, [-1, 0])} Z`,
      `M${T},50 ${seg(T, 50, 100, 50, [0, -1])} L100,100 L${T},100 ${seg(T, 100, T, 50, [1, 0])} Z`,
    ];
    const kx = { 20: [1, 0], 40: [-1, 0], 60: [1, 0], 80: [-1, 0] };
    const B = [0, 20, 40, 60, 80].map((x0) => { const x1 = x0 + 20; return `M${x0},0 L${x1},0 ${x1 === 100 ? "L100,100" : seg(x1, 0, x1, 100, kx[x1])} L${x0},100 ${x0 === 0 ? "L0,0" : seg(x0, 100, x0, 0, kx[x0])} Z`; });
    const C = [
      `M0,0 L50,0 ${seg(50, 0, 50, 35, [1, 0])} ${seg(50, 35, 0, 35, [0, 1])} Z`,
      `M50,0 L100,0 L100,35 ${seg(100, 35, 50, 35, [0, -1])} ${seg(50, 35, 50, 0, [1, 0])} Z`,
      `M0,35 ${seg(0, 35, 50, 35, [0, 1])} ${seg(50, 35, 50, 70, [-1, 0])} ${seg(50, 70, 0, 70, [0, -1])} Z`,
      `M50,35 ${seg(50, 35, 100, 35, [0, -1])} L100,70 ${seg(100, 70, 50, 70, [0, 1])} ${seg(50, 70, 50, 35, [-1, 0])} Z`,
      `M0,70 ${seg(0, 70, 50, 70, [0, -1])} ${seg(50, 70, 100, 70, [0, 1])} L100,100 L0,100 Z`,
    ];
    const BASES = [A, B, C];
    // 8 symmetries of the square → 24 different-looking cards
    const TF = ["1 0 0 1 0 0", "-1 0 0 1 100 0", "1 0 0 -1 0 100", "-1 0 0 -1 100 100", "0 1 1 0 0 0", "0 1 -1 0 100 0", "0 -1 1 0 0 100", "0 -1 -1 0 100 100"];
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    defs.setAttribute("width", "0"); defs.setAttribute("height", "0"); defs.style.position = "absolute";
    defs.innerHTML = `<defs>${BASES.map((P, b) => TF.map((m, f) => P.map((d, k) => `<clipPath id="pz${b}${f}${k}"><path d="${d}" transform="matrix(${m})"/></clipPath>`).join("")).join("")).join("")}</defs>`;
    document.body.appendChild(defs);
    return { BASES, TF };
  })();
  // each word keeps its own cut and its own (random-looking) order in which pieces appear
  function pzLayout(id) {
    const h = hash(id + "#pz"), b = h % 3, f = Math.floor(h / 3) % 8;
    let s = h; const order = [0, 1, 2, 3, 4];
    for (let i = 4; i > 0; i--) { s = (s * 1103515245 + 12345) & 0x7fffffff; const j = s % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
    return { b, f, order };
  }
  const UNIT_BG = { toys: "#FFE3B8", face: "#FFD6DD", feelings: "#FFF1A8", school: "#D8ECFF", family: "#E6DBFF", food: "#D6F5D0", home: "#EEE", actions: "#EEE", clothes: "#EEE", animals: "#EEE" };
  function puzzle(id, L) {
    const w = W(id), bg = UNIT_BG[w.u] || "#EEE";
    const art = w.img ? `<image href="${w.img}" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice"/>` : `<rect width="100" height="100" fill="${bg}"/><text x="50" y="69" font-size="62" text-anchor="middle">${w.emo}</text>`;
    const { b, f, order } = pzLayout(id), own = order.slice(0, L), m = PZ.TF[f];
    return `<svg class="pz" viewBox="-1.2 -1.2 102.4 102.4" aria-hidden="true">
      ${own.map((k) => `<g clip-path="url(#pz${b}${f}${k})">${art}</g>`).join("")}
      ${PZ.BASES[b].map((d, k) => `<path d="${d}" transform="matrix(${m})" class="${own.includes(k) ? "own" : "miss"}"/>`).join("")}
      ${L === 0 ? `<text x="50" y="64" font-size="34" text-anchor="middle" class="q">?</text>` : ""}</svg>`;
  }
  function cardHTML(id, opts = {}) {
    const L = lv(id), st = nextStep(id), rec = opts.rec && opts.rec.includes(id), dz = dusty(id);
    let go = ""; // one action button under the card: where the engine sends the child next
    if (!opts.static && L > 0) {
      if (st.k === "review") go = `<button class="act act-review" data-card="${esc(id)}" aria-label="Refresh">${ICO("refresh")}PLAY</button>`;
      else if (st.game) go = `<button class="act act-play" data-card="${esc(id)}" aria-label="Play ${GAME[st.game].name}">${ICO("play")}PLAY</button>`;
      else if (st.k === "wait") go = `<button class="act act-wait" data-card="${esc(id)}" aria-label="Come back later">${ICO("wait")}${st.left}</button>`;
      else if (st.k === "teacher") go = `<button class="act act-teacher" data-card="${esc(id)}" aria-label="Tell ${TEACHER}"><img src="${IMG}teacher-anna.jpg" alt="">TELL</button>`;
    }
    return `<div class="wc l${L} ${dz ? "dusty" : ""} ${rec ? "rec" : ""} ${opts.static ? "static" : ""}">
      <button class="face" data-hear="${esc(id)}" aria-label="${L ? esc(W(id).word) : "not met yet"}">${puzzle(id, L)}
      <span class="w">${L ? esc(W(id).word) : "?"}</span>${L && !opts.static ? `<span class="spk">${ICO("speaker")}</span>` : ""}</button>${go}</div>`;
  }

  // ---------- child: dashboard ----------
  function home() {
    const anyDusty = WORDS.some((w) => open(w.id) && dusty(w.id));
    const tiles = TILES.map((t) => {
      if (t.key === "album") {
        const badge = !S.albumSeen ? "NEW" : S.crowns.length ? ICO("crown", "bdg") : anyDusty ? ICO("refresh", "bdg") : "";
        return `<button class="ka-tile album-tile ${t.side}" style="grid-area:${t.area}" data-go="album" aria-label="My album">
          <div class="wr" style="background-image:url('${IMG}album-tile.jpg')">
          ${badge ? `<div class="ka-badge"><span>${badge}</span></div>` : ""}
          <div class="label"><span>${t.lab}</span></div></div></button>`;
      }
      const act = t.key === "games" ? `data-go="games"` : t.key === "pinocchio" ? `data-play="pino" data-ret="home"` : "data-soon";
      return `<button class="ka-tile ${t.side}" style="grid-area:${t.area}" ${act}>
        <div class="wr" style="background-image:url('${t.bg}')">
          ${t.tick ? `<div class="ka-tick"><img src="${A.tick}" alt="completed"></div>` : ""}
          <div class="iw" style="width:${t.w}px"><img src="${t.img}" alt=""></div>
          <div class="label" style="background:${t.color}"><span>${t.lab}</span></div></div></button>`;
    }).join("");
    let pop = "";
    if (S.crowns.length) pop = popBoard(`<div class="mini-row">${S.crowns.map((id) => cardHTML(id, { static: true })).join("")}</div>`, "crownok", "crownsay", "OK", true);
    else if (S.engine && !S.popupSeen) pop = popBoard(`<div class="mini-row">${WORDS.filter((w) => w.u === CURRENT && lv(w.id) === 1).map((w) => cardHTML(w.id, { static: true })).join("")}</div>`, "popopen", "popsay", "OPEN");
    return `<header class="ka-header">
        <button class="ka-lesson" data-soon><div class="ka-teacher"><div><img class="photo" src="${IMG}teacher-anna.jpg" alt=""></div></div>
          <div class="ka-info"><span class="t-mikado">Next class:</span><span class="t-mikado" style="color:#6D3DE4">${dayName(S.day < 4 ? 4 : S.day + 2)}, 05:00 pm</span></div></button>
        <button class="ka-icon-btn ka-dq" aria-label="daily quest" data-soon><img src="${A.dq}" alt=""></button>
        <button class="ka-icon-btn ka-shop" data-soon><img src="${A.shop}" alt=""></button>
        ${coins()}
        <div class="ka-profile"><div class="ka-avatar"><div class="ch"><img src="${A.avatar}" alt=""></div></div><div class="ka-nick"><span class="t-mikado">${KID}</span></div></div>
      </header>
      <div class="ka-tiles g6">${tiles}</div>${pop}`;
  }
  function popBoard(inner, act, sayAct, btn, gold) {
    return `<div class="ka-pop-wrap"><div class="ka-board" style="min-width:280px">
      <button class="ka-close" data-act="${act}" aria-label="close">✕</button>
      <div class="in"><img class="pic" src="${IMG}teacher-anna.jpg" alt="" style="width:46px;height:46px">${inner}<button class="pop-spk" data-act="${sayAct}" aria-label="Listen">${ICO("speaker")}</button></div>
      <button class="ka-btn ${gold ? "gold" : ""}" data-act="${act}"><div class="bi"><span>${btn}</span></div></button></div></div>`;
  }
  const POP_TEXT = () => `Hi ${KID}! You met six new food words with ${TEACHER}. Play games to upgrade your cards!`;
  const CROWN_TEXT = () => `${TEACHER} gave you the last puzzle piece for ${S.crowns.map((id) => W(id).word).join(" and ")}! Your card is gold!`;

  // ---------- child: album ----------
  function album() {
    const u = UNITS.find((x) => x.id === S.tab) || UNITS[5], rec = recommended();
    const tabs = UNITS.map((x) => {
      if (x.locked) return `<button class="gtab locked" data-lockedtab="${x.id}" aria-label="${x.name}, locked"><span class="ic">${TICO(x)}</span><span class="nm">${x.n}. ${x.name}</span><span class="lk">${ICO("lock")}</span></button>`;
      const ids = x.w.map(([w]) => w);
      const pct = Math.round((ids.reduce((s, id) => s + lv(id), 0) / (ids.length * 5)) * 100);
      const hot = ids.some((id) => rec.includes(id)), dz = ids.some(dusty);
      return `<button class="gtab ${x.id === u.id ? "on" : ""}" data-tab="${x.id}"><span class="ic">${TICO(x)}</span><span class="nm">${x.n}. ${x.name}</span>${dz ? `<span class="dz">${ICO("refresh")}</span>` : hot ? `<span class="hot"></span>` : ""}
        <span class="bar"><i style="width:${pct}%"></i></span></button>`;
    }).join("");
    return `${innerHeader("home", "MY ALBUM")}
      <div class="alb3"><div class="gtabs" id="gtabs">${tabs}</div>
        <div class="cards" id="cards">${u.w.map(([w]) => cardHTML(w, { rec })).join("")}</div></div>`;
  }

  // ---------- child: games menu (replica of Kids Area Games) ----------
  const ICN = "https://school.novakidschool.com/student/latest/static/";
  const MENU = [
    { k: "bubbles", name: "BUBBLES", col: "#E8B43C", bg: "#F2D292", art: `<img src="${ICN}svg/bubbles.2550282a.svg" alt="">` },
    { k: "boxes", name: "BOX BATTLE", col: "#45CAD3", bg: "#62E8FB", art: `<img class="mico" src="assets/img/ui/box.jpg" alt="">` },
    { k: "racing", name: "RACING", col: "#3D9C55", bg: "#82CF93", art: `<img src="${ICN}image/racing.573ee022.png" alt="">` },
    { k: "memo", name: "MEMO MIX", col: "#D58BE4", bg: "#EFAFFA", art: `<img src="${ICN}svg/bubble-memo.7d03e739.svg" alt="">` },
    { k: "snake", name: "SNAKE", col: "#8682EA", bg: "#A6A4F0", art: `<img src="${ICN}image/snake.b00f76bf.png" alt="">` },
    { k: "quiz", name: "QUIZ CORNER", col: "#1FB2D8", bg: "#53D6FF", art: `<img class="mico" src="assets/img/ui/quiz.jpg" alt="">` },
  ];
  function games() {
    const q = S.engine ? queue() : [];
    return `${innerHeader("home", "GAMES")}
      <div class="gm-grid">${MENU.map((m) => {
        const cnt = q.filter((x) => x.game === m.k).length;
        return `<button class="gm" data-play="${m.k}" data-ret="games" style="--c:${m.col};--b:${m.bg}">
          <span class="hd">${m.name}</span><span class="art">${m.art}</span>
          ${cnt ? `<span class="alb-badge"><img src="${IMG}album-icon.jpg" alt="">${cnt}</span>` : ""}</button>`;
      }).join("")}</div>`;
  }

  // ---------- game sessions: DOM replicas of the Kids Area games (their own art, loaded from school.novakidschool.com) ----------
  const G0 = "https://school.novakidschool.com/games/", CDN = "https://cdn.novakidschool.com/api/0/files/";
  const GA = {
    sky: G0 + "quiz/assets/background.3350a184.svg", help: G0 + "assets/buttons/icon/icon_help.svg", flag: G0 + "assets/buttons/icon/icon_surrender.svg",
    listen: G0 + "assets/buttons/icon/icon_listen.svg", back: G0 + "assets/buttons/icon/back/normal.svg",
    pLabel: G0 + "quiz/assets/player.37ffa0be.svg", eLabel: G0 + "quiz/assets/enemy.61c4fa1d.svg",
    trophy: CDN + "5v_zyN5hTuyVFHjdE8Ti9A", avBg: CDN + "J3YuxiLKSkqYZvfuPpv41w", enemyAv: CDN + "CaT7Oc8sSPqp4XKSlMokqA",
    blueShort: G0 + "assets/banners/title/blue-short.svg", winG: G0 + "assets/banners/winner_green.svg", winR: G0 + "assets/banners/winner_red.svg",
    qTile: G0 + "quiz/assets/default.1ca2e341.svg", qOpt: G0 + "quiz/assets/default.26a6ae60.svg", qMe: G0 + "quiz/assets/player.210c6808.svg",
    qOk: G0 + "quiz/assets/correct.d855c117.svg", qBad: G0 + "quiz/assets/incorrect.348ea4a1.svg", qEnemy: G0 + "quiz/assets/enemy.05954e7a.svg",
    memoTitle: G0 + "assets/banners/title/blue.svg", memoCard: G0 + "memo/assets/card.41b61622.svg",
    box: G0 + "boxes/assets/box.bc479f5b.svg", boxCard: G0 + "boxes/assets/boxes-card-blank.7e4643d8.svg", boxSlot: G0 + "boxes/assets/blank.60831bb7.svg",
    bub: G0 + "bubbles/assets/img/bubble_sprite.svg", bubSel: G0 + "bubbles/assets/img/bubble_sprite_selected.svg", bubBad: G0 + "bubbles/assets/img/bubble_sprite_wrong.svg",
    bubHint: G0 + "bubbles/assets/img/bubble_sprite_hint.svg", bubBar: G0 + "bubbles/assets/img/battle_word_bg.svg", bubMission: G0 + "bubbles/assets/img/bubbles_mission_bg.svg",
    bubEnemy: G0 + "bubbles/assets/img/bubble_enemy_bg.svg", bubHintBtn: G0 + "bubbles/assets/img/hint_button_bg.svg", bubBg: G0 + "bubbles/assets/img/bubbles_background.svg",
    bubMini: G0 + "bubbles/assets/img/bubble_enemy_bubble_normal.svg",
    rSky: G0 + "racing/assets/sky.4926bbde.png", rTrees: G0 + "racing/assets/trees_1024.d612d7c9.png", rTower: G0 + "racing/assets/tower_0.5.91798f95.png",
    rClouds: G0 + "racing/assets/clouds_cropped_0.5.f9bbe10e.png", rShip: G0 + "racing/assets/spaceship.4f132245.png", rStar: G0 + "racing/assets/star_yellow.c2b45e9f.png",
    rStarBlue: G0 + "racing/assets/star_blue.dda716e6.png", rField: G0 + "racing/assets/field.3595ca41.svg", rQ: G0 + "racing/assets/questionSymbol.98247274.svg", rA: G0 + "racing/assets/answerSymbol.d8231c22.svg",
    sBg: G0 + "snake/assets/background.ece45b59.svg", sHead: G0 + "snake/assets/snake.87cfe96d.png", sBody: G0 + "snake/assets/snake_body.6969d3ab.png",
    sTail: G0 + "snake/assets/snake_tail1.df374619.png", sEggs: G0 + "snake/assets/eggs.8c647ee5.png",
  };
  Object.assign(SND, { right: G0 + "racing/assets/right.3d699fab.mp3", wrong: G0 + "racing/assets/wrong.527348da.mp3", win: G0 + "racing/assets/win.3c0e07ba.mp3", defeat: G0 + "racing/assets/defeat.8e3b1393.mp3" });
  ["right", "wrong"].forEach((n) => { try { pool(n); } catch (e) {} });
  const ENEMY = "Lily";
  const letters = (id) => W(id).word.toLowerCase().replace(/[^a-z]/g, "");
  const ABC = "abcdefghijklmnopqrstuvwxyz";
  const randLetters = (n, not) => shuffle(ABC.split("").filter((l) => !not.includes(l))).slice(0, n);

  function startGame(game, focus, ret) {
    const G = GAME[game];
    let ids = [];
    if (S.engine || focus) ids = (focus ? [focus] : []).concat(queue().filter((q) => q.game === game && q.id !== focus).map((q) => q.id)).slice(0, G.n);
    if (ids.length < G.n) { // top up with words the child already owns (practice only, no level-up); prefer the same unit
      const unit = ids.length ? W(ids[0]).u : CURRENT;
      const pool = WORDS.filter((w) => open(w.id) && lv(w.id) >= 1 && !ids.includes(w.id) && (game === "quiz" ? lv(w.id) >= 3 : true));
      ids = ids.concat(shuffle(pool.filter((w) => w.u === unit)).map((w) => w.id), shuffle(pool.filter((w) => w.u !== unit)).map((w) => w.id)).slice(0, G.n);
    }
    if (!S.engine && !focus) ids = shuffle(WORDS.filter((w) => open(w.id) && lv(w.id) >= 1).map((w) => w.id)).slice(0, G.n); // today: random words
    const items = ids.map((id) => { const st = nextStep(id); return { id, kind: st.k, up: st.game === game }; });
    [...new Set(items.filter((it) => it.up).map((it) => playKey(it.id)))].forEach((k) => { S.plays[k] = (S.plays[k] || 0) + 1; });
    const ses = { game, items, i: 0, ret, att: {}, err: {}, upgrades: [], refreshed: [], dropped: [], starsBefore: S.stars, me: 0, bot: 0, t0: Date.now() };
    if (game === "memo") { ses.cards = shuffle(ids.flatMap((id) => [{ id, t: "pic" }, { id, t: "word" }])).map((c) => Object.assign(c, { open: true })); ses.flip = []; ses.turn = "me"; ses.preview = true; }
    if (game === "boxes") setupBoxes(ses);
    S.session = ses;
    if (!["memo", "boxes"].includes(game)) prepItem();
    S.screen = "play"; save(); render(); startMusic();
    say(G.intro); prompt(true);
    if (game === "memo") setTimeout(() => { if (S.session === ses) { ses.cards.forEach((c) => { c.open = false; }); ses.preview = false; save(); render(); } }, 3500);
    startTimers();
  }
  const cur = () => S.session.items[S.session.i];
  function prepItem() {
    const ses = S.session, it = cur(), g = ses.game, same = WORDS.filter((w) => w.u === W(it.id).u && w.id !== it.id).map((w) => w.id);
    Object.assign(it, { hint: false, solved: false, failed: false, wrong: [], listening: false, fb: null, t0: Date.now() });
    if (g === "quiz") { it.opts = shuffle([it.id, ...shuffle(same).slice(0, 2)]); it.pick = null; it.enemy = null; }
    if (g === "bubbles") {
      const L = letters(it.id).split(""), total = 12;
      const fill = Array.from({ length: Math.max(0, total - L.length) }, () => ABC[Math.floor(Math.random() * 26)]);
      const slots = BUB_SLOTS.slice(0, total);
      it.bubbles = shuffle(L.concat(fill)).map((ch, k) => ({ ch, x: slots[k][0], y: slots[k][1], sel: false })); it.pos = 0; it.typed = "";
    }
    if (g === "racing") { const L = letters(it.id); it.miss = L.length <= 4 ? 0 : Math.floor(Math.random() * L.length); raceReset(); }
    if (g === "snake") {
      const need = letters(it.id)[0]; it.need = need;
      const prev = ses.snake; ses.snake = prev || [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]; ses.dir = ses.dir || "R";
      it.eggs = shuffle([need, ...randLetters(2, [need])]).map((ch, k) => Object.assign({ ch, c: k % 3 }, freeCell(ses)));
    }
  }
  function prompt(queued) {
    const ses = S.session, g = ses.game;
    if (g === "memo") return;
    if (g === "boxes") { const c = ses.deck[ses.deck.length - 1]; if (c) say(W(c).word, queued); return; }
    const it = cur();
    if (g === "quiz") return say("What is it?", queued);
    if (g === "pino") return say("What's this?", queued);
    say(W(it.id).word, queued);
  }
  function attempt(id, correct, extra = {}) {
    const ses = S.session; ses.att[id] = (ses.att[id] || 0) + 1; if (!correct) ses.err[id] = (ses.err[id] || 0) + 1;
    const it = ses.items.find((x) => x.id === id) || {};
    logEvent(Object.assign({ game: ses.game, item: id, competency: compId(id, GAME[ses.game].skill), attempt: ses.att[id], correct, hint: !!it.hint, latency_ms: it.t0 ? Date.now() - it.t0 : 0, superscore: superscore(correct, ses.att[id], it.hint), counts: !!it.up }, extra));
    sfx(correct ? "right" : "wrong", 0.5);
  }
  function levelUp(id, to) {
    if (lv(id) >= to) return false;
    S.ups.push({ id, from: lv(id), to, day: S.day }); S.lv[id] = to; S.up[id] = S.day; S.stars += STAR_UP;
    if (to === 4) { S.rev[id] = S.day; S.iv[id] = FIRST_IV; }
    if (S.session) S.session.upgrades.push(id);
    return true;
  }
  let advT;
  function advanceSoon(ms) { clearTimeout(advT); advT = setTimeout(() => { if (S.screen === "play" && S.session) next(); }, ms); }
  function solved(it, upgraded, extraHTML = "") {
    it.solved = true; it.listening = false;
    it.fb = { cls: "ok", html: `${ICO("check")} ${esc(W(it.id).word)}${upgraded ? ` ${ICO("levelup")}<img src="${A.star}" alt="">+${STAR_UP}` : extraHTML}` };
    say(`Yes! ${W(it.id).word}!`); if (upgraded) say("Your card levelled up!", true);
    save(); render(); advanceSoon(upgraded ? 2400 : 1400);
  }
  function next() {
    S.session.i += 1;
    if (S.session.i >= S.session.items.length) return finish();
    prepItem(); save(); render(); prompt();
  }

  // timers: one light interval for the clock + bots; Snake has its own movement loop
  let tickT = null, snakeT = null;
  function startTimers() {
    stopTimers();
    tickT = setInterval(() => {
      const ses = S.session; if (S.screen !== "play" || !ses) return stopTimers();
      const sec = Math.floor((Date.now() - ses.t0) / 1000), el = $("#gclock"); if (el) el.textContent = clock(Math.max(0, 300 - sec));
      if ((ses.game === "boxes" || ses.game === "bubbles") && sec > 0 && sec % (ses.game === "boxes" ? 4 : 7) === 0 && !ses.over) { ses.bot += 1; const b = $("#gbot"); if (b) b.textContent = ses.bot; }
    }, 1000);
    if (S.session && S.session.game === "snake") snakeT = setInterval(stepSnake, 260);
  }
  function stopTimers() { clearInterval(tickT); clearInterval(snakeT); tickT = snakeT = null; }
  const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Quiz Corner — retention: picture on top, three words, first try counts
  function onQuiz(o) {
    const ses = S.session, it = cur(); if (it.pick) return;
    it.pick = o; const ok = o === it.id; attempt(it.id, ok, { chosen: o });
    it.enemy = Math.random() < 0.8 ? it.id : it.opts.find((x) => x !== it.id);
    if (ok) ses.me += 3; if (it.enemy === it.id) ses.bot += 3;
    if (ok) {
      if (it.up && it.kind === "recall") { const up = levelUp(it.id, 4); it.solved = true; say(`Yes! ${W(it.id).word}!`); if (up) say("Your card levelled up!", true); }
      else if (it.up && it.kind === "review") { S.rev[it.id] = S.day; S.iv[it.id] *= 2; S.stars += STAR_REFRESH; ses.refreshed.push(it.id); it.solved = true; say(`Yes! ${W(it.id).word}! Shiny again!`); }
      else { it.solved = true; say(`Yes! ${W(it.id).word}!`); }
    } else {
      it.failed = true;
      if (it.up && it.kind === "review") { S.lv[it.id] = 3; S.up[it.id] = S.day; ses.dropped.push(it.id); }
      if (it.up && it.kind === "recall") S.up[it.id] = S.day - RECALL + 1;
      say(`It's ${W(it.id).word}. We'll practise it again!`);
    }
    save(); render(); advanceSoon(2200);
  }
  // Memo Mix — picture ↔ word pairs, turns with a bot
  let memoLock = false;
  function onMemo(k) {
    const ses = S.session, c = ses.cards[k];
    if (memoLock || ses.preview || ses.turn !== "me" || c.open || c.matched) return;
    c.open = true; ses.flip.push(k); if (c.t === "word") say(W(c.id).word);
    if (ses.flip.length === 2) {
      const [a, b] = ses.flip.map((x) => ses.cards[x]);
      if (a.id === b.id) {
        a.matched = b.matched = true; ses.flip = []; ses.me += 1; attempt(a.id, true); say(`Yes! ${W(a.id).word}!`, true);
        if (ses.cards.every((x) => x.matched)) { ses.over = true; save(); render(); setTimeout(finish, 1500); return; }
      } else {
        const w = a.t === "word" ? a : b.t === "word" ? b : a; attempt(w.id, false, { chosen: (w === a ? b : a).id });
        memoLock = true;
        setTimeout(() => { a.open = b.open = false; ses.flip = []; ses.turn = "bot"; save(); render(); botMemo(); }, 1200);
      }
    }
    save(); render();
  }
  function botMemo() { // the bot opens two cards that don't match, then it's the child's turn again
    const ses = S.session; if (!ses || ses.game !== "memo") return;
    const closed = ses.cards.map((c, k) => k).filter((k) => !ses.cards[k].matched);
    const a = closed[Math.floor(Math.random() * closed.length)], b = closed.find((k) => k !== a && ses.cards[k].id !== ses.cards[a].id);
    setTimeout(() => { if (S.session !== ses) return; if (b !== undefined) { ses.cards[a].open = ses.cards[b].open = true; render(); }
      setTimeout(() => { if (S.session !== ses) return; ses.cards.forEach((c) => { if (!c.matched) c.open = false; }); ses.turn = "me"; memoLock = false; save(); render(); }, 1100); }, 700);
  }
  // Box Battle — two chests are topics (as in Kids Area, where chests are categories); drag each picture card into its topic
  function setupBoxes(ses) {
    const A = W(ses.items[0].id).u;
    const units = UNITS.filter((u) => !u.locked && u.id !== A && u.w.some(([w]) => lv(w) >= 1));
    const B = (units.find((u) => ses.items.some((it) => W(it.id).u === u.id)) || units[Math.floor(Math.random() * units.length)]).id;
    let cards = ses.items.filter((it) => W(it.id).u === A).map((it) => it.id).slice(0, 4);
    const more = (u, n) => shuffle(WORDS.filter((w) => w.u === u && lv(w.id) >= 1 && !cards.includes(w.id)).map((w) => w.id)).slice(0, n);
    cards = cards.concat(more(B, 6 - cards.length >= 3 ? 3 : 2)); cards = cards.concat(more(A, 6 - cards.length)).slice(0, 6);
    const was = Object.fromEntries(ses.items.map((it) => [it.id, it]));
    ses.items = cards.map((id) => was[id] || { id, kind: nextStep(id).k, up: false });
    ses.chests = shuffle([A, B]); ses.deck = shuffle(cards); ses.total = cards.length; ses.glow = null;
  }
  function onBox(topic) {
    const ses = S.session; if (ses.over || !ses.deck.length) return;
    const c = ses.deck[ses.deck.length - 1];
    if (W(c).u === topic) {
      attempt(c, true); ses.deck.pop(); ses.me += 1; ses.glow = { id: topic, ok: true };
      if (!ses.deck.length) { ses.over = true; ses.win = ses.me >= ses.bot; say(ses.win ? "You win!" : "Good try!"); sfx(ses.win ? "win" : "defeat", 0.5); save(); render(); setTimeout(finish, 2000); return; }
      save(); render(); setTimeout(() => { if (S.session === ses) { ses.glow = null; render(); prompt(); } }, 600);
    } else { attempt(c, false, { chosen: topic }); ses.glow = { id: topic, ok: false }; say(`Oops! ${W(c).word}!`); save(); render(); setTimeout(() => { if (S.session === ses) { ses.glow = null; render(); } }, 700); }
  }
  // Bubbles — pop letter bubbles to spell the word for the picture
  const BUB_SLOTS = [[187, 245], [247, 245], [307, 245], [367, 245], [427, 245], [217, 196], [277, 196], [337, 196], [397, 196], [247, 147], [307, 147], [367, 147]];
  function onBubble(k) {
    const it = cur(); if (it.solved) return;
    const b = it.bubbles[k], need = letters(it.id)[it.pos];
    if (b.sel) return;
    if (b.ch === need) {
      b.sel = true; it.pos += 1; it.typed += b.ch;
      if (it.pos >= letters(it.id).length) { attempt(it.id, true); S.session.me += 3; const ok = it.up && !it.hint && (S.session.err[it.id] || 0) <= 1; return solved(it, ok && levelUp(it.id, 3)); }
      sfx("click", 0.4); save(); render();
    } else { attempt(it.id, false, { chosen: b.ch }); b.bad = true; save(); render(); setTimeout(() => { b.bad = false; render(); }, 500); }
  }
  // Racing — stars with letters fly towards the ship; move the ship up/down (arrow keys) to touch the missing letter
  const LANES = [52, 96, 140, 184, 226], SHIP_X = 12, STAR_SPEED = 85;
  let RACE = null, raceRAF = null;
  function raceReset() { RACE = { lane: (RACE && RACE.lane) || 2, stars: [], last: 0, wrong: [] }; }
  function raceWave() {
    const it = cur(), need = letters(it.id)[it.miss], lanes = shuffle([0, 1, 2, 3, 4]).slice(0, 3);
    shuffle([need, ...randLetters(2, [need])]).forEach((ch, k) => RACE.stars.push({ ch, lane: lanes[k], x: 640 + k * 95, el: null, state: "" }));
  }
  function raceShip(d) { if (!RACE) return; RACE.lane = Math.max(0, Math.min(4, RACE.lane + d)); const s = $("#ship"); if (s) s.style.top = LANES[RACE.lane] - 19 + "px"; }
  function raceLoop(ts) {
    raceRAF = null;
    const ses = S.session; if (S.screen !== "play" || !ses || ses.game !== "racing" || !RACE) return;
    const it = cur(), layer = $("#raceLayer");
    const dt = RACE.last ? Math.min(0.05, (ts - RACE.last) / 1000) : 0; RACE.last = ts;
    if (layer && !it.solved) {
      if (!RACE.stars.length) raceWave();
      const need = letters(it.id)[it.miss];
      for (const s of RACE.stars) {
        if (!s.el || !s.el.isConnected) { s.el = document.createElement("div"); s.el.className = "star" + (s.state ? " " + s.state : ""); s.el.innerHTML = `<i></i><span>${s.ch}</span>`; layer.appendChild(s.el); }
        s.x -= STAR_SPEED * dt;
        s.el.style.transform = `translate3d(${s.x}px, ${LANES[s.lane] - 19}px, 0)`;
        if (!s.state && s.lane === RACE.lane && s.x < SHIP_X + 84 && s.x > SHIP_X + 20) {
          if (s.ch === need) {
            s.state = "got"; attempt(it.id, true); ses.me += 1;
            const ok = it.up && !it.hint && (ses.err[it.id] || 0) <= 1; RACE.stars.forEach((o) => o.el && o.el.remove()); RACE.stars = [];
            return solved(it, ok && levelUp(it.id, 3));
          }
          s.state = "bad"; s.el.classList.add("bad"); attempt(it.id, false, { chosen: s.ch }); RACE.wrong.push(s.ch); say(W(it.id).word);
          const a = $("#raceAns"); if (a) a.innerHTML = ansHTML(it);
        }
      }
      RACE.stars = RACE.stars.filter((s) => { if (s.x < -60) { s.el && s.el.remove(); return false; } return true; });
    }
    raceRAF = requestAnimationFrame(raceLoop);
  }
  const ansHTML = (it) => Array.from({ length: 5 }, (_, k) => { const w = RACE ? RACE.wrong[k] : null; return w ? `<b class="bad">${w}</b>` : it.solved && k === (RACE ? RACE.wrong.length : 0) ? `<b class="ok">${letters(it.id)[it.miss]}</b>` : "<b>-</b>"; }).join("");
  // Snake — eat the egg with the first letter
  const SN_W = 20, SN_H = 8, CELL = 26;
  function freeCell(ses) { let c; do { c = { x: 2 + Math.floor(Math.random() * (SN_W - 4)), y: 1 + Math.floor(Math.random() * (SN_H - 2)) }; } while ((ses.snake || []).some((p) => p.x === c.x && p.y === c.y)); return c; }
  const DIRS = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }, OPP = { U: "D", D: "U", L: "R", R: "L" };
  function turn(d) { const ses = S.session; if (!ses || ses.game !== "snake") return; if (d !== OPP[ses.dir]) ses.nextDir = d; }
  function stepSnake() {
    const ses = S.session; if (S.screen !== "play" || !ses || ses.game !== "snake") return stopTimers();
    const it = cur(); if (it.solved || ses.pause) return;
    if (ses.nextDir) { ses.dir = ses.nextDir; ses.nextDir = null; }
    const [dx, dy] = DIRS[ses.dir], h = ses.snake[0];
    const nh = { x: (h.x + dx + SN_W) % SN_W, y: (h.y + dy + SN_H) % SN_H };
    ses.snake.unshift(nh);
    const e = it.eggs.findIndex((g) => g.x === nh.x && g.y === nh.y);
    if (e >= 0) {
      const egg = it.eggs[e];
      if (egg.ch === it.need) { it.eggs = []; attempt(it.id, true); ses.me += 1; drawSnake(); const ok = it.up && !it.hint && (ses.err[it.id] || 0) === 0; return solved(it, ok && levelUp(it.id, 3)); }
      attempt(it.id, false, { chosen: egg.ch }); it.eggs.splice(e, 1); ses.snake.pop(); if (ses.snake.length > 3) ses.snake.pop(); say(W(it.id).word);
    } else ses.snake.pop();
    drawSnake();
  }
  function snakeHTML() {
    const ses = S.session, it = cur(), n = ses.snake.length, rot = { R: 0, D: 90, L: 180, U: 270 };
    const seg = ses.snake.map((p, k) => {
      const cls = k === 0 ? "sh" : k === n - 1 ? "st" : "sb";
      const nb = k === 0 ? ses.dir : (() => { const q = ses.snake[k - 1]; const dx = (q.x - p.x + SN_W) % SN_W, dy = (q.y - p.y + SN_H) % SN_H; return dx === 1 ? "R" : dx === SN_W - 1 ? "L" : dy === 1 ? "D" : "U"; })();
      return `<i class="${cls}" style="left:${p.x * CELL}px;top:${p.y * CELL}px;transform:rotate(${rot[nb]}deg)"></i>`;
    }).join("");
    const eggs = it.eggs.map((g) => `<b class="egg e${g.c}" style="left:${g.x * CELL}px;top:${g.y * CELL}px">${g.ch}</b>`).join("");
    return seg + eggs;
  }
  function drawSnake() { const el = $("#snakeField"); if (el) el.innerHTML = snakeHTML(); }

  // Pinocchio — say the word (speech recognition when available, demo buttons otherwise)
  function onSaid(ok) {
    const it = cur();
    if (it.solved || it.failed) return;
    attempt(it.id, ok);
    if (ok) return solved(it, it.up && !it.hint && S.session.att[it.id] <= 2 && levelUp(it.id, 3));
    it.listening = false; it.fb = { cls: "no", html: ICO("retry") }; say("Hmm, not quite. Try again!"); save(); render();
  }
  let recog;
  function startMic() {
    const it = cur(); it.listening = true; render();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    try {
      recog = new SR(); recog.lang = "en-US"; recog.maxAlternatives = 3;
      recog.onresult = (e) => { const heard = [...e.results[0]].map((r) => r.transcript.toLowerCase()); onSaid(heard.some((h) => h.includes(W(it.id).word.toLowerCase()))); };
      recog.onerror = () => {}; recog.start();
    } catch (e) {}
  }
  function stopMic() { try { recog && recog.abort(); } catch (e) {} }
  function stopAll() { clearTimeout(advT); stopTimers(); stopMic(); memoLock = false; if (raceRAF) cancelAnimationFrame(raceRAF); raceRAF = null; RACE = null; }

  function finish() {
    const ses = S.session; if (!ses) return;
    if (ses.game === "memo") ses.items.forEach((it) => { if (it.up && (ses.err[it.id] || 0) <= 2) levelUp(it.id, 2); });
    if (ses.game === "boxes") ses.items.forEach((it) => { if (it.up && !ses.deck.includes(it.id) && !(ses.err[it.id] || 0)) levelUp(it.id, 2); });
    const win = ses.win !== undefined ? ses.win : ses.me >= ses.bot;
    S.lastSummary = { ids: [...new Set(ses.upgrades)], refreshed: ses.refreshed, dropped: ses.dropped, stars: S.stars - ses.starsBefore, ret: ses.ret, game: ses.game, win, pvp: PVP.includes(ses.game) };
    stopAll(); S.session = null; S.screen = "summary"; save(); render(); startMusic();
    const n = S.lastSummary.ids.length, r = S.lastSummary.refreshed.length;
    say(n ? `Wow! ${n === 1 ? "One card" : n + " cards"} levelled up!` : r ? "Your cards are shiny again!" : "Good practice!");
  }

  // ----- rendering -----
  const PVP = ["quiz", "memo", "boxes", "bubbles"];
  const ico = (src, cls, act, label) => `<button class="gi ${cls}" ${act} aria-label="${label}"><img src="${src}" alt=""></button>`;
  function widget(side, ses, turn) {
    const me = side === "me";
    return `<div class="pw ${side} ${turn ? "turn" : ""}">
      <div class="av"><img class="bgc" src="${GA.avBg}" alt=""><img class="ch" src="${me ? A.avatar : GA.enemyAv}" alt=""></div>
      <div class="lbl"><img src="${me ? GA.pLabel : GA.eLabel}" alt=""><span>${me ? KID : ENEMY}</span></div>
      <div class="tr"><img src="${GA.trophy}" alt=""><b ${me ? "" : `id="gbot"`}>${me ? ses.me : ses.bot}</b></div>
      ${turn ? `<div class="turnclock">0:30</div>` : ""}</div>`;
  }
  const listenBtn = (id, cls = "") => `<button class="gi lis ${cls}" data-sayw="${esc(id)}" aria-label="Listen"><img src="${GA.listen}" alt=""></button>`;
  const quitBtn = () => ico(GA.flag, "flag", `data-act="quit"`, "Leave the game");
  const helpBtn = () => ico(GA.help, "help", `data-act="ghelp"`, "How to play");
  const timer = (ses) => `<div class="gclock" id="gclock">${clock(Math.max(0, 300 - Math.floor((Date.now() - ses.t0) / 1000)))}</div>`;

  function play() {
    const ses = S.session, g = ses.game;
    if (g === "quiz") {
      const it = cur(), tile = (o) => it.pick ? (o === it.id ? GA.qOk : o === it.pick ? GA.qBad : o === it.enemy ? GA.qEnemy : GA.qOpt) : GA.qOpt;
      return `<div class="gscene sky"></div>
        <div class="qz-rib"><img src="${GA.blueShort}" alt="">${prim(`${ses.i + 1}/${ses.items.length}`, 16)}</div><div class="qz-line"></div>
        ${ico(GA.back, "qexit", `data-act="quit"`, "Leave the game")}
        ${widget("me", ses)}${widget("enemy", ses)}
        <div class="qz-q"><img class="t" src="${GA.qTile}" alt="">${pic(it.id)}</div>
        ${it.opts.map((o, k) => `<button class="qz-o" style="left:${[106, 243, 381][k]}px" data-quiz="${esc(o)}" ${it.pick ? "disabled" : ""}><img class="t" src="${tile(o)}" alt=""><span>${esc(W(o).word)}</span></button>`).join("")}`;
    }
    if (g === "memo") {
      const cols = 4, rows = Math.ceil(ses.cards.length / cols), tw = 64, th = 50, gap = 6, x0 = (616 - (cols * tw + (cols - 1) * gap)) / 2, y0 = 92 + (4 - rows) * 22;
      return `<div class="gscene sky"></div>
        <div class="mm-rib"><img src="${GA.memoTitle}" alt="">${prim("MEMO MIX", 14)}</div>
        ${quitBtn()}${widget("me", ses, ses.turn === "me" && !ses.preview)}${widget("enemy", ses, ses.turn === "bot")}
        ${ses.cards.map((c, k) => `<button class="mm-c ${c.matched ? "ok" : ""}" style="left:${x0 + (k % cols) * (tw + gap)}px;top:${y0 + Math.floor(k / cols) * (th + gap)}px" data-memo="${k}">
          <img class="t" src="${GA.memoCard}" alt="">${c.open || c.matched ? (c.t === "pic" ? `${pic(c.id)}` : `<span class="w">${esc(W(c.id).word)}</span>`) : ""}</button>`).join("")}
        ${ses.preview ? `<div class="mm-hint">${prim("REMEMBER!", 13)}</div>` : ""}`;
    }
    if (g === "boxes") {
      const deck = ses.deck.map((id, k) => { const isTop = k === ses.deck.length - 1; return `<div class="bx-card ${isTop ? "top" : ""}" style="left:${12 + k * 40}px"><img class="t" src="${GA.boxCard}" alt="">${pic(id)}${isTop ? listenBtn(id, "card-lis") : ""}</div>`; }).join("");
      const slots = ses.deck.map((_, k) => `<div class="bx-slot" style="left:${364 + (k % 5) * 49}px;top:${209 + Math.floor(k / 5) * 51}px"><img src="${GA.boxSlot}" alt=""></div>`).join("");
      const name = (u) => UNITS.find((x) => x.id === u).name.toLowerCase();
      return `<div class="gscene sky"></div>
        ${helpBtn()}${timer(ses)}${quitBtn()}${widget("me", ses)}${widget("enemy", ses)}
        ${ses.chests.map((u, k) => `<div class="bx-lab" style="left:${[174, 320][k]}px">${prim(name(u), 19)}</div>
          <button class="bx-chest ${ses.glow && ses.glow.id === u ? (ses.glow.ok ? "ok" : "bad") : ""}" style="left:${[174, 320][k]}px" data-box="${u}" aria-label="${name(u)} chest"><img src="${GA.box}" alt=""></button>
          <button class="gi lis chest-lis" style="left:${[174, 320][k] + 92}px" data-sayt="${esc(name(u))}" aria-label="Listen"><img src="${GA.listen}" alt=""></button>`).join("")}
        <div class="bx-deck">${deck}</div>${slots}
        ${ses.over ? `<div class="g-result"><img src="${ses.win ? GA.winG : GA.winR}" alt="">${prim(ses.win ? "YOU WIN!" : "GOOD TRY!", 16)}</div>` : ""}`;
    }
    if (g === "bubbles") {
      const it = cur(), need = letters(it.id)[it.pos];
      return `<div class="gscene bub"></div>
        ${helpBtn()}${timer(ses)}<button class="bb-hint" data-act="hint" ${it.hint || it.solved ? "disabled" : ""}><img src="${GA.bubHintBtn}" alt=""><span>HINT</span></button>
        <div class="bb-mis"><img class="t" src="${GA.bubMission}" alt="">${pic(it.id)}${listenBtn(it.id, "mis-lis")}</div>
        <div class="bb-en"><img class="t" src="${GA.bubEnemy}" alt=""><div class="mini">${Array.from({ length: 9 }, () => `<img src="${GA.bubMini}" alt="">`).join("")}</div>
          <div class="en-name"><img src="${GA.trophy}" alt=""><b id="gbot">${ses.bot}</b><span>${ENEMY}</span><img class="ea" src="${GA.enemyAv}" alt=""></div></div>
        ${widget("me", ses)}${quitBtn()}
        ${it.bubbles.map((b, k) => `<button class="bub-b" style="left:${b.x - 28}px;top:${b.y - 28}px" data-bub="${k}" ${it.solved ? "disabled" : ""}><img src="${b.bad ? GA.bubBad : b.sel ? GA.bubSel : it.hint && !b.sel && b.ch === need ? GA.bubHint : GA.bub}" alt=""><span>${b.ch}</span></button>`).join("")}
        <div class="bb-bar"><img src="${GA.bubBar}" alt=""><span>${esc(it.typed)}</span></div>
        ${it.fb ? `<div class="g-fb ${it.fb.cls}">${it.fb.html}</div>` : ""}`;
    }
    if (g === "racing") {
      const it = cur(), L = letters(it.id), shown = L.split("").map((ch, k) => k === it.miss && !it.solved ? "_" : ch).join("");
      if (!RACE) raceReset();
      if (!raceRAF) raceRAF = requestAnimationFrame(raceLoop);
      return `<div class="gscene race"><div class="clouds"></div><div class="trees"></div></div>
        ${helpBtn()}
        <div class="ship" id="ship" style="top:${LANES[RACE.lane] - 19}px"></div>
        <div class="race-layer" id="raceLayer"></div>
        <div class="rc-arrows"><button data-race="-1" aria-label="Up">${ICO("up")}</button><button data-race="1" aria-label="Down">${ICO("down")}</button></div>
        <div class="rc-p left"><img class="t" src="${GA.rField}" alt="">${listenBtn(it.id, "rc-lis")}<span class="pic">${pic(it.id)}</span><span class="w">${shown}</span><img class="sym" src="${GA.rQ}" alt=""></div>
        <div class="rc-p right"><img class="t" src="${GA.rField}" alt=""><span class="w ans" id="raceAns">${ansHTML(it)}</span><img class="sym" src="${GA.rA}" alt=""></div>
        ${quitBtn().replace('class="gi flag"', 'class="gi flag rc-flag"')}
        ${it.fb ? `<div class="g-fb ${it.fb.cls}">${it.fb.html}</div>` : ""}`;
    }
    if (g === "snake") {
      const it = cur(), L = letters(it.id), shown = it.solved ? W(it.id).word : "_" + W(it.id).word.slice(1);
      return `<div class="gscene snake"></div>
        ${timer(ses).replace('class="gclock"', 'class="gclock sn"')}
        <div class="sn-av"><img class="bgc" src="${GA.avBg}" alt=""><img class="ch" src="${A.avatar}" alt=""><b><img src="${CDN}FOyrbWduTsScbXsO4VMxwQ" alt="">${ses.me}</b><span>${KID.toUpperCase()}</span></div>
        <div class="sn-word">${pic(it.id)}<span class="w">${esc(shown)}</span>${listenBtn(it.id, "sn-lis")}</div>
        <div class="sn-board" id="snakeBoard"><div class="sn-field" id="snakeField">${snakeHTML()}</div></div>
        <div class="sn-pad">${["U", "L", "D", "R"].map((d) => `<button data-dir="${d}" aria-label="${d}">${{ U: ICO("up"), L: ICO("up", "rl"), D: ICO("down"), R: ICO("up", "rr") }[d]}</button>`).join("")}</div>
        ${quitBtn().replace('class="gi flag"', 'class="gi flag sn-flag"')}
        ${it.fb ? `<div class="g-fb ${it.fb.cls}">${it.fb.html}</div>` : ""}`;
    }
    // Pinocchio (speaking)
    const it = cur(), pct = Math.round(((ses.i + (it.solved ? 1 : 0)) / ses.items.length) * 100);
    return `<div class="hw-top"><button class="hw-back" data-act="quit" aria-label="back"><img src="${A.hwBack}" alt=""></button></div>
      <div class="hw-bar"><div class="fill" style="width:${pct}%"></div></div><img class="hw-star" src="${A.hwStar}" alt="">
      <span class="g-chip" style="background:${GAME.pino.col}">${GAME.pino.name}</span>
      <div class="hw-body"><div class="sp-wrap"><img class="host" src="${A.pino}" alt="Pinocchio">
        <div class="sp-card ${it.solved ? "right" : ""}">${pic(it.id)}${it.solved || it.hint ? `<span class="sp-w">${esc(W(it.id).word)}</span>` : ""}</div>
        <div class="sp-mic"><button class="mic ${it.listening ? "on" : ""}" data-act="mic" ${it.solved ? "disabled" : ""} aria-label="Speak">${ICO("mic", "big")}</button>
          ${it.listening ? `<div class="demo-say" title="Prototype: choose what the child said"><span>demo</span><button data-act="said-ok" aria-label="said it right">✓</button><button data-act="said-bad" aria-label="said it wrong">✗</button></div>` : ""}</div></div></div>
      ${it.fb ? `<div class="g-fb ${it.fb.cls}">${it.fb.html}</div>` : ""}
      <button class="hw-hint" data-act="hint" ${it.hint || it.solved ? "disabled" : ""} aria-label="Hint">${ICO("hint", "big")}</button>`;
  }
  function summary() {
    const sm = S.lastSummary || { ids: [], refreshed: [], dropped: [], stars: 0, ret: "album" };
    const back = sm.ret === "games" ? "games" : "album";
    const cards = [...sm.ids, ...sm.refreshed.filter((id) => !sm.ids.includes(id)), ...sm.dropped];
    return `${innerHeader(back, back === "games" ? "GAMES" : "MY ALBUM")}
      <div class="sum-wrap"><div class="ka-board"><div class="in">
        ${sm.pvp ? `<div class="sum-ban"><img src="${sm.win ? GA.winG : GA.winR}" alt="">${prim(sm.win ? "YOU WIN!" : "GOOD TRY!", 15)}</div>` : ""}
        <div class="mini-row big">${cards.length ? cards.map((id) => cardHTML(id, { static: true })).join("") : `${ICO("thumbs", "huge")}`}</div>
        <div class="plus"><img src="${A.star}" alt="">+${sm.stars}</div></div>
        <button class="ka-btn" data-go="${back}"><div class="bi"><span>OK</span></div></button></div></div>`;
  }

  function onCard(id) {
    const st = nextStep(id), w = W(id).word;
    if (st.game) { if (st.k === "review") say(`Is your ${w} card dusty? Let's make it shiny again!`); startGame(st.game, id, "album"); return; }
    if (st.k === "wait") say(`Great job! Come back in ${st.left === 1 ? "one day" : st.left + " days"} to get the next puzzle piece for ${w}!`);
    if (st.k === "teacher") { say(`Tell ${TEACHER} about ${w} to get the last level of the card!`); S.tellAsked[id] = S.day; save(); }
  }

  // ---------- adult views ----------
  function stats(id) {
    const ev = S.events.filter((e) => e.item === id && e.game !== "lesson");
    return { tries: ev.length, wrong: ev.filter((e) => !e.correct).length, hint: ev.some((e) => e.hint), quizFail: ev.some((e) => e.game === "quiz" && !e.correct), last: ev.length ? ev[ev.length - 1].day : null };
  }
  const levelChip = (id) => `<span class="lvchip l${lv(id)} ${dusty(id) ? "dz" : ""}">${"★".repeat(lv(id))}${"☆".repeat(5 - lv(id))} ${dusty(id) ? "needs a refresh" : LEVELS[lv(id)].name}</span>`;
  function teacher() {
    if (!S.engine) return `<h2>Before the lesson · ${KID}</h2><p class="sub">Teacher view</p><div class="panel"><p class="empty">Learning Engine off: no Kids Area data reaches the teacher, and the crown level can’t be given. ${KID} can still play, but games pick random words, as in Kids Area today.</p></div>`;
    const ready = WORDS.filter((w) => lv(w.id) === 4 && !dusty(w.id)).map((w) => w.id);
    const fading = WORDS.filter((w) => open(w.id) && dusty(w.id)).map((w) => w.id);
    const struggle = [...new Set(S.events.filter((e) => e.game !== "lesson").map((e) => e.item))].filter((id) => { const s = stats(id); return lv(id) < 4 && (s.wrong >= 2 || s.quizFail); });
    const tips = [];
    if (ready.length) tips.push(`<b>${KID} may try to tell you:</b> ${ready.slice(0, 6).map((id) => `“${esc(id)}”`).join(", ")}. Let her name it without a picture and tap ✓ below.`);
    if (struggle.length) tips.push(`<b>Revisit:</b> ${struggle.map((id) => `“${esc(id)}”${stats(id).quizFail ? " (didn’t remember it in Quiz Corner)" : " (several mistakes)"}`).join(", ")}.`);
    if (fading.length) tips.push(`<b>Fading from older units:</b> ${fading.map((id) => `“${esc(id)}”`).join(", ")} — Kids Area is bringing them back; a 30-second warm-up with them helps.`);
    const rowsUnit = WORDS.filter((w) => w.u === CURRENT && lv(w.id) >= 1).map((w) => { const s = stats(w.id); return `<tr><td>${w.emo}</td><td><b>${esc(w.word)}</b></td><td>${levelChip(w.id)}</td><td>${s.tries ? `${s.tries} tries · ${s.wrong} mistakes${s.hint ? " · hint" : ""}` : "—"}</td><td>${s.last || "—"}</td></tr>`; }).join("");
    return `<div class="t-head"><img src="${IMG}teacher-anna.jpg" alt=""><div><h2>Before the next lesson · ${KID}</h2><p class="sub" style="margin:0">Level 1 · Unit 6 Food · 1-minute read · Kids Area since ${dayName(0)}</p></div></div>
      <div class="panel"><h3>Suggested focus</h3><div class="focus">${tips.join("<br>") || `${KID} hasn’t played since the last lesson. Start with a quick check of the Unit 6 food words.`}</div></div>
      <div class="panel"><h3>👑 Ready for the crown — ask ${KID} to say it in the lesson</h3>
        ${ready.length ? `<table><tbody>${ready.map((id) => `<tr><td style="width:30px;font-size:20px">${pic(id)}</td><td><b>${esc(id)}</b><br><small class="sub">Unit ${unitOf(id).n} ${unitOf(id).name}${S.tellAsked[id] !== undefined ? ` · ${KID} was asked to tell you` : ""}</small></td>
          <td style="text-align:right;white-space:nowrap"><button class="chip-btn ok" data-crown="${esc(id)}">✓ Said it on her own</button> <button class="chip-btn" data-notyet="${esc(id)}">Not yet</button></td></tr>`).join("")}</tbody></table>` : `<p class="empty">No gold cards waiting.</p>`}</div>
      <div class="panel"><h3>Unit 6 words from your last lesson</h3><table><thead><tr><th></th><th>Word</th><th>Level</th><th>How it went</th><th>Last played</th></tr></thead><tbody>${rowsUnit}</tbody></table></div>`;
  }
  // How the child is doing against the programme: mastery per unit vs the level we expect at this point
  const unitMastery = (u) => { const ids = u.w.map(([w]) => w); return ids.reduce((s, id) => s + (dusty(id) ? 3 : lv(id)), 0) / (ids.length * 5); };
  const expected = (u) => (u.locked ? 0 : u.id === CURRENT ? 0.3 : 0.7);
  const HOME_TIP = {
    food: [(w) => `At dinner, point at the ${w} and ask “What’s this?”`, (w) => `In the shop, ask “Can you find the ${w}?”`, (w) => `Ask “Do you like ${w}?” — answer “I like… / I don’t like…” together.`],
    toys: [(w) => `Hide the ${w} and ask “Where is the ${w}?”`, (w) => `At bedtime, ask her to show you the ${w} and name it.`],
    face: [(w) => `Play “Touch your ${w}!” — then swap roles.`, (w) => `Draw a face together and label the ${w}.`],
    feelings: [(w) => `Make a ${w} face and ask “How do I feel?”`, (w) => `At bedtime ask “Are you ${w}?”`],
    school: [(w) => `While packing the bag, ask “Where is your ${w}?”`, (w) => `Play “I spy” with the ${w}.`],
    family: [(w) => `Look at a family photo and ask “Who is the ${w}?”`, (w) => `On a video call, let her say “Hello, ${w}!”`],
  };

  function progChart() {
    const us = UNITS, Wd = 560, H = 190, L = 34, R = 10, T = 12, B = 34, bw = (Wd - L - R) / us.length;
    const y = (v) => T + (1 - v) * (H - T - B);
    const bars = us.map((u, i) => {
      const m = u.locked ? 0 : unitMastery(u), e = expected(u), x = L + i * bw + bw * 0.18, w = bw * 0.64;
      const cls = u.locked ? "fut" : m >= e ? "ok" : m >= e - 0.15 ? "mid" : "low";
      return `<rect x="${x}" y="${y(Math.max(m, 0.01))}" width="${w}" height="${y(0) - y(Math.max(m, 0.01))}" rx="3" class="pb ${cls}"/>
        ${u.locked ? "" : `<line x1="${x - 3}" x2="${x + w + 3}" y1="${y(e)}" y2="${y(e)}" class="exp"/><text x="${x + w / 2}" y="${y(m) - 4}" text-anchor="middle" class="vl">${Math.round(m * 100)}%</text>`}
        <text x="${x + w / 2}" y="${H - 18}" text-anchor="middle" class="ax"></text><image href="assets/img/ui/t-${u.id}.jpg" x="${x + w / 2 - 8}" y="${H - 31}" width="16" height="16"/><text x="${x + w / 2}" y="${H - 5}" text-anchor="middle" class="ax">U${u.n}</text>`;
    }).join("");
    return `<svg class="pchart" viewBox="0 0 ${Wd} ${H}" role="img" aria-label="Mastery per unit compared with the expected level">
      ${[0, 0.5, 1].map((f) => `<line x1="${L}" x2="${Wd - R}" y1="${y(f)}" y2="${y(f)}" class="grid"/><text x="${L - 6}" y="${y(f) + 4}" text-anchor="end" class="ax">${f * 100}%</text>`).join("")}${bars}</svg>`;
  }
  function parent() {
    const done = UNITS.filter((u) => !u.locked && u.id !== CURRENT), cu = UNITS.find((u) => u.id === CURRENT);
    const keep = done.reduce((s, u) => s + unitMastery(u), 0) / done.length;
    const doneIds = done.flatMap((u) => u.w.map(([w]) => w)), remDone = doneIds.filter((id) => lv(id) >= 4 && !dusty(id)).length;
    const status = keep >= 0.65 ? ["ok", "On track"] : keep >= 0.5 ? ["mid", "Almost on track"] : ["low", "Needs support"];
    const behind = done.filter((u) => unitMastery(u) < expected(u) - 0.15);
    const fading = WORDS.filter((w) => open(w.id) && dusty(w.id));
    const fresh = cu.w.map(([w]) => w).filter((id) => lv(id) >= 1);
    const map = UNITS.map((u) => `<div class="vm-row ${u.locked ? "locked" : ""}"><div class="vm-u">${TICO(u)}<b>${u.n}. ${u.name}</b>${u.id === CURRENT ? `<em>now</em>` : u.locked ? `<em class="soon">later</em>` : ""}</div>
      <div class="vm-chips">${u.w.map(([w, e]) => `<span class="vchip l${u.locked ? 0 : lv(w)} ${!u.locked && dusty(w) ? "dz" : ""}" title="${esc(w)} — ${u.locked ? "coming later" : dusty(w) ? "needs a refresh" : LEVELS[lv(w)].name}"><i>${e}</i>${esc(w)}${!u.locked && dusty(w) ? " 🔄" : ""}</span>`).join("")}</div></div>`).join("");
    return `<h2>How ${KID} is doing with English</h2><p class="sub">Parent view · Level 1 Juniors · ${dayName(S.day)}</p>
      <div class="status ${status[0]}"><b>${status[1]}</b> — ${KID} has finished ${done.length} of ${UNITS.length} units of Level 1 and keeps <b>${Math.round(keep * 100)}%</b> of their words (we expect about 70% at this point). Unit ${cu.n} ${cu.name} is in progress.${behind.length ? ` Worth a little extra practice: ${behind.map((u) => u.name).join(", ")}.` : ""}</div>
      <div class="kpis"><div class="kpi"><b>${cu.n}<small>/10</small></b><span>units of Level 1<br>(Unit ${cu.n} ${cu.name} now)</span><small>${Math.round(((cu.n - 1) / UNITS.length) * 100)}% of the level done</small></div>
        <div class="kpi"><b>${remDone}</b><span>words from finished units<br>${KID} still remembers</span><small>of ${doneIds.length} words</small></div>
        <div class="kpi"><b>${fading.length}</b><span>words to refresh<br>(not practised for a while)</span><small>${fading.length ? "Kids Area brings them back" : "all fresh"}</small></div></div>
      <div class="grid2"><div class="panel"><h3>Progress through the programme</h3>${progChart()}
          <p class="sub" style="margin:4px 0 0">Bar = how well ${KID} knows each unit’s words (5 steps per word, from “met in a lesson” to “uses it with the teacher”). Line = where we expect her to be. <span class="lg ok">on track</span> <span class="lg mid">a bit behind</span> <span class="lg low">needs practice</span></p></div>
        <div class="panel"><h3>New words this week</h3>
          <p class="sub" style="margin:0 0 8px">From ${TEACHER}’s lesson on ${dayName(0)} · Unit ${cu.n} ${cu.name}. Two minutes a day at home helps them stick.</p>
          <div class="nw">${fresh.map((id, i) => `<div class="nw-i"><span class="nw-e">${pic(id)}</span><div><b>${esc(id)}</b> <span class="lvchip l${lv(id)}">${LEVELS[lv(id)].name}</span><small>${(HOME_TIP[W(id).u] ? HOME_TIP[W(id).u][i % HOME_TIP[W(id).u].length] : (w) => `Ask “What’s this?” and let ${KID} name the ${w}.`)(id)}</small></div></div>`).join("")}</div>
          <p class="wk" style="margin-top:8px"><b>Tip:</b> let ${KID} be the teacher — ask her to teach you the words. Praise trying, not only right answers.</p>
          ${fading.length ? `<p class="wk"><b>Older words to refresh:</b> ${fading.map((w) => `${w.emo} ${esc(w.word)}`).join(", ")}</p>` : ""}</div></div>
      <div class="panel"><h3>Vocabulary map — every Level 1 word</h3>
        <div class="vm-legend">${LEVELS.map((L, i) => `<span class="vchip l${i}">${L.name}</span>`).join("")}<span class="vchip l4 dz">needs a refresh 🔄</span></div>${map}
        <p class="sub" style="margin:8px 0 0">Units and words from the Novakid Level 1 programme (Unit 4 word list is approximate).</p></div>`;
  }
  function data() {
    const q = S.engine ? queue() : [];
    const qRows = q.slice(0, 14).map((x, n) => `<tr><td>${n + 1}</td><td><b>${esc(x.id)}</b> <small class="sub">U${unitOf(x.id).n}</small></td><td>${dusty(x.id) ? "Remembers · fading" : LEVELS[lv(x.id)].name}</td><td><span class="gpill" style="background:${GAME[x.game].col}">${GAME[x.game].name}</span></td><td>${esc(x.why)}</td></tr>`).join("");
    const rows = S.events.slice().reverse().slice(0, 40).map((e) => `<tr class="mono"><td>${e.day} ${e.ts}</td><td>${e.game}</td><td>${esc(e.item)}</td><td>${esc(e.competency)}</td><td>${e.attempt}</td><td>${e.correct ? 1 : 0}</td><td>${e.hint ? 1 : 0}</td><td>${e.latency_ms}</td><td>${e.superscore}</td><td>${e.counts ? "✓" : ""}</td></tr>`).join("");
    const byGame = Object.keys(GAME).map((k) => {
      const sc = S.events.filter((e) => e.game === k && e.correct).map((e) => e.superscore);
      const avg = sc.length ? sc.reduce((a, b) => a + b, 0) / sc.length : null;
      return `<tr><td>${GAME[k].name}</td><td>${GAME[k].skill}</td><td>${sc.length}</td><td>${avg === null ? "—" : `${avg.toFixed(2)} <span class="zone ${zone(avg)}">${zone(avg)}</span>`}</td></tr>`;
    }).join("");
    return `<h2>Learning Engine · ${KID}</h2>
      <p class="sub">The album is a view of the learner model: one card = one word from the Level 1 programme, card level = the highest step with evidence. The engine decides which word goes into which existing Kids Area game, and brings remembered words back before they fade.</p>
      <div class="panel"><h3>Ladder → card → evidence → games</h3><table><thead><tr><th>Card</th><th>Level</th><th>Evidence needed</th></tr></thead><tbody>
        ${LEVELS.map((L, i) => `<tr><td>${L.look}</td><td><b>${i}. ${L.name}</b></td><td>${L.ev}</td></tr>`).join("")}</tbody></table>
        <p class="sub" style="margin:8px 0 0">Games rotate within a level so the same word comes back in a different game. Fading: a gold / crown card needs a refresh after 7 days, then 14, 28… (interval doubles after each success). A failed refresh drops the card to silver. Stars only for new progress (+${STAR_UP} level, +${STAR_REFRESH} refresh), never for replaying.</p></div>
      <div class="panel"><h3>Next words the engine sends to games ${S.engine ? "" : "(engine off — games use random words, like today)"}</h3>${qRows ? `<table><thead><tr><th>#</th><th>Word</th><th>Now</th><th>Game</th><th>Why</th></tr></thead><tbody>${qRows}</tbody></table>` : `<p class="empty">Nothing queued.</p>`}
        <p class="sub" style="margin:8px 0 0">All six Kids Area games (Memo Mix, Box Battle, Bubbles, Racing, Snake, Quiz Corner) plus Pinocchio take their words from this queue instead of a random list. The real games are live PvP; in the prototype the opponent is a bot.</p></div>
      <div class="grid2"><div class="panel"><h3>By game</h3><table><thead><tr><th>Game</th><th>Skill</th><th>Solved</th><th>Avg superscore · zone</th></tr></thead><tbody>${byGame}</tbody></table></div>
      <div class="panel"><h3>Reads from lessons</h3><p class="sub" style="margin:0">${S.engine ? `Last 1-1 lesson (${dayName(0)}): Level 1 · Unit 6 Food → 6 words become “Met in lesson”. Teacher’s ✓ in the next lesson → crown.` : "Off."}</p></div></div>
      <div class="panel"><h3>Event log (latest first)</h3><div class="events-wrap">${rows ? `<table><thead><tr><th>When</th><th>Game</th><th>Word</th><th>Competency</th><th>Try</th><th>OK</th><th>Hint</th><th>ms</th><th>Score</th><th>Counts</th></tr></thead><tbody>${rows}</tbody></table>` : `<p class="empty">No events yet — play as ${KID}.</p>`}</div></div>`;
  }

  // ---------- demo bar ----------
  function renderBar() {
    const views = [["child", "Child · Kids Area"], ["teacher", "Teacher"], ["parent", "Parent"], ["data", "Learning Engine"]];
    $("#demoBar").innerHTML = `<span class="brand">Prototype · fictional learner “${KID}”</span>
      <span class="seg" role="group" aria-label="View">${views.map(([v, l]) => `<button data-view="${v}" aria-pressed="${S.view === v}">${l}</button>`).join("")}</span>
      <span class="day-pill">${dayName(S.day)}</span>
      <button class="chip-btn" data-act="skip">⏩ 3 days later</button>
      <button class="chip-btn" data-act="sound" aria-label="Sound">${S.sound ? "🔊" : "🔇"}</button>
      <button class="toggle" data-act="engine" aria-pressed="${S.engine}"><span class="knob"></span>Engine ${S.engine ? "on" : "off"}</button>
      <button class="chip-btn warn" data-act="reset">Reset</button>`;
  }

  // ---------- render ----------
  function render() {
    renderBar();
    const adult = S.view !== "child";
    $("#adultPage").hidden = !adult;
    if (adult) { $("#adultScreen").innerHTML = { teacher, parent, data }[S.view](); return; }
    if (S.screen === "play" && !S.session) S.screen = "album";
    const root = $("#kaRoot"), path = $("#cloudPath");
    const pg = S.screen === "play" && S.session ? S.session.game : null;
    const bg = S.screen === "home" ? "bg-dash" : pg === "pino" ? "bg-hw" : pg ? "bg-g-" + pg : "bg-inner";
    root.className = "ka-root " + bg;
    $(".ka-cloud").style.display = pg ? "none" : "";
    path.setAttribute("fill", bg === "bg-dash" ? "#BFDCFF" : "#FFFFFF");
    const sc = $("#cards") ? $("#cards").scrollTop : 0, st = $("#gtabs") ? $("#gtabs").scrollTop : null;
    $("#stage").innerHTML = { home, album, games, play, summary }[S.screen]();
    if ($("#cards")) $("#cards").scrollTop = sc;
    if ($("#gtabs")) { if (st !== null) $("#gtabs").scrollTop = st; else { const on = $(".gtab.on"); if (on) on.scrollIntoView({ block: "nearest" }); } }
    if (S.screen === "play" && S.session && !tickT) startTimers();
  }

  // ---------- events ----------
  document.addEventListener("pointerdown", () => startMusic(), { once: true });
  document.addEventListener("mouseover", (ev) => {
    const b = ev.target.closest("#stage button"); if (!b || b === lastHover) return;
    lastHover = b; const now = Date.now(); if (now - hoverT > 90) { hoverT = now; sfx("hover", 0.35); }
  });
  // Box Battle drag: move the top card with the pointer, drop on a chest (tap a chest works too)
  let drag = null;
  function dragStart(ev) {
    const c = ev.target.closest && ev.target.closest(".bx-card.top"); if (!c || ev.target.closest(".lis")) return;
    const z = parseFloat(getComputedStyle($("#stage")).getPropertyValue("--zoom")) || 1;
    drag = { el: c, x: ev.clientX, y: ev.clientY, z, lx: ev.clientX, ly: ev.clientY }; c.classList.add("dragging"); ev.preventDefault();
  }
  function dragMove(ev) { if (!drag) return; drag.lx = ev.clientX; drag.ly = ev.clientY; drag.el.style.transform = `translate(${(ev.clientX - drag.x) / drag.z}px, ${(ev.clientY - drag.y) / drag.z}px)`; }
  function dragEnd(ev) {
    if (!drag) return; const d = drag; drag = null;
    const x = ev.clientX !== undefined ? ev.clientX : d.lx, y = ev.clientY !== undefined ? ev.clientY : d.ly;
    d.el.style.visibility = "hidden"; const under = document.elementFromPoint(x, y); d.el.style.visibility = "";
    d.el.classList.remove("dragging"); d.el.style.transform = "";
    const ch = under && under.closest(".bx-chest"), moved = Math.abs(x - d.x) + Math.abs(y - d.y) > 8;
    if (ch) onBox(ch.dataset.box); else if (!moved) prompt();
  }
  document.addEventListener("pointerdown", dragStart);
  document.addEventListener("pointermove", dragMove);
  document.addEventListener("mousemove", dragMove);
  ["pointerup", "mouseup", "pointercancel"].forEach((e) => document.addEventListener(e, dragEnd));
  document.addEventListener("keydown", (ev) => {
    const m = { ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R", w: "U", s: "D", a: "L", d: "R" }[ev.key];
    if (m && S.session && S.session.game === "snake") { ev.preventDefault(); turn(m); }
    if ((m === "U" || m === "D") && S.session && S.session.game === "racing") { ev.preventDefault(); raceShip(m === "U" ? -1 : 1); }
  });
  document.addEventListener("click", (ev) => {
    const t = ev.target.closest("button"); if (!t) return;
    const d = t.dataset;
    if (t.closest("#stage")) sfx("click", 0.4);
    if (d.view) { S.view = d.view; save(); render(); return; }
    if (d.hear !== undefined) { say(lv(d.hear) ? W(d.hear).word : "You will meet this word soon!"); return; }
    if (d.soon !== undefined) { toast(d.soon === "engine" ? "Not built in the prototype — in the product the engine feeds album words here too" : "Not part of this prototype — try My album, Games or Pinocchio"); return; }
    if (d.go) {
      stopAll(); S.session = null; S.screen = d.go;
      if (d.go === "album") { S.popupSeen = true; S.albumSeen = true; }
      save(); render(); startMusic(); return;
    }
    if (d.play) { startGame(d.play, null, d.ret || "home"); return; }
    if (d.card) { onCard(d.card); return; }
    if (d.tab) { S.tab = d.tab; save(); render(); say(UNITS.find((x) => x.id === d.tab).name); return; }
    if (d.lockedtab) { say("Coming soon!"); return; }
    if (d.sayw) { say(W(d.sayw).word); return; }
    if (d.quiz) { onQuiz(d.quiz); return; }
    if (d.memo !== undefined) { onMemo(+d.memo); return; }
    if (d.box) { onBox(d.box); return; }
    if (d.bub !== undefined) { onBubble(+d.bub); return; }
    if (d.race) { raceShip(+d.race); return; }
    if (d.sayt) { say(d.sayt); return; }
    if (d.dir) { turn(d.dir); return; }
    if (d.crown) {
      S.lv[d.crown] = 5; S.up[d.crown] = S.day; S.rev[d.crown] = S.day; S.ups.push({ id: d.crown, from: 4, to: 5, day: S.day }); S.stars += STAR_CROWN; S.crowns.push(d.crown);
      logEvent({ game: "lesson", item: d.crown, competency: compId(d.crown, "use"), attempt: 1, correct: true, hint: false, latency_ms: 0, superscore: 1, counts: true });
      save(); render(); toast(`Crown sent — ${KID} sees it next time she opens Kids Area`); return;
    }
    if (d.notyet) {
      logEvent({ game: "lesson", item: d.notyet, competency: compId(d.notyet, "use"), attempt: 1, correct: false, hint: false, latency_ms: 0, superscore: 0, counts: true });
      S.lv[d.notyet] = 3; S.up[d.notyet] = S.day - RECALL; save(); render(); toast("Noted — the word goes back to Quiz Corner"); return;
    }
    switch (d.act) {
      case "popopen": S.popupSeen = true; S.albumSeen = true; S.helpSaid = true; S.tab = CURRENT; S.screen = "album"; save(); render(); say(POP_TEXT()); break;
      case "popsay": say(POP_TEXT()); break;
      case "crownok": S.crowns = []; sfx("close"); save(); render(); break;
      case "crownsay": say(CROWN_TEXT()); break;
      case "replay": prompt(); break;
      case "ghelp": say(GAME[S.session.game].intro); break;
      case "hint": {
        const it = cur(); it.hint = true;
        logEvent({ game: S.session.game, item: it.id, competency: compId(it.id, GAME[S.session.game].skill), attempt: S.session.att[it.id] || 0, correct: false, hint: true, latency_ms: Date.now() - it.t0, superscore: 0, counts: it.up, note: "hint" });
        say(W(it.id).word); save(); render(); break;
      }
      case "mic": startMic(); break;
      case "said-ok": stopMic(); onSaid(true); break;
      case "said-bad": stopMic(); onSaid(false); break;
      case "quit": { stopAll(); const r = S.session ? S.session.ret : "album"; S.session = null; S.screen = r; save(); render(); startMusic(); break; }
      case "skip": {
        stopAll(); const c = counts(S); S.hist.push({ d: S.day, met: c.met, rem: c.rem }); S.day += RECALL;
        if (S.screen === "play") { S.session = null; S.screen = "album"; }
        save(); render(); const nd = WORDS.filter((w) => open(w.id) && dusty(w.id)).length;
        toast(`It’s ${dayName(S.day)} — 3 days later${nd ? ` · ${nd} cards got dusty 🔄` : ""}`); say(nd ? "Oh no, some cards got dusty! Play to make them shiny again." : "Three days later!"); break;
      }
      case "sound": S.sound = !S.sound; save(); renderBar(); startMusic(); break;
      case "engine": S.engine = !S.engine; save(); render(); toast(S.engine ? "Engine on: album words go into games, teacher gets the brief" : "Engine off: games use random words, like Kids Area today"); break;
      case "reset": stopAll(); S = fresh(); try { localStorage.removeItem(KEY); } catch (e) {} render(); toast("Demo reset"); break;
    }
  });

  fit(); render();
})();
