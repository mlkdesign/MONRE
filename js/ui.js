/* MONRE — shared UI: components, toasts, modals, popovers, header & footer. */
(function () {
  var M = window.MONRE, D = window.MONRE_DATA;
  var UI = {};
  var ACT = {};           // delegated click actions: data-act="name"
  UI.ACT = ACT;
  UI.PAGES = {};          // route renderers
  UI.FORMS = {};          // delegated form submits: data-form="name"
  UI.onChange = [];       // delegated change listeners
  UI.mount = [];          // called after each page render
  UI.cleanup = [];        // called before the next page render

  /* ---------- tiny helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ic(name, cls) { return '<span class="ic ic-' + name + (cls ? ' ' + cls : '') + '" aria-hidden="true"></span>'; }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function go(path) { if (location.hash === '#' + path) UI.rerender(); else location.hash = path; }
  UI.esc = esc; UI.ic = ic; UI.$ = $; UI.$$ = $$; UI.go = go;
  UI.money = M.money;

  /* ---------- components ---------- */
  UI.badge = function (p) {
    if (p.stock === 0) return '<span class="badge is-soldout">Sold out</span>';
    if (!p.badge) return '';
    if (p.badge === 'New') return '<span class="badge is-new">New</span>';
    if (p.badge.charAt(0) === '-') return '<span class="badge is-sale">' + esc(p.badge) + '</span>';
    return '<span class="badge">' + esc(p.badge) + '</span>';
  };

  UI.favBtn = function (id, extra) {
    var on = M.isFav(id);
    return '<button class="fav-btn' + (on ? ' is-on' : '') + (extra ? ' ' + extra : '') + '" data-act="fav" data-id="' + id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove from favorites' : 'Add to favorites') + '">' + ic(on ? 'heart-fill' : 'heart') + '</button>';
  };

  // opts: { home: bool (short name + card meta), add: bool (Add to cart button) }
  UI.productCard = function (p, opts) {
    opts = opts || {};
    var name = opts.home ? p.short : p.name;
    var meta = opts.home ? (p.cardMeta || p.type + ', ' + p.meta) : p.meta;
    var out = p.stock === 0;
    return '<article class="pcard' + (out ? ' is-soldout' : '') + '">' +
      '<a class="pcard-media" href="#/p/' + p.id + '" aria-label="' + esc(p.name) + '">' +
        '<img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy">' + (out ? '<span class="pcard-dim"></span>' : '') +
        '<span class="pcard-badge">' + UI.badge(p) + '</span>' +
      '</a>' +
      '<span class="pcard-fav">' + UI.favBtn(p.id) + '</span>' +
      '<div class="pcard-info">' +
        '<div class="pcard-row"><a class="pcard-name" href="#/p/' + p.id + '">' + esc(name) + '</a><span class="pcard-price">' + M.money(p.price) + '</span></div>' +
        '<div class="pcard-row"><span class="pcard-meta">' + esc(meta) + '</span>' + (p.oldPrice ? '<span class="pcard-meta t-strike">' + M.money(p.oldPrice) + '</span>' : '') + '</div>' +
      '</div>' +
      (opts.add ? (out ? '<button class="btn btn-outline btn-m btn-block btn-13 pcard-add" data-act="notify" data-id="' + p.id + '">Notify me</button>'
                       : '<button class="btn btn-primary btn-m btn-block btn-13 pcard-add" data-act="add" data-id="' + p.id + '">Add to cart</button>') : '') +
    '</article>';
  };

  UI.skeletonCard = function () { return '<div class="skel"><div class="skel-media"></div><div class="skel-line" style="width:180px"></div><div class="skel-line" style="width:80px"></div></div>'; };

  // field({ name, label, type, placeholder, value, error, hint, variant, auto, attrs, labelM })
  UI.field = function (f) {
    var type = f.type || 'text';
    var isPw = type === 'password';
    var variant = f.variant ? ' ' + f.variant : '';
    var ctrl = '<div class="field-control' + variant + '">' +
      (f.icon ? ic(f.icon) : '') +
      '<input name="' + f.name + '" type="' + type + '"' + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') +
      ' value="' + esc(f.value || '') + '"' + (f.auto ? ' autocomplete="' + f.auto + '"' : '') + (f.attrs || '') + '>' +
      (isPw ? '<button type="button" class="eye" data-act="toggle-pw" aria-label="Show password">' + ic('eye') + '</button>' : '') +
      '</div>';
    return '<label class="field' + (f.error ? ' is-error' : '') + (f.disabled ? ' is-disabled' : '') + '" data-field="' + f.name + '">' +
      (f.label ? '<span class="field-label' + (f.labelM ? ' is-m' : '') + '">' + esc(f.label) + '</span>' : '') + ctrl +
      (f.error ? '<span class="field-error">' + esc(f.error) + '</span>' : (f.hint ? '<span class="field-hint">' + esc(f.hint) + '</span>' : '')) +
      '</label>';
  };
  UI.textarea = function (f) {
    var v = f.value || '';
    return '<label class="field' + (f.error ? ' is-error' : '') + '" data-field="' + f.name + '">' +
      (f.label ? '<span class="field-label">' + esc(f.label) + '</span>' : '') +
      '<div class="textarea-control"' + (f.height ? ' style="height:' + f.height + 'px"' : '') + '><textarea name="' + f.name + '" maxlength="500" placeholder="' + esc(f.placeholder || '') + '" data-counter>' + esc(v) + '</textarea>' +
      '<span class="textarea-count">' + v.length + ' / 500</span></div>' +
      (f.error ? '<span class="field-error">' + esc(f.error) + '</span>' : '') + '</label>';
  };
  UI.checkbox = function (name, label, checked, cls) {
    return '<label class="check' + (cls ? ' ' + cls : '') + '"><input type="checkbox" name="' + name + '"' + (checked ? ' checked' : '') + '><span class="check-box">' + ic('check') + '</span><span>' + label + '</span></label>';
  };
  UI.stars = function (n, size) {
    var s = '';
    for (var i = 1; i <= 5; i++) s += ic(i <= n ? 'star' : 'star-line');
    return '<span class="stars' + (size === 24 ? ' is-24' : '') + '" aria-label="' + n + ' of 5">' + s + '</span>';
  };
  UI.stepper = function (qty, act, key, cls) {
    return '<div class="stepper' + (cls ? ' ' + cls : '') + '">' +
      '<button type="button" data-act="' + act + '" data-key="' + key + '" data-d="-1" aria-label="Decrease"' + (qty <= 1 ? ' disabled' : '') + '>' + ic('minus') + '</button>' +
      '<span class="qty">' + qty + '</span>' +
      '<button type="button" data-act="' + act + '" data-key="' + key + '" data-d="1" aria-label="Increase"' + (qty >= 99 ? ' disabled' : '') + '>' + ic('plus') + '</button></div>';
  };
  UI.avatar = function (name, cls) { return '<span class="' + (cls || 'avatar') + '">' + esc(String(name || 'M').charAt(0)) + '</span>'; };

  /* ---------- order tracking pieces ---------- */
  UI.tracker = function (o, detailed) {
    var idx = M.stageIndex(o), h = '<div class="tracker">';
    M.STAGES.forEach(function (s, i) {
      if (i) h += '<span class="line' + (i <= idx ? ' is-done' : '') + '"></span>';
      var cls = i < idx || idx === 3 ? 'is-done' : i === idx ? 'is-current' : '';
      h += '<span class="node ' + cls + '">' + (cls === 'is-done' ? ic('check') : (i + 1)) + '</span>';
    });
    h += '</div><div class="tracker-labels' + (detailed ? ' is-detailed' : '') + '">';
    M.STAGES.forEach(function (s, i) {
      var cur = i === idx && idx < 3;
      if (detailed) {
        var st = i < idx || idx === 3 ? 'Completed · ' + UI.time(M.stageTime(o, i)) : i === idx ? 'Current' : 'Pending';
        h += '<div><b>' + (i + 1) + '. ' + s.long + '</b><span' + (cur ? ' class="is-current"' : '') + '>' + st + '</span></div>';
      } else h += '<div' + (cur ? ' class="is-current"' : '') + '>' + s.label + '</div>';
    });
    return h + '</div>';
  };
  UI.time = function (d) { return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); };
  UI.date = function (ts) { return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
  UI.etaText = function (o) {
    var ms = M.etaMs(o);
    if (!ms) return 'Delivered at ' + UI.time(M.deliveryTime(o));
    return 'Arrives in <b data-eta="' + o.id + '">0:' + String(Math.ceil(ms / 1000)).padStart(2, '0') + '</b>';
  };
  UI.statusPill = function (o) {
    var st = M.stage(o);
    return '<span class="status-pill' + (st.id !== 'delivered' ? ' is-active' : '') + '" data-status="' + o.id + '">' + st.label + '</span>';
  };

  /* ---------- toasts ---------- */
  var TICONS = { success: 'check-circle', info: 'info', error: 'warning-circle', warning: 'warning' };
  UI.toast = function (t) {
    var box = $('#toasts');
    var el = document.createElement('div');
    var duration = Math.max(1000, Number(t.timeout) || 5000);
    el.className = 'toast is-' + (t.type || 'success');
    el.setAttribute('role', t.type === 'error' ? 'alert' : 'status');
    el.style.setProperty('--toast-duration', duration + 'ms');
    el.innerHTML = '<span class="toast-icon">' + ic(TICONS[t.type || 'success']) + '</span>' +
      '<div class="toast-text"><span class="toast-title">' + esc(t.title) + '</span>' + (t.sub ? '<span class="toast-sub">' + esc(t.sub) + '</span>' : '') + '</div>' +
      (t.action ? '<button class="toast-action"' + (t.actionTone === 'brown' ? ' style="background:var(--primary)"' : '') + '>' + esc(t.action) + '</button>' : '') +
      '<button class="toast-close" aria-label="Close notification">' + ic('x') + '</button>' +
      '<span class="toast-timer" aria-hidden="true"></span>';
    UI.placeToasts();
    box.prepend(el);
    while (box.children.length > 3) box.lastChild.remove();
    var timer = null, remaining = duration, startedAt = 0, over = false, focused = false;
    function schedule() {
      startedAt = Date.now();
      timer = setTimeout(close, remaining);
      el.classList.remove('is-paused');
    }
    function pause() {
      if (timer === null) return;
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
      clearTimeout(timer); timer = null;
      el.classList.add('is-paused');
    }
    function resume() { if (!over && !focused && timer === null && remaining > 0) schedule(); }
    function close() { if (timer !== null) clearTimeout(timer); timer = null; el.remove(); }
    el.querySelector('.toast-close').onclick = close;
    if (t.action) el.querySelector('.toast-action').onclick = function () { close(); t.onAction && t.onAction(); };
    el.addEventListener('mouseenter', function () { over = true; pause(); });
    el.addEventListener('mouseleave', function () { over = false; resume(); });
    el.addEventListener('focusin', function () { focused = true; pause(); });
    el.addEventListener('focusout', function () { focused = false; resume(); });
    schedule();
    return close;
  };
  UI.placeToasts = function () {
    var hb = $('#header').getBoundingClientRect().bottom;
    $('#toasts').style.top = Math.max(16, hb + 16) + 'px';
  };
  UI.notice = function (type, title, sub) {
    return '<div class="notice is-' + type + '" role="' + (type === 'error' ? 'alert' : 'status') + '"><span class="toast-icon">' + ic(TICONS[type]) + '</span><div class="toast-text"><span class="toast-title">' + esc(title) + '</span>' + (sub ? '<span class="toast-sub">' + esc(sub) + '</span>' : '') + '</div></div>';
  };

  /* ---------- modal ---------- */
  var modal = null;
  UI.openModal = function (html, opts) {
    opts = opts || {};
    UI.closeOverlays();
    UI.closeModal(true);
    var root = document.createElement('div');
    root.className = 'modal-root' + (opts.top ? ' is-top' : '');
    root.innerHTML = '<div class="modal ' + (opts.cls || '') + '" role="dialog" aria-modal="true">' + html + '</div>';
    root.addEventListener('mousedown', function (e) { if (e.target === root) UI.closeModal(); });
    document.body.appendChild(root);
    document.body.classList.add('is-locked');
    modal = { root: root, onClose: opts.onClose };
    var f = root.querySelector('[autofocus]') || root.querySelector('input, textarea');
    if (f && !opts.noFocus) setTimeout(function () { f.focus(); }, 0);
    opts.onMount && opts.onMount(root.firstChild);
    return root.firstChild;
  };
  UI.modalEl = function () { return modal ? modal.root.firstChild : null; };
  UI.closeModal = function (silent) {
    if (!modal) return;
    var m = modal; modal = null;
    m.root.remove();
    if (!document.querySelector('.drawer-root')) document.body.classList.remove('is-locked');
    if (!silent && m.onClose) m.onClose();
  };
  UI.modalHead = function (title, large, closeLeft) {
    var x = '<button class="close-btn" data-act="close-modal" aria-label="Close">' + ic('x') + '</button>';
    if (closeLeft) return '<div class="col gap-8"><div class="row">' + x + '</div><h2 class="modal-title is-l">' + esc(title) + '</h2></div>';
    return '<div class="modal-head"><h2 class="modal-title' + (large ? ' is-l' : '') + '">' + esc(title) + '</h2>' + x + '</div>';
  };
  UI.successModal = function (title, text, btn, onBtn, large) {
    UI.openModal('<span class="ic ic-check-circle-lg"></span><h2 class="modal-title' + (large ? ' is-l' : '') + '">' + esc(title) + '</h2>' +
      '<p class="t-body-m t-2">' + esc(text) + '</p><button class="btn btn-primary btn-block" data-act="modal-ok">' + esc(btn) + '</button>', { cls: 'is-success', noFocus: true });
    ACT['modal-ok'] = function () { UI.closeModal(true); onBtn && onBtn(); };
  };

  /* ---------- popovers (dropdowns) ---------- */
  var pop = null;
  UI.openPopover = function (anchor, html, opts) {
    opts = opts || {};
    var same = pop && pop.anchor === anchor;
    UI.closePopover();
    if (same) return null;
    var host = anchor.parentElement;
    var el = document.createElement('div');
    el.className = 'popover ' + (opts.cls || '');
    el.innerHTML = html;
    if (opts.align === 'right') el.style.right = '0';
    if (opts.align === 'left') el.style.left = '0';
    if (opts.width) el.style.width = opts.width + 'px';
    host.appendChild(el);
    anchor.classList.add('is-open');
    anchor.setAttribute('aria-expanded', 'true');
    pop = { el: el, anchor: anchor };
    return el;
  };
  UI.closePopover = function () {
    if (!pop) return;
    pop.el.remove(); pop.anchor.classList.remove('is-open'); pop.anchor.setAttribute('aria-expanded', 'false'); pop = null;
  };
  document.addEventListener('mousedown', function (e) {
    if (pop && !pop.el.contains(e.target) && !pop.anchor.contains(e.target)) UI.closePopover();
  });

  /* ---------- header ---------- */
  UI.renderHeader = function () {
    var u = M.user(), n = M.cartCount(), c = M.currency(), l = M.lang();
    $('#header').innerHTML =
      '<div class="header-inner">' +
        '<div class="header-left">' +
          '<button class="hbtn hbtn-dark" data-act="mega" aria-haspopup="true" aria-expanded="false">' + ic('funnel') + 'Catalogue</button>' +
          '<button class="hbtn hbtn-search" data-act="search">' + ic('search') + 'Search</button>' +
        '</div>' +
        '<a class="header-logo t-logo" href="#/" aria-label="MONRE home">MONRE</a>' +
        '<div class="header-right">' +
          '<div style="position:relative"><button class="hbtn" data-act="lang" aria-haspopup="listbox"><span class="flag-uk"></span>' + l.short + ic('caret-down') + '</button></div>' +
          '<div style="position:relative"><button class="hbtn" data-act="currency" aria-haspopup="listbox">' + c.label + ic('caret-down') + '</button></div>' +
          '<button class="hbtn hbtn-dark hbtn-cart" data-act="minicart" aria-label="Cart, ' + n + ' items">' + ic('cart') + 'Cart' + (n ? '<span class="cart-badge">' + (n > 99 ? '99+' : n) + '</span>' : '') + '</button>' +
          '<div style="position:relative"><button class="hbtn hbtn-user" data-act="user" aria-haspopup="' + (u ? 'menu' : 'false') + '">' + ic('user') + (u ? esc(u.name) : 'Sign In') + '</button></div>' +
        '</div>' +
      '</div><div id="header-overlay"></div>';
  };

  UI.closeOverlays = function () {
    var o = $('#header-overlay'); if (o) o.innerHTML = '';
    $$('.mega-scrim').forEach(function (e) { e.remove(); });
    $$('.header .hbtn.is-open').forEach(function (b) { b.classList.remove('is-open'); });
    UI.closePopover();
    var d = $('.drawer-root'); if (d) { d.remove(); if (!modal) document.body.classList.remove('is-locked'); }
  };

  function scrim() {
    var s = document.createElement('div');
    s.className = 'mega-scrim';
    s.style.top = $('#header').getBoundingClientRect().bottom + 'px';
    s.onclick = UI.closeOverlays;
    document.body.appendChild(s);
  }

  ACT.mega = function (btn) {
    var open = btn.classList.contains('is-open');
    UI.closeOverlays();
    if (open) return;
    btn.classList.add('is-open');
    var cols = D.megaMenu.map(function (c) {
      return '<div class="mega-col"><a class="mega-col-title' + (c.accent ? ' is-accent' : '') + '" href="#/c/' + c.cat + '">' + esc(c.title) + '</a><div class="mega-links">' +
        c.links.map(function (l) { return '<a href="#/c/' + l[1] + '">' + esc(l[0]) + '</a>'; }).join('') + '</div></div>';
    }).join('');
    $('#header-overlay').innerHTML = '<div class="mega"><div class="mega-inner">' + cols +
      '<a class="mega-promo" href="#/gifts"><img src="' + D.IMG.giftbox + '" alt=""><span>Gift Sets</span><span>from ' + M.money(59) + ' · gift wrap included</span></a></div></div>';
    scrim();
  };

  /* search overlay */
  var POPULAR = ['Sandalwood & Vanilla', 'Diffusers', 'Gift sets', 'Luna lamp', 'White Tea'];
  ACT.search = function () {
    UI.closeOverlays();
    var recent = (M.S.recent.length ? M.S.recent : ['sandalwood-vanilla', 'fig-cedar', 'white-tea', 'luna', 'amber-musk']).map(M.product).filter(Boolean).slice(0, 5);
    $('#header-overlay').innerHTML =
      '<div class="search-panel" role="dialog" aria-label="Search">' +
        '<form class="search-row" data-form="search">' +
          '<div class="field-control grow">' + ic('search') + '<input name="q" placeholder="Search candles, diffusers, gifts…" autocomplete="off" aria-label="Search"></div>' +
          '<button type="button" class="icon-btn" style="background:var(--surface);border-color:var(--border-control)" data-act="close-overlays" aria-label="Close search">' + ic('x') + '</button>' +
        '</form>' +
        '<div id="search-live">' + searchIdle(recent) + '</div>' +
      '</div>';
    scrim();
    var inp = $('.search-panel input');
    inp.focus();
    inp.addEventListener('input', function () { $('#search-live').innerHTML = inp.value.trim() ? searchLive(inp.value.trim()) : searchIdle(recent); });
  };
  function searchIdle(recent) {
    return '<div class="search-section"><span class="search-label">Popular searches</span><div class="search-list">' +
      POPULAR.map(function (q) { return '<button class="search-item" data-act="search-go" data-q="' + esc(q) + '">' + ic('search') + esc(q) + '</button>'; }).join('') + '</div></div>' +
      '<div class="search-section"><span class="search-label">Categories</span><div class="chips-wrap">' +
      [['Candles', 'candles'], ['Diffusers', 'diffusers'], ['Room Sprays', 'room-sprays'], ['Lighting', 'lighting'], ['Gift Sets', '']].map(function (c) {
        return '<a class="chip is-tag" href="' + (c[1] ? '#/c/' + c[1] : '#/gifts') + '">' + c[0] + '</a>'; }).join('') + '</div></div>' +
      '<div class="search-section"><span class="search-label">Recently viewed products</span><div class="search-grid">' +
      recent.map(function (p) { return UI.productCard(p, { home: true }); }).join('') + '</div></div>';
  }
  UI.searchProducts = function (q) {
    q = q.toLowerCase();
    var words = q.split(/\s+/).filter(Boolean);
    return D.products.filter(function (p) {
      var hay = (p.name + ' ' + p.type + ' ' + p.notes + ' ' + p.cat + ' ' + (p.scent || '')).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w.replace(/s$/, '')) >= 0; });
    });
  };
  function hl(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  function searchLive(q) {
    var res = UI.searchProducts(q);
    var cats = D.categories.filter(function (c) { return c.name.toLowerCase().indexOf(q.toLowerCase()) >= 0 || c.short.toLowerCase().indexOf(q.toLowerCase()) >= 0; });
    var gift = 'gift sets'.indexOf(q.toLowerCase()) >= 0 || q.toLowerCase().indexOf('gift') >= 0;
    if (!res.length && !cats.length && !gift) {
      return '<div class="search-section"><div class="empty" style="padding:32px 0"><span class="empty-icon">' + ic('search') + '</span><p class="t-category">No results for “' + esc(q) + '”</p><p class="t-body-s t-muted">Try broader terms or browse popular searches.</p></div></div>';
    }
    var h = '';
    if (cats.length || gift) {
      h += '<div class="search-section"><span class="search-label">Categories</span><div class="chips-wrap">' +
        cats.map(function (c) { return '<a class="chip is-tag" href="#/c/' + c.id + '">' + hl(c.short, q) + '</a>'; }).join('') +
        (gift ? '<a class="chip is-tag" href="#/gifts">Gift Sets</a>' : '') + '</div></div>';
    }
    if (res.length) {
      h += '<div class="search-section"><span class="search-label">Products · ' + res.length + '</span><div class="search-list">' +
        res.slice(0, 6).map(function (p) {
          return '<a class="search-result" href="#/p/' + p.id + '"><img src="' + p.img + '" alt=""><span class="grow"><span class="t-body-m">' + hl(p.name, q) + '</span><span class="t-caption t-muted">' + esc(p.type + ' · ' + p.meta) + '</span></span><span class="pcard-price">' + M.money(p.price) + '</span></a>';
        }).join('') + '</div>' +
        '<button class="btn btn-dark btn-44 btn-13" data-act="search-go" data-q="' + esc(q) + '" style="align-self:flex-start">Show all results' + ic('arrow-right') + '</button></div>';
    }
    return h;
  }
  ACT['search-go'] = function (el) { UI.closeOverlays(); go('/search?q=' + encodeURIComponent(el.dataset.q)); };
  ACT['close-overlays'] = function () { UI.closeOverlays(); };

  /* lang / currency */
  function langList() {
    return D.languages.map(function (l) { return '<button class="popover-item' + (l.code === M.S.lang ? ' is-active' : '') + '" data-act="set-lang" data-code="' + l.code + '" role="option">' + l.label + '</button>'; }).join('');
  }
  function curList() {
    return D.currencies.map(function (c) { return '<button class="popover-item' + (c.code === M.S.currency ? ' is-active' : '') + '" data-act="set-currency" data-code="' + c.code + '" role="option">' + c.label + '</button>'; }).join('');
  }
  ACT.lang = function (btn) { UI.closeOverlays(); UI.openPopover(btn, langList(), { cls: 'is-plain', width: 160, align: 'left' }); };
  ACT.currency = function (btn) { UI.closeOverlays(); UI.openPopover(btn, curList(), { cls: 'is-plain', width: 160, align: 'left' }); };
  ACT['footer-locale'] = function (btn) {
    UI.openPopover(btn, '<div class="popover-head t-caption t-muted">Language</div>' + langList() + '<div class="popover-sep"></div><div class="popover-head t-caption t-muted">Currency</div>' + curList(), { cls: 'is-plain', width: 180 });
  };
  ACT['set-lang'] = function (el) {
    var l = D.languages.filter(function (x) { return x.code === el.dataset.code; })[0];
    M.S.lang = l.code; M.save(); UI.closePopover(); UI.refreshChrome();
    if (l.code !== 'en') UI.toast({ type: 'info', title: 'Language: ' + l.label, sub: 'This prototype is shown in English only.' });
  };
  ACT['set-currency'] = function (el) {
    M.S.currency = el.dataset.code; M.save(); UI.closePopover(); UI.refreshChrome(); UI.rerender();
    UI.toast({ type: 'success', title: 'Prices in ' + M.currency().label, sub: 'All prices are converted at today’s rate.' });
  };

  /* user menu */
  ACT.user = function (btn) {
    var u = M.user();
    UI.closeOverlays();
    if (!u) { go('/auth/signin'); return; }
    var oc = M.userOrders().filter(M.isActive).length;
    UI.openPopover(btn,
      '<div class="popover-head"><span class="t-body-s-m">' + esc(u.name + ' ' + (u.lastName || '')) + '</span><span class="t-caption t-muted">' + esc(u.email) + '</span></div><div class="popover-sep"></div>' +
      '<a class="popover-item" href="#/account">My account</a>' +
      '<a class="popover-item" href="#/account/orders">Orders &amp; tracking' + (oc ? '<span class="count-badge" style="background:var(--primary)">' + oc + '</span>' : '') + '</a>' +
      '<a class="popover-item" href="#/account/profile">Profile</a>' +
      '<a class="popover-item" href="#/account/favorites">Favorites' + (M.S.favorites.length ? '<span class="t-caption t-muted">' + M.S.favorites.length + '</span>' : '') + '</a>' +
      '<a class="popover-item" href="#/account/certificates">Gift certificates</a>' +
      '<div class="popover-sep"></div><button class="popover-item" data-act="logout">Log out</button>',
      { cls: 'user-menu', align: 'right', width: 240 });
  };

  /* mini cart drawer */
  ACT.minicart = function () { UI.closeOverlays(); UI.openDrawer(); };
  UI.openDrawer = function () {
    var root = document.createElement('div');
    root.className = 'drawer-root';
    root.innerHTML = '<aside class="drawer" role="dialog" aria-label="Cart"></aside>';
    root.addEventListener('mousedown', function (e) { if (e.target === root) UI.closeOverlays(); });
    document.body.appendChild(root);
    document.body.classList.add('is-locked');
    UI.renderDrawer();
  };
  UI.renderDrawer = function () {
    var d = $('.drawer'); if (!d) return;
    var n = M.cartCount(), t = M.totals();
    var head = '<div class="drawer-head"><h2 class="t-section">Your cart (' + n + ')</h2><button class="close-btn" data-act="close-overlays" aria-label="Close cart">' + ic('x') + '</button></div>';
    if (!M.S.cart.length) {
      d.innerHTML = head + '<div class="empty grow"><span class="empty-icon">' + ic('cart') + '</span><p class="t-category">Your cart is empty</p><p class="t-body-s t-muted">Add a candle or a gift set — we’ll keep it here.</p><a class="btn btn-primary" href="#/c/candles" data-act="close-overlays">Explore the collection</a></div>';
      return;
    }
    d.innerHTML = head + '<div class="drawer-items">' + M.S.cart.map(function (l) {
      return '<div class="drawer-item"><img src="' + l.img + '" alt=""><div class="grow col gap-4"><span class="t-body-s-m">' + esc(l.short || l.name) + '</span><span class="t-caption t-muted">' + esc(l.meta) + ' · ' + l.qty + ' × ' + M.money(l.price) + '</span>' +
        (M.lineInStock(l) ? '' : '<span class="t-caption" style="color:var(--sale)">Out of stock</span>') +
        '<div class="row gap-12" style="margin-top:6px">' + UI.stepper(l.qty, 'drawer-qty', l.key, 'is-sm') + '<button class="remove-link" data-act="drawer-remove" data-key="' + esc(l.key) + '">Remove</button></div></div></div>';
    }).join('') + '</div>' +
      '<div class="drawer-foot"><div class="row-between"><span class="t-section">Total ' + M.money(t.subtotal - t.discount) + '</span>' + (t.discount ? '<span class="t-caption t-muted t-strike">' + M.money(t.subtotal) + '</span>' : '') + '</div>' +
      (t.freeLeft > 0 ? '<span class="t-caption t-muted">Add ' + M.money(t.freeLeft) + ' more for free shipping</span>' : '<span class="t-caption t-primary">Free shipping unlocked</span>') +
      '<div class="row gap-12"><a class="btn btn-secondary grow" href="#/cart">View cart</a><a class="btn btn-primary grow" href="#/checkout">Checkout</a></div></div>';
  };
  ACT['drawer-qty'] = function (el) {
    var l = M.S.cart.filter(function (x) { return x.key === el.dataset.key; })[0]; if (!l) return;
    M.setQty(l.key, l.qty + Number(el.dataset.d)); UI.renderDrawer(); UI.refreshChrome(); UI.rerenderIf('/cart');
  };
  ACT['drawer-remove'] = function (el) {
    var r = M.removeLine(el.dataset.key); UI.renderDrawer(); UI.refreshChrome(); UI.rerenderIf('/cart');
    UI.toast({ type: 'info', title: 'Item removed', sub: 'You can bring it back.', action: 'Undo', onAction: function () { M.restoreLine(r); UI.renderDrawer(); UI.refreshChrome(); UI.rerenderIf('/cart'); } });
  };

  /* ---------- footer ---------- */
  UI.renderFooter = function () {
    var shop = [['All Products', '#/catalog'], ['Candles', '#/c/candles'], ['Diffusers', '#/c/diffusers'], ['Room Sprays', '#/c/room-sprays'], ['Decor', '#/c/decor'], ['Lighting', '#/c/lighting'], ['Furniture', '#/c/furniture'], ['Storage', '#/c/storage'], ['Gift Sets', '#/gifts'], ['New Arrivals', '#/c/candles?sort=new'], ['Bestsellers', '#/c/candles?sort=best']];
    var about = [['Our Story', '#/info/story'], ['Craftsmanship', '#/info/story'], ['Ingredients', '#/info/care'], ['Sustainability', '#/info/story'], ['Journal', '#/journal']];
    var care = [['Shipping', '#/info/shipping'], ['Returns', '#/info/returns'], ['FAQs', '#/info/faq'], ['Care Instructions', '#/info/care'], ['Contact Us', '#/info/contact'], ['Gift Cards', '#/info/gift-cards']];
    function col(title, links, w) { return '<div class="footer-col" style="width:' + w + 'px"><h4>' + title + '</h4><ul>' + links.map(function (l) { return '<li><a href="' + l[1] + '">' + l[0] + '</a></li>'; }).join('') + '</ul></div>'; }
    $('#footer').innerHTML =
      '<div class="footer-main">' +
        '<div class="footer-brand"><a class="t-logo footer-logo" href="#/">MONRE</a><p class="footer-tagline">Thoughtfully curated scents<br>and décor to create<br>a calm, beautiful home.</p>' +
          '<div class="footer-benefits">' +
            [['leaf', 'Natural Ingredients', 'Clean, safe &amp; long-lasting'], ['hand-heart', 'Handcrafted', 'Made in small batches'], ['recycle', 'Sustainable Choices', 'For your home &amp; the planet']].map(function (b) {
              return '<div class="footer-benefit"><span class="footer-benefit-icon">' + ic(b[0]) + '</span><div><b>' + b[1] + '</b><span>' + b[2] + '</span></div></div>'; }).join('') +
          '</div>' +
          '<div class="footer-socials"><a class="footer-social" href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">' + ic('instagram') + '</a><a class="footer-social" href="https://pinterest.com" target="_blank" rel="noopener" aria-label="Pinterest">' + ic('pinterest') + '</a><a class="footer-social" href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok">' + ic('tiktok') + '</a></div>' +
        '</div>' +
        '<span style="width:48px;flex:none"></span>' + col('Shop', shop, 140) + '<span style="width:32px;flex:none"></span>' + col('About', about, 130) + '<span style="width:32px;flex:none"></span>' + col('Customer care', care, 150) +
        '<span class="footer-vline"></span>' +
        '<form class="footer-news" data-form="newsletter" novalidate><h4 class="t-overline t-gold" style="font-weight:400">Stay in the loop</h4><p>Be the first to discover new arrivals,<br>exclusive offers and home fragrance tips.</p>' +
          '<div class="footer-email"><input name="email" type="email" placeholder="Enter your email" autocomplete="email" aria-label="Email"><button type="submit" aria-label="Subscribe">' + ic('arrow-right') + '</button></div>' +
          '<label class="footer-check"><input type="checkbox" name="agree"><span class="fbox">' + ic('check') + '</span>I agree to receive emails and accept the Privacy Policy.</label>' +
        '</form>' +
        '<div class="footer-art" aria-hidden="true"><img src="' + D.IMG.footerPlant + '" alt=""></div>' +
      '</div>' +
      '<div class="footer-bottom-line"></div>' +
      '<div class="footer-bottom"><span class="copy">© MONRE, 2026. All rights reserved.</span>' +
        '<div class="footer-legal"><a href="#/info/privacy">Privacy Policy</a><a href="#/info/terms">Terms of Service</a><a href="#/accessibility">Accessibility</a><a href="#/index">Site map</a></div>' +
        '<div style="position:relative"><button class="footer-lang" data-act="footer-locale">' + ic('globe') + M.lang().code.toUpperCase() + ' / ' + M.currency().code + ic('caret-down') + '</button></div>' +
      '</div>';
  };

  /* ---------- cookie banner ---------- */
  UI.cookieBanner = function () {
    if (M.S.cookie || $('.cookie')) return;
    var el = document.createElement('div');
    el.className = 'cookie'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Cookie consent');
    el.innerHTML = '<div class="row-between"><span class="t-category" style="color:var(--on-dark)">We value your privacy</span><span class="t-overline t-gold">Cookies</span></div>' +
      '<p>We use essential cookies to keep your cart and preferences. With your consent we’d also use analytics cookies to improve MONRE. <a class="link-u" href="#/info/privacy" style="color:var(--on-dark)">Privacy Policy</a></p>' +
      '<div class="row"><button class="btn btn-outline on-dark btn-44 btn-13" data-act="cookie" data-v="declined">Only necessary</button><button class="btn btn-gold btn-44 btn-13" data-act="cookie" data-v="accepted">Accept all</button></div>';
    document.body.appendChild(el);
  };
  ACT.cookie = function (el) {
    M.S.cookie = el.dataset.v; M.save(); $('.cookie').remove();
    UI.toast({ type: 'success', title: el.dataset.v === 'accepted' ? 'Cookies accepted' : 'Only necessary cookies', sub: 'You can change this anytime in the Privacy Policy.' });
  };

  /* ---------- shared actions ---------- */
  ACT['close-modal'] = function () { UI.closeModal(); };
  ACT['toggle-pw'] = function (el) {
    var inp = el.parentElement.querySelector('input');
    var show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    el.innerHTML = ic(show ? 'eye-slash' : 'eye');
    el.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  };
  ACT.fav = function (el) {
    var id = el.dataset.id, on = M.toggleFav(id), p = M.product(id);
    $$('[data-act="fav"][data-id="' + id + '"]').forEach(function (b) {
      b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on);
      b.innerHTML = ic(on ? 'heart-fill' : 'heart');
    });
    UI.toast(on ? { type: 'success', title: 'Saved to favorites', sub: p ? p.short : '', action: 'View', onAction: function () { go(M.user() ? '/account/favorites' : '/auth/signin?next=/account/favorites'); } }
                : { type: 'info', title: 'Removed from favorites', sub: p ? p.short : '', action: 'Undo', onAction: function () { el.click(); } });
    UI.rerenderIf('/account/favorites');
  };
  UI.addedToast = function (title, sub) {
    UI.refreshChrome();
    UI.toast({ type: 'success', title: title || 'Added to cart', sub: sub, action: 'View cart', onAction: function () { go('/cart'); } });
  };
  ACT.add = function (el) {
    var p = M.product(el.dataset.id);
    if (!p) return;
    if (p.stock === 0) { ACT.notify(el); return; }
    var l = M.addProduct(p.id, { size: el.dataset.size, qty: Number(el.dataset.qty || 1) });
    UI.addedToast('Added to cart', p.short + ' · ' + M.money(l.price));
  };

  UI.refreshChrome = function () {
    UI.renderHeader(); UI.renderFooter();
    if ($('.drawer')) UI.renderDrawer();
  };

  window.UI = UI;
})();
