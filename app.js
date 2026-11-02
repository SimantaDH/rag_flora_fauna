/* Extraction of Indian Cultural Elements Using RAG
   Simanta Nandi, 2026. CC BY-NC 4.0
   No libraries. All data comes from data.js (window.DATA). */

/* ---- the GitHub repository and its Pages address ---- */
var CONFIG = {
  github: 'https://github.com/SimantaDH/rag_flora_fauna',
  pages: 'https://simantadh.github.io/rag_flora_fauna/'   // used in citations when the page is opened from disk
};

(function () {
  'use strict';
  var D = window.DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CATS = D.cats, FLORA = CATS.slice(0, 5);
  var NS = 'http://www.w3.org/2000/svg';
  var BOOKS = D.books;
  var CHECKED = BOOKS.filter(function (b) { return b.entities.length; });
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(tag, attrs, html) { var e = document.createElement(tag); for (var k in attrs || {}) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function svg(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs || {}) e.setAttribute(k, attrs[k]); return e; }
  function cssv(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function pct(x, d) { return (x * 100).toFixed(d == null ? 0 : d) + '%'; }
  function ital(s) { return esc(s).replace(/_([^_]+)_/g, '<i>$1</i>'); }

  /* ---------- config links ---------- */
  var gh = $('#gh-link'); if (gh) gh.href = CONFIG.github;
  var PAGE_URL = /^https?:/.test(location.protocol) ? location.origin + location.pathname.replace(/index\.html$/, '') : CONFIG.pages;

  /* ---------- theme ---------- */
  var themeBtn = $('#theme-btn');
  function setThemeLabel() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    $('.theme-label').textContent = dark ? 'Day' : 'Night';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to day reading' : 'Switch to night reading');
  }
  themeBtn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    setThemeLabel(); redrawCharts();
  });
  setThemeLabel();

  /* ---------- menu + active section ---------- */
  var nav = $('#nav'), menuBtn = $('.menu-btn');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open);
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }); });
  if ('IntersectionObserver' in window) {
    var links = {}; $$('#nav a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) { $$('#nav a.on').forEach(function (x) { x.classList.remove('on'); }); links[en.target.id].classList.add('on'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    var rv = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rv.unobserve(en.target); } }); }, { threshold: .2 });
    $$('.sec h2').forEach(function (h) { h.classList.add('reveal'); rv.observe(h); });
    window.addEventListener('beforeprint', function () { $$('.reveal').forEach(function (h) { h.classList.add('in'); }); });
  }

  /* ---------- numbers in the prose ---------- */
  var all = []; CHECKED.forEach(function (b) { all = all.concat(b.entities); });
  var nums = {
    'allm-rows': D.audit.length,
    'allm-correct': D.audit.filter(function (r) { return r.verdict === 'C'; }).length,
    'entries': all.length,
    'verified': all.filter(function (e) { return e.status === 'Verified'; }).length,
    'ambiguous': all.filter(function (e) { return e.status === 'Ambiguous'; }).length,
    'vern-total': all.filter(function (e) { return e.vernacular; }).length
  };
  $$('[data-n]').forEach(function (s) { var k = s.getAttribute('data-n'); if (nums[k] != null) s.textContent = nums[k]; });

  /* =========================================================
     HERO: read by lamplight
     ========================================================= */
  (function hero() {
    var hero = $('#hero'), dark = $('#dark-text'), lit = $('#lit-text');
    function mark(p) {
      var q = ital(p.q);
      p.forms.forEach(function (f) {
        var rx = new RegExp('(^|[^A-Za-zÀ-ÿ>])(' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![A-Za-zÀ-ÿ])', 'gi');
        q = q.replace(rx, function (m, a, b) { return a + '<mark>' + b + '</mark>'; });
      });
      return '<p class="passage">' + q + '<small>' + esc(p.src) + '</small></p>';
    }
    var second = D.hero.slice(); second.reverse();
    var html = D.hero.map(mark).join('') + second.map(mark).join('');
    dark.innerHTML = html; lit.innerHTML = html;

    var cursor = el('div', { 'class': 'lamp-cursor', 'aria-hidden': 'true' },
      '<svg viewBox="0 0 34 34"><defs><radialGradient id="fl" cx="50%" cy="65%" r="60%"><stop offset="0" stop-color="#FFF3C4"/><stop offset=".45" stop-color="#F6C65B"/><stop offset="1" stop-color="#D9822B" stop-opacity="0"/></radialGradient></defs>' +
      '<path d="M17 4c3 5 6 7.5 6 11.5a6 6 0 0 1-12 0C11 11.5 14 9 17 4z" fill="url(#fl)"/>' +
      '<path d="M4 24c3 4 8 6 13 6s10-2 13-6H4z" fill="#B5733A"/><path d="M4 24h26" stroke="#E2A45A" stroke-width="1.5"/></svg>');
    hero.appendChild(cursor);

    var tx = 0.5, ty = 0.55, x = tx, y = ty, lastMove = 0, raf = null, t0 = performance.now();
    var allOn = false;
    function rect() { return hero.getBoundingClientRect(); }
    function onMove(cx, cy) {
      var r = rect(); tx = (cx - r.left) / r.width; ty = (cy - r.top) / r.height; lastMove = performance.now();
    }
    hero.addEventListener('pointermove', function (e) { onMove(e.clientX, e.clientY); });
    hero.addEventListener('touchmove', function (e) { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    function frame(now) {
      var r = rect();
      if (now - lastMove > 2600) {             // the lamp drifts by itself when nobody holds it
        var t = (now - t0) / 1000;
        tx = 0.5 + 0.34 * Math.sin(t * 0.23) + 0.06 * Math.sin(t * 0.9);
        ty = 0.5 + 0.28 * Math.sin(t * 0.31 + 1.3);
      }
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      var flick = 1 + 0.035 * Math.sin(now / 90) + 0.025 * Math.sin(now / 37);
      var base = Math.max(150, Math.min(240, r.width * 0.16));
      hero.style.setProperty('--x', (x * 100).toFixed(2) + '%');
      hero.style.setProperty('--y', (y * 100).toFixed(2) + '%');
      hero.style.setProperty('--r', (base * flick).toFixed(1) + 'px');
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && !reduce && !allOn) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }).observe(hero); else start();

    var btn = $('#lamp-all');
    function setAll(on) {
      allOn = on; hero.classList.toggle('all', on);
      btn.textContent = on ? 'Put the lamp back' : 'Light the whole page';
      $('#hero-hint').textContent = on ? 'Every name of a plant or animal on this page is lit in gold.' : 'Move the lamp across the dark to read. Under it, every name of a plant or animal glows.';
      if (on) stop(); else start();
    }
    btn.addEventListener('click', function () { setAll(!allOn); });
    if (reduce) setAll(true);

    /* fireflies: a handful of slow lights, drawn only while the hero is on screen */
    var cv = $('#fireflies'), ctx = cv.getContext('2d'), flies = [], fr = null;
    function size() { var r = rect(), dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function seed() { flies = []; var r = rect(); for (var i = 0; i < 16; i++) flies.push({ x: Math.random() * r.width, y: Math.random() * r.height, a: Math.random() * 6.28, s: .15 + Math.random() * .35, p: Math.random() * 6.28 }); }
    function draw(now) {
      var r = rect(); ctx.clearRect(0, 0, r.width, r.height);
      flies.forEach(function (f) {
        f.a += (Math.random() - .5) * .08; f.x += Math.cos(f.a) * f.s; f.y += Math.sin(f.a) * f.s - .05;
        if (f.x < -10) f.x = r.width + 10; if (f.x > r.width + 10) f.x = -10; if (f.y < -10) f.y = r.height + 10; if (f.y > r.height + 10) f.y = -10;
        var glow = .35 + .65 * Math.max(0, Math.sin(now / 700 + f.p));
        var g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 9);
        g.addColorStop(0, 'rgba(255,236,150,' + (.9 * glow) + ')'); g.addColorStop(1, 'rgba(255,200,80,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, 9, 0, 6.28); ctx.fill();
      });
      fr = requestAnimationFrame(draw);
    }
    if (!reduce) {
      size(); seed();
      window.addEventListener('resize', function () { size(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { if (e[0].isIntersecting) { if (!fr) fr = requestAnimationFrame(draw); } else { cancelAnimationFrame(fr); fr = null; } }).observe(hero);
    }
  })();

  /* =========================================================
     TOOLTIP
     ========================================================= */
  var tip = $('#tip');
  function showTip(html, ev) {
    tip.innerHTML = html; tip.hidden = false;
    var x = ev.clientX + 14, y = ev.clientY + 14, w = tip.offsetWidth, h = tip.offsetHeight;
    if (x + w > innerWidth - 8) x = ev.clientX - w - 14; if (y + h > innerHeight - 8) y = ev.clientY - h - 14;
    tip.style.left = Math.max(8, x) + 'px'; tip.style.top = Math.max(8, y) + 'px';
  }
  function hideTip() { tip.hidden = true; }
  function tipFromEl(node, html) {
    node.addEventListener('mousemove', function (e) { showTip(html, e); });
    node.addEventListener('mouseleave', hideTip);
    node.addEventListener('focus', function () { var r = node.getBoundingClientRect(); showTip(html, { clientX: r.right, clientY: r.top }); });
    node.addEventListener('blur', hideTip);
  }

  /* =========================================================
     BOOKSHELF
     ========================================================= */
  var SPINE = { gitanjali: '#2E5A4A', ancient_ballads: '#7A3B3B', jungle_book: '#3F4F82', bird_of_time: '#8A6A2A', golden_threshold: '#9B7420', glimpses_of_bengal: '#355E7A', adivasi: '#5C4A6E', sakoontala: '#6B4A2E' };
  var HEIGHT = { gitanjali: 236, ancient_ballads: 268, jungle_book: 286, bird_of_time: 228, golden_threshold: 248, glimpses_of_bengal: 274, adivasi: 240, sakoontala: 296 };
  var shelf = $('#shelf'), panel = $('#book-panel');
  BOOKS.forEach(function (b, i) {
    var s = el('button', { 'class': 'spine' + (b.entities.length ? '' : ' na'), role: 'tab', 'aria-selected': 'false', id: 'sp-' + b.id, type: 'button',
      style: '--sp:' + SPINE[b.id] + ';--h:' + HEIGHT[b.id] + 'px', 'aria-controls': 'book-panel' },
      '<span class="t">' + esc(b.short) + '</span><span class="a">' + esc(b.author.split(' ').slice(-1)[0]) + '</span>');
    s.addEventListener('click', function () { openBook(b.id); });
    s.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var j = (i + (e.key === 'ArrowRight' ? 1 : BOOKS.length - 1)) % BOOKS.length; openBook(BOOKS[j].id); $('#sp-' + BOOKS[j].id).focus();
      }
    });
    shelf.appendChild(s);
  });
  function openBook(id) {
    var b = BOOKS.filter(function (x) { return x.id === id; })[0];
    $$('.spine').forEach(function (s) { s.setAttribute('aria-selected', s.id === 'sp-' + id ? 'true' : 'false'); s.tabIndex = s.id === 'sp-' + id ? 0 : -1; });
    var max = Math.max.apply(null, CATS.map(function (c) { return b.counts[c]; }).concat([1]));
    var bars = b.entities.length ? '<div class="mini-bars" aria-hidden="true">' + CATS.map(function (c, k) {
      return '<div class="' + (k > 4 ? 'fa' : '') + '" style="height:' + (b.counts[c] / max * 100) + '%" title="' + c + ': ' + b.counts[c] + '"></div>'; }).join('') + '</div>' +
      '<div class="mini-labels" aria-hidden="true">' + CATS.map(function (c) { return '<span>' + c + '<br>' + b.counts[c] + '</span>'; }).join('') + '</div>' : '';
    var meta = [
      ['Author', b.author + (b.role ? ', ' + b.role : '')], ['First published', b.first], ['Form', b.genre], ['Setting', b.setting],
      ['Also in the file', b.paratext || 'None'],
      ['Source', b.pg ? 'Project Gutenberg eBook #' + b.pg + ' (' + b.pgdate + '), plain text' : (b.src || '')],
      ['AnythingLLM workspace', b.allm ? b.allm.workspace + ', ' + b.allm.vectors + ' vectors, temperature ' + b.allm.temperature : (b.audit_rows ? 'Same settings as the others; no screenshot of its own' : 'Not run')],
      ['Words in the cleaned file', b.words ? b.words.toLocaleString('en-GB') : 'Not available']
    ];
    var status = '<span class="status-pill ok">Checked against the full text</span> &nbsp;' + b.entities.length + ' entries: ' + b.verified + ' verified, ' + b.ambiguous + ' ambiguous';
    panel.innerHTML = '<h3>' + esc(b.title) + '</h3><p>' + status + '</p>' +
      '<dl class="book-meta">' + meta.map(function (m) { return '<div><dt>' + m[0] + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join('') + '</dl>' + bars +
      '<div class="btn-row">' +
      (b.entities.length ? '<button type="button" class="btn primary" data-go="' + b.id + '">See its flora and fauna</button>' : '') +
      (b.pg ? '<a class="btn" href="https://www.gutenberg.org/ebooks/' + b.pg + '" target="_blank" rel="noopener">Open on Project Gutenberg</a>' : '') +
      (b.src_url ? '<a class="btn" href="' + b.src_url + '" target="_blank" rel="noopener">' + esc(b.src_btn || 'Open the source') + '</a>' : '') +
      (b.pg || b.txt ? '<a class="btn" href="' + b.id + '.txt" target="_blank">Open the cleaned .txt</a>' : '') +
      (b.audit_rows ? '<button type="button" class="btn" data-audit="' + b.id + '">See the AnythingLLM audit</button>' : '') + '</div>';
    var go = $('[data-go]', panel); if (go) go.addEventListener('click', function () { setFilters({ text: b.id }); scrollToId('explorer-h'); });
    var au = $('[data-audit]', panel); if (au) au.addEventListener('click', function () { $('#a-text').value = b.id; renderAuditTable(); $('.audit-table-box').open = true; scrollToId('audit'); });
  }
  openBook('gitanjali');
  function scrollToId(id) { var n = document.getElementById(id); if (n) n.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }

  /* ---------- vector table ---------- */
  $('#vector-table tbody').innerHTML = D.vectors.map(function (v) {
    return '<tr><td>' + esc(v[0]) + '</td><td class="num">' + v[1] + '</td><td class="num">' + (v[2] == null ? 'No file' : v[2]) + '</td></tr>';
  }).join('');

  /* ---------- screenshots ---------- */
  // The last three workspaces were run with the same settings but have no screenshots of their own,
  // so their tabs reuse the screenshots of another workspace, in turn, and say so in the caption.
  var SHOTS = [
    ['Gitanjali', 'gitanjali'], ['Ancient Ballads', 'ballads'], ['The Jungle Book', 'junglebook'], ['The Bird of Time', 'birdoftime'], ['The Golden Threshold', 'threshold'],
    ['Glimpses of Bengal', 'ballads', 'Ancient Ballads'], ['The Adivasi Will Not Dance', 'junglebook', 'The Jungle Book'], ['Sakoontala', 'threshold', 'The Golden Threshold']
  ];
  var VEC = { gitanjali: 2, ballads: 165, junglebook: 323, birdoftime: 60, threshold: 71 };
  var TEMP = { gitanjali: '0.2', ballads: '0.1', junglebook: '0.1', birdoftime: '0.1', threshold: '0.1' };
  var shotTabs = $('#shot-tabs'), shots = $('#shots');
  SHOTS.forEach(function (s, i) {
    var b = el('button', { type: 'button', role: 'tab', 'aria-selected': i === 0 ? 'true' : 'false' }, esc(s[0]));
    b.addEventListener('click', function () { $$('button', shotTabs).forEach(function (x) { x.setAttribute('aria-selected', 'false'); }); b.setAttribute('aria-selected', 'true'); showShots(s); });
    shotTabs.appendChild(b);
  });
  function showShots(s) {
    var k = s[1], reused = s[2];
    var items = reused ? [
      ['allm-' + k + '-chat.png', 'Chat settings: Query mode, default system prompt, temperature 0.1. Screenshot reused from the workspace for ' + reused + '.'],
      ['allm-' + k + '-vector.png', 'Vector database: 4 context snippets, similarity threshold 0.25. Screenshot reused from the workspace for ' + reused + ', so the vector count shown is not this book\'s.'],
      ['allm-' + k + '-agent.png', 'Agent configuration: LM Studio serving google/gemma-3-4b. Screenshot reused from the workspace for ' + reused + '.']
    ] : [
      ['allm-' + k + '-chat.png', 'Chat settings: Query mode, default system prompt, temperature ' + TEMP[k] + '.'],
      ['allm-' + k + '-vector.png', 'Vector database: ' + VEC[k] + ' vectors, 4 context snippets, similarity threshold 0.25.'],
      ['allm-' + k + '-agent.png', 'Agent configuration: LM Studio serving google/gemma-3-4b.']
    ];
    $('#shot-note').textContent = reused
      ? s[0] + ' was run with the same settings as the other workspaces. No screenshots of its own were taken, so the ones below are reused from the workspace for ' + reused + '.'
      : 'Every workspace used the same settings. Select a screenshot to enlarge it.';
    shots.innerHTML = items.map(function (it) {
      return '<figure><button type="button" data-src="' + it[0] + '" data-cap="' + esc(s[0] + '. ' + it[1]) + '" aria-label="Enlarge: ' + esc(it[1]) + '"><img src="' + it[0] + '" alt="AnythingLLM screenshot for ' + esc(s[0]) + ': ' + esc(it[1]) + '" loading="lazy"></button><figcaption>' + esc(it[1]) + '</figcaption></figure>';
    }).join('');
  }
  showShots(SHOTS[0]);
  var lb = $('#lightbox');
  shots.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-src]'); if (!b) return;
    $('img', lb).src = b.getAttribute('data-src'); $('img', lb).alt = b.getAttribute('data-cap'); $('.lb-cap', lb).textContent = b.getAttribute('data-cap');
    lb.hidden = false; $('.lb-close', lb).focus(); lb._from = b;
  });
  function closeLb() { lb.hidden = true; if (lb._from) lb._from.focus(); }
  $('.lb-close', lb).addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* ---------- pipeline: light each step on hover ---------- */
  $$('#pipeline li').forEach(function (li) {
    li.addEventListener('mouseenter', function () { li.classList.add('lit'); });
    li.addEventListener('mouseleave', function () { li.classList.remove('lit'); });
  });

  /* ---------- the prompt (small markdown reader) ---------- */
  (function () {
    var lines = D.prompt.split('\n'), out = [], list = null, table = null;
    function inline(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); }
    function flush() { if (list) { out.push('</' + list + '>'); list = null; } if (table) { out.push('</tbody></table></div>'); table = null; } }
    lines.forEach(function (l) {
      var t = l.trim();
      if (/^\|/.test(t)) {
        if (/^\|[-| ]+\|$/.test(t)) return;
        var cells = t.replace(/^\||\|$/g, '').split('|').map(function (c) { return inline(c.trim()); });
        if (!table) { flush(); out.push('<div class="table-scroll"><table><thead><tr>' + cells.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>'); table = 1; }
        else out.push('<tr>' + cells.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>');
        return;
      }
      if (table) flush();
      var m;
      if ((m = t.match(/^(#{1,3})\s+(.*)/))) { flush(); out.push('<h' + m[1].length + '>' + inline(m[2]) + '</h' + m[1].length + '>'); }
      else if (/^---+$/.test(t)) { flush(); out.push('<hr>'); }
      else if ((m = t.match(/^- (.*)/))) { if (list !== 'ul') { flush(); out.push('<ul>'); list = 'ul'; } out.push('<li>' + inline(m[1]) + '</li>'); }
      else if ((m = t.match(/^\d+\.\s+(.*)/))) { if (list !== 'ol') { flush(); out.push('<ol>'); list = 'ol'; } out.push('<li>' + inline(m[1]) + '</li>'); }
      else if (t === '') { flush(); }
      else { flush(); out.push('<p>' + inline(t) + '</p>'); }
    });
    flush();
    $('#prompt-text').innerHTML = out.join('');
  })();

  /* =========================================================
     RESULTS
     ========================================================= */
  var uniqueCount = {}; CATS.forEach(function (c) { var grp = FLORA.indexOf(c) > -1 ? D.agg.flora : D.agg.fauna; uniqueCount[c] = grp[c].length; });
  var entryCount = {}; CATS.forEach(function (c) { entryCount[c] = all.filter(function (e) { return e.category === c; }).length; });
  var floraU = FLORA.reduce(function (s, c) { return s + uniqueCount[c]; }, 0), faunaU = CATS.slice(5).reduce(function (s, c) { return s + uniqueCount[c]; }, 0);
  $('#stats').innerHTML = [
    [CHECKED.length + ' of 8', 'texts checked against the full source'],
    [floraU, 'unique plants named across the corpus'],
    [faunaU, 'unique animals named across the corpus'],
    [nums.verified, 'verified entries, each with an exact quotation']
  ].map(function (s) { return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('');

  var catMode = 'unique';
  $$('#results .chart-head .seg button').forEach(function (b) {
    b.addEventListener('click', function () { catMode = b.getAttribute('data-mode'); $$('#results .chart-head .seg button').forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); }); drawCats(); });
  });
  $('#cat-legend').innerHTML = '<span><i style="background:var(--c-flora)"></i>Flora</span><span><i style="background:var(--c-fauna)"></i>Fauna</span>';

  function drawCats() {
    var box = $('#cat-chart'); box.innerHTML = '';
    var W = Math.max(320, box.clientWidth), rowH = 34, left = W < 520 ? 76 : 96, right = 46, top = 6, H = top + CATS.length * rowH + 8;
    var data = CATS.map(function (c) { return { c: c, v: catMode === 'unique' ? uniqueCount[c] : entryCount[c] }; });
    var max = Math.max.apply(null, data.map(function (d) { return d.v; }));
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Names per category, ' + (catMode === 'unique' ? 'unique across the corpus' : 'entries text by text') });
    var tw = W - left - right;
    [0.25, .5, .75, 1].forEach(function (f) { s.appendChild(svg('line', { x1: left + tw * f, x2: left + tw * f, y1: top, y2: H - 8, 'class': 'grid' })); });
    data.forEach(function (d, i) {
      var y = top + i * rowH, w = Math.max(2, d.v / max * tw), fl = i < 5;
      var g = svg('g', { 'class': 'mark', tabindex: '0', role: 'button', 'aria-label': d.c + ': ' + d.v + '. Select to list them.' });
      var lab = svg('text', { x: left - 10, y: y + rowH / 2 + 4.5, 'text-anchor': 'end', 'class': 'lbl' }); lab.textContent = d.c; g.appendChild(lab);
      g.appendChild(svg('path', { d: roundRight(left, y + 7, w, rowH - 14, 4), fill: fl ? 'var(--c-flora)' : 'var(--c-fauna)' }));
      var v = svg('text', { x: left + w + 8, y: y + rowH / 2 + 4.5, 'class': 'val' }); v.textContent = d.v; g.appendChild(v);
      g.appendChild(svg('rect', { x: 0, y: y, width: W, height: rowH, 'class': 'hit' }));
      var grp = fl ? D.agg.flora : D.agg.fauna;
      var names = grp[d.c].map(function (x) { return x.split(' | ')[0]; });
      var html = '<b>' + d.c + ': ' + d.v + (catMode === 'unique' ? ' unique names' : ' entries') + '</b>' + esc(names.slice(0, 14).join(', ')) + (names.length > 14 ? ', and ' + (names.length - 14) + ' more' : '');
      tipFromEl(g, html);
      g.addEventListener('mouseenter', function () { box.classList.add('dim'); g.classList.add('hot'); });
      g.addEventListener('mouseleave', function () { box.classList.remove('dim'); g.classList.remove('hot'); });
      g.addEventListener('click', function () { setFilters({ cat: d.c }); scrollToId('explorer-h'); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.dispatchEvent(new Event('click')); } });
      s.appendChild(g);
    });
    box.appendChild(s);
  }
  function roundRight(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); return 'M' + x + ',' + y + 'h' + (w - r) + 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r + 'v' + (h - 2 * r) + 'a' + r + ',' + r + ' 0 0 1 -' + r + ',' + r + 'h-' + (w - r) + 'z'; }

  function drawHeat() {
    var box = $('#heatmap'); box.innerHTML = '';
    var W = Math.max(640, box.clientWidth), left = 196, top = 30, cw = (W - left) / 10, ch = 40, H = top + CHECKED.length * ch + 4;
    var max = 0; CHECKED.forEach(function (b) { CATS.forEach(function (c) { max = Math.max(max, b.counts[c]); }); });
    var seq = ['--seq-0', '--seq-1', '--seq-2', '--seq-3', '--seq-4', '--seq-5'].map(cssv);
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Heat map of names per text and category' });
    CATS.forEach(function (c, j) { var t = svg('text', { x: left + j * cw + cw / 2, y: 18, 'text-anchor': 'middle', 'class': 'lbl' }); t.textContent = c; s.appendChild(t); });
    CHECKED.forEach(function (b, i) {
      var t = svg('text', { x: left - 10, y: top + i * ch + ch / 2 + 4.5, 'text-anchor': 'end', 'class': 'lbl' }); t.textContent = b.short; s.appendChild(t);
      CATS.forEach(function (c, j) {
        var v = b.counts[c], k = v === 0 ? 0 : Math.min(5, 1 + Math.floor((v / max) * 4.999));
        var g = svg('g', { 'class': 'cell', tabindex: '0', role: 'button', 'aria-label': b.short + ', ' + c + ': ' + v });
        g.appendChild(svg('rect', { x: left + j * cw + 1, y: top + i * ch + 1, width: cw - 2, height: ch - 2, rx: 3, fill: seq[k] }));
        var tt = svg('text', { x: left + j * cw + cw / 2, y: top + i * ch + ch / 2 + 4.5, 'text-anchor': 'middle' });
        tt.textContent = v;
        tt.setAttribute('style', 'fill:' + (dark ? (k >= 4 ? '#0F1626' : '#E8E3D3') : (k >= 3 ? '#F4F1E8' : '#1F2A44')));
        g.appendChild(tt);
        var names = b.entities.filter(function (e) { return e.category === c; }).map(function (e) { return e.name.split(' / ')[0]; });
        tipFromEl(g, '<b>' + esc(b.short) + ': ' + c + ' (' + v + ')</b>' + esc(names.slice(0, 12).join(', ')) + (names.length > 12 ? ' ...' : ''));
        g.addEventListener('click', function () { setFilters({ text: b.id, cat: c }); scrollToId('explorer-h'); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFilters({ text: b.id, cat: c }); scrollToId('explorer-h'); } });
        s.appendChild(g);
      });
    });
    var wrap = el('div', { 'class': 'table-scroll' }); wrap.appendChild(s); box.appendChild(wrap);
    s.style.minWidth = '640px';
  }

  function drawVern() {
    var box = $('#vern-chart'); box.innerHTML = '';
    var rows = CHECKED.slice().sort(function (a, b) { return b.vern_share - a.vern_share; });
    var W = Math.max(320, box.clientWidth), left = W < 520 ? 128 : 170, right = 52, rowH = 34, H = rows.length * rowH + 30;
    var tw = W - left - right, max = 0.4;
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Share of entries kept in an Indian-language form, by text' });
    [0, .1, .2, .3, .4].forEach(function (f) {
      var x = left + f / max * tw; s.appendChild(svg('line', { x1: x, x2: x, y1: 0, y2: H - 24, 'class': 'grid' }));
      var t = svg('text', { x: x, y: H - 6, 'text-anchor': 'middle', 'class': 'lbl' }); t.textContent = pct(f); s.appendChild(t);
    });
    rows.forEach(function (b, i) {
      var y = i * rowH, w = b.vern_share / max * tw;
      var g = svg('g', { 'class': 'mark', tabindex: '0' });
      var t = svg('text', { x: left - 10, y: y + rowH / 2 + 4.5, 'text-anchor': 'end', 'class': 'lbl' }); t.textContent = b.short; g.appendChild(t);
      g.appendChild(svg('path', { d: roundRight(left, y + 8, Math.max(2, w), rowH - 16, 4), fill: 'var(--c-partly)' }));
      var v = svg('text', { x: left + w + 8, y: y + rowH / 2 + 4.5, 'class': 'val' }); v.textContent = pct(b.vern_share); g.appendChild(v);
      g.appendChild(svg('rect', { x: 0, y: y, width: W, height: rowH, 'class': 'hit' }));
      var vn = b.entities.filter(function (e) { return e.vernacular; }).map(function (e) { return e.name.split(' / ')[0]; });
      tipFromEl(g, '<b>' + esc(b.short) + ': ' + vn.length + ' of ' + b.entities.length + '</b>' + esc(vn.join(', ')));
      s.appendChild(g);
    });
    box.appendChild(s);
  }

  /* =========================================================
     EXPLORER
     ========================================================= */
  var F = { text: '', cat: '', status: '', set: '', vern: false, q: '' }, view = 'list', shown = 36;
  var fText = $('#f-text'), fCat = $('#f-cat');
  CHECKED.forEach(function (b) { fText.appendChild(el('option', { value: b.id }, esc(b.short))); });
  CATS.forEach(function (c) { fCat.appendChild(el('option', { value: c }, c)); });
  function readF() { F.text = fText.value; F.cat = fCat.value; F.status = $('#f-status').value; F.set = $('#f-set').value; F.vern = $('#f-vern').checked; F.q = $('#f-q').value.trim().toLowerCase(); }
  function setFilters(o) {
    if (o.text != null) fText.value = o.text; if (o.cat != null) fCat.value = o.cat;
    if (o.q != null) $('#f-q').value = o.q; if (o.view) setView(o.view);
    shown = 36; readF(); renderExplorer();
  }
  ['#f-text', '#f-cat', '#f-status', '#f-set', '#f-vern'].forEach(function (s) { $(s).addEventListener('change', function () { shown = 36; readF(); renderExplorer(); }); });
  $('#f-q').addEventListener('input', function () { shown = 36; readF(); renderExplorer(); });
  $('#f-reset').addEventListener('click', function () { fText.value = ''; fCat.value = ''; $('#f-status').value = ''; $('#f-set').value = ''; $('#f-vern').checked = false; $('#f-q').value = ''; shown = 36; readF(); renderExplorer(); });
  $$('#explorer .view-row .seg button').forEach(function (b) { b.addEventListener('click', function () { setView(b.getAttribute('data-view')); renderExplorer(); }); });
  function setView(v) { view = v; $$('#explorer .view-row .seg button').forEach(function (x) { x.setAttribute('aria-checked', x.getAttribute('data-view') === v ? 'true' : 'false'); }); }
  function match(b, e) {
    if (F.text && b.id !== F.text) return false;
    if (F.cat && e.category !== F.cat) return false;
    if (F.status && e.status !== F.status) return false;
    var indian = !e.setting || e.setting === 'India';
    if (F.set === 'india' && !indian) return false;
    if (F.set === 'other' && indian) return false;
    if (F.vern && !e.vernacular) return false;
    if (F.q) { var hay = (e.name + ' ' + e.english + ' ' + e.remarks + ' ' + e.quote + ' ' + e.category).toLowerCase(); if (hay.indexOf(F.q) < 0) return false; }
    return true;
  }
  function renderExplorer() {
    var out = $('#ex-out'), total = 0, html = '';
    if (view === 'list') {
      CHECKED.forEach(function (b) {
        var ents = b.entities.filter(function (e) { return match(b, e); });
        if (!ents.length) return; total += ents.length;
        html += '<section class="textlist"><h4>' + esc(b.short) + '</h4><p>' + esc(b.author + (b.role ? ', ' + b.role : '')) + ', ' + esc(b.year) + '. ' + ents.length + ' entries shown.</p>';
        CATS.forEach(function (c) {
          var es = ents.filter(function (e) { return e.category === c; }); if (!es.length) return;
          html += '<div class="catrow"><div class="cn">' + c + '<small>' + es.length + '</small></div><div class="chips">' + es.map(function (e) {
            var idx = b.entities.indexOf(e);
            return '<button type="button" class="chip ' + (FLORA.indexOf(c) > -1 ? 'fl' : 'fa') + (e.status === 'Ambiguous' ? ' amb' : '') + '" data-b="' + b.id + '" data-i="' + idx + '" title="' + esc(e.english) + '">' +
              (e.vernacular ? '<span class="vn">' + esc(e.name.split(' / ')[0]) + '</span>' : esc(e.name.split(' / ')[0])) + (e.status === 'Ambiguous' ? ' ?' : '') + '</button>';
          }).join('') + '</div></div>';
        });
        if (!F.cat && !F.q && !F.vern && !F.status && !F.set) {
          html += '<details class="more generic-box"><summary>Generic words, animals outside the ten categories, and rejected readings</summary>' +
            '<p><b>Generic, not counted:</b> ' + esc(b.generic.map(function (g) { return g.english + ' (' + g.occurrences + ')'; }).join('; ')) + '.</p>' +
            (b.outside.length ? '<p><b>Outside the ten categories:</b> ' + esc(b.outside.map(function (g) { return g.english + ' (' + g.occurrences + ')'; }).join('; ')) + '.</p>' : '') +
            '<p><b>Rejected after reading:</b></p><ul>' + b.rejected.map(function (r) { return '<li><i>' + esc(r[0]) + '</i>: ' + esc(r[1]) + '</li>'; }).join('') + '</ul></details>';
        }
        html += '</section>';
      });
      out.innerHTML = total ? html + '<p class="hint">Gold names are kept in an Indian-language form. A dashed outline and a question mark mean ambiguous. Select a name to read its quotation.</p>' : '<div class="empty">No entries match these filters. Try clearing one of them.</div>';
    } else {
      var list = [];
      CHECKED.forEach(function (b) { b.entities.forEach(function (e, i) { if (match(b, e)) list.push([b, e, i]); }); });
      total = list.length;
      html = '<div class="cards">' + list.slice(0, shown).map(function (x) { return card(x[0], x[1], x[2]); }).join('') + '</div>';
      if (list.length > shown) html += '<div class="pager"><button type="button" class="btn" id="more-btn">Show ' + Math.min(36, list.length - shown) + ' more of ' + (list.length - shown) + '</button></div>';
      out.innerHTML = total ? html : '<div class="empty">No entries match these filters. Try clearing one of them.</div>';
      var mb = $('#more-btn'); if (mb) mb.addEventListener('click', function () { shown += 36; renderExplorer(); });
    }
    $('#f-count').textContent = total + (total === 1 ? ' entry' : ' entries') + ' shown';
  }
  function card(b, e, i) {
    var tags = '<span class="tag">' + esc(b.short) + '</span>' + (e.status === 'Ambiguous' ? '<span class="tag amb">Ambiguous</span>' : '') + (e.vernacular ? '<span class="tag vn">Indian-language form</span>' : '') +
      (e.paratext_only ? '<span class="tag">Paratext only</span>' : '') + (e.setting && e.setting !== 'India' ? '<span class="tag">' + esc(e.setting) + '</span>' : '');
    var more = e.more_quotes && e.more_quotes.length ? '<details class="more"><summary>' + e.more_quotes.length + ' more quotation' + (e.more_quotes.length > 1 ? 's' : '') + '</summary>' +
      e.more_quotes.map(function (m) { return '<blockquote>"' + ital(m.quote) + '"</blockquote><div class="loc">' + esc(m.section) + ', line ' + m.line + '</div>'; }).join('') + '</details>' : '';
    return '<article class="ecard" id="e-' + b.id + '-' + i + '"><div class="top"><span class="nm">' + esc(e.name) + '</span><span class="cat">' + e.category + '</span></div>' +
      '<div class="en">' + esc(e.english) + '</div><blockquote>"' + ital(e.quote) + '"</blockquote>' +
      '<div class="loc">' + esc(e.quote_section) + ', line ' + e.quote_line + '. ' + e.occurrences + ' occurrence' + (e.occurrences > 1 ? 's' : '') + ' in ' + e.sections.length + ' section' + (e.sections.length > 1 ? 's' : '') + '.</div>' +
      (e.remarks ? '<div class="rm">' + ital(e.remarks) + '</div>' : '') + '<div class="tags">' + tags + '</div>' + more + '</article>';
  }
  $('#ex-out').addEventListener('click', function (ev) {
    var c = ev.target.closest('.chip'); if (!c) return;
    var b = BOOKS.filter(function (x) { return x.id === c.getAttribute('data-b'); })[0], i = +c.getAttribute('data-i'), e = b.entities[i];
    fText.value = b.id; fCat.value = e.category; $('#f-q').value = e.name.split(' / ')[0];
    setView('cards'); shown = 36; readF(); renderExplorer();
    var cardEl = document.getElementById('e-' + b.id + '-' + i);
    if (cardEl) { cardEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); cardEl.classList.add('flash'); }
  });
  readF(); renderExplorer();

  /* =========================================================
     AUDIT
     ========================================================= */
  var VERD = [['C', 'Correct', '--c-correct'], ['P', 'Partly correct', '--c-partly'], ['F', 'Fabricated or unsupported', '--c-fab'], ['N', 'Not flora or fauna', '--c-not'], ['G', 'Generic', '--c-gen']];
  var VNAME = {}; VERD.forEach(function (v) { VNAME[v[0]] = v; });
  $('#audit-legend').innerHTML = VERD.map(function (v) { return '<span><i style="background:var(' + v[2] + ')"></i>' + v[1] + '</span>'; }).join('');
  var AUD_BOOKS = BOOKS.filter(function (b) { return b.audit_rows; });
  function drawAudit() {
    var box = $('#audit-chart'); box.innerHTML = '';
    var W = Math.max(320, box.clientWidth), small = W < 560, left = small ? 0 : 250, rowH = small ? 58 : 38, right = 40, H = AUD_BOOKS.length * rowH + 6;
    var tw = W - left - right, maxRows = 19;
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Verdicts on AnythingLLM rows, by text' });
    AUD_BOOKS.forEach(function (b, i) {
      var y = i * rowH, x = left, by = small ? y + 22 : y + 9, bh = small ? 22 : rowH - 18;
      var t = svg('text', { x: small ? 0 : left - 10, y: small ? y + 15 : y + rowH / 2 + 4.5, 'text-anchor': small ? 'start' : 'end', 'class': 'lbl' });
      t.textContent = b.short + (b.entities.length ? '' : ' (no source)'); s.appendChild(t);
      VERD.forEach(function (v) {
        var n = b.audit_counts[v[0]] || 0; if (!n) return;
        var w = n / maxRows * tw;
        var g = svg('g', { 'class': 'mark', tabindex: '0' });
        g.appendChild(svg('rect', { x: x + 1, y: by, width: Math.max(1, w - 2), height: bh, rx: 3, fill: 'var(' + v[2] + ')' }));
        if (w > 18) { var tt = svg('text', { x: x + w / 2, y: by + bh / 2 + 4.5, 'text-anchor': 'middle', 'class': 'val' }); tt.textContent = n; tt.setAttribute('style', 'fill:#fff;font-weight:600'); g.appendChild(tt); }
        tipFromEl(g, '<b>' + esc(b.short) + '</b>' + v[1] + ': ' + n + ' of ' + b.audit_rows + ' rows');
        g.addEventListener('click', function () { $('#a-text').value = b.id; $('#a-verdict').value = v[0]; renderAuditTable(); $('.audit-table-box').open = true; $('.audit-table-box').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
        s.appendChild(g); x += w;
      });
      var tot = svg('text', { x: x + 6, y: by + bh / 2 + 4.5, 'class': 'val' }); tot.textContent = b.audit_rows; s.appendChild(tot);
    });
    box.appendChild(s);
  }
  var aText = $('#a-text'), aVerd = $('#a-verdict');
  AUD_BOOKS.forEach(function (b) { aText.appendChild(el('option', { value: b.id }, esc(b.short))); });
  VERD.forEach(function (v) { aVerd.appendChild(el('option', { value: v[0] }, v[1])); });
  aText.addEventListener('change', renderAuditTable); aVerd.addEventListener('change', renderAuditTable);
  function renderAuditTable() {
    var rows = D.audit.filter(function (r) { return (!aText.value || r.book_id === aText.value) && (!aVerd.value || r.verdict === aVerd.value); });
    var bshort = {}; BOOKS.forEach(function (b) { bshort[b.id] = b.short; });
    $('#audit-table tbody').innerHTML = rows.map(function (r) {
      var v = VNAME[r.verdict];
      return '<tr><td>' + esc(bshort[r.book_id]) + '</td><td>' + esc(r.name.replace(/[“”]/g, '')) + '</td><td>' + esc(r.category) + '</td><td>' + (r.quote ? esc(r.quote) : '<span style="font-style:normal;color:var(--muted)">None given</span>') + '</td>' +
        '<td><span class="vd"><i style="background:var(' + v[2] + ')"></i>' + v[1] + '</span></td><td>' + esc(r.note) + '</td></tr>';
    }).join('') || '<tr><td colspan="6">No rows match.</td></tr>';
  }
  renderAuditTable();

  /* =========================================================
     CITATIONS
     ========================================================= */
  var CITE = {
    gitanjali: { a: ['Tagore', 'Rabindranath'], t: 'Gitanjali (Song Offerings)', tAPA: 'Gitanjali (song offerings)', o: '1912', y: '2004', pg: 7164, x: 'With an introduction by W. B. Yeats' },
    ancient_ballads: { a: ['Dutt', 'Toru'], t: 'Ancient Ballads and Legends of Hindustan', tAPA: 'Ancient ballads and legends of Hindustan', o: '1882', y: '2007', pg: 23245, x: 'With an introductory memoir by Edmund Gosse' },
    jungle_book: { a: ['Kipling', 'Rudyard'], t: 'The Jungle Book', tAPA: 'The jungle book', o: '1894', y: '2006', pg: 236 },
    golden_threshold: { a: ['Naidu', 'Sarojini'], t: 'The Golden Threshold', tAPA: 'The golden threshold', o: '1905', y: '1996', pg: 680, x: 'With an introduction by Arthur Symons' },
    glimpses_of_bengal: { a: ['Tagore', 'Rabindranath'], t: 'Glimpses of Bengal: Selected from the Letters of Sir Rabindranath Tagore, 1885 to 1895', tAPA: 'Glimpses of Bengal: Selected from the letters of Sir Rabindranath Tagore, 1885 to 1895', o: '1921', y: '2005', pg: 7951 },
    bird_of_time: { kind: 'web', a: ['Naidu', 'Sarojini'], t: 'The Bird of Time: Songs of Life, Death &amp; the Spring', tAPA: 'The bird of time: Songs of life, death &amp; the spring', o: '1912', x: 'With an introduction by Edmund Gosse',
      site: 'Literature of Colonial South Asia: A Digital Archive', siteAPA: 'Literature of colonial South Asia: A digital archive', ed: ['Singh', 'Amardeep'], host: 'Lehigh University',
      url: 'https://scalar.lehigh.edu/literature-of-colonial-south-asia/sarojini-naidu-the-bird-of-time-songs-of-life-death--the-spring-1912-full-text' },
    adivasi: { kind: 'print', a: ['Shekhar', 'Hansda Sowvendra'], t: 'The Adivasi Will Not Dance: Stories', tAPA: 'The Adivasi will not dance: Stories', o: '2015', place: 'New Delhi', pub: 'Speaking Tiger' },
    sakoontala: { a: ['Kālidāsa', ''], t: 'Sakoontala; or, The Lost Ring: An Indian Drama', tAPA: 'Sakoontala; or, The lost ring: An Indian drama', o: '1855', y: '2004', pg: 12169, tr: 'Monier Monier-Williams', trAPA: 'M. Monier-Williams' }
  };
  var today = new Date();
  var MON = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var MONF = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var dMLA = today.getDate() + ' ' + MON[today.getMonth()] + ' ' + today.getFullYear(), dFull = today.getDate() + ' ' + MONF[today.getMonth()] + ' ' + today.getFullYear();
  function nameInv(a) { return a[1] ? a[0] + ', ' + a[1] : a[0]; }
  function nameAPA(a) { return a[1] ? a[0] + ', ' + a[1].split(' ').map(function (w) { return w.charAt(0) + '.'; }).join(' ') : a[0]; }
  function nameFwd(a) { return a[1] ? a[1] + ' ' + a[0] : a[0]; }
  function initFwd(a) { return a[1] ? a[1].split(' ').map(function (w) { return w.charAt(0) + '.'; }).join(' ') + ' ' + a[0] : a[0]; }
  var WEB_STYLES = {
    'Chicago': function (c) { return nameInv(c.a) + '. <i>' + c.t + '</i>. ' + c.x + '. First published ' + c.o + '. In <i>' + c.site + '</i>, edited by ' + nameFwd(c.ed) + '. ' + c.host + '. ' + c.url + '.'; },
    'MLA': function (c) { return nameInv(c.a) + '. <i>' + c.t + '</i>. ' + c.o + '. <i>' + c.site + '</i>, edited by ' + nameFwd(c.ed) + ', Lehigh U, ' + c.url.replace(/^https?:\/\//, '') + '. Accessed ' + dMLA + '.'; },
    'APA': function (c) { return nameAPA(c.a) + ' (n.d.). <i>' + c.tAPA + '</i>. In ' + initFwd(c.ed) + ' (Ed.), <i>' + c.siteAPA + '</i>. ' + c.host + '. ' + c.url + ' (Original work published ' + c.o + ')'; },
    'Harvard': function (c) { return nameAPA(c.a) + ' (' + c.o + ') <i>' + c.t + '</i>. In: ' + nameAPA(c.ed) + ' (ed.) <i>' + c.site + '</i>. ' + c.host + '. Available at: ' + c.url + ' (Accessed: ' + dFull + ').'; }
  };
  var PRINT_STYLES = {
    'Chicago': function (c) { return nameInv(c.a) + '. <i>' + c.t + '</i>. ' + c.place + ': ' + c.pub + ', ' + c.o + '.'; },
    'MLA': function (c) { return nameInv(c.a) + '. <i>' + c.t + '</i>. ' + c.pub + ', ' + c.o + '.'; },
    'APA': function (c) { return nameAPA(c.a) + ' (' + c.o + '). <i>' + c.tAPA + '</i>. ' + c.pub + '.'; },
    'Harvard': function (c) { return nameAPA(c.a) + ' (' + c.o + ') <i>' + c.t + '</i>. ' + c.place + ': ' + c.pub + '.'; }
  };
  function citeText(style, c) { return (c.kind === 'web' ? WEB_STYLES : c.kind === 'print' ? PRINT_STYLES : TEXT_STYLES)[style](c); }
  var TEXT_STYLES = {
    'Chicago': function (c) { var u = 'https://www.gutenberg.org/ebooks/' + c.pg; return nameInv(c.a) + '. <i>' + c.t + '</i>. ' + (c.tr ? 'Translated by ' + c.tr + '. ' : '') + (c.x ? c.x + '. ' : '') + (c.tr ? 'Translation first published ' : 'First published ') + c.o + '. Project Gutenberg, ' + c.y + '. ' + u + '.'; },
    'MLA': function (c) { return nameInv(c.a) + '. <i>' + c.t + '</i>. ' + (c.tr ? 'Translated by ' + c.tr + ', ' : '') + c.o + '. <i>Project Gutenberg</i>, ' + c.y + ', www.gutenberg.org/ebooks/' + c.pg + '. Accessed ' + dMLA + '.'; },
    'APA': function (c) { return nameAPA(c.a) + ' (' + c.y + '). <i>' + c.tAPA + '</i>' + (c.tr ? ' (' + c.trAPA + ', Trans.)' : '') + '. Project Gutenberg. https://www.gutenberg.org/ebooks/' + c.pg + ' (Original work published ' + c.o + ')'; },
    'Harvard': function (c) { return nameAPA(c.a) + ' (' + c.y + ') <i>' + c.t + '</i>. ' + (c.tr ? 'Translated by ' + c.tr + '. ' : '') + 'Project Gutenberg. Available at: https://www.gutenberg.org/ebooks/' + c.pg + ' (Accessed: ' + dFull + ').'; }
  };
  var PT = 'Extraction of Indian Cultural Elements Using RAG: Flora and Fauna in Indian Literary Texts';
  var INST = 'Indian Institute of Technology (Indian School of Mines) Dhanbad';
  var PROJ_STYLES = {
    'APA': function () { return 'Nandi, S. (2026). <i>Extraction of Indian cultural elements using RAG: Flora and fauna in Indian literary texts</i> [Project website]. Department of Humanities and Social Sciences, ' + INST + '. ' + PAGE_URL; },
    'MLA': function () { return 'Nandi, Simanta. <i>' + PT + '</i>. ' + INST + ', 2026, ' + PAGE_URL.replace(/^https?:\/\//, '') + '. Accessed ' + dMLA + '.'; },
    'Chicago': function () { return 'Nandi, Simanta. 2026. "' + PT + '." Project website, MA in Digital Humanities and Social Sciences, ' + INST + '. ' + PAGE_URL + '.'; },
    'Harvard': function () { return 'Nandi, S. (2026) <i>' + PT + '</i>. Dhanbad: ' + INST + '. Available at: ' + PAGE_URL + ' (Accessed: ' + dFull + ').'; },
    'IEEE': function () { return 'S. Nandi, "' + PT + '," project website, ' + INST + ', 2026. [Online]. Available: ' + PAGE_URL; },
    'BibTeX': function () { return '@misc{nandi2026rag,\n  author       = {Nandi, Simanta},\n  title        = {' + PT + '},\n  year         = {2026},\n  howpublished = {Project website},\n  institution  = {' + INST + '},\n  note         = {MA in Digital Humanities and Social Sciences. CC BY-NC 4.0},\n  url          = {' + PAGE_URL + '}\n}'; }
  };
  function tabs(box, names, onPick) {
    box.innerHTML = '';
    names.forEach(function (n, i) {
      var b = el('button', { type: 'button', role: 'tab', 'aria-selected': i === 0 ? 'true' : 'false' }, n);
      b.addEventListener('click', function () { $$('button', box).forEach(function (x) { x.setAttribute('aria-selected', 'false'); }); b.setAttribute('aria-selected', 'true'); onPick(n); });
      box.appendChild(b);
    });
  }
  var cpStyle = 'APA';
  function renderCp() { var h = PROJ_STYLES[cpStyle](); $('#cp-out').innerHTML = cpStyle === 'BibTeX' ? esc(h) : h; }
  tabs($('#cp-styles'), Object.keys(PROJ_STYLES), function (n) { cpStyle = n; renderCp(); }); renderCp();
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.getElementById(b.getAttribute('data-target')).textContent;
      function ok() { b.textContent = 'Copied'; b.classList.add('done'); setTimeout(function () { b.textContent = 'Copy'; b.classList.remove('done'); }, 1600); }
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, fallback); else fallback();
      function fallback() { var ta = el('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) {} ta.remove(); }
    });
  });
  // Works cited: the eight texts in Chicago style
  var refs = CHECKED.map(function (b) { return citeText('Chicago', CITE[b.id]); });
  refs.sort(function (a, b) { return a.replace(/<[^>]+>/g, '').localeCompare(b.replace(/<[^>]+>/g, '')); });
  $('#refs').innerHTML = refs.map(function (r) { return '<li>' + r + '</li>'; }).join('');

  /* ---------- back to the top ---------- */
  var toTop = $('#to-top');
  function onScroll() { toTop.classList.toggle('show', window.scrollY > window.innerHeight * 0.8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    var brand = $('.brand'); if (brand) brand.focus({ preventScroll: true });
  });

  /* ---------- draw + redraw ---------- */
  function redrawCharts() { drawCats(); drawHeat(); drawVern(); drawAudit(); }
  redrawCharts();
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(redrawCharts, 150); });
})();
