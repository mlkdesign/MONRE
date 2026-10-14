/* MONRE — info pages, system pages and the prototype site map. */
(function () {
  var M = window.MONRE, D = window.MONRE_DATA, UI = window.UI, ACT = UI.ACT;
  var esc = UI.esc, ic = UI.ic, $ = UI.$, go = UI.go;
  var P = UI.PAGES, F = UI.FORMS;

  function wrap(inner) { return '<div class="container info-page">' + inner + '</div>'; }
  function head(title, sub, crumbs) {
    return (crumbs ? '<nav class="breadcrumbs">' + crumbs + '</nav>' : '') + '<div class="col gap-8"><h1 class="t-hero">' + title + '</h1>' + (sub ? '<p class="t-body-m t-muted">' + sub + '</p>' : '') + '</div>';
  }
  var supportCrumbs = function (name) { return '<a href="#/">Home</a>' + ic('caret-right') + '<a href="#/info/faq">Support</a>' + ic('caret-right') + '<span class="is-current">' + name + '</span>'; };

  /* Our story */
  P.story = function () {
    function ed(t, text, chips) { return '<div class="ed-card"><p class="t-section">' + t + '</p><p class="t-body-m t-muted">' + text + '</p><div class="chips">' + chips.map(function (c) { return '<span class="chip is-tag">' + c + '</span>'; }).join('') + '</div></div>'; }
    return wrap('<div class="info-hero"><div class="col" style="width:560px;flex:none;gap:24px"><div class="row gap-8"><span class="chip is-tag">HOME. SCENT. SOUL.</span><span class="chip is-tag">LIFESTYLE</span></div>' +
        '<h1 class="t-hero">Our Story</h1><p class="t-body-l t-muted">MONRE is a home decor and lifestyle brand shaped by a simple idea: a beautiful home is not just a space, but a feeling. Scent, thoughtful objects and everyday rituals bring warmth and personality to the places we call our own.</p>' +
        '<div class="row gap-16"><a class="btn btn-primary btn-13 is-white" href="#/c/candles">Continue</a><a class="btn btn-outline btn-13" style="background:var(--surface)" href="#/c/candles?sort=new">Explore New In' + ic('caret-right') + '</a></div></div>' +
        '<div class="col grow gap-12"><div class="story-img"><img src="' + D.IMG.arch2 + '" alt="" style="object-position:50% 70%"><div class="story-overlay"><p class="t-section">Spaces that feel personal</p><p class="t-body-s t-muted" style="width:320px">We curate objects that help you create a home that feels calm, intentional, and yours.</p></div></div>' +
        '<div class="row-between t-caption t-muted"><span>Home Decor &amp; Lifestyle</span><span>Curated for everyday rituals</span></div></div></div>' +
      '<div class="ed-row">' + ed('Home', 'A home is where life happens. A familiar object, a favourite corner and a considered detail can make a room feel more personal. MONRE brings home decor and lifestyle into those everyday moments.', ['Intentional', 'Personal', 'Everyday']) +
        ed('Scent', 'Scent adds another layer to a room. A familiar fragrance can become part of a quiet morning or an evening at home. We see it as an invitation to pause and enjoy the atmosphere around you.', ['Atmosphere', 'Warmth', 'Presence']) +
        ed('Soul', 'Soul is what happens when a home feels alive. It is the way light falls, the way textures mix, and the way rituals become part of your day. We curate objects that help you build a home that feels like the best version of yourself.', ['Rituals', 'Texture', 'Light']) + '</div>' +
      '<div class="box is-32" style="gap:24px"><p class="t-section">Our Philosophy</p><p class="t-body-l t-muted">We believe that the best homes are the ones that feel lived in. We do not chase trends; we curate objects that help you build a life you want to return to. For us, home is not just a place — it is a state of mind.</p></div>');
  };

  /* Shipping */
  P.shipping = function () {
    var rows = [['Free shipping threshold', 'Orders over ' + M.money(75), 1], ['Shipping regions', '[Shipping regions – to be confirmed]'], ['Rates for orders of ' + M.money(75) + ' or less', '[Rates for orders of $75 or less – to be confirmed]'], ['Processing times', '[Processing times – to be confirmed]'], ['Transit times', '[Transit times – to be confirmed]'], ['Carrier & tracking', '[Carrier and tracking – to be confirmed]'], ['Free-shipping scope', '[Free-shipping scope – to be confirmed]']];
    return wrap(head('Shipping', 'Everything about delivery, timelines, and tracking your order.', supportCrumbs('Shipping')) +
      '<div class="box is-32" style="flex-direction:row;align-items:center;gap:24px;padding:24px"><div class="col grow gap-12"><span class="pending" style="align-self:flex-start;background:var(--gold);text-transform:none;letter-spacing:0;font-weight:400">Confirmed policy</span><p class="t-section">Free shipping on orders over ' + M.money(75) + '</p><p class="t-body-s t-muted">Free shipping applies to orders over ' + M.money(75) + '. Other delivery details are pending confirmation.</p></div>' +
        '<img src="' + D.IMG.candle + '" alt="" style="width:360px;height:130px;object-fit:cover;border-radius:16px"></div>' +
      '<div class="col gap-12"><h2 class="t-section">Shipping overview</h2><div class="table">' + rows.map(function (r) { return '<div' + (r[2] ? ' class="is-strong"' : '') + '><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>'; }).join('') + '</div></div>' +
      helpBox());
  };
  function helpBox() {
    return '<form class="box is-32" style="flex-direction:row;align-items:center;gap:24px" data-form="help" novalidate><div class="col grow gap-8"><p class="t-section">Need help with your order?</p><p class="t-body-s t-muted">Our team can help with questions about delivery, tracking, and order status.</p></div>' +
      '<div style="width:220px">' + UI.field({ name: 'email', label: 'Your email', placeholder: 'you@example.com', type: 'email', value: M.user() ? M.user().email : '' }) + '</div><button class="btn btn-primary btn-m btn-13 is-white" type="submit" style="align-self:flex-end">Contact support</button></form>';
  }
  F.help = function (form) {
    var v = form.email.value.trim(), f = form.querySelector('.field');
    if (!M.isEmail(v)) { f.classList.add('is-error'); UI.toast({ type: 'error', title: 'Please enter a valid email', sub: 'We need it to reply to you.' }); return; }
    f.classList.remove('is-error'); go('/info/contact?email=' + encodeURIComponent(v));
  };

  /* Returns */
  P.returns = function () {
    function c(t, s) { return '<div class="box" style="padding:12px 14px;border-radius:20px;gap:6px">' + (t ? '<span class="t-caption">' + t + '</span>' : '') + '<span class="t-caption t-muted">' + s + '</span></div>'; }
    return wrap(head('Returns', 'For questions about returning an item, contact MONRE with your order reference, item details and reason for your enquiry. Policy details below require confirmation before publication.') +
      '<div class="box" style="flex-direction:row;justify-content:space-between;align-items:center;border-radius:20px"><p class="t-section" style="font-size:22px">Policy details pending confirmation</p><span class="chip is-tag" style="border:0;background:var(--card)">Pending confirmation</span></div>' +
      '<h2 class="t-section" style="font-size:22px">Pending policy details</h2><div class="grid-2">' + c('Eligibility', '[Eligibility and exclusions – to be confirmed]') + c('', '[Return window – to be confirmed]') + c('', '[Return process and address – to be confirmed]') + c('', '[Return shipping costs – to be confirmed]') + c('', '[Refund method and timing – to be confirmed]') + c('', '[Exchange policy – to be confirmed]') + '</div>' +
      '<h2 class="t-section" style="font-size:22px">Damaged or incorrect item enquiries</h2><div class="grid-2">' + c('Damaged item', 'Contact MONRE with your order reference, a description of the damage and photos of the affected item.') + c('Incorrect item', 'Include your order reference and the name of the item received when contacting MONRE about an incorrect item.') + '</div>' +
      '<div class="box is-32" style="padding:24px"><p class="t-section" style="font-size:22px">Contact us about a return</p><a class="btn btn-primary btn-m btn-13 is-white" style="align-self:flex-start" href="#/info/contact?topic=Returns">Contact MONRE</a></div>');
  };

  /* FAQ */
  var FAQ = [
    ['Choosing for your home', 'Find the right fit by room, mood, and personal taste.', [['How do I choose a scent that fits my home?', 'Begin with the notes you enjoy and the atmosphere you want to create. Use the fragrance descriptions on the product page to guide your choice.'], ['What should I check before choosing a product?', 'Review the dimensions, materials and usage information for the specific item. Compare those details with your space and preferences.'], ['How do I match decor with product dimensions and materials?', 'Check the product page for dimensions, material notes, and lifestyle imagery. Compare the size and finish against your surfaces, shelves, and existing decor to find a piece that feels balanced and intentional.']]],
    ['Orders & delivery', 'Shipping, locations, and order details.', [['Is shipping free on orders over $75?', 'Yes. Orders over $75 qualify for free shipping as shown in the topbar.'], ['Where do you deliver and how long does it take?', 'Delivery regions, rates and timing are pending confirmation. In this prototype every order is delivered in about 30 seconds — follow it in your account.'], ['What should I know about returns?', 'Return conditions are pending confirmation. The draft Returns page identifies the policy details still needed; contact MONRE with your order reference for an enquiry.']]],
    ['Gifts & care', 'Gift certificates, care, and helpful next steps.', [['What gift certificate denominations are available?', 'Gift certificate options include $50, $100, and $200. Validity and delivery conditions are pending final confirmation.'], ['How should I care for my MONRE products?', 'Follow the care instructions supplied with your product or on the product page. This ensures the best experience for the specific item you have purchased.'], ['Where can I get help with my order or a question?', 'Visit the Contact Us page for the best way to reach our team.']]]
  ];
  var faqOpen = { '0-0': 1, '0-1': 1, '0-2': 1, '1-0': 1, '1-1': 1, '1-2': 1, '2-0': 1, '2-1': 1, '2-2': 1 };
  P.faq = function () {
    return wrap(head('FAQs', 'Practical answers about choosing scents, placing orders, gifts, and caring for your MONRE pieces.') +
      '<div class="grid-3i" style="align-items:start">' + FAQ.map(function (col, i) {
        return '<div class="faq-col"><div class="col gap-4" style="padding:0 0 4px"><h2 class="t-section" style="font-size:22px">' + col[0] + '</h2><span class="t-caption t-muted">' + col[1] + '</span></div>' +
          col[2].map(function (q, j) {
            var k = i + '-' + j, open = faqOpen[k];
            return '<button class="faq-q' + (open ? ' is-open' : '') + '" data-act="faq" data-k="' + k + '" aria-expanded="' + !!open + '"><b>' + esc(q[0].replace('$75', M.money(75))) + ic(open ? 'minus' : 'plus') + '</b><span>' + esc(q[1].replace('$75', M.money(75))) + '</span></button>';
          }).join('') + '</div>';
      }).join('') + '</div>');
  };
  ACT.faq = function (el) { faqOpen[el.dataset.k] = !faqOpen[el.dataset.k]; UI.rerender({ keepScroll: true }); };

  /* Care */
  P.care = function () {
    function c(t, s) { return '<div class="box" style="padding:14px 16px;border-radius:14px;gap:8px"><span class="t-caption" style="font-weight:500">' + t + '</span><span class="t-caption t-muted">' + s + '</span></div>'; }
    return wrap(head('Care Instructions', 'Follow the supplied label and product-specific instructions for each MONRE object. This page provides general guidance by category and conservative handling reminders.') +
      '<h2 class="t-section" style="font-size:22px">Category Guidance</h2><div class="grid-4">' + c('Candles', 'Place a candle on a stable, heat-resistant surface. Keep a burning candle in sight and away from flammable objects. Follow its label.') + c('Diffusers &amp; Room Sprays', 'Use on stable surfaces and avoid spraying onto skin, food, or electrical components. Refer to the product label for usage.') + c('Decor &amp; Furniture', 'Handle with care and avoid placing heavy objects on delicate surfaces. Dust gently and avoid harsh cleaning products.') + c('Lighting', 'Keep lamps away from water and heat sources. Use only as directed and avoid touching electrical components.') + '</div>' +
      '<h2 class="t-section" style="font-size:22px">General Handling &amp; Safety</h2><div class="grid-2">' + c('Handling', 'Lift objects carefully and avoid sudden impacts. Keep out of reach of children and pets.') + c('Safety', 'Never leave a burning candle unattended. Keep fragrance products away from children, pets and food. Follow all product warnings.') + '</div>' +
      '<h2 class="t-section" style="font-size:22px">Missing Details &amp; Support</h2><div class="grid-3i">' + c('Product-specific care and safety instructions', '[Product-specific care and safety instructions – to be confirmed]') + c('Material and electrical specifications', '[Material and electrical specifications – to be confirmed]') +
        '<div class="box" style="padding:14px 16px;border-radius:14px;gap:8px"><span class="t-caption" style="font-weight:500">Need help?</span><span class="t-caption t-muted">If instructions are unclear, contact our customer care team for guidance on the specific product you own.</span><a class="section-link t-caption" style="font-size:12px" href="#/info/contact">Contact Us' + ic('caret-right') + '</a></div></div>');
  };

  /* Contact */
  var CT = { err: {}, v: {} };
  P.contact = function (params, q) {
    var u = M.user();
    if (UI.route().fresh) CT = { err: {}, v: { name: u ? (u.name + ' ' + (u.lastName || '')).trim() : '', email: q.email || (u ? u.email : ''), topic: q.topic || (q.order ? 'Order status' : ''), order: q.order ? '#' + q.order : '', msg: '' } };
    var e = CT.err, v = CT.v;
    return wrap(head('Contact Us', 'Reach the MONRE team for order questions, product guidance, or general inquiries.') +
      '<div class="row" style="gap:24px;align-items:flex-start"><form class="box is-32 grow" style="padding:24px;gap:16px" data-form="contact" novalidate><div class="col gap-8"><h2 class="t-section">Send a message</h2><p class="t-body-s t-muted">Choose a topic and include the details relevant to your question.</p></div>' +
        (Object.keys(e).length ? UI.notice('error', Object.keys(e).length + ' fields need your attention', 'Please check highlighted fields.') : '') +
        '<div class="two" style="gap:12px">' + UI.field({ name: 'name', label: 'Name *', placeholder: 'Full name', value: v.name, error: e.name }) + UI.field({ name: 'email', label: 'Email *', placeholder: 'you@example.com', type: 'email', value: v.email, error: e.email }) + '</div>' +
        '<div class="two" style="gap:12px"><label class="field' + (e.topic ? ' is-error' : '') + '"><span class="field-label">Topic *</span><span class="field-control is-select ic-caret-down"><select name="topic"><option value="">Choose a topic</option>' +
          ['Order status', 'Product advice', 'Returns', 'Gift sets', 'General inquiry'].map(function (t) { return '<option' + (v.topic === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></span>' + (e.topic ? '<span class="field-error">' + e.topic + '</span>' : '') + '</label>' +
          UI.field({ name: 'order', label: 'Order number (optional)', placeholder: '#2482', value: v.order }) + '</div>' +
        UI.textarea({ name: 'msg', label: 'Message *', placeholder: 'Tell us how we can help.', value: v.msg, error: e.msg, height: 110 }) +
        '<div class="row-between" style="gap:24px"><p class="t-caption t-muted" style="max-width:300px">See the <a class="link-u" href="#/info/privacy">Privacy Policy</a> for information about personal data. Draft policy pending legal review.</p><button class="btn btn-primary btn-m btn-13 is-white" type="submit">Send message</button></div></form>' +
        '<div class="col" style="width:350px;flex:none;gap:16px"><div class="box is-32" style="padding:16px 18px;border-radius:24px;gap:12px"><h2 class="t-section" style="font-size:22px">Quick questions</h2><p class="t-body-s t-muted">Start with the topic that best matches your inquiry.</p>' +
          '<div class="chips-wrap">' + ['Order status', 'Product advice', 'Returns', 'Gift sets', 'General inquiry'].map(function (t) { return '<button class="chip is-tag' + (v.topic === t ? ' is-active' : '') + '" data-act="ct-topic" data-v="' + t + '">' + t + '</button>'; }).join('') + '</div>' +
          '<ol class="col gap-12 t-caption">' + ['Include your order number if you are writing about a purchase.', 'Tell us which product or collection you are interested in.', 'Share any details that help us give you the most accurate response.'].map(function (t, i) { return '<li class="row gap-12" style="align-items:flex-start"><span class="step-circle" style="width:20px;height:20px;font-size:10px;color:var(--text);border:1px solid var(--border)">' + (i + 1) + '</span><span>' + t + '</span></li>'; }).join('') + '</ol></div>' +
          '<div class="box is-32" style="padding:16px 18px;border-radius:24px;gap:12px"><h2 class="t-section" style="font-size:22px">Contact details</h2><div class="row gap-12 t-caption"><span class="step-circle" style="border:1px solid var(--border);color:var(--text)">' + ic('info') + '</span>hello@monre.com</div><p class="t-caption t-muted">Contact email is pending confirmation before publication.</p></div></div></div>');
  };
  function ctRead() { var f = $('[data-form=contact]'); if (!f) return; ['name', 'email', 'topic', 'order', 'msg'].forEach(function (k) { CT.v[k] = f[k].value; }); }
  ACT['ct-topic'] = function (el) { ctRead(); CT.v.topic = el.dataset.v; delete CT.err.topic; UI.rerender({ keepScroll: true }); };
  F.contact = function () {
    ctRead(); var v = CT.v, e = {};
    if (!v.name.trim()) e.name = 'Please enter your name';
    if (!M.isEmail(v.email)) e.email = 'Please enter a valid email';
    if (!v.topic) e.topic = 'Please choose a topic';
    if (v.msg.trim().length < 10) e.msg = 'Please write at least 10 characters';
    CT.err = e;
    if (Object.keys(e).length) { UI.rerender({ keepScroll: true }); UI.toast({ type: 'error', title: Object.keys(e).length + ' fields need your attention', sub: 'Please check highlighted fields.' }); return; }
    go('/info/contact/sent');
  };
  P.contactSent = function () {
    return wrap('<div class="col" style="align-items:center;gap:16px;text-align:center;padding-top:24px"><span class="sys-pill" style="color:var(--primary);font-weight:500">Success</span><h1 class="t-hero">Your message has been sent</h1><p class="t-body-m t-muted">Thank you for getting in touch with MONRE. We usually reply within one business day.</p></div>' +
      '<h2 class="t-section">Need anything else?</h2><div class="grid-2" style="gap:16px"><div class="box" style="border-radius:16px;gap:8px"><b style="font-weight:500" class="t-body-s">Add a detail to your enquiry</b><span class="t-caption t-muted">Use Send another message if you would like to add information to your enquiry.</span></div><div class="box" style="border-radius:16px;gap:8px"><b style="font-weight:500" class="t-body-s">Explore MONRE</b><span class="t-caption t-muted">Continue browsing home fragrances, decor and everyday objects.</span></div></div>' +
      '<div class="row" style="justify-content:center;gap:16px"><a class="btn btn-primary btn-m btn-13 is-white" href="#/c/candles">Continue shopping</a><a class="btn btn-outline btn-m btn-13" style="background:var(--card)" href="#/info/contact">Send another message' + ic('caret-right') + '</a></div>');
  };

  /* Gift cards */
  var GC = { design: 0, amount: 100, err: {} };
  P.giftCards = function () {
    var designs = [['First Impression', 'var(--topbar)'], ['Warm Home', 'var(--primary)'], ['Grand', 'var(--topbar)']];
    return wrap(head('Gift Cards', 'A thoughtful gift of choice. Explore three certificate designs and the existing ' + M.money(50) + ', ' + M.money(100) + ' and ' + M.money(200) + ' denominations.') +
      '<div class="gcards">' + designs.map(function (d, i) { return '<button class="gcard' + (GC.design === i ? ' is-active' : '') + '" style="background:' + d[1] + '" data-act="gc-design" data-i="' + i + '" aria-pressed="' + (GC.design === i) + '"><span class="lbl">MONRE GIFT CARD</span><span class="t-section" style="font-size:24px">' + d[0] + '</span><span class="t-caption">HOME. SCENT. SOUL.</span><small>Design 0' + (i + 1) + ' – ' + d[0] + '</small></button>'; }).join('') + '</div>' +
      '<div class="row" style="gap:20px;align-items:stretch"><div class="box is-32" style="width:360px;flex:none;padding:24px;gap:12px"><p class="t-section" style="font-size:24px">Select amount</p><p class="t-body-s t-muted">Existing certificate denominations: ' + M.money(50) + ', ' + M.money(100) + ' and ' + M.money(200) + '. Choose an amount separately from the design.</p>' +
        '<div class="value-chips">' + [50, 100, 200].map(function (a) { return '<button class="' + (GC.amount === a ? 'is-active' : '') + '" data-act="gc-amount" data-a="' + a + '">' + M.money(a) + '</button>'; }).join('') + '</div><p class="t-caption t-muted">[Amount availability by design – to be confirmed]</p></div>' +
        '<form class="box is-32 grow" style="padding:24px;gap:16px" data-form="giftcard" novalidate><p class="t-section" style="font-size:24px">Customize your gift</p><p class="t-body-s t-muted">Add a personal touch before continuing to the next step.</p>' +
          '<div class="three" style="gap:12px">' + UI.field({ name: 'from', label: 'From', placeholder: 'Your name', value: M.user() ? M.user().name : '', error: GC.err.from }) + UI.field({ name: 'to', label: 'To (email)', placeholder: 'recipient@email.com', type: 'email', error: GC.err.to }) + UI.field({ name: 'msg', label: 'Message', placeholder: 'A short note' }) + '</div>' +
          '<div class="row gap-16"><button class="btn btn-primary btn-m btn-13 is-white" type="submit">Continue · ' + M.money(GC.amount) + '</button><span class="t-caption t-muted">Delivery conditions require confirmation before publication.</span></div></form></div>' +
      '<h2 class="t-section">Pending conditions</h2><div class="grid-3i">' + ['[Delivery format and timing – to be confirmed]', '[Validity and redemption rules – to be confirmed]', '[Gift card refund and balance rules – to be confirmed]'].map(function (t) { return '<div class="box" style="border-radius:14px;padding:12px;font-size:12px;color:var(--muted)">' + t + '</div>'; }).join('') + '</div>');
  };
  ACT['gc-design'] = function (el) { GC.design = Number(el.dataset.i); UI.rerender({ keepScroll: true }); };
  ACT['gc-amount'] = function (el) { GC.amount = Number(el.dataset.a); UI.rerender({ keepScroll: true }); };
  F.giftcard = function (form) {
    var from = form.from.value.trim(), to = form.to.value.trim(), msg = form.msg.value.trim();
    GC.err = {};
    if (!from) GC.err.from = 'Please add your name';
    if (!M.isEmail(to)) GC.err.to = 'Please enter a valid email';
    if (Object.keys(GC.err).length) { UI.rerender({ keepScroll: true }); var f = $('[data-form=giftcard]'); f.from.value = from; f.to.value = to; f.msg.value = msg; return; }
    M.addLine({ key: 'c:' + Date.now(), kind: 'cert', id: 'certificate', amount: GC.amount, to: to, name: 'Gift certificate ' + M.money(GC.amount), short: 'Gift certificate', meta: ['First Impression', 'Warm Home', 'Grand'][GC.design] + ' design · for ' + to, price: GC.amount, img: D.IMG.giftbox, catLabel: 'GIFT CERTIFICATES' });
    GC.err = {}; UI.addedToast('Certificate added to cart', M.money(GC.amount) + ' · for ' + to);
  };

  /* Privacy & Terms */
  function legal(title, sub, overview, items) {
    return wrap('<div class="draft-bar"><span class="pending">Draft – for legal review</span>Not approved for publication. The sections below identify information requiring legal review.</div>' +
      head(title, sub) +
      '<div class="col gap-12"><h2 class="t-category" style="font-size:20px">1. ' + overview[0] + '</h2><div class="box" style="flex-direction:row;border-radius:14px;padding:12px 16px">' + overview[1].map(function (o) { return '<div class="col grow gap-4"><b class="t-caption" style="font-weight:500">' + o[0] + '</b><span class="t-caption t-muted">' + o[1] + '</span></div>'; }).join('') + '</div></div>' +
      '<div class="legal-grid">' + items.map(function (it, i) { return '<div class="item"><h3 class="t-category" style="font-size:18px">' + (i + 2) + '. ' + it + '</h3><div class="ph">[' + it.replace(/&/g, 'and') + ' – pending legal review]</div></div>'; }).join('') + '</div>');
  }
  P.privacy = function () {
    return legal('Privacy Policy', 'Draft document for internal review. This page outlines placeholders for legal review and does not represent final company commitments or operational practices.',
      ['Document Overview', [['Legal Entity / Data Controller', '[Legal entity and data controller – pending legal review]'], ['Privacy Contact', '[Privacy contact – to be confirmed]'], ['Effective Date', '[Effective date – pending legal review]']]],
      ['Data Categories & Sources', 'Processing Purposes & Legal Bases', 'Cookies & Consent Tools', 'Recipients & Service Providers', 'International Transfers', 'Retention Periods', 'Security Measures', 'Applicable Privacy Rights & Request Process', 'Children’s Privacy & Age', 'Policy Updates & Notification']);
  };
  P.terms = function () {
    return legal('Terms of Service', 'Draft terms for using MONRE and purchasing products. This document is for internal review only and should not be published until all pending fields are confirmed.',
      ['Legal Entity & Contact', [['Legal entity', '[Legal entity name – pending legal review]'], ['Website', '[Website URL – to be confirmed]'], ['Contact email', '[Contact email – pending legal review]'], ['Effective date', '[Effective date – pending legal review]']]],
      ['Website Use & Acceptable Conduct', 'Order Acceptance & Contract Formation', 'Prices, Taxes & Payment', 'Shipping', 'Returns, Refunds & Cancellations', 'Gift Cards & Promotions', 'Product Information & Warranties', 'Intellectual Property', 'Liability & Statutory Rights', 'Governing Law & Disputes', 'Changes to Terms']);
  };

  /* =================== SYSTEM =================== */
  P.notFound = function () {
    return '<div class="container"><div class="sys"><div class="col" style="align-items:center;gap:16px;text-align:center"><span class="sys-pill">Page not found</span><span class="sys-code">404</span><h1 class="t-section">This page is not here</h1><p class="t-body-s t-muted">We could not find the page at this address.</p>' +
      '<div class="row gap-12"><a class="btn btn-primary btn-m btn-12 is-white" style="width:160px;font-weight:400" href="#/">Back to home</a><a class="btn btn-outline btn-m btn-12" style="font-weight:400;background:var(--card)" href="#/catalog">Browse catalogue</a></div><p class="t-caption t-muted">Double-check the URL or try one of the options above.</p></div></div></div>';
  };
  P.serverError = function () {
    return '<div class="container"><div class="sys"><div class="sys-card"><span class="sys-code" style="font-size:60px">500</span><h1 class="t-section">We could not load this page</h1><p class="t-body-s t-muted">Something went wrong. Try again, or return to the home page.</p>' +
      '<div class="row gap-12"><button class="btn btn-primary btn-m btn-12 is-white" style="width:160px;font-weight:400" data-act="retry-500">Try again</button><a class="btn btn-secondary btn-m btn-12" style="font-weight:400;background:var(--border)" href="#/">Back to home</a></div>' +
      '<div class="guidance"><span class="t-overline t-muted" style="font-size:10px">Helpful guidance</span><span class="t-caption t-muted">If the issue continues, return to the home page and try navigating to the page again.</span></div></div></div></div>';
  };
  ACT['retry-500'] = function (el) { el.innerHTML = ic('spinner') + 'Retrying…'; el.classList.add('is-loading'); setTimeout(function () { go('/'); UI.toast({ type: 'success', title: 'Back online', sub: 'The page loaded successfully.' }); }, 1000); };
  P.nothingFound = function (q) {
    return '<div class="container"><div class="sys"><form class="sys-card" style="width:528px;align-items:stretch" data-form="search-page" novalidate><span class="empty-icon" style="align-self:center;width:34px;height:34px;background:var(--border)">' + ic('search') + '</span>' +
      '<h1 class="t-section">No results for ' + (q ? '“' + esc(q) + '”' : 'this search') + '</h1><p class="t-body-s t-muted">We couldn’t find any matches. Try broader terms, check spelling, or browse our catalogue to discover something new.</p>' +
      '<span class="t-overline t-muted" style="text-align:left;font-size:10px">Revise your search</span><div class="field" style="text-align:left"><span class="field-label">Search</span><span class="field-control">' + ic('search') + '<input name="q" value="' + esc(q || '') + '" placeholder="Try “candle” or “diffuser”"></span></div>' +
      '<div class="row gap-8"><button class="btn btn-primary btn-m btn-12 grow is-white" style="font-weight:400" type="submit">Search again</button><a class="btn btn-secondary btn-m btn-12 grow" style="background:var(--surface);font-weight:400" href="#/catalog">Browse catalogue</a></div>' +
      '<span class="t-overline t-muted" style="text-align:left;font-size:10px">Browse by category</span><div class="chips-wrap"><a class="chip is-tag" href="#/c/candles">Fragrances</a><a class="chip is-tag" href="#/c/decor">Decor</a><a class="chip is-tag" href="#/c/lighting">Lighting</a><a class="chip is-tag" href="#/gifts">Gifts</a></div></form></div></div>';
  };

  /* =================== SITE MAP (prototype index) =================== */
  P.index = function () {
    function L(label, href, act) { return act ? '<button data-act="' + act + '">' + label + '</button>' : '<a href="' + href + '">' + label + '</a>'; }
    var sec = [
      ['01 Home', [L('Home', '#/')]],
      ['02 Catalog & Categories', [L('Catalog (Scented Candles)', '#/c/candles'), L('Mega menu open', '#/c/candles?open=mega'), L('Categories', '#/catalog'), L('Sort dropdown', '#/c/candles?open=sort'), L('Filters applied — tick Woody + $25–$50', '#/c/candles'), L('Empty filter result — Floral + $100+', '#/c/candles'), L('Loading skeleton — change any filter / page', '#/c/candles?page=2')]],
      ['03 Product', [L('Product', '#/p/sandalwood-vanilla'), L('Added toast — Add to cart', '#/p/sandalwood-vanilla'), L('Sticky bar — scroll down', '#/p/sandalwood-vanilla'), L('Variant selected — Size 140 g', '#/p/sandalwood-vanilla'), L('Out of stock + Notify me', '#/p/rosewood?open=notify'), L('Gallery lightbox', '#/p/sandalwood-vanilla?open=lightbox'), L('Write a review', '#/p/sandalwood-vanilla?open=review'), L('All reviews', '#/p/sandalwood-vanilla?open=reviews')]],
      ['04 Gifts', [L('Gifts', '#/gifts'), L('Builder modal (4 steps)', '#/gifts?open=builder'), L('Certificate modal', '#/gifts?open=certificate'), L('Corporate modal', '#/gifts?open=corporate')]],
      ['05 Cart', [L('Cart', '#/cart'), L('Promo applied — MONRE10', '#/cart'), L('Promo invalid — any other code', '#/cart'), L('Undo delete — Remove an item', '#/cart'), L('Item out of stock (adds a sold-out candle)', null, 'demo-oos')]],
      ['06 Checkout', [L('Checkout', '#/checkout'), L('Returning customer', '#/checkout'), L('Field errors — Pay with empty form', '#/checkout'), L('Pickup point selected', '#/checkout'), L('Pay error — card 4000 0000 0000 0002', '#/checkout'), L('Pay loading — any valid card', '#/checkout')]],
      ['07 Auth', [L('Sign in', '#/auth/signin'), L('Register', '#/auth/register'), L('Forgot password — Enter email', '#/auth/forgot'), L('Email sent', '#/auth/forgot/sent?email=anna%40gmail.com'), L('New password', '#/auth/reset'), L('Password changed', '#/auth/reset/done'), L('Email confirmation', '#/auth/verify')]],
      ['08 Account', [L('Account', '#/account'), L('Orders list', '#/account/orders'), L('Profile view', '#/account/profile'), L('Profile edit', '#/account/profile/edit'), L('Addresses', '#/account/addresses'), L('Address edit modal', '#/account/addresses?open=address'), L('Favorites', '#/account/favorites'), L('Gift certificates', '#/account/certificates'), L('Gift certificate activate', '#/account/certificates?open=activate'), L('Logout confirm', '#/account?open=logout')]],
      ['09 Info pages', [L('Our Story', '#/info/story'), L('Shipping', '#/info/shipping'), L('Returns', '#/info/returns'), L('FAQs', '#/info/faq'), L('Care Instructions', '#/info/care'), L('Contact Us', '#/info/contact'), L('Contact Us Sent', '#/info/contact/sent'), L('Gift Cards', '#/info/gift-cards'), L('Privacy Policy', '#/info/privacy'), L('Terms of Service', '#/info/terms')]],
      ['10 System', [L('404 Not found', '#/this-page-does-not-exist'), L('500 Server error', '#/500'), L('Nothing found', '#/search?q=zzzz')]],
      ['11 Overlays', [L('Search open', '#/?open=search'), L('Search results', '#/search?q=candle'), L('Mini cart drawer', '#/?open=minicart'), L('Language dropdown', '#/?open=lang'), L('Currency dropdown', '#/?open=currency'), L('Signed in menu', '#/?open=user'), L('Cookie banner', null, 'reset-cookie'), L('Newsletter — footer form', '#/?open=newsletter')]],
      ['Prototype tools', [L('Reset all prototype data', null, 'reset-all')]]
    ];
    return wrap('<div class="col gap-8"><h1 class="t-hero">MONRE — site map</h1><p class="t-body-m t-muted">Index of all screens and states in the MONRE prototype. Orders are delivered in ~30 seconds: Placed → Packed → In transit → Delivered.</p></div>' +
      sec.map(function (s) { return '<div class="idx-row"><span class="t-body-s">' + esc(s[0]) + ' · ' + s[1].length + ' screens</span><div class="idx-links">' + s[1].join('<span>·</span>') + '</div></div>'; }).join(''));
  };
  ACT['demo-oos'] = function () {
    var p = M.product('rosewood');
    M.addLine({ key: M.lineKey('p', p.id), kind: 'product', id: p.id, name: p.name, short: p.short, meta: p.meta, price: p.price, img: p.img, catLabel: 'CANDLES' });
    UI.refreshChrome(); go('/cart');
  };
  ACT['reset-cookie'] = function () { M.S.cookie = null; M.save(); UI.cookieBanner(); };
  ACT['reset-all'] = function () {
    UI.openModal(UI.modalHead('Reset prototype data?') +
      '<p class="t-body-m t-2">All accounts, orders, the cart, favorites and addresses stored in this browser will be deleted. This cannot be undone.</p>' +
      '<div class="modal-actions"><button class="btn btn-secondary" data-act="close-modal">Cancel</button><button class="btn btn-dark" data-act="reset-all-confirm">Reset everything</button></div>', { noFocus: true });
  };
  ACT['reset-all-confirm'] = function () {
    try { localStorage.removeItem('monre-proto-v1'); } catch (e) { /* ignore */ }
    location.hash = '#/'; location.reload();
  };
})();
