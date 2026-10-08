export const SITE = {
  name: 'VJS Studios',
  tagline: 'Factory-direct interiors, designed in Bangalore.',
  city: 'Bangalore, India',
  phoneDisplay: '+91 98765 43210',
  phoneLink: '+919876543210',
  whatsapp: '919876543210', // TODO: replace with real number
  email: 'hello@vjsstudios.in',
  address: 'VJS Studios Experience Centre, Outer Ring Road, Bangalore 560103',
  hours: 'Mon–Sat · 10:30am–7:30pm',
};

export const NAV = [
  { label: 'Studies', href: '#studies' },
  { label: 'Atelier', href: '#atelier' },
  { label: 'Crafts', href: '#services' },
  { label: 'Studio', href: '#about' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'FAQs', href: '#faqs' },
];

export const SERVICES = [
  {
    no: '01',
    title: 'Interior Design',
    desc: 'End-to-end home interiors — living, dining, bedrooms — designed around your light, routine and rituals.',
    points: ['Space planning & 3D views', 'False ceiling, lighting & paint', 'Furnishing & decor styling'],
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    price: 'from ₹1,450 / sq.ft',
  },
  {
    no: '02',
    title: 'Modular Kitchen',
    desc: 'Precision-built in our own factory — plywood-first, soft-close everything, tuned for Indian cooking.',
    points: ['BWP plywood + HDHMR options', 'Tall pantry, corner magic, profile shutters', 'Quartz, acrylic & fluted glass finishes'],
    img: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200&auto=format&fit=crop',
    price: 'from ₹1,850 / sq.ft',
  },
  {
    no: '03',
    title: 'Wardrobes & Storages',
    desc: 'Floor-to-ceiling wardrobes, lofts, crockery units and hidden storage that actually fits your life.',
    points: ['Sliding, hinged & walk-in wardrobes', 'Loft covering & dressers', 'TV units, study & foyer storage'],
    img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200&auto=format&fit=crop',
    price: 'from ₹1,650 / sq.ft',
  },
  {
    no: '04',
    title: 'Commercial Spaces',
    desc: 'Offices, retail and clinics that open fast and photograph well — built for footfall and teams.',
    points: ['Offices, salons, cafes & clinics', 'Turnkey fit-out in 30–60 days', 'Brand-first material palettes'],
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    price: 'custom quote',
  },
];

export const PROCESS = [
  { no: '01', title: 'Book Consultation', desc: 'Share plans or book a free site visit anywhere in Bangalore. We listen first, measure everything.', time: 'Day 0–2' },
  { no: '02', title: 'Design & 3D', desc: 'Moodboards, layouts and photoreal 3D views. Revise till it feels like home.', time: 'Week 1–3' },
  { no: '03', title: 'Factory Build', desc: 'Your modules are cut, edged and finished in our own factory — not outsourced.', time: 'Week 3–6' },
  { no: '04', title: 'Install & Handover', desc: 'Dust-controlled installation, deep clean, snag check and 10-year warranty.', time: 'Week 6–8' },
];

export const STATS = [
  { value: 18, suffix: '+', label: 'Years manufacturing furniture' },
  { value: 1200, suffix: '+', label: 'Homes & kitchens delivered' },
  { value: 45, suffix: '-day', label: 'Typical modular delivery' },
  { value: 10, suffix: '-yr', label: 'Warranty on factory modules' },
];

export const WORK = [
  { title: 'Warm Minimal 3BHK · Whitefield', tag: 'Full home · 1,450 sq.ft', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Chef-grade Kitchen · HSR Layout', tag: 'Modular kitchen · Island + tall pantry', img: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Walnut Wardrobe Wall · JP Nagar', tag: 'Wardrobes & storage · His + hers', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Boutique Salon · Indiranagar', tag: 'Commercial · 900 sq.ft fit-out', img: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1200&auto=format&fit=crop' },
];

export const TESTIMONIALS = [
  { name: 'Priya & Arjun Nair', area: 'Whitefield · 3BHK', text: 'The factory visit sold us — we saw our kitchen being pressed before it reached site. Finish is a level above the big brands, and handover was 6 days early.', rating: 5 },
  { name: 'Meera Kulkarni', area: 'HSR Layout · Kitchen', text: 'They re-planned our tiny kitchen around my mother’s cooking height. Soft-close, tall pantry, zero rattling kadhais. Worth every rupee.', rating: 5 },
  { name: 'Rohit Shetty', area: 'JP Nagar · Wardrobes', text: 'Floor-to-ceiling wardrobes with lofts we can actually reach. Measurements were laser-accurate. No gaps, no dust traps.', rating: 5 },
  { name: 'Dr. Farah Khan', area: 'Indiranagar · Clinic', text: 'Our clinic fit-out finished in 38 days without disturbing practice upstairs. Patients keep asking who did the interiors.', rating: 5 },
  { name: 'Sandeep Rao', area: 'Electronic City · 2BHK', text: 'Transparent quote, factory warranty in writing, and a site team that cleaned up daily. Rare in Bangalore.', rating: 5 },
];

