/* MONRE — shop pages: home, catalogue, product, gifts, search. */
(function () {
  var M = window.MONRE, D = window.MONRE_DATA, UI = window.UI, ACT = UI.ACT;
  var esc = UI.esc, ic = UI.ic, $ = UI.$, $$ = UI.$$, go = UI.go;
  var P = UI.PAGES = UI.PAGES || {};
  var F = UI.FORMS = UI.FORMS || {};

  function crumbs(list) {
    return '<nav class="breadcrumbs" aria-label="Breadcrumbs">' + list.map(function (c, i) {
      return (i ? '<span>/</span>' : '') + (c[1] ? '<a href="' + c[1] + '">' + esc(c[0]) + '</a>' : '<span class="is-current">' + esc(c[0]) + '</span>');
    }).join('') + '</nav>';
  }
  UI.crumbs = crumbs;

  function features() {
    return '<div class="features">' + [['leaf', 'Natural Ingredients', 'Clean, safe &amp; long-lasting'], ['hand-heart', 'Handcrafted', 'Made in small batches'], ['recycle', 'Sustainable Choices', 'For your home &amp; the planet']].map(function (f, i) {
      return (i ? '<span class="feature-vl"></span>' : '') + '<div class="feature">' + ic(f[0]) + '<div class="col gap-4"><span class="t-body-s">' + f[1] + '</span><span class="t-caption t-muted">' + f[2] + '</span></div></div>';
    }).join('') + '</div>';
  }
  UI.features = features;

  function diffBanner(compact) {
    var dif = D.products.filter(function (p) { return p.cat === 'diffusers'; }).length;
    return '<div class="diff-banner' + (compact ? ' is-compact' : '') + '">' +
      '<img class="glow" src="' + D.IMG.giftCandle + '" alt=""><img class="gift" src="' + D.IMG.giftCandle + '" alt="">' +
      '<p class="t-overline t-gold">Didn’t find yours?</p><p class="t-section" style="color:var(--on-dark)">Try our diffusers —<br>fragrance without a flame</p>' +
      '<a class="btn btn-pill-count" href="#/c/diffusers" style="align-self:flex-start">Diffusers <span class="count-badge">' + dif + '</span>' + ic('caret-right') + '</a></div>';
  }

  /* =================== HOME =================== */
  P.home = function () {
    var best = ['sandalwood-vanilla', 'fig-cedar', 'white-tea', 'luna', 'amber-musk'].map(M.product);
    return '<div class="container page">' +
      '<section class="hero">' +
        '<div class="hero-left"><div class="col" style="gap:32px">' +
          '<div class="hero-intro"><h1 class="t-hero">A home that<br>welcomes with<br>fragrance</h1><p class="t-body-l t-muted">Thoughtfully curated scents and décor to create a calm, beautiful home.</p></div>' +
          '<div class="hero-cta"><a class="btn btn-primary is-white" href="#/c/candles">Shop the Collection</a><a class="btn btn-outline" href="#/c/candles?sort=new">Explore New In' + ic('caret-right') + '</a></div></div>' +
          '<div class="hero-stats"><div><span class="t-stat">12,000+</span><span class="t-caption t-muted">happy homes</span></div><div><span class="t-stat">4.9</span><span class="t-caption t-muted">average rating</span></div><div><span class="t-stat">30 days</span><span class="t-caption t-muted">free returns</span></div></div>' +
        '</div>' +
        '<div class="hero-right">' +
          [[D.IMG.arch1, 342, 'Fragrances &amp; Diffusers', 'candles'], [D.IMG.arch2, 500, 'Furniture', 'furniture'], [D.IMG.arch3, 418, 'Décor &amp; Lighting', 'decor']].map(function (a) {
            return '<div class="arch"><a class="arch-img" href="#/c/' + a[3] + '" style="height:' + a[1] + 'px"><img src="' + a[0] + '" alt=""></a><span class="arch-label">' + a[2] + '</span></div>';
          }).join('') +
        '</div>' +
      '</section>' +
      '<div class="usp-row">' +
        '<div class="usp"><div class="usp-img"><img src="' + D.IMG.giftbox + '" alt="" style="width:206px;height:206px;top:calc(50% + 23px)"></div><div class="usp-body"><div class="col gap-4"><span class="usp-title">Gift sets</span><span class="usp-sub">Ready-made gift sets from <b style="font-weight:500">' + M.money(59) + '</b></span></div><a class="btn btn-outline btn-m" href="#/gifts" style="align-self:flex-start;padding:0 24px">Explore Gifts' + ic('caret-right') + '</a></div></div>' +
        '<div class="usp"><div class="usp-img"><img src="' + D.IMG.sale + '" alt="" style="width:179px;height:179px;left:calc(50% - 4.83px);top:calc(50% + 9.5px)"></div><div class="usp-body"><div class="col gap-4"><span class="usp-title">-25% On Diffusers</span><span class="usp-sub">Only until August 17</span></div><a class="btn btn-outline btn-m" href="#/c/diffusers" style="align-self:flex-start;padding:0 24px">Explore Diffusers' + ic('caret-right') + '</a></div></div>' +
        '<div class="usp"><div class="usp-img"><img src="' + D.IMG.cutLamp + '" alt="" style="width:175px;height:175px;left:calc(50% + 25.83px);top:calc(50% + 15.5px)"><img src="' + D.IMG.perfume + '" alt="" style="width:171px;height:171px;left:calc(50% - 32.17px);top:calc(50% + 15.5px)"></div><div class="usp-body"><div class="col gap-4"><span class="usp-title">Our Standard</span><span class="usp-sub">Handcrafted • Natural ingredients • Long-lasting</span></div><a class="btn btn-outline btn-m" href="#/info/story" style="align-self:flex-start;padding:0 24px">Explore Collections' + ic('caret-right') + '</a></div></div>' +
      '</div>' +
      '<section class="section"><div class="section-head"><h2 class="t-section">Shop by Category</h2><a class="section-link" href="#/catalog">View all categories' + ic('caret-right') + '</a></div>' +
        '<div class="cat-grid">' +
          catCard('is-l', D.IMG.catFragrance, 'Home Fragrances', 'Candles, diffusers &amp; room sprays', 'candles') +
          '<div class="cat-right"><div class="rowx">' +
            catCard('', D.IMG.catLighting, 'Lighting', 'Lamps &amp; ambient light', 'lighting', 'width:124.93%;height:124.93%;left:-5.68%;top:-24.83%;inset:auto') +
            catCard('', D.IMG.catDecor, 'Decor', 'Vases, trays &amp; accents', 'decor') +
          '</div><div class="rowx">' +
            catCard('', D.IMG.catStorage, 'Storage', 'Baskets, boxes &amp; organisers', 'storage') +
            catCard('', D.IMG.catFurniture, 'Furniture', 'Small pieces, big impact', 'furniture') +
          '</div></div>' +
        '</div></section>' +
      '<section class="promo-banner"><img src="' + D.IMG.banner + '" alt="">' +
        '<div class="col gap-8" style="max-width:500px"><h2 class="t-promo" style="color:var(--on-photo);white-space:nowrap">"Quiet Evening" —<br>a ritual of calm</h2><p class="t-body-l" style="color:var(--on-photo-muted);line-height:28px;white-space:nowrap">A sandalwood candle, the warm glow of a wireless lamp, and<br>a linen tray — everything to end the day beautifully.</p></div>' +
        '<div class="row gap-8" style="gap:10px"><a class="promo-chip" href="#/p/sandalwood-vanilla">"Sandalwood" Candle — ' + M.money(34) + '</a><a class="promo-chip" href="#/p/luna">"Luna" Lamp — ' + M.money(89) + '</a><a class="promo-chip" href="#/p/linen-tray">Linen Tray — ' + M.money(39) + '</a></div>' +
        '<div class="row" style="gap:32px"><button class="btn btn-light" style="height:54px;padding:0 38px" data-act="add-quiet">Shop now</button>' +
          '<span class="row gap-4" style="color:var(--white)"><span style="opacity:.6;font-size:14px">as a set&nbsp;</span><b style="font-size:16px">' + M.money(146) + '</b><span class="t-strike" style="opacity:.6;font-size:13px">' + M.money(162) + '</span></span></div>' +
      '</section>' +
      '<section class="section"><div class="section-head"><h2 class="t-section">Bestsellers</h2><a class="section-link" href="#/c/candles?sort=best">View all' + ic('caret-right') + '</a></div>' +
        '<div class="products-row">' + best.map(function (p) { return UI.productCard(p, { home: true }); }).join('') + '</div></section>' +
      features() +
      '<section class="section"><h2 class="t-section t-center">Gift Sets</h2><div class="giftsets-row">' +
        D.giftSets.map(function (g) {
          return '<div class="giftset"><div style="position:relative"><div class="pcard-media"><img src="' + g.img + '" alt=""><span class="pcard-badge"><span class="badge">Bestseller</span></span></div><span class="pcard-fav">' + UI.favBtn('sandalwood-vanilla') + '</span></div>' +
            '<div class="giftset-body"><p class="t-body-m">' + esc(g.homeName) + '</p><p class="t-body-s t-muted">' + esc(g.homeNote) + '</p><ul class="giftset-list">' +
            g.homeItems.map(function (it) { return '<li><span class="chk">' + ic('check') + '</span>' + esc(it) + '</li>'; }).join('') + '</ul></div>' +
            '<button class="btn btn-primary is-white btn-select" data-act="add-gift" data-id="' + g.id + '"><span>Select</span><span class="price">' + M.money(g.price) + '</span></button></div>';
        }).join('') +
        '<div class="builder-card"><img class="blur" src="' + D.IMG.giftCandle + '" alt=""><img class="gift" src="' + D.IMG.giftCandle + '" alt="">' +
          '<div class="top"><div class="col gap-12"><p class="t-card-title">Didn\'t find the perfect one? Build your own</p><p style="font-size:15px;line-height:22px">Choose your favourite fragrance, select packaging, add a personal card — we\'ll deliver it by your date</p></div>' +
          '<div class="mini-steps"><div><span class="step-dot">1</span>Fragrance</div><div><span class="step-dot">2</span>Packaging</div><div><span class="step-dot">3</span>Card</div></div></div>' +
          '<button class="btn btn-dark btn-56 btn-block" style="color:var(--on-builder)" data-act="builder">Start — from ' + M.money(45) + '</button></div>' +
      '</div></section>' +
    '</div>';
  };
  function catCard(cls, img, title, sub, cat, imgStyle) {
    return '<a class="cat-card ' + cls + '" href="#/c/' + cat + '"><img src="' + img + '" alt=""' + (imgStyle ? ' style="' + imgStyle + '"' : '') + '>' +
      '<div class="cat-card-row"><div class="cat-card-text"><span class="' + (cls ? 't-stat' : 't-category') + '">' + title + '</span><small>' + sub + '</small></div><span class="round-arrow">' + ic('arrow-right') + '</span></div></a>';
  }
  ACT['add-quiet'] = function () {
    M.addLine({ key: 'b:quiet-evening', kind: 'bundle', id: 'quiet-evening', name: '"Quiet Evening" set', short: '"Quiet Evening" set', meta: 'Sandalwood candle · Luna lamp · Linen tray', price: 146, img: D.IMG.lamp, catLabel: 'SETS' });
    UI.addedToast('Added to cart', '"Quiet Evening" set · ' + M.money(146));
  };
  ACT['add-gift'] = function (el) {
    var g = M.giftSet(el.dataset.id); M.addGiftSet(g.id);
    UI.addedToast('Added to cart', 'Gift set ' + g.name + ' · ' + M.money(g.price));
  };

  /* =================== CATEGORIES =================== */
  P.categories = function () {
    return '<div class="container page">' + crumbs([['Home', '#/'], ['Catalog']]) +
      '<div class="col gap-8"><h1 class="t-hero">Catalog</h1><p class="t-body-l t-muted">409 items in five worlds of one home</p></div>' +
      '<div class="cats-grid">' + D.catalogWorlds.map(function (w) {
        return '<div class="cat-tile"><a href="#/c/' + w.cat + '"><img src="' + w.img + '" alt=""></a><div class="col grow" style="gap:10px">' +
          '<a class="cat-tile-title" href="#/c/' + w.cat + '"><span class="t-section">' + esc(w.title) + '</span><span class="count-badge">' + w.count + '</span></a>' +
          '<div class="chips">' + w.chips.map(function (c) { return '<a class="chip" href="#/c/' + c[1] + '">' + esc(c[0]) + '</a>'; }).join('') + '<a class="chip is-all" href="#/c/' + w.cat + '">all →</a></div></div></div>';
      }).join('') + diffBanner(true) + '</div></div>';
  };

  /* =================== CATALOG LISTING =================== */
  var CF = { cat: null, scent: [], price: null, wax: [], wick: [], collapsed: {}, loading: false };
  var PRICES = [['Up to $25', 0, 25], ['$25–$50', 25, 50], ['$50–$100', 50, 100], ['$100+', 100, 1e9]];
  var SORTS = [['featured', 'Featured'], ['new', 'Newest first'], ['price-asc', 'Price: Low to High'], ['price-desc', 'Price: High to Low'], ['best', 'Best Selling']];
  var PER_PAGE = 9;

  function catProducts(cat) { return D.products.filter(function (p) { return p.cat === cat; }); }
  function applyFilters(list) {
    return list.filter(function (p) {
      if (CF.scent.length && CF.scent.indexOf(p.scent) < 0) return false;
      if (CF.wax.length && CF.wax.indexOf(p.wax) < 0) return false;
      if (CF.wick.length && CF.wick.indexOf(p.wick) < 0) return false;
      if (CF.price !== null) { var r = PRICES[CF.price]; if (p.price < r[1] || p.price >= r[2]) return false; }
      return true;
    });
  }
  function sortList(list, sort) {
    var l = list.slice();
    if (sort === 'new') l.sort(function (a, b) { return (b.isNew - a.isNew) || (b.added - a.added); });
    if (sort === 'price-asc') l.sort(function (a, b) { return a.price - b.price; });
    if (sort === 'price-desc') l.sort(function (a, b) { return b.price - a.price; });
    if (sort === 'best') l.sort(function (a, b) { return b.popularity - a.popularity; });
    return l;
  }
  function uniq(list, key) { var o = []; list.forEach(function (p) { if (p[key] && o.indexOf(p[key]) < 0) o.push(p[key]); }); return o; }

  P.catalog = function (params, q) {
    var cat = M.category(params.cat);
    if (!cat) return P.notFound();
    if (CF.cat !== cat.id) { CF = { cat: cat.id, scent: [], price: null, wax: [], wick: [], collapsed: {}, loading: false }; }
    var sort = q.sort || 'featured';
    var all = catProducts(cat.id);
    var list = sortList(applyFilters(all), sort);
    var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    var page = Math.min(pages, Math.max(1, Number(q.page) || 1));
    var shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    var chipsCats = ['candles', 'diffusers', 'room-sprays', 'oils', 'wax-melts', 'incense', 'accessories'];
    var inFragrance = chipsCats.indexOf(cat.id) >= 0;
    var active = [];
    CF.scent.forEach(function (s) { active.push(['scent', s, s]); });
    if (CF.price !== null) active.push(['price', CF.price, PRICES[CF.price][0]]);
    CF.wax.forEach(function (s) { active.push(['wax', s, s]); });
    CF.wick.forEach(function (s) { active.push(['wick', s, s]); });

    var grid;
    if (CF.loading) grid = '<div class="grid-3">' + [0, 1, 2, 3, 4, 5].map(UI.skeletonCard).join('') + '</div>';
    else if (!shown.length) grid = '<div class="empty" style="min-height:320px"><span class="ic ic-funnel" style="width:32px;height:32px;color:var(--icon)"></span><p class="t-category">Nothing to show yet</p><p class="t-body-s t-muted">Try changing your filters or search terms.</p><button class="btn btn-primary btn-m" data-act="cf-reset">Reset filters</button></div>';
    else grid = '<div class="grid-3">' + shown.map(function (p) { return UI.productCard(p); }).join('') + '</div>';

    return '<div class="container page">' +
      crumbs([['Home', '#/'], ['Catalog', '#/catalog'], [cat.group, '#/c/' + (cat.group === 'Home Fragrance' ? 'candles' : cat.id)], [cat.name]]) +
      '<section class="cat-banner"><div class="bg"><img src="' + D.IMG.banner + '" alt=""></div><div class="art"><img src="' + D.IMG.candleBooks + '" alt=""></div>' +
        '<p class="t-overline t-gold">' + esc(cat.group) + ' · ' + all.length + ' products</p><h1 class="t-hero" style="color:var(--on-dark)">' + esc(cat.name) + '</h1><p class="t-body-l" style="color:var(--on-photo-muted);width:640px">' + esc(cat.desc) + '</p></section>' +
      (inFragrance ? '<div class="chips-cats">' + chipsCats.map(function (id) {
          var c = M.category(id);
          return '<a class="chip-cat' + (id === cat.id ? ' is-active' : '') + '" href="#/c/' + id + '"><span class="circle"><img src="' + c.img + '" alt=""></span>' + esc(c.short) + '</a>';
        }).join('') + '<a class="chip-cat is-all" href="#/catalog"><span class="circle">' + ic('caret-right') + '</span>All categories</a></div>' : '') +
      '<div class="catalog-grid">' +
        '<aside class="filters" aria-label="Filters"><div class="row-between"><h2 class="t-section">Filters</h2><button class="t-body-s-m t-muted" data-act="cf-reset">Reset</button></div>' +
          filterGroup('scent', 'Scent', uniq(all, 'scent').length ? ['Woody', 'Floral', 'Citrus', 'Gourmand', 'Fresh'].filter(function (s) { return uniq(all, 'scent').indexOf(s) >= 0; }).map(function (s) {
            var n = all.filter(function (p) { return p.scent === s; }).length, on = CF.scent.indexOf(s) >= 0;
            return '<label class="filter-check' + (on ? ' is-on' : '') + '"><span class="check is-16"><input type="checkbox" data-cf="scent" value="' + s + '"' + (on ? ' checked' : '') + '><span class="check-box">' + ic('check') + '</span>' + s + '</span><span class="n">' + n + '</span></label>';
          }).join('') : null) +
          filterGroup('price', 'Price', '<div class="filter-chips is-price">' + PRICES.map(function (r, i) { return '<button class="chip' + (CF.price === i ? ' is-active' : '') + '" data-act="cf-price" data-i="' + i + '">' + r[0].replace('$', M.currency().pre).replace('$', M.currency().pre) + '</button>'; }).join('') + '</div>') +
          (uniq(all, 'wax').length ? filterGroup('wax', 'Wax', '<div class="filter-chips">' + ['Soy', 'Coconut', 'Beeswax'].map(function (w) { return '<button class="chip' + (CF.wax.indexOf(w) >= 0 ? ' is-active' : '') + '" data-act="cf-chip" data-k="wax" data-v="' + w + '">' + w + '</button>'; }).join('') + '</div>') : '') +
          (uniq(all, 'wick').length ? filterGroup('wick', 'Wick', '<div class="filter-chips">' + ['Cotton', 'Wooden'].map(function (w) { return '<button class="chip' + (CF.wick.indexOf(w) >= 0 ? ' is-active' : '') + '" data-act="cf-chip" data-k="wick" data-v="' + w + '">' + w + '</button>'; }).join('') + '</div>') : '') +
          '<button class="btn-show" data-act="cf-show">Show ' + list.length + ' products</button>' +
        '</aside>' +
        '<div class="catalog-content" id="cat-results">' +
          '<div class="top-panel"><div class="active-chips"><span class="t-body-s t-muted">' + list.length + ' products</span>' +
            active.map(function (a) { return '<button class="active-chip" data-act="cf-remove" data-k="' + a[0] + '" data-v="' + a[1] + '">' + esc(a[2]) + ic('x') + '</button>'; }).join('') + '</div>' +
            '<div style="position:relative"><button class="sort-btn" data-act="sort" aria-haspopup="listbox">Sort by: <b>' + SORTS.filter(function (s) { return s[0] === sort; })[0][1] + ic('caret-down') + '</b></button></div></div>' +
          grid +
          (cat.id === 'diffusers' ? '' : diffBanner(false)) +
          (pages > 1 && shown.length ? pagination(page, pages) : '') +
        '</div>' +
      '</div></div>';
  };
  function filterGroup(key, title, body) {
    if (body === null) return '';
    var col = CF.collapsed[key];
    return '<div class="filter-group' + (col ? ' is-collapsed' : '') + '"><button class="filter-head" data-act="cf-collapse" data-k="' + key + '" aria-expanded="' + !col + '">' + title + ic(col ? 'plus' : 'minus') + '</button><div class="filter-body">' + body + '</div></div>';
  }
  function pagination(page, pages) {
    var h = '<nav class="pagination" aria-label="Pages">';
    if (page > 1) h += '<button class="page-cell" data-act="page" data-p="' + (page - 1) + '" aria-label="Previous page"><span class="ic ic-caret-right" style="transform:rotate(180deg)"></span></button>';
    for (var i = 1; i <= pages; i++) h += '<button class="page-cell' + (i === page ? ' is-active' : '') + '" data-act="page" data-p="' + i + '"' + (i === page ? ' aria-current="page"' : '') + '>' + i + '</button>';
    if (page < pages) h += '<button class="page-cell" data-act="page" data-p="' + (page + 1) + '" aria-label="Next page">' + ic('caret-right') + '</button>';
    return h + '</nav>';
  }
  function cfChanged() {
    CF.loading = true; UI.rerender({ keepScroll: true });
    setTimeout(function () { CF.loading = false; UI.rerender({ keepScroll: true }); }, 550);
    var r = UI.route();
    if (r.q.page && r.q.page !== '1') { var q = Object.assign({}, r.q); delete q.page; UI.setQuery(q, true); }
  }
  UI.onChange.push(function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.cf) {
      var arr = CF[t.dataset.cf], i = arr.indexOf(t.value);
      if (t.checked && i < 0) arr.push(t.value); if (!t.checked && i >= 0) arr.splice(i, 1);
      cfChanged();
    }
  });
  ACT['cf-price'] = function (el) { var i = Number(el.dataset.i); CF.price = CF.price === i ? null : i; cfChanged(); };
  ACT['cf-chip'] = function (el) { var arr = CF[el.dataset.k], i = arr.indexOf(el.dataset.v); if (i >= 0) arr.splice(i, 1); else arr.push(el.dataset.v); cfChanged(); };
  ACT['cf-remove'] = function (el) {
    var k = el.dataset.k;
    if (k === 'price') CF.price = null; else { var arr = CF[k]; arr.splice(arr.indexOf(el.dataset.v), 1); }
    cfChanged();
  };
  ACT['cf-reset'] = function () { CF.scent = []; CF.price = null; CF.wax = []; CF.wick = []; cfChanged(); };
  ACT['cf-collapse'] = function (el) { CF.collapsed[el.dataset.k] = !CF.collapsed[el.dataset.k]; UI.rerender({ keepScroll: true }); };
  ACT['cf-show'] = function () { var r = $('#cat-results'); if (r) window.scrollTo(0, r.getBoundingClientRect().top + window.scrollY - 100); };
  ACT.sort = function (btn) {
    var cur = UI.route().q.sort || 'featured';
    UI.openPopover(btn, SORTS.map(function (s) { return '<button class="popover-item' + (s[0] === cur ? ' is-active' : '') + '" data-act="sort-set" data-v="' + s[0] + '" role="option">' + s[1] + '</button>'; }).join(''), { width: 220, align: 'right' });
  };
  ACT['sort-set'] = function (el) {
    UI.closePopover(); var q = Object.assign({}, UI.route().q); q.sort = el.dataset.v; delete q.page;
    CF.loading = true; UI.setQuery(q);
    setTimeout(function () { CF.loading = false; UI.rerender({ keepScroll: true }); }, 450);
  };
  ACT.page = function (el) {
    var q = Object.assign({}, UI.route().q); q.page = el.dataset.p; CF.loading = true; UI.setQuery(q);
    var r = $('#cat-results'); if (r) window.scrollTo(0, r.getBoundingClientRect().top + window.scrollY - 100);
    setTimeout(function () { CF.loading = false; UI.rerender({ keepScroll: true }); }, 450);
  };

  /* =================== PRODUCT =================== */
  var PD = { id: null, img: 0, size: null, qty: 1, all: false, acc: { pyramid: true } };
  P.product = function (params) {
    var p = M.product(params.id);
    if (!p) return P.notFound();
    if (PD.id !== p.id) { PD = { id: p.id, img: 0, size: p.defaultSize || null, qty: 1, all: false, acc: { pyramid: true } }; M.pushRecent(p.id); }
    var size = p.sizes ? p.sizes.filter(function (s) { return s.id === PD.size; })[0] : null;
    var price = size ? size.price : p.price;
    var out = p.stock === 0;
    var cat = M.category(p.cat);
    var related = ['fig-cedar', 'candle-snuffer', 'wick-trimmer', 'travertine-tray'].filter(function (id) { return id !== p.id; }).slice(0, 4).map(M.product);
    if (related.length < 4) related.push(M.product('sandalwood-vanilla'));
    var reviews = PD.all ? D.reviews : D.reviews.slice(0, 3);
    var burn = size ? size.burn : (p.burn || '50 hours');
    return '<div class="container page">' +
      crumbs([['Home', '#/'], [cat.name, '#/c/' + cat.id], [p.name]]) +
      '<div class="pdp">' +
        '<div class="pdp-gallery-col"><div class="pdp-gallery"><div class="pdp-thumbs">' +
          p.gallery.map(function (g, i) { return '<button class="pdp-thumb' + (i === PD.img ? ' is-active' : '') + '" data-act="pdp-img" data-i="' + i + '" aria-label="Image ' + (i + 1) + '"><img src="' + g + '" alt=""></button>'; }).join('') +
          '</div><div style="position:relative"><button class="pdp-main" data-act="lightbox" aria-label="Open gallery"><img src="' + p.gallery[PD.img] + '" alt="' + esc(p.name) + '">' +
          (out ? '<span class="pbadge">Sold out</span>' : p.badge ? '<span class="pbadge">' + esc(p.badge) + '</span>' : '') + '</button>' +
          '<span class="pcard-fav">' + UI.favBtn(p.id) + '</span></div></div>' +
          '<div class="col">' +
            acc('pyramid', 'Scent pyramid', (p.pyramid || ['TOP — ' + (p.notes.split(' · ')[0] || 'fresh notes'), 'HEART — ' + (p.notes.split(' · ')[1] || 'soft woods'), 'BASE — ' + (p.notes.split(' · ')[2] || 'musk')]).map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('')) +
            acc('care', 'Composition &amp; care', '<p>' + esc(p.type) + ' · ' + esc(p.meta) + '. Natural, vegan ingredients; phthalate-free fragrance oils.</p><p>Trim the wick to 5 mm before each use. Burn for no longer than 4 hours at a time and keep away from drafts.</p><a class="btn-text" href="#/info/care">Care instructions →</a>') +
            acc('ship', 'Shipping &amp; returns', '<p>Free shipping on orders over ' + M.money(75) + '. Courier, pickup point or express delivery today.</p><p>30-day returns on unused items. In this prototype every order is delivered within 30 seconds — track it in your account.</p><a class="btn-text" href="#/info/shipping">Shipping details →</a>') +
          '</div></div>' +
        '<div class="pdp-info">' +
          '<h1 class="t-hero">' + esc(p.name) + '</h1>' +
          '<p class="t-body-l t-muted">' + esc(p.notes || p.meta) + '</p>' +
          '<div class="pdp-meta"><a class="pdp-rating" href="#reviews" data-act="to-reviews">' + ic('star-line') + p.rating + ' · ' + p.reviews + ' reviews</a>' +
            (out ? '<span class="stock-chip is-out"><span class="dot"></span>Out of stock</span>' : '<span class="stock-chip"><span class="dot"></span>In stock</span>') + '</div>' +
          '<div class="price-card"><div class="top"><span class="t-hero">' + M.money(price) + '</span>' +
            (p.oldPrice ? '<span class="t-body-l t-muted t-strike">' + M.money(p.oldPrice) + '</span>' : '') +
            '<span class="bonus-chip">+' + Math.max(1, Math.round(price * 0.05)) + ' bonus</span><span class="grow t-body-s t-muted" style="text-align:right;align-self:flex-start">4 × ' + M.money(price / 4, 2) + ' / no interest</span></div>' +
            '<div class="divider"></div><p class="t-body-s">free over ' + M.money(75) + ' · 30-day returns</p></div>' +
          '<p class="t-body-m t-2">' + esc(p.desc) + '</p>' +
          (p.sizes ? '<div class="col gap-12"><span class="t-body-s-m" style="font-size:14px">SIZE</span><div class="size-opts" role="radiogroup">' + p.sizes.map(function (s) {
            return '<button class="size-opt' + (s.id === PD.size ? ' is-active' : '') + '" data-act="pdp-size" data-id="' + s.id + '" role="radio" aria-checked="' + (s.id === PD.size) + '">' + esc(s.label) + ' · ' + M.money(s.price) + '</button>'; }).join('') + '</div></div>' : '') +
          '<div class="qty-row" id="pdp-buy">' + (out ? '' : UI.stepper(PD.qty, 'pdp-qty', 'pdp')) +
            (out ? '<button class="btn btn-primary" data-act="notify" data-id="' + p.id + '">Notify me when back</button>' : '<button class="btn btn-primary is-white" data-act="pdp-add">Add to cart</button>') +
            '<button class="fav-54' + (M.isFav(p.id) ? ' is-on' : '') + '" data-act="fav" data-id="' + p.id + '" aria-label="Add to favorites">' + ic(M.isFav(p.id) ? 'heart-fill' : 'heart') + '</button></div>' +
          '<div class="benefits3"><div class="benefit3"><span class="ib">' + ic('clock') + '</span>' + burn + ' / steady burn</div><div class="benefit3"><span class="ib">' + ic('leaf') + '</span>' + (p.wax ? p.wax + ' wax' : 'Natural') + ' / no paraffin</div><div class="benefit3"><span class="ib">' + ic('hand-heart') + '</span>Hand-poured / small batches</div></div>' +
        '</div>' +
      '</div>' +
      '<section class="col" style="gap:36px"><h2 class="t-hero">Complete the ritual</h2><div class="products-row is-4">' + related.map(function (r) { return UI.productCard(r); }).join('') + '</div></section>' +
      '<section class="bundle"><div class="bundle-photos"><img src="' + D.IMG.candle + '" alt="">' + ic('plus') + '<img src="' + D.IMG.fig + '" alt="">' + ic('plus') + '<img src="' + D.IMG.spray + '" alt=""></div>' +
        '<div class="col grow" style="gap:6px"><p class="t-section" style="color:var(--on-dark)">Build an evening ritual</p><p class="t-body-s" style="color:var(--on-photo-muted)">candle + Fig &amp; Cedar diffuser + Moon lamp — better together</p></div>' +
        '<div class="col gap-4" style="align-items:flex-end"><div class="row gap-8" style="align-items:baseline"><span class="t-section" style="color:var(--on-dark)">' + M.money(154) + '</span><span class="t-body-s t-strike" style="color:var(--on-photo-muted)">' + M.money(171) + '</span></div><span class="t-overline t-gold">Save 10%</span></div>' +
        '<button class="btn btn-primary btn-m btn-13 is-white" style="font-weight:400" data-act="add-bundle">Build bundle</button></section>' +
      '<section class="col" style="gap:26px" id="reviews"><div class="reviews-head"><div class="row" style="gap:18px"><h2 class="t-hero">Reviews</h2><div class="row gap-8">' + UI.stars(5) + '<span class="t-body-m t-muted">' + p.rating + ' · ' + p.reviews + ' reviews</span></div></div>' +
        '<button class="btn btn-light btn-m btn-13 link-u" style="font-weight:400" data-act="write-review">Write a review</button></div>' +
        '<div class="reviews-grid">' + reviews.map(reviewCard).join('') + '</div>' +
        '<div class="row" style="justify-content:center"><button class="t-body-s-m" data-act="all-reviews">' + (PD.all ? 'Show fewer reviews' : 'Show all ' + p.reviews + ' reviews') + '</button></div></section>' +
      '<div class="sticky-bar" id="sticky-bar" hidden><img src="' + p.img + '" alt=""><div class="grow row" style="gap:10px;align-items:baseline;white-space:nowrap;overflow:hidden"><span class="t-body-s-m" style="color:var(--on-dark)">' + esc(p.name) + '</span><span class="t-body-s" style="color:var(--on-photo-muted)">' + (size ? '· ' + esc(size.label.split(' · ')[0]) : '· ' + esc(p.meta)) + '</span></div>' +
        '<span class="t-caption" style="color:var(--on-dark)">' + M.money(price) + '</span>' +
        (out ? '<button class="btn btn-primary btn-m" style="width:124px;padding:0" data-act="notify" data-id="' + p.id + '">Notify me</button>' : '<button class="btn btn-primary btn-m is-white" style="width:124px;padding:0" data-act="pdp-add">Add to cart</button>') + '</div>' +
    '</div>';
  };
  function acc(key, title, body) {
    var open = !!PD.acc[key];
    return '<div class="acc-item' + (open ? ' is-open' : '') + '"><button class="acc-head" data-act="acc" data-k="' + key + '" aria-expanded="' + open + '">' + title + ic(open ? 'minus' : 'plus') + '</button>' + (open ? '<div class="divider"></div>' : '') + '<div class="acc-body">' + body + '</div></div>';
  }
  function reviewCard(r) {
    return '<article class="review">' + (r.photo ? '<div class="review-photo"><img src="' + r.photo + '" alt="" loading="lazy"></div>' : '') + UI.stars(r.rating) +
      '<p>' + esc(r.text) + '</p><div class="review-author"><span class="avatar' + (r.avatar === 'brown' ? ' is-brown' : r.avatar === 'light' ? ' is-light' : '') + '">' + esc(r.name.charAt(0)) + '</span>' + esc(r.name) + ' · ' + esc(r.date) + ' · verified purchase</div></article>';
  }
  UI.mount.push(function (r) {
    if (r.name !== 'product') return;
    var buy = $('#pdp-buy'), bar = $('#sticky-bar');
    if (!buy || !bar) return;
    function check() { bar.hidden = !(buy.getBoundingClientRect().bottom < 0); }
    window.addEventListener('scroll', check, { passive: true });
    UI.cleanup.push(function () { window.removeEventListener('scroll', check); });
    check();
  });
  ACT.acc = function (el) { PD.acc[el.dataset.k] = !PD.acc[el.dataset.k]; UI.rerender({ keepScroll: true }); };
  ACT['pdp-img'] = function (el) { PD.img = Number(el.dataset.i); UI.rerender({ keepScroll: true }); };
  ACT['pdp-size'] = function (el) { PD.size = el.dataset.id; UI.rerender({ keepScroll: true }); };
  ACT['pdp-qty'] = function (el) { PD.qty = Math.max(1, Math.min(99, PD.qty + Number(el.dataset.d))); UI.rerender({ keepScroll: true }); };
  ACT['pdp-add'] = function () {
    var p = M.product(PD.id), l = M.addProduct(p.id, { size: PD.size, qty: PD.qty });
    UI.addedToast('Added to cart', p.short + ' · ' + M.money(l.price) + (PD.qty > 1 ? ' × ' + PD.qty : ''));
  };
  ACT['add-bundle'] = function () {
    M.addLine({ key: 'b:evening-ritual', kind: 'bundle', id: 'evening-ritual', name: 'Evening ritual bundle', short: 'Evening ritual bundle', meta: 'Candle · Fig & Cedar diffuser · Moon lamp', price: 154, img: D.IMG.fig, catLabel: 'BUNDLES' });
    UI.addedToast('Bundle added to cart', 'Build an evening ritual · ' + M.money(154));
  };
  ACT['to-reviews'] = function (el, e) { e.preventDefault(); var r = $('#reviews'); if (r) window.scrollTo(0, r.getBoundingClientRect().top + window.scrollY - 100); };
  ACT['all-reviews'] = function () { PD.all = !PD.all; UI.rerender({ keepScroll: true }); };

  ACT.lightbox = function () {
    var p = M.product(PD.id), i = PD.img;
    function html() {
      return '<div class="row-between"><span class="t-body-s" style="color:var(--white)">' + esc(p.name) + ' · ' + (i + 1) + ' / ' + p.gallery.length + '</span><button class="close-btn" data-act="close-modal" aria-label="Close">' + ic('x') + '</button></div>' +
        '<div class="main"><img src="' + p.gallery[i] + '" alt="">' +
        '<button class="nav prev" data-act="lb-nav" data-d="-1" aria-label="Previous">' + ic('arrow-right') + '</button><button class="nav next" data-act="lb-nav" data-d="1" aria-label="Next">' + ic('arrow-right') + '</button></div>' +
        '<div class="thumbs">' + p.gallery.map(function (g, k) { return '<button class="' + (k === i ? 'is-active' : '') + '" data-act="lb-go" data-i="' + k + '"><img src="' + g + '" alt=""></button>'; }).join('') + '</div>';
    }
    var m = UI.openModal(html(), { cls: 'lightbox', noFocus: true, onClose: function () { PD.img = i; UI.rerender({ keepScroll: true }); } });
    ACT['lb-nav'] = function (el) { i = (i + Number(el.dataset.d) + p.gallery.length) % p.gallery.length; m.innerHTML = html(); };
    ACT['lb-go'] = function (el) { i = Number(el.dataset.i); m.innerHTML = html(); };
    UI.lbKeys = function (e) { if (e.key === 'ArrowRight') ACT['lb-nav']({ dataset: { d: 1 } }); if (e.key === 'ArrowLeft') ACT['lb-nav']({ dataset: { d: -1 } }); };
  };

  /* write a review */
  ACT['write-review'] = function () {
    var p = M.product(PD.id), u = M.user(), st = { rating: 0, photos: [] };
    function html(err) {
      err = err || {};
      return UI.modalHead('Write a review') +
        '<div class="mprod"><img src="' + p.img + '" alt=""><div class="col gap-4"><span class="t-body-s-m">' + esc(p.short) + '</span><span class="t-caption t-2">' + esc(p.type + ', ' + p.meta) + '</span></div></div>' +
        '<div class="col gap-8"><span class="field-label">Your rating</span><div class="stars is-24 is-input" role="radiogroup" aria-label="Your rating">' +
          [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-act="rv-star" data-n="' + n + '" aria-label="' + n + ' stars">' + ic(n <= st.rating ? 'star' : 'star-line') + '</button>'; }).join('') + '</div>' +
          (err.rating ? '<span class="field-error">Please choose a rating.</span>' : '') + '</div>' +
        '<form class="col gap-24" data-form="review" novalidate>' +
          UI.field({ name: 'name', label: 'Your name', value: (u ? u.name + ' ' + (u.lastName || '') : '').trim(), placeholder: 'Your name', error: err.name }) +
          UI.textarea({ name: 'text', label: 'Your review', placeholder: 'Share your experience…', error: err.text }) +
          '<label class="upload">' + ic('camera') + 'Add up to 5 photos<input type="file" accept="image/*" multiple data-upload></label>' +
          '<div class="upload-thumbs" id="rv-thumbs">' + st.photos.map(function (u) { return '<img src="' + u + '" alt="">'; }).join('') + '</div>' +
          '<button class="btn btn-primary btn-block" type="submit">Submit review</button></form>';
    }
    var m = UI.openModal(html());
    ACT['rv-star'] = function (el) {
      st.rating = Number(el.dataset.n);
      $$('[data-act="rv-star"]', m).forEach(function (b, k) { b.innerHTML = ic(k < st.rating ? 'star' : 'star-line'); });
      var e = el.parentElement.parentElement.querySelector('.field-error'); if (e) e.remove();
    };
    F.review = function (form) {
      var name = form.name.value.trim(), text = form.text.value.trim(), err = {};
      if (!st.rating) err.rating = 1;
      if (!name) err.name = 'Please enter your name.';
      if (text.length < 10) err.text = 'Please write at least 10 characters.';
      if (Object.keys(err).length) {
        var keep = { name: form.name.value, text: form.text.value };
        m.innerHTML = html(err); m.querySelector('[name=name]').value = keep.name; m.querySelector('[name=text]').value = keep.text;
        UI.updateCounter(m.querySelector('[name=text]'));
        return;
      }
      UI.successModal('Thank you for your review', 'It will appear on the page after moderation.', 'Back to product');
    };
    UI.onUpload = function (input) {
      Array.prototype.slice.call(input.files, 0, 5 - st.photos.length).forEach(function (f) { st.photos.push(URL.createObjectURL(f)); });
      $('#rv-thumbs').innerHTML = st.photos.map(function (u) { return '<img src="' + u + '" alt="">'; }).join('');
    };
  };

  /* notify me */
  ACT.notify = function (el) {
    var p = M.product(el.dataset.id), u = M.user();
    function html(err, val) {
      return UI.modalHead('Notify me when back') +
        '<div class="mprod"><img src="' + p.img + '" alt=""><div class="col gap-4"><span class="t-body-s-m">' + esc(p.short) + '</span><span class="t-caption t-2">' + esc(p.type + ', ' + p.meta) + ' · currently out of stock</span></div></div>' +
        '<p class="t-body-m t-2">Leave your email and we will let you know when it is back.</p>' +
        '<form class="col gap-24" data-form="notify" novalidate>' + UI.field({ name: 'email', type: 'email', label: 'Email', placeholder: 'anna@example.com', value: val !== undefined ? val : (u ? u.email : ''), error: err, auto: 'email' }) +
        '<button class="btn btn-primary btn-block" type="submit">Notify me</button></form>';
    }
    var m = UI.openModal(html());
    F.notify = function (form) {
      var v = form.email.value.trim();
      if (!M.isEmail(v)) { m.innerHTML = html('Please enter a valid email', v); m.querySelector('input').focus(); return; }
      M.S.notify.push({ id: p.id, email: v, at: Date.now() }); M.save();
      UI.successModal('You will be the first to know', 'We will email you at ' + v + ' as soon as ' + p.short + ' is back in stock.', 'Back to product');
    };
  };

  /* =================== GIFTS =================== */
  var GF = 'all';
  var GCHIPS = [['all', 'All sets'], ['her', 'For her'], ['him', 'For him'], ['housewarming', 'Housewarming'], ['colleagues', 'For colleagues'], ['under60', 'Under $60']];
  P.gifts = function () {
    var sets = D.giftSets.filter(function (g) { return GF === 'all' || g.tags.indexOf(GF) >= 0; });
    return '<div class="container page">' + crumbs([['Home', '#/'], ['Gift Sets']]) +
      '<section class="gifts-hero"><div class="bg"><img src="' + D.IMG.banner + '" alt=""></div><img class="art" src="' + D.IMG.giftbox + '" alt="">' +
        '<p class="t-overline t-gold">Ready-made solutions · gift wrap free</p><p class="t-hero" style="color:var(--white);width:600px;line-height:58px">Gifts that smell of care</p>' +
        '<p class="t-body-l" style="color:var(--white);width:560px">Sets curated by occasion and budget. Box, ribbon, and a handwritten card — already inside. Delivered on your date.</p></section>' +
      '<div class="gift-chips">' + GCHIPS.map(function (c) { return '<button class="chip' + (GF === c[0] ? ' is-active' : '') + '" data-act="gift-filter" data-v="' + c[0] + '">' + c[1].replace('$60', M.money(60)) + '</button>'; }).join('') + '</div>' +
      '<div class="gs-row">' + (sets.length ? sets.map(function (g) {
        return '<article class="gs-card"><div class="gs-photo"><img src="' + g.img + '" alt="">' + (g.badge ? '<span class="pcard-badge"><span class="badge is-sale">' + g.badge + '</span></span>' : '') + '</div>' +
          '<p class="t-overline t-primary">' + g.eyebrow + '</p><p class="t-body-m">' + esc(g.name) + '</p><p class="t-body-s t-muted">' + esc(g.note) + '</p>' +
          '<ul class="gs-list">' + g.items.map(function (it) { return '<li>' + ic('check') + esc(it) + '</li>'; }).join('') + '</ul><div class="spacer"></div>' +
          '<button class="btn btn-primary is-white btn-select" data-act="add-gift" data-id="' + g.id + '"><span>Select</span><span class="price">' + M.money(g.price) + (g.old ? '<span class="old">' + M.money(g.old) + '</span>' : '') + '</span></button></article>';
      }).join('') : '<div class="empty grow card-surface"><span class="empty-icon">' + ic('funnel') + '</span><p class="t-category">No sets for this occasion yet</p><p class="t-body-s t-muted">Build your own gift instead — it takes a minute.</p><button class="btn btn-primary btn-m" data-act="builder">Build a gift</button></div>') + '</div>' +
      '<section class="builder-banner"><img class="art" src="' + D.IMG.giftCandle + '" alt=""><div class="col gap-12" style="width:460px;gap:14px"><p class="t-overline">Builder</p><p class="t-section">Couldn\'t find the perfect one? Build your own</p><p style="font-size:15px;line-height:22px;opacity:.8">Scent, box and card text — handwritten and delivered on time.</p>' +
        '<div class="builder-steps"><div><span class="step-dot">1</span>Scent</div><div><span class="step-dot">2</span>Packaging</div><div><span class="step-dot">3</span>Card</div></div></div>' +
        '<button class="btn btn-primary btn-56" style="width:280px;color:var(--on-builder);position:relative" data-act="builder">Start — from ' + M.money(45) + '</button></section>' +
      '<div class="gift-duo"><div class="is-dark"><div class="col grow gap-4"><p class="t-overline t-gold">Not sure what to pick?</p><p class="t-section">Gift certificate</p><p class="t-caption" style="opacity:.7">' + M.money(50) + ' / ' + M.money(100) + ' / ' + M.money(200) + ' · elegant letter or printed in a box</p></div><button class="btn btn-surface btn-m btn-13" style="font-weight:400" data-act="certificate">Gift it</button></div>' +
        '<div class="is-light"><div class="col grow gap-4"><p class="t-overline">Corporate gifts</p><p class="t-section">Sets for teams from 10 pcs</p><p class="t-caption t-muted">branded card · volume discounts · office delivery</p></div><button class="btn btn-dark btn-m btn-13 link-u" style="font-weight:400;color:var(--on-builder)" data-act="corporate">Request</button></div></div>' +
      features() + '</div>';
  };
  ACT['gift-filter'] = function (el) { GF = el.dataset.v; UI.rerender({ keepScroll: true }); };

  /* gift builder — 4 steps */
  ACT.builder = function () {
    var st = { step: 1, items: ['sandalwood-vanilla', 'fig-cedar'], pack: 'pouch', msg: '' };
    var m;
    function sub() { var s = 0; st.items.forEach(function (id) { s += M.product(id).price; }); return s + pack().price; }
    function pack() { return D.packaging.filter(function (x) { return x.id === st.pack; })[0]; }
    function html() {
      if (st.step === 1) return '<div class="modal-head"><h2 class="modal-title is-l">Choose your items</h2><button class="close-btn" data-act="close-modal" aria-label="Close">' + ic('x') + '</button></div>' +
        '<div class="pick-grid">' + D.builderItems.map(function (id) {
          var p = M.product(id), on = st.items.indexOf(id) >= 0;
          return '<button class="pick' + (on ? ' is-active' : '') + '" data-act="bl-item" data-id="' + id + '" aria-pressed="' + on + '"><span class="ph"><img src="' + p.img + '" alt=""></span><span class="t-body-s-m">' + esc(p.short) + '</span><span class="t-caption t-2">' + esc(p.type + ', ' + p.meta.split(' · ')[0]) + ' · ' + M.money(p.price) + '</span></button>';
        }).join('') + '</div>' +
        '<p class="t-caption t-2">' + st.items.length + ' of 3 items selected · subtotal ' + M.money(sub() - pack().price) + '</p>' +
        '<button class="btn btn-primary btn-block" data-act="bl-next"' + (st.items.length ? '' : ' disabled') + '>Continue to packaging</button>';
      if (st.step === 2) return UI.modalHead('Choose packaging', true, true) +
        '<div class="pick-grid">' + D.packaging.map(function (k) {
          return '<button class="pick is-pack' + (st.pack === k.id ? ' is-active' : '') + '" data-act="bl-pack" data-id="' + k.id + '" aria-pressed="' + (st.pack === k.id) + '"><span class="ph"><img src="' + k.img + '" alt=""></span><span class="t-body-s-m">' + k.name + '</span><span class="t-caption t-2">' + k.note.replace(/\$(\d+)/, function (s, n) { return M.money(Number(n)); }) + '</span></button>';
        }).join('') + '</div><p class="t-caption t-2">' + pack().name + ' selected · subtotal ' + M.money(sub()) + '</p>' +
        '<div class="modal-actions"><button class="btn btn-secondary" data-act="bl-back">Back</button><button class="btn btn-primary" data-act="bl-next">Continue to card</button></div>';
      if (st.step === 3) return UI.modalHead('Add a card', true, true) +
        '<p class="t-body-m t-2">Add a personal message. We will handwrite it on a MONRE card and tuck it inside the gift.</p>' +
        UI.textarea({ name: 'msg', label: 'Your message', placeholder: 'A few warm words for the card…', value: st.msg }) +
        '<div class="modal-actions"><button class="btn btn-secondary" data-act="bl-back">Back</button><button class="btn btn-primary" data-act="bl-next">Review your gift</button></div>';
      return UI.modalHead('Review your gift', true, true) +
        '<div class="sum-rows">' + st.items.map(function (id) { var p = M.product(id); return '<div class="r"><span>' + esc(p.short + ' · ' + p.type + ' ' + p.meta.split(' · ')[0]) + '</span><span>' + M.money(p.price) + '</span></div>'; }).join('') +
        '<div class="r"><span>' + pack().name + '</span><span>' + (pack().price ? M.money(pack().price) : 'Free') + '</span></div>' +
        '<div class="r"><span>Handwritten card' + (st.msg ? ' · “' + esc(st.msg.slice(0, 40)) + (st.msg.length > 40 ? '…' : '') + '”' : '') + '</span><span>Free</span></div><div class="divider"></div>' +
        '<div class="r"><span>Total</span><span>' + M.money(sub()) + '</span></div></div>' +
        '<div class="modal-actions"><button class="btn btn-secondary" data-act="bl-back">Back</button><button class="btn btn-primary" data-act="bl-add">Add gift to cart · ' + M.money(sub()) + '</button></div>';
    }
    function draw() { m.innerHTML = html(); }
    m = UI.openModal(html(), { cls: 'is-880', noFocus: true });
    ACT['bl-item'] = function (el) {
      var i = st.items.indexOf(el.dataset.id);
      if (i >= 0) st.items.splice(i, 1);
      else if (st.items.length < 3) st.items.push(el.dataset.id);
      else UI.toast({ type: 'warning', title: 'Up to 3 items', sub: 'Remove one item to add another.' });
      draw();
    };
    ACT['bl-pack'] = function (el) { st.pack = el.dataset.id; draw(); };
    ACT['bl-next'] = function () { var t = m.querySelector('textarea'); if (t) st.msg = t.value; st.step++; draw(); };
    ACT['bl-back'] = function () { var t = m.querySelector('textarea'); if (t) st.msg = t.value; st.step--; draw(); };
    ACT['bl-add'] = function () {
      var names = st.items.map(function (id) { return M.product(id).short; });
      M.addLine({ key: 'build:' + Date.now(), kind: 'builder', id: 'builder', name: 'Your gift set', short: 'Your gift set', meta: names.join(' · ') + ' · ' + pack().name, price: sub(), img: D.IMG.giftCandle, catLabel: 'GIFT BUILDER', details: { items: st.items, pack: st.pack, msg: st.msg } });
      UI.closeModal(true);
      UI.addedToast('Gift added to cart', names.join(' + ') + ' · ' + M.money(sub()));
    };
  };

  /* gift certificate */
  ACT.certificate = function (preset) {
    var st = { amount: (preset && preset.amount) || 100 };
    var m;
    function html(err, v) {
      err = err || {}; v = v || {};
      var n = Object.keys(err).length;
      return UI.modalHead('When it\'s better to let her choose', true, true) +
        (n ? UI.notice('error', n + (n > 1 ? ' fields need' : ' field needs') + ' your attention', 'Please check highlighted fields.') : '') +
        '<div class="value-chips">' + [50, 100, 200].map(function (a) { return '<button type="button" class="' + (a === st.amount ? 'is-active' : '') + '" data-act="cert-amount" data-a="' + a + '">' + M.money(a) + '</button>'; }).join('') + '</div>' +
        '<form class="col gap-24" data-form="certificate" novalidate>' +
          UI.field({ name: 'email', type: 'email', label: 'Recipient\'s e-mail', placeholder: 'anna@example.com', value: v.email, error: err.email }) +
          UI.textarea({ name: 'msg', label: 'From and a short message', placeholder: 'From Anna — happy birthday! Choose something that feels like home.', value: v.msg, error: err.msg }) +
          '<button class="btn btn-primary btn-block" type="submit" id="cert-buy">Purchase certificate — ' + M.money(st.amount) + '</button>' +
          '<p class="t-caption t-2 t-center">Delivered as an elegant letter immediately or on a selected date · valid for a year</p></form>';
    }
    m = UI.openModal(html());
    ACT['cert-amount'] = function (el) {
      st.amount = Number(el.dataset.a);
      $$('.value-chips button', m).forEach(function (b) { b.classList.toggle('is-active', Number(b.dataset.a) === st.amount); });
      $('#cert-buy').textContent = 'Purchase certificate — ' + M.money(st.amount);
    };
    F.certificate = function (form) {
      var v = { email: form.email.value.trim(), msg: form.msg.value.trim() }, err = {};
      if (!M.isEmail(v.email)) err.email = 'Please enter a valid email';
      if (v.msg.length < 20) err.msg = 'Please add at least 20 characters.';
      if (Object.keys(err).length) { m.innerHTML = html(err, v); UI.updateCounter(m.querySelector('textarea')); return; }
      M.addLine({ key: 'c:' + Date.now(), kind: 'cert', id: 'certificate', amount: st.amount, to: v.email, name: 'Gift certificate ' + M.money(st.amount), short: 'Gift certificate', meta: 'for ' + v.email, price: st.amount, img: D.IMG.giftbox, catLabel: 'GIFT CERTIFICATES' });
      UI.closeModal(true);
      UI.addedToast('Certificate added to cart', M.money(st.amount) + ' · for ' + v.email);
    };
  };

  /* corporate request */
  ACT.corporate = function () {
    var m, u = M.user();
    function html(err, v) {
      err = err || {}; v = v || { email: u ? u.email : '' };
      var n = Object.keys(err).length;
      return UI.modalHead('Gifts for your team', true, true) +
        (n ? UI.notice('error', n + (n > 1 ? ' fields need' : ' field needs') + ' your attention', 'Please check highlighted fields.') : '') +
        '<form class="col gap-24" data-form="corporate" novalidate>' +
          UI.field({ name: 'company', label: 'Company', placeholder: 'Company name', value: v.company, error: err.company }) +
          UI.field({ name: 'qty', label: 'Quantity', placeholder: 'From 10 sets', value: v.qty, error: err.qty, attrs: ' inputmode="numeric"' }) +
          UI.field({ name: 'email', type: 'email', label: 'Email', placeholder: 'anna@example.com', value: v.email, error: err.email }) +
          UI.textarea({ name: 'msg', label: 'Message', placeholder: 'Tell us about the occasion, budget and delivery date…', value: v.msg }) +
          '<button class="btn btn-primary btn-block" type="submit">Request a quote</button></form>';
    }
    m = UI.openModal(html());
    F.corporate = function (form) {
      var v = { company: form.company.value.trim(), qty: form.qty.value.trim(), email: form.email.value.trim(), msg: form.msg.value }, err = {};
      if (v.company.length < 2) err.company = 'Company name is required';
      if (!(Number(v.qty) >= 10)) err.qty = 'Minimum quantity is 10';
      if (!M.isEmail(v.email)) err.email = 'Please enter a valid email';
      if (Object.keys(err).length) { m.innerHTML = html(err, v); UI.updateCounter(m.querySelector('textarea')); return; }
      UI.successModal('Request received', 'Thank you! Our corporate team will reply to ' + v.email + ' within one business day.', 'Back to Gifts', null, true);
    };
  };

  /* =================== SEARCH RESULTS =================== */
  var SRF = 'all';
  P.search = function (params, q) {
    var query = (q.q || '').trim();
    var res = query ? UI.searchProducts(query) : [];
    if (!res.length) return P.nothingFound(query);
    var cats = []; res.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    if (SRF !== 'all' && cats.indexOf(SRF) < 0) SRF = 'all';
    var list = SRF === 'all' ? res : res.filter(function (p) { return p.cat === SRF; });
    return '<div class="container page">' + crumbs([['Home', '#/'], ['Search']]) +
      '<div class="row-between" style="align-items:flex-end"><div class="col gap-8"><h1 class="t-hero">Results for “' + esc(query) + '”</h1><p class="t-body-l t-muted">' + res.length + ' products found</p></div>' +
        '<form data-form="search-page" class="field-control" style="width:360px;height:44px">' + ic('search') + '<input name="q" value="' + esc(query) + '" aria-label="Search"></form></div>' +
      '<div class="gift-chips"><button class="chip' + (SRF === 'all' ? ' is-active' : '') + '" data-act="srf" data-v="all">All · ' + res.length + '</button>' +
        cats.map(function (c) { var cc = M.category(c); return '<button class="chip' + (SRF === c ? ' is-active' : '') + '" data-act="srf" data-v="' + c + '">' + cc.short + ' · ' + res.filter(function (p) { return p.cat === c; }).length + '</button>'; }).join('') + '</div>' +
      '<div class="products-row">' + list.map(function (p) { return UI.productCard(p); }).join('') + '</div>' +
      features() + '</div>';
  };
  ACT.srf = function (el) { SRF = el.dataset.v; UI.rerender({ keepScroll: true }); };
  F.search = function (form) { var q = form.q.value.trim(); if (!q) return; UI.closeOverlays(); go('/search?q=' + encodeURIComponent(q)); };
  F['search-page'] = F.search;
})();
