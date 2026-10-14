/* MONRE — cart, checkout, order done, auth and account pages. */
(function () {
  var M = window.MONRE, D = window.MONRE_DATA, UI = window.UI, ACT = UI.ACT;
  var esc = UI.esc, ic = UI.ic, $ = UI.$, $$ = UI.$$, go = UI.go;
  var P = UI.PAGES, F = UI.FORMS;

  function steps(cur, right) {
    var s = [['1. Cart', '#/cart'], ['2. Checkout', '#/checkout'], ['3. Done', null]];
    return '<div class="steps-row"><div class="steps">' + s.map(function (x, i) {
      var c = i + 1 === cur ? ' class="is-current"' : '';
      return (i ? ic('arrow-right') : '') + (x[1] && i + 1 < cur ? '<a href="' + x[1] + '"' + c + '>' + x[0] + '</a>' : '<span' + c + '>' + x[0] + '</span>');
    }).join('') + '</div>' + right + '</div>';
  }
  function deliveryDate(days) { var d = new Date(); d.setDate(d.getDate() + days); return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }

  /* =================== CART =================== */
  var CART = { promoErr: false };
  P.cart = function () {
    var lines = M.S.cart, t = M.totals();
    var right = '<a class="t-body-m" style="font-weight:500" href="#/c/candles">Continue shopping</a>';
    if (!lines.length) {
      return '<div class="container page">' + steps(1, right) + '<h1 class="t-hero">Cart</h1>' +
        '<div class="card-surface empty" style="min-height:360px"><span class="empty-icon">' + ic('cart') + '</span><p class="t-section">Your cart is empty</p><p class="t-body-m t-muted" style="max-width:420px">Browse the collection — candles, diffusers and gift sets are waiting. Everything you add will appear here.</p>' +
        '<div class="row gap-12"><a class="btn btn-dark btn-13" href="#/c/candles">Explore the collection</a><a class="btn btn-secondary btn-13" href="#/gifts">Gift sets</a></div></div>' + upsells() + '</div>';
    }
    var oos = lines.filter(function (l) { return !M.lineInStock(l); });
    var pct = Math.min(100, Math.round((t.subtotal - t.discount) / D.FREE_SHIPPING * 100));
    return '<div class="container page">' + steps(1, right) +
      '<div class="cart-grid"><div class="cart-items-col">' +
        '<h1 class="t-hero">Cart</h1>' +
        '<p class="t-body-l t-muted">' + (t.freeLeft > 0 ? 'Add ' + M.money(t.freeLeft) + ' more for free shipping' : 'Free shipping unlocked') + '</p>' +
        '<div class="progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><div style="width:' + pct + '%"></div></div>' +
        '<div class="col gap-12">' + lines.map(cartRow).join('') + '</div>' +
        (oos.length ? '<div class="oos-bar">' + esc(oos.map(function (l) { return l.short || l.name; }).join(', ')) + (oos.length > 1 ? ' are' : ' is') + ' currently out of stock — please remove to continue.</div>' : '') +
        upsells() +
      '</div>' +
      '<aside class="total-card"><h2 class="t-section">Total</h2><div class="sum-lines">' +
        '<div class="sum-line"><span>Items (' + t.count + ')</span><span>' + M.money(t.subtotal) + '</span></div>' +
        (t.discount ? '<div class="sum-line"><span>' + (M.S.promo ? 'Discount · ' + M.S.promo : 'Account discount −10%') + '</span><span class="gold">−' + M.money(t.discount) + '</span></div>' : '') +
        '<div class="sum-line"><span>Shipping</span><span>' + (t.shipping ? M.money(t.shipping) : 'Free') + '</span></div></div>' +
        (M.S.promo ? '<div class="promo-applied"><span><b style="font-weight:500">' + M.S.promo + '</b> · −10% applied</span><button class="close-btn" data-act="promo-remove" aria-label="Remove promo code">' + ic('x') + '</button></div>'
          : '<form class="col gap-8" data-form="promo" novalidate><div class="promo-row"><label class="field grow' + (CART.promoErr ? ' is-error' : '') + '"><span class="field-control"><input name="code" placeholder="Promo code" aria-label="Promo code" autocomplete="off"></span></label><button class="btn btn-secondary on-card" type="submit">OK</button></div>' +
            (CART.promoErr ? '<span class="field-error">This code is not valid. Try MONRE10.</span>' : '<span class="t-caption t-muted">Demo code: MONRE10</span>') + '</form>') +
        '<div class="divider"></div>' +
        '<div class="topay"><span class="t-body-l">To pay</span><span class="t-hero">' + M.money(t.total) + '</span></div>' +
        '<a class="btn btn-primary btn-block is-white' + (oos.length ? ' is-disabled' : '') + '" href="#/checkout"' + (oos.length ? ' aria-disabled="true" data-act="blocked"' : '') + '>Proceed to checkout</a>' +
        '<a class="btn btn-secondary on-card btn-block' + (oos.length ? ' is-disabled' : '') + '" href="#/checkout?pay=apple"' + (oos.length ? ' data-act="blocked"' : '') + '>Apple Pay</a>' +
        '<div class="col gap-4 t-caption t-muted t-center"><span>Secure checkout · 30-day returns</span><span>Gift wrap — free</span></div>' +
      '</aside></div></div>';
  };
  function cartRow(l) {
    var ok = M.lineInStock(l);
    var img = '<img src="' + l.img + '" alt="">';
    return '<div class="cart-item' + (ok ? '' : ' is-oos') + '">' + (l.kind === 'product' ? '<a href="#/p/' + l.id + '">' + img + '</a>' : '<a>' + img + '</a>') +
      '<div class="info"><span class="t-overline t-primary">' + esc(l.catLabel || '') + '</span>' +
        (l.kind === 'product' ? '<a class="t-body-l" href="#/p/' + l.id + '">' + esc(l.name) + '</a>' : '<span class="t-body-l">' + esc(l.name) + '</span>') +
        '<span class="t-body-s t-muted">' + esc(l.meta) + '</span>' + (ok ? '' : '<span class="oos">Out of stock</span>') +
        '<div class="qty-line">' + UI.stepper(l.qty, 'cart-qty', esc(l.key), 'is-sm') + '<button class="remove-link" data-act="cart-remove" data-key="' + esc(l.key) + '">Remove</button></div></div>' +
      '<span class="price">' + M.money(l.price * l.qty) + '</span></div>';
  }
  function upsells() {
    var ids = ['long-matches', 'candle-snuffer', 'wax-melts-amber'];
    return '<div class="col gap-16"><p class="t-overline t-muted">Frequently added</p><div class="upsell-row">' + ids.map(function (id) {
      var p = M.product(id), inCart = M.S.cart.some(function (l) { return l.id === id; });
      return '<div class="upsell"><a href="#/p/' + id + '"><img src="' + p.img + '" alt=""></a><div class="col grow" style="gap:2px"><a class="t-body-m" style="font-weight:500" href="#/p/' + id + '">' + esc(p.short) + '</a><span class="t-body-s t-muted">' + M.money(p.price) + '</span></div>' +
        '<button class="add-btn' + (inCart ? ' is-added' : '') + '" data-act="upsell-add" data-id="' + id + '" aria-label="Add ' + esc(p.short) + '">' + ic(inCart ? 'check' : 'plus') + '</button></div>';
    }).join('') + '</div></div>';
  }
  ACT['cart-qty'] = function (el) {
    var l = M.S.cart.filter(function (x) { return x.key === el.dataset.key; })[0]; if (!l) return;
    M.setQty(l.key, l.qty + Number(el.dataset.d)); UI.refreshChrome(); UI.rerender({ keepScroll: true });
  };
  ACT['cart-remove'] = function (el) {
    var r = M.removeLine(el.dataset.key); UI.refreshChrome(); UI.rerender({ keepScroll: true });
    UI.toast({ type: 'info', title: 'Item removed', sub: 'You can bring it back.', action: 'Undo', onAction: function () { M.restoreLine(r); UI.refreshChrome(); UI.rerenderIf('/cart'); } });
  };
  ACT['upsell-add'] = function (el) {
    var p = M.product(el.dataset.id); M.addProduct(p.id);
    UI.refreshChrome(); UI.rerender({ keepScroll: true });
    UI.toast({ type: 'success', title: 'Added to cart', sub: p.short + ' · ' + M.money(p.price), action: 'View cart', onAction: function () { go('/cart'); } });
  };
  ACT['promo-remove'] = function () { M.clearPromo(); UI.rerender({ keepScroll: true }); UI.toast({ type: 'info', title: 'Promo code removed', sub: 'Prices are back to regular.' }); };
  ACT.blocked = function (el, e) { e.preventDefault(); UI.toast({ type: 'error', title: 'An item is out of stock', sub: 'Please remove it to continue.' }); };
  F.promo = function (form) {
    var code = form.code.value;
    if (!code.trim()) { CART.promoErr = true; UI.rerender({ keepScroll: true }); return; }
    if (M.applyPromo(code)) {
      CART.promoErr = false; UI.rerender({ keepScroll: true });
      UI.toast({ type: 'success', title: M.S.promo + ' applied', sub: '−10% off this order.' });
    } else {
      CART.promoErr = true; UI.rerender({ keepScroll: true });
      var inp = $('[name=code]'); if (inp) { inp.value = code; inp.focus(); }
      UI.toast({ type: 'error', title: 'Promo code not valid', sub: 'Please check the code and try again.', action: 'Retry', onAction: function () { var i = $('[name=code]'); if (i) i.focus(); } });
    }
  };

  /* =================== CHECKOUT =================== */
  var CO = null;
  function coInit(q) {
    var u = M.user(), a = M.defaultAddress();
    CO = { tab: u ? 'returning' : 'guest', delivery: 'courier', payment: q.pay === 'apple' ? 'apple' : 'card', createAccount: true, useBonuses: true, processing: false,
      v: { email: u ? u.email : '', phone: u ? u.phone : '', address: a ? M.addressLine(a) : '', card: '', exp: '', cvc: '' }, err: {}, auth: {} };
    if (q.pay === 'apple') CO.tab = 'guest';
  }
  function coRead() {
    var root = $('#co-form'); if (!root) return;
    $$('input[name]', root).forEach(function (i) { if (i.name in CO.v) CO.v[i.name] = i.value; });
    var ca = $('[name=createAccount]', root); if (ca) CO.createAccount = ca.checked;
  }
  P.checkout = function (params, q) {
    if (!CO || UI.route().fresh) coInit(q);
    var u = M.user();
    if (!M.S.cart.length && !CO.processing) {
      return '<div class="container page">' + steps(2, '<a class="t-body-m" style="font-weight:500" href="#/cart">Back to cart</a>') + '<h1 class="t-hero">Checkout</h1>' +
        '<div class="card-surface empty" style="min-height:320px"><span class="empty-icon">' + ic('cart') + '</span><p class="t-section">Nothing to check out</p><p class="t-body-m t-muted">Your cart is empty — add something you love first.</p><a class="btn btn-dark btn-13" href="#/c/candles">Explore the collection</a></div></div>';
    }
    var returning = CO.tab === 'returning';
    var t = M.totals({ delivery: returning ? 'courier' : CO.delivery, createAccount: !u && CO.createAccount && !returning, useBonuses: returning && u && CO.useBonuses });
    var left;
    if (CO.processing) left = processingCard();
    else if (!returning) left = guestForm(u);
    else left = u ? returnCard(u, t) : signinCard();
    return '<div class="container page">' + steps(2, '<a class="t-body-m" style="font-weight:500" href="#/cart">Back to cart</a>') +
      '<h1 class="t-hero">Checkout</h1>' +
      (CO.processing ? '' : '<div class="tabswitch is-44" style="width:520px;background:var(--surface)" role="tablist"><button role="tab" class="' + (!returning ? 'is-active' : '') + '" data-act="co-tab" data-v="guest" aria-selected="' + !returning + '">Guest checkout</button><button role="tab" class="' + (returning ? 'is-active' : '') + '" data-act="co-tab" data-v="returning" aria-selected="' + returning + '">Returning customer</button></div>') +
      '<div class="checkout-grid">' + left + summary(t, returning && u) + '</div></div>';
  };
  function coField(name, ph, type, attrs) {
    return UI.field({ name: name, placeholder: ph, type: type || 'text', value: CO.v[name], error: CO.err[name], variant: 'is-54', attrs: attrs || '' });
  }
  function guestForm(u) {
    var d = CO.delivery, pay = CO.payment;
    return '<form class="form-col" id="co-form" data-form="checkout" novalidate>' +
      '<section class="form-section"><div class="form-section-head"><div class="row gap-12"><span class="step-circle">1</span><h2 class="t-section">Contacts</h2></div>' +
        (u ? '<span class="t-body-s t-muted">Signed in as <b style="font-weight:500;color:var(--text)">' + esc(u.email) + '</b></span>' : '<span class="t-body-s t-muted">Have an account? <button type="button" class="btn-text" data-act="co-tab" data-v="returning">Sign in</button></span>') + '</div>' +
        '<div class="two">' + coField('email', 'E-mail', 'email', ' autocomplete="email"') + coField('phone', 'Phone', 'tel', ' autocomplete="tel"') + '</div>' +
        (u ? '' : '<div class="create-acc">' + UI.checkbox('createAccount', 'Create account — <b style="font-weight:500;color:var(--primary)">−10% on this order</b>', CO.createAccount) + '</div>') +
      '</section>' +
      '<section class="form-section"><div class="row gap-12"><span class="step-circle">2</span><h2 class="t-section">Delivery</h2></div>' +
        (d === 'pickup' ? UI.notice('info', 'Pickup: MONRE Store', '42 Garnet Lane · Mon–Sat 10–20 · ready tomorrow') : coField('address', 'City, street, building, apartment', 'text', ' autocomplete="street-address"')) +
        '<div class="three">' + [['courier', 'Courier · ' + deliveryDate(2), 'free over ' + M.money(75)], ['pickup', 'Pickup point', 'tomorrow · ' + M.money(3)], ['express', 'Express today', 'until 10 pm · ' + M.money(12)]].map(function (o) {
          return '<button type="button" class="opt-card' + (d === o[0] ? ' is-active' : '') + '" data-act="co-delivery" data-v="' + o[0] + '" aria-pressed="' + (d === o[0]) + '"><b>' + o[1] + '</b><span>' + o[2] + '</span></button>'; }).join('') + '</div>' +
      '</section>' +
      '<section class="form-section"><div class="row gap-12"><span class="step-circle">3</span><h2 class="t-section">Payment</h2></div>' +
        '<div class="three">' + [['card', 'Card'], ['apple', 'Apple Pay'], ['cod', 'On delivery']].map(function (o) {
          return '<button type="button" class="pay-tab' + (pay === o[0] ? ' is-active' : '') + '" data-act="co-pay" data-v="' + o[0] + '" aria-pressed="' + (pay === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>' +
        (pay === 'card' ? '<div class="three">' + coField('card', 'Card number', 'text', ' inputmode="numeric" autocomplete="off" data-fmt="card" maxlength="23"') + coField('exp', 'MM / YY', 'text', ' inputmode="numeric" autocomplete="off" data-fmt="exp" maxlength="7"') + coField('cvc', 'CVC', 'text', ' inputmode="numeric" autocomplete="off" maxlength="4"') + '</div>' +
          '<p class="t-caption t-muted">Prototype: no real payment is taken. Any valid-looking card works; 4000 0000 0000 0002 simulates a decline.</p>' : '') +
        (pay === 'apple' ? '<p class="t-body-s t-muted">You will confirm the payment with Apple Pay after clicking Pay. (Simulated.)</p>' : '') +
        (pay === 'cod' ? '<p class="t-body-s t-muted">Pay by card or cash when the courier arrives.</p>' : '') +
      '</section></form>';
  }
  function returnCard(u, t) {
    var a = M.defaultAddress();
    return '<div class="return-card" id="co-form"><div class="row" style="gap:14px"><span class="return-avatar">' + esc(u.name.charAt(0)) + '</span><div class="col gap-4"><p class="t-section">Welcome back, ' + esc(u.name) + '</p><p class="t-overline t-gold">MONRE Club · ready to order</p></div></div>' +
      '<div class="info-rows">' +
        '<div><span class="k">Address</span><span class="v">' + (a ? esc(a.label + ' · ' + M.addressLine(a)) + ' · ' + deliveryDate(2) : 'No saved address yet') + '</span><button class="a" data-act="co-address">' + (a ? 'Change' : 'Add') + '</button></div>' +
        '<div><span class="k">Payment</span><span class="v">Visa ···· 4321 · Apple Pay connected</span><button class="a" data-act="co-tab" data-v="guest">Change</button></div>' +
        '<div style="border-bottom:1px solid var(--border)"><span class="k">Bonuses</span><span class="v">' + (u.bonuses >= 10 ? (CO.useBonuses ? 'spend ' + t.bonusesUsed + ' bonuses' : 'you have ' + u.bonuses + ' bonuses') : 'no bonuses yet — earn 5% on every order') + '</span>' +
          (u.bonuses >= 10 ? '<button class="a" data-act="co-bonus">' + (CO.useBonuses ? '−' + M.money(t.bonusDiscount) : 'Use') + '</button>' : '') + '</div>' +
      '</div>' + (CO.err.address ? '<p class="t-caption" style="color:#f08d8d">Please add a delivery address to continue.</p>' : '') +
      '<button class="btn btn-primary btn-block btn-13" data-act="co-pay-now">Continue</button>' +
      '<p class="t-caption t-center" style="color:var(--on-photo-muted)">Address and card from your profile — manage in <a class="link-u" href="#/account/addresses">cabinet</a></p></div>';
  }
  function signinCard() {
    var e = CO.auth;
    return '<form class="return-card" data-form="co-signin" novalidate><div class="row" style="gap:14px"><span class="return-avatar">' + ic('user') + '</span><div class="col gap-4"><p class="t-section">Welcome back</p><p class="t-overline t-gold">Sign in to use saved address, card &amp; bonuses</p></div></div>' +
      '<div class="two">' + UI.field({ name: 'email', type: 'email', placeholder: 'E-mail', value: e.email, error: e.emailErr, variant: 'is-54', auto: 'email' }) +
        UI.field({ name: 'password', type: 'password', placeholder: 'Password', error: e.pwErr, variant: 'is-54', auto: 'current-password' }) + '</div>' +
      '<button class="btn btn-gold btn-block btn-13' + (e.loading ? ' is-loading' : '') + '" type="submit">' + (e.loading ? ic('spinner') + 'Signing in…' : 'Sign in &amp; continue') + '</button>' +
      '<p class="t-caption t-center" style="color:var(--on-photo-muted)">Any email and password work in this prototype. <a class="link-u" href="#/auth/register?next=/checkout">Create an account</a></p></form>';
  }
  function processingCard() {
    var u = M.user(), a = CO.tab === 'returning' && u ? M.addressLine(M.defaultAddress()) : CO.v.address;
    return '<div class="form-col"><div class="processing-card"><p class="t-category">Delivery · Contacts · Payment</p><p class="t-body-s t-2">' +
      (CO.delivery === 'pickup' && CO.tab !== 'returning' ? 'Pickup: MONRE Store, 42 Garnet Lane' : 'Address: ' + esc(a || '—')) + ' · Delivery ' + deliveryDate(CO.delivery === 'express' ? 0 : 2) + ' · ' +
      (CO.payment === 'card' && CO.tab !== 'returning' ? 'Card •••• ' + esc(CO.v.card.replace(/\D/g, '').slice(-4)) : CO.payment === 'apple' ? 'Apple Pay' : CO.payment === 'cod' ? 'Pay on delivery' : 'Visa •••• 4321') + '</p></div></div>';
  }
  function summary(t, returning) {
    var lines = M.S.cart;
    return '<aside class="order-summary"><h2 class="t-section">Your order</h2>' +
      lines.map(function (l) { return '<div class="order-line"><img src="' + l.img + '" alt=""><div class="nm"><span class="t-body-m">' + esc(l.name) + '</span><span class="t-body-s t-muted">× ' + l.qty + '</span></div><span class="t-body-m" style="font-weight:500">' + M.money(l.price * l.qty) + '</span></div>'; }).join('') +
      '<div class="divider"></div><div class="sum-lines">' +
        '<div class="sum-line"><span>Items (' + t.count + ')</span><span>' + M.money(t.subtotal) + '</span></div>' +
        (t.discount ? '<div class="sum-line"><span>' + (M.S.promo ? 'Promo ' + M.S.promo + ' −10%' : 'Account discount −10%') + '</span><span class="brown">−' + M.money(t.discount) + '</span></div>' : '') +
        (t.bonusDiscount ? '<div class="sum-line"><span>Bonuses (' + t.bonusesUsed + ')</span><span class="brown">−' + M.money(t.bonusDiscount) + '</span></div>' : '') +
        '<div class="sum-line"><span>Shipping</span><span>' + (t.shipping ? M.money(t.shipping) : 'Free') + '</span></div></div>' +
      '<div class="divider"></div><div class="topay"><span class="t-body-m" style="font-weight:500">To pay</span><span class="t-hero">' + M.money(t.total) + '</span></div>' +
      (CO.processing ? '<button class="btn btn-primary btn-block is-loading" disabled style="opacity:1">' + ic('spinner') + 'Processing payment…</button><p class="t-caption t-muted t-center">Please do not close this window.</p>'
        : '<button class="btn ' + (returning ? 'btn-dark' : 'btn-primary is-white') + ' btn-block" data-act="co-pay-now">Pay ' + M.money(t.total) + '</button><p class="t-caption t-muted t-center">By clicking, you agree to the <a class="link-u" href="#/info/terms">Terms</a></p>') +
      '</aside>';
  }
  ACT['co-tab'] = function (el) { coRead(); CO.tab = el.dataset.v; CO.err = {}; UI.rerender({ keepScroll: true }); };
  ACT['co-delivery'] = function (el) { coRead(); CO.delivery = el.dataset.v; delete CO.err.address; UI.rerender({ keepScroll: true }); };
  ACT['co-pay'] = function (el) { coRead(); CO.payment = el.dataset.v; delete CO.err.card; delete CO.err.exp; delete CO.err.cvc; UI.rerender({ keepScroll: true }); };
  ACT['co-bonus'] = function () { CO.useBonuses = !CO.useBonuses; UI.rerender({ keepScroll: true }); };
  ACT['co-address'] = function () { UI.addressModal(null, function () { delete CO.err.address; UI.rerender({ keepScroll: true }); }); };
  ACT['co-pay-now'] = function () { coRead(); payNow(); };
  F.checkout = function () { coRead(); payNow(); };
  F['co-signin'] = function (form) {
    var email = form.email.value.trim(), pw = form.password.value;
    CO.auth = { email: email };
    if (!M.isEmail(email)) CO.auth.emailErr = 'Please enter a valid email';
    if (!pw) CO.auth.pwErr = 'Please enter your password';
    if (CO.auth.emailErr || CO.auth.pwErr) { UI.rerender({ keepScroll: true }); return; }
    CO.auth.loading = true; UI.rerender({ keepScroll: true });
    setTimeout(function () {
      var r = M.signIn(email, pw);
      if (!r.ok) { CO.auth = { email: email, pwErr: 'Wrong password. Try again or reset it.' }; UI.rerender({ keepScroll: true }); return; }
      CO.auth = {}; CO.v.email = r.user.email; CO.v.phone = r.user.phone || CO.v.phone;
      UI.refreshChrome(); UI.rerender({ keepScroll: true });
      UI.toast({ type: 'success', title: 'Welcome back, ' + r.user.name, sub: 'Your saved details are ready.' });
    }, 800);
  };

  function luhnish(n) { return n.length >= 13 && n.length <= 19; }
  function payNow() {
    var u = M.user(), returning = CO.tab === 'returning', err = {};
    if (M.S.cart.some(function (l) { return !M.lineInStock(l); })) {
      UI.toast({ type: 'error', title: 'An item is out of stock', sub: 'Please remove it from the cart to continue.', action: 'Cart', onAction: function () { go('/cart'); } });
      return;
    }
    if (returning) {
      if (!u) return;
      if (!M.defaultAddress()) err.address = 1;
    } else {
      if (!M.isEmail(CO.v.email)) err.email = 'Please enter a valid email';
      if (CO.v.phone.replace(/\D/g, '').length < 7) err.phone = 'Please enter a valid phone number';
      if (CO.delivery !== 'pickup' && CO.v.address.trim().length < 6) err.address = 'Street and apartment required';
      if (CO.payment === 'card') {
        var num = CO.v.card.replace(/\D/g, '');
        if (!luhnish(num)) err.card = 'Please enter a valid card number';
        var m = CO.v.exp.match(/^(\d{2})\s*\/\s*(\d{2})$/);
        var now = new Date(), yy = now.getFullYear() % 100, mm = now.getMonth() + 1;
        if (!m || Number(m[1]) < 1 || Number(m[1]) > 12 || Number(m[2]) < yy || (Number(m[2]) === yy && Number(m[1]) < mm)) err.exp = 'Check the expiry date';
        if (!/^\d{3,4}$/.test(CO.v.cvc)) err.cvc = '3 or 4 digits';
      }
    }
    CO.err = err;
    var n = Object.keys(err).length;
    if (n) {
      UI.rerender({ keepScroll: true });
      UI.toast({ type: 'error', title: n + (n > 1 ? ' fields need' : ' field needs') + ' your attention', sub: 'Please check highlighted fields.', action: 'Retry', onAction: focusFirstError });
      focusFirstError();
      return;
    }
    CO.processing = true; UI.rerender({ keepScroll: true }); window.scrollTo(0, 0);
    setTimeout(function () {
      if (!returning && CO.payment === 'card' && CO.v.card.replace(/\D/g, '') === '4000000000000002') {
        CO.processing = false; CO.err = { card: 'Your card was declined' };
        UI.rerender({ keepScroll: true });
        UI.toast({ type: 'error', title: 'Payment failed', sub: 'Try another card or payment method.', action: 'Retry', onAction: focusFirstError });
        return;
      }
      var info;
      if (returning) {
        var a = M.defaultAddress();
        info = { email: u.email, phone: u.phone || a.phone, address: M.addressLine(a), recipient: a.recipient || u.name, delivery: 'courier', payment: 'saved', cardLast4: '4321', useBonuses: CO.useBonuses };
      } else {
        if (!u && CO.createAccount) { M.ensureUser(CO.v.email); M.S.session = CO.v.email.trim().toLowerCase(); M.S.users[M.S.session].phone = CO.v.phone; M.save(); }
        var uu = M.user();
        info = { email: CO.v.email, phone: CO.v.phone, address: CO.delivery === 'pickup' ? 'MONRE Store, 42 Garnet Lane' : CO.v.address, recipient: uu ? (uu.name + ' ' + (uu.lastName || '')).trim() : CO.v.email, delivery: CO.delivery, payment: CO.payment, cardLast4: CO.v.card.replace(/\D/g, '').slice(-4), createAccount: !u && CO.createAccount };
      }
      var o = M.placeOrder(info);
      CO = null;
      UI.refreshChrome();
      go('/order/' + o.id);
    }, 1600);
  }
  function focusFirstError() { var f = $('.field.is-error input'); if (f) { f.focus(); f.scrollIntoView({ block: 'center' }); } }

  /* =================== ORDER DONE =================== */
  P.done = function (params) {
    var o = M.order(params.id);
    if (!o) return P.notFound();
    var u = M.user(), mine = u && u.email === o.email;
    var earn = Math.max(1, Math.round(o.totals.total * 0.05));
    return '<div class="container page">' + steps(3, '<a class="t-body-s" style="font-weight:500" href="#/c/candles">Continue shopping</a>') +
      '<div class="done-wrap"><div class="done-card"><span class="success-circle">' + ic('check') + '</span>' +
        '<h1 class="t-hero">Order #' + o.id + ' placed</h1>' +
        '<p class="t-body-s t-muted">Delivery today by ' + UI.time(M.deliveryTime(o)) + ' — about 30 seconds in this prototype.<br>Receipt and tracking sent to ' + esc(o.email || 'your e-mail') + '</p>' +
        (mine ? '<span class="bonus-info">' + ic('sparkle') + (o.totals.bonusesUsed ? 'Spent ' + o.totals.bonusesUsed + ' bonuses · ' : '') + '+' + earn + ' will be credited after delivery</span>' +
            '<div class="row w-full" style="gap:10px"><a class="btn btn-dark grow btn-12" href="#/account/orders/' + o.id + '">Track order</a><a class="btn btn-outline grow btn-12" style="border-color:var(--border)" href="#/">Home</a></div>'
          : '<div class="save-prompt"><b>Save your order — create an account in 1 click</b><span>Tracking, history and <span class="t-gold">10% bonuses</span> for this order — password to e-mail</span></div>' +
            '<div class="row w-full" style="gap:10px"><button class="btn btn-primary btn-13" style="width:226px" data-act="done-create" data-id="' + o.id + '">Continue</button><a class="btn btn-outline grow btn-12" style="border-color:var(--border)" href="#/">Home</a></div>') +
      '</div></div></div>';
  };
  ACT['done-create'] = function (el) {
    var o = M.order(el.dataset.id);
    var usr = M.ensureUser(o.email); M.S.session = usr.email; if (!usr.phone) usr.phone = o.phone; M.save();
    UI.refreshChrome();
    UI.toast({ type: 'success', title: 'Account created', sub: 'Welcome to MONRE, ' + usr.name + '! Track your order here.' });
    go('/account/orders/' + o.id);
  };

  /* =================== AUTH =================== */
  var AU = {};
  function authCard(inner) { return '<div class="container"><div class="auth-wrap"><div class="auth-card">' + inner + '</div></div></div>'; }
  function authHead(title, sub) { return '<div class="auth-head"><h1 class="t-hero">' + title + '</h1><p class="t-body-s t-muted">' + sub + '</p></div>'; }
  function socialIcon(provider) {
    if (provider === 'Apple') return '<svg class="auth-social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.05 12.54c-.03-3.02 2.47-4.49 2.58-4.56a5.54 5.54 0 0 0-4.37-2.36c-1.84-.19-3.63 1.1-4.57 1.1-.96 0-2.41-1.08-3.97-1.05A5.78 5.78 0 0 0 1.86 8.6c-2.1 3.64-.53 8.98 1.48 11.92 1 1.44 2.18 3.05 3.73 3 1.52-.06 2.09-.96 3.93-.96 1.82 0 2.36.96 3.94.92 1.63-.02 2.66-1.44 3.62-2.9a11.9 11.9 0 0 0 1.66-3.38 5.2 5.2 0 0 1-3.17-4.66ZM14.06 3.67A5.3 5.3 0 0 0 15.28 0a5.38 5.38 0 0 0-3.48 1.75 5.05 5.05 0 0 0-1.25 3.53 4.45 4.45 0 0 0 3.51-1.61Z"/></svg>';
    return '<svg class="auth-social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.51h6.45a5.52 5.52 0 0 1-2.39 3.52v2.93h3.88c2.27-2.04 3.55-5.05 3.55-8.69Z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.04 7.94-3.04l-3.88-2.93c-1.08.7-2.45 1.12-4.06 1.12-3.13 0-5.78-2.06-6.73-4.84H1.28v3.02A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.27 14.31A7.03 7.03 0 0 1 4.9 12c0-.8.14-1.58.37-2.31V6.67H1.28A11.72 11.72 0 0 0 0 12c0 1.92.47 3.73 1.28 5.33l3.99-3.02Z"/><path fill="#EA4335" d="M12 4.85c1.77 0 3.35.59 4.6 1.75l3.43-3.35A11.71 11.71 0 0 0 12 0 12 12 0 0 0 1.28 6.67l3.99 3.02C6.22 6.91 8.87 4.85 12 4.85Z"/></svg>';
  }
  function social() { return '<div class="auth-or">or</div><div class="auth-social"><button type="button" class="btn btn-secondary" data-act="social" data-v="Apple" aria-label="Continue with Apple"' + (AU.loading ? ' disabled' : '') + '>' + socialIcon('Apple') + '<span>Apple</span></button><button type="button" class="btn btn-secondary" data-act="social" data-v="Google" aria-label="Continue with Google"' + (AU.loading ? ' disabled' : '') + '>' + socialIcon('Google') + '<span>Google</span></button></div>'; }
  function authField(name, label, ph, type, auto) {
    return UI.field({ name: name, label: label, placeholder: ph, type: type || 'text', value: AU.v && AU.v[name], error: AU.err && AU.err[name], variant: 'is-auth', auto: auto, disabled: AU.loading });
  }
  function resetAU(mode) { if (AU.mode !== mode) AU = { mode: mode, v: {}, err: {} }; }

  P.signin = function (params, q) {
    resetAU('signin');
    var L = AU.loading;
    return authCard(authHead('Welcome back', 'Sign in to access your account') +
      '<div class="tabswitch is-44 is-sm" role="tablist"><button class="is-active" role="tab" aria-selected="true">Sign in</button><button role="tab" data-act="auth-go" data-v="/auth/register' + (q.next ? '?next=' + encodeURIComponent(q.next) : '') + '"' + (L ? ' disabled' : '') + '>Register</button></div>' +
      '<form class="col gap-16" data-form="signin" novalidate><div class="auth-fields">' +
        authField('email', 'Email address', 'Enter your email', 'email', 'email') + authField('password', 'Password', 'Enter your password', 'password', 'current-password') + '</div>' +
        '<button class="btn btn-dark btn-56 btn-block btn-12' + (L ? ' is-loading' : '') + '" type="submit"' + (L ? ' style="background:#3d3933"' : '') + '>' + (L ? ic('spinner') + 'Signing in…' : 'Sign in') + '</button>' +
        (L ? '<p class="t-body-s t-muted t-center" style="font-size:12px">Please wait while we sign you in.</p>' : '') +
        '<a class="t-caption t-muted t-center" href="#/auth/forgot"' + (L ? ' style="opacity:.5;pointer-events:none"' : '') + '>Forgot password?</a></form>' + social() +
      '<p class="t-caption t-muted t-center">Prototype: any email and password will sign you in.</p>');
  };
  F.signin = function (form) {
    var v = { email: form.email.value.trim(), password: form.password.value }, err = {};
    if (!M.isEmail(v.email)) err.email = 'Please enter a valid email address.';
    if (!v.password) err.password = 'Please enter your password.';
    AU.v = v; AU.err = err;
    if (Object.keys(err).length) { UI.rerender(); return; }
    AU.loading = true; UI.rerender();
    setTimeout(function () {
      var r = M.signIn(v.email, v.password);
      AU.loading = false;
      if (!r.ok) { AU.err = { password: 'Wrong password. Try again or reset it.' }; UI.rerender(); return; }
      AU = {};
      UI.refreshChrome();
      UI.toast({ type: 'success', title: 'Welcome back, ' + r.user.name, sub: 'You are signed in as ' + r.user.email });
      go(UI.route().q.next || '/account');
    }, 900);
  };
  ACT.social = function (el) {
    var r = M.signIn('anna@gmail.com', null);
    if (r.ok && !r.user.lastName) { r.user.name = 'Anna'; r.user.lastName = 'Morozova'; M.save(); }
    UI.refreshChrome();
    UI.toast({ type: 'success', title: 'Signed in with ' + el.dataset.v, sub: 'Demo account: anna@gmail.com' });
    go(UI.route().q.next || '/account');
  };
  ACT['auth-go'] = function (el) { go(el.dataset.v); };

  function pwState(pw) { return { len: pw.length >= 8, num: /\d/.test(pw) }; }
  function pwBlock(pw) {
    if (!pw) return '<div class="pw-hint">Use at least 8 characters and include a number.</div>';
    var s = pwState(pw);
    if (s.len && s.num) return '<div class="pw-hint" style="color:var(--new)">Strong enough — nice.</div>';
    return '<div class="pw-error">Password is ' + (!s.len && !s.num ? 'too short and needs a number' : !s.len ? 'too short' : 'missing a number') + '. You can still continue in this prototype.</div>' +
      '<ul class="pw-rules"><li class="' + (s.len ? 'is-ok' : '') + '">Use at least 8 characters</li><li class="' + (s.num ? 'is-ok' : '') + '">Include a number</li></ul>';
  }
  P.register = function (params, q) {
    resetAU('register');
    var L = AU.loading, taken = AU.taken;
    return authCard(authHead('Welcome', 'Create your MONRE account') +
      '<div class="tabswitch is-44 is-sm" role="tablist"><button role="tab" data-act="auth-go" data-v="/auth/signin' + (q.next ? '?next=' + encodeURIComponent(q.next) : '') + '"' + (L ? ' disabled' : '') + '>Sign in</button><button class="is-active" role="tab" aria-selected="true">Register</button></div>' +
      '<form class="col gap-16" data-form="register" novalidate><div class="auth-fields">' +
        authField('name', 'Name', 'Enter your name', 'text', 'name') + authField('email', 'Email address', 'Enter your email', 'email', 'email') +
        (taken ? '<div class="email-taken"><a href="#/auth/signin">Sign in</a><a href="#/auth/forgot">Reset password</a><button type="button" class="t-caption" style="color:var(--primary)" data-act="change-email">Change email</button></div>' : '') +
        authField('password', 'Password', 'Create a password', 'password', 'new-password') +
        '<div id="pw-live" class="col gap-8">' + pwBlock((AU.v && AU.v.password) || '') + '</div></div>' +
        '<button class="btn btn-dark btn-56 btn-block btn-12' + (L ? ' is-loading' : '') + '" type="submit">' + (L ? ic('spinner') + 'Creating account…' : 'Create account') + '</button></form>' + social() +
      '<p class="t-caption t-muted t-center">Prototype: registration works with any email and any password.</p>');
  };
  UI.onInput = UI.onInput || [];
  UI.onInput.push(function (e) {
    var t = e.target;
    if (t.name === 'password' && $('#pw-live') && t.closest('[data-form=register]')) { $('#pw-live').innerHTML = pwBlock(t.value); AU.v = AU.v || {}; AU.v.password = t.value; }
  });
  ACT['change-email'] = function () { AU.taken = false; AU.err = {}; AU.v.email = ''; UI.rerender(); var i = $('[name=email]'); if (i) i.focus(); };
  F.register = function (form) {
    var v = { name: form.name.value.trim(), email: form.email.value.trim(), password: form.password.value }, err = {};
    if (!v.name) err.name = 'Please enter your name.';
    if (!M.isEmail(v.email)) err.email = 'Please enter a valid email address.';
    if (!v.password) err.password = 'Please create a password.';
    AU.v = v; AU.err = err; AU.taken = false;
    if (Object.keys(err).length) { UI.rerender(); return; }
    AU.loading = true; UI.rerender();
    setTimeout(function () {
      AU.loading = false;
      var r = M.register(v.name, v.email, v.password);
      if (!r.ok) { AU.err = { email: 'An account with this email already exists.' }; AU.taken = true; UI.rerender(); return; }
      AU = {};
      UI.refreshChrome();
      go('/auth/verify');
    }, 900);
  };

  P.forgot = function (params, q) {
    resetAU('forgot');
    if (q.email && !AU.v.email) AU.v.email = q.email;
    return authCard(authHead('Reset password', 'Enter the email address associated with your account and we’ll send you a link to reset your password.') +
      '<form class="col gap-12" data-form="forgot" novalidate>' + authField('email', 'Email address', 'Enter your account email', 'email', 'email') +
      '<button class="btn btn-dark btn-block btn-12" type="submit" style="height:56px;margin-top:6px">Send reset link</button><a class="btn btn-secondary btn-block btn-12" href="#/auth/signin" style="height:44px">Back to sign in</a></form>');
  };
  F.forgot = function (form) {
    var email = form.email.value.trim();
    AU.v = { email: email };
    if (!M.isEmail(email)) { AU.err = { email: 'Please enter a valid email address.' }; UI.rerender(); return; }
    AU = {}; go('/auth/forgot/sent?email=' + encodeURIComponent(email));
  };
  P.forgotSent = function (params, q) {
    var email = q.email || '';
    return authCard(authHead('Check your inbox', 'A reset link has been sent to your email address.') +
      '<div class="col gap-8"><p class="t-body-s">Open the email' + (email ? ' we sent to <b style="font-weight:500">' + esc(email) + '</b>' : '') + ' and follow the reset link to choose a new password.</p><p class="t-caption t-muted">If you don’t see it, please check your Spam or Junk folder.</p></div>' +
      '<a class="btn btn-dark btn-block btn-12" href="#/auth/signin" style="height:56px">Back to sign in</a>' +
      '<div class="row" style="gap:10px"><button class="btn btn-secondary grow btn-12" style="height:44px" data-act="resend" data-t="Reset link sent again">Resend reset link</button><a class="btn btn-secondary grow btn-12" style="height:44px" href="#/auth/forgot?email=' + encodeURIComponent(email) + '">Change email</a></div>' +
      '<a class="t-caption t-primary t-center link-u" href="#/auth/reset?email=' + encodeURIComponent(email) + '">Prototype: open the reset link from the email</a>');
  };
  ACT.resend = function (el) { UI.toast({ type: 'success', title: el.dataset.t, sub: 'Please check your inbox in a minute.' }); };
  P.reset = function (params, q) {
    resetAU('reset');
    return authCard(authHead('Set new password', 'Create a new password for your account.') +
      '<form class="col gap-12" data-form="reset" novalidate><div class="col gap-6">' + authField('password', 'New password', 'Create a new password', 'password', 'new-password') +
        '<div class="col t-caption t-muted"><span>Minimum 8 characters</span><span>Must include at least one number</span></div></div>' +
        authField('confirm', 'Confirm password', 'Re-enter your new password', 'password', 'new-password') +
        '<button class="btn btn-dark btn-block btn-12" type="submit" style="height:56px;margin-top:6px">Save new password</button><a class="btn btn-secondary on-card btn-block btn-12" style="height:52px;background:var(--white)" href="#/auth/signin">Back to sign in</a></form>');
  };
  F.reset = function (form) {
    var pw = form.password.value, c = form.confirm.value, err = {};
    if (!pw) err.password = 'Please create a password.';
    if (pw && c !== pw) err.confirm = 'Passwords do not match.';
    AU.err = err; AU.v = {};
    if (Object.keys(err).length) { UI.rerender(); return; }
    var email = UI.route().q.email; if (email) M.resetPassword(email, pw);
    AU = {}; go('/auth/reset/done');
  };
  P.resetDone = function () {
    return authCard(authHead('Password updated', 'Your password has been changed successfully. Use your new password to sign in.') +
      '<a class="btn btn-dark btn-block btn-12" style="height:56px" href="#/auth/signin">Back to sign in</a>');
  };
  var verifyTimer = null;
  P.verify = function () {
    var u = M.user();
    return authCard(authHead('Verify your email', 'Open the confirmation link to verify your email address.') +
      '<div class="pending-pill" id="verify-pill">Email confirmation pending</div>' +
      '<div class="col gap-12"><p class="t-caption">' + esc(u ? u.email : '') + '</p><p class="t-caption">Open the verification email and click the confirmation link.</p><p class="t-caption t-muted">If you don’t see it, please check your Spam or Junk folder. In this prototype the link is confirmed automatically in a few seconds.</p></div>' +
      '<button class="btn btn-dark btn-block btn-12" style="height:52px" data-act="resend" data-t="Confirmation email sent">Resend confirmation email</button>' +
      '<div class="row" style="gap:10px"><a class="btn btn-secondary on-card grow btn-12" style="height:52px" href="#/auth/register">Change email</a><a class="btn btn-secondary on-card grow btn-12" style="height:52px" href="#/auth/signin">Back to sign in</a></div>');
  };
  UI.mount.push(function (r) {
    clearTimeout(verifyTimer);
    if (r.name !== 'verify') return;
    verifyTimer = setTimeout(function () {
      var u = M.user(); if (u) { u.verified = true; M.save(); }
      var pill = $('#verify-pill'); if (pill) { pill.textContent = 'Email confirmed'; pill.classList.add('is-ok'); }
      UI.toast({ type: 'success', title: 'Email confirmed', sub: 'Welcome to MONRE' + (u ? ', ' + u.name : '') + '!' });
      setTimeout(function () { if (UI.route().name === 'verify') go('/account'); }, 1200);
    }, 4000);
  });

  /* =================== ACCOUNT =================== */
  var NAV = [['orders', 'Orders & tracking', '/account/orders'], ['profile', 'Profile', '/account/profile'], ['addresses', 'Delivery addresses', '/account/addresses'], ['favorites', 'Favorites', '/account/favorites'], ['certificates', 'Gift certificates', '/account/certificates']];
  function cabinet(active, main) {
    var u = M.user();
    return '<div class="container"><div class="cabinet"><aside class="acc-side"><div class="acc-user"><span class="acc-avatar">' + esc(u.name.charAt(0)) + '</span><div class="nm"><span>' + esc((u.name + ' ' + (u.lastName || '')).trim()) + '</span><span class="t-muted">' + esc(u.email) + '</span></div></div>' +
      '<nav class="acc-nav" aria-label="Account">' + NAV.map(function (n) {
        var cnt = n[0] === 'orders' ? M.userOrders().filter(M.isActive).length : n[0] === 'favorites' ? M.S.favorites.length : 0;
        return '<a href="#' + n[2] + '"' + (active === n[0] ? ' class="is-active" aria-current="page"' : '') + '>' + n[1] + (cnt ? '<span class="cnt">' + cnt + '</span>' : '') + ic('arrow-right') + '</a>';
      }).join('') + '</nav>' +
      '<button class="btn btn-secondary btn-44 btn-12" style="color:var(--muted)" data-act="logout">Log out</button></aside>' +
      '<div class="acc-main">' + main + '</div></div></div>';
  }
  function greet() { var h = new Date().getHours(); return h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }
  function itemsSummary(o) { return o.items.map(function (l) { return l.short || l.name; }).join(', '); }
  function itemsCount(o) { var n = 0; o.items.forEach(function (l) { n += l.qty; }); return n; }
  function orderCard(o, wide) {
    var st = M.stage(o), done = st.id === 'delivered';
    return '<div class="order-card" data-order-card="' + o.id + '"><div class="row-between"><span class="t-overline t-gold">' + (done ? 'Last order' : 'Active order') + ' · #' + o.id + '</span><span class="tag' + (done ? ' is-done' : '') + '">' + st.label + '</span></div>' +
      '<p class="t-section">' + (done ? 'Delivered today at ' + UI.time(M.deliveryTime(o)).slice(0, 5) : 'Delivery today, by ' + UI.time(M.deliveryTime(o))) + '</p>' +
      UI.tracker(o) + '<span class="countdown">' + UI.etaText(o) + '</span>' +
      '<div class="order-preview"><div class="row-between"><div class="thumbs">' + o.items.slice(0, 3).map(function (l) { return '<img src="' + l.img + '" alt="">'; }).join('') + '</div><span class="t-body-s" style="color:var(--on-photo-muted)">' + itemsCount(o) + ' items · <span style="color:var(--on-dark);font-size:12px">' + M.money(o.totals.total) + '</span></span></div>' +
        '<div class="' + (wide ? 'row' : 'col') + '" style="gap:10px"><button class="btn btn-outline on-dark btn-44 btn-12' + (wide ? ' grow' : '') + '" data-act="track" data-id="' + o.id + '">Track order</button><a class="btn btn-gold btn-44 btn-12' + (wide ? ' grow' : '') + '" href="#/account/orders/' + o.id + '">Details</a></div></div></div>';
  }
  function historyRow(o) {
    var done = M.stage(o).id === 'delivered';
    return '<div class="history-row"><div class="who"><span>Order #' + o.id + ' · ' + UI.date(o.createdAt) + '</span><span>' + esc(itemsSummary(o)) + '</span></div><span class="sum">' + M.money(o.totals.total) + '</span>' + UI.statusPill(o) +
      (done ? '<button class="btn btn-outline is-ink" data-act="repeat" data-id="' + o.id + '">Repeat</button>' : '<a class="btn btn-outline is-ink" href="#/account/orders/' + o.id + '">Details</a>') + '</div>';
  }
  P.account = function () {
    var u = M.user(), orders = M.userOrders(), active = orders.filter(M.isActive)[0] || orders[0];
    var delivered = orders.filter(function (o) { return !M.isActive(o); });
    var spent = 0; orders.forEach(function (o) { spent += o.totals.total; });
    var certs = M.certificates(), certSum = 0; certs.forEach(function (c) { certSum += c.amount; });
    var a = M.defaultAddress();
    var fav = M.product(M.S.favorites[0] || (orders[0] && orders[0].items[0] && orders[0].items[0].kind === 'product' ? orders[0].items[0].id : 'sandalwood-vanilla')) || M.product('sandalwood-vanilla');
    var toGold = Math.min(500, Math.round(spent)), bonus = u.bonuses;
    var first = active ? orderCard(active) : '<div class="order-card"><span class="t-overline t-gold">Orders</span><p class="t-section">No active orders</p><p class="t-body-s" style="color:var(--on-photo-muted)">Place an order and follow it here — Placed → Packed → In transit → Delivered in about 30 seconds.</p><div class="order-preview"><a class="btn btn-gold btn-44 btn-12" href="#/c/candles">Explore the collection</a></div></div>';
    return cabinet('orders',
      '<h1 class="t-hero">' + greet() + ', ' + esc(u.name) + '</h1>' +
      '<div class="dash-row">' + first +
        '<div class="summary-card"><span class="t-overline t-primary">Summary</span>' +
          '<div class="ln">' + ic('sparkle') + '<span>' + (delivered[0] ? 'Earned for #' + delivered[0].id : 'Welcome bonus') + '</span><b>+' + (delivered[0] ? (delivered[0].bonusesEarned || 0) : 240) + '</b></div>' +
          '<div class="ln">' + ic('sparkle') + '<span>Certificates</span><b>' + certs.length + (certs.length ? ' · ' + M.money(certSum) : '') + '</b></div>' +
          '<div class="ln">' + ic('sparkle') + '<span>Delivery</span><b>' + (a ? esc(a.label + ', ' + a.street) : 'Not set') + '</b></div>' +
          '<div class="ln">' + ic('sparkle') + '<span>Orders</span><b>' + orders.length + ' · ' + M.money(spent) + '</b></div>' +
          '<a class="t-body-s-m" href="#/account/profile">Open profile</a></div>' +
        '<div class="club-card"><div class="row-between"><span class="t-logo">MONRE</span><span class="t-overline t-gold">Club</span></div><p class="t-category">' + esc((u.name + ' ' + (u.lastName || '')).trim()) + '</p>' +
          '<p class="t-overline" style="letter-spacing:.88px;color:var(--on-photo-muted)">Member №' + u.member.slice(0, 3) + ' ' + u.member.slice(3) + ' · since ' + u.since + '</p>' +
          '<div class="row-between t-caption"><span style="color:var(--on-photo-muted)">To Gold</span><span class="t-gold">' + M.money(toGold) + ' / ' + M.money(500) + '</span></div><div class="club-bar"><div style="width:' + (toGold / 5) + '%"></div></div>' +
          '<div class="row-between" style="align-items:baseline;margin-top:auto"><span class="t-hero">' + bonus + '</span><span class="t-caption" style="color:var(--on-photo-muted)">bonuses ≈ ' + M.money(Math.floor(bonus / 10)) + '</span></div>' +
          '<button class="btn btn-gold btn-44 btn-13" style="color:var(--text)" data-act="spend-bonuses">Spend bonuses</button></div>' +
      '</div>' +
      '<div class="fav-scent"><span class="t-overline t-primary">Favorite scent</span><a class="row gap-12" href="#/p/' + fav.id + '"><img src="' + fav.img + '" alt=""><div class="col" style="gap:2px;font-size:12px"><span>"' + esc(fav.short) + '"</span><span class="t-muted">Your go-to home fragrance</span></div></a><button class="btn-text" style="align-self:flex-start" data-act="add" data-id="' + fav.id + '">Reorder</button></div>' +
      '<div class="history"><div class="row-between" style="align-items:baseline"><h2 class="t-section">Purchase history</h2><span class="t-caption t-muted">All time — ' + orders.length + (orders.length === 1 ? ' order for ' : ' orders for ') + M.money(spent) + '</span></div>' +
        (orders.length ? orders.slice(0, 5).map(historyRow).join('') + (orders.length > 5 ? '<a class="t-body-s-m" href="#/account/orders">All orders →</a>' : '') : '<p class="t-body-s t-muted">No orders yet — your purchases will appear here.</p>') + '</div>');
  };
  ACT['spend-bonuses'] = function () {
    if (!M.S.cart.length) { UI.toast({ type: 'info', title: 'Your cart is empty', sub: 'Add something and spend bonuses at checkout.', action: 'Shop', onAction: function () { go('/c/candles'); } }); return; }
    go('/checkout');
  };
  ACT.repeat = function (el) {
    var o = M.order(el.dataset.id), n = 0;
    o.items.forEach(function (l) { var c = Object.assign({}, l); if (c.kind === 'builder' || c.kind === 'cert') c.key = c.key + ':' + Date.now(); M.addLine(c); n += l.qty; });
    UI.refreshChrome();
    UI.toast({ type: 'success', title: 'Order #' + o.id + ' added to cart', sub: n + ' items', action: 'View cart', onAction: function () { go('/cart'); } });
  };
  ACT.track = function (el) {
    var o = M.order(el.dataset.id);
    function html() {
      var idx = M.stageIndex(o);
      return UI.modalHead('Tracking · Order #' + o.id) +
        '<p class="t-body-s t-muted">' + (idx === 3 ? 'Delivered at ' + UI.time(M.deliveryTime(o)) : 'Courier MONRE Express · ' + UI.etaText(o).replace('<b', '<b style="color:var(--primary)"')) + '</p>' +
        '<ol class="timeline">' + M.STAGES.map(function (s, i) {
          var cls = i < idx || idx === 3 ? 'is-done' : i === idx ? 'is-current' : 'is-pending';
          var note = ['We received your order and payment.', 'Your items are wrapped and ready.', 'The courier is on the way to ' + (o.address || 'you') + '.', 'Handed over — enjoy your MONRE ritual.'][i];
          return '<li class="' + cls + '"><span class="pt"></span><div class="col gap-4"><span class="t-body-s-m">' + s.long + '</span><span class="t-caption t-muted">' + (cls === 'is-pending' ? 'Expected ' + UI.time(M.stageTime(o, i)) : UI.time(M.stageTime(o, i))) + ' · ' + note + '</span></div></li>';
        }).join('') + '</ol><a class="btn btn-primary btn-block" href="#/account/orders/' + o.id + '" data-act="close-modal-link">Order details</a>';
    }
    var m = UI.openModal(html(), { noFocus: true });
    UI.liveModal = function () { if (UI.modalEl() === m) m.innerHTML = html(); };
  };
  ACT['close-modal-link'] = function () { UI.closeModal(true); };

  var OF = 'all';
  P.orders = function () {
    var all = M.userOrders();
    var spent = 0; all.forEach(function (o) { spent += o.totals.total; });
    var list = all.filter(function (o) { return OF === 'all' || (OF === 'active' ? M.isActive(o) : !M.isActive(o)); });
    var active = all.filter(M.isActive)[0];
    if (!all.length) {
      return cabinet('orders', '<h1 class="t-hero">Orders &amp; tracking</h1><div class="card-surface empty" style="padding:48px;gap:24px"><span class="empty-icon" style="background:var(--card);border:1px solid var(--border)"><span class="ic ic-package" style="width:28px;height:28px;color:var(--primary)"></span></span>' +
        '<div class="col gap-12" style="width:520px"><p class="t-section">No orders yet</p><p class="t-body-m t-muted">No orders yet. Your first purchase will appear here, and you’ll be able to track it from this page.</p></div>' +
        '<div class="col gap-12" style="width:320px"><a class="btn btn-dark btn-block btn-13" style="height:48px" href="#/c/candles">Explore the collection</a><p class="t-caption t-muted">Once you place an order, you’ll see delivery updates and order details right here.</p></div></div>');
    }
    return cabinet('orders', '<div class="row-between"><div class="col gap-4"><h1 class="t-section" style="font-size:28px">Orders &amp; tracking</h1><span class="t-caption t-muted">' + all.length + (all.length === 1 ? ' order for ' : ' orders for ') + M.money(spent) + '</span></div>' +
      '<div style="position:relative"><button class="chip" data-act="orders-filter" style="background:transparent">' + { all: 'All status', active: 'Active', delivered: 'Delivered' }[OF] + ic('caret-down') + '</button></div></div>' +
      (active ? orderCard(active, true) : '') +
      '<div class="history"><div class="row-between" style="align-items:baseline"><h2 class="t-section">' + (OF === 'all' ? 'Recent orders' : OF === 'active' ? 'Active orders' : 'Delivered orders') + '</h2><span class="t-caption t-muted">Showing ' + list.length + (list.length === 1 ? ' order' : ' orders') + '</span></div>' +
        (list.length ? list.map(historyRow).join('') : '<p class="t-body-s t-muted">No orders with this status.</p>') + '</div>');
  };
  ACT['orders-filter'] = function (btn) {
    UI.openPopover(btn, [['all', 'All status'], ['active', 'Active'], ['delivered', 'Delivered']].map(function (o) {
      return '<button class="popover-item' + (OF === o[0] ? ' is-active' : '') + '" data-act="orders-filter-set" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join(''), { align: 'right', width: 180 });
  };
  ACT['orders-filter-set'] = function (el) { OF = el.dataset.v; UI.closePopover(); UI.rerender({ keepScroll: true }); };

  P.orderDetails = function (params) {
    var o = M.order(params.id), u = M.user();
    if (!o || o.email !== u.email) return cabinet('orders', '<div class="card-surface empty"><p class="t-section">Order not found</p><p class="t-body-m t-muted">This order belongs to another account or does not exist.</p><a class="btn btn-dark btn-13" href="#/account/orders">Back to orders</a></div>');
    var st = M.stage(o), done = st.id === 'delivered';
    var pay = { card: 'Card ···· ' + o.cardLast4, apple: 'Apple Pay', cod: 'On delivery', saved: 'Visa ···· 4321' }[o.payment] || '—';
    return cabinet('orders', '<a class="t-body-s" href="#/account/orders">Back to orders</a>' +
      '<div class="col" style="gap:4px"><h1 class="t-hero">Order #' + o.id + '</h1><div class="row-between"><span class="t-body-s t-muted">Placed on ' + UI.date(o.createdAt) + ' at ' + UI.time(new Date(o.createdAt)).slice(0, 5) + '</span>' + UI.statusPill(o) + '</div></div>' +
      '<div class="row" style="gap:16px;align-items:stretch"><div class="order-card grow" style="flex:2 1 0" data-order-card="' + o.id + '"><p class="t-section">' + (done ? 'Delivered today at ' + UI.time(M.deliveryTime(o)) : 'Delivery today, by ' + UI.time(M.deliveryTime(o))) + '</p>' + UI.tracker(o, true) +
        '<span class="countdown">' + UI.etaText(o) + '</span>' +
        '<div class="order-preview"><div class="row-between"><div class="thumbs">' + o.items.slice(0, 3).map(function (l) { return '<img src="' + l.img + '" alt="">'; }).join('') + '</div><span class="t-body-s" style="color:var(--on-photo-muted)">' + itemsCount(o) + ' items · <span style="color:var(--on-dark);font-size:12px">' + M.money(o.totals.total) + '</span></span></div>' +
        '<button class="btn btn-outline on-dark btn-44 btn-12 btn-block" data-act="track" data-id="' + o.id + '">Track order</button>' + (done ? '<button class="btn btn-gold btn-44 btn-12 btn-block" data-act="repeat" data-id="' + o.id + '">Repeat order</button>' : '<a class="btn btn-gold btn-44 btn-12 btn-block" href="#/info/contact?order=' + o.id + '">Contact us</a>') + '</div></div>' +
        '<div class="summary-card" style="flex:1 1 0"><span class="t-overline t-primary">Summary</span>' +
          [['Order total', M.money(o.totals.total)], ['Delivery', o.delivery === 'pickup' ? 'Pickup · MONRE Store' : (o.delivery === 'express' ? 'Express · ' : '') + (o.address || '—')], ['Recipient', o.recipient || u.name], ['Items', itemsCount(o)], ['Payment', pay]].map(function (r) {
            return '<div class="ln" style="color:var(--muted)"><span>' + r[0] + '</span><b style="max-width:60%;overflow:hidden;text-overflow:ellipsis">' + esc(r[1]) + '</b></div>'; }).join('') +
          (o.bonusesEarned ? '<div class="ln">' + ic('sparkle') + '<span>Bonuses credited</span><b>+' + o.bonusesEarned + '</b></div>' : '') + '</div></div>' +
      '<div class="history"><div class="row-between" style="align-items:baseline"><h2 class="t-section">Items</h2><span class="t-caption t-muted">' + itemsCount(o) + ' items</span></div>' +
        o.items.map(function (l) {
          return '<div class="history-row"><img src="' + l.img + '" alt="" style="width:56px;height:56px;border-radius:10px;object-fit:cover"><div class="who"><span>' + esc(l.name) + '</span><span>' + l.qty + ' item' + (l.qty > 1 ? 's' : '') + ' · ' + esc(l.meta) + '</span></div><span class="sum" style="width:auto">' + M.money(l.price * l.qty) + '</span></div>';
        }).join('') + '</div>');
  };

  /* profile */
  P.profile = function () {
    var u = M.user();
    function kv(k, v) { return '<div class="kv"><span>' + k + '</span><span' + (v ? '' : ' class="is-empty"') + '>' + esc(v || 'Not provided') + '</span></div>'; }
    return cabinet('profile', '<div class="acc-card" style="padding:24px"><div class="row-between"><h1 class="t-section">Profile</h1><a class="btn btn-dark btn-s btn-12" href="#/account/profile/edit">Edit profile</a></div>' +
      '<span class="t-overline t-primary">Personal data</span><div class="col">' + kv('First name', u.name) + kv('Last name', u.lastName) + kv('Email', u.email) + kv('Phone', u.phone) + kv('Birthday', u.birthday) + '</div>' +
      '<div class="kv-sep"></div><span class="t-overline t-primary">Access settings</span>' +
      '<div class="row-between"><span class="t-body-s">Change password</span><button class="btn btn-dark btn-s btn-12" data-act="change-pw">Change</button></div>' +
      '<div class="row-between"><span class="t-body-s">Delivery addresses</span><a class="btn btn-secondary on-card btn-s btn-12" href="#/account/addresses">View</a></div></div>');
  };
  var PE = null;
  P.profileEdit = function () {
    var u = M.user();
    if (!PE) PE = { v: { name: u.name, lastName: u.lastName, email: u.email, phone: u.phone, birthday: u.birthday }, err: {}, dirty: false };
    function f(name, label, ph, type) { return UI.field({ name: name, label: label, placeholder: ph, value: PE.v[name], error: PE.err[name], type: type, labelM: false }); }
    return cabinet('profile', '<form class="acc-card" data-form="profile" novalidate style="gap:20px"><div class="col gap-8"><h1 class="t-hero">Edit profile</h1><p class="t-caption t-muted">Update your personal details. Required fields are marked with an asterisk (*).</p></div>' +
      '<div class="two" style="gap:12px">' + f('name', 'First name *', 'First name') + f('lastName', 'Last name *', 'Last name') + '</div>' +
      '<div class="two" style="gap:12px">' + f('email', 'Email *', 'Email', 'email') + f('phone', 'Phone', '+1 555 000 00 00', 'tel') + '</div>' +
      f('birthday', 'Birthday', 'DD.MM.YYYY') +
      '<div class="row gap-8"><button class="btn btn-dark btn-m btn-12" type="submit">Save changes</button><a class="btn btn-secondary btn-m btn-12" href="#/account/profile" data-act="pe-cancel">Cancel</a></div>' +
      '<p class="unsaved" id="pe-dirty"' + (PE.dirty ? '' : ' hidden') + '>You have unsaved changes. Click Save changes to update your profile.</p></form>');
  };
  UI.onInput.push(function (e) {
    if (PE && e.target.closest && e.target.closest('[data-form=profile]')) { PE.v[e.target.name] = e.target.value; PE.dirty = true; var d = $('#pe-dirty'); if (d) d.hidden = false; }
  });
  ACT['pe-cancel'] = function () { PE = null; };
  F.profile = function (form) {
    var v = PE.v, err = {};
    if (!String(v.name || '').trim()) err.name = 'First name is required';
    if (!String(v.lastName || '').trim()) err.lastName = 'Last name is required';
    if (!M.isEmail(v.email)) err.email = 'Please enter a valid email';
    if (v.birthday && !/^\d{2}\.\d{2}\.\d{4}$/.test(v.birthday.trim())) err.birthday = 'Use the format DD.MM.YYYY';
    PE.err = err;
    if (Object.keys(err).length) { UI.rerender({ keepScroll: true }); return; }
    var u = M.user(), newEmail = v.email.trim().toLowerCase();
    if (newEmail !== u.email) {
      if (M.S.users[newEmail]) { PE.err = { email: 'This email is used by another account' }; UI.rerender({ keepScroll: true }); return; }
      delete M.S.users[u.email];
      M.S.orders.forEach(function (o) { if (o.email === u.email) o.email = newEmail; });
      if (M.S.addresses[u.email]) { M.S.addresses[newEmail] = M.S.addresses[u.email]; delete M.S.addresses[u.email]; }
      if (M.S.certificates[u.email]) { M.S.certificates[newEmail] = M.S.certificates[u.email]; delete M.S.certificates[u.email]; }
      u.email = newEmail; M.S.users[newEmail] = u; M.S.session = newEmail;
    }
    u.name = M.cap(v.name.trim()); u.lastName = M.cap(v.lastName.trim()); u.phone = (v.phone || '').trim(); u.birthday = (v.birthday || '').trim();
    M.save(); PE = null;
    UI.refreshChrome(); go('/account/profile');
    UI.toast({ type: 'success', title: 'Profile saved', sub: 'Your personal details are up to date.' });
  };
  UI.mount.push(function (r) { if (r.name !== 'profileEdit') PE = null; });
  ACT['change-pw'] = function () {
    function html(err) {
      err = err || {};
      return UI.modalHead('Change password') + '<form class="col gap-24" data-form="change-pw" novalidate>' +
        UI.field({ name: 'pw', type: 'password', label: 'New password', placeholder: 'Create a new password', error: err.pw, auto: 'new-password' }) +
        UI.field({ name: 'pw2', type: 'password', label: 'Confirm password', placeholder: 'Re-enter your new password', error: err.pw2, auto: 'new-password' }) +
        '<button class="btn btn-primary btn-block" type="submit">Save new password</button></form>';
    }
    var m = UI.openModal(html());
    F['change-pw'] = function (form) {
      var err = {};
      if (!form.pw.value) err.pw = 'Please enter a new password';
      else if (form.pw.value !== form.pw2.value) err.pw2 = 'Passwords do not match';
      if (Object.keys(err).length) { m.innerHTML = html(err); return; }
      M.user().password = form.pw.value; M.save(); UI.closeModal(true);
      UI.toast({ type: 'success', title: 'Password changed', sub: 'Use your new password next time you sign in.' });
    };
  };

  /* addresses */
  P.addresses = function () {
    var list = M.addresses();
    return cabinet('addresses', '<div class="row-between"><h1 class="t-section">Delivery addresses</h1><button class="btn btn-dark btn-44 btn-12" data-act="addr-add">Add address</button></div>' +
      (list.length ? list.map(function (a, i) {
        return '<div class="addr-card"><div class="row-between"><div class="row gap-8"><span class="t-body-m">' + esc(a.label) + '</span>' + (a.isDefault ? '<span class="default-pill">Default</span>' : '') + '</div><span class="t-caption t-muted">' + esc([a.recipient, a.phone].filter(Boolean).join(' · ')) + '</span></div>' +
          '<p class="t-body-s">' + esc(M.addressLine(a)) + (a.region || a.zip ? ', ' + esc([a.region, a.zip, a.country].filter(Boolean).join(', ')) : '') + '</p><span class="t-caption t-muted">Saved address</span>' +
          '<div class="acts"><button class="btn btn-dark" data-act="addr-edit" data-i="' + i + '">Edit</button><button class="btn btn-secondary on-card" style="color:var(--muted)" data-act="addr-del" data-i="' + i + '">Delete</button>' + (a.isDefault ? '' : '<button class="btn btn-secondary on-card" data-act="addr-default" data-i="' + i + '">Set as default</button>') + '</div></div>';
      }).join('') : '<div class="card-surface empty" style="padding:48px"><span class="empty-icon">' + ic('package') + '</span><p class="t-section">No saved addresses</p><p class="t-body-m t-muted">Add an address to check out in one click.</p><button class="btn btn-dark btn-13" data-act="addr-add">Add address</button></div>'));
  };
  UI.addressModal = function (index, after) {
    var list = M.addresses(), a = index === null ? null : list[index], u = M.user();
    var v = a ? Object.assign({}, a) : { label: list.length ? 'Additional address' : 'Home', recipient: (u.name + ' ' + (u.lastName || '')).trim(), street: '', apt: '', city: '', region: '', zip: '', country: '', phone: u.phone || '', isDefault: !list.length };
    function f(name, label, ph, err) { return UI.field({ name: name, label: label, labelM: true, placeholder: ph, value: v[name], error: err && err[name], variant: 'on-card' }); }
    function html(err) {
      return '<div class="modal-head"><h2 class="modal-title is-l">' + (a ? 'Edit address' : 'Add address') + '</h2><button class="close-btn" style="width:40px;height:40px;background:var(--card)" data-act="close-modal" aria-label="Close">' + ic('x-line') + '</button></div>' +
        '<form class="col gap-24" data-form="address" novalidate>' + f('label', 'Address label', 'Home, Office…', err) + f('recipient', 'Recipient', 'Full name', err) + f('street', 'Street address', 'Street and building', err) + f('apt', 'Apartment (optional)', 'Enter apartment, suite, or floor', err) +
        '<div class="two" style="gap:16px">' + f('city', 'City', 'Enter city', err) + f('region', 'State or region', 'Enter state or region', err) + '</div>' +
        '<div class="two" style="gap:16px">' + f('zip', 'Postal code', 'Enter postal code', err) + '<label class="field"><span class="field-label is-m">Country</span><span class="field-control on-card is-select ic-caret-down"><select name="country"><option value="">Select country</option>' +
          ['United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Switzerland'].map(function (c) { return '<option' + (v.country === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></span></label></div>' +
        f('phone', 'Phone', 'Enter phone number', err) + UI.checkbox('isDefault', 'Set as default', v.isDefault) +
        '<div class="modal-actions" style="gap:12px"><button type="button" class="btn btn-secondary on-card btn-44 btn-13" data-act="close-modal">Cancel</button><button type="submit" class="btn btn-gold btn-44 btn-13">Save address</button></div></form>';
    }
    var m = UI.openModal(html(), { cls: '', top: true });
    m.style.background = 'var(--surface)'; m.style.border = '1px solid var(--border)'; m.style.borderRadius = '24px'; m.style.padding = '32px';
    F.address = function (form) {
      ['label', 'recipient', 'street', 'apt', 'city', 'region', 'zip', 'country', 'phone'].forEach(function (k) { v[k] = form[k].value.trim(); });
      v.isDefault = form.isDefault.checked;
      var err = {};
      if (!v.label) err.label = 'Please name this address';
      if (!v.recipient) err.recipient = 'Recipient is required';
      if (v.street.length < 3) err.street = 'Street address is required';
      if (!v.city) err.city = 'City is required';
      if (Object.keys(err).length) { m.innerHTML = html(err); return; }
      if (v.isDefault || !list.length) list.forEach(function (x) { x.isDefault = false; });
      if (!list.length) v.isDefault = true;
      if (a) list[index] = v; else list.push(v);
      M.save(); UI.closeModal(true);
      UI.toast({ type: 'success', title: a ? 'Address updated' : 'Address saved', sub: v.label + ' · ' + M.addressLine(v) });
      if (after) after(); else UI.rerender({ keepScroll: true });
    };
  };
  ACT['addr-add'] = function () { UI.addressModal(null); };
  ACT['addr-edit'] = function (el) { UI.addressModal(Number(el.dataset.i)); };
  ACT['addr-default'] = function (el) {
    var list = M.addresses(); list.forEach(function (x, i) { x.isDefault = i === Number(el.dataset.i); }); M.save(); UI.rerender({ keepScroll: true });
    UI.toast({ type: 'success', title: 'Default address updated', sub: list[Number(el.dataset.i)].label });
  };
  ACT['addr-del'] = function (el) {
    var list = M.addresses(), i = Number(el.dataset.i), a = list.splice(i, 1)[0];
    if (a.isDefault && list[0]) list[0].isDefault = true;
    M.save(); UI.rerender({ keepScroll: true });
    UI.toast({ type: 'info', title: 'Address deleted', sub: a.label + ' · ' + M.addressLine(a), action: 'Undo', onAction: function () { if (a.isDefault) list.forEach(function (x) { x.isDefault = false; }); list.splice(i, 0, a); M.save(); UI.rerenderIf('/account/addresses'); } });
  };

  /* favorites */
  P.favorites = function () {
    var list = M.S.favorites.map(M.product).filter(Boolean);
    if (!list.length) return cabinet('favorites', '<h1 class="t-hero">Favorites</h1><div class="fav-scent empty" style="padding:56px;gap:24px"><span class="empty-icon" style="width:96px;height:96px;background:var(--dark);color:var(--white)"><span class="ic ic-heart" style="width:40px;height:40px"></span></span><div class="col gap-12"><p class="t-section">No favorites yet</p><p class="t-body-s t-muted">Use the heart on a product to save it here.</p></div><a class="btn btn-gold btn-44 btn-13" href="#/c/candles">Explore the collection</a></div>');
    return cabinet('favorites', '<div class="col gap-4"><span class="t-caption t-muted">Saved selection · ' + list.length + ' items</span><h1 class="t-section">Favorites</h1></div><div class="fav-grid">' + list.map(function (p) { return UI.productCard(p, { home: true, add: true }); }).join('') + '</div>');
  };

  /* certificates */
  P.certificates = function () {
    var list = M.certificates();
    if (!list.length) return cabinet('certificates', '<div class="acc-card" style="padding:40px;gap:24px"><div class="col gap-12"><span class="t-overline t-primary">Gift certificates</span><h1 class="t-hero">Gift certificates</h1><p class="t-body-m t-muted">A thoughtful way to share MONRE scents and home essentials with friends and family.</p></div>' +
      '<div class="row" style="gap:24px"><div class="gc-motif"><div><div><span class="t-caption t-muted">Gift card</span><span class="t-logo">MONRE</span><span class="t-caption t-muted">Gift certificate</span></div></div></div>' +
      '<div class="col grow" style="gap:16px;align-items:flex-start"><p class="t-section">No gift certificates yet.</p><p class="t-body-m t-muted">Have a certificate? Add it with your code.</p><button class="btn btn-gold btn-13" style="height:48px" data-act="activate">Activate a certificate</button><a class="btn btn-secondary on-card btn-13" style="height:48px" href="#/info/gift-cards">Explore gift certificates</a></div></div></div>');
    return cabinet('certificates', '<div class="col gap-8"><h1 class="t-hero">Gift certificates</h1><p class="t-body-s t-muted">Manage your certificates and activate them for shopping.</p></div>' +
      '<div class="acc-card" style="gap:24px"><div class="col gap-4"><h2 class="t-section">Gift certificate' + (list.length > 1 ? 's' : '') + '</h2><span class="t-caption t-muted">' + list.length + ' saved certificate' + (list.length > 1 ? 's' : '') + '</span></div>' +
      list.map(function (c, i) {
        return '<div class="cert-preview"><div class="col grow" style="gap:12px"><span class="t-logo">MONRE</span><span class="t-stat">Value ' + M.money(c.amount) + '</span><span class="t-caption" style="color:var(--on-photo-muted)">Code ' + esc(c.code) + '</span><span class="t-caption" style="color:var(--on-photo-muted)">Valid until ' + esc(c.valid) + (c.to ? ' · for ' + esc(c.to) : '') + '</span></div>' +
          '<div class="col" style="gap:12px;width:220px"><a class="btn btn-surface btn-12" href="#/c/candles">Explore collection</a>' + (i === 0 ? '<button class="btn btn-gold btn-12" data-act="activate">Activate a certificate</button>' : '<button class="btn btn-outline on-dark btn-12" data-act="copy-code" data-code="' + esc(c.code) + '">Copy code</button>') + '</div></div>';
      }).join('') +
      '<div class="col gap-8"><span class="t-body-s-m">Add a certificate</span><p class="t-body-s t-muted">Have another certificate? Enter its code in the activation form.</p></div></div>');
  };
  ACT['copy-code'] = function (el) {
    try { navigator.clipboard.writeText(el.dataset.code); } catch (e) { /* clipboard unavailable */ }
    UI.toast({ type: 'success', title: 'Code copied', sub: el.dataset.code });
  };
  ACT.activate = function () {
    function html(err, val) {
      return UI.modalHead('Activate certificate') + '<p class="t-body-m t-2">Enter the code from your MONRE gift certificate. The balance will be added to your account.</p>' +
        '<form class="col gap-24" data-form="activate" novalidate>' + UI.field({ name: 'code', label: 'Certificate code', placeholder: 'MONRE-XXXX-XXXX', value: val, error: err, attrs: ' style="text-transform:uppercase"' }) +
        '<button class="btn btn-primary btn-block" type="submit">Activate</button></form>';
    }
    var m = UI.openModal(html());
    F.activate = function (form) {
      var code = form.code.value.trim().toUpperCase();
      if (code.replace(/[^A-Z0-9]/g, '').length < 6) { m.innerHTML = html('Code not found. Check it and try again.', code); return; }
      if (M.certificates().some(function (c) { return c.code === code; })) { m.innerHTML = html('This certificate is already in your account.', code); return; }
      var amount = /200/.test(code) ? 200 : /100/.test(code) ? 100 : 50;
      M.certificates().unshift({ code: code, amount: amount, valid: M.validTo(), from: 'activated' }); M.save();
      UI.closeModal(true); UI.rerender({ keepScroll: true });
      UI.toast({ type: 'success', title: 'Certificate activated', sub: M.money(amount) + ' added to your account' });
    };
  };

  /* logout */
  ACT.logout = function () {
    UI.closePopover();
    UI.openModal('<div class="row-between" style="padding:24px 32px"><h2 style="font-size:24px;font-weight:500;line-height:normal">Log out of MONRE?</h2><button class="close-btn" style="border:0;background:var(--card);width:32px;height:32px;border-radius:16px" data-act="close-modal" aria-label="Close">' + ic('x-line') + '</button></div>' +
      '<p class="t-body-m t-muted" style="padding:0 32px 32px">You can sign in again whenever you’re ready.</p>' +
      '<div class="row" style="gap:12px;padding:20px 32px 32px;border-top:1px solid var(--border)"><button class="btn btn-gold btn-44 btn-13 grow" style="color:var(--text);border-color:var(--border)" data-act="close-modal">Stay signed in</button><button class="btn btn-dark btn-44 btn-13 grow" style="color:var(--white)" data-act="logout-confirm">Log out</button></div>',
      { cls: 'is-480', noFocus: true });
    var m = UI.modalEl(); m.style.padding = '0'; m.style.gap = '0'; m.style.background = 'var(--surface)'; m.style.border = '1px solid var(--border)'; m.style.borderRadius = '24px';
  };
  ACT['logout-confirm'] = function () {
    var u = M.user();
    M.signOut(); UI.closeModal(true); UI.refreshChrome(); go('/');
    UI.toast({ type: 'info', title: 'You are signed out', sub: 'See you soon' + (u ? ', ' + u.name : '') + '.' });
  };
})();
