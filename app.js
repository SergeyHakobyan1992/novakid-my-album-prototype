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
    { n: 3, id: "feelings", name: "Feelings", ic: "😀", w: [["happy", "😀"], ["sad", "😢"], ["angry", "😠"], ["scared", "😱"], ["hungry", "🤤"], ["thirsty", "🥤"], ["sleepy", "😴"], ["hot", "🥵"], ["cold", "🥶"]] },
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
  const W = (id) => WORDS.find((w) => w.id === id);
  const unitOf = (id) => UNITS.find((u) => u.id === W(id).u);
  const open = (id) => !unitOf(id).locked;

  // ---------- mastery ladder = card level ----------
  const LEVELS = [
    { name: "Not met yet", look: "silhouette", ev: "not taught yet" },
    { name: "Met in lesson", look: "black & white", ev: "taught in a 1-1 lesson (from the lesson record)" },
    { name: "Recognises", look: "colour", ev: "matches the sound or the written word to the picture — Memo Mix, Box Battle or Bubbles — with ≤ 1 mistake, no hint" },
    { name: "Says it", look: "silver frame", ev: "produces the word — says it to Pinocchio or spells it in Racing — without a hint" },
    { name: "Remembers", look: "gold frame", ev: "says it again after 3+ days, first try, no hint (Quiz Corner). Then refresh after 7 → 14 → 28 days" },
    { name: "Uses with teacher", look: "crown", ev: "says it to the teacher in a live lesson (teacher taps ✓)" },
  ];
  const GAME = {
    memo: { name: "Memo Mix", col: "#D98DE3", ic: "🃏", skill: "recognise", n: 4, intro: "Memo Mix! Find the picture for every sound." },
    boxes: { name: "Box Battle", col: "#43C6CC", ic: "📦", skill: "recognise", n: 3, intro: "Box Battle! Listen and put each card into the right box. Be faster than Robo!" },
    bubbles: { name: "Bubbles", col: "#E9B33D", ic: `<span class="mini-t">ABC</span>`, skill: "read", n: 4, intro: "Bubbles! Find the word for the picture." },
    pino: { name: "Pinocchio", col: "#E8590C", ic: "🎤", skill: "say", n: 4, intro: "Say it to Pinocchio!" },
    racing: { name: "Racing", col: "#3E9B5A", ic: "🏎️", skill: "spell", n: 3, intro: "Racing! Catch the letters to spell the word." },
    quiz: { name: "Quiz Corner", col: "#2BB5D6", ic: `<span class="mini-t"><b style="color:#18A410">✓</b><b style="color:#DD0035">✗</b></span>`, skill: "recall", n: 4, intro: "Quiz Corner! Do you still remember?" },
  };
  const LEARN = ["memo", "boxes", "bubbles"], MAKE = ["pino", "racing"];
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
  const pic = (id) => `<span class="emo">${W(id).emo}</span>`;
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
  function sfx(name, vol = 0.45) { if (!S.sound) return; try { const a = new Audio(SND[name]); a.volume = vol; a.play().catch(() => {}); } catch (e) {} }
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
  function cardHTML(id, opts = {}) {
    const L = lv(id), st = nextStep(id), rec = opts.rec && opts.rec.includes(id), dz = dusty(id);
    let go = "";
    if (!opts.static && L > 0) {
      if (st.game) go = `<button class="go ${st.k === "review" ? "go-review" : ""}" style="--gc:${GAME[st.game].col}" data-card="${esc(id)}" aria-label="Play ${GAME[st.game].name}">${st.k === "review" ? "🔄" : gameIcon(st.game)}</button>`;
      else if (st.k === "wait") go = `<button class="go go-wait" data-card="${esc(id)}" aria-label="Come back later">⏳<b>${st.left}</b></button>`;
      else if (st.k === "teacher") go = `<button class="go go-teacher" data-card="${esc(id)}" aria-label="Tell ${TEACHER}"><img src="${IMG}teacher-anna.jpg" alt=""></button>`;
    }
    return `<div class="wc l${L} ${dz ? "dusty" : ""} ${rec ? "rec" : ""} ${opts.static ? "static" : ""}">
      ${L === 5 ? `<span class="crown">👑</span>` : ""}
      <button class="face" data-hear="${esc(id)}" aria-label="${L ? esc(W(id).word) : "not met yet"}"><span class="pic">${pic(id)}</span>
      <span class="w">${L ? esc(W(id).word) : "?"}</span>${L && !opts.static ? `<span class="spk">🔊</span>` : ""}</button>
      <span class="pips">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= L ? "on" : ""}"></i>`).join("")}</span>${go}</div>`;
  }

  // ---------- child: dashboard ----------
  function home() {
    const anyDusty = WORDS.some((w) => open(w.id) && dusty(w.id));
    const tiles = TILES.map((t) => {
      if (t.key === "album") {
        const badge = !S.albumSeen ? "NEW" : S.crowns.length ? "👑" : anyDusty ? "🔄" : "";
        return `<button class="ka-tile album-tile ${t.side}" style="grid-area:${t.area}" data-go="album" aria-label="My album">
          <div class="wr"><div class="iw"><div class="card-bg"><img src="${IMG}album-icon.jpg" alt=""></div></div>
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
      <div class="in"><img class="pic" src="${IMG}teacher-anna.jpg" alt="" style="width:46px;height:46px">${inner}<button class="pop-spk" data-act="${sayAct}" aria-label="Listen">🔊</button></div>
      <button class="ka-btn ${gold ? "gold" : ""}" data-act="${act}"><div class="bi"><span>${btn}</span></div></button></div></div>`;
  }
  const POP_TEXT = () => `Hi ${KID}! You met six new food words with ${TEACHER}. Play games to colour your cards!`;
  const CROWN_TEXT = () => `${TEACHER} gave you a crown for ${S.crowns.map((id) => W(id).word).join(" and ")}! Well done!`;
  const HELP_TEXT = `Tap a card to hear the word. Tap the round button to play a game and level up your card: colour, silver, gold, and a crown from ${TEACHER}!`;

  // ---------- child: album ----------
  function album() {
    const u = UNITS.find((x) => x.id === S.tab) || UNITS[5], rec = recommended();
    const tabs = UNITS.map((x) => {
      if (x.locked) return `<button class="gtab locked" data-lockedtab="${x.id}" aria-label="${x.name}, locked"><span class="ic">${x.ic}</span><span class="nm">${x.n}. ${x.name}</span><span class="lk">🔒</span></button>`;
      const ids = x.w.map(([w]) => w);
      const pct = Math.round((ids.reduce((s, id) => s + lv(id), 0) / (ids.length * 5)) * 100);
      const hot = ids.some((id) => rec.includes(id)), dz = ids.some(dusty);
      return `<button class="gtab ${x.id === u.id ? "on" : ""}" data-tab="${x.id}"><span class="ic">${x.ic}</span><span class="nm">${x.n}. ${x.name}</span>${dz ? `<span class="dz">🔄</span>` : hot ? `<span class="hot"></span>` : ""}
        <span class="bar"><i style="width:${pct}%"></i></span></button>`;
    }).join("");
    return `${innerHeader("home", "MY ALBUM", `<button class="ka-help" data-act="help" aria-label="How it works">🔊</button>`)}
      <div class="alb3"><div class="gtabs" id="gtabs">${tabs}</div>
        <div class="cards" id="cards">${u.w.map(([w]) => cardHTML(w, { rec })).join("")}</div></div>`;
  }

  // ---------- child: games menu (replica of Kids Area Games) ----------
  const MENU = [
    { k: "bubbles", name: "BUBBLES", col: "#E9B33D", bg: "#FBE7B9", art: `<span class="abc"><i>A</i><i>B</i><i>C</i></span>` },
    { k: "boxes", name: "BOX BATTLE", col: "#43C6CC", bg: "#A9EEF6", art: "📦" },
    { k: "racing", name: "RACING", col: "#3E9B5A", bg: "#94CDA1", art: "🏎️" },
    { k: "memo", name: "MEMO MIX", col: "#D98DE3", bg: "#F5CEF8", art: "🍋🥝" },
    { k: "snake", name: "SNAKE", col: "#8A7BEA", bg: "#C7C0F6", art: "🐛" },
    { k: "quiz", name: "QUIZ CORNER", col: "#2BB5D6", bg: "#A4E6F4", art: "✅❌" },
  ];
  function games() {
    const q = S.engine ? queue() : [];
    return `${innerHeader("home", "GAMES")}
      <div class="gm-grid">${MENU.map((m) => {
        const cnt = q.filter((x) => x.game === m.k).length;
        return `<button class="gm" ${m.k === "snake" ? `data-soon="engine"` : `data-play="${m.k}" data-ret="games"`} style="--c:${m.col};--b:${m.bg}">
          <span class="hd">${m.name}</span><span class="art">${m.art}</span>
          ${cnt ? `<span class="alb-badge"><img src="${IMG}album-icon.jpg" alt="">${cnt}</span>` : ""}</button>`;
      }).join("")}</div>`;
  }

  // ---------- game sessions ----------
  function startGame(game, focus, ret) {
    const G = GAME[game];
    let ids = [];
    if (S.engine || focus) ids = (focus ? [focus] : []).concat(queue().filter((q) => q.game === game && q.id !== focus).map((q) => q.id)).slice(0, G.n);
    if (ids.length < G.n) { // top up with words the child already owns (practice only, no level-up); prefer the same unit
      const unit = ids.length ? W(ids[0]).u : CURRENT;
      const pool = WORDS.filter((w) => open(w.id) && lv(w.id) >= 1 && !ids.includes(w.id) && (game === "quiz" ? lv(w.id) >= 3 : true));
      ids = ids.concat(shuffle(pool.filter((w) => w.u === unit)).map((w) => w.id), shuffle(pool.filter((w) => w.u !== unit)).map((w) => w.id)).slice(0, G.n);
    }
    const items = ids.map((id) => { const st = nextStep(id); return { id, kind: st.k, up: st.game === game }; });
    [...new Set(items.filter((it) => it.up).map((it) => playKey(it.id)))].forEach((k) => { S.plays[k] = (S.plays[k] || 0) + 1; });
    const ses = { game, items, i: 0, ret, att: {}, err: {}, upgrades: [], refreshed: [], dropped: [], starsBefore: S.stars };
    if (game === "memo") { ses.cards = shuffle(ids.flatMap((id) => [{ id, t: "pic" }, { id, t: "snd" }])); ses.flip = []; }
    if (game === "boxes") { ses.deck = shuffle(ids.concat(ids)); ses.pos = 0; ses.bot = 0; ses.done = {}; }
    S.session = ses;
    if (!["memo", "boxes"].includes(game)) prepItem();
    S.screen = "play"; save(); render(); startMusic();
    say(G.intro); prompt(true); if (game === "boxes") startBot();
  }
  const cur = () => S.session.items[S.session.i];
  function prepItem() {
    const it = cur(), g = S.session.game, uw = WORDS.filter((w) => w.u === W(it.id).u && w.id !== it.id).map((w) => w.id);
    Object.assign(it, { hint: false, solved: false, failed: false, wrong: [], listening: false, fb: null, t0: Date.now() });
    if (g === "bubbles") it.options = shuffle([it.id, ...shuffle(uw).slice(0, 4)]);
    if (g === "racing") { it.pos = 0; skipSpaces(it); it.lanes = lanes(it); }
  }
  function prompt(queued) {
    const g = S.session.game;
    if (g === "boxes") { const c = S.session.deck[S.session.pos]; if (c) say(W(c).word, queued); return; }
    if (g === "memo") return;
    const it = cur();
    if (g === "racing") say(W(it.id).word, queued);
    else if (g === "bubbles") say("Which word is it?", queued);
    else say(g === "quiz" ? "What is it? Say it!" : "What's this?", queued);
  }
  function attempt(id, correct, extra = {}) {
    const ses = S.session; ses.att[id] = (ses.att[id] || 0) + 1; if (!correct) ses.err[id] = (ses.err[id] || 0) + 1;
    const it = ses.items.find((x) => x.id === id) || {};
    logEvent(Object.assign({ game: ses.game, item: id, competency: compId(id, GAME[ses.game].skill), attempt: ses.att[id], correct, hint: !!it.hint, latency_ms: it.t0 ? Date.now() - it.t0 : 0, superscore: superscore(correct, ses.att[id], it.hint), counts: !!it.up }, extra));
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
    it.fb = { cls: "ok", html: `✅ ${esc(W(it.id).word)}${upgraded ? ` <span class="lvup">⬆</span><img src="${A.star}" alt="">+${STAR_UP}` : extraHTML}` };
    say(`Yes! ${W(it.id).word}!`); if (upgraded) say("Your card levelled up!", true);
    save(); render(); advanceSoon(upgraded ? 2600 : 1500);
  }
  function next() {
    S.session.i += 1;
    if (S.session.i >= S.session.items.length) return finish();
    prepItem(); save(); render(); prompt();
  }

  // Memo Mix: picture card ↔ sound card pairs
  let memoLock = false;
  function onMemo(k) {
    const ses = S.session, c = ses.cards[k];
    if (memoLock || c.open || c.matched) return;
    c.open = true; ses.flip.push(k);
    if (c.t === "snd") say(W(c.id).word);
    if (ses.flip.length === 2) {
      const [a, b] = ses.flip.map((x) => ses.cards[x]);
      if (a.id === b.id) {
        a.matched = b.matched = true; ses.flip = []; attempt(a.id, true); say(`Yes! ${W(a.id).word}!`, true);
        if (ses.cards.every((x) => x.matched)) { save(); render(); setTimeout(finish, 1600); return; }
      } else {
        const snd = a.t === "snd" ? a : b.t === "snd" ? b : null;
        if (snd) attempt(snd.id, false, { chosen: (snd === a ? b : a).id });
        memoLock = true;
        setTimeout(() => { a.open = b.open = false; ses.flip = []; memoLock = false; save(); render(); }, 1300);
      }
    }
    save(); render();
  }
  // Box Battle: hear a card, drop it into the box with the right picture, faster than the bot
  let botT = null;
  function stopBot() { clearInterval(botT); botT = null; }
  function startBot() { stopBot(); botT = setInterval(tickBot, 3600); }
  function tickBot() {
    const ses = S.session;
    if (S.screen !== "play" || !ses || ses.game !== "boxes" || ses.over) { stopBot(); return; }
    ses.bot += 1;
    if (ses.bot >= ses.deck.length) { ses.over = true; ses.win = false; stopBot(); say("Robo finished first! Good try!"); save(); render(); setTimeout(finish, 2200); return; }
    save(); render();
  }
  function onBox(id) {
    const ses = S.session; if (ses.over) return;
    const c = ses.deck[ses.pos];
    if (id === c) {
      attempt(c, true); ses.done[c] = (ses.done[c] || 0) + 1; ses.pos += 1; ses.bad = null;
      if (ses.pos >= ses.deck.length) { ses.over = true; ses.win = true; stopBot(); say(`You win! ${Object.keys(ses.err).length ? "" : "No mistakes!"}`); save(); render(); setTimeout(finish, 2200); return; }
      save(); render(); setTimeout(() => prompt(), 250);
    } else { attempt(c, false, { chosen: id }); ses.bad = id; say(`Oops! Listen: ${W(c).word}`); save(); render(); }
  }
  function onPick(o) { // Bubbles
    const it = cur(); if (it.solved) return;
    if (o === it.id) { attempt(it.id, true); const ok = it.up && superscore(true, S.session.att[it.id], it.hint) >= 0.8; solved(it, ok && levelUp(it.id, 2)); }
    else { attempt(it.id, false, { chosen: o }); it.wrong.push(o); it.fb = { cls: "no", html: "🔁" }; say(o); save(); render(); }
  }
  // Racing: catch the next letter
  function skipSpaces(it) { const w = W(it.id).word.toLowerCase(); while (it.pos < w.length && !/[a-z]/.test(w[it.pos])) it.pos++; }
  function lanes(it) {
    const w = W(it.id).word.toLowerCase(), need = w[it.pos]; if (!need) return [];
    const others = shuffle("abcdefghijklmnopqrstuvwxyz".split("").filter((l) => l !== need)).slice(0, 2);
    return shuffle([need, ...others]);
  }
  function onLane(l) {
    const it = cur(); if (it.solved) return;
    const w = W(it.id).word.toLowerCase();
    if (l === w[it.pos]) {
      it.pos++; skipSpaces(it); it.wrongLane = null; it.hintLane = false;
      if (it.pos >= w.length) { attempt(it.id, true); const ok = it.up && !it.hint && (S.session.err[it.id] || 0) <= 1; solved(it, ok && levelUp(it.id, 3)); return; }
      it.lanes = lanes(it); save(); render();
    } else { attempt(it.id, false, { chosen: l }); it.wrongLane = l; save(); render(); }
  }
  // Pinocchio / Quiz Corner: say the word (speech recognition when available, demo buttons otherwise)
  function onSaid(ok) {
    const it = cur(), g = S.session.game;
    if (it.solved || it.failed) return;
    attempt(it.id, ok);
    if (ok) {
      if (g === "pino") return solved(it, it.up && !it.hint && S.session.att[it.id] <= 2 && levelUp(it.id, 3));
      if (it.up && it.kind === "recall" && S.session.att[it.id] === 1) return solved(it, levelUp(it.id, 4));
      if (it.up && it.kind === "review") { S.rev[it.id] = S.day; S.iv[it.id] *= 2; S.stars += STAR_REFRESH; S.session.refreshed.push(it.id); return solved(it, false, ` <span class="lvup">🔄</span><img src="${A.star}" alt="">+${STAR_REFRESH}`); }
      return solved(it, false);
    }
    it.listening = false;
    if (g === "quiz") {
      it.failed = true; it.fb = { cls: "no", html: `🔁 ${esc(W(it.id).word)}` };
      if (it.up && it.kind === "review") { S.lv[it.id] = 3; S.up[it.id] = S.day; S.session.dropped.push(it.id); }
      if (it.up && it.kind === "recall") S.up[it.id] = S.day - RECALL + 1; // try again tomorrow
      say(`It's ${W(it.id).word}. We'll practise it again!`); save(); render(); advanceSoon(2600);
    } else { it.fb = { cls: "no", html: "🔁" }; say("Hmm, not quite. Try again!"); save(); render(); }
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
  function stopAll() { clearTimeout(advT); stopBot(); stopMic(); memoLock = false; }

  function finish() {
    const ses = S.session; if (!ses) return;
    if (ses.game === "memo") ses.items.forEach((it) => { if (it.up && (ses.err[it.id] || 0) <= 1) levelUp(it.id, 2); });
    if (ses.game === "boxes") ses.items.forEach((it) => { if (it.up && ses.done[it.id] === 2 && (ses.err[it.id] || 0) <= 1) levelUp(it.id, 2); });
    S.lastSummary = { ids: [...new Set(ses.upgrades)], refreshed: ses.refreshed, dropped: ses.dropped, stars: S.stars - ses.starsBefore, ret: ses.ret, game: ses.game, win: ses.win };
    stopAll(); S.session = null; S.screen = "summary"; save(); render(); startMusic();
    const n = S.lastSummary.ids.length, r = S.lastSummary.refreshed.length;
    say(n ? `Wow! ${n === 1 ? "One card" : n + " cards"} levelled up!` : r ? "Your cards are shiny again!" : "Good practice!");
  }

  function play() {
    const ses = S.session, g = ses.game;
    let body = "", pct = 0, hintBtn = "", fb = "";
    if (g === "memo") {
      pct = Math.round((ses.cards.filter((c) => c.matched).length / ses.cards.length) * 100);
      body = `<div class="memo">${ses.cards.map((c, k) => `<button class="mc ${c.open || c.matched ? "up" : ""} ${c.matched ? "ok" : ""}" data-memo="${k}" aria-label="card">${c.open || c.matched ? (c.t === "pic" ? pic(c.id) : `<span class="snd">🔊</span>`) : `<span class="back">★</span>`}</button>`).join("")}</div>`;
    } else if (g === "boxes") {
      pct = Math.round((ses.pos / ses.deck.length) * 100);
      const c = ses.deck[ses.pos];
      body = `<div class="bx-wrap"><div class="bx-score"><span class="bx-me">${KID} <b>${ses.pos}</b></span><span class="vs">VS</span><span class="bx-bot">🤖 Robo <b>${ses.bot}</b></span>
          <span class="bot-bar"><i style="width:${Math.round((ses.bot / ses.deck.length) * 100)}%"></i></span></div>
        ${ses.over ? `<div class="bx-card result">${ses.win ? "🏆" : "🤖"}</div>` : `<button class="bx-card" draggable="true" data-act="replay" aria-label="Listen again">🔊</button>`}
        <div class="bx-boxes">${ses.items.map((it) => `<button class="bx ${ses.bad === it.id ? "bad" : ""}" data-box="${esc(it.id)}" aria-label="box">${pic(it.id)}<span class="cnt">${"●".repeat(ses.done[it.id] || 0)}</span></button>`).join("")}</div></div>`;
    } else {
      const it = cur();
      pct = Math.round(((ses.i + (it.solved || it.failed ? 1 : 0)) / ses.items.length) * 100);
      fb = it.fb ? `<div class="g-fb ${it.fb.cls}">${it.fb.html}</div>` : "";
      if (g !== "quiz") hintBtn = `<button class="hw-hint" data-act="hint" ${it.hint || it.solved ? "disabled" : ""} aria-label="Hint">💡</button>`;
      if (g === "bubbles") {
        body = `<div class="bub-wrap"><div class="sp-card small ${it.solved ? "right" : ""}">${pic(it.id)}</div>
          <div class="bubbles2">${it.options.map((o, k) => `<button class="bub b${k} ${it.wrong.includes(o) ? "bad" : ""} ${it.solved && o === it.id ? "ok" : ""}" data-pick="${esc(o)}" ${it.solved ? "disabled" : ""}>${esc(W(o).word)}</button>`).join("")}</div></div>`;
      } else if (g === "racing") {
        const w = W(it.id).word.toLowerCase(), prog = it.pos / w.length;
        body = `<div class="rc-wrap"><div class="rc-top"><div class="sp-card small">${pic(it.id)}</div><button class="big-spk" data-act="replay" aria-label="Listen">🔊</button>
            <div class="rc-slots">${[...w].map((ch, k) => /[a-z]/.test(ch) ? `<span class="sl ${k < it.pos ? "f" : ""}">${k < it.pos ? ch : ""}</span>` : `<span class="gap"></span>`).join("")}</div></div>
          <div class="rc-track"><span class="ship" style="left:${Math.round(prog * 88)}%">🚀</span><span class="flag">🏁</span></div>
          <div class="rc-lanes">${(it.solved ? [] : it.lanes).map((l) => `<button class="lane ${it.wrongLane === l ? "bad" : ""} ${it.hint && l === w[it.pos] ? "hint" : ""}" data-lane="${l}">${l}</button>`).join("")}</div></div>`;
      } else {
        const host = g === "pino" ? `<img class="host" src="${A.pino}" alt="Pinocchio">` : `<div class="host quiz-host"><span>✅</span><span>❌</span></div>`;
        body = `<div class="sp-wrap">${host}
          <div class="sp-card ${it.solved ? "right" : ""} ${it.failed ? "fail" : ""}">${pic(it.id)}${it.solved || it.failed || it.hint ? `<span class="sp-w">${esc(W(it.id).word)}</span>` : ""}</div>
          <div class="sp-mic"><button class="mic ${it.listening ? "on" : ""}" data-act="mic" ${it.solved || it.failed ? "disabled" : ""} aria-label="Speak">🎤</button>
            ${it.listening ? `<div class="demo-say" title="Prototype: choose what the child said"><span>demo</span><button data-act="said-ok" aria-label="said it right">✓</button><button data-act="said-bad" aria-label="said it wrong">✗</button></div>` : ""}</div></div>`;
      }
    }
    return `<div class="hw-top"><button class="hw-back" data-act="quit" aria-label="back"><img src="${A.hwBack}" alt=""></button></div>
      <div class="hw-bar"><div class="fill" style="width:${pct}%"></div></div><img class="hw-star" src="${A.hwStar}" alt="">
      <span class="g-chip" style="background:${GAME[g].col}">${GAME[g].name}</span>
      <div class="hw-body">${body}</div>${fb}${hintBtn}`;
  }
  function summary() {
    const sm = S.lastSummary || { ids: [], refreshed: [], dropped: [], stars: 0, ret: "album" };
    const back = sm.ret === "games" ? "games" : "album";
    const cards = [...sm.ids, ...sm.refreshed.filter((id) => !sm.ids.includes(id)), ...sm.dropped];
    return `${innerHeader(back, back === "games" ? "GAMES" : "MY ALBUM")}
      <div class="sum-wrap"><div class="ka-board"><div class="in">
        ${sm.game === "boxes" ? `<div class="sum-res">${sm.win ? "🏆" : "🤖"}</div>` : ""}
        <div class="mini-row big">${cards.length ? cards.map((id) => cardHTML(id, { static: true })).join("") : `<span class="emo-big">👍</span>`}</div>
        <div class="plus"><img src="${A.star}" alt="">+${sm.stars}</div></div>
        <button class="ka-btn" data-go="${back}"><div class="bi"><span>OK</span></div></button></div></div>`;
  }

  function onCard(id) {
    const st = nextStep(id), w = W(id).word;
    if (st.game) { if (st.k === "review") say(`Is your ${w} card dusty? Let's make it shiny again!`); startGame(st.game, id, "album"); return; }
    if (st.k === "wait") say(`Great job! Come back in ${st.left === 1 ? "one day" : st.left + " days"} to make your ${w} card gold!`);
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
        ${ready.length ? `<table><tbody>${ready.map((id) => `<tr><td style="width:30px;font-size:20px">${W(id).emo}</td><td><b>${esc(id)}</b><br><small class="sub">Unit ${unitOf(id).n} ${unitOf(id).name}${S.tellAsked[id] !== undefined ? ` · ${KID} was asked to tell you` : ""}</small></td>
          <td style="text-align:right;white-space:nowrap"><button class="chip-btn ok" data-crown="${esc(id)}">✓ Said it on her own</button> <button class="chip-btn" data-notyet="${esc(id)}">Not yet</button></td></tr>`).join("")}</tbody></table>` : `<p class="empty">No gold cards waiting.</p>`}</div>
      <div class="panel"><h3>Unit 6 words from your last lesson</h3><table><thead><tr><th></th><th>Word</th><th>Level</th><th>How it went</th><th>Last played</th></tr></thead><tbody>${rowsUnit}</tbody></table></div>`;
  }
  function chart() {
    const now = counts(S), pts = S.hist.concat([{ d: S.day, met: now.met, rem: now.rem, now: true }]);
    const Wd = 560, H = 170, L = 34, R = 16, T = 14, B = 26, max = Math.max(WORDS.length, ...pts.map((p) => p.met));
    const d0 = pts[0].d, d1 = pts[pts.length - 1].d;
    const x = (d) => L + ((d - d0) / Math.max(1, d1 - d0)) * (Wd - L - R), y = (v) => T + (1 - v / max) * (H - T - B);
    const line = (k) => pts.map((p, i) => `${i ? "L" : "M"}${x(p.d).toFixed(1)},${y(p[k]).toFixed(1)}`).join(" ");
    const lab = (p) => p.now ? "now" : p.d < 0 ? `${Math.round(-p.d / 7)}w ago` : dayName(p.d).slice(0, 3);
    return `<svg class="pchart" viewBox="0 0 ${Wd} ${H}" role="img" aria-label="Words met and words remembered over time">
      ${[0, 0.5, 1].map((f) => `<line x1="${L}" x2="${Wd - R}" y1="${y(max * f)}" y2="${y(max * f)}" class="grid"/><text x="${L - 6}" y="${y(max * f) + 4}" text-anchor="end" class="ax">${Math.round(max * f)}</text>`).join("")}
      <path d="${line("met")}" class="ln met"/><path d="${line("rem")}" class="ln rem"/>
      ${pts.map((p) => `<circle cx="${x(p.d)}" cy="${y(p.rem)}" r="${p.now ? 4.5 : 2.5}" class="dt rem"/><circle cx="${x(p.d)}" cy="${y(p.met)}" r="${p.now ? 4.5 : 2.5}" class="dt met"/>`).join("")}
      ${pts.filter((p, i) => i % 2 === 0 || p.now).map((p) => `<text x="${x(p.d)}" y="${H - 8}" text-anchor="middle" class="ax">${lab(p)}</text>`).join("")}
      <text x="${x(d1) - 6}" y="${y(now.met) - 8}" text-anchor="end" class="vl met">${now.met} met</text><text x="${x(d1) - 6}" y="${y(now.rem) + 16}" text-anchor="end" class="vl rem">${now.rem} remembered</text>
    </svg>`;
  }
  function parent() {
    const c = counts(S), base = S.hist[S.hist.length - 1];
    const fading = WORDS.filter((w) => open(w.id) && dusty(w.id));
    const week = S.ups.filter((u) => u.day > S.day - 7), moved = [...new Set(week.map((u) => u.id))];
    const map = UNITS.map((u) => `<div class="vm-row ${u.locked ? "locked" : ""}"><div class="vm-u"><span>${u.ic}</span><b>${u.n}. ${u.name}</b>${u.id === CURRENT ? `<em>now</em>` : u.locked ? `<em class="soon">later</em>` : ""}</div>
      <div class="vm-chips">${u.w.map(([w, e]) => `<span class="vchip l${u.locked ? 0 : lv(w)} ${!u.locked && dusty(w) ? "dz" : ""}" title="${esc(w)} — ${u.locked ? "coming later" : dusty(w) ? "needs a refresh" : LEVELS[lv(w)].name}"><i>${e}</i>${esc(w)}${!u.locked && lv(w) === 5 ? " 👑" : ""}${!u.locked && dusty(w) ? " 🔄" : ""}</span>`).join("")}</div></div>`).join("");
    return `<h2>${KID}’s English vocabulary</h2><p class="sub">Parent view · Level 1 Juniors · ${dayName(S.day)}</p>
      <div class="kpis"><div class="kpi"><b>${c.rem}</b><span>words ${KID} <u>remembers</u><br>(said after 3+ days)</span><small class="${c.rem - base.rem >= 0 ? "pos" : "neg"}">${c.rem - base.rem >= 0 ? "+" : ""}${c.rem - base.rem} this week</small></div>
        <div class="kpi"><b>${c.met}</b><span>words met in lessons<br>of ${WORDS.length} in Level 1</span><small>${Math.round((c.met / WORDS.length) * 100)}% of the level</small></div>
        <div class="kpi"><b>${fading.length}</b><span>words to refresh<br>(not practised for a while)</span><small>${fading.length ? "Kids Area brings them back" : "all fresh"}</small></div></div>
      <div class="grid2"><div class="panel"><h3>Progress over time</h3>${chart()}<p class="sub" style="margin:4px 0 0">“Remembered” counts only words Mia said correctly after a 3-day break and hasn’t forgotten since.</p></div>
        <div class="panel"><h3>This week</h3>
          ${moved.length ? `<p class="wk"><b>Moved up:</b> ${moved.map((id) => `${W(id).emo} ${esc(id)} → ${LEVELS[lv(id)].name.toLowerCase()}`).join(", ")}</p>` : `<p class="wk">No new steps yet this week.</p>`}
          ${fading.length ? `<p class="wk"><b>To refresh:</b> ${fading.map((w) => `${w.emo} ${esc(w.word)}`).join(", ")}</p>` : ""}
          <p class="wk"><b>Try at home:</b> point at ${WORDS.filter((w) => w.u === CURRENT && lv(w.id) >= 2).slice(0, 3).map((w) => w.word).join(", ") || "food"} at dinner and ask “What’s this?”</p></div></div>
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
        <p class="sub" style="margin:8px 0 0">Snake is not built in the prototype; in the product the same queue would feed it.</p></div>
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
    const bg = S.screen === "home" ? "bg-dash" : S.screen === "play" ? "bg-hw" : "bg-inner";
    root.className = "ka-root " + bg;
    $(".ka-cloud").style.display = bg === "bg-hw" ? "none" : "";
    path.setAttribute("fill", bg === "bg-dash" ? "#BFDCFF" : "#FFFFFF");
    const sc = $("#cards") ? $("#cards").scrollTop : 0, st = $("#gtabs") ? $("#gtabs").scrollTop : null;
    $("#stage").innerHTML = { home, album, games, play, summary }[S.screen]();
    if ($("#cards")) $("#cards").scrollTop = sc;
    if ($("#gtabs")) { if (st !== null) $("#gtabs").scrollTop = st; else { const on = $(".gtab.on"); if (on) on.scrollIntoView({ block: "nearest" }); } }
    if (S.screen === "play" && S.session && S.session.game === "boxes" && !S.session.over && !botT) startBot();
  }

  // ---------- events ----------
  document.addEventListener("pointerdown", () => startMusic(), { once: true });
  document.addEventListener("mouseover", (ev) => {
    const b = ev.target.closest("#stage button"); if (!b || b === lastHover) return;
    lastHover = b; const now = Date.now(); if (now - hoverT > 90) { hoverT = now; sfx("hover", 0.35); }
  });
  document.addEventListener("dragstart", (ev) => { if (ev.target.closest && ev.target.closest(".bx-card")) ev.dataTransfer.setData("text/plain", "card"); });
  document.addEventListener("dragover", (ev) => { if (ev.target.closest && ev.target.closest(".bx")) ev.preventDefault(); });
  document.addEventListener("drop", (ev) => { const b = ev.target.closest && ev.target.closest(".bx"); if (b) { ev.preventDefault(); onBox(b.dataset.box); } });
  document.addEventListener("click", (ev) => {
    const t = ev.target.closest("button"); if (!t) return;
    const d = t.dataset;
    if (t.closest("#stage")) sfx("click", 0.4);
    if (d.view) { S.view = d.view; save(); render(); return; }
    if (d.hear !== undefined) { say(lv(d.hear) ? W(d.hear).word : "You will meet this word soon!"); return; }
    if (d.soon !== undefined) { toast(d.soon === "engine" ? "Not built in the prototype — in the product the engine feeds album words here too" : "Not part of this prototype — try My album, Games or Pinocchio"); return; }
    if (d.go) {
      stopAll(); S.session = null; S.screen = d.go;
      if (d.go === "album") { S.popupSeen = true; if (!S.albumSeen || !S.helpSaid) { S.albumSeen = true; S.helpSaid = true; say(HELP_TEXT); } }
      save(); render(); startMusic(); return;
    }
    if (d.play) { startGame(d.play, null, d.ret || "home"); return; }
    if (d.card) { onCard(d.card); return; }
    if (d.tab) { S.tab = d.tab; save(); render(); say(UNITS.find((x) => x.id === d.tab).name); return; }
    if (d.lockedtab) { say("Coming soon, after your next lessons!"); return; }
    if (d.pick) { onPick(d.pick); return; }
    if (d.memo !== undefined) { onMemo(+d.memo); return; }
    if (d.box) { onBox(d.box); return; }
    if (d.lane) { onLane(d.lane); return; }
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
      case "popopen": S.popupSeen = true; S.albumSeen = true; S.helpSaid = true; S.tab = CURRENT; S.screen = "album"; save(); render(); say(POP_TEXT()); say("Tap a card to hear the word. Tap the round button to play!", true); break;
      case "popsay": say(POP_TEXT()); break;
      case "crownok": S.crowns = []; sfx("close"); save(); render(); break;
      case "crownsay": say(CROWN_TEXT()); break;
      case "help": say(HELP_TEXT); break;
      case "replay": prompt(); break;
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
