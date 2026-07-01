// DealerSite Pro — shared copy, imagery helpers, and DB-backed vehicle preview data.
const U = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

const DSP_MARKETPLACE_PREVIEW_ENDPOINT = '/api/marketplace?pageSize=48&category=all&condition=all';
const DSP_PREVIEW_FALLBACK_IMAGES = {
  car: '',
  suv: '',
  csuv: '',
  sedan: '',
  hatch: '',
  mpv: '',
  ev: '',
  bike: '',
  auto: '',
};
const DSP_PREVIEW_NEW_VEHICLE_IMAGES = [
  DSP_PREVIEW_FALLBACK_IMAGES.car,
  DSP_PREVIEW_FALLBACK_IMAGES.suv,
  DSP_PREVIEW_FALLBACK_IMAGES.csuv,
  DSP_PREVIEW_FALLBACK_IMAGES.ev,
  DSP_PREVIEW_FALLBACK_IMAGES.hatch,
  DSP_PREVIEW_FALLBACK_IMAGES.sedan,
  DSP_PREVIEW_FALLBACK_IMAGES.mpv,
];
const DSP_PREVIEW_TWO_WHEELER_BRANDS = [
  'ather',
  'bajaj',
  'hero',
  'honda motorcycles',
  'ola',
  'royal enfield',
  'suzuki motorcycle',
  'tvs',
  'yamaha',
];
const DSP_PREMIUM_HERO_IMAGES = [
  {
    label: 'Mercedes-Benz G-Class',
    image: '/data/brand-model-images/4w-galleries/mercedes-benz/g-class/colors/obsidian-black-metallic.avif',
  },
  {
    label: 'Porsche 911',
    image: '/data/brand-model-images/4w-galleries/porsche/911/colors/jet-black-metallic.avif',
  },
  {
    label: 'BMW X7',
    image: '/data/brand-model-images/4w-galleries/bmw/x7/colors/mineral-white-metallic.avif',
  },
  {
    label: 'Land Rover Defender',
    image: '/data/brand-model-images/4w-galleries/land-rover/defender/colors/fuji-white.avif',
  },
  {
    label: 'Audi Q7',
    image: '/data/brand-model-images/4w-galleries/audi/q7/colors/mythos-black-metallic.avif',
  },
  {
    label: 'Rolls-Royce Phantom',
    image: '/data/brand-model-images/4w-galleries/rolls-royce/phantom/colors/diamond-black.avif',
  },
];
const DSP_MODEL_GALLERY_IMAGES = [
  { makes: ['maruti suzuki', 'maruti'], models: ['wagonr', 'wagon r'], image: '/data/brand-model-images/4w-galleries/maruti-suzuki/wagon-r/colors/pearl-metallic-nutmeg-brown.avif' },
  { makes: ['maruti suzuki', 'maruti'], models: ['swift'], image: '/data/brand-model-images/4w-galleries/maruti-suzuki/swift/colors/pearl-arctic-white.avif' },
  { makes: ['hyundai'], models: ['aura'], image: '/data/brand-model-images/4w-galleries/hyundai/aura/colors/typhoon-silver.avif' },
  { makes: ['hyundai'], models: ['creta'], image: '/data/brand-model-images/4w-galleries/hyundai/creta/colors/atlas-white.avif' },
  { makes: ['toyota'], models: ['innova hycross'], image: '/data/brand-model-images/4w-galleries/toyota/innova-hycross/colors/platinum-white-pearl.avif' },
  { makes: ['tata motors', 'tata'], models: ['nexon ev'], image: '/data/brand-model-images/4w-galleries/tata/nexon-ev/colors/pristine-white-dual-tone.avif' },
  { makes: ['mg'], models: ['zs ev'], image: '/data/brand-model-images/4w-galleries/mg/zs-ev/colors/starry-black.avif' },
  { makes: ['honda', 'honda city'], models: ['city'], image: '/data/brand-model-images/4w-galleries/honda/city/colors/platinum-white-pearl.avif' },
  { makes: ['mahindra'], models: ['xuv700'], image: '/data/brand-model-images/4w-galleries/mahindra/xuv700/colors/everest-white.avif' },
];

