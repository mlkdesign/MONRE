/* MONRE — router, event delegation, delivery ticker, boot. */
(function () {
  var M = window.MONRE, UI = window.UI, ACT = UI.ACT, P = UI.PAGES, F = UI.FORMS;
  var $ = UI.$, $$ = UI.$$, go = UI.go, ic = UI.ic;
  UI.onInput = UI.onInput || [];

  /* ---------- routing ---------- */
  var ROUTES = [
    ['/', 'home', 'Home'],
    ['/index', 'index', 'Site map'],
    ['/catalog', 'categories', 'Catalog'],
    ['/c/:cat', 'catalog', 'Catalog'],
    ['/p/:id', 'product', 'Product'],
    ['/gifts', 'gifts', 'Gift Sets'],
    ['/search', 'search', 'Search'],
    ['/cart', 'cart', 'Cart'],
    ['/checkout', 'checkout', 'Checkout'],
    ['/order/:id', 'done', 'Order placed'],
    ['/auth/signin', 'signin', 'Sign in'],
    ['/auth/register', 'register', 'Register'],
    ['/auth/forgot', 'forgot', 'Reset password'],
    ['/auth/forgot/sent', 'forgotSent', 'Check your inbox'],
    ['/auth/reset', 'reset', 'Set new password'],
    ['/auth/reset/done', 'resetDone', 'Password updated'],
    ['/auth/verify', 'verify', 'Verify your email', 'auth'],
    ['/account', 'account', 'My account', 'auth'],
    ['/account/orders', 'orders', 'Orders & tracking', 'auth'],
    ['/account/orders/:id', 'orderDetails', 'Order details', 'auth'],
    ['/account/profile', 'profile', 'Profile', 'auth'],
    ['/account/profile/edit', 'profileEdit', 'Edit profile', 'auth'],
    ['/account/addresses', 'addresses', 'Delivery addresses', 'auth'],
    ['/account/favorites', 'favorites', 'Favorites', 'auth'],
    ['/account/certificates', 'certificates', 'Gift certificates', 'auth'],
    ['/info/story', 'story', 'Our Story'],
    ['/info/shipping', 'shipping', 'Shipping'],
    ['/info/returns', 'returns', 'Returns'],
    ['/info/faq', 'faq', 'FAQs'],
    ['/info/care', 'care', 'Care Instructions'],
    ['/info/contact', 'contact', 'Contact Us'],
    ['/info/contact/sent', 'contactSent', 'Message sent'],
    ['/info/gift-cards', 'giftCards', 'Gift Cards'],
    ['/info/privacy', 'privacy', 'Privacy Policy'],
    ['/info/terms', 'terms', 'Terms of Service'],
    ['/500', 'serverError', 'Something went wrong']
  ];
  var current = { path: '/', name: 'home', params: {}, q: {}, fresh: true };

  function parse() {
    var h = location.hash.replace(/^#/, '') || '/';
    var qi = h.indexOf('?'), path = qi >= 0 ? h.slice(0, qi) : h, qs = qi >= 0 ? h.slice(qi + 1) : '';
    if (path.length > 1) path = path.replace(/\/+$/, '');
    var q = {};
    qs.split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || '').replace(/\+/g, ' ')); });
    for (var i = 0; i < ROUTES.length; i++) {
      var r = ROUTES[i], pa = r[0].split('/'), pb = path.split('/');
      if (pa.length !== pb.length) continue;
      var params = {}, ok = true;
      for (var j = 0; j < pa.length; j++) {
        if (pa[j].charAt(0) === ':') params[pa[j].slice(1)] = decodeURIComponent(pb[j]);
        else if (pa[j] !== pb[j]) { ok = false; break; }
      }
      if (ok) return { path: path, name: r[1], title: r[2], auth: r[3] === 'auth', params: params, q: q };
    }
    return { path: path, name: 'notFound', title: 'Page not found', params: {}, q: q };
  }
  UI.route = function () { return current; };
  UI.setQuery = function (q, silent) {
    var qs = Object.keys(q).filter(function (k) { return q[k] !== undefined && q[k] !== ''; }).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(q[k]); }).join('&');
    var h = '#' + current.path + (qs ? '?' + qs : '');
    if (silent) { history.replaceState(null, '', h); current.q = q; return; }
    keepNext = true; location.hash = h;
  };

  var keepNext = false;
  function render(fresh) {
    UI.cleanup.splice(0).forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } });
    var r = parse();
    r.fresh = fresh;
    if (r.auth && !M.user()) { location.replace('#/auth/signin?next=' + encodeURIComponent(r.path)); return; }
    current = r;
    var fn = P[r.name] || P.notFound;
    var y = window.scrollY;
    var html;
    try { html = fn(r.params, r.q); }
    catch (err) { console.error(err); html = P.serverError(); }
    $('#app').innerHTML = html;
    document.title = (r.name === 'home' ? 'MONRE — Home fragrance & décor' : (r.title || 'MONRE') + ' — MONRE');
    if (fresh && !keepNext) window.scrollTo(0, 0); else window.scrollTo(0, y);
    keepNext = false;
    UI.mount.forEach(function (m) { try { m(r); } catch (e) { console.error(e); } });
    if (fresh && r.q.open) openFromQuery(r);
  }
  UI.rerender = function () { render(false); };
  UI.rerenderIf = function (prefix) { if (current.path.indexOf(prefix) === 0) render(false); };

  window.addEventListener('hashchange', function () {
    UI.closeOverlays(); UI.closeModal(true);
    render(true);
  });

  /* deep links used by the site map: ?open=… */
  function openFromQuery(r) {
    var o = r.q.open, q = Object.assign({}, r.q);
    delete q.open; UI.setQuery(q, true);
    setTimeout(function () {
      var btn = function (a) { return $('[data-act="' + a + '"]'); };
      switch (o) {
        case 'mega': case 'lang': case 'currency': case 'user': case 'sort': ACT[o](btn(o)); break;
        case 'search': ACT.search(); break;
        case 'minicart': ACT.minicart(); break;
        case 'notify': ACT.notify({ dataset: { id: r.params.id } }); break;
        case 'lightbox': ACT.lightbox(); break;
        case 'review': ACT['write-review'](); break;
        case 'reviews': ACT['all-reviews'](); setTimeout(function () { var el = $('#reviews'); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 100); }, 0); break;
        case 'builder': case 'certificate': case 'corporate': case 'activate': case 'logout': ACT[o](); break;
        case 'address': ACT['addr-add'](); break;
        case 'newsletter': var f = $('[data-form=newsletter] input[name=email]'); if (f) { f.scrollIntoView({ block: 'center' }); f.focus(); } break;
      }
    }, 30);
  }

  /* ---------- delegated events ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) {
      var a = e.target.closest('a[href^="#"]');
      if (a && a.getAttribute('href') === location.hash) { e.preventDefault(); UI.closeOverlays(); UI.closeModal(true); render(true); }
      return;
    }
    var fn = ACT[el.dataset.act];
    if (!fn) return;
    if (el.tagName === 'BUTTON') e.preventDefault();
    if (el.disabled) return;
    fn(el, e);
  });
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    var fn = F[f.dataset.form];
    if (fn) fn(f, e);
  });
  document.addEventListener('change', function (e) {
    if (e.target.matches && e.target.matches('input[data-upload]') && UI.onUpload) UI.onUpload(e.target);
    UI.onChange.forEach(function (fn) { fn(e); });
  });
  UI.updateCounter = function (t) {
    if (!t) return;
    var c = t.parentElement.querySelector('.textarea-count');
    if (c) c.textContent = t.value.length + ' / 500';
  };
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches('textarea[data-counter]')) UI.updateCounter(t);
    if (t.dataset.fmt === 'card') {
      var d = t.value.replace(/\D/g, '').slice(0, 19);
      t.value = d.replace(/(.{4})/g, '$1 ').trim();
    }
    if (t.dataset.fmt === 'exp') {
      var x = t.value.replace(/\D/g, '').slice(0, 4);
      t.value = x.length > 2 ? x.slice(0, 2) + ' / ' + x.slice(2) : x;
    }
    var field = t.closest('.field.is-error');
    if (field) { field.classList.remove('is-error'); var er = field.querySelector('.field-error'); if (er) er.remove(); }
    var fe = t.closest('.footer-email.is-error'); if (fe) fe.classList.remove('is-error');
    UI.onInput.forEach(function (fn) { fn(e); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (UI.modalEl()) UI.closeModal();
      else UI.closeOverlays();
    }
    if (UI.modalEl() && UI.modalEl().classList.contains('lightbox') && UI.lbKeys) UI.lbKeys(e);
  });
  window.addEventListener('resize', function () { UI.placeToasts(); });
  window.addEventListener('scroll', function () { var s = $('.mega-scrim'); if (s) s.style.top = $('#header').getBoundingClientRect().bottom + 'px'; }, { passive: true });

  /* newsletter */
  F.newsletter = function (form) {
    var email = form.email.value.trim(), agree = form.agree.checked;
    var bad = !M.isEmail(email);
    form.querySelector('.footer-email').classList.toggle('is-error', bad);
    form.querySelector('.footer-check').classList.toggle('is-error', !agree);
    if (bad || !agree) {
      UI.toast({ type: 'error', title: 'Something went wrong', sub: bad ? 'Please enter a valid email address.' : 'Please accept the Privacy Policy to subscribe.', action: 'Retry', onAction: function () { (bad ? form.email : form.agree).focus(); } });
      return;
    }
    form.reset();
    UI.toast({ type: 'success', title: 'You’re subscribed', sub: 'Welcome gift is on its way to ' + email });
  };

  /* ---------- delivery simulation ticker ---------- */
  var MSG = {
    packed: ['info', 'Order #{id} · Packed', 'Your items are wrapped and ready to ship.'],
    transit: ['info', 'Order #{id} · In transit', 'The courier is on the way to you.'],
    delivered: ['success', 'Order #{id} delivered', 'Enjoy your MONRE ritual! +{b} bonuses credited.']
  };
  function tick() {
    var changes = M.tick();
    changes.forEach(function (c) {
      var m = MSG[c.stage.id]; if (!m) return;
      var o = c.order;
      UI.toast({ type: m[0], title: m[1].replace('{id}', o.id), sub: m[2].replace('{b}', o.bonusesEarned || 0), action: 'Track', actionTone: 'brown', timeout: 6000,
        onAction: function () { go(M.user() && M.user().email === o.email ? '/account/orders/' + o.id : '/order/' + o.id); } });
    });
    if (changes.length) {
      if (/^\/(account|order)/.test(current.path)) render(false);
      if (UI.liveModal) UI.liveModal();
    }
    $$('[data-eta]').forEach(function (el) {
      var o = M.order(el.dataset.eta); if (!o) return;
      var s = Math.ceil(M.etaMs(o) / 1000);
      el.textContent = '0:' + String(s).padStart(2, '0');
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    M.tick(); // sync statuses of orders that progressed while the tab was closed
    UI.renderHeader();
    UI.renderFooter();
    render(true);
    UI.placeToasts();
    setInterval(tick, 1000);
    if (!M.S.cookie) setTimeout(UI.cookieBanner, 900);
  }
  boot();
})();
