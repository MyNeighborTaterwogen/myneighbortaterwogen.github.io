/* ============================================================
   TREMPYON — behavior
   ============================================================ */
(() => {
  "use strict";

  const CFG = window.TREMPYON || {};
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";

  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode etc. */ } }
  };

  /* ---------- links & handles from config ---------- */
  $$("[data-link]").forEach(a => {
    const url = CFG.links && CFG.links[a.dataset.link];
    if (!url) return;
    a.href = url;
    if (url.startsWith("#")) { a.removeAttribute("target"); a.removeAttribute("rel"); }
  });
  if (CFG.handle) $$("[data-handle]").forEach(el => (el.textContent = CFG.handle));
  if (CFG.youtubeHandle) $$("[data-yt-handle]").forEach(el => (el.textContent = CFG.youtubeHandle));
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Discord picker: two doors, pick one (or both) ---------- */
  (function doors() {
    const dlg = $("#doors"), grid = $("#doors-grid");
    const servers = CFG.discordServers || [];
    if (!dlg || !servers.length || typeof dlg.showModal !== "function") return; // falls back to the plain invite link

    servers.forEach(sv => {
      const ready = sv.url && !/YOUR-/i.test(sv.url);
      const card = document.createElement(ready ? "a" : "div");
      card.className = "door" + (ready ? "" : " door--soon");
      card.style.setProperty("--lamp", sv.lamp || "#ffbe5c");
      if (ready) { card.href = sv.url; card.target = "_blank"; card.rel = "noopener"; }
      card.innerHTML = `
        <span class="door__frame" aria-hidden="true">
          <span class="door__window"></span><span class="door__knob"></span>
        </span>
        <span class="door__kind"></span>
        <strong class="door__name"></strong>
        <span class="door__blurb"></span>
        <span class="door__cta">${ready ? "Knock, knock →" : "Door opens soon"}</span>`;
      card.querySelector(".door__kind").textContent = sv.kind || "";
      card.querySelector(".door__name").textContent = sv.name || "";
      card.querySelector(".door__blurb").textContent = sv.blurb || "";
      grid.appendChild(card);
    });

    const close = () => dlg.close();
    dlg.addEventListener("close", () => (document.documentElement.style.overflow = ""));
    $(".doors__close", dlg).addEventListener("click", close);
    dlg.addEventListener("click", e => { if (e.target === dlg) close(); });   // click outside the card
    const open = e => {
      e.preventDefault();
      dlg.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    // These are links to the community server only as a no-JS fallback. With the pop-up
    // available they become buttons, so hovering doesn't show the community invite URL.
    $$("[data-doors]").forEach(a => {
      a.removeAttribute("href"); a.removeAttribute("target"); a.removeAttribute("rel");
      a.setAttribute("role", "button"); a.tabIndex = 0;
      a.setAttribute("aria-haspopup", "dialog");
      a.addEventListener("click", open);
      a.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") open(e); });
    });
  })();

  /* ---------- tab title (shared by the live badge + idle farewell) ---------- */
  const titles = { base: document.title, live: false, idle: false };
  const updateTitle = () => {
    document.title = titles.idle ? "Visit again soon, Young One"
      : titles.live ? "🔴 LIVE · " + titles.base : titles.base;
  };

  /* ---------- nav ---------- */
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$(".nav__links a, .nav__links button").forEach(el => el.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }));

  /* ---------- reveal on scroll ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + "ms"; io.observe(el); });
  } else {
    $$(".reveal").forEach(el => el.classList.add("is-in"));
  }

  /* ============================================================
     THE SKYLINE — a seeded, hand-crooked Victorian town
     ============================================================ */
  function rng(seed) {
    return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const r = rng(1031);
  const rand = (a, b) => a + r() * (b - a);
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const f = n => Math.round(n * 10) / 10;

  function windows(x, y, w, h, opts) {
    const { lit, layer } = opts;
    let out = "";
    // windows stay a sensible size no matter how big the house is
    const small = layer === "far";
    const ww = Math.min(small ? 7 : 10, Math.max(small ? 4 : 6, w / 6)), wh = ww * 1.8;
    const padX = Math.max(6, w * .14), padY = 10, stepY = wh + (small ? 10 : 14);
    const cols = Math.max(1, Math.min(opts.cols, Math.floor((w - padX * 2 + ww) / (ww * 2.4))));
    const rows = Math.max(0, Math.min(opts.rows, Math.floor((h - padY * 2 + (stepY - wh)) / stepY)));
    const gapX = cols > 1 ? (w - padX * 2 - cols * ww) / (cols - 1) : 0;
    const x0 = cols > 1 ? x + padX : x + (w - ww) / 2;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      if (r() > lit) continue;
      const wx = x0 + i * (ww + gapX), wy = y + padY + j * stepY;
      const cls = ["win", r() < .3 ? "dim" : "", r() < .12 ? "flicker" : "", layer === "far" ? "far-w" : ""].join(" ").trim();
      const delay = r() < .12 ? ` style="animation-delay:${f(rand(0, 4))}s"` : "";
      // arched top window
      out += `<path class="${cls}"${delay} d="M${f(wx)} ${f(wy + wh)}V${f(wy + ww / 2)}a${f(ww / 2)} ${f(ww / 2)} 0 0 1 ${f(ww)} 0V${f(wy + wh)}z"/>`;
      if (layer !== "far" && !cls.includes("dim")) out += `<rect class="glow" x="${f(wx - ww)}" y="${f(wy - ww / 2)}" width="${f(ww * 3)}" height="${f(wh + ww)}"/>`;
    }
    return out;
  }

  function house(x, base, w, h, layer) {
    const top = base - h;
    let s = "";
    const kind = r();
    if (kind < .22) {
      // tower with a witch-hat spire
      const tw = w * .55, tx = x + (w - tw) / 2, th = h * rand(1.25, 1.5);
      s += `<rect x="${f(tx)}" y="${f(base - th)}" width="${f(tw)}" height="${f(th)}"/>`;
      const lean = rand(-6, 6);
      s += `<path d="M${f(tx - 4)} ${f(base - th)}L${f(tx + tw / 2 + lean)} ${f(base - th - tw * rand(1.4, 2))}L${f(tx + tw + 4)} ${f(base - th)}z"/>`;
      s += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h)}"/>`;
      s += `<path d="M${f(x - 3)} ${f(top)}L${f(x + w / 2)} ${f(top - w * .45)}L${f(x + w + 3)} ${f(top)}z"/>`;
      s += windows(tx, base - th, tw, th - h - w * .45 - 2, { cols: 1, rows: 3, lit: .7, layer });
    } else {
      // gabled house, sometimes two gables, maybe a little crooked
      s += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h)}"/>`;
      const peak = w * rand(.55, .95), lean = rand(-8, 8);
      if (r() < .45) {
        s += `<path d="M${f(x - 4)} ${f(top)}L${f(x + w * .3 + lean)} ${f(top - peak * .8)}L${f(x + w * .6)} ${f(top)}z"/>`;
        s += `<path d="M${f(x + w * .4)} ${f(top)}L${f(x + w * .72 + lean)} ${f(top - peak)}L${f(x + w + 4)} ${f(top)}z"/>`;
      } else {
        s += `<path d="M${f(x - 5)} ${f(top)}L${f(x + w / 2 + lean)} ${f(top - peak)}L${f(x + w + 5)} ${f(top)}z"/>`;
      }
      if (r() < .7) { const cx = x + w * rand(.1, .75); s += `<rect x="${f(cx)}" y="${f(top - peak * rand(.5, .8))}" width="${f(w * .1)}" height="${f(peak * .6)}"/>`; }
    }
    s += windows(x, top, w, h, { cols: 4, rows: 6, lit: layer === "far" ? .35 : .55, layer });
    return s;
  }

  function tree(x, y, len, ang, depth) {
    if (depth === 0 || len < 4) return "";
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    let s = `<path d="M${f(x)} ${f(y)}Q${f((x + x2) / 2 + rand(-8, 8))} ${f((y + y2) / 2 + rand(-8, 8))} ${f(x2)} ${f(y2)}" stroke-width="${f(depth * depth * .55)}"/>`;
    const n = depth > 5 ? 2 : pick([2, 2, 3]);
    for (let i = 0; i < n; i++) s += tree(x2, y2, len * rand(.62, .8), ang + rand(-.7, .7) + (i - (n - 1) / 2) * .35, depth - 1);
    return s;
  }

  function buildSkyline() {
    const svg = $("#skyline");
    if (!svg) return;
    let far = "", mid = "", near = "";

    // far row
    far += `<path d="M0 520 Q 200 470 420 500 T 860 490 T 1440 480 V640 H0z"/>`;
    for (let x = -30; x < 1460;) { const w = rand(50, 100); far += house(x, rand(505, 520), w, rand(110, 210), "far"); x += w + rand(8, 18); }

    // mid row, with the clock tower in the middle
    mid += `<path d="M0 575 Q 300 545 720 560 T 1440 550 V640 H0z"/>`;
    for (let x = -40; x < 1480;) {
      if (x > 600 && x < 800) { x = 800; continue; }
      const w = rand(70, 130); mid += house(x, rand(565, 580), w, rand(100, 190), "mid"); x += w + rand(10, 28);
    }
    // clock tower
    mid += `<rect x="665" y="250" width="90" height="320"/><rect x="655" y="240" width="110" height="18"/>`;
    mid += `<path d="M650 240 L710 92 L770 240z"/><rect x="706" y="62" width="8" height="34"/>`;
    mid += `<circle cx="710" cy="300" r="30" fill="#f7d48a" opacity=".92"/><circle cx="710" cy="300" r="56" fill="url(#winGlow)"/>`;
    mid += `<path d="M710 300V280M710 300l14 6" stroke="#1a1220" stroke-width="3" stroke-linecap="round" fill="none"/>`;
    mid += windows(665, 360, 90, 200, { cols: 3, rows: 5, lit: .6, layer: "mid" });

    // near: ground, trees, fence, graves, pumpkins, lamps
    near += `<path d="M0 610 Q 160 585 360 600 Q 560 618 760 604 Q 1000 588 1200 606 Q 1340 616 1440 598 V640 H0z"/>`;
    near += `<g stroke="#0b080d" fill="none" stroke-linecap="round">${tree(90, 640, 150, -Math.PI / 2 + .12, 8)}${tree(1360, 640, 140, -Math.PI / 2 - .15, 8)}</g>`;
    for (let x = 330; x < 1100; x += 14) {
      if (x > 560 && x < 880) continue;
      near += `<path d="M${x} 612V${f(588 + rand(-3, 3))}l3 -6 3 6V612z"/>`;
    }
    near += `<rect x="330" y="594" width="230" height="3"/><rect x="880" y="594" width="220" height="3"/>`;
    [[230, 22, 34], [272, 18, 28], [1150, 24, 36], [1196, 18, 26], [1240, 20, 30]].forEach(([x, w, h]) => {
      near += `<path d="M${x} 620V${620 - h + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V620z" transform="rotate(${f(rand(-6, 6))} ${x + w / 2} 620)"/>`;
    });
    [[300, 596], [612, 600], [835, 598], [1105, 600]].forEach(([x, y]) => {
      near += `<circle cx="${x + 11}" cy="${y + 11}" r="26" fill="url(#jackGlow)" class="jack"/><use href="#pumpkin" x="${x}" y="${y}" width="22" height="22"/>`;
    });
    [[470, 520], [990, 515]].forEach(([x, y]) => {
      near += `<rect x="${x - 2}" y="${y}" width="4" height="${612 - y}"/><path d="M${x - 9} ${y}h18l-3 -18h-12z"/>`;
      near += `<rect x="${x - 6}" y="${y - 16}" width="12" height="14" fill="#ffd37a"/><circle cx="${x}" cy="${y - 9}" r="40" fill="url(#winGlow)"/>`;
    });

    // bats
    const bat = "M0 0c3-4 6-4 8-1 1-2 2-2 3 0 2-3 5-3 8 1-3-1-5 0-6 2-2-1-3-1-5 0 -1-2-4-3-8-2z";
    let bats = "";
    [[1100, 160, 22], [1180, 210, 30], [980, 120, 26]].forEach(([x, y, d], i) => {
      bats += `<g transform="translate(${x} ${y})"><path class="bat" d="${bat}"><animateTransform attributeName="transform" type="scale" values="1 1;1 .4;1 1" dur=".${4 + i}s" repeatCount="indefinite"/></path>` +
        (reduceMotion ? "" : `<animateTransform attributeName="transform" type="translate" values="${x} ${y};${x - 220} ${y - 50};${x - 420} ${y + 10};${x} ${y}" dur="${d}s" repeatCount="indefinite"/>`) + `</g>`;
    });

    svg.innerHTML = `
      <defs>
        <radialGradient id="winGlow"><stop offset="0" stop-color="#ffb347" stop-opacity=".35"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
        <radialGradient id="jackGlow"><stop offset="0" stop-color="#ff8a2a" stop-opacity=".55"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></radialGradient>
      </defs>
      ${bats}
      <g class="far">${far}</g>
      <g class="mid">${mid}</g>
      <g class="near">${near}</g>`;
  }
  buildSkyline();

  /* ---------- falling leaves ---------- */
  (function leaves() {
    const c = $("#leaves");
    if (!c || reduceMotion) return;
    const ctx = c.getContext("2d");
    const colors = ["#c4541c", "#e07b2b", "#a8341f", "#d9a03a", "#7a3a1a", "#b8652a"];
    let W, H, dpr, list = [], raf;
    const make = (init) => ({
      x: Math.random() * W, y: init ? Math.random() * H : -20,
      s: 6 + Math.random() * 9, vy: .35 + Math.random() * .7, sway: Math.random() * Math.PI * 2,
      swaySpeed: .008 + Math.random() * .014, rot: Math.random() * Math.PI * 2, vr: (Math.random() - .5) * .03,
      col: colors[Math.floor(Math.random() * colors.length)], a: .5 + Math.random() * .4
    });
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = W < 700 ? 12 : 26;
      while (list.length < n) list.push(make(true));
      list.length = n;
    }
    function leaf(l) {
      ctx.save();
      ctx.translate(l.x, l.y); ctx.rotate(l.rot); ctx.scale(1, Math.cos(l.sway * 1.6) * .5 + .6);
      ctx.globalAlpha = l.a; ctx.fillStyle = l.col;
      ctx.beginPath();
      ctx.moveTo(0, -l.s);
      ctx.quadraticCurveTo(l.s * .9, -l.s * .3, 0, l.s);
      ctx.quadraticCurveTo(-l.s * .9, -l.s * .3, 0, -l.s);
      ctx.fill();
      ctx.strokeStyle = "rgba(40,15,5,.5)"; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.moveTo(0, -l.s); ctx.lineTo(0, l.s * 1.3); ctx.stroke();
      ctx.restore();
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (const l of list) {
        l.sway += l.swaySpeed; l.y += l.vy; l.x += Math.sin(l.sway) * .8 + .15; l.rot += l.vr;
        if (l.y > H + 20 || l.x > W + 20) Object.assign(l, make(false));
        leaf(l);
      }
      raf = requestAnimationFrame(tick);
    }
    addEventListener("resize", size);
    document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden) tick(); });
    size(); tick();
  })();

  /* ---------- VHS on-screen display ---------- */
  const t0 = Date.now(), osd = $("#osd-clock");
  setInterval(() => {
    const s = Math.floor((Date.now() - t0) / 1000);
    osd.textContent = `SP ${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }, 1000);

  /* ---------- the town clock: stopped at the moment you arrived ---------- */
  (function clock() {
    const ticks = $(".clock__ticks");
    const roman = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    let s = "";
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      const tx = 100 + Math.sin(a) * 64, ty = 100 - Math.cos(a) * 64;
      s += `<text x="${f(tx)}" y="${f(ty)}" font-size="${i % 3 ? 11 : 16}">${roman[i]}</text>`;
    }
    for (let i = 0; i < 60; i++) {
      const a = i * Math.PI / 30, r1 = i % 5 ? 78 : 74;
      s += `<line x1="${f(100 + Math.sin(a) * r1)}" y1="${f(100 - Math.cos(a) * r1)}" x2="${f(100 + Math.sin(a) * 81)}" y2="${f(100 - Math.cos(a) * 81)}" stroke-width="${i % 5 ? 1 : 2.5}"/>`;
    }
    ticks.innerHTML = s;
    const now = new Date();
    const m = now.getMinutes(), h = (now.getHours() % 12) + m / 60;
    $("#clock-h").style.transform = `rotate(${h * 30}deg)`;
    $("#clock-m").style.transform = `rotate(${m * 6}deg)`;
  })();

  /* ============================================================
     BROADCAST — live status + schedule
     Live status:  decapi.me (public Twitch status, no login needed)
     Schedule:     your public Twitch schedule (iCal feed)
     Overrides:    status.json (notice / running late / cancel)
     ============================================================ */
  (function broadcast() {
    const channel = CFG.twitchChannel;
    const TZ = CFG.scheduleTimezone || "America/New_York";
    const PRE = (CFG.preshowMinutes ?? 15) * 6e4;
    const GRACE = (CFG.lateGraceMinutes ?? 60) * 6e4;
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const ICAL_DAYS = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

    const el = {
      pill: $("#live-pill"), chip: $("#hero-status"), list: $("#schedule"), notice: $("#notice"),
      crtMsg: $("#crt-msg"), crtCh: $("#crt-ch"), crtStatic: $("#crt-static"), led: $(".crt__led")
    };
    const state = { live: false, title: "", game: "", shows: [], status: { notice: "", late: {}, cancel: [] } };
    $("#preshow-min").textContent = CFG.preshowMinutes ?? 15;

    /* ---- time zone helpers (no libraries) ---- */
    const wall = (date, tz) => {
      const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
        timeZone: tz, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h23"
      }).formatToParts(date).map(x => [x.type, x.value]));
      return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute };
    };
    const offsetAt = (t, tz) => { const w = wall(new Date(t), tz); return Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi) - Math.floor(t / 6e4) * 6e4; };
    const zoned = (y, m, d, h, mi, tz) => {
      const guess = Date.UTC(y, m - 1, d, h, mi);
      let t = guess - offsetAt(guess, tz);
      const o2 = offsetAt(t, tz);
      if (guess - o2 !== t) t = guess - o2;
      return new Date(t);
    };
    const ymd = (y, m, d) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const fmtTime = d => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

    /* ---- build the next week of shows ---- */
    function expand(events) {
      const today = wall(new Date(), TZ);
      const shows = [];
      for (let i = -1; i < 8; i++) {
        const day = new Date(Date.UTC(today.y, today.m - 1, today.d + i));
        const y = day.getUTCFullYear(), m = day.getUTCMonth() + 1, d = day.getUTCDate(), wd = day.getUTCDay();
        const key = ymd(y, m, d);
        for (const ev of events) {
          const matches = ev.byday ? ev.byday.includes(wd) && key >= ev.startKey : key === ev.startKey;
          if (!matches) continue;
          let [h, mi] = [ev.h, ev.mi];
          const late = state.status.late && state.status.late[key];
          if (late) [h, mi] = late.split(":").map(Number);
          const start = zoned(y, m, d, h, mi, TZ);
          shows.push({
            key, start, doors: new Date(start - PRE), end: new Date(start.getTime() + ev.dur),
            title: ev.title || (CFG.dayTitles && CFG.dayTitles[DAYS[wd]]) || "Town Hall Broadcast",
            cancelled: ev.exdates.has(key) || (state.status.cancel || []).includes(key),
            rescheduled: !!late
          });
        }
      }
      return shows.sort((a, b) => a.start - b.start);
    }

    function parseICal(text) {
      const lines = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "").split(/\r?\n/);
      const events = [];
      let ev = null;
      for (const line of lines) {
        if (line === "BEGIN:VEVENT") { ev = { exdates: new Set(), title: "" }; continue; }
        if (line === "END:VEVENT") { if (ev && ev.startKey && !ev.cancelledAll) events.push(ev); ev = null; continue; }
        if (!ev) continue;
        const i = line.indexOf(":");
        const name = line.slice(0, i).split(";")[0], val = line.slice(i + 1);
        const dt = v => { const r = v.match(/(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?/); return r && { y: +r[1], m: +r[2], d: +r[3], h: +(r[4] || 0), mi: +(r[5] || 0) }; };
        if (name === "DTSTART") { const t = dt(val); ev.startKey = ymd(t.y, t.m, t.d); ev.h = t.h; ev.mi = t.mi; ev._s = t; }
        else if (name === "DTEND") { const t = dt(val), s = ev._s; if (s) ev.dur = Date.UTC(t.y, t.m - 1, t.d, t.h, t.mi) - Date.UTC(s.y, s.m - 1, s.d, s.h, s.mi); }
        else if (name === "RRULE") { const b = val.match(/BYDAY=([A-Z,]+)/); ev.byday = b ? b[1].split(",").map(x => ICAL_DAYS[x.slice(-2)]) : null; if (!b && /FREQ=WEEKLY/.test(val)) ev.weeklyNoDay = true; }
        else if (name === "EXDATE") val.split(",").forEach(v => { const t = dt(v); if (t) ev.exdates.add(ymd(t.y, t.m, t.d)); });
        else if (name === "SUMMARY") ev.title = val.replace(/\\,/g, ",").replace(/\\n/g, " ").trim();
        else if (name === "STATUS" && /CANCELLED/i.test(val)) ev.cancelledAll = true;
      }
      events.forEach(e => {
        e.dur = e.dur || (CFG.streamHours || 4) * 36e5;
        if (e.weeklyNoDay) { const [y, m, d] = e.startKey.split("-").map(Number); e.byday = [new Date(Date.UTC(y, m - 1, d)).getUTCDay()]; }
      });
      return events;
    }

    function fallbackEvents() {
      return (CFG.schedule || []).map(s => {
        const [h, mi] = s.time.split(":").map(Number);
        return { byday: [DAYS.indexOf(s.day)], startKey: "0000-00-00", h, mi, dur: (CFG.streamHours || 4) * 36e5, exdates: new Set(), title: s.title || "" };
      });
    }

    /* ---- what's happening right now? ---- */
    function statusOf(show, now) {
      if (show.cancelled) return "cancelled";
      if (state.live && now >= show.doors - 2 * 36e5 && now < show.end) return "live";
      if (now >= show.end) return "past";
      if (now < show.doors) return "upcoming";
      if (now < show.start) return "soon";
      if (now < show.start.getTime() + GRACE) return "late";
      return "missed";
    }

    function dayLabel(d, now) {
      const a = new Date(d), b = new Date(now);
      a.setHours(0, 0, 0, 0); b.setHours(0, 0, 0, 0);
      const diff = Math.round((a - b) / 864e5);
      if (diff === 0) return d.getHours() >= 17 ? "Tonight" : "Today";
      if (diff === 1) return "Tomorrow";
      return d.toLocaleDateString(undefined, { weekday: "long" });
    }

    const LABEL = {
      live: "● ON AIR", soon: "Doors are opening", late: "Running a little late",
      cancelled: "Cancelled", upcoming: "", missed: "Lights are off tonight"
    };

    function render() {
      const now = Date.now();
      const all = state.shows.map(s => ({ ...s, st: statusOf(s, now) }));
      const current = all.find(s => ["live", "soon", "late"].includes(s.st));
      const next = all.find(s => s.st === "upcoming");

      /* nav pill + tab title */
      el.pill.hidden = !state.live;
      titles.live = state.live; updateTitle();
      document.body.classList.toggle("is-live", state.live);

      /* hero status chip */
      let chip = "", chipCls = "";
      if (state.live) {
        chip = `<span class="status-chip__dot"></span><b>Live now at Town Hall</b>${state.title ? `<span class="status-chip__sub"></span>` : ""}`;
        chipCls = "is-live";
      } else if (current && current.st === "soon") {
        chip = `<b>Doors are opening</b> · show starts ${fmtTime(current.start)}`; chipCls = "is-soon";
      } else if (current && current.st === "late") {
        chip = `<b>Running a little late</b> · hang tight, the lamps are being lit`; chipCls = "is-late";
      } else if (next) {
        chip = `Next broadcast: <b>${dayLabel(next.doors, now)} · ${fmtTime(next.doors)}</b>`;
      }
      if (state.status.notice && !state.live) chip = `📜 <b></b>`, chipCls = "is-notice";
      el.chip.hidden = !chip;
      el.chip.className = "status-chip " + chipCls;
      el.chip.innerHTML = chip;
      if (chipCls === "is-notice") el.chip.querySelector("b").textContent = state.status.notice;
      if (state.live && state.title) el.chip.querySelector(".status-chip__sub").textContent = state.title;
      el.chip.href = state.live ? (CFG.links && CFG.links.twitch) || "#showing" : "#showing";
      el.chip.target = state.live ? "_blank" : "";

      /* notice banner on the schedule */
      el.notice.hidden = !state.status.notice;
      el.notice.textContent = state.status.notice ? "📜 " + state.status.notice : "";

      /* the TV */
      el.crtCh.textContent = state.live ? "● ON AIR" : "CH 03";
      el.crtCh.classList.toggle("is-live", state.live);
      el.led.classList.toggle("is-live", state.live);
      if (state.live) el.crtMsg.textContent = [state.title, state.game && `Playing ${state.game}`].filter(Boolean).join(" — ") || "Town Hall is live!";
      else if (current && current.st === "soon") el.crtMsg.textContent = "Doors are opening… pull up a chair.";
      else if (current && current.st === "late") el.crtMsg.textContent = "Running a little late. The kettle's on.";
      else if (next) el.crtMsg.textContent = `Off the air. Next broadcast ${dayLabel(next.doors, now).toLowerCase()} at ${fmtTime(next.doors)}.`;
      else el.crtMsg.textContent = "Off the air for now. The porch light's still on.";

      /* TV guide: today + next 6 days, one card per show */
      const guide = all.filter(s => s.st !== "past").slice(0, 7);
      el.list.innerHTML = "";
      guide.forEach(s => {
        const li = document.createElement("li");
        li.className = "is-" + s.st;
        li.innerHTML = `<span class="day"></span><span class="time"></span><span class="title"></span><span class="tag"></span>`;
        li.querySelector(".day").textContent = dayLabel(s.doors, now).toUpperCase();
        li.querySelector(".time").textContent = `Doors ${fmtTime(s.doors)} · Show ${fmtTime(s.start)}`;
        li.querySelector(".title").textContent = s.title;
        const tag = s.rescheduled && s.st === "upcoming" ? "New time" : LABEL[s.st];
        if (tag) li.querySelector(".tag").textContent = tag; else li.querySelector(".tag").remove();
        el.list.appendChild(li);
      });
      if (!guide.length) el.list.innerHTML = `<li class="is-upcoming"><span class="title">No broadcasts on the books right now. Check the Discord for news.</span></li>`;
    }

    /* ---- data loading ---- */
    async function loadStatus() {
      try {
        const r = await fetch("status.json?ts=" + Date.now(), { cache: "no-store" });
        if (r.ok) state.status = Object.assign({ notice: "", late: {}, cancel: [] }, await r.json());
      } catch { /* opened as a file, or no status.json — fine */ }
    }

    async function loadSchedule() {
      let events = null;
      if (CFG.twitchBroadcasterId) {
        try {
          const r = await fetch(`https://api.twitch.tv/helix/schedule/icalendar?broadcaster_id=${encodeURIComponent(CFG.twitchBroadcasterId)}`);
          if (r.ok) events = parseICal(await r.text());
        } catch { }
      }
      if (!events || !events.length) events = fallbackEvents();
      state.events = events;
      state.shows = expand(events);
    }

    const demo = new URLSearchParams(location.search).get("demo");   // visit /?demo=live to preview the live look
    async function loadLive() {
      if (demo === "live") { state.live = true; state.title = "Cozy spooky night in Trempyon 🎃"; state.game = "Just Chatting"; return; }
      if (!channel) return;
      const get = async what => {
        const r = await fetch(`https://decapi.me/twitch/${what}/${encodeURIComponent(channel)}?ts=${Date.now()}`, { cache: "no-store" });
        return r.ok ? (await r.text()).trim() : "";
      };
      try {
        const up = await get("uptime");
        const wasLive = state.live;
        // decapi answers "<name> is offline" when offline, or e.g. "1 hour, 4 minutes" when live
        if (/offline/i.test(up)) state.live = false;
        else if (/\b(second|minute|hour|day)s?\b/i.test(up)) state.live = true;
        if (state.live && (!wasLive || !state.title)) {
          const [title, game] = await Promise.all([get("title"), get("game")]);
          state.title = title; state.game = game;
        }
      } catch { /* status unknown — keep last known */ }
    }

    async function refresh(full) {
      if (full) { await loadStatus(); await loadSchedule(); }
      await loadLive();
      if (state.events) state.shows = expand(state.events);
      render();
    }

    refresh(true);
    setInterval(() => !document.hidden && refresh(false), 60e3);       // live check every minute
    setInterval(() => !document.hidden && refresh(true), 15 * 60e3);               // schedule + status every 15 min
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(false); });

    /* ---- the TV's "tune in" button ---- */
    const host = location.hostname;
    if (host && channel) {
      const btn = document.createElement("button");
      btn.className = "btn btn--ghost btn--sm";
      btn.textContent = "▶ Tune in here";
      btn.addEventListener("click", () => {
        const parents = new Set([host, "www.visittrempyon.com", "visittrempyon.com"]);
        const q = `channel=${encodeURIComponent(channel)}&${[...parents].map(p => "parent=" + p).join("&")}&muted=false`;
        const iframe = document.createElement("iframe");
        iframe.src = `https://player.twitch.tv/?${q}`;
        iframe.allowFullscreen = true;
        iframe.title = "Twitch stream";
        $("#twitch-slot").appendChild(iframe);
        el.crtStatic.classList.add("is-hidden");
      });
      el.crtStatic.appendChild(btn);
    }
  })();

  /* ---------- guestbook (local to this device) ---------- */
  (function guestbook() {
    const form = $("#guestbook-form"), list = $("#guestbook");
    const seed = [
      { n: "a friendly ghoul", m: "porch light was on. stayed for tea. stayed for a decade. home by dinner.", t: "Oct 31, 1997" },
      { n: "lamplighter", m: "All lanterns lit. As always.", t: "every night" }
    ];
    const render = () => {
      const entries = store.get("trempyon-guestbook", []).concat(seed);
      list.innerHTML = "";
      entries.forEach(e => {
        const li = document.createElement("li");
        const b = document.createElement("b"); b.textContent = e.n;
        const time = document.createElement("time"); time.textContent = e.t;
        li.append(b, document.createTextNode(" — " + e.m), time);
        list.appendChild(li);
      });
    };
    form.addEventListener("submit", ev => {
      ev.preventDefault();
      const n = $("#gb-name").value.trim(), m = $("#gb-msg").value.trim();
      if (!n || !m) return;
      const entries = store.get("trempyon-guestbook", []);
      entries.unshift({ n, m, t: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) });
      store.set("trempyon-guestbook", entries.slice(0, 20));
      form.reset();
      render();
    });
    render();
  })();

  /* ---------- 90s visitor counter (decorative) ---------- */
  (function counter() {
    const visits = store.get("trempyon-visits", 0) + 1;
    store.set("trempyon-visits", visits);
    const days = Math.floor((Date.now() - Date.UTC(1993, 9, 31)) / 864e5);
    $("#counter").textContent = String(days * 13 + visits).padStart(7, "0");
  })();

  /* ---------- drifting off: the farewell appears when you go idle ---------- */
  (function farewell() {
    const leave = $("#leave"), sub = $("#leave-sub");
    const IDLE = (CFG.idleMinutes ?? 2) * 6e4;
    let away = false, timer, armedAt = 0;

    function goAway(instant) {
      if (away) return;
      away = true; armedAt = Date.now();
      titles.idle = true; updateTitle();
      sub.textContent = "The lanterns will stay lit.";
      leave.hidden = false;
      // background tabs don't animate, so when the tab is hidden the farewell is simply already there
      if (instant) leave.classList.add("is-instant", "is-on");
      else requestAnimationFrame(() => requestAnimationFrame(() => leave.classList.add("is-on")));
    }

    function comeBack() {
      if (!away) return;
      away = false;
      titles.idle = false; updateTitle();
      sub.textContent = "Welcome back. No time has passed.";
      // give them a moment to see the greeting, then fade the town back in
      setTimeout(() => {
        if (away) return;
        leave.classList.remove("is-instant", "is-on");
        setTimeout(() => { if (!away) leave.hidden = true; }, 1400);
      }, reduceMotion ? 800 : 2600);
    }

    function activity() {
      // ignore the stray mouse twitch right as the farewell appears
      if (away && Date.now() - armedAt > 800) comeBack();
      clearTimeout(timer);
      timer = setTimeout(goAway, IDLE);
    }

    ["pointermove", "pointerdown", "keydown", "scroll", "wheel", "touchstart"].forEach(ev =>
      addEventListener(ev, activity, { passive: true }));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { clearTimeout(timer); goAway(true); }
      else { comeBack(); activity(); }
    });
    leave.addEventListener("click", comeBack);
    activity();
  })();
})();
