/* MONRE — client-side state (localStorage), auth, cart, orders and delivery simulation. */
(function () {
  var D = window.MONRE_DATA;
  var KEY = 'monre-proto-v1';

  // Delivery simulation: an order goes Placed → Packed → In transit → Delivered within 30 s.
  var STAGES = [
    { id: 'placed', label: 'Placed', long: 'Order placed', at: 0 },
    { id: 'packed', label: 'Packed', long: 'Packed', at: 8 },
    { id: 'transit', label: 'In transit', long: 'In transit', at: 16 },
    { id: 'delivered', label: 'Delivered', long: 'Delivered', at: 30 }
  ];
  var DELIVERY_MS = 30000;

  var defaults = {
    users: {},            // email -> { name, lastName, password, phone, birthday, bonuses, since, member }
    session: null,        // email of signed-in user
    cart: [],             // lines
    promo: null,          // applied promo code
    favorites: [],        // product ids (guest + user share the same browser list)
    orders: [],           // all orders made in this browser
    addresses: {},        // email -> [address]
    certificates: {},     // email -> [certificate]
    notify: [],           // back-in-stock subscriptions
    recent: [],           // recently viewed product ids
    currency: 'USD',
    lang: 'en',
    cookie: null,         // 'accepted' | 'declined'
    nextOrder: 2482
  };

  var S;
  function load() {
    try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
    for (var k in defaults) if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(defaults[k]));
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked — keep in memory */ } }
  load();

  /* ---------- helpers ---------- */
  function product(id) { for (var i = 0; i < D.products.length; i++) if (D.products[i].id === id) return D.products[i]; return null; }
  function giftSet(id) { for (var i = 0; i < D.giftSets.length; i++) if (D.giftSets[i].id === id) return D.giftSets[i]; return null; }
  function category(id) { for (var i = 0; i < D.categories.length; i++) if (D.categories[i].id === id) return D.categories[i]; return null; }
  function currency() { for (var i = 0; i < D.currencies.length; i++) if (D.currencies[i].code === S.currency) return D.currencies[i]; return D.currencies[0]; }
  function lang() { for (var i = 0; i < D.languages.length; i++) if (D.languages[i].code === S.lang) return D.languages[i]; return D.languages[0]; }

  // Format a USD amount in the selected currency.
  function money(usd, decimals) {
    var c = currency();
    var v = usd * c.rate;
    var d = decimals === undefined ? 0 : decimals;
    var s = d ? v.toFixed(d) : String(Math.round(v));
    return (usd < 0 ? '−' : '') + c.pre + s.replace('-', '') + c.post;
  }

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()); }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function nameFromEmail(email) { return cap(String(email).split('@')[0].replace(/[._\-+0-9]+/g, ' ').trim().split(' ')[0] || 'Friend'); }

  /* ---------- auth (fake: any email + any password) ---------- */
  function user() { return S.session ? S.users[S.session] || null : null; }
  function ensureUser(email, data) {
    email = String(email).trim().toLowerCase();
    if (!S.users[email]) {
      S.users[email] = {
        email: email, name: (data && data.name) || nameFromEmail(email), lastName: (data && data.lastName) || '',
        password: data && data.password !== undefined ? data.password : null,
        phone: '', birthday: '', bonuses: 240, since: new Date().getFullYear(),
        member: String(Math.floor(1000 + Math.random() * 8999)).padStart(6, '0'), verified: false
      };
    }
    return S.users[email];
  }
  function signIn(email, password) {
    email = String(email).trim().toLowerCase();
    var u = S.users[email];
    if (u && u.password && password !== u.password) return { ok: false, error: 'password' };
    if (!u) u = ensureUser(email, { password: password });
    if (!u.password) u.password = password;
    S.session = email; save();
    return { ok: true, user: u };
  }
  function register(name, email, password) {
    email = String(email).trim().toLowerCase();
    if (S.users[email]) return { ok: false, error: 'taken' };
    var parts = String(name || '').trim().split(/\s+/);
    var u = ensureUser(email, { name: cap(parts[0]) || nameFromEmail(email), lastName: cap(parts.slice(1).join(' ')), password: password });
    S.session = email; save();
    return { ok: true, user: u };
  }
  function signOut() { S.session = null; save(); }
  function resetPassword(email, pw) { var u = S.users[String(email).trim().toLowerCase()]; if (u) { u.password = pw; save(); } }

  /* ---------- cart ---------- */
  function lineKey(kind, id, extra) { return kind + ':' + id + (extra ? ':' + extra : ''); }
  function addLine(line) {
    var ex = null;
    for (var i = 0; i < S.cart.length; i++) if (S.cart[i].key === line.key) ex = S.cart[i];
    if (ex) ex.qty = Math.min(99, ex.qty + (line.qty || 1));
    else S.cart.push(Object.assign({ qty: 1 }, line));
    save();
    return ex || S.cart[S.cart.length - 1];
  }
  function addProduct(id, opts) {
    opts = opts || {};
    var pr = product(id); if (!pr) return null;
    var size = null;
    if (pr.sizes) { var sid = opts.size || pr.defaultSize; for (var i = 0; i < pr.sizes.length; i++) if (pr.sizes[i].id === sid) size = pr.sizes[i]; }
    var cat = category(pr.cat);
    return addLine({
      key: lineKey('p', id, size && size.id), kind: 'product', id: id, size: size && size.id,
      name: pr.name, short: pr.short, meta: size ? size.meta : pr.meta, price: size ? size.price : pr.price,
      img: pr.img, catLabel: cat ? cat.short.toUpperCase() : pr.type.toUpperCase(), qty: opts.qty || 1
    });
  }
  function addGiftSet(id) {
    var g = giftSet(id);
    return addLine({ key: lineKey('g', id), kind: 'gift', id: id, name: 'Gift set ' + g.name, short: g.name, meta: g.items.length + ' items · gift wrap included', price: g.price, img: g.img, catLabel: 'GIFT SETS' });
  }
  function setQty(key, qty) {
    for (var i = 0; i < S.cart.length; i++) if (S.cart[i].key === key) { S.cart[i].qty = Math.max(1, Math.min(99, qty)); }
    save();
  }
  function removeLine(key) {
    for (var i = 0; i < S.cart.length; i++) if (S.cart[i].key === key) { var l = S.cart.splice(i, 1)[0]; save(); return { line: l, index: i }; }
    return null;
  }
  function restoreLine(r) { if (!r) return; S.cart.splice(Math.min(r.index, S.cart.length), 0, r.line); save(); }
  function cartCount() { var n = 0; S.cart.forEach(function (l) { n += l.qty; }); return n; }
  function lineInStock(l) { if (l.kind !== 'product') return true; var pr = product(l.id); return !pr || pr.stock > 0; }

  /* ---------- totals ---------- */
  var PROMOS = { MONRE10: 0.1, WELCOME10: 0.1 };
  function applyPromo(code) {
    code = String(code || '').trim().toUpperCase();
    if (!PROMOS[code]) return false;
    S.promo = code; save(); return true;
  }
  function clearPromo() { S.promo = null; save(); }

  // opts: { delivery: 'courier'|'pickup'|'express', createAccount: bool, useBonuses: bool }
  function totals(opts, lines) {
    opts = opts || {};
    lines = lines || S.cart;
    var subtotal = 0, count = 0;
    lines.forEach(function (l) { subtotal += l.price * l.qty; count += l.qty; });
    var discount = 0, discountLabel = null;
    if (S.promo) { discount = Math.round(subtotal * PROMOS[S.promo]); discountLabel = 'Promo ' + S.promo; }
    else if (user() || opts.createAccount) { discount = Math.round(subtotal * 0.1); discountLabel = 'Account discount −10%'; }
    var after = subtotal - discount;
    var shipping = 0, d = opts.delivery || 'courier';
    if (d === 'courier') shipping = after >= D.FREE_SHIPPING || count === 0 ? 0 : 5;
    if (d === 'pickup') shipping = 3;
    if (d === 'express') shipping = 12;
    var bonusDiscount = 0, bonusesUsed = 0, u = user();
    if (opts.useBonuses && u && u.bonuses >= 10) {
      bonusDiscount = Math.min(Math.floor(u.bonuses / 10), Math.floor(after * 0.3));
      bonusesUsed = bonusDiscount * 10;
    }
    var total = Math.max(0, after - bonusDiscount + shipping);
    return { subtotal: subtotal, count: count, discount: discount, discountLabel: discountLabel, shipping: shipping,
      bonusDiscount: bonusDiscount, bonusesUsed: bonusesUsed, total: total, freeLeft: Math.max(0, D.FREE_SHIPPING - after) };
  }

  /* ---------- favorites ---------- */
  function isFav(id) { return S.favorites.indexOf(id) >= 0; }
  function toggleFav(id) { var i = S.favorites.indexOf(id); if (i >= 0) S.favorites.splice(i, 1); else S.favorites.unshift(id); save(); return i < 0; }

  function pushRecent(id) { var i = S.recent.indexOf(id); if (i >= 0) S.recent.splice(i, 1); S.recent.unshift(id); S.recent = S.recent.slice(0, 5); save(); }

  /* ---------- orders ---------- */
  function placeOrder(info) {
    var t = totals(info, S.cart);
    var email = (info.email || (user() && user().email) || '').toLowerCase();
    var o = {
      id: String(S.nextOrder), number: S.nextOrder, email: email, createdAt: Date.now(),
      items: S.cart.map(function (l) { return Object.assign({}, l); }),
      totals: t, delivery: info.delivery || 'courier', address: info.address || '', phone: info.phone || '',
      payment: info.payment || 'card', cardLast4: info.cardLast4 || '', recipient: info.recipient || '',
      notified: 'placed', bonusesCredited: false
    };
    S.nextOrder += 1;
    S.orders.unshift(o);
    var u = S.users[email];
    if (u && t.bonusesUsed) u.bonuses -= t.bonusesUsed;
    // gift certificates bought in this order go to the buyer's cabinet
    o.items.forEach(function (l) {
      if (l.kind === 'cert' && email) {
        (S.certificates[email] = S.certificates[email] || []).unshift({ code: 'MONRE-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + String(l.amount), amount: l.amount, to: l.to || '', valid: validTo(), from: 'purchase' });
      }
    });
    S.cart = []; S.promo = null;
    save();
    return o;
  }
  function validTo() { var d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function order(id) { for (var i = 0; i < S.orders.length; i++) if (S.orders[i].id === String(id)) return S.orders[i]; return null; }
  function userOrders() { var u = user(); if (!u) return []; return S.orders.filter(function (o) { return o.email === u.email; }); }
  function stageIndex(o, now) {
    var s = ((now || Date.now()) - o.createdAt) / 1000, idx = 0;
    for (var i = 0; i < STAGES.length; i++) if (s >= STAGES[i].at) idx = i;
    return idx;
  }
  function stage(o, now) { return STAGES[stageIndex(o, now)]; }
  function isActive(o) { return stageIndex(o) < 3; }
  function etaMs(o) { return Math.max(0, o.createdAt + DELIVERY_MS - Date.now()); }
  function deliveryTime(o) { return new Date(o.createdAt + DELIVERY_MS); }
  function stageTime(o, i) { return new Date(o.createdAt + STAGES[i].at * 1000); }

  // Called every second; returns status changes since last check (for toasts).
  function tick() {
    var changes = [], dirty = false;
    S.orders.forEach(function (o) {
      var st = stage(o);
      if (st.id !== o.notified) {
        o.notified = st.id; dirty = true;
        if (st.id === 'delivered' && !o.bonusesCredited) {
          o.bonusesCredited = true;
          var u = S.users[o.email];
          o.bonusesEarned = Math.max(1, Math.round(o.totals.total * 0.05));
          if (u) u.bonuses += o.bonusesEarned;
        }
        changes.push({ order: o, stage: st });
      }
    });
    if (dirty) save();
    return changes;
  }

  /* ---------- addresses / certificates ---------- */
  function addresses() { var u = user(); return u ? (S.addresses[u.email] = S.addresses[u.email] || []) : []; }
  function certificates() { var u = user(); return u ? (S.certificates[u.email] = S.certificates[u.email] || []) : []; }
  function defaultAddress() { var a = addresses(); for (var i = 0; i < a.length; i++) if (a[i].isDefault) return a[i]; return a[0] || null; }
  function addressLine(a) { return a ? [a.street, a.apt, a.city].filter(Boolean).join(', ') : ''; }

  window.MONRE = {
    S: S, save: save, STAGES: STAGES, DELIVERY_MS: DELIVERY_MS,
    product: product, giftSet: giftSet, category: category, currency: currency, lang: lang, money: money,
    isEmail: isEmail, cap: cap, nameFromEmail: nameFromEmail,
    user: user, ensureUser: ensureUser, signIn: signIn, register: register, signOut: signOut, resetPassword: resetPassword,
    addLine: addLine, addProduct: addProduct, addGiftSet: addGiftSet, setQty: setQty, removeLine: removeLine, restoreLine: restoreLine,
    cartCount: cartCount, lineInStock: lineInStock, lineKey: lineKey,
    applyPromo: applyPromo, clearPromo: clearPromo, totals: totals,
    isFav: isFav, toggleFav: toggleFav, pushRecent: pushRecent,
    placeOrder: placeOrder, order: order, userOrders: userOrders, stageIndex: stageIndex, stage: stage, isActive: isActive,
    etaMs: etaMs, deliveryTime: deliveryTime, stageTime: stageTime, tick: tick, validTo: validTo,
    addresses: addresses, certificates: certificates, defaultAddress: defaultAddress, addressLine: addressLine
  };
})();