function dspText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function dspNormalize(value) {
  return dspText(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dspNumberFromPaise(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric / 100) : 0;
}

function dspFormatInrShort(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return 'Price on request';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount >= 1000000 ? 2 : 1).replace(/\.0$/, '')}L`;
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function dspConditionLabel(condition) {
  if (condition === 'certified_pre_owned') return 'Certified';
  if (condition === 'used') return 'Used';
  if (condition === 'new') return 'New';
  return 'Available';
}

function dspIsNewVehicle(row) {
  return dspText(row.condition).toLowerCase() === 'new';
}

function dspModelGalleryImageFor(make, model) {
  const makeKey = dspNormalize(make);
  const modelKey = dspNormalize(model);
  if (!makeKey && !modelKey) return '';

  const match = DSP_MODEL_GALLERY_IMAGES.find((item) => {
    const makeMatches = item.makes.some((entry) => makeKey === dspNormalize(entry));
    const modelMatches = item.models.some((entry) => modelKey === dspNormalize(entry));
    return makeMatches && modelMatches;
  });

  return match?.image || '';
}

function dspPremiumHeroImageFor(key = 'showroom') {
  const offsets = { showroom: 0, bronze: 1, electric: 2, market: 3 };
  return DSP_PREMIUM_HERO_IMAGES[offsets[key] ?? 0] || DSP_PREMIUM_HERO_IMAGES[0];
}

function dspBadPreviewImageUrl(url) {
  const value = dspText(url).toLowerCase();
  if (!value) return true;
  return [
    'whatsapp',
    'logo',
    'avatar',
    'icon',
    'placeholder',
    'stimg.cardekho.com/images/carexteriorimages',
    'dealer-assets/dealers',
    '/assets/cars/mclaren/750s',
    '/assets/cars/bmw/8-series-gran-coupe',
  ].some((token) => value.includes(token));
}

function dspPreviewVehicleKind(row) {
  const text = `${row.make ?? ''} ${row.model ?? ''} ${row.body_type ?? ''} ${row.fuel_type ?? ''}`.toLowerCase();
  if (text.includes('auto') || text.includes('rickshaw') || text.includes('three-wheeler')) return 'auto';
  if (text.includes('scooter') || text.includes('motorcycle') || text.includes('bike')) return 'bike';
  if (DSP_PREVIEW_TWO_WHEELER_BRANDS.some((brand) => text.includes(brand))) return 'bike';
  if (text.includes('electric') || text.includes('ev')) return 'ev';
  return 'car';
}

function dspPreviewVehiclePriority(row) {
  const conditionPriority = dspIsNewVehicle(row) ? 0 : 10;
  const kind = dspPreviewVehicleKind(row);
  const kindPriority = { car: 0, ev: 1, bike: 2, auto: 3 }[kind] ?? 4;
  return conditionPriority + kindPriority;
}

function dspPreviewVehicleDetailHref(row) {
  const explicitHref = dspText(row.detail_href);
  if (explicitHref) return explicitHref;

  const id = encodeURIComponent(dspText(row.id));
  if (!id) return '/cars';

  const kind = dspPreviewVehicleKind(row);
  if (kind === 'bike') return `/bikes/${id}`;
  if (kind === 'auto') return `/autos/${id}`;
  return `/cars/${id}`;
}

function dspPreviewFallbackImage(row, index = 0) {
  return '';
}

function dspPreviewImage(row, index = 0) {
  const localModelImage = dspIsNewVehicle(row) ? dspModelGalleryImageFor(row.make, row.model) : '';
  if (localModelImage) return localModelImage;

  const imageList = Array.isArray(row.image_urls) ? row.image_urls.filter(Boolean) : [];
  const image = [row.image_url, ...imageList].map((item) => dspText(item)).find((item) => item && !dspBadPreviewImageUrl(item));
  if (image) return image;

  return dspPreviewFallbackImage(row, index);
}

function dspMapPreviewVehicle(row, index) {
  const make = dspText(row.make, 'Dealer');
  const model = dspText(row.model, 'Vehicle');
  const year = dspText(row.year, 'Recent');
  const fuel = dspText(row.fuel_type, 'Fuel details');
  const transmission = dspText(row.transmission, 'Transmission');
  const price = dspFormatInrShort(dspNumberFromPaise(row.price_paise));
  const mileage = Number(row.mileage_km) > 0 ? `${Number(row.mileage_km).toLocaleString('en-IN')} km` : '';

  return {
    id: row.id,
    image: dspPreviewImage(row, index),
    name: `${make} ${model}`.trim(),
    price,
    tag: dspConditionLabel(row.condition),
    condition: dspConditionLabel(row.condition),
    isNew: dspIsNewVehicle(row),
    specs: [year, fuel, transmission].filter(Boolean),
    year,
    fuel,
    transmission,
    driven: mileage || 'Ready stock',
    body: dspText(row.body_type, 'Vehicle'),
    detailHref: dspPreviewVehicleDetailHref(row),
  };
}

const DSP_VEHICLE_STORE = {
  status: 'idle',
  vehicles: [],
  error: null,
  promise: null,
  subscribers: new Set(),
};

function dspNotifyVehicleSubscribers() {
  DSP_VEHICLE_STORE.subscribers.forEach((subscriber) => subscriber({
    status: DSP_VEHICLE_STORE.status,
    vehicles: DSP_VEHICLE_STORE.vehicles,
    error: DSP_VEHICLE_STORE.error,
  }));
}

function dspLoadPreviewVehicles() {
  if (DSP_VEHICLE_STORE.promise) return DSP_VEHICLE_STORE.promise;
  DSP_VEHICLE_STORE.status = 'loading';
  dspNotifyVehicleSubscribers();

  DSP_VEHICLE_STORE.promise = fetch(DSP_MARKETPLACE_PREVIEW_ENDPOINT, { headers: { Accept: 'application/json' } })
    .then((response) => {
      if (!response.ok) throw new Error(`Marketplace API returned ${response.status}`);
      return response.json();
    })
    .then((payload) => {
      const rows = Array.isArray(payload?.data?.vehicles) ? payload.data.vehicles : [];
      const orderedRows = [...rows].sort((a, b) => dspPreviewVehiclePriority(a) - dspPreviewVehiclePriority(b));
      DSP_VEHICLE_STORE.vehicles = orderedRows.map(dspMapPreviewVehicle).filter(Boolean);
      DSP_VEHICLE_STORE.status = 'ready';
      DSP_VEHICLE_STORE.error = null;
      dspNotifyVehicleSubscribers();
      return DSP_VEHICLE_STORE.vehicles;
    })
    .catch((error) => {
      DSP_VEHICLE_STORE.vehicles = [];
      DSP_VEHICLE_STORE.status = 'error';
      DSP_VEHICLE_STORE.error = error;
      dspNotifyVehicleSubscribers();
      return [];
    });

  return DSP_VEHICLE_STORE.promise;
}

function useMarketplacePreviewVehicles(limit = 3) {
  const [state, setState] = React.useState({
    status: DSP_VEHICLE_STORE.status,
    vehicles: DSP_VEHICLE_STORE.vehicles,
    error: DSP_VEHICLE_STORE.error,
  });

  React.useEffect(() => {
    DSP_VEHICLE_STORE.subscribers.add(setState);
    dspLoadPreviewVehicles();
    return () => DSP_VEHICLE_STORE.subscribers.delete(setState);
  }, []);

  return {
    status: state.status,
    vehicles: state.vehicles.slice(0, limit),
    allVehicles: state.vehicles,
    error: state.error,
  };
}

window.DSP_DATA = {
  heroVehicle: U('1503376780353-7e6692767b70', 1200), // sleek sports car
  vehicles: [],
  bikes: [],
  categories: [
    { icon: 'car',    name: 'Cars',                   blurb: 'New, used, and premium car inventory.' },
    { icon: 'bike',   name: 'Bikes & Scooters',       blurb: 'Showcase your two-wheeler lineup.' },
    { icon: 'ev',     name: 'EV Dealers',             blurb: 'Range, charging, and EV-first layouts.' },
    { icon: 'auto',   name: 'Autos & Three-Wheelers', blurb: 'Built for commercial and last-mile.' },
    { icon: 'used',   name: 'Used Vehicle Dealers',   blurb: 'Trust-building pages for pre-owned.' },
    { icon: 'brands', name: 'Multi-Brand Dealers',    blurb: 'One website for every brand you sell.' },
  ],
  steps: [
    { title: 'Add details',    blurb: 'Showroom name, location, and contact — in minutes.' },
    { title: 'Choose vehicles',blurb: 'Pick the categories you sell: cars, bikes, EVs, autos.' },
    { title: 'Pick style',     blurb: 'Choose a template and apply your brand colours.' },
    { title: 'Add inventory',  blurb: 'Upload vehicles with photos, prices, and specs.' },
    { title: 'Go live',        blurb: 'Publish on a free subdomain or your own domain.' },
  ],
  leads: [
    { icon: 'enquiry',   name: 'Enquiries',     blurb: 'Forms on every vehicle page.' },
    { icon: 'phone',     name: 'Calls',         blurb: 'Tap-to-call from any device.' },
    { icon: 'whatsapp',  name: 'WhatsApp',      blurb: 'Instant chat with one tap.' },
    { icon: 'testdrive', name: 'Test Drives',   blurb: 'Booking requests, scheduled.' },
    { icon: 'dashboard', name: 'Lead Dashboard',blurb: 'Every lead in one place.' },
  ],
  brandControls: [
    { icon: 'logo',     name: 'Add your logo',      blurb: 'Upload once — applied site-wide.' },
    { icon: 'palette',  name: 'Use brand colours',  blurb: 'Match your showroom identity.' },
    { icon: 'template', name: 'Choose a template',  blurb: 'Five dealer-ready layouts.' },
    { icon: 'globe',    name: 'Free subdomain',     blurb: 'yourname.dealersite.pro, instantly.' },
    { icon: 'link',     name: 'Connect your domain', blurb: 'Point your own .com or .in.' },
  ],
  templates: [
    { name: 'Clean Showroom',            tag: 'Cars',   image: U('1492144534655-ae79c964c9d7') },
    { name: 'Premium Used Cars',         tag: 'Used',   image: U('1503736334956-4c8f8e92946d') },
    { name: 'Performance Bikes',         tag: 'Bikes',  image: U('1558981806-ec527fa84c39') },
    { name: 'Family Dealer',             tag: 'Family', image: U('1605559424843-9e4c228bf1c2') },
    { name: 'Auto & Three-Wheeler',      tag: 'Auto',   image: U('1519003722824-194d4455a60c') },
  ],
};

window.useMarketplacePreviewVehicles = useMarketplacePreviewVehicles;
window.dspLoadPreviewVehicles = dspLoadPreviewVehicles;
window.DSP_PREMIUM_HERO_IMAGES = DSP_PREMIUM_HERO_IMAGES;
window.dspModelGalleryImageFor = dspModelGalleryImageFor;
window.dspPremiumHeroImageFor = dspPremiumHeroImageFor;
