/* ============================================================
   TREMPYON — the libraries
   Fills the shelves from posts/catalog.js and opens a book
   when the address ends in ?book=its-slug
   ============================================================ */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const PAGES = { chronicles: "../library/index.html", radio: "../radio/index.html" };
  const params = new URLSearchParams(location.search);
  const drafts = params.has("drafts");

  const shelfEl = $("[data-shelf]");
  if (!shelfEl) return;
  const shelf = shelfEl.dataset.shelf;
  const radio = shelf === "radio";

  // chronicles read in the order they're listed; the radio plays newest first
  const books = (window.TREMPYON_LIBRARY || [])
    .filter(b => b && b.slug && b.shelf === shelf && (drafts || !b.draft));
  books.forEach((b, i) => (b.vol = i + 1));
  if (radio) books.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const roman = n => [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]
    .reduce((out, [v, r]) => { while (n >= v) { out += r; n -= v; } return out; }, "");
  const when = d => {
    if (!d) return "";
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day || 1).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  };
  const href = b => `${PAGES[shelf]}?book=${encodeURIComponent(b.slug)}${drafts ? "&drafts" : ""}`;
  const label = b => radio ? `NeighborhoodFM · ${when(b.date)}` : `Vol. ${roman(b.vol)} · ${when(b.date)}`;

  // every book gets its own size and color, the same one every visit
  const hash = s => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
  const SPINES = radio
    ? ["#2f3a4a", "#3a2f4a", "#24343a", "#4a3a2a", "#2a2f3f", "#3d2a33"]
    : ["#5b2a2a", "#2f3a2a", "#3b2a4a", "#4a3220", "#2a3340", "#5a3a1f", "#3a1f2a"];

  /* ---------- reading one book ---------- */
  const slug = params.get("book");
  if (slug) {
    const book = books.find(b => b.slug === slug);
    $("#hall").hidden = true;
    const reader = $("#reader");
    reader.hidden = false;
    if (radio) reader.classList.add("reader--radio");
    const back = `${PAGES[shelf]}${drafts ? "?drafts" : ""}#${shelf}`;

    if (!book) {
      document.title = "Not on the shelves · Trempyon";
      $("#reader-from").textContent = radio ? "NeighborhoodFM · dead air" : "The Library";
      $("#reader-title").textContent = "This one isn't on the shelves.";
      $("#reader-body").innerHTML = `<p>Maybe it was borrowed, or maybe it hasn't been written yet. Either way, there's plenty more to read.</p>`;
      $("#reader-nav").innerHTML = `<a class="btn btn--ghost btn--sm" href="${back}">Back to the shelf</a>`;
      return;
    }

    document.title = `${book.title} · ${radio ? "NeighborhoodFM" : "The Story of Trempyon"}`;
    $("#reader-from").innerHTML = radio
      ? `<span class="radio__lamp" aria-hidden="true"></span>Now playing on NeighborhoodFM · 103.1`
      : `The Story of Trempyon · Volume ${roman(book.vol)}`;
    $("#reader-title").textContent = book.title;
    $("#reader-date").textContent = when(book.date) + (book.draft ? " · draft (hidden from the shelves)" : "");
    $("#reader-body").innerHTML = `<p class="reader__loading">${radio ? "Tuning in…" : "Turning to the first page…"}</p>`;

    // the shelf's own order: previous / next book
    const order = radio ? [...books].reverse() : books;
    const i = order.indexOf(book), prev = order[i - 1], next = order[i + 1];
    $("#reader-nav").innerHTML = `
      ${prev ? `<a class="reader__step" href="${href(prev)}"><span>← ${radio ? "Earlier" : "Previous"}</span>${esc(prev.title)}</a>` : "<span></span>"}
      <a class="btn btn--ghost btn--sm" href="${back}">Back to the shelf</a>
      ${next ? `<a class="reader__step reader__step--next" href="${href(next)}"><span>${radio ? "Later" : "Next"} →</span>${esc(next.title)}</a>` : "<span></span>"}`;

    fetch(`../posts/${encodeURIComponent(book.slug)}.md`, { cache: "no-cache" })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(text => { $("#reader-body").innerHTML = render(text); })
      .catch(() => {
        $("#reader-body").innerHTML = location.protocol === "file:"
          ? `<p>Books can't be opened straight from your computer's files. Preview the site with <code>python -m http.server 8080</code> and visit <code>localhost:8080</code> instead.</p>`
          : `<p>The pages of this one seem to be stuck together. Couldn't find <code>posts/${esc(book.slug)}.md</code>.</p>`;
      });
    return;
  }

  /* ---------- the shelf ---------- */
  const slip = $(`[data-slip="${shelf}"]`);
  const showSlip = b => {
    slip.innerHTML = `
      <p class="slip__meta">${esc(label(b))}${b.draft ? " · <b>draft</b>" : ""}</p>
      <p class="slip__title">${esc(b.title)}</p>
      ${b.blurb ? `<p class="slip__blurb">${esc(b.blurb)}</p>` : ""}
      <a class="slip__open" href="${href(b)}">${radio ? "Tune in →" : "Open it →"}</a>`;
  };

  if (!books.length) {
    shelfEl.innerHTML = `<p class="shelf-empty">${radio ? "Just static for now. The first broadcast is on its way." : "This shelf is waiting for its first book."}</p>`;
    slip.hidden = true;
    return;
  }

  shelfEl.innerHTML = books.map(b => {
    const h = hash(b.slug);
    const color = b.color || SPINES[h % SPINES.length];
    return `<a class="spine${b.draft ? " spine--draft" : ""}" href="${href(b)}" data-slug="${esc(b.slug)}"
        style="--spine:${esc(color)};--h:${170 + (h % 50)}px;--w:${38 + ((h >> 8) % 16)}px">
        <span class="spine__title">${esc(b.title)}</span>
        <span class="spine__foot">${radio ? "✶" : roman(b.vol)}</span>
      </a>`;
  }).join("") + `<span class="bookend" aria-hidden="true"></span>`;

  shelfEl.querySelectorAll(".spine").forEach(a => {
    const b = books.find(x => x.slug === a.dataset.slug);
    a.addEventListener("mouseenter", () => showSlip(b));
    a.addEventListener("focus", () => showSlip(b));
  });
  // start on the newest addition
  showSlip(radio ? books[0] : books[books.length - 1]);

  /* ---------- a very small Markdown reader ---------- */
  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  }
  function render(md) {
    return md.replace(/\r/g, "").trim().split(/\n\s*\n/).map(block => {
      const t = block.trim();
      if (/^(\*\s*){3,}$|^-{3,}$/.test(t)) return `<hr class="scene">`;
      const h = t.match(/^(#{1,3})\s+(.*)$/);
      if (h) return h[1].length === 3 ? `<h3>${inline(h[2])}</h3>` : `<h2>${inline(h[2])}</h2>`;
      if (t.split("\n").every(l => l.startsWith(">")))
        return `<blockquote><p>${t.split("\n").map(l => inline(l.replace(/^>\s?/, ""))).join("<br>")}</p></blockquote>`;
      return `<p>${t.split("\n").map(inline).join("<br>")}</p>`;
    }).join("\n");
  }
})();