export const FAQS = [
  { q: 'Are you designers or manufacturers?', a: 'Both — and that’s the point. VJS has run a furniture factory for 18+ years. Now our Bangalore studio designs your space and builds the modules in-house, so quality, sizes and timelines are fully in our control.' },
  { q: 'What does a typical project cost in Bangalore?', a: 'Full homes usually range ₹1,450–2,400/sq.ft depending on finishes; modular kitchens ₹1,850+/sq.ft; wardrobes ₹1,650+/sq.ft. Every quote is itemised — carcass, shutter, hardware, countertop — with no hidden civil extras.' },
  { q: 'How long does it take?', a: 'Design 2–3 weeks, factory build 3–4 weeks, installation 2–3 weeks. Most 2–3BHK homes hand over in 45–60 days after design freeze. Commercial fit-outs run 30–60 days.' },
  { q: 'Do you offer warranty?', a: 'Yes — 10 years on factory-built modules (carcass, shutters, hardware from Hettich/Hafele equivalents) and 1 year on-site service. Warranty card is shared at handover.' },
  { q: 'Do you take up single rooms — just kitchen or wardrobes?', a: 'Absolutely. About half our work is single-space: kitchens, wardrobe walls, TV + study combos. Minimum project value is ₹1.5L.' },
  { q: 'Do you visit sites outside central Bangalore?', a: 'We serve all of Bangalore — Whitefield to Kanakapura — plus Sarjapur, Devanahalli and Hosur on request. Site visit and measurement are free within city limits.' },
  { q: 'Can I visit your factory?', a: 'Please do — most clients do before booking. You’ll see panel cutting, edge-banding, pressing and QC. It’s the fastest way to understand why factory-direct lasts longer.' },
  { q: 'How do we start?', a: 'Tap “Book Consultation”, share your floor plan or address, and pick a slot. We’ll call within 4 working hours, visit, then share designs and a fixed quote. No advance until you approve 3Ds.' },
];

export interface Suspect {
  id: string;
  name: string;
  aka: string;
  rap: string;
  img: string;
}

export interface LineupCategory {
  key: 'wood' | 'fabric' | 'finish';
  title: string;
  sub: string;
  suspects: Suspect[];
}

const U = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export const LINEUP: LineupCategory[] = [
  {
    key: 'wood',
    title: 'Wood',
    sub: 'pick your backbone',
    suspects: [
      { id: 'walnut', name: 'Walnut', aka: 'The Heavy', rap: 'Dark, confident, hides dust. Costs more, worth it.', img: U('1736506159893-22cca29b8018') },
      { id: 'oak', name: 'White Oak', aka: 'The Diplomat', rap: 'Light, calm, goes with everything.', img: U('1523487150502-f27148d0af52') },
      { id: 'honey', name: 'Honey Oak', aka: 'The Optimist', rap: 'Warm, casual, kid-proof-ish.', img: U('1506968430777-bf7784a87f23') },
    ],
  },
  {
    key: 'fabric',
    title: 'Fabric',
    sub: 'pick your comfort',
    suspects: [
      { id: 'linen', name: 'Linen', aka: 'The Minimalist', rap: 'Breathes, wrinkles beautifully, judges no one.', img: U('1771039621869-1aa0536712a9') },
      { id: 'velvet', name: 'Velvet', aka: 'The Dramatist', rap: 'Green, moody, catches evening light.', img: U('1555041469-a586c61ea9bc') },
      { id: 'leather', name: 'Leather', aka: 'The Veteran', rap: 'Cognac. Ages better than you will.', img: U('1573866926487-a1865558a9cf') },
    ],
  },
  {
    key: 'finish',
    title: 'Finish',
    sub: 'pick your jewellery',
    suspects: [
      { id: 'brass', name: 'Brass', aka: 'The Show-off', rap: 'Polished, warm. Fingerprints included free.', img: U('1559058922-5d29e1f00075') },
      { id: 'champagne', name: 'Champagne', aka: "The Diplomat's watch", rap: 'Softer than brass, warmer than steel.', img: U('1638888077595-039e77b1dc70') },
      { id: 'noir', name: 'Noir', aka: 'The Secret', rap: 'Black with a gold streak. For kitchens with secrets.', img: U('1714515982604-081c2b2c335e') },
    ],
  },
];

export const JOURNEY_PHOTOS = {
  model: U('1684261982738-faaa2f93a306', 2000),
  room: U('1618221195710-dd6b41faaea6', 2000),
  factory: U('1565043666747-69f6646db940', 2000),
  home: U('1769845790207-2c022c5eeb40', 2000),
};
