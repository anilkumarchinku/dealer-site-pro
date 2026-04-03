/**
 * Scrape 3W and 4W-auto model images from TrucksDekho (trucks.cardekho.com)
 * Uses the CDN URL patterns and API endpoints of TrucksDekho
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ─── URL slug mappings for TrucksDekho CDN ────────────────────────────────────
// Pattern: https://truckcdn.cardekho.com/in/{brand-slug}/{model-slug}/{brand-slug}-{model-slug}-{id}.jpg

const MODELS_3W = [
  // Altigreen
  { brand: 'altigreen', brandSlug: 'altigreen', model: 'neEV TEZ', modelSlug: 'neev-tez' },
  { brand: 'altigreen', brandSlug: 'altigreen', model: 'neEV High Deck', modelSlug: 'neev-high-deck' },
  { brand: 'altigreen', brandSlug: 'altigreen', model: 'neEV Low Deck', modelSlug: 'neev-low-deck' },
  { brand: 'altigreen', brandSlug: 'altigreen', model: 'neEV Bhai Low Deck', modelSlug: 'neev-bhai-low-deck' },
  { brand: 'altigreen', brandSlug: 'altigreen', model: 'neEV Bhai Flatbed', modelSlug: 'neev-bhai-flatbed' },
  { brand: 'altigreen', brandSlug: 'altigreen', model: 'neEV Rahi', modelSlug: 'neev-rahi' },
  { brand: 'altigreen', brandSlug: 'altigreen', model: 'NEEV Flatbed', modelSlug: 'neev-flatbed' },

  // Atul Auto
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Shakti Cargo', modelSlug: 'shakti-cargo' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Shakti Cargo XD', modelSlug: 'shakti-cargo-xd' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'GEM Cargo', modelSlug: 'gem-cargo' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Gem Paxx 3-Seater', modelSlug: 'gem-paxx' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Rik 3-Seater', modelSlug: 'rik' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Gemini Passenger', modelSlug: 'gemini' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Gemini Plus', modelSlug: 'gemini-plus' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Smart Cargo', modelSlug: 'smart-cargo' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Elite Cargo', modelSlug: 'elite-cargo' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Elite Plus Cargo', modelSlug: 'elite-plus-cargo' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Elite Plus Passenger', modelSlug: 'elite-plus' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Mobili', modelSlug: 'mobili' },
  { brand: 'atul-auto', brandSlug: 'atul', model: 'Energie', modelSlug: 'energie' },

  // Bajaj Auto 3W
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'RE Compact 4S', modelSlug: 're-compact-4s' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'Maxima Z', modelSlug: 'maxima-z' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'Maxima C', modelSlug: 'maxima-c' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'Maxima X Wide', modelSlug: 'maxima-x' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'Maxima XL Cargo E-TEC 9.0', modelSlug: 'maxima-xl-cargo-e-tec' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'Maxima XL Cargo E-TEC 12.0', modelSlug: 'maxima-xl-cargo-e-tec-12' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'GoGo P5009', modelSlug: 'gogo-p-5009' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'GoGo P5012', modelSlug: 'gogo-p-5012' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'GoGo P7012', modelSlug: 'gogo-p-7012' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'RE E-TEC 9.0', modelSlug: 're-e-tec' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'WEGO P9018', modelSlug: 'wego-p-9018' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'Qute', modelSlug: 'qute' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'RE Optima', modelSlug: 're-optima' },
  { brand: 'bajaj-auto-3w', brandSlug: 'bajaj', model: 'RE Optima Plus', modelSlug: 're-optima-plus' },

  // ETrio
  { brand: 'etrio', brandSlug: 'etrio', model: 'Touro Mini Cargo', modelSlug: 'touro-mini' },
  { brand: 'etrio', brandSlug: 'etrio', model: 'Touro Max Cargo L5N', modelSlug: 'touro-max-cargo' },
  { brand: 'etrio', brandSlug: 'etrio', model: 'Touro Max Passenger L5M', modelSlug: 'touro-max-passenger' },
  { brand: 'etrio', brandSlug: 'etrio', model: 'Touro Max++', modelSlug: 'touro-max-plus-plus' },

  // Euler Motors
  { brand: 'euler-motors', brandSlug: 'euler', model: 'HiLoad EV', modelSlug: 'hiload-ev' },
  { brand: 'euler-motors', brandSlug: 'euler', model: 'NEO HiRANGE', modelSlug: 'neo-hirange' },
  { brand: 'euler-motors', brandSlug: 'euler', model: 'NEO HiCity', modelSlug: 'neo-hicity' },
  { brand: 'euler-motors', brandSlug: 'euler', model: 'Turbo EV 1000', modelSlug: 'turbo-ev-1000' },
  { brand: 'euler-motors', brandSlug: 'euler', model: 'Storm EV', modelSlug: 'storm-ev' },

  // Greaves Electric
  { brand: 'greaves-electric-3w', brandSlug: 'greaves', model: 'E-Pro Cargo 2100', modelSlug: 'e-pro-cargo' },
  { brand: 'greaves-electric-3w', brandSlug: 'greaves', model: 'Eltra EV Cargo PU', modelSlug: 'eltra-ev-cargo-pu' },
  { brand: 'greaves-electric-3w', brandSlug: 'greaves', model: 'Eltra EV Cargo FB', modelSlug: 'eltra-ev-cargo-fb' },
  { brand: 'greaves-electric-3w', brandSlug: 'greaves', model: 'Eltra City 3 Seater', modelSlug: 'eltra-city' },
  { brand: 'greaves-electric-3w', brandSlug: 'greaves', model: 'Eltra City Xtra 3 Seater', modelSlug: 'eltra-city-xtra' },
  { brand: 'greaves-electric-3w', brandSlug: 'greaves', model: 'Xargo EV', modelSlug: 'xargo-ev' },

  // Kinetic Green
  { brand: 'kinetic-green', brandSlug: 'kinetic-green', model: 'Super DX', modelSlug: 'super-dx' },
  { brand: 'kinetic-green', brandSlug: 'kinetic-green', model: 'Safar Smart', modelSlug: 'safar-smart' },
  { brand: 'kinetic-green', brandSlug: 'kinetic-green', model: 'Safar Shakti', modelSlug: 'safar-shakti' },
  { brand: 'kinetic-green', brandSlug: 'kinetic-green', model: 'Safar Jumbo', modelSlug: 'safar-jumbo' },
  { brand: 'kinetic-green', brandSlug: 'kinetic-green', model: 'Safar Jumbo Ranger', modelSlug: 'safar-jumbo-ranger' },

  // Lohia Auto
  { brand: 'lohia-auto', brandSlug: 'lohia', model: 'Narain Plus', modelSlug: 'narain-plus' },
  { brand: 'lohia-auto', brandSlug: 'lohia', model: 'Narain SLC', modelSlug: 'narain-slc' },
  { brand: 'lohia-auto', brandSlug: 'lohia', model: 'Narain LC', modelSlug: 'narain-lc' },
  { brand: 'lohia-auto', brandSlug: 'lohia', model: 'Humsafar IAQ', modelSlug: 'humsafar-iaq' },
  { brand: 'lohia-auto', brandSlug: 'lohia', model: 'Comfort F2F Plus', modelSlug: 'comfort-f2f-plus' },
  { brand: 'lohia-auto', brandSlug: 'lohia', model: 'E-Tipper', modelSlug: 'e-tipper' },

  // Mahindra 3W
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Alfa DX', modelSlug: 'alfa-dx' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Alfa DX Duo', modelSlug: 'alfa-dx-duo' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Alfa Plus', modelSlug: 'alfa-plus' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Alfa Plus Duo', modelSlug: 'alfa-plus-duo' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Alfa Champ', modelSlug: 'alfa-champ' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Alfa Comfy', modelSlug: 'alfa-comfy' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'e-Alfa Cargo', modelSlug: 'e-alfa-cargo' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'e-Alfa Mini', modelSlug: 'e-alfa-mini' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'e-Alfa Plus', modelSlug: 'e-alfa-plus' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'e-Alfa Super', modelSlug: 'e-alfa-super' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Treo Yaari', modelSlug: 'treo-yaari' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Treo Yaari Cargo', modelSlug: 'treo-yaari-cargo' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Treo', modelSlug: 'treo' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Treo Plus', modelSlug: 'treo-plus' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Treo Zor', modelSlug: 'treo-zor' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Zor Grand', modelSlug: 'zor-grand' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'Zor Grand Range Plus', modelSlug: 'zor-grand-range-plus' },
  { brand: 'mahindra-3w', brandSlug: 'mahindra', model: 'UDO', modelSlug: 'udo' },

  // Montra Electric
  { brand: 'montra-ev', brandSlug: 'montra', model: 'Super Auto ePL 2.0 R', modelSlug: 'super-auto' },
  { brand: 'montra-ev', brandSlug: 'montra', model: 'Super Cargo eCx d+', modelSlug: 'super-cargo' },
  { brand: 'montra-ev', brandSlug: 'montra', model: 'Eviator E-350L', modelSlug: 'eviator-e-350l' },
  { brand: 'montra-ev', brandSlug: 'montra', model: 'Eviator E-350X', modelSlug: 'eviator-e-350x' },

  // Omega Seiki Mobility
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Stream City', modelSlug: 'stream-city' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Stream City Qik', modelSlug: 'stream-city-qik' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Stream', modelSlug: 'stream' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Rage Plus', modelSlug: 'rage-plus' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Rage Plus ATR', modelSlug: 'rage-plus-atr' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Rage Plus RapidEv Pro', modelSlug: 'rage-plus-rapidev-pro' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Rage Plus Frost', modelSlug: 'rage-plus-frost' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Rage Plus Garbage Tipper', modelSlug: 'rage-plus-garbage-tipper' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Swayamgati Cargo', modelSlug: 'swayamgati-cargo' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'Swayamgati', modelSlug: 'swayamgati' },
  { brand: 'omega-seiki-mobility', brandSlug: 'omega-seiki', model: 'NRG', modelSlug: 'nrg' },

  // OSM
  { brand: 'osm', brandSlug: 'osm', model: 'OSM Rage+ Frost', modelSlug: 'rage-frost' },
  { brand: 'osm', brandSlug: 'osm', model: 'OSM Rage+ Flame', modelSlug: 'rage-flame' },
  { brand: 'osm', brandSlug: 'osm', model: 'OSM Rage+ Blaze', modelSlug: 'rage-blaze' },
  { brand: 'osm', brandSlug: 'osm', model: 'OSM Stream City', modelSlug: 'stream-city' },
  { brand: 'osm', brandSlug: 'osm', model: 'OSM Stream Highway', modelSlug: 'stream-highway' },
  { brand: 'osm', brandSlug: 'osm', model: 'OSM Swayamgati Cargo', modelSlug: 'swayamgati-cargo' },
  { brand: 'osm', brandSlug: 'osm', model: 'OSM Swayamgati Cargo Plus', modelSlug: 'swayamgati-cargo-plus' },

  // Piaggio Ape
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape Auto Plus', modelSlug: 'ape-auto-plus' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape NXT Plus', modelSlug: 'ape-nxt-plus' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape City Plus', modelSlug: 'ape-city-plus' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape City Metro', modelSlug: 'ape-city-metro' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape Auto DX', modelSlug: 'ape-auto-dx' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape Auto HT DX', modelSlug: 'ape-auto-ht-dx' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape Xtra LDX', modelSlug: 'ape-xtra-ldx' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape Xtra LDX Plus', modelSlug: 'ape-xtra-ldx-plus' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape Xtra Classic', modelSlug: 'ape-xtra-classic' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape Xtra Bada 700', modelSlug: 'ape-xtra-bada-700' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape Xtra 600', modelSlug: 'ape-xtra-600' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape E Xtra FX', modelSlug: 'ape-e-xtra-fx' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape E Xtra FX Max', modelSlug: 'ape-e-xtra-fx-max' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape E City', modelSlug: 'ape-e-city' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape E City FX', modelSlug: 'ape-e-city-fx' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape E City FX New Max', modelSlug: 'ape-e-city-fx-new-max' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape E City Ultra', modelSlug: 'ape-e-city-ultra' },
  { brand: 'piaggio-ape', brandSlug: 'piaggio', model: 'Ape Truk Plus', modelSlug: 'ape-truk-plus' },

  // Saera EV
  { brand: 'saera-ev', brandSlug: 'saera', model: 'Mayuri Grand', modelSlug: 'mayuri-grand' },
  { brand: 'saera-ev', brandSlug: 'saera', model: 'Mayuri Star', modelSlug: 'mayuri-star' },
  { brand: 'saera-ev', brandSlug: 'saera', model: 'Mayuri Pro Star', modelSlug: 'mayuri-pro-star' },
  { brand: 'saera-ev', brandSlug: 'saera', model: 'Mayuri Auto Shape', modelSlug: 'mayuri-auto-shape' },
  { brand: 'saera-ev', brandSlug: 'saera', model: 'Mayuri E Cart Loader', modelSlug: 'mayuri-e-cart-loader' },
  { brand: 'saera-ev', brandSlug: 'saera', model: 'Mayuri DV', modelSlug: 'mayuri-dv' },
  { brand: 'saera-ev', brandSlug: 'saera', model: 'Mayuri Pro 1000', modelSlug: 'mayuri-pro-1000' },

  // Terra Motors
  { brand: 'terra-motors', brandSlug: 'terra-motors', model: 'Y4A', modelSlug: 'y4a' },
  { brand: 'terra-motors', brandSlug: 'terra-motors', model: 'Pace-E Cargo', modelSlug: 'pace-e-cargo' },
  { brand: 'terra-motors', brandSlug: 'terra-motors', model: 'Sumo', modelSlug: 'sumo' },
  { brand: 'terra-motors', brandSlug: 'terra-motors', model: 'Kyoro L5', modelSlug: 'kyoro-l5' },
  { brand: 'terra-motors', brandSlug: 'terra-motors', model: 'Kyoro Plus', modelSlug: 'kyoro-plus' },

  // TVS King
  { brand: 'tvs-king', brandSlug: 'tvs', model: 'King Duramax', modelSlug: 'king-duramax' },
  { brand: 'tvs-king', brandSlug: 'tvs', model: 'King Duramax Plus', modelSlug: 'king-duramax-plus' },
  { brand: 'tvs-king', brandSlug: 'tvs', model: 'King Deluxe', modelSlug: 'king-deluxe' },
  { brand: 'tvs-king', brandSlug: 'tvs', model: 'King Kargo', modelSlug: 'king-kargo' },
  { brand: 'tvs-king', brandSlug: 'tvs', model: 'King Kargo CNG HD', modelSlug: 'king-kargo-cng-hd' },
  { brand: 'tvs-king', brandSlug: 'tvs', model: 'King Kargo HD EV', modelSlug: 'king-kargo-hd-ev' },
  { brand: 'tvs-king', brandSlug: 'tvs', model: 'King EV MAX', modelSlug: 'king-ev-max' },

  // YC EV
  { brand: 'yc-ev', brandSlug: 'yc-electric', model: 'YC Electric Yatri', modelSlug: 'yatri' },
  { brand: 'yc-ev', brandSlug: 'yc-electric', model: 'YC Electric Yatri Deluxe', modelSlug: 'yatri-deluxe' },
  { brand: 'yc-ev', brandSlug: 'yc-electric', model: 'YC Electric Yatri Super', modelSlug: 'yatri-super' },
  { brand: 'yc-ev', brandSlug: 'yc-electric', model: 'YC Electric Yatri Plus', modelSlug: 'yatri-plus' },
  { brand: 'yc-ev', brandSlug: 'yc-electric', model: 'YC Electric Yatri Cart', modelSlug: 'yatri-cart' },
  { brand: 'yc-ev', brandSlug: 'yc-electric', model: 'YC Electric E Loader', modelSlug: 'e-loader' },

  // YOUDHA
  { brand: 'youdha', brandSlug: 'youdha', model: 'YOUDHA Trevo Cargo', modelSlug: 'trevo-cargo' },
  { brand: 'youdha', brandSlug: 'youdha', model: 'YOUDHA Trevo Cargo Plus', modelSlug: 'trevo-cargo-plus' },
  { brand: 'youdha', brandSlug: 'youdha', model: 'YOUDHA EPOD Cargo', modelSlug: 'epod-cargo' },
  { brand: 'youdha', brandSlug: 'youdha', model: 'YOUDHA EPOD Cargo Plus', modelSlug: 'epod-cargo-plus' },
  { brand: 'youdha', brandSlug: 'youdha', model: 'YOUDHA G-Van Cargo', modelSlug: 'g-van-cargo' },
  { brand: 'youdha', brandSlug: 'youdha', model: 'YOUDHA G-Van Cargo Plus', modelSlug: 'g-van-cargo-plus' },
  { brand: 'youdha', brandSlug: 'youdha', model: 'YOUDHA Passenger E-Rickshaw Standard', modelSlug: 'passenger-e-rickshaw' },
  { brand: 'youdha', brandSlug: 'youdha', model: 'YOUDHA Passenger E-Rickshaw Deluxe', modelSlug: 'passenger-e-rickshaw-deluxe' },
];

const MODELS_4W = [
  // Ashok Leyland
  { brand: 'ashok-leyland', brandSlug: 'ashok-leyland', model: 'Saathi FSD', modelSlug: 'saathi-fsd' },
  { brand: 'ashok-leyland', brandSlug: 'ashok-leyland', model: 'Dost+', modelSlug: 'dost-plus' },
  { brand: 'ashok-leyland', brandSlug: 'ashok-leyland', model: 'Bada Dost i2 2510', modelSlug: 'bada-dost-i2' },
  { brand: 'ashok-leyland', brandSlug: 'ashok-leyland', model: 'Bada Dost i3+ 2590', modelSlug: 'bada-dost-i3-plus' },
  { brand: 'ashok-leyland', brandSlug: 'ashok-leyland', model: 'Bada Dost i4 2590', modelSlug: 'bada-dost-i4' },
  { brand: 'ashok-leyland', brandSlug: 'ashok-leyland', model: 'Bada Dost i5 2590', modelSlug: 'bada-dost-i5' },

  // Eicher
  { brand: 'eicher', brandSlug: 'eicher', model: 'Pro X 2610', modelSlug: 'pro-x-2610' },
  { brand: 'eicher', brandSlug: 'eicher', model: 'Pro X 2730', modelSlug: 'pro-x-2730' },
  { brand: 'eicher', brandSlug: 'eicher', model: 'Pro X MSC 3.0T', modelSlug: 'pro-x-msc' },
  { brand: 'eicher', brandSlug: 'eicher', model: 'Pro 2049 2580', modelSlug: 'pro-2049' },
  { brand: 'eicher', brandSlug: 'eicher', model: 'Pro 2049', modelSlug: 'pro-2049-bs6' },

  // Force Motors
  { brand: 'force', brandSlug: 'force', model: 'Trump 40', modelSlug: 'trump-40' },
  { brand: 'force', brandSlug: 'force', model: 'Traveller Delivery Van 4020WB', modelSlug: 'traveller-delivery-van' },

  // Mahindra
  { brand: 'mahindra', brandSlug: 'mahindra', model: 'Jeeto', modelSlug: 'jeeto' },
  { brand: 'mahindra', brandSlug: 'mahindra', model: 'Supro Profit Truck Mini', modelSlug: 'supro-profit-truck-mini' },
  { brand: 'mahindra', brandSlug: 'mahindra', model: 'Veero', modelSlug: 'veero' },
  { brand: 'mahindra', brandSlug: 'mahindra', model: 'Bolero Pik-Up', modelSlug: 'bolero-pik-up' },
  { brand: 'mahindra', brandSlug: 'mahindra', model: 'Bolero Maxx Pik-Up HD', modelSlug: 'bolero-maxx-pik-up' },
  { brand: 'mahindra', brandSlug: 'mahindra', model: 'Bolero Camper Gold', modelSlug: 'bolero-camper-gold' },

  // Maruti Suzuki
  { brand: 'maruti-suzuki', brandSlug: 'maruti-suzuki', model: 'Super Carry', modelSlug: 'super-carry' },

  // Tata
  { brand: 'tata', brandSlug: 'tata', model: 'Ace Pro', modelSlug: 'ace-pro' },
  { brand: 'tata', brandSlug: 'tata', model: 'Ace Gold', modelSlug: 'ace-gold' },
  { brand: 'tata', brandSlug: 'tata', model: 'Ace EV', modelSlug: 'ace-ev' },
  { brand: 'tata', brandSlug: 'tata', model: 'Ace HT+', modelSlug: 'ace-ht-plus' },
  { brand: 'tata', brandSlug: 'tata', model: 'Intra V10', modelSlug: 'intra-v10' },
  { brand: 'tata', brandSlug: 'tata', model: 'Intra V20', modelSlug: 'intra-v20' },
  { brand: 'tata', brandSlug: 'tata', model: 'Intra V20 Gold', modelSlug: 'intra-v20-gold' },
  { brand: 'tata', brandSlug: 'tata', model: 'Intra V30', modelSlug: 'intra-v30-bs6' },
  { brand: 'tata', brandSlug: 'tata', model: 'Yodha Pickup', modelSlug: 'yodha' },
  { brand: 'tata', brandSlug: 'tata', model: 'Yodha 2.0', modelSlug: 'yodha-2' },
];

// ─── CDN URL patterns to try for each model ──────────────────────────────────
function getCandidateUrls(brandSlug, modelSlug) {
  const base = 'https://truckcdn.cardekho.com/in';
  return [
    // Most common pattern (with image ID suffix)
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}.jpg`,
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}-1.jpg`,
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}-front.jpg`,
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}-side.jpg`,
    // Known real URLs from scrape
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}-87579.jpg`,
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}-65562.jpg`,
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}-88671.jpg`,
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}-67228.jpg`,
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}-32200.jpg`,
    `${base}/${brandSlug}/${modelSlug}/${brandSlug}-${modelSlug}-16198.jpg`,
  ];
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        resolve(url);
      } else {
        resolve(null);
      }
      res.destroy();
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlink(destPath, () => {});
        return downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    });
    req.on('error', (err) => { fs.unlink(destPath, () => {}); reject(err); });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ─── TrucksDekho search API ───────────────────────────────────────────────────
function searchTrucksDekho(brandSlug, modelSlug) {
  return new Promise((resolve) => {
    const query = `${brandSlug} ${modelSlug}`.replace(/-/g, ' ');
    const apiUrl = `https://trucks.cardekho.com/api/v1/search?q=${encodeURIComponent(query)}&type=model&count=1`;
    https.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://trucks.cardekho.com/'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const img = json?.data?.[0]?.imageUrl || json?.data?.[0]?.image || null;
          resolve(img);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// ─── Scrape model page for the real image ────────────────────────────────────
function scrapeModelPage(brandSlug, modelSlug) {
  return new Promise((resolve) => {
    const url = `https://trucks.cardekho.com/in/${brandSlug}/${modelSlug}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        // Extract image URLs from HTML
        const patterns = [
          /truckcdn\.cardekho\.com\/in\/[^"'\s]+\.jpg/g,
          /truckcdn\.cardekho\.com\/in\/[^"'\s]+\.png/g,
          /truckcdn\.cardekho\.com\/in\/[^"'\s]+\.webp/g,
        ];
        const found = [];
        for (const pat of patterns) {
          const matches = html.match(pat) || [];
          found.push(...matches.map(u => 'https://' + u));
        }
        // Filter out small thumbnails / logos
        const filtered = found.filter(u =>
          !u.includes('brandLogo') &&
          !u.includes('brand-logo') &&
          !u.includes('/pwa/') &&
          !u.includes('/news/')
        );
        resolve(filtered.length > 0 ? filtered[0] : null);
      });
    }).on('error', () => resolve(null));
  });
}

// ─── Main scraper ─────────────────────────────────────────────────────────────
async function scrapeModels(models, type) {
  const baseDir = path.join(__dirname, '..', 'public', 'images', type);
  const results = { success: [], failed: [] };

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  Scraping ${models.length} ${type} model images`);
  console.log(`${'═'.repeat(60)}\n`);

  for (const item of models) {
    const brandDir = path.join(baseDir, item.brand);
    fs.mkdirSync(brandDir, { recursive: true });

    const filename = `${item.modelSlug}.jpg`;
    const destPath = path.join(brandDir, filename);

    // Skip if already downloaded
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      console.log(`  ⏭  [SKIP] ${item.brand}/${item.model}`);
      results.success.push({ ...item, filename, source: 'cached' });
      continue;
    }

    let imageUrl = null;

    // Strategy 1: Try candidate CDN URLs
    const candidates = getCandidateUrls(item.brandSlug, item.modelSlug);
    for (const url of candidates) {
      const ok = await checkUrl(url);
      if (ok) { imageUrl = ok; break; }
    }

    // Strategy 2: Scrape the model page
    if (!imageUrl) {
      imageUrl = await scrapeModelPage(item.brandSlug, item.modelSlug);
    }

    // Strategy 3: Try alternate brand slug patterns
    if (!imageUrl) {
      const altSlugs = [
        item.brandSlug,
        item.brand,
        item.brand.replace(/-3w$/, '').replace(/-auto$/, '').replace(/-ev$/, ''),
      ];
      for (const bSlug of altSlugs) {
        const url = `https://truckcdn.cardekho.com/in/${bSlug}/${item.modelSlug}/${bSlug}-${item.modelSlug}.jpg`;
        const ok = await checkUrl(url);
        if (ok) { imageUrl = ok; break; }
      }
    }

    if (imageUrl) {
      try {
        await downloadImage(imageUrl, destPath);
        const size = fs.statSync(destPath).size;
        if (size < 2000) {
          fs.unlinkSync(destPath);
          throw new Error('Image too small (likely placeholder)');
        }
        console.log(`  ✅ ${item.brand}/${item.model}`);
        results.success.push({ ...item, filename, source: imageUrl });
      } catch (err) {
        console.log(`  ❌ ${item.brand}/${item.model} — download failed: ${err.message}`);
        results.failed.push({ ...item, error: err.message });
      }
    } else {
      console.log(`  ⚠️  ${item.brand}/${item.model} — no image URL found`);
      results.failed.push({ ...item, error: 'No image URL found' });
    }

    // Small delay to be polite
    await new Promise(r => setTimeout(r, 200));
  }

  return results;
}

async function main() {
  console.log('🚛 TrucksDekho Model Image Scraper');
  console.log('=====================================\n');

  const r3w = await scrapeModels(MODELS_3W, '3w');
  const r4w = await scrapeModels(MODELS_4W, '4w-auto');

  // Save results log
  const log = {
    timestamp: new Date().toISOString(),
    summary: {
      '3w': { total: MODELS_3W.length, success: r3w.success.length, failed: r3w.failed.length },
      '4w-auto': { total: MODELS_4W.length, success: r4w.success.length, failed: r4w.failed.length },
    },
    failed: {
      '3w': r3w.failed,
      '4w-auto': r4w.failed,
    }
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'public', 'images', 'scrape-results.json'),
    JSON.stringify(log, null, 2)
  );

  console.log('\n\n📊 FINAL SUMMARY');
  console.log('══════════════════════════════════════');
  console.log(`3W Models   : ${r3w.success.length}/${MODELS_3W.length} downloaded`);
  console.log(`4W-Auto     : ${r4w.success.length}/${MODELS_4W.length} downloaded`);
  console.log(`\nFailed 3W  : ${r3w.failed.length}`);
  console.log(`Failed 4W  : ${r4w.failed.length}`);
  console.log('\n📂 Images saved to: public/images/3w/ and public/images/4w-auto/');
  console.log('📋 Full results saved to: public/images/scrape-results.json');

  if (r3w.failed.length > 0 || r4w.failed.length > 0) {
    console.log('\n⚠️  Failed models (need manual/browser scraping):');
    [...r3w.failed, ...r4w.failed].forEach(f => {
      console.log(`   - ${f.brand}/${f.model}`);
    });
  }
}

main().catch(console.error);
