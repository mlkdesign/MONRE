/* MONRE — catalogue data (content taken from the Figma mockups). */
(function () {
  var IMG = {
    candle: 'assets/img/p-candle-sandalwood.jpg',
    fig: 'assets/img/p-diffuser-fig.jpg',
    spray: 'assets/img/p-spray-whitetea.jpg',
    lamp: 'assets/img/p-lamp-luna.jpg',
    amber: 'assets/img/p-diffuser-amber.jpg',
    giftbox: 'assets/img/cut-giftbox.webp',
    sale: 'assets/img/cut-diffusers-sale.webp',
    cutLamp: 'assets/img/cut-lamp.webp',
    perfume: 'assets/img/cut-perfume.webp',
    giftCandle: 'assets/img/cut-gift-candle.webp',
    candleBooks: 'assets/img/cut-candle-books.webp',
    banner: 'assets/img/banner-quiet-evening.jpg',
    catFragrance: 'assets/img/cat-fragrance.jpg',
    catLighting: 'assets/img/cat-lighting.jpg',
    catDecor: 'assets/img/cat-decor.jpg',
    catFurniture: 'assets/img/cat-furniture.jpg',
    catStorage: 'assets/img/cat-storage.jpg',
    footerPlant: 'assets/img/footer-plant.png',
    arch1: 'assets/img/hero-arch-1.jpg',
    arch2: 'assets/img/hero-arch-2.jpg',
    arch3: 'assets/img/hero-arch-3.jpg'
  };
  var GALLERY = [IMG.candle, IMG.fig, IMG.spray, IMG.lamp, IMG.amber];

  function p(o) {
    var d = {
      badge: null, oldPrice: null, stock: 10, rating: 4.8, reviews: 24, scent: null, wax: null, wick: null,
      sizes: null, gallery: null, notes: '', pyramid: null, burn: null, isNew: false, popularity: 50, added: 0,
      desc: 'Handcrafted in small batches from natural materials. Designed to bring warmth and calm to everyday rituals at home.'
    };
    for (var k in o) d[k] = o[k];
    if (!d.gallery) {
      var i = GALLERY.indexOf(d.img);
      d.gallery = i >= 0 ? GALLERY.slice(i).concat(GALLERY.slice(0, i)) : [d.img].concat(GALLERY.slice(0, 4));
    }
    return d;
  }

  var products = [
    p({ id: 'sandalwood-vanilla', name: 'Candle "Sandalwood & Vanilla"', short: 'Sandalwood & Vanilla', type: 'Candle', cat: 'candles',
      meta: '220 g · soy wax · 50 h', cardMeta: 'Candle, 140 g', price: 34, badge: 'Bestseller', img: IMG.candle,
      scent: 'Woody', wax: 'Soy', wick: 'Cotton', rating: 4.9, reviews: 132, popularity: 100, added: 3,
      notes: 'cardamom · sandalwood · vanilla · musk',
      pyramid: ['TOP — cardamom · bergamot', 'HEART — sandalwood · vanilla', 'BASE — musk · tonka beans'],
      desc: 'A soothing blend of sandalwood and vanilla, designed to create a warm and inviting atmosphere in your home. Handcrafted in small batches using high-quality soy wax for a clean, steady burn.',
      sizes: [{ id: '140', label: '140 g · 30 h', price: 24, meta: '140 g · soy wax · 30 h', burn: '30 hours' },
              { id: '220', label: '220 g · 50 h', price: 34, meta: '220 g · soy wax · 50 h', burn: '50 hours' }], defaultSize: '220' }),
    p({ id: 'oak-barrel', name: 'Candle "Oak Barrel"', short: 'Oak Barrel', type: 'Candle', cat: 'candles', meta: '250 g · coconut wax', price: 42, img: IMG.fig,
      scent: 'Woody', wax: 'Coconut', wick: 'Wooden', notes: 'oak · whiskey · smoked vanilla', popularity: 80, added: 5 }),
    p({ id: 'cedar-grove', name: 'Candle "Cedar Grove"', short: 'Cedar Grove', type: 'Candle', cat: 'candles', meta: '220 g · soy wax', price: 29, oldPrice: 38, badge: '-25%', img: IMG.spray,
      scent: 'Woody', wax: 'Soy', wick: 'Cotton', notes: 'cedar · pine needles · amber', popularity: 75, added: 4 }),
    p({ id: 'amber-honey', name: 'Candle "Amber & Honey"', short: 'Amber & Honey', type: 'Candle', cat: 'candles', meta: '300 g · beeswax', price: 48, img: IMG.lamp,
      scent: 'Gourmand', wax: 'Beeswax', wick: 'Cotton', notes: 'honey · amber · tonka', popularity: 60, added: 6 }),
    p({ id: 'smoke-birch', name: 'Candle "Smoke & Birch"', short: 'Smoke & Birch', type: 'Candle', cat: 'candles', meta: '220 g · soy wax', price: 36, img: IMG.amber,
      scent: 'Woody', wax: 'Soy', wick: 'Wooden', notes: 'birch tar · smoke · leather', popularity: 55, added: 7 }),
    p({ id: 'warm-amber', name: 'Candle "Warm Amber"', short: 'Warm Amber', type: 'Candle', cat: 'candles', meta: '180 g · soy wax', price: 26, badge: 'New', isNew: true, img: IMG.candle,
      scent: 'Gourmand', wax: 'Soy', wick: 'Cotton', notes: 'amber · caramel · musk', popularity: 65, added: 10 }),
    p({ id: 'evening-cedar', name: 'Candle "Evening Cedar"', short: 'Evening Cedar', type: 'Candle', cat: 'candles', meta: '220 g · coconut wax', price: 38, img: IMG.fig,
      scent: 'Woody', wax: 'Coconut', wick: 'Wooden', notes: 'cedarwood · vetiver · clove', popularity: 45, added: 2 }),
    p({ id: 'rosewood', name: 'Candle "Rosewood"', short: 'Rosewood', type: 'Candle', cat: 'candles', meta: '250 g · soy wax', price: 44, img: IMG.spray, stock: 0,
      scent: 'Floral', wax: 'Soy', wick: 'Cotton', notes: 'rosewood · peony · white musk', popularity: 40, added: 1 }),
    p({ id: 'dry-wood', name: 'Candle "Dry Wood"', short: 'Dry Wood', type: 'Candle', cat: 'candles', meta: '220 g · soy wax', price: 31, img: IMG.lamp,
      scent: 'Woody', wax: 'Soy', wick: 'Wooden', notes: 'driftwood · sea salt · sage', popularity: 35, added: 8 }),
    p({ id: 'white-peony', name: 'Candle "White Peony"', short: 'White Peony', type: 'Candle', cat: 'candles', meta: '220 g · soy wax', price: 32, img: IMG.amber,
      scent: 'Floral', wax: 'Soy', wick: 'Cotton', notes: 'peony · lychee · rose', popularity: 30, added: 9 }),
    p({ id: 'bergamot-sage', name: 'Candle "Bergamot & Sage"', short: 'Bergamot & Sage', type: 'Candle', cat: 'candles', meta: '180 g · coconut wax', price: 30, img: IMG.candle,
      scent: 'Citrus', wax: 'Coconut', wick: 'Cotton', notes: 'bergamot · sage · neroli', popularity: 28, added: 11 }),
    p({ id: 'sea-salt', name: 'Candle "Sea Salt"', short: 'Sea Salt', type: 'Candle', cat: 'candles', meta: '180 g · soy wax', price: 28, img: IMG.fig,
      scent: 'Fresh', wax: 'Soy', wick: 'Wooden', notes: 'sea salt · driftwood · ozone', popularity: 25, added: 12 }),

    p({ id: 'fig-cedar', name: 'Diffuser "Fig & Cedar"', short: 'Fig & Cedar', type: 'Diffuser', cat: 'diffusers', meta: '200 ml · 8 reeds', cardMeta: 'Diffuser, 200 ml', price: 56, img: IMG.fig,
      scent: 'Woody', notes: 'green fig · cedar · musk', rating: 4.8, reviews: 64, popularity: 90, added: 5 }),
    p({ id: 'amber-musk', name: 'Diffuser "Amber & Musk"', short: 'Amber & Musk', type: 'Diffuser', cat: 'diffusers', meta: '200 ml · 8 reeds', cardMeta: 'Diffuser, 200 ml', price: 36, oldPrice: 54, badge: '-25%', img: IMG.amber,
      scent: 'Gourmand', notes: 'amber · white musk · vanilla', popularity: 85, added: 4 }),
    p({ id: 'linen-moss', name: 'Diffuser "Linen & Moss"', short: 'Linen & Moss', type: 'Diffuser', cat: 'diffusers', meta: '100 ml · 6 reeds', price: 42, img: IMG.fig,
      scent: 'Fresh', notes: 'clean linen · oakmoss · iris', popularity: 40, added: 9 }),
    p({ id: 'white-tea', name: 'Room Spray "White Tea"', short: 'White Tea', type: 'Room Spray', cat: 'room-sprays', meta: '100 ml', cardMeta: 'Room Spray, 100 ml', price: 26, badge: 'New', isNew: true, img: IMG.spray,
      scent: 'Fresh', notes: 'white tea · bergamot · jasmine', popularity: 70, added: 12 }),
    p({ id: 'fig-mist', name: 'Room Spray "Fig Mist"', short: 'Fig Mist', type: 'Room Spray', cat: 'room-sprays', meta: '100 ml', price: 24, img: IMG.spray,
      scent: 'Woody', notes: 'fig leaf · cedar · cassis', popularity: 30, added: 3 }),
    p({ id: 'cedarwood-oil', name: 'Essential Oil "Cedarwood"', short: 'Cedarwood oil', type: 'Essential oil', cat: 'oils', meta: '10 ml · pure', price: 19, img: IMG.amber,
      scent: 'Woody', notes: 'atlas cedarwood', popularity: 20, added: 2 }),
    p({ id: 'lavender-oil', name: 'Essential Oil "Lavender"', short: 'Lavender oil', type: 'Essential oil', cat: 'oils', meta: '10 ml · pure', price: 17, img: IMG.spray,
      scent: 'Floral', notes: 'french lavender', popularity: 18, added: 6 }),
    p({ id: 'wax-melts-amber', name: 'Wax melts "Amber"', short: 'Wax melts "Amber"', type: 'Wax melts', cat: 'wax-melts', meta: '6 cubes', price: 22, img: IMG.amber,
      scent: 'Gourmand', notes: 'amber · vanilla', popularity: 22, added: 7 }),
    p({ id: 'palo-santo', name: 'Incense "Palo Santo"', short: 'Palo Santo', type: 'Incense', cat: 'incense', meta: '20 sticks', price: 16, img: IMG.candle,
      scent: 'Woody', notes: 'palo santo · resin', popularity: 15, added: 4 }),

    p({ id: 'candle-snuffer', name: 'Candle snuffer, brass', short: 'Candle snuffer', type: 'Accessory', cat: 'accessories', meta: 'hand-polished', price: 18, img: IMG.spray, popularity: 40, added: 3 }),
    p({ id: 'wick-trimmer', name: 'Wick trimmer', short: 'Wick trimmer', type: 'Accessory', cat: 'accessories', meta: 'stainless steel', price: 14, img: IMG.lamp, popularity: 35, added: 2 }),
    p({ id: 'long-matches', name: 'Long matches, 20 cm', short: 'Long matches, 20 cm', type: 'Accessory', cat: 'accessories', meta: '40 matches', price: 9, img: IMG.spray, popularity: 30, added: 1 }),
    p({ id: 'travertine-tray', name: 'Travertine tray', short: 'Travertine tray', type: 'Decor', cat: 'decor', meta: 'hand-finished', price: 39, img: IMG.amber, popularity: 45, added: 6 }),

    p({ id: 'luna', name: 'Lamp "Luna"', short: 'Luna', type: 'Wireless lamp', cat: 'lighting', meta: 'Brass · wireless', cardMeta: 'Brass', price: 89, img: IMG.lamp, popularity: 88, added: 8,
      desc: 'A cordless brass lamp with a warm, dimmable glow. Charges in 4 hours and lasts the whole evening.' }),
    p({ id: 'moon-lamp', name: 'Moon lamp', short: 'Moon lamp', type: 'Table lamp', cat: 'lighting', meta: 'Alabaster · brass', price: 64, img: IMG.catLighting, gallery: [IMG.catLighting, IMG.lamp, IMG.arch3], popularity: 50, added: 10 }),
    p({ id: 'dune-vase', name: 'Vase "Dune"', short: '"Dune" vase', type: 'Vase', cat: 'decor', meta: 'stoneware · 24 cm', price: 42, img: IMG.catDecor, gallery: [IMG.catDecor, IMG.arch3, IMG.candle], popularity: 33, added: 5 }),
    p({ id: 'linen-tray', name: 'Linen tray', short: 'Linen Tray', type: 'Tray', cat: 'decor', meta: 'linen · oak', price: 39, img: IMG.arch1, gallery: [IMG.arch1, IMG.catDecor], popularity: 31, added: 3 }),
    p({ id: 'boucle-chair', name: 'Bouclé lounge chair', short: 'Bouclé chair', type: 'Furniture', cat: 'furniture', meta: 'bouclé · oak legs', price: 890, img: IMG.catFurniture, gallery: [IMG.catFurniture, IMG.arch2], popularity: 26, added: 7 }),
    p({ id: 'travertine-table', name: 'Travertine side table', short: 'Side table', type: 'Furniture', cat: 'furniture', meta: 'travertine · 45 cm', price: 340, img: IMG.arch2, gallery: [IMG.arch2, IMG.catFurniture], popularity: 24, added: 2 }),
    p({ id: 'linen-box', name: 'Linen storage box', short: 'Linen box', type: 'Storage', cat: 'storage', meta: 'set of 2', price: 48, img: IMG.catStorage, gallery: [IMG.catStorage], popularity: 21, added: 4 }),
    p({ id: 'woven-basket', name: 'Woven basket', short: 'Woven basket', type: 'Storage', cat: 'storage', meta: 'seagrass · 38 cm', price: 36, img: IMG.catStorage, gallery: [IMG.catStorage, IMG.arch1], popularity: 19, added: 6 })
  ];

  var giftSets = [
    { id: 'gift-first', name: '"First encounter"', homeName: '"First Impression"', price: 59, old: null, img: IMG.candle, tags: ['her', 'colleagues', 'under60'],
      eyebrow: 'FOR A FIRST GIFT', note: 'when you want to surprise — often gifted to colleagues and friends',
      homeNote: 'A curated introduction to our most beloved fragrances',
      items: ['Candle "Sandalwood & Vanilla", 140 g', 'Room spray "White Tea", 50 ml', 'Box and handwritten card'],
      homeItems: ['Sandalwood & Vanilla candle 140 g', 'Fig & Cedar reed diffuser 100 ml', 'Linen pouch & matches'] },
    { id: 'gift-warm', name: '"Home in warmth"', homeName: '"Warm Home"', price: 85, old: 120, badge: 'MOST POPULAR', img: IMG.candle, tags: ['her', 'him', 'housewarming'],
      eyebrow: 'MOST OFTEN GIFTED', note: 'chosen by 7 of 10 customers — hits in a single box',
      homeNote: 'The complete home fragrance experience for every room',
      items: ['Candle "Sandalwood & Vanilla", 220 g', 'Diffuser "Fig & Cedar", 200 ml', 'Wax melts "Amber", 6 cubes', 'Ribbon and handwritten card'],
      homeItems: ['Sandalwood & Vanilla candle 140 g', 'White Tea room spray 100 ml', 'Fig & Cedar diffuser 200 ml', 'Luna wireless lamp'] },
    { id: 'gift-grand', name: '"Grand"', homeName: '"Grand"', price: 120, old: null, img: IMG.candle, tags: ['him', 'housewarming', 'colleagues'],
      eyebrow: 'BEST FOR FAMILY', note: 'the full evening ritual — often given for housewarmings',
      homeNote: 'An unforgettable gift for those who appreciate the finer things',
      items: ['Candle, diffuser and room spray', 'Snuffer and wick trimmer', 'Premium box with ribbon'],
      homeItems: ['Two signature candles 140 g each', 'Premium reed diffuser 200 ml', 'White Tea room spray 100 ml', 'Gift box with ribbon & card'] }
  ];

  var categories = [
    { id: 'candles', name: 'Scented Candles', short: 'Candles', group: 'Home Fragrance', img: IMG.candle,
      desc: 'Soy and coconut wax, cotton and wooden wicks, up to 60 hours of burn time.' },
    { id: 'diffusers', name: 'Reed Diffusers', short: 'Diffusers', group: 'Home Fragrance', img: IMG.fig, desc: 'Flameless fragrance that lasts for months — reeds, oils and glass you will want to keep.' },
    { id: 'room-sprays', name: 'Room Sprays', short: 'Room sprays', group: 'Home Fragrance', img: IMG.spray, desc: 'A quick refresh for any room — natural essential oils, no harsh propellants.' },
    { id: 'oils', name: 'Essential Oils', short: 'Oils', group: 'Home Fragrance', img: IMG.lamp, desc: 'Pure essential oils for diffusers, baths and quiet evening rituals.' },
    { id: 'wax-melts', name: 'Wax Melts', short: 'Wax melts', group: 'Home Fragrance', img: IMG.amber, desc: 'Our signature scents in small soy cubes — flame-free and long-lasting.' },
    { id: 'incense', name: 'Incense', short: 'Incense', group: 'Home Fragrance', img: IMG.giftbox, desc: 'Hand-rolled sticks and resins for slow mornings and calm evenings.' },
    { id: 'accessories', name: 'Candle Accessories', short: 'Accessories', group: 'Home Fragrance', img: IMG.sale, desc: 'Snuffers, trimmers and long matches — the small tools of a beautiful ritual.' },
    { id: 'lighting', name: 'Lighting', short: 'Lighting', group: 'Lighting', img: IMG.catLighting, desc: 'Lamps & ambient light for warm, layered evenings.' },
    { id: 'decor', name: 'Decor', short: 'Decor', group: 'Decor', img: IMG.catDecor, desc: 'Vases, trays & accents that make a room feel personal.' },
    { id: 'furniture', name: 'Furniture', short: 'Furniture', group: 'Furniture', img: IMG.catFurniture, desc: 'Small pieces, big impact.' },
    { id: 'storage', name: 'Storage & Organization', short: 'Storage', group: 'Storage', img: IMG.catStorage, desc: 'Baskets, boxes & organisers for a calm, uncluttered home.' }
  ];

  var megaMenu = [
    { title: 'Home Fragrance', cat: 'candles', accent: true, links: [['Scented candles', 'candles'], ['Reed diffusers', 'diffusers'], ['Room sprays', 'room-sprays'], ['Essential oils', 'oils'], ['Electric diffusers', 'diffusers'], ['Wax melts', 'wax-melts'], ['Incense', 'incense'], ['Candle accessories', 'accessories']] },
    { title: 'Lighting', cat: 'lighting', links: [['Table lamps', 'lighting'], ['Cordless lamps', 'lighting'], ['Bedside lamps', 'lighting'], ['Ambient lighting', 'lighting'], ['LED decor', 'lighting'], ['Candleholders & lanterns', 'lighting']] },
    { title: 'Decor', cat: 'decor', links: [['Vases', 'decor'], ['Decorative trays', 'decor'], ['Figurines', 'decor'], ['Picture frames', 'decor'], ['Decorative books', 'decor']] },
    { title: 'Furniture & Storage', cat: 'furniture', links: [['Coffee tables', 'furniture'], ['Consoles', 'furniture'], ['Benches', 'furniture'], ['Mirrors', 'furniture'], ['Baskets & boxes', 'storage'], ['Kitchen organization', 'storage'], ['Bathroom organization', 'storage']] }
  ];

  var catalogWorlds = [
    { title: 'Home Fragrance', count: 124, img: IMG.catFragrance, cat: 'candles', chips: [['Candles', 'candles'], ['Diffusers', 'diffusers'], ['Room sprays', 'room-sprays'], ['Oils', 'oils'], ['Wax', 'wax-melts'], ['Incense', 'incense']] },
    { title: 'Lighting', count: 87, img: IMG.catLighting, cat: 'lighting', chips: [['Table lamps', 'lighting'], ['Cordless', 'lighting'], ['Bedside', 'lighting'], ['LED decor', 'lighting'], ['Candleholders', 'lighting']] },
    { title: 'Decor', count: 96, img: IMG.catDecor, cat: 'decor', chips: [['Vases', 'decor'], ['Trays', 'decor'], ['Figurines', 'decor'], ['Picture frames', 'decor'], ['Decorative books', 'decor']] },
    { title: 'Furniture', count: 34, img: IMG.catFurniture, cat: 'furniture', chips: [['Coffee tables', 'furniture'], ['Consoles', 'furniture'], ['Benches', 'furniture'], ['Mirrors', 'furniture']] },
    { title: 'Storage & Organization', count: 68, img: IMG.catStorage, cat: 'storage', chips: [['Kitchen', 'storage'], ['Bathroom', 'storage'], ['Wardrobe', 'storage'], ['Baskets', 'storage'], ['Laundry', 'storage']] }
  ];

  var reviews = [
    { name: 'Anna M.', date: 'Jul 28', rating: 5, photo: IMG.catFragrance, avatar: 'dark', text: '"Smells like a fancy hotel. Burns evenly, no soot — already ordered a second one as a gift for mom"' },
    { name: 'Igor S.', date: 'Jul 19', rating: 5, photo: IMG.banner, avatar: 'brown', text: '"Soft scent, not stifling. Fills the whole living room over the evening. Packaging — can be gifted without wrapping"' },
    { name: 'Maria K.', date: 'Jul 6', rating: 4, photo: IMG.catFragrance, avatar: 'light', text: '"Third MONRE candle. Vanilla is delicate, not cloying. Would love an even bigger size"' },
    { name: 'Igor S.', date: 'Jul 19', rating: 5, photo: IMG.banner, avatar: 'brown', text: '"Soft scent, not stifling. Fills the whole living room over the evening. Packaging — can be gifted without wrapping"' },
    { name: 'Anna M.', date: 'Jul 28', rating: 5, photo: IMG.catFragrance, avatar: 'dark', text: '"Smells like a fancy hotel. Burns evenly, no soot — already ordered a second one as a gift for mom"' },
    { name: 'Maria K.', date: 'Jul 6', rating: 4, photo: IMG.catFragrance, avatar: 'light', text: '"Third MONRE candle. Vanilla is delicate, not cloying. Would love an even bigger size"' },
    { name: 'Igor S.', date: 'Jul 19', rating: 5, avatar: 'brown', text: '"Soft scent, not stifling. Fills the whole living room over the evening. Packaging — can be gifted without wrapping"' },
    { name: 'Maria K.', date: 'Jul 6', rating: 4, avatar: 'light', text: '"Third MONRE candle. Vanilla is delicate, not cloying. Would love an even bigger size"' },
    { name: 'Anna M.', date: 'Jul 28', rating: 5, avatar: 'dark', text: '"Smells like a fancy hotel. Burns evenly, no soot — already ordered a second one as a gift for mom"' },
    { name: 'Igor S.', date: 'Jul 19', rating: 5, avatar: 'brown', text: '"Soft scent, not stifling. Fills the whole living room over the evening. Packaging — can be gifted without wrapping"' },
    { name: 'Anna M.', date: 'Jul 28', rating: 5, avatar: 'dark', text: '"Smells like a fancy hotel. Burns evenly, no soot — already ordered a second one as a gift for mom"' },
    { name: 'Maria K.', date: 'Jul 6', rating: 4, avatar: 'light', text: '"Third MONRE candle. Vanilla is delicate, not cloying. Would love an even bigger size"' }
  ];

  var packaging = [
    { id: 'pouch', name: 'Linen pouch', note: 'Natural linen · free', price: 0, img: IMG.giftbox },
    { id: 'box', name: 'Gift box', note: 'MONRE box with ribbon · +$6', price: 6, img: IMG.sale },
    { id: 'keepsake', name: 'Keepsake box', note: 'Walnut wooden box · +$18', price: 18, img: IMG.cutLamp }
  ];

  window.MONRE_DATA = {
    IMG: IMG, products: products, giftSets: giftSets, categories: categories, megaMenu: megaMenu,
    catalogWorlds: catalogWorlds, reviews: reviews, packaging: packaging,
    builderItems: ['sandalwood-vanilla', 'fig-cedar', 'white-tea', 'amber-musk'],
    currencies: [
      { code: 'USD', label: 'USD $', rate: 1, pre: '$', post: '' },
      { code: 'EUR', label: 'EUR €', rate: 0.92, pre: '€', post: '' },
      { code: 'GBP', label: 'GBP £', rate: 0.79, pre: '£', post: '' },
      { code: 'CHF', label: 'CHF', rate: 0.88, pre: 'CHF ', post: '' }
    ],
    languages: [
      { code: 'en', label: 'English', short: 'En' },
      { code: 'de', label: 'Deutsch', short: 'De' },
      { code: 'fr', label: 'Français', short: 'Fr' },
      { code: 'it', label: 'Italiano', short: 'It' }
    ],
    FREE_SHIPPING: 75
  };
})();
