// DealerSite Pro — marketplace-style vehicle discovery tab for the landing page.
const DSP_MARKETPLACE_PAGE_SIZE = 48;
const DSP_MARKETPLACE_ENDPOINT = `/api/marketplace?pageSize=${DSP_MARKETPLACE_PAGE_SIZE}&category=all&condition=all`;
const DSP_BRAND_ALIASES = {
  ambasador: 'ambassador',
  ambassador: 'ambassador',
  'bajaj auto': 'bajaj',
  'bajaj auto 3w': 'bajaj',
  'bajaj 3w': 'bajaj',
  'hero motocorp': 'hero',
  'honda motorcycle and scooter india': 'honda motorcycles',
  'honda motorcycles and scooters india': 'honda motorcycles',
  'honda city': 'honda',
  'hyundai creta': 'hyundai',
  'maruti suzuki': 'maruti',
  'ola electric': 'ola',
  'piaggio ape': 'piaggio',
  'royal enfield': 'royal enfield',
  'suzuki motorcycle': 'suzuki',
  'tata motors': 'tata',
  'tvs motor': 'tvs',
  'tvs motor company': 'tvs',
  'tvs king': 'tvs',
};
const DSP_BRAND_LOGOS = {
  acura: '/assets/logos/acura.png',
  ambasador: '/assets/logos/ambassador.svg',
  ambassador: '/assets/logos/ambassador.svg',
  aprilia: '/assets/logos/2w/aprilia.svg',
  'ashok leyland': '/assets/logos/ashok-leyland.png',
  'aston martin': '/assets/logos/aston-martin.svg',
  ather: '/assets/logos/2w/ather-energy.svg',
  'ather energy': '/assets/logos/2w/ather-energy.svg',
  audi: '/assets/logos/audi.png',
  bajaj: '/assets/logos/2w/bajaj-auto.svg',
  'bajaj auto': '/assets/logos/2w/bajaj-auto.svg',
  bentley: '/assets/logos/bentley.png',
  bmw: '/assets/logos/bmw.png',
  'bmw motorrad': '/assets/logos/2w/bmw-motorrad.svg',
  byd: '/assets/logos/byd.png',
  cfmoto: '/assets/logos/2w/cfmoto.png',
  chevrolet: '/assets/logos/chevrolet.png',
  citroen: '/assets/logos/citroen.png',
  ducati: '/assets/logos/2w/ducati.svg',
  ferrari: '/assets/logos/ferrari.svg',
  force: '/assets/logos/force-motors.png',
  'force motors': '/assets/logos/force-motors.png',
  ford: '/assets/logos/ford.png',
  gmc: '/assets/logos/gmc.png',
  greaves: '/assets/logos/greaves.png',
  'harley davidson': '/assets/logos/2w/harley-davidson.svg',
  hero: '/assets/logos/2w/hero-motocorp.svg',
  'hero motocorp': '/assets/logos/2w/hero-motocorp.svg',
  honda: '/assets/logos/honda.png',
  'honda motorcycles': '/assets/logos/2w/honda-motorcycles.svg',
  husqvarna: '/assets/logos/2w/husqvarna.svg',
  hyundai: '/assets/logos/hyundai.png',
  isuzu: '/assets/logos/isuzu.png',
  jaguar: '/assets/logos/jaguar.png',
  jeep: '/assets/logos/jeep.png',
  kawasaki: '/assets/logos/2w/kawasaki.svg',
  kia: '/assets/logos/kia.png',
  kinetic: '/assets/logos/kinetic.png',
  ktm: '/assets/logos/2w/ktm.svg',
  lamborghini: '/assets/logos/lamborghini.png',
  'land rover': '/assets/logos/land-rover.png',
  lexus: '/assets/logos/lexus.png',
  mahindra: '/assets/logos/mahindra.png',
  maruti: '/assets/logos/maruti-suzuki.png',
  'maruti suzuki': '/assets/logos/maruti-suzuki.png',
  maserati: '/assets/logos/maserati.svg',
  mazda: '/assets/logos/mazda.png',
  'mercedes benz': '/assets/logos/mercedes-benz.png',
  mg: '/assets/logos/mg.png',
  mini: '/assets/logos/mini.png',
  nissan: '/assets/logos/nissan.png',
  ola: '/assets/logos/2w/ola-electric.svg',
  'ola electric': '/assets/logos/2w/ola-electric.svg',
  piaggio: '/assets/logos/piaggio.png',
  porsche: '/assets/logos/porsche.png',
  ram: '/assets/logos/ram.png',
  renault: '/assets/logos/renault.png',
  'rolls royce': '/assets/logos/rolls-royce.svg',
  'royal enfield': '/assets/logos/2w/royal-enfield.svg',
  skoda: '/assets/logos/skoda.png',
  subaru: '/assets/logos/subaru.png',
  suzuki: '/assets/logos/2w/suzuki-motorcycle.png',
  'suzuki motorcycle': '/assets/logos/2w/suzuki-motorcycle.png',
  tata: '/assets/logos/tata-motors.png',
  'tata motors': '/assets/logos/tata-motors.png',
  tesla: '/assets/logos/tesla.png',
  toyota: '/assets/logos/toyota.png',
  triumph: '/assets/logos/2w/triumph.svg',
  tvs: '/assets/logos/2w/tvs-motor.svg',
  'tvs motor': '/assets/logos/2w/tvs-motor.svg',
  vespa: '/assets/logos/2w/vespa.svg',
  vinfast: '/assets/logos/vinfast.png',
  volkswagen: '/assets/logos/volkswagen.png',
  volvo: '/assets/logos/volvo.png',
  vw: '/assets/logos/volkswagen.png',
  yamaha: '/assets/logos/2w/yamaha.svg',
};
const DSP_CATEGORY_BRAND_LOGOS = {
  '2w': {
    ather: '/data/brand-logos/ather-energy.png',
    'ather energy': '/data/brand-logos/ather-energy.png',
    bajaj: '/data/brand-logos/bajaj-auto.png',
    'bajaj auto': '/data/brand-logos/bajaj-auto.png',
    'bajaj chetak': '/data/brand-logos/bajaj-chetak-ev.png',
    'bajaj chetak ev': '/data/brand-logos/bajaj-chetak-ev.png',
    bmw: '/data/brand-logos/bmw-motorrad-india.png',
    'bmw motorrad': '/data/brand-logos/bmw-motorrad-india.png',
    'bmw motorrad india': '/data/brand-logos/bmw-motorrad-india.png',
    greaves: '/data/brand-logos/greaves-mobility.png',
    hero: '/data/brand-logos/hero-motocorp.png',
    'hero motocorp': '/data/brand-logos/hero-motocorp.png',
    'hero electric': '/data/brand-logos/hero-electric.png',
    'hero ev': '/data/brand-logos/hero-ev.png',
    honda: '/data/brand-logos/honda-hmsi.png',
    'honda hmsi': '/data/brand-logos/honda-hmsi.png',
    'honda motorcycles': '/data/brand-logos/honda-hmsi.png',
    'honda motorcycle and scooter india': '/data/brand-logos/honda-hmsi.png',
    indian: '/data/brand-logos/indian-motorcycle.png',
    'indian motorcycle': '/data/brand-logos/indian-motorcycle.png',
    kawasaki: '/data/brand-logos/kawasaki-india.png',
    'kawasaki india': '/data/brand-logos/kawasaki-india.png',
    ktm: '/data/brand-logos/ktm-india.png',
    'ktm india': '/data/brand-logos/ktm-india.png',
    mahindra: '/data/brand-logos/mahindra-two-wheelers.png',
    'mahindra two wheelers': '/data/brand-logos/mahindra-two-wheelers.png',
    ola: '/data/brand-logos/ola-electric.png',
    'ola electric': '/data/brand-logos/ola-electric.png',
    piaggio: '/data/brand-logos/vespa-india.png',
    suzuki: '/data/brand-logos/suzuki-motorcycle.png',
    'suzuki motorcycle': '/data/brand-logos/suzuki-motorcycle.png',
    triumph: '/data/brand-logos/triumph-india.png',
    'triumph india': '/data/brand-logos/triumph-india.png',
    tvs: '/data/brand-logos/tvs-motor.png',
    'tvs motor': '/data/brand-logos/tvs-motor.png',
    'tvs motor company': '/data/brand-logos/tvs-motor-company.png',
    vespa: '/data/brand-logos/vespa-india.png',
    'vespa india': '/data/brand-logos/vespa-india.png',
    yamaha: '/data/brand-logos/yamaha-india.png',
    'yamaha india': '/data/brand-logos/yamaha-india.png',
  },
  '3w': {
    atul: '/data/brand-logos/atul-auto.png',
    'atul auto': '/data/brand-logos/atul-auto.png',
    bajaj: '/data/brand-logos/bajaj-auto-3w.png',
    'bajaj auto': '/data/brand-logos/bajaj-auto-3w.png',
    'bajaj auto 3w': '/data/brand-logos/bajaj-auto-3w.png',
    greaves: '/data/brand-logos/greaves-electric-3w.png',
    'greaves electric': '/data/brand-logos/greaves-electric-3w.png',
    'greaves electric 3w': '/data/brand-logos/greaves-electric-3w.png',
    mahindra: '/data/brand-logos/mahindra-3w.png',
    'mahindra 3w': '/data/brand-logos/mahindra-3w.png',
    'mahindra last mile mobility': '/data/brand-logos/mahindra-last-mile-mobility.png',
    piaggio: '/data/brand-logos/piaggio-ape.png',
    'piaggio ape': '/data/brand-logos/piaggio-ape.png',
    'piaggio vehicles': '/data/brand-logos/piaggio-vehicles.png',
    tvs: '/data/brand-logos/tvs-king.png',
    'tvs king': '/data/brand-logos/tvs-king.png',
  },
  '4w': {
    bajaj: '/data/brand-logos/bajaj-auto.png',
    bmw: '/data/brand-logos/bmw.png',
    honda: '/data/brand-logos/honda.png',
    mahindra: '/data/brand-logos/mahindra.png',
    maruti: '/data/brand-logos/maruti-suzuki.png',
    'maruti suzuki': '/data/brand-logos/maruti-suzuki.png',
    piaggio: '/data/brand-logos/piaggio-vehicles.png',
    suzuki: '/data/brand-logos/maruti-suzuki.png',
    tata: '/data/brand-logos/tata-motors.png',
    'tata motors': '/data/brand-logos/tata-motors.png',
  },
};
const DSP_DATA_BRAND_LOGOS = {
  "aeroride": "/data/brand-logos/aeroride.png",
  "altigreen": "/data/brand-logos/altigreen.png",
  "amo ev": "/data/brand-logos/amo-ev.png",
  "ampere greaves": "/data/brand-logos/ampere-greaves.png",
  "aprilia india": "/data/brand-logos/aprilia-india.png",
  "ather energy": "/data/brand-logos/ather-energy.png",
  "atul auto": "/data/brand-logos/atul-auto.png",
  "audi": "/data/brand-logos/audi.png",
  "avan motors": "/data/brand-logos/avan-motors.png",
  "avera ev": "/data/brand-logos/avera-ev.png",
  "avon e rickshaw": "/data/brand-logos/avon-e-rickshaw.png",
  "avon e vehicles": "/data/brand-logos/avon-e-vehicles.png",
  "baba ev": "/data/brand-logos/baba-ev.png",
  "bahubali e rickshaw": "/data/brand-logos/bahubali-e-rickshaw.png",
  "bajaj auto": "/data/brand-logos/bajaj-auto.png",
  "bajaj auto 3w": "/data/brand-logos/bajaj-auto-3w.png",
  "bajaj chetak ev": "/data/brand-logos/bajaj-chetak-ev.png",
  "battre ev": "/data/brand-logos/battre-ev.png",
  "baxy mobility": "/data/brand-logos/baxy-mobility.png",
  "benelli india": "/data/brand-logos/benelli-india.png",
  "benling": "/data/brand-logos/benling.png",
  "bentley": "/data/brand-logos/bentley.png",
  "bgauss": "/data/brand-logos/bgauss.png",
  "biliti ev": "/data/brand-logos/biliti-ev.png",
  "bmw": "/data/brand-logos/bmw.png",
  "bmw motorrad india": "/data/brand-logos/bmw-motorrad-india.png",
  "bnc motor": "/data/brand-logos/bnc-motor.png",
  "boom motors": "/data/brand-logos/boom-motors.png",
  "bounce infinity": "/data/brand-logos/bounce-infinity.png",
  "brixton": "/data/brand-logos/brixton.png",
  "bsa": "/data/brand-logos/bsa.png",
  "byd": "/data/brand-logos/byd.png",
  "ceeon": "/data/brand-logos/ceeon.png",
  "cfmoto india": "/data/brand-logos/cfmoto-india.png",
  "citroen": "/data/brand-logos/citroen.png",
  "city life ev": "/data/brand-logos/city-life-ev.png",
  "corrit ev": "/data/brand-logos/corrit-ev.png",
  "crayon motors": "/data/brand-logos/crayon-motors.png",
  "dabang": "/data/brand-logos/dabang.png",
  "dandera": "/data/brand-logos/dandera.png",
  "dao ev": "/data/brand-logos/dao-ev.png",
  "deltic": "/data/brand-logos/deltic.png",
  "detel ev": "/data/brand-logos/detel-ev.png",
  "dilli ev": "/data/brand-logos/dilli-ev.png",
  "dilli ev auto": "/data/brand-logos/dilli-ev-auto.png",
  "ducati india": "/data/brand-logos/ducati-india.png",
  "e ashwa": "/data/brand-logos/e-ashwa.png",
  "e sprinto": "/data/brand-logos/e-sprinto.png",
  "earth energy ev": "/data/brand-logos/earth-energy-ev.png",
  "eblu": "/data/brand-logos/eblu.png",
  "eeve": "/data/brand-logos/eeve.png",
  "eka mobility": "/data/brand-logos/eka-mobility.png",
  "enigma automobile": "/data/brand-logos/enigma-automobile.png",
  "etrio": "/data/brand-logos/etrio.png",
  "euler motors": "/data/brand-logos/euler-motors.png",
  "evolet": "/data/brand-logos/evolet.png",
  "fb mondial": "/data/brand-logos/fb-mondial.png",
  "ferrari": "/data/brand-logos/ferrari.png",
  "fidato evtech": "/data/brand-logos/fidato-evtech.png",
  "force motors": "/data/brand-logos/force-motors.png",
  "gaura ev": "/data/brand-logos/gaura-ev.png",
  "gayam motor works": "/data/brand-logos/gayam-motor-works.png",
  "gem ev": "/data/brand-logos/gem-ev.png",
  "gemopai": "/data/brand-logos/gemopai.png",
  "gkon automotive": "/data/brand-logos/gkon-automotive.svg",
  "gravton motors": "/data/brand-logos/gravton-motors.png",
  "greaves electric 3w": "/data/brand-logos/greaves-electric-3w.png",
  "greaves mobility": "/data/brand-logos/greaves-mobility.png",
  "greenrick": "/data/brand-logos/greenrick.png",
  "greta ev": "/data/brand-logos/greta-ev.png",
  "gt force": "/data/brand-logos/gt-force.png",
  "harley davidson india": "/data/brand-logos/harley-davidson-india.png",
  "hayasa e mobility": "/data/brand-logos/hayasa-e-mobility.png",
  "hcd": "/data/brand-logos/hcd.png",
  "hero electric": "/data/brand-logos/hero-electric.png",
  "hero ev": "/data/brand-logos/hero-ev.png",
  "hero motocorp": "/data/brand-logos/hero-motocorp.png",
  "hexall motors": "/data/brand-logos/hexall-motors.png",
  "honda": "/data/brand-logos/honda.png",
  "honda hmsi": "/data/brand-logos/honda-hmsi.png",
  "hop electric": "/data/brand-logos/hop-electric.svg",
  "hop ev": "/data/brand-logos/hop-ev.png",
  "husqvarna india": "/data/brand-logos/husqvarna-india.png",
  "hyundai": "/data/brand-logos/hyundai.png",
  "igowise mobility": "/data/brand-logos/igowise-mobility.png",
  "indian motorcycle": "/data/brand-logos/indian-motorcycle.png",
  "indo wagen": "/data/brand-logos/indo-wagen.png",
  "iscoot": "/data/brand-logos/iscoot.png",
  "isuzu": "/data/brand-logos/isuzu.png",
  "ivoomi energy": "/data/brand-logos/ivoomi-energy.png",
  "jaguar": "/data/brand-logos/jaguar.png",
  "jawa motorcycles": "/data/brand-logos/jawa-motorcycles.png",
  "jeep": "/data/brand-logos/jeep.png",
  "jezza motors": "/data/brand-logos/jezza-motors.png",
  "jitendra ev": "/data/brand-logos/jitendra-ev.png",
  "joy e bike": "/data/brand-logos/joy-e-bike.png",
  "joy e rik": "/data/brand-logos/joy-e-rik.png",
  "jsa": "/data/brand-logos/jsa.png",
  "kabira mobility": "/data/brand-logos/kabira-mobility.png",
  "kawasaki india": "/data/brand-logos/kawasaki-india.png",
  "keeway india": "/data/brand-logos/keeway-india.png",
  "keto motors": "/data/brand-logos/keto-motors.png",
  "khalsa": "/data/brand-logos/khalsa.png",
  "kia": "/data/brand-logos/kia.png",
  "kinetic green": "/data/brand-logos/kinetic-green.png",
  "komaki": "/data/brand-logos/komaki.png",
  "ktm india": "/data/brand-logos/ktm-india.png",
  "lamborghini": "/data/brand-logos/lamborghini.png",
  "lambretta": "/data/brand-logos/lambretta.png",
  "land rover": "/data/brand-logos/land-rover.png",
  "lectrix ev": "/data/brand-logos/lectrix-ev.png",
  "lexus": "/data/brand-logos/lexus.png",
  "li ions elektrik": "/data/brand-logos/li-ions-elektrik.png",
  "lohia auto": "/data/brand-logos/lohia-auto.png",
  "mac ev": "/data/brand-logos/mac-ev.png",
  "mahindra": "/data/brand-logos/mahindra.png",
  "mahindra 3w": "/data/brand-logos/mahindra-3w.png",
  "mahindra last mile mobility": "/data/brand-logos/mahindra-last-mile-mobility.png",
  "mahindra two wheelers": "/data/brand-logos/mahindra-two-wheelers.png",
  "maruti suzuki": "/data/brand-logos/maruti-suzuki.png",
  "maserati": "/data/brand-logos/maserati.png",
  "matter ev": "/data/brand-logos/matter-ev.png",
  "mayuri rickshaw": "/data/brand-logos/mayuri-rickshaw.png",
  "mercedes benz": "/data/brand-logos/mercedes-benz.png",
  "mg": "/data/brand-logos/mg.png",
  "mini": "/data/brand-logos/mini.png",
  "mini metro ev": "/data/brand-logos/mini-metro-ev.png",
  "montra ev": "/data/brand-logos/montra-ev.png",
  "moto guzzi": "/data/brand-logos/moto-guzzi.png",
  "moto morini": "/data/brand-logos/moto-morini.png",
  "motovolt": "/data/brand-logos/motovolt.png",
  "nds eco motors": "/data/brand-logos/nds-eco-motors.png",
  "nissan": "/data/brand-logos/nissan.png",
  "numeros motors": "/data/brand-logos/numeros-motors.png",
  "oben electric": "/data/brand-logos/oben-electric.png",
  "oben ev": "/data/brand-logos/oben-ev.png",
  "odysse electric": "/data/brand-logos/odysse-electric.png",
  "odysse ev": "/data/brand-logos/odysse-ev.png",
  "okaya ev": "/data/brand-logos/okaya-ev.png",
  "okinawa autotech": "/data/brand-logos/okinawa-autotech.webp",
  "ola electric": "/data/brand-logos/ola-electric.png",
  "ola ev": "/data/brand-logos/ola-ev.png",
  "omega seiki mobility": "/data/brand-logos/omega-seiki-mobility.png",
  "one moto": "/data/brand-logos/one-moto.png",
  "opg mobility": "/data/brand-logos/opg-mobility.png",
  "oreva": "/data/brand-logos/oreva.png",
  "osm": "/data/brand-logos/osm.png",
  "panther": "/data/brand-logos/panther.png",
  "piaggio ape": "/data/brand-logos/piaggio-ape.png",
  "piaggio vehicles": "/data/brand-logos/piaggio-vehicles.png",
  "poise": "/data/brand-logos/poise.png",
  "porsche": "/data/brand-logos/porsche.png",
  "prevail ev": "/data/brand-logos/prevail-ev.png",
  "pur energy": "/data/brand-logos/pur-energy.png",
  "pure ev": "/data/brand-logos/pure-ev.svg",
  "qj motor india": "/data/brand-logos/qj-motor-india.png",
  "quantum energy": "/data/brand-logos/quantum-energy.png",
  "raftaar ev": "/data/brand-logos/raftaar-ev.png",
  "rajhans": "/data/brand-logos/rajhans.png",
  "raptee": "/data/brand-logos/raptee.png",
  "raptee energy": "/data/brand-logos/raptee-energy.png",
  "renault": "/data/brand-logos/renault.png",
  "revolt motors": "/data/brand-logos/revolt-motors.png",
  "river ev": "/data/brand-logos/river-ev.png",
  "rolls royce": "/data/brand-logos/rolls-royce.png",
  "royal enfield": "/data/brand-logos/royal-enfield.png",
  "runr": "/data/brand-logos/runr.png",
  "saarthi": "/data/brand-logos/saarthi.png",
  "saera ev": "/data/brand-logos/saera-ev.png",
  "segway": "/data/brand-logos/segway.png",
  "shaktimaan e rickshaw": "/data/brand-logos/shaktimaan-e-rickshaw.png",
  "simple energy": "/data/brand-logos/simple-energy.png",
  "singham": "/data/brand-logos/singham.png",
  "skoda": "/data/brand-logos/skoda.png",
  "skyride": "/data/brand-logos/skyride.png",
  "sn solar energy": "/data/brand-logos/sn-solar-energy.png",
  "sniper ev": "/data/brand-logos/sniper-ev.png",
  "sodyco": "/data/brand-logos/sodyco.png",
  "speego": "/data/brand-logos/speego.png",
  "star": "/data/brand-logos/star.png",
  "stella automobili": "/data/brand-logos/stella-automobili.png",
  "super soco": "/data/brand-logos/super-soco.png",
  "suzuki motorcycle": "/data/brand-logos/suzuki-motorcycle.png",
  "svitch": "/data/brand-logos/svitch.png",
  "sym": "/data/brand-logos/sym.png",
  "tata motors": "/data/brand-logos/tata-motors.png",
  "teja": "/data/brand-logos/teja.png",
  "terra motors": "/data/brand-logos/terra-motors.png",
  "tesla": "/data/brand-logos/tesla.png",
  "thukral ev": "/data/brand-logos/thukral-ev.png",
  "tork motors": "/data/brand-logos/tork-motors.png",
  "toyota": "/data/brand-logos/toyota.png",
  "triton ev": "/data/brand-logos/triton-ev.png",
  "triumph india": "/data/brand-logos/triumph-india.png",
  "tunwal e motors": "/data/brand-logos/tunwal-e-motors.png",
  "tvs iqube": "/data/brand-logos/tvs-iqube.png",
  "tvs king": "/data/brand-logos/tvs-king.png",
  "tvs motor": "/data/brand-logos/tvs-motor.png",
  "tvs motor company": "/data/brand-logos/tvs-motor-company.png",
  "udaan": "/data/brand-logos/udaan.png",
  "ultraviolette": "/data/brand-logos/ultraviolette.png",
  "vande bharat ev": "/data/brand-logos/vande-bharat-ev.png",
  "veectero": "/data/brand-logos/veectero.png",
  "vegh motors": "/data/brand-logos/vegh-motors.png",
  "vespa india": "/data/brand-logos/vespa-india.png",
  "vida hero": "/data/brand-logos/vida-hero.png",
  "vinfast": "/data/brand-logos/vinfast.png",
  "vlf": "/data/brand-logos/vlf.png",
  "volkswagen": "/data/brand-logos/volkswagen.png",
  "volvo": "/data/brand-logos/volvo.png",
  "warivo motors": "/data/brand-logos/warivo-motors.png",
  "wasan e mobility": "/data/brand-logos/wasan-e-mobility.png",
  "yakuza ev": "/data/brand-logos/yakuza-ev.png",
  "yamaha india": "/data/brand-logos/yamaha-india.png",
  "yc ev": "/data/brand-logos/yc-ev.png",
  "yezdi motorcycles": "/data/brand-logos/yezdi-motorcycles.png",
  "yo electric": "/data/brand-logos/yo-electric.png",
  "yobykes": "/data/brand-logos/yobykes.png",
  "youdha": "/data/brand-logos/youdha.png",
  "yulu": "/data/brand-logos/yulu.png",
  "zelio": "/data/brand-logos/zelio.png",
  "zen mobility": "/data/brand-logos/zen-mobility.png",
  "zero21": "/data/brand-logos/zero21.png",
  "zontes india": "/data/brand-logos/zontes-india.png",
};
const DSP_FALLBACK_IMAGES = {
  car: '',
  suv: '',
  csuv: '',
  sedan: '',
  hatch: '',
  mpv: '',
  bike: '',
  scooter: '',
  auto: '',
  ev: '',
};

const DSP_LOCAL_MODEL_IMAGE_OVERRIDES = [
  ['4w', ['ferrari'], ['12cilindri'], '/data/brand-model-images/4w/ferrari/amalfi.jpg'],
  ['4w', ['ferrari'], ['ferrari 12cilindri'], '/data/brand-model-images/4w/ferrari/amalfi.jpg'],
  ['3w', ['altigreen'], ['neev bhai flatbed'], '/images/3w/altigreen/neev-bhai-flatbed.jpg'],
  ['3w', ['altigreen'], ['neev bhai low deck'], '/images/3w/altigreen/neev-bhai-low-deck.jpg'],
  ['3w', ['altigreen'], ['neev flatbed'], '/images/3w/altigreen/neev-flatbed.jpg'],
  ['3w', ['altigreen'], ['neev high deck'], '/images/3w/altigreen/neev-high-deck.jpg'],
  ['3w', ['altigreen'], ['neev low deck'], '/images/3w/altigreen/neev-low-deck.jpg'],
  ['3w', ['altigreen'], ['neev rahi'], '/images/3w/altigreen/neev-rahi.jpg'],
  ['3w', ['altigreen'], ['neev tez'], '/images/3w/altigreen/neev-tez.jpg'],
  ['3w', ['mahindra'], ['alfa champ'], '/images/3w/mahindra-3w/alfa-champ.jpg'],
  ['3w', ['mahindra'], ['alfa comfy'], '/images/3w/mahindra-3w/alfa-comfy.jpg'],
  ['3w', ['mahindra'], ['alfa dx duo'], '/images/3w/mahindra-3w/alfa-dx-duo.jpg'],
  ['3w', ['mahindra'], ['alfa dx'], '/images/3w/mahindra-3w/alfa-dx.jpg'],
  ['3w', ['mahindra'], ['alfa plus duo'], '/data/brand-model-images/mahindra-last-mile-mobility/alfa-plus-duo.png'],
  ['3w', ['mahindra'], ['alfa plus'], '/images/3w/mahindra-3w/alfa-plus.jpg'],
  ['3w', ['mahindra'], ['alfa load'], '/images/3w/mahindra-3w/alfa-load.jpg'],
  ['3w', ['mahindra'], ['e alfa cargo'], '/images/3w/mahindra-3w/e-alfa-cargo.jpg'],
  ['3w', ['mahindra'], ['e alfa mini'], '/images/3w/mahindra-3w/e-alfa-mini.jpg'],
  ['3w', ['mahindra'], ['e alfa plus'], '/images/3w/mahindra-3w/e-alfa-plus.jpg'],
  ['3w', ['mahindra'], ['e alfa super'], '/images/3w/mahindra-3w/e-alfa-super.jpg'],
  ['3w', ['mahindra'], ['treo yaari cargo'], '/images/3w/mahindra-3w/treo-yaari-cargo.jpg'],
  ['3w', ['mahindra'], ['treo yaari passenger'], '/images/3w/mahindra-3w/treo-yaari-passenger.jpg'],
  ['3w', ['mahindra'], ['treo yaari'], '/images/3w/mahindra-3w/treo-yaari.jpg'],
  ['3w', ['mahindra'], ['treo plus'], '/images/3w/mahindra-3w/treo-plus.jpg'],
  ['3w', ['mahindra'], ['treo zor'], '/images/3w/mahindra-3w/treo-zor.jpg'],
  ['3w', ['mahindra'], ['treo'], '/images/3w/mahindra-3w/treo.jpg'],
  ['3w', ['mahindra'], ['zor grand range plus'], '/images/3w/mahindra-3w/zor-grand-range-plus.jpg'],
  ['3w', ['mahindra'], ['zor grand'], '/images/3w/mahindra-3w/zor-grand.jpg'],
  ['3w', ['mahindra'], ['udo'], '/images/3w/mahindra-3w/udo.jpg'],
];

function marketplacePageUrl(page = 1, condition = 'all') {
  const params = new URLSearchParams({
    pageSize: String(DSP_MARKETPLACE_PAGE_SIZE),
    page: String(page),
    category: 'all',
    condition,
  });
  return `/api/marketplace?${params.toString()}`;
}

function isBadVehicleImageUrl(url) {
  const value = compactText(url).toLowerCase();
  const normalizedPath = value
    .split('?')[0]
    .replace(/\.(?:avif|webp|png|jpe?g)$/i, '');
  if (!value) return true;
  return [
    'whatsapp',
    'logo',
    'avatar',
    'icon',
    'placeholder',
    'stimg.cardekho.com/images/carexteriorimages',
    'dealer-assets/dealers',
    '/assets/cars/aston-martin/db11',
    '/assets/cars/aston-martin/aston-martin-db11',
    '/assets/cars/aston-martin/dbs-superleggera',
    '/assets/cars/mclaren/750s',
    '/assets/cars/bmw/8-series-gran-coupe',
    '/assets/cars/ferrari/12cilindri',
    '/assets/cars/ferrari/ferrari-12cilindri',
    '/assets/cars/bugatti/divo',
    '/assets/cars/bugatti/bugatti-divo',
    '/data/brand-model-images/4w/ferrari/12cilindri',
    '/data/brand-model-images/4w/ferrari/ferrari-12cilindri',
    '/data/brand-model-images/4w/bugatti/divo',
    '/data/brand-model-images/4w/bugatti/bugatti-divo',
    '/data/brand-model-images/4w/aston-martin/dbs-superleggera',
    '/data/brand-model-images/4w/aston-martin/aston-martin-dbs-superleggera',
    '/data/brand-model-images/4w/citroen/a',
    '/data/brand-model-images/4w/citroen/citroen-a',
    '/data/brand-model-images/4w/tata/indigo',
    '/data/brand-model-images/4w/tata/tata-indigo',
    '/data/brand-model-images/3w/altigreen/neev-bhai-flatbed',
    '/data/brand-model-images/3w/altigreen/neev-flatbed',
    '/data/brand-model-images/3w/altigreen/neev-bhai-low-deck',
    '/data/brand-model-images/3w/altigreen/neev-high-deck',
    '/data/brand-model-images/3w/altigreen/neev-bhai',
    '/data/brand-model-images/3w/altigreen/neev-bhai-low',
    '/data/brand-model-images/3w/altigreen/neev-high',
  ].some((token) => value.includes(token) || normalizedPath.includes(token));
}

async function fetchMarketplacePage(page = 1, condition = 'all') {
  const response = await fetch(marketplacePageUrl(page, condition), { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Marketplace API returned ${response.status}`);
  return response.json();
}

async function fetchMarketplaceCondition(condition) {
  const firstPayload = await fetchMarketplacePage(1, condition);
  const firstRows = Array.isArray(firstPayload?.data?.vehicles) ? firstPayload.data.vehicles : [];
  const totalPages = Math.max(1, Number(firstPayload?.data?.totalPages) || 1);
  const restPages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => index + 2);
  const restPayloads = await Promise.all(restPages.map((page) => fetchMarketplacePage(page, condition)));
  const restRows = restPayloads.flatMap((payload) => Array.isArray(payload?.data?.vehicles) ? payload.data.vehicles : []);

  return {
    rows: [...firstRows, ...restRows],
    total: Number(firstPayload?.data?.total) || firstRows.length + restRows.length,
    totalPages,
  };
}

async function fetchAllMarketplaceVehicles() {
  const payloads = [
    await fetchMarketplaceCondition('all').catch(() => ({ rows: [], total: 0, totalPages: 0 })),
    await fetchMarketplaceCondition('used').catch(() => ({ rows: [], total: 0, totalPages: 0 })),
    await fetchMarketplaceCondition('certified_pre_owned').catch(() => ({ rows: [], total: 0, totalPages: 0 })),
  ];
  const seen = new Set();
  const rows = payloads.flatMap((payload) => payload.rows).filter((row) => {
    const key = `${row?.vehicle_category || 'vehicle'}:${row?.condition || 'available'}:${row?.id || ''}`;
    if (!row?.id || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    rows,
    total: payloads.reduce((sum, payload) => sum + (Number(payload.total) || payload.rows.length), 0),
    totalPages: Math.max(...payloads.map((payload) => Number(payload.totalPages) || 0), 1),
  };
}

async function fetchAllFirstHandVehicles() {
  return fetchAllMarketplaceVehicles();
}

function compactText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeBrandKey(value) {
  return compactText(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function simplifyBrandKey(value) {
  return normalizeBrandKey(value)
    .replace(/\b(motors?|motorcycles?|motocorp|automobiles?|auto|electric|cars|india|ltd|limited|pvt|private)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalBrandKey(value) {
  const raw = normalizeBrandKey(value);
  const simple = simplifyBrandKey(value);
  if (DSP_BRAND_ALIASES[raw]) return DSP_BRAND_ALIASES[raw];
  if (DSP_BRAND_ALIASES[simple]) return DSP_BRAND_ALIASES[simple];

  const knownBrands = Object.keys(DSP_BRAND_LOGOS).sort((a, b) => b.length - a.length);
  const rawMatch = knownBrands.find((key) => raw === key || raw.startsWith(`${key} `));
  if (rawMatch) return DSP_BRAND_ALIASES[rawMatch] || rawMatch;

  const simpleMatch = knownBrands.find((key) => simple === key || simple.startsWith(`${key} `));
  if (simpleMatch) return DSP_BRAND_ALIASES[simpleMatch] || simpleMatch;

  return simple || raw;
}

function brandMatchesVehicle(vehicle, selectedBrand) {
  if (selectedBrand === 'All') return true;
  const selected = canonicalBrandKey(selectedBrand);
  return [vehicle.brand, vehicle.brandKey, `${vehicle.brand} ${vehicle.name}`].some((value) => {
    const candidate = canonicalBrandKey(value);
    return candidate === selected || candidate.includes(selected) || selected.includes(candidate);
  });
}

function brandOptionIsSelected(optionBrand, selectedBrand) {
  return selectedBrand !== 'All' && canonicalBrandKey(optionBrand) === canonicalBrandKey(selectedBrand);
}

function validVehicleCategory(value) {
  return value === '2w' || value === '3w' || value === '4w' ? value : '';
}

function brandLogoFor(name, category = '') {
  const raw = normalizeBrandKey(name);
  const simple = simplifyBrandKey(name);
  const canonical = canonicalBrandKey(name);
  const safeCategory = validVehicleCategory(category);
  const categoryLogos = safeCategory ? DSP_CATEGORY_BRAND_LOGOS[safeCategory] : null;
  if (categoryLogos) {
    const categoryKeys = [raw, simple, canonical].filter(Boolean);
    const exactCategoryKey = categoryKeys.find((key) => categoryLogos[key]);
    if (exactCategoryKey) return categoryLogos[exactCategoryKey];

    const categoryMatch = Object.keys(categoryLogos)
      .sort((a, b) => b.length - a.length)
      .find((key) => categoryKeys.some((candidate) => (
        candidate === key
        || candidate.startsWith(`${key} `)
        || candidate.includes(` ${key} `)
        || key.startsWith(`${candidate} `)
      )));
    if (categoryMatch) return categoryLogos[categoryMatch];
  }

  if (DSP_BRAND_LOGOS[raw]) return DSP_BRAND_LOGOS[raw];
  if (DSP_BRAND_LOGOS[simple]) return DSP_BRAND_LOGOS[simple];
  if (DSP_DATA_BRAND_LOGOS[raw]) return DSP_DATA_BRAND_LOGOS[raw];
  if (DSP_DATA_BRAND_LOGOS[simple]) return DSP_DATA_BRAND_LOGOS[simple];

  const rawMatch = Object.keys(DSP_BRAND_LOGOS).find((key) => raw.startsWith(`${key} `) || raw.includes(` ${key} `));
  if (rawMatch) return DSP_BRAND_LOGOS[rawMatch];

  const simpleMatch = Object.keys(DSP_BRAND_LOGOS).find((key) => simple.startsWith(`${key} `) || simple.includes(` ${key} `));
  if (simpleMatch) return DSP_BRAND_LOGOS[simpleMatch];

  const dataRawMatch = Object.keys(DSP_DATA_BRAND_LOGOS).find((key) => raw.startsWith(`${key} `) || raw.includes(` ${key} `));
  if (dataRawMatch) return DSP_DATA_BRAND_LOGOS[dataRawMatch];

  const dataSimpleMatch = Object.keys(DSP_DATA_BRAND_LOGOS).find((key) => simple.startsWith(`${key} `) || simple.includes(` ${key} `));
  return dataSimpleMatch ? DSP_DATA_BRAND_LOGOS[dataSimpleMatch] : '';
}

function brandInitials(name) {
  const words = normalizeBrandKey(name).split(' ').filter(Boolean);
  if (!words.length) return 'BR';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

function displayBrandName(name) {
  const key = normalizeBrandKey(name);
  if (key === 'ambasador') return 'Ambassador';
  if (key === 'honda motorcycle and scooter india') return 'Honda';
  if (key === 'tvs motor company') return 'TVS';
  if (key === 'bajaj auto 3w') return 'Bajaj';
  if (key === 'piaggio ape') return 'Piaggio';
  if (key === 'mahindra 3w') return 'Mahindra';
  return name;
}

function brandPageHrefFor(name, category = '4w') {
  const safeCategory = category === '2w' || category === '3w' || category === '4w' ? category : '4w';
  return `/brands/${encodeURIComponent(name)}?type=${safeCategory}`;
}

function openTopWindowHref(href) {
  const cleanHref = compactText(href);
  if (!cleanHref) return;
  try {
    window.top.location.href = cleanHref;
  } catch {
    window.location.href = cleanHref;
  }
}

function numberFromPaise(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric / 100) : 0;
}

function formatInrShort(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return 'Price on request';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount >= 1000000 ? 2 : 1).replace(/\.0$/, '')}L`;
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function estimateEmi(priceInr) {
  if (!priceInr || priceInr <= 0) return 'Ask dealer';
  return `₹${Math.max(2500, Math.round((priceInr * 0.019) / 50) * 50).toLocaleString('en-IN')}/mo`;
}

function budgetForPrice(priceInr) {
  const lakh = priceInr / 100000;
  if (!priceInr || lakh < 5) return 'Under ₹5L';
  if (lakh < 10) return '₹5-10L';
  if (lakh < 15) return '₹10-15L';
  if (lakh < 20) return '₹15-20L';
  if (lakh < 30) return '₹20-30L';
  return '₹30L+';
}

function normalizeBodyType(row, vehicleType) {
  const body = compactText(row.body_type);
  if (body) return body;
  if (vehicleType === 'Bikes') return 'Motorcycle';
  if (vehicleType === 'Autos') return 'Passenger Auto';
  return 'Car';
}

function inferVehicleType(row) {
  if (row.vehicle_category === '2w') return 'Bikes';
  if (row.vehicle_category === '3w') return 'Autos';
  if (row.vehicle_category === '4w') return 'Cars';
  const text = `${row.make ?? ''} ${row.model ?? ''} ${row.body_type ?? ''} ${row.fuel_type ?? ''}`.toLowerCase();
  if (text.includes('auto') || text.includes('rickshaw') || text.includes('three-wheeler')) return 'Autos';
  if (text.includes('scooter')) return 'Bikes';
  if (text.includes('motorcycle') || text.includes('bike') || text.includes('motocorp') || text.includes('royal enfield') || text.includes('yamaha') || text.includes('tvs')) return 'Bikes';
  if (text.includes('electric') || text.includes('ev')) return 'EVs';
  return 'Cars';
}

function categoryFilterForType(value) {
  const clean = normalizeBrandKey(value);
  if (clean.includes('bike') || clean.includes('scooter') || clean === '2w') return '2w';
  if (clean.includes('auto') || clean.includes('3w') || clean.includes('three wheeler')) return '3w';
  if (clean.includes('car') || clean === '4w' || clean.includes('four wheeler')) return '4w';
  return 'all';
}

function categoryFilterLabel(value) {
  if (value === '2w') return 'Bikes & Scooters';
  if (value === '3w') return 'Autos & 3W';
  if (value === '4w') return 'Cars';
  return 'All vehicle types';
}

function initialVehicleCategoryFilter() {
  try {
    const params = new URLSearchParams(window.location.search);
    const category = compactText(params.get('category') || params.get('type')).toLowerCase();
    if (category === '2w' || category === 'bike' || category === 'bikes') return '2w';
    if (category === '3w' || category === 'auto' || category === 'autos') return '3w';
    if (category === '4w' || category === 'car' || category === 'cars') return '4w';
  } catch {
    return 'all';
  }
  return 'all';
}

function initialVehicleSearchQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    return compactText(params.get('q') || params.get('search'));
  } catch {
    return '';
  }
}

function initialMarketplaceConditionFilter() {
  try {
    const params = new URLSearchParams(window.location.search);
    const condition = normalizeBrandKey(params.get('condition'));
    if (condition === 'new') return 'New';
    if (condition === 'used') return 'Used';
    if (condition === 'certified' || condition === 'certified pre owned' || condition === 'certified_pre_owned') return 'Certified';
  } catch {
    return 'All';
  }
  return 'All';
}

function localModelOverrideImageFor(row) {
  const category = validVehicleCategory(row.vehicle_category);
  const makeKey = canonicalBrandKey(row.make);
  const modelKey = normalizeBrandKey(`${row.model || ''} ${row.variant || ''}`);

  const match = DSP_LOCAL_MODEL_IMAGE_OVERRIDES.find(([entryCategory, makes, models]) => {
    if (entryCategory && entryCategory !== category) return false;
    const makeMatches = makes.some((make) => makeKey === canonicalBrandKey(make));
    if (!makeMatches) return false;
    return models.some((model) => {
      const normalizedModel = normalizeBrandKey(model);
      return modelKey === normalizedModel
        || modelKey.startsWith(`${normalizedModel} `)
        || modelKey.includes(` ${normalizedModel} `);
    });
  });

  return match?.[3] || '';
}

function imageForVehicle(row, vehicleType, bodyType) {
  const localOverrideImage = localModelOverrideImageFor(row);
  if (localOverrideImage) return localOverrideImage;

  const localModelImage = window.dspModelGalleryImageFor?.(row.make, row.model) || '';
  if (compactText(row.condition).toLowerCase() === 'new' && localModelImage && !isBadVehicleImageUrl(localModelImage)) return localModelImage;

  const imageList = Array.isArray(row.image_urls) ? row.image_urls.filter(Boolean) : [];
  const image = [row.image_url, ...imageList]
    .map((item) => compactText(item))
    .find((item) => item && !isBadVehicleImageUrl(item));
  if (image) return image;
  if (localModelImage && !isBadVehicleImageUrl(localModelImage)) return localModelImage;
  return '';
}

function fallbackImageForExplorerVehicle(vehicle) {
  return '';
}

function vehicleImageOrFallback(vehicle) {
  return compactText(vehicle?.image);
}

function vehicleCardImageSourceKind(src) {
  const value = compactText(src).toLowerCase();
  if (value.includes('/storage/v1/object/public/dealer-assets/vehicles/') ||
    value.includes('/storage/v1/object/public/dealer-assets/sell-requests/')) {
    return 'inventory-photo';
  }
  return 'resolved-model';
}

function applyVehicleImageFallback(event, vehicle) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  const card = image.closest('.vrf-vehicle-card, [data-vehicle-card], article');
  if (card && /\b(emi|price|dealer listing|enquire|used|new|fuel|trans|seats)\b/i.test(card.textContent || '')) {
    card.style.display = 'none';
    image.style.display = 'none';
    return;
  }
  image.style.display = 'none';
}

function vehicleImageIdentity(url) {
  const value = compactText(url);
  if (!value) return '';
  try {
    const parsed = new URL(value, window.location.origin);
    return parsed.pathname.toLowerCase().replace(/\/+/g, '/');
  } catch {
    return value.toLowerCase().split('?')[0].replace(/^https?:\/\/[^/]+/i, '').replace(/\/+/g, '/');
  }
}

function vehicleModelIdentity(vehicle) {
  return `${canonicalBrandKey(vehicle?.brand)}|${normalizeBrandKey(vehicle?.name)}`;
}

function isSharedFallbackVehicleImage(url) {
  const key = vehicleImageIdentity(url);
  return !key
    || key.includes('/design-system-handoff/ride-finder-assets/')
    || key.includes('images.unsplash.com');
}

function svgText(value) {
  return compactText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function noVehicleImagePlaceholder(vehicle) {
  return '';
}

function assignUniqueVehicleCardImages(vehicles) {
  return vehicles.map((vehicle) => {
    const image = compactText(vehicle.image);
    return isSharedFallbackVehicleImage(image)
      ? { ...vehicle, image: '', imageWasDeduped: true }
      : vehicle;
  });
}

function vehicleSearchText(vehicle) {
  return `${vehicle.brand} ${displayBrandName(vehicle.brand)} ${vehicle.name} ${vehicle.variant} ${vehicle.type} ${vehicle.fuel} ${vehicle.body} ${vehicle.transmission}`.toLowerCase();
}

function dealerForVehicle(row) {
  return Array.isArray(row.dealers) ? row.dealers[0] : row.dealers;
}

function conditionLabel(condition) {
  if (condition === 'certified_pre_owned') return 'Certified';
  if (condition === 'used') return 'Used';
  if (condition === 'new') return 'New';
  return 'Available';
}

function mapDbVehicleToExplorer(row, index) {
  if (!row || !row.id) return null;
  const dealer = dealerForVehicle(row) ?? {};
  const priceValue = numberFromPaise(row.price_paise);
  const onRoadValue = numberFromPaise(row.on_road_price_paise);
  const vehicleType = inferVehicleType(row);
  const bodyType = normalizeBodyType(row, vehicleType);
  const condition = conditionLabel(row.condition);
  const make = compactText(row.make, 'Dealer');
  const model = compactText(row.model, 'Vehicle');
  const variant = compactText(row.variant) || condition;
  const location = compactText(dealer.location, 'India');
  // Mileage tile: EV range first, then fuel-efficiency (kmpl), then odometer (used cars), else stock status.
  const kmplValue = Number(row.mileage_kmpl) > 0 ? Number(row.mileage_kmpl) : null;
  const rangeValue = Number(row.range_km) > 0 ? Number(row.range_km) : null;
  const odometerValue = Number(row.mileage_km) > 0 ? Number(row.mileage_km) : null;
  let mileageLabel, km;
  if (rangeValue) { mileageLabel = 'Range'; km = `${rangeValue.toLocaleString('en-IN')} km`; }
  else if (kmplValue) { mileageLabel = 'Mileage'; km = `${kmplValue} kmpl`; }
  else if (odometerValue) { mileageLabel = 'Mileage'; km = `${odometerValue.toLocaleString('en-IN')} km`; }
  else { mileageLabel = 'Status'; km = 'Ready stock'; }
  const rawDealerName = compactText(dealer.dealership_name);
  const dealerName = rawDealerName.toLowerCase() === 'dealersite catalog' ? '' : rawDealerName;
  const category = row.vehicle_category === '2w' || row.vehicle_category === '3w' || row.vehicle_category === '4w'
    ? row.vehicle_category
    : vehicleType === 'Bikes'
      ? '2w'
      : vehicleType === 'Autos'
        ? '3w'
        : '4w';

  return {
    id: row.id,
    type: vehicleType,
    category,
    brand: make,
    brandKey: canonicalBrandKey(make),
    name: model,
    variant,
    body: bodyType,
    budget: budgetForPrice(priceValue),
    price: formatInrShort(priceValue),
    onRoad: onRoadValue > 0 ? formatInrShort(onRoadValue) : 'Ask dealer',
    emi: estimateEmi(priceValue),
    image: imageForVehicle(row, vehicleType, bodyType),
    location,
    year: compactText(row.year, 'Recent'),
    fuel: normalizeVehicleOptionLabel(row.fuel_type) || 'Fuel details',
    transmission: normalizeVehicleOptionLabel(row.transmission) || 'Transmission',
    km,
    mileageLabel,
    seats: compactText(row.seating_capacity, vehicleType === 'Bikes' ? '2' : '5'),
    badge: condition,
    condition,
    offer: dealerName,
    priceValue,
    onRoadValue,
    emiValue: priceValue > 0 ? Math.max(2500, Math.round((priceValue * 0.019) / 50) * 50) : 0,
    detailHref: compactText(row.detail_href) || (category === '2w' ? `/bikes/${encodeURIComponent(row.id)}` : category === '3w' ? `/autos/${encodeURIComponent(row.id)}` : `/cars/${encodeURIComponent(row.id)}`),
    brandHref: compactText(row.brand_href) || brandPageHrefFor(make, category),
    sourceIndex: index,
  };
}

function uniqueValues(values, fallback = []) {
  const seen = new Set();
  return [...values, ...fallback]
    .map((item) => compactText(item))
    .filter((item) => {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
}

function normalizeVehicleOptionLabel(value) {
  const raw = compactText(value);
  const key = normalizeBrandKey(raw);
  const canonical = {
    petrol: 'Petrol',
    diesel: 'Diesel',
    cng: 'CNG',
    lpg: 'LPG',
    electric: 'Electric',
    hybrid: 'Hybrid',
    'cng petrol': 'CNG + Petrol',
    'petrol cng': 'CNG + Petrol',
    manual: 'Manual',
    automatic: 'Automatic',
    amt: 'AMT',
    cvt: 'CVT',
    dct: 'DCT',
  };
  return canonical[key] || raw;
}

function uniqueVehicleValues(vehicles, field, fallback = []) {
  const seen = new Set();
  return vehicles
    .map((vehicle) => normalizeVehicleOptionLabel(vehicle[field]))
    .filter((item) => {
      const key = normalizeBrandKey(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}

function conditionMatchesVehicle(vehicle, selectedCondition) {
  if (selectedCondition === 'All') return true;
  return normalizeBrandKey(vehicle.condition || vehicle.badge) === normalizeBrandKey(selectedCondition);
}

function vehicleConditionBreakdownLabel(vehicles) {
  const counts = vehicles.reduce((acc, vehicle) => {
    const key = conditionLabelFromDisplay(vehicle.condition);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return [
    counts.New ? `${counts.New} new` : '',
    counts.Used ? `${counts.Used} used` : '',
    counts.Certified ? `${counts.Certified} certified` : '',
  ].filter(Boolean).join(' / ');
}

function conditionLabelFromDisplay(value) {
  const key = normalizeBrandKey(value);
  if (key === 'certified' || key === 'certified pre owned' || key === 'certified_pre_owned') return 'Certified';
  if (key === 'used') return 'Used';
  if (key === 'new') return 'New';
  return 'Available';
}

function isPreOwnedVehicle(vehicle) {
  const label = conditionLabelFromDisplay(vehicle?.condition || vehicle?.badge);
  return label === 'Used' || label === 'Certified';
}

function preOwnedSortRank(vehicle) {
  const label = conditionLabelFromDisplay(vehicle?.condition || vehicle?.badge);
  if (label === 'Used') return 0;
  if (label === 'Certified') return 1;
  if (label === 'New') return 2;
  return 3;
}

function textOptionMatches(value, selectedOption) {
  if (selectedOption === 'All') return true;
  const source = normalizeBrandKey(value);
  const selected = normalizeBrandKey(selectedOption);
  return source === selected || source.includes(selected) || selected.includes(source);
}

function vehicleCountFor(vehicles, predicate) {
  return vehicles.filter(predicate).length;
}

function locationCity(location) {
  return compactText(location, 'India').split(',')[0].trim() || 'India';
}

function uniqueDealerCards(vehicles) {
  const seen = new Set();
  return vehicles
    .map((vehicle) => ({
      name: compactText(vehicle.offer, 'DealerSite partner'),
      location: compactText(vehicle.location, 'India'),
      brands: vehicle.brand,
      image: vehicle.image,
    }))
    .filter((dealer) => {
      const key = `${dealer.name}-${dealer.location}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function ExplorerToggle({ mode, setMode }) {
  const isBuilder = mode === 'builder';
  const targetMode = isBuilder ? 'vehicles' : 'builder';
  const label = isBuilder ? 'Vehicle Search' : 'Website Builder';
  const Icon = isBuilder ? window.Icons.car : window.Icons.template;

  return (
    <button
      type="button"
      className="dsp-floating-mode-switch"
      data-label={label}
      aria-label={`Open ${label}`}
      title={label}
      onClick={() => {
        setMode(targetMode);
        window.requestAnimationFrame(() => {
          try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch {
            window.scrollTo(0, 0);
          }
        });
      }}
    >
      <Icon size={22} />
    </button>
  );
}

function FilterButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        minHeight: 38,
        border: active ? '1px solid var(--ink-900)' : '1px solid var(--border-default)',
        borderRadius: 'var(--radius-full)',
        background: active ? 'var(--ink-900)' : 'var(--surface-card)',
        color: active ? 'var(--cream-50)' : 'var(--text-strong)',
        padding: '0 18px',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 850,
        cursor: 'pointer',
        boxShadow: active ? 'var(--shadow-md)' : 'none',
      }}
    >
      {children}
    </button>
  );
}

function BrandLogoMark({ name, active, category = '' }) {
  const [failed, setFailed] = React.useState(false);
  const logo = brandLogoFor(name, category);
  const showLogo = logo && !failed;

  return (
    <span
      style={{
        width: 54,
        height: 54,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 18,
        border: active ? '1px solid rgba(255,253,247,0.2)' : '1px solid var(--border-subtle)',
        background: active ? 'rgba(255,253,247,0.14)' : 'var(--surface-card)',
        boxShadow: active ? 'none' : '0 10px 22px rgba(11,14,18,0.08)',
        overflow: 'hidden',
        flex: 'none',
      }}
    >
      {showLogo ? (
        <img
          src={logo}
          alt={`${name} logo`}
          onError={() => setFailed(true)}
          style={{ maxWidth: 40, maxHeight: 34, objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <span
          aria-label={`${name} logo placeholder`}
          style={{
            width: 38,
            height: 38,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 14,
            background: active ? 'var(--cream-50)' : 'rgba(178,123,47,0.12)',
            color: active ? 'var(--ink-900)' : 'var(--accent)',
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontWeight: 950,
            letterSpacing: '0',
          }}
        >
          {brandInitials(name)}
        </span>
      )}
    </span>
  );
}

function BrowseRail({ title, items, active, onSelect }) {
  const railLabel = title.replace('Browse by ', '');
  const isBrandRail = railLabel === 'Brand';

  return (
    <section style={{ marginTop: 34 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 2.4vw, 2rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--text-strong)' }}>{title}</h2>
        <button type="button" onClick={() => onSelect('All')} style={{ border: 0, background: 'transparent', color: 'var(--accent)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>View all</button>
      </div>
      <div className="dsp-browse-rail" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
        {items.map((item) => {
          const displayLabel = isBrandRail ? displayBrandName(item) : item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              style={{
                minHeight: isBrandRail ? 126 : 82,
                borderRadius: 'var(--radius-lg)',
                border: active === item ? '1px solid var(--ink-900)' : '1px solid var(--border-subtle)',
                background: active === item ? 'var(--ink-900)' : 'rgba(255,253,247,0.9)',
                color: active === item ? 'var(--cream-50)' : 'var(--text-strong)',
                padding: isBrandRail ? 16 : 14,
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: active === item ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: isBrandRail ? 'space-between' : 'center',
                gap: isBrandRail ? 12 : 0,
              }}
            >
              {isBrandRail ? <BrandLogoMark name={displayLabel} active={active === item} /> : null}
              <span>
                <span style={{ display: 'block', fontSize: 11, color: active === item ? 'var(--bronze-400)' : 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{railLabel}</span>
                <span style={{ display: 'block', marginTop: 8, fontSize: 15, lineHeight: 1.2 }}>{displayLabel}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FilterPill({ active, children, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        minHeight: 34,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        borderRadius: 'var(--radius-md)',
        border: active ? '1px solid rgba(178,123,47,0.55)' : '1px solid var(--border-subtle)',
        background: active ? 'rgba(178,123,47,0.12)' : 'var(--surface-card)',
        color: active ? 'var(--accent)' : 'var(--text-body)',
        padding: '0 10px',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 900,
        cursor: 'pointer',
      }}
    >
      <span>{children}</span>
      {Number.isFinite(count) ? <span style={{ color: active ? 'var(--accent)' : 'var(--text-muted)', fontSize: 10, fontWeight: 950 }}>{count}</span> : null}
    </button>
  );
}

function FilterGroup({ icon, title, children }) {
  return (
    <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
      <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.11em', color: 'var(--text-strong)' }}>
        {icon} {title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {children}
      </div>
    </section>
  );
}

function MarketplaceFilterRail({
  vehicles,
  browseBudgets,
  browseBrands,
  browseBodies,
  budget,
  brand,
  body,
  fuel,
  transmission,
  seats,
  condition,
  setBudget,
  selectBrand,
  setBody,
  setFuel,
  setTransmission,
  setSeats,
  setCondition,
  clearFilters,
}) {
  const [brandSearch, setBrandSearch] = React.useState('');
  const fuelOptions = uniqueVehicleValues(vehicles, 'fuel');
  const transmissionOptions = uniqueVehicleValues(vehicles, 'transmission');
  const seatOptions = uniqueValues(vehicles.map((vehicle) => compactText(vehicle.seats))).slice(0, 7);
  const conditionOptions = uniqueVehicleValues(vehicles, 'condition');
  const visibleBrands = browseBrands
    .filter((item) => !brandSearch.trim() || normalizeBrandKey(displayBrandName(item)).includes(normalizeBrandKey(brandSearch)))
    .slice(0, 8);

  return (
    <aside className="dsp-filter-rail" style={{ alignSelf: 'start', position: 'sticky', top: 'calc(var(--dsp-topnav-height) + 96px)', display: 'grid', gap: 16, maxHeight: 'calc(100vh - var(--dsp-topnav-height) - 116px)', overflow: 'auto', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-lg)', padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <p style={{ margin: 0, color: 'var(--accent)', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.13em' }}>Finder controls</p>
          <h2 style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 950, letterSpacing: '-0.04em', color: 'var(--text-strong)' }}>Filters</h2>
        </div>
        <button type="button" onClick={clearFilters} style={{ border: 0, background: 'transparent', color: 'var(--accent)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 950, cursor: 'pointer' }}>Clear</button>
      </div>

      <FilterGroup icon={<window.Icons.gauge size={15} style={{ color: 'var(--accent)' }} />} title="Price">
        {browseBudgets.slice(0, 6).map((item) => (
          <FilterPill key={item} active={budget === item} count={vehicleCountFor(vehicles, (vehicle) => vehicle.budget === item)} onClick={() => setBudget(budget === item ? 'All' : item)}>
            {item}
          </FilterPill>
        ))}
      </FilterGroup>

      <FilterGroup icon={<window.Icons.brands size={15} style={{ color: 'var(--accent)' }} />} title="Brand">
        <label style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, minHeight: 36, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--cream-100)', padding: '0 10px' }}>
          <window.Icons.search size={14} style={{ color: 'var(--text-muted)', flex: 'none' }} />
          <input value={brandSearch} onChange={(event) => setBrandSearch(event.target.value)} placeholder="Search brand..." style={{ width: '100%', border: 0, outline: 0, background: 'transparent', color: 'var(--text-strong)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 800 }} />
        </label>
        {visibleBrands.map((item) => (
          <FilterPill key={item} active={brand === item} count={vehicleCountFor(vehicles, (vehicle) => brandMatchesVehicle(vehicle, item))} onClick={() => selectBrand(brand === item ? 'All' : item)}>
            {displayBrandName(item)}
          </FilterPill>
        ))}
      </FilterGroup>

      <FilterGroup icon={<window.Icons.car size={15} style={{ color: 'var(--accent)' }} />} title="Body Type">
        {browseBodies.slice(0, 10).map((item) => (
          <FilterPill key={item} active={body === item} count={vehicleCountFor(vehicles, (vehicle) => vehicle.body === item)} onClick={() => setBody(body === item ? 'All' : item)}>
            {item}
          </FilterPill>
        ))}
      </FilterGroup>

      <FilterGroup icon={<window.Icons.fuel size={15} style={{ color: 'var(--accent)' }} />} title="Fuel">
        {fuelOptions.map((item) => (
          <FilterPill key={item} active={fuel === item} count={vehicleCountFor(vehicles, (vehicle) => textOptionMatches(vehicle.fuel, item))} onClick={() => setFuel(fuel === item ? 'All' : item)}>
            {item}
          </FilterPill>
        ))}
      </FilterGroup>

      <FilterGroup icon={<window.Icons.dashboard size={15} style={{ color: 'var(--accent)' }} />} title="Transmission">
        {transmissionOptions.map((item) => (
          <FilterPill key={item} active={transmission === item} count={vehicleCountFor(vehicles, (vehicle) => textOptionMatches(vehicle.transmission, item))} onClick={() => setTransmission(transmission === item ? 'All' : item)}>
            {item}
          </FilterPill>
        ))}
      </FilterGroup>

      <FilterGroup icon={<window.Icons.used size={15} style={{ color: 'var(--accent)' }} />} title="Seating">
        {seatOptions.map((item) => (
          <FilterPill key={item} active={seats === item} count={vehicleCountFor(vehicles, (vehicle) => compactText(vehicle.seats) === item)} onClick={() => setSeats(seats === item ? 'All' : item)}>
            {item} seats
          </FilterPill>
        ))}
      </FilterGroup>

      <FilterGroup icon={<window.Icons.check size={15} style={{ color: 'var(--accent)' }} />} title="Availability">
        {conditionOptions.map((item) => (
          <FilterPill key={item} active={condition === item} count={vehicleCountFor(vehicles, (vehicle) => conditionMatchesVehicle(vehicle, item))} onClick={() => setCondition(item)}>
            {item}
          </FilterPill>
        ))}
      </FilterGroup>
    </aside>
  );
}

function MarketConditionToggle({ condition, setCondition }) {
  const options = ['All', 'Used', 'Certified', 'New'];

  return (
    <div role="group" aria-label="Vehicle condition" style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, minHeight: 42, minWidth: 268, padding: 4, borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,253,247,0.16)', background: 'rgba(255,253,247,0.08)' }}>
      {options.map((option) => {
        const active = condition === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => setCondition(option)}
            style={{
              border: 0,
              minHeight: 34,
              borderRadius: 'var(--radius-full)',
              background: active ? 'var(--cream-50)' : 'transparent',
              color: active ? 'var(--ink-900)' : 'var(--text-on-dark-muted)',
              padding: '0 12px',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 950,
              cursor: 'pointer',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
              transition: 'all 160ms var(--ease-out)',
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function MarketplaceNav({ query, setQuery, city, condition, setCondition, onMenuOpen = () => {}, onCityClick = () => {} }) {
  const navItems = [
    ['#listing', 'Vehicles'],
    ['#launches', 'Launches'],
    ['#ev-zone', 'EV Zone'],
    ['#finance', 'EMI Calculator'],
    ['#dealers', 'Dealers'],
  ];

  return (
    <nav className="dsp-market-nav" style={{ position: 'sticky', top: 'var(--dsp-topnav-height)', zIndex: 58, borderBottom: '1px solid rgba(255,253,247,0.12)', background: 'rgba(11,14,18,0.86)', backdropFilter: 'blur(18px)' }}>
      <window.Container wide>
        <div style={{ minHeight: 74, display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr) auto', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button type="button" aria-label="Vehicle search menu" onClick={onMenuOpen} style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,253,247,0.16)', background: 'rgba(255,253,247,0.08)', color: 'var(--cream-50)', cursor: 'pointer' }}>
              <window.Icons.menu size={18} />
            </button>
            <a href="#market-top" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--cream-50)', minWidth: 0 }}>
              <span style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: '13px', background: 'var(--cream-50)', color: 'var(--ink-900)', boxShadow: 'var(--shadow-sm)' }}>
                <window.Icons.car size={19} />
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 950, letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>DealerSite Market</span>
            </a>
          </div>

          <div className="dsp-market-nav-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, minWidth: 0 }}>
            <div className="dsp-market-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navItems.map(([href, label]) => (
                <a key={href} href={href} style={{ minHeight: 38, display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--radius-full)', padding: '0 12px', textDecoration: 'none', color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 850, whiteSpace: 'nowrap' }}>{label}</a>
              ))}
            </div>
            <label className="dsp-market-nav-search" style={{ display: 'flex', alignItems: 'center', gap: 9, width: 'min(360px, 100%)', minHeight: 42, borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,253,247,0.14)', background: 'rgba(255,253,247,0.1)', padding: '0 14px', color: 'var(--cream-50)' }}>
              <window.Icons.search size={16} style={{ color: 'var(--bronze-400)', flex: 'none' }} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search vehicles..." style={{ width: '100%', border: 0, outline: 0, background: 'transparent', color: 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 800 }} />
            </label>
          </div>

          <div className="dsp-market-nav-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={onCityClick} style={{ minHeight: 42, display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,253,247,0.16)', background: 'rgba(255,253,247,0.08)', color: 'var(--cream-50)', padding: '0 13px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>
              <window.Icons.mapPin size={16} /> {city}
            </button>
            <MarketConditionToggle condition={condition} setCondition={setCondition} />
          </div>
        </div>
      </window.Container>
    </nav>
  );
}

function MarketplaceMetricStrip({ vehicles, brands, bodies, city }) {
  const items = [
    [`${vehicles.length}+`, 'Live DB listings'],
    [`${brands.length}`, 'Brands visible'],
    [`${bodies.length}`, 'Body styles'],
    [city, 'Current market'],
  ];

  return (
    <section style={{ marginTop: 24, borderRadius: 'var(--radius-2xl)', border: '1px solid rgba(255,253,247,0.12)', background: 'rgba(255,253,247,0.08)', overflow: 'hidden' }}>
      <div className="dsp-market-action-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        {items.map(([value, label], index) => (
          <div key={label} style={{ padding: '18px 20px', borderLeft: index === 0 ? 0 : '1px solid rgba(255,253,247,0.12)' }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 950, letterSpacing: '-0.04em', color: 'var(--cream-50)' }}>{value}</p>
            <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 850, color: 'var(--text-on-dark-muted)' }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function VehicleCard({ vehicle, selected, onCompare, onEnquire }) {
  const specs = [vehicle.year, vehicle.fuel, vehicle.transmission, vehicle.km, `${vehicle.seats} seats`].filter(Boolean);
  const imageSrc = vehicleImageOrFallback(vehicle);
  if (!imageSrc) return null;
  return (
    <article style={{ overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ position: 'relative', minHeight: 210, background: 'var(--cream-200)', overflow: 'hidden' }}>
        <img
          src={imageSrc}
          alt={`${vehicle.brand} ${vehicle.name}`}
          onError={(event) => applyVehicleImageFallback(event, vehicle)}
          style={{ width: '100%', height: 230, objectFit: 'cover', display: 'block' }}
        />
        {vehicle.badge && (
          <span style={{ position: 'absolute', left: 14, top: 14, borderRadius: 'var(--radius-full)', background: 'var(--ink-900)', color: 'var(--cream-50)', padding: '7px 11px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 900 }}>{vehicle.badge}</span>
        )}
        {vehicle.offer && (
          <span style={{ position: 'absolute', left: 14, bottom: 14, borderRadius: 'var(--radius-full)', background: 'rgba(255,253,247,0.94)', color: 'var(--accent)', padding: '7px 11px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 900 }}>{vehicle.offer}</span>
        )}
        <span style={{ position: 'absolute', right: 14, bottom: 14, borderRadius: 'var(--radius-full)', background: 'rgba(11,14,18,0.84)', color: 'var(--cream-50)', padding: '7px 10px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 900 }}>360°</span>
      </div>

      <div style={{ padding: 18 }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 900, color: 'var(--accent)' }}>{vehicle.brand}</p>
        <h3 style={{ margin: '5px 0 0', fontFamily: 'var(--font-display)', fontSize: 25, fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--text-strong)' }}>{vehicle.name}</h3>
        <p style={{ margin: '3px 0 0', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{vehicle.variant}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {specs.map((spec) => (
            <span key={spec} style={{ borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', background: 'var(--cream-100)', padding: '6px 9px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 850, color: 'var(--text-body)' }}>{spec}</span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          {[
            ['Listed price', vehicle.price],
            ['On-road', vehicle.onRoad],
            ['EMI from', vehicle.emi],
          ].map(([label, value]) => (
            <div key={label}>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)' }}>{label}</p>
              <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 900, color: 'var(--text-strong)' }}>{value}</p>
            </div>
          ))}
        </div>

        <label style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 850, color: 'var(--text-body)', cursor: 'pointer' }}>
          <input type="checkbox" checked={selected} onChange={() => onCompare(vehicle.id)} />
          Compare
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <button type="button" onClick={() => onEnquire(vehicle.id, 'Test drive request ready')} style={{ minHeight: 44, border: 0, borderRadius: 'var(--radius-md)', background: 'var(--ink-900)', color: 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>Test Drive</button>
          <button type="button" onClick={() => onEnquire(vehicle.id, 'On-road price request ready')} style={{ minHeight: 44, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', color: 'var(--text-strong)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 900, cursor: 'pointer' }}>On-Road Price</button>
        </div>
      </div>
    </article>
  );
}

function LaunchesSection({ vehicles, onNotify }) {
  const launchVehicles = [...vehicles]
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 3);

  return (
    <window.Reveal id="launches" style={{ paddingTop: 56 }}>
      <section style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.4rem)', fontWeight: 950, letterSpacing: '-0.045em', color: 'var(--text-strong)' }}>New launches & coming soon</h2>
            <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 750, color: 'var(--text-body)' }}>Fresh arrivals from your connected marketplace inventory.</p>
          </div>
          <a href="#listing" style={{ color: 'var(--accent)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 950, textDecoration: 'none' }}>View all vehicles</a>
        </div>
        <div className="dsp-market-launch-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
          {launchVehicles.map((vehicle, index) => (
            <article key={vehicle.id} style={{ overflow: 'hidden', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', background: index === 2 ? 'var(--ink-900)' : 'var(--surface-card)', color: index === 2 ? 'var(--cream-50)' : 'var(--text-strong)', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ height: 210, position: 'relative', overflow: 'hidden', background: 'var(--cream-200)' }}>
                <img
                  src={vehicleImageOrFallback(vehicle)}
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  onError={(event) => applyVehicleImageFallback(event, vehicle)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: index === 2 ? 0.66 : 1 }}
                />
                <span style={{ position: 'absolute', top: 14, left: 14, borderRadius: 'var(--radius-full)', background: index === 2 ? 'var(--cream-50)' : 'var(--ink-900)', color: index === 2 ? 'var(--ink-900)' : 'var(--cream-50)', padding: '7px 11px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 950 }}>{index === 2 ? 'Launching soon' : vehicle.year}</span>
              </div>
              <div style={{ padding: 18 }}>
                <p style={{ margin: 0, color: index === 2 ? 'var(--bronze-400)' : 'var(--accent)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 950 }}>{vehicle.brand}</p>
                <h3 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 950, letterSpacing: '-0.04em' }}>{vehicle.name}</h3>
                <p style={{ margin: '6px 0 0', color: index === 2 ? 'var(--text-on-dark-muted)' : 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 750 }}>{vehicle.variant}</p>
                <button type="button" onClick={() => onNotify(vehicle.id, `${vehicle.brand} ${vehicle.name} launch update ready`)} style={{ marginTop: 18, minHeight: 44, width: '100%', border: 0, borderRadius: 'var(--radius-full)', background: index === 2 ? 'var(--cream-50)' : 'var(--ink-900)', color: index === 2 ? 'var(--ink-900)' : 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 950, cursor: 'pointer' }}>{index === 2 ? 'Notify' : 'View details'}</button>
              </div>
            </article>
          ))}
        </div>
        {launchVehicles.length === 0 && (
          <div style={{ borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-default)', background: 'var(--surface-card)', padding: 26, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 800 }}>
            No launch models are available from the database yet.
          </div>
        )}
      </section>
    </window.Reveal>
  );
}

function EvSpotlight({ vehicle, onExplore }) {
  return (
    <window.Reveal id="ev-zone" style={{ paddingTop: 60 }}>
      <section className="dsp-market-ev-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.95fr) minmax(320px, 0.9fr)', gap: 24, alignItems: 'center', borderRadius: 'var(--radius-3xl)', overflow: 'hidden', background: 'var(--ink-900)', color: 'var(--cream-50)', boxShadow: 'var(--shadow-2xl)' }}>
        <div style={{ padding: 'clamp(26px, 5vw, 54px)' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4.6rem)', lineHeight: 0.95, letterSpacing: '-0.055em' }}>Electric, made simple.</h2>
          <p style={{ margin: '18px 0 0', maxWidth: 560, color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 1.6vw, 1.2rem)', lineHeight: 1.55, fontWeight: 700 }}>Filter by range, condition, dealer availability, and financing. EV listings use the same live marketplace data as the vehicle cards.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginTop: 24 }}>
            {['Live dealer stock', 'EMI estimate', 'Test drive ready'].map((item) => (
              <div key={item} style={{ borderRadius: 'var(--radius-lg)', background: 'rgba(255,253,247,0.1)', padding: 14 }}>
                <window.Icons.check size={16} style={{ color: 'var(--bronze-400)' }} />
                <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 900 }}>{item}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={onExplore} style={{ marginTop: 26, minHeight: 52, border: 0, borderRadius: 'var(--radius-full)', background: 'var(--cream-50)', color: 'var(--ink-900)', padding: '0 22px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 950, cursor: 'pointer' }}>Explore EV listings</button>
        </div>
        <div style={{ minHeight: 420, position: 'relative', overflow: 'hidden' }}>
          <img
            src={vehicleImageOrFallback(vehicle)}
            alt="Featured EV"
            onError={(event) => applyVehicleImageFallback(event, vehicle)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.78 }}
          />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,14,18,0.2), rgba(11,14,18,0.72))' }} />
          <div style={{ position: 'absolute', left: 22, right: 22, bottom: 22, borderRadius: 'var(--radius-xl)', background: 'rgba(255,253,247,0.12)', border: '1px solid rgba(255,253,247,0.16)', padding: 18, backdropFilter: 'blur(14px)' }}>
            <p style={{ margin: 0, color: 'var(--bronze-400)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 950 }}>Featured EV</p>
            <h3 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 950, letterSpacing: '-0.04em' }}>{vehicle.brand} {vehicle.name}</h3>
            <p style={{ margin: '6px 0 0', color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 750 }}>{vehicle.price} · {vehicle.emi}</p>
          </div>
        </div>
      </section>
    </window.Reveal>
  );
}

function FinancePlanner({ vehicle, onEligibility = () => {} }) {
  const [tenure, setTenure] = React.useState(5);
  const [rate, setRate] = React.useState(8.5);
  const principal = vehicle.priceValue > 0 ? vehicle.priceValue : vehicle.onRoadValue > 0 ? vehicle.onRoadValue : 0;
  const months = tenure * 12;
  const monthlyRate = rate / 1200;
  const emi = principal > 0 && monthlyRate > 0
    ? Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1))
    : principal > 0 ? Math.round(principal / months) : 0;

  return (
    <window.Reveal id="finance" style={{ paddingTop: 60 }}>
      <section className="dsp-market-finance-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.86fr) minmax(320px, 1fr)', gap: 24, alignItems: 'stretch' }}>
        <div style={{ borderRadius: 'var(--radius-3xl)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', padding: 'clamp(24px, 4vw, 42px)', boxShadow: 'var(--shadow-xl)' }}>
          <p style={{ margin: 0, color: 'var(--accent)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.13em' }}>EMI Calculator</p>
          <h2 style={{ margin: '12px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.6rem)', lineHeight: 1, fontWeight: 950, letterSpacing: '-0.05em', color: 'var(--text-strong)' }}>Plan your finance with confidence.</h2>
          <p style={{ margin: '14px 0 0', color: 'var(--text-body)', fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.55, fontWeight: 700 }}>Use the live listing price as the starting point and adjust tenure or rate before asking the dealer for exact financing.</p>
        </div>
        <div style={{ borderRadius: 'var(--radius-3xl)', background: 'var(--ink-900)', color: 'var(--cream-50)', padding: 'clamp(24px, 4vw, 42px)', boxShadow: 'var(--shadow-2xl)' }}>
          <p style={{ margin: 0, color: 'rgb(255 253 247 / 0.78)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 850 }}>Selected vehicle</p>
          <h3 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 950, letterSpacing: '-0.04em', color: 'var(--cream-50)' }}>{vehicle.brand} {vehicle.name}</h3>
          <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ borderRadius: 'var(--radius-lg)', background: 'rgba(255,253,247,0.1)', padding: 14 }}>
              <p style={{ margin: 0, color: 'rgb(255 253 247 / 0.78)', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 850 }}>Vehicle price</p>
              <p style={{ margin: '6px 0 0', color: 'var(--cream-50)', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 950 }}>{formatInrShort(principal)}</p>
            </div>
            <div style={{ borderRadius: 'var(--radius-lg)', background: 'rgba(255,253,247,0.1)', padding: 14 }}>
              <p style={{ margin: 0, color: 'rgb(255 253 247 / 0.78)', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 850 }}>Estimated EMI</p>
              <p style={{ margin: '6px 0 0', color: 'var(--cream-50)', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 950 }}>{emi > 0 ? `₹${emi.toLocaleString('en-IN')}` : 'Ask dealer'}</p>
            </div>
          </div>
          <div style={{ marginTop: 22 }}>
            <p style={{ margin: '0 0 10px', color: 'rgb(255 253 247 / 0.78)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 900 }}>Tenure</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[3, 5, 7].map((year) => (
                <button key={year} type="button" onClick={() => setTenure(year)} style={{ minHeight: 42, minWidth: 58, borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,253,247,0.16)', background: tenure === year ? 'var(--cream-50)' : 'rgba(255,253,247,0.08)', color: tenure === year ? 'var(--ink-900)' : 'var(--cream-50)', fontFamily: 'var(--font-body)', fontWeight: 950, cursor: 'pointer' }}>{year}</button>
              ))}
            </div>
          </div>
          <label style={{ display: 'block', marginTop: 20, color: 'rgb(255 253 247 / 0.78)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 900 }}>
            Interest rate
            <input type="number" min="1" max="20" step="0.1" value={rate} onChange={(event) => setRate(Number(event.target.value) || 0)} style={{ marginTop: 8, width: '100%', minHeight: 48, borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,253,247,0.16)', background: 'rgba(255,253,247,0.08)', color: 'var(--cream-50)', padding: '0 14px', fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 900 }} />
          </label>
          <button type="button" onClick={() => onEligibility(vehicle, { emi, tenure, rate })} style={{ marginTop: 22, minHeight: 52, width: '100%', border: 0, borderRadius: 'var(--radius-full)', background: 'var(--cream-50)', color: 'var(--ink-900)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 950, cursor: 'pointer' }}>Check eligibility</button>
        </div>
      </section>
    </window.Reveal>
  );
}

function BuyerClarity() {
  const cards = [
    ['Verified pricing', 'Real listing price, dealer name, and vehicle details from your marketplace database.'],
    ['Dealer-backed', 'Every card stays tied to the dealer that owns the vehicle inventory.'],
    ['Doorstep test drive', 'Buyers can request a test drive from the listing card.'],
    ['Easy financing', 'EMI estimates help buyers understand affordability before enquiry.'],
    ['Buyer concierge', 'Search, compare, and request price without leaving the marketplace page.'],
  ];

  return (
    <window.Reveal style={{ paddingTop: 60 }}>
      <section>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.4rem)', fontWeight: 950, letterSpacing: '-0.045em', color: 'var(--text-strong)' }}>Built for first-time clarity.</h2>
        <div className="dsp-market-trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 14, marginTop: 18 }}>
          {cards.map(([title, copy]) => (
            <article key={title} style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
              <window.Icons.check size={18} style={{ color: 'var(--accent)' }} />
              <h3 style={{ margin: '12px 0 0', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 950, letterSpacing: '-0.035em', color: 'var(--text-strong)' }}>{title}</h3>
              <p style={{ margin: '8px 0 0', color: 'var(--text-body)', fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.5, fontWeight: 700 }}>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </window.Reveal>
  );
}

function DealerLocator({ dealers, city, onUseCity = () => {}, onDealerClick = () => {} }) {
  const visibleDealers = dealers.slice(0, 4);
  return (
    <window.Reveal id="dealers" style={{ paddingTop: 60 }}>
      <section style={{ borderRadius: 'var(--radius-3xl)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', padding: 'clamp(22px, 4vw, 34px)', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'end', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.4rem)', fontWeight: 950, letterSpacing: '-0.045em', color: 'var(--text-strong)' }}>Find a dealer near you.</h2>
            <p style={{ margin: '8px 0 0', color: 'var(--text-body)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 750 }}>{city} · {dealers.length} dealer locations from live listings</p>
          </div>
          <button type="button" onClick={onUseCity} style={{ minHeight: 44, borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)', background: 'var(--cream-50)', color: 'var(--text-strong)', padding: '0 16px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 950, cursor: 'pointer' }}>Use current city</button>
        </div>
        <div className="dsp-market-dealer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, marginTop: 22 }}>
          {visibleDealers.map((dealer) => (
            <article key={`${dealer.name}-${dealer.location}`} style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: 'var(--cream-100)', padding: 16 }}>
              <div style={{ width: 46, height: 46, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-lg)', background: 'var(--ink-900)', color: 'var(--cream-50)' }}>
                <window.Icons.mapPin size={20} />
              </div>
              <h3 style={{ margin: '14px 0 0', fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.1, fontWeight: 950, color: 'var(--text-strong)' }}>{dealer.name}</h3>
              <p style={{ margin: '7px 0 0', color: 'var(--text-body)', fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45, fontWeight: 750 }}>{dealer.brands} · {dealer.location}</p>
              <button type="button" onClick={() => onDealerClick(dealer)} style={{ marginTop: 14, minHeight: 38, border: 0, borderRadius: 'var(--radius-full)', background: 'var(--surface-card)', color: 'var(--text-strong)', padding: '0 14px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 950, cursor: 'pointer' }}>View dealer</button>
            </article>
          ))}
        </div>
        {visibleDealers.length === 0 && (
          <div style={{ marginTop: 22, borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-default)', background: 'var(--cream-100)', padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 800 }}>
            Dealer locations will appear here after vehicles are added to the database.
          </div>
        )}
      </section>
    </window.Reveal>
  );
}

function MarketplaceFooter({ onJoin = () => {} }) {
  const columns = [
    ['Browse', ['By Budget', 'By Brand', 'By Body Type', 'EV Zone', 'Upcoming']],
    ['Tools', ['EMI Calculator', 'Compare Vehicles', 'On-Road Price', 'Dealer Locator']],
    ['Company', ['About', 'Careers', 'Support', 'Contact']],
    ['Legal', ['Terms', 'Privacy', 'Dealer policy', 'Data safety']],
  ];

  return (
    <footer style={{ marginTop: 70, background: 'var(--ink-900)', color: 'var(--cream-50)', padding: 'clamp(34px, 6vw, 70px) 0 110px' }}>
      <window.Container wide>
        <div className="dsp-market-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr repeat(4, minmax(0, 1fr))', gap: 30 }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 950, letterSpacing: '-0.04em' }}>DealerSite Market</h3>
            <p style={{ margin: '12px 0 0', maxWidth: 320, color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.55, fontWeight: 700 }}>A marketplace-style vehicle discovery layer powered by your dealer inventory.</p>
            <button type="button" onClick={onJoin} style={{ marginTop: 18, minHeight: 46, border: 0, borderRadius: 'var(--radius-full)', background: 'var(--cream-50)', color: 'var(--ink-900)', padding: '0 18px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 950, cursor: 'pointer' }}>Join</button>
          </div>
          {columns.map(([title, links]) => (
            <div key={title}>
              <h4 style={{ margin: 0, color: 'var(--bronze-400)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{title}</h4>
              <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                {links.map((link) => <a key={link} href="#market-top" style={{ color: 'var(--text-on-dark-muted)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 750 }}>{link}</a>)}
              </div>
            </div>
          ))}
        </div>
      </window.Container>
    </footer>
  );
}

function LegacyVehicleExplorer({ setMode }) {
  const [dbVehicles, setDbVehicles] = React.useState([]);
  const [loadingVehicles, setLoadingVehicles] = React.useState(true);
  const [inventoryMessage, setInventoryMessage] = React.useState('Loading live inventory from the database.');
  const [query, setQuery] = React.useState(initialVehicleSearchQuery);
  const [mode, setSearchMode] = React.useState('budget');
  const [budget, setBudget] = React.useState('All');
  const [brand, setBrand] = React.useState('All');
  const [body, setBody] = React.useState('All');
  const [fuel, setFuel] = React.useState('All');
  const [transmission, setTransmission] = React.useState('All');
  const [seats, setSeats] = React.useState('All');
  const [condition, setCondition] = React.useState('All');
  const [sort, setSort] = React.useState('popular');
  const [compareIds, setCompareIds] = React.useState([]);
  const [status, setStatus] = React.useState('');
  const [visibleCount, setVisibleCount] = React.useState(12);
  const [showAllBrands, setShowAllBrands] = React.useState(false);
  const [brandDirectoryType, setBrandDirectoryType] = React.useState('4w');
  const vehicles = dbVehicles;
  const browseBudgets = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.budget)), [vehicles]);
  const browseBrands = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.brand)), [vehicles]);
  const browseBodies = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.body)), [vehicles]);
  const city = locationCity(vehicles[0]?.location);
  const dealers = React.useMemo(() => uniqueDealerCards(vehicles), [vehicles]);

  React.useEffect(() => {
    let active = true;

    async function loadVehicles() {
      try {
        const payload = await fetchAllMarketplaceVehicles();
        const rows = Array.isArray(payload.rows) ? payload.rows : [];
        const mapped = rows
          .map(mapDbVehicleToExplorer)
          .filter(Boolean);

        if (!active) return;
        if (mapped.length > 0) {
          setDbVehicles(assignUniqueVehicleCardImages(mapped));
          const breakdown = vehicleConditionBreakdownLabel(mapped);
          setInventoryMessage(`Showing ${payload.total || mapped.length} live marketplace vehicles${breakdown ? ` (${breakdown})` : ''} including second-hand dealer and hybrid dealer stock.`);
        } else {
          setDbVehicles([]);
          setInventoryMessage('No marketplace vehicles returned yet. Add new or second-hand vehicles to the database to show model cards.');
        }
      } catch (error) {
        if (active) {
          setDbVehicles([]);
          setInventoryMessage('Marketplace inventory could not load. Model cards are hidden until the database responds.');
        }
      } finally {
        if (active) setLoadingVehicles(false);
      }
    }

    loadVehicles();
    return () => { active = false; };
  }, []);

  React.useEffect(() => {
    setVisibleCount(12);
  }, [query, budget, brand, body, fuel, transmission, seats, condition, sort, dbVehicles.length]);

  const filters = [
    budget !== 'All' ? budget : null,
    brand !== 'All' ? displayBrandName(brand) : null,
    body !== 'All' ? body : null,
    fuel !== 'All' ? fuel : null,
    transmission !== 'All' ? transmission : null,
    seats !== 'All' ? `${seats} seats` : null,
    condition !== 'All' ? condition : null,
  ].filter(Boolean);

  const filterVehicleList = (sourceVehicles) => sourceVehicles.filter((vehicle) => {
    const text = `${vehicle.brand} ${vehicle.name} ${vehicle.variant} ${vehicle.type} ${vehicle.fuel} ${vehicle.body} ${vehicle.location}`.toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase()))
      && (budget === 'All' || vehicle.budget === budget)
      && brandMatchesVehicle(vehicle, brand)
      && (body === 'All' || vehicle.body === body)
      && textOptionMatches(vehicle.fuel, fuel)
      && textOptionMatches(vehicle.transmission, transmission)
      && (seats === 'All' || compactText(vehicle.seats) === seats)
      && conditionMatchesVehicle(vehicle, condition);
  });

  let filtered = filterVehicleList(vehicles);

  filtered = [...filtered].sort((a, b) => {
    const price = (v) => v.priceValue || v.onRoadValue || 0;
    if (sort === 'low') return price(a) - price(b);
    if (sort === 'high') return price(b) - price(a);
    if (sort === 'emi') return (a.emiValue || 0) - (b.emiValue || 0);
    return a.name.localeCompare(b.name);
  });

  const featured = vehicles[1] || vehicles[0] || null;
  const evVehicle = vehicles.find((vehicle) => vehicle.type === 'EVs' || vehicle.fuel.toLowerCase().includes('electric')) || null;
  const heroFeatured = featured ? {
    ...featured,
    image: imageForVehicle({ make: featured.brand, model: featured.name, body_type: featured.body, fuel_type: featured.fuel }, featured.type, featured.body),
  } : null;
  const evSpotlightVehicle = evVehicle ? {
    ...evVehicle,
    image: imageForVehicle({ make: evVehicle.brand, model: evVehicle.name, body_type: evVehicle.body, fuel_type: evVehicle.fuel }, evVehicle.type, evVehicle.body),
  } : null;
  const visibleVehicles = filtered.slice(0, visibleCount);
  const hasMoreVehicles = filtered.length > visibleVehicles.length;
  const listingMessage = vehicles.length > 0 && filters.length > 0 && filtered.length === 0
    ? 'No DB vehicles match the selected filters.'
    : inventoryMessage;

  const selectBrand = (value) => {
    setBrand(value);
    setBudget('All');
    setBody('All');
    setFuel('All');
    setTransmission('All');
    setSeats('All');
    setQuery('');
  };

  const clearFilters = () => {
    setBudget('All');
    setBrand('All');
    setBody('All');
    setFuel('All');
    setTransmission('All');
    setSeats('All');
    setCondition('All');
    setQuery('');
  };

  const applyQuickFilter = (value) => {
    if (mode === 'budget') setBudget(value);
    if (mode === 'brand') selectBrand(value);
    if (mode === 'body') setBody(value);
  };

  const quickItems = mode === 'budget' ? browseBudgets : mode === 'brand' ? browseBrands : browseBodies;

  const toggleCompare = (id) => {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-3));
  };

  const showLegacyStatus = (message) => {
    setStatus(message);
    window.clearTimeout(window.__legacyMarketStatusTimer);
    window.__legacyMarketStatusTimer = window.setTimeout(() => setStatus(''), 2600);
  };

  const handleEnquire = (id, message) => {
    const vehicle = vehicles.find((item) => item.id === id);
    showLegacyStatus(`${message} for ${vehicle?.brand ?? ''} ${vehicle?.name ?? ''}.`);
  };

  const handleLegacyCompare = () => {
    if (compareIds.length < 2) {
      showLegacyStatus('Select at least two vehicles to compare.');
      return;
    }
    const names = compareIds
      .map((id) => vehicles.find((item) => item.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    showLegacyStatus(`Comparison ready for ${names}.`);
  };

  return (
    <div id="market-top" style={{ background: 'linear-gradient(180deg, var(--surface-stage) 0%, var(--cream-50) 18%, var(--cream-100) 100%)', paddingBottom: 0 }}>
      <MarketplaceNav
        query={query}
        setQuery={setQuery}
        city={city}
        condition={condition}
        setCondition={setCondition}
        onMenuOpen={() => {
          showLegacyStatus('Vehicle filters are ready below.');
          document.getElementById('listing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onCityClick={() => {
          showLegacyStatus(`${city} dealer locations are ready.`);
          document.getElementById('dealers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
      <window.Container wide>
        <window.Reveal style={{ padding: 'clamp(34px, 5vw, 72px) 0 0' }}>
          <div className="dsp-market-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.72fr)', gap: 'clamp(24px, 4vw, 56px)', alignItems: 'end' }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', background: 'rgba(255,253,247,0.76)', padding: '8px 12px', color: 'var(--accent)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.13em' }}>
                <window.Icons.spark size={14} /> Dealer-backed vehicle search
              </span>
              <h1 style={{ margin: '24px 0 0', maxWidth: 900, fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 6.8rem)', lineHeight: 0.92, letterSpacing: '-0.055em', color: 'var(--cream-50)' }}>
                Find vehicles with <span style={{ color: 'var(--bronze-400)' }}>total clarity.</span>
              </h1>
              <p style={{ margin: '22px 0 0', maxWidth: 720, fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem, 2vw, 1.38rem)', lineHeight: 1.55, color: 'var(--text-on-dark-muted)' }}>
                Search cars, bikes, EVs, and autos by budget, brand, body type, EMI, fuel, and live dealer availability.
              </p>

              <div className="dsp-market-search" style={{ marginTop: 34, border: '1px solid rgba(255,253,247,0.16)', borderRadius: '32px', background: 'rgba(255,253,247,0.95)', padding: 12, boxShadow: 'var(--shadow-2xl)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 4, borderRadius: 'var(--radius-full)', background: 'var(--cream-100)' }}>
                  {[
                    ['budget', 'By Budget'],
                    ['brand', 'By Brand'],
                    ['body', 'By Body Type'],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSearchMode(id)}
                      style={{ minHeight: 46, border: 0, borderRadius: 'var(--radius-full)', background: mode === id ? 'var(--surface-card)' : 'transparent', color: mode === id ? 'var(--text-strong)' : 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 900, cursor: 'pointer', boxShadow: mode === id ? 'var(--shadow-sm)' : 'none' }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                  {quickItems.slice(0, 6).map((item) => (
                    <FilterButton key={item} active={(mode === 'budget' && budget === item) || (mode === 'brand' && brand === item) || (mode === 'body' && body === item)} onClick={() => applyQuickFilter(item)}>
                      {item}
                    </FilterButton>
                  ))}
                </div>

                <div className="dsp-market-search-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 150px', gap: 10, marginTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, padding: '0 18px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
                    <window.Icons.search size={20} style={{ color: 'var(--text-muted)', flex: 'none' }} />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search make, model, fuel, or 7-seater..." style={{ width: '100%', border: 0, outline: 0, background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 750, color: 'var(--text-strong)' }} />
                  </label>
                <button type="button" onClick={() => document.getElementById('listing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} style={{ minHeight: 60, border: 0, borderRadius: 'var(--radius-full)', background: 'var(--ink-900)', color: 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 950, cursor: 'pointer' }}>Find Vehicles</button>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, marginTop: 28, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 800, color: 'var(--text-on-dark-muted)' }}>
                {['Verified pricing', 'Dealer-backed inventory', loadingVehicles ? 'Loading live stock' : dbVehicles.length ? `${dbVehicles.length}+ live listings loaded` : 'Waiting for DB inventory'].map((item) => (
                  <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><window.Icons.check size={15} style={{ color: 'var(--bronze-400)' }} /> {item}</span>
                ))}
              </div>
              <MarketplaceMetricStrip vehicles={vehicles} brands={browseBrands} bodies={browseBodies} city={city} />
            </div>

            <div className="dsp-market-featured" style={{ alignSelf: 'stretch', minHeight: 440, position: 'relative', overflow: 'hidden', borderRadius: '36px', border: '1px solid rgba(255,253,247,0.16)', background: 'linear-gradient(180deg, rgba(255,253,247,0.16), rgba(255,253,247,0.04))', boxShadow: 'var(--shadow-2xl)' }}>
              {heroFeatured ? (
                <React.Fragment>
                  <img
                    src={vehicleImageOrFallback(heroFeatured)}
                    alt={`${heroFeatured.brand} ${heroFeatured.name}`}
                    onError={(event) => applyVehicleImageFallback(event, heroFeatured)}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.78 }}
                  />
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,14,18,0.08), rgba(11,14,18,0.76))' }} />
                  <div style={{ position: 'absolute', left: 22, right: 22, bottom: 22, color: 'var(--cream-50)' }}>
                    <span style={{ display: 'inline-flex', borderRadius: 'var(--radius-full)', background: 'var(--cream-50)', color: 'var(--ink-900)', padding: '7px 11px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 950 }}>Featured DB listing · {heroFeatured.year}</span>
                    <h2 style={{ margin: '16px 0 0', fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 1, letterSpacing: '-0.04em' }}>{heroFeatured.brand} {heroFeatured.name}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
                      <div style={{ borderRadius: 'var(--radius-lg)', background: 'rgba(255,253,247,0.12)', padding: 13 }}>
                        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-on-dark-muted)' }}>On-road from</p>
                        <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20 }}>{heroFeatured.onRoad}</p>
                      </div>
                      <div style={{ borderRadius: 'var(--radius-lg)', background: 'rgba(255,253,247,0.12)', padding: 13 }}>
                        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-on-dark-muted)' }}>EMI from</p>
                        <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20 }}>{heroFeatured.emi}</p>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <div style={{ height: '100%', minHeight: 440, display: 'grid', placeItems: 'center', padding: 28, textAlign: 'center', color: 'var(--cream-50)' }}>
                  <div>
                    <window.Icons.dashboard size={34} style={{ color: 'var(--bronze-400)' }} />
                    <h2 style={{ margin: '16px 0 0', fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 1, letterSpacing: '-0.04em' }}>Waiting for DB vehicles</h2>
                    <p style={{ margin: '12px auto 0', maxWidth: 360, color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, fontWeight: 750 }}>
                      Model cards will appear here only from the marketplace database.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </window.Reveal>

        <window.Reveal style={{ paddingTop: 42 }}>
          <BrowseRail title="Browse by Brand" items={browseBrands} active={brand} onSelect={selectBrand} />
        </window.Reveal>

        <window.Reveal id="listing" style={{ paddingTop: 46 }}>
          <section style={{ borderRadius: 'var(--radius-3xl)', border: '1px solid var(--border-subtle)', background: 'rgba(255,253,247,0.72)', boxShadow: 'var(--shadow-xl)', padding: 'clamp(18px, 3vw, 28px)' }}>
            <div className="dsp-listing-head" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.045em', color: 'var(--text-strong)' }}>All vehicles</h2>
                <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--text-body)' }}>{listingMessage}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ borderRadius: 'var(--radius-lg)', background: 'var(--ink-900)', color: 'var(--cream-50)', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 900 }}>{filtered.length} vehicles in India</div>
                <label className="dsp-market-top-search" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 46, minWidth: 330, padding: '0 15px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)' }}>
                  <window.Icons.search size={18} style={{ color: 'var(--accent)', flex: 'none' }} />
                  <input
                    aria-label="Search vehicles"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search vehicles..."
                    style={{ width: '100%', border: 0, outline: 0, background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 850, color: 'var(--text-strong)' }}
                  />
                </label>
                <select value={sort} onChange={(event) => setSort(event.target.value)} style={{ minHeight: 42, borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', padding: '0 14px', fontFamily: 'var(--font-body)', fontWeight: 850, color: 'var(--text-strong)' }}>
                  <option value="popular">Sort: Popularity</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="emi">EMI</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
              {filters.map((item) => (
                <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 'var(--radius-full)', background: 'var(--cream-100)', border: '1px solid var(--border-subtle)', padding: '8px 12px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 850, color: 'var(--text-body)' }}>{item}</span>
              ))}
              {filters.length > 0 && (
                <button type="button" onClick={clearFilters} style={{ border: 0, background: 'transparent', color: 'var(--accent)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>Clear all</button>
              )}
            </div>

            <div className="dsp-listing-content" style={{ display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', gap: 22, alignItems: 'start', marginTop: 24 }}>
              <MarketplaceFilterRail
                vehicles={vehicles}
                browseBudgets={browseBudgets}
                browseBrands={browseBrands}
                browseBodies={browseBodies}
                budget={budget}
                brand={brand}
                body={body}
                fuel={fuel}
                transmission={transmission}
                seats={seats}
                condition={condition}
                setBudget={setBudget}
                selectBrand={selectBrand}
                setBody={setBody}
                setFuel={setFuel}
                setTransmission={setTransmission}
                setSeats={setSeats}
                setCondition={setCondition}
                clearFilters={clearFilters}
              />

              <div style={{ minWidth: 0 }}>
                <div className="dsp-vehicle-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
                  {visibleVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} selected={compareIds.includes(vehicle.id)} onCompare={toggleCompare} onEnquire={handleEnquire} />
                  ))}
                </div>

                {hasMoreVehicles && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
                    <button type="button" onClick={() => setVisibleCount((current) => current + 12)} style={{ minHeight: 52, borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', color: 'var(--text-strong)', padding: '0 24px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 950, cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>Load more vehicles</button>
                  </div>
                )}

                {filtered.length === 0 && (
                  <div style={{ borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-default)', background: 'var(--surface-card)', padding: 28, textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontWeight: 800 }}>
                    {loadingVehicles ? 'Loading model cards from the database...' : vehicles.length === 0 ? 'No vehicle model cards are available from the database yet.' : 'No DB vehicles match this search. Try another budget, brand, fuel type, or model.'}
                  </div>
                )}
              </div>
            </div>
          </section>
        </window.Reveal>

        <LaunchesSection vehicles={vehicles} onNotify={handleEnquire} />
        {evSpotlightVehicle ? <EvSpotlight vehicle={evSpotlightVehicle} onExplore={() => { clearFilters(); setQuery('Electric'); }} /> : null}
        {featured ? <FinancePlanner vehicle={featured} onEligibility={(vehicle, result) => showLegacyStatus(`Eligibility check ready for ${vehicle.brand} ${vehicle.name} at approx ₹${result.emi.toLocaleString('en-IN')}/month.`)} /> : null}
        <BuyerClarity />
        <DealerLocator
          dealers={dealers}
          city={city}
          onUseCity={() => showLegacyStatus(`${city} is selected for nearby dealer results.`)}
          onDealerClick={(dealer) => showLegacyStatus(`Dealer profile ready for ${dealer.name}.`)}
        />
      </window.Container>

      <MarketplaceFooter onJoin={() => showLegacyStatus('DealerSite Market updates are ready for signup.')} />

      {compareIds.length > 0 && (
        <div className="dsp-compare-dock" style={{ position: 'fixed', left: '50%', bottom: 22, transform: 'translateX(-50%)', zIndex: 20, width: 'min(760px, calc(100vw - 32px))', borderRadius: '28px', background: 'var(--ink-900)', color: 'var(--cream-50)', boxShadow: 'var(--shadow-2xl)', padding: 12, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {compareIds.map((id) => {
              const vehicle = vehicles.find((item) => item.id === id);
              return vehicle ? (
                <img
                  key={id}
                  src={vehicleImageOrFallback(vehicle)}
                  alt=""
                  onError={(event) => applyVehicleImageFallback(event, vehicle)}
                  style={{ width: 52, height: 42, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,253,247,0.12)' }}
                />
              ) : null;
            })}
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900 }}>{compareIds.length} selected</p>
              <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-on-dark-muted)', fontWeight: 700 }}>Side-by-side comparison</p>
            </div>
          </div>
          <button type="button" onClick={handleLegacyCompare} style={{ minHeight: 48, border: 0, borderRadius: 'var(--radius-full)', background: 'var(--cream-50)', color: 'var(--ink-900)', padding: '0 22px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 950, cursor: 'pointer' }}>Compare ({compareIds.length}) →</button>
        </div>
      )}

      {status && (
        <div role="status" style={{ position: 'fixed', right: 22, bottom: compareIds.length > 0 ? 96 : 22, zIndex: 21, maxWidth: 360, borderRadius: 'var(--radius-lg)', border: '1px solid rgba(46,125,80,0.25)', background: 'var(--surface-card)', color: 'var(--success)', padding: '13px 15px', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 850 }}>
          <window.Icons.check size={14} /> {status}
        </div>
      )}
    </div>
  );
}

function vrfScrollToListing() {
  vrfScrollToId('listing');
}

function vrfScrollToId(id) {
  const node = document.getElementById(id);
  if (!node) return;
  const hash = `#${id}`;
  if (window.location.hash === hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.location.hash = id;
  window.setTimeout(() => {
    const currentNode = document.getElementById(id);
    if (!currentNode) return;
    const topOffset = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dsp-topnav-height'), 10) || 90;
    const top = Math.max(0, window.scrollY + currentNode.getBoundingClientRect().top - topOffset - 18);
    window.scrollTo(0, top);
  }, 0);
}

function vrfPriceNumber(vehicle) {
  return vehicle.priceValue || vehicle.onRoadValue || 0;
}

function vrfModelLabel(vehicle) {
  return `${vehicle.brand} ${vehicle.name}`.trim();
}

function vrfBadgeTone(vehicle) {
  const text = normalizeBrandKey(`${vehicle.badge} ${vehicle.fuel} ${vehicle.type}`);
  if (text.includes('electric') || text.includes('ev') || text.includes('new')) return 'success';
  if (text.includes('launch') || text.includes('certified')) return 'warning';
  return 'brand';
}

function vrfUniqueCount(vehicles, predicate) {
  return vehicles.filter(predicate).length;
}

function VrfSectionHead({ title, kicker, href = '#listing', action = 'View all' }) {
  return (
    <div className="vrf-section-head">
      <div>
        {kicker ? <div style={{ color: 'var(--vrf-brand-text)', fontSize: 11, fontWeight: 950, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{kicker}</div> : null}
        <h2>{title}</h2>
      </div>
      {action ? <a href={href}>{action} <window.Icons.chevronRight size={12} style={{ verticalAlign: '-2px' }} /></a> : null}
    </div>
  );
}

function validBrandDirectoryType(value) {
  return value === '2w' || value === '3w' || value === '4w' ? value : '4w';
}

function VrfBrandLogo({ name, category = '' }) {
  const logo = brandLogoFor(name, category);
  if (logo) return <img src={logo} alt={`${displayBrandName(name)} logo`} />;
  return null;
}

const VRF_BRAND_DIRECTORY_TYPES = [
  { value: '2w', label: '2W', name: 'Two-Wheelers', icon: 'bike' },
  { value: '3w', label: '3W', name: 'Three-Wheelers', icon: 'auto' },
  { value: '4w', label: '4W', name: 'Cars', icon: 'car' },
];

function categoryLabelForDirectory(category) {
  if (category === '2w') return 'two-wheeler';
  if (category === '3w') return 'three-wheeler';
  return 'car';
}

function priceRangeLabel(min, max) {
  if (!min && !max) return 'Price on request';
  if (!max || min === max) return formatInrShort(min || max);
  return `${formatInrShort(min)} - ${formatInrShort(max)}`;
}

function buildBrandDirectoryCards(vehicles, category) {
  const brandMap = new Map();

  vehicles
    .filter((vehicle) => vehicle.category === category)
    .forEach((vehicle) => {
      const key = canonicalBrandKey(vehicle.brand);
      const current = brandMap.get(key) || {
        name: displayBrandName(vehicle.brand),
        rawName: vehicle.brand,
        category,
        href: vehicle.brandHref || brandPageHrefFor(vehicle.brand, category),
        models: new Set(),
        priceMin: 0,
        priceMax: 0,
      };
      current.models.add(normalizeBrandKey(vehicle.name) || vehicle.id);

      const price = vrfPriceNumber(vehicle);
      if (price > 0 && (!current.priceMin || price < current.priceMin)) current.priceMin = price;
      if (price > current.priceMax) current.priceMax = price;

      if (!current.href && vehicle.brandHref) current.href = vehicle.brandHref;
      brandMap.set(key, current);
    });

  return Array.from(brandMap.values())
    .map((item) => ({
      ...item,
      modelCount: item.models.size,
      priceRange: priceRangeLabel(item.priceMin, item.priceMax),
    }))
    .sort((a, b) => b.modelCount - a.modelCount || a.name.localeCompare(b.name));
}

function VrfBrandDirectoryCard({ brand }) {
  return (
    <a
      href={brand.href}
      target="_top"
      className="vrf-directory-card"
      aria-label={`Open ${brand.name} brand page`}
      onClick={(event) => {
        event.preventDefault();
        openTopWindowHref(brand.href);
      }}
    >
      <span className="vrf-directory-logo"><VrfBrandLogo name={brand.rawName} category={brand.category} /></span>
      <h3>{brand.name}</h3>
      <span className="vrf-directory-count">{brand.modelCount} {brand.modelCount === 1 ? 'Model' : 'Models'}</span>
      <p>{brand.priceRange}</p>
      <span className="vrf-directory-link">Open brand page <window.Icons.arrowRight size={12} /></span>
    </a>
  );
}

function VrfAllBrandsDirectory({ vehicles, visible, activeType, setActiveType, onClose }) {
  const activeConfig = VRF_BRAND_DIRECTORY_TYPES.find((item) => item.value === activeType) || VRF_BRAND_DIRECTORY_TYPES[2];
  const brandCards = React.useMemo(() => buildBrandDirectoryCards(vehicles, activeType), [vehicles, activeType]);
  const categoryCounts = React.useMemo(() => VRF_BRAND_DIRECTORY_TYPES.reduce((acc, item) => {
    acc[item.value] = buildBrandDirectoryCards(vehicles, item.value).length;
    return acc;
  }, {}), [vehicles]);
  if (!visible) return null;

  return (
    <section id="all-brands" className="vrf-section vrf-brand-directory">
      <div className="vrf-container">
        <div className="vrf-directory-crumb">
          <a href="#market-top">Home</a>
          <window.Icons.chevronRight size={14} />
          <span>All Brands</span>
        </div>

        <div className="vrf-directory-head">
          <div>
            <h2>All Vehicle Brands</h2>
            <p>{activeConfig.label} {activeConfig.name} · {brandCards.length} brands from first-hand marketplace data</p>
          </div>

          <div className="vrf-directory-actions">
            <div className="vrf-directory-tabs" role="tablist" aria-label="Vehicle brand category">
              {VRF_BRAND_DIRECTORY_TYPES.map((item) => {
                const Icon = window.Icons[item.icon] || window.Icons.car;
                const active = item.value === activeType;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Show ${item.label} brands`}
                    className="vrf-directory-tab"
                    data-active={active}
                    onClick={() => setActiveType(item.value)}
                  >
                    <Icon size={17} />
                    <strong>{item.label}</strong>
                    <span>{item.name}</span>
                    <em>{categoryCounts[item.value] || 0}</em>
                  </button>
                );
              })}
            </div>
            <button type="button" className="vrf-secondary vrf-directory-close" onClick={onClose}>
              <window.Icons.chevronRight size={14} style={{ transform: 'rotate(-90deg)' }} /> Hide directory
            </button>
          </div>
        </div>

        {brandCards.length > 0 ? (
          <div className="vrf-directory-grid">
            {brandCards.map((brand) => <VrfBrandDirectoryCard key={`${activeType}-${brand.rawName}`} brand={brand} />)}
          </div>
        ) : (
          <div className="vrf-empty">No {activeConfig.name.toLowerCase()} brands are available from the database yet.</div>
        )}
      </div>
    </section>
  );
}

function VrfBrandRailCard({ brand }) {
  return (
    <a
      href={brand.href}
      target="_top"
      className="vrf-brand-rail-card"
      aria-label={`Open ${brand.name} brand page`}
      onClick={(event) => {
        event.preventDefault();
        openTopWindowHref(brand.href);
      }}
    >
      <span className="vrf-brand-rail-logo"><VrfBrandLogo name={brand.rawName} category={brand.category} /></span>
      <span className="vrf-brand-rail-name">{brand.name}</span>
      <span className="vrf-brand-rail-meta">{brand.modelCount} {brand.modelCount === 1 ? 'model' : 'models'}</span>
    </a>
  );
}

function VrfBrandMarquee({ title, label, type, brands, direction = 'clockwise' }) {
  if (!brands.length) return null;
  const loopBrands = [...brands, ...brands, ...brands];
  const directoryHref = `/brands?type=${validBrandDirectoryType(type || brands[0]?.category || '4w')}`;

  return (
    <div className="vrf-brand-marquee-row" data-direction={direction}>
      <a
        href={directoryHref}
        target="_top"
        className="vrf-brand-marquee-label"
        aria-label={`Open ${label} brand directory`}
        onClick={(event) => {
          event.preventDefault();
          openTopWindowHref(directoryHref);
        }}
      >
        <span>{title}</span>
        <strong>{label}</strong>
      </a>
      <div className="vrf-brand-marquee-viewport">
        <div className="vrf-brand-marquee-track">
          {loopBrands.map((brand, index) => (
            <VrfBrandRailCard key={`${title}-${brand.rawName}-${index}`} brand={brand} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VrfBrandCarouselShowcase({ vehicles }) {
  const brandGroups = React.useMemo(() => {
    const pick = (category, limit) => buildBrandDirectoryCards(vehicles, category).slice(0, limit);
    return {
      '4w': pick('4w', 6),
      '3w': pick('3w', 4),
      '2w': pick('2w', 6),
    };
  }, [vehicles]);
  const totalBrands = React.useMemo(() => (
    buildBrandDirectoryCards(vehicles, '4w').length
    + buildBrandDirectoryCards(vehicles, '3w').length
    + buildBrandDirectoryCards(vehicles, '2w').length
  ), [vehicles]);

  return (
    <div id="brands" className="vrf-brand-rotator">
      <div className="vrf-section-head">
        <div>
          <div style={{ color: 'var(--bronze-400)', fontSize: 11, fontWeight: 950, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Featured brand lanes</div>
          <h2>Browse by Brand</h2>
          <p>A calmer brand preview: 4W and 2W glide forward, 3W moves the opposite way, and the full directory opens only when needed.</p>
        </div>
        <div className="vrf-brand-actions">
          <span>{totalBrands} live brands</span>
          <button type="button" className="vrf-link-button" onClick={() => openTopWindowHref('/brands?type=4w')}>
            View all <window.Icons.chevronRight size={12} style={{ verticalAlign: '-2px' }} />
          </button>
        </div>
      </div>
      <div className="vrf-brand-marquee-stack" aria-label="Featured vehicle brands">
        <VrfBrandMarquee title="4W" label="Cars" type="4w" brands={brandGroups['4w']} direction="clockwise" />
        <VrfBrandMarquee title="3W" label="Autos" type="3w" brands={brandGroups['3w']} direction="anticlockwise" />
        <VrfBrandMarquee title="2W" label="Bikes" type="2w" brands={brandGroups['2w']} direction="clockwise" />
      </div>
    </div>
  );
}

function VrfHero({
  vehicles,
  heroVehicle,
}) {
  const heroSlides = React.useMemo(() => {
    const uniqueModels = new Set();
    const realImageVehicles = vehicles.filter((vehicle) => compactText(vehicle?.image) && !isSharedFallbackVehicleImage(vehicle.image));
    const source = vehicles
      .filter((vehicle) => vehicle?.category === '4w' && String(vehicle?.year).includes('2026'))
      .filter((vehicle) => compactText(vehicle?.image) && !isSharedFallbackVehicleImage(vehicle.image))
      .filter((vehicle) => {
        const key = vehicleModelIdentity(vehicle);
        if (!key || uniqueModels.has(key)) return false;
        uniqueModels.add(key);
        return true;
      });
    const fallback = realImageVehicles.filter((vehicle) => vehicle?.category === '4w').slice(0, 6);
    return (source.length ? source : fallback.length ? fallback : [heroVehicle]).filter(Boolean).slice(0, 6);
  }, [vehicles, heroVehicle]);
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);
  const activeSlide = heroSlides[activeSlideIndex % Math.max(heroSlides.length, 1)] || heroVehicle;
  const activeSlideName = activeSlide ? vrfModelLabel(activeSlide) : 'Featured vehicle';
  const activeSlideImage = vehicleImageOrFallback(activeSlide);

  React.useEffect(() => {
    setActiveSlideIndex(0);
  }, [heroSlides]);

  React.useEffect(() => {
    if (heroSlides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section className="vrf-hero">
      <div className="vrf-container">
        <div className="vrf-hero-grid">
          <div className="vrf-hero-copy">
            <span className="vrf-kicker"><window.Icons.spark size={13} /> New and pre-owned marketplace</span>
            <h1>
              <span className="vrf-hero-line">Find your</span>{' '}
              <span className="vrf-hero-line">next ride</span>{' '}
              <span className="vrf-hero-line">with</span>{' '}
              <span className="vrf-hero-line" style={{ color: 'var(--bronze-400)' }}>total clarity.</span>
            </h1>
            <p>
              Verified on-road pricing, direct dealer inventory, and zero-hassle discovery on live vehicles from your marketplace database.
            </p>

            <div className="vrf-proof-row">
              <span><window.Icons.check size={16} style={{ color: 'var(--vrf-success)' }} /> Verified on-road pricing</span>
              <span><window.Icons.brands size={16} style={{ color: 'var(--vrf-warning)' }} /> Dealer-backed inventory</span>
              <span><window.Icons.spark size={16} style={{ color: 'var(--vrf-warning)' }} /> {vehicles.length}+ live offers</span>
            </div>
          </div>

          <div className="vrf-hero-media">
            {activeSlideImage ? (
            <div className="vrf-hero-car" data-carousel="true">
              <img
                key={activeSlide?.id || activeSlideName}
                src={activeSlideImage}
                alt={activeSlideName}
                onError={(event) => applyVehicleImageFallback(event, activeSlide)}
              />
              <div className="vrf-float-pill" style={{ left: 16, top: 16 }}>
                2026 release
              </div>
              <div className="vrf-hero-name-card">
                <span>Now scrolling</span>
                <strong>{activeSlideName}</strong>
                <small>{[activeSlide?.fuel, activeSlide?.body].filter(Boolean).join(' · ') || 'Marketplace lineup'}</small>
              </div>
              <div className="vrf-float-pill" style={{ right: 16, bottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <window.Icons.gauge size={14} /> 360° View
              </div>
              <div className="vrf-float-card" style={{ left: 16, bottom: 16 }}>
                <div style={{ color: 'var(--vrf-muted)', fontSize: 10, fontWeight: 950, letterSpacing: '0.08em', textTransform: 'uppercase' }}>EMI from</div>
                <div style={{ color: 'var(--vrf-success)', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 950 }}>{activeSlide?.emi || 'Ask dealer'}</div>
              </div>
              <div className="vrf-float-card" style={{ right: 12, top: 66 }}>
                <div style={{ color: 'var(--vrf-muted)', fontSize: 10, fontWeight: 950, letterSpacing: '0.08em', textTransform: 'uppercase' }}>On-road</div>
                <div style={{ fontSize: 16, fontWeight: 950 }}>{activeSlide?.onRoad || 'Ask dealer'}</div>
              </div>
              <div className="vrf-hero-slide-dots" aria-hidden="true">
                {heroSlides.map((vehicle, index) => (
                  <span key={vehicle.id || `${vehicle.brand}-${vehicle.name}`} data-active={index === activeSlideIndex} />
                ))}
              </div>
            </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

const VRF_OFFER_THEMES = [
  {
    eyebrow: 'Festival offer',
    title: 'Festival booking bonus',
    value: 'Extra ₹25,000 benefit',
    note: 'Priority delivery, accessory support, and dealer-backed quote help.',
    tone: 'festival',
  },
  {
    eyebrow: 'Exchange',
    title: 'Exchange upgrade week',
    value: 'Up to ₹35,000 upgrade value',
    note: 'Trade in your current vehicle with quick dealer valuation support.',
    tone: 'exchange',
  },
  {
    eyebrow: 'Finance',
    title: 'Low EMI start',
    value: 'EMI from ₹5,250/mo',
    note: 'Shortlist now and request a custom finance quote from the dealer.',
    tone: 'finance',
  },
  {
    eyebrow: 'Fast delivery',
    title: 'Ready stock advantage',
    value: 'Same-week delivery slots',
    note: 'Find verified ready-stock vehicles from active marketplace dealers.',
    tone: 'delivery',
  },
  {
    eyebrow: 'EV offer',
    title: 'Green drive bonus',
    value: 'Range-focused savings',
    note: 'Compare EV running cost, warranty, and finance options in one place.',
    tone: 'ev',
  },
  {
    eyebrow: 'Business',
    title: 'Corporate fleet deal',
    value: 'Bulk enquiry support',
    note: 'Best for offices, ride-share fleets, and local delivery teams.',
    tone: 'fleet',
  },
];

const VRF_OFFER_FALLBACK_VEHICLES = [
  { category: '4w', type: 'Cars', brand: 'Mahindra', name: 'XUV 3XO', image: '', fuel: 'Petrol', body: 'SUV' },
  { category: '4w', type: 'Cars', brand: 'Hyundai', name: 'Creta', image: '', fuel: 'Petrol', body: 'Compact SUV' },
  { category: '3w', type: 'Autos', brand: 'Altigreen', name: 'neEV Bhai', image: '', fuel: 'Electric', body: 'Cargo Auto' },
  { category: '4w', type: 'Cars', brand: 'Tata Motors', name: 'Curvv', image: '', fuel: 'Petrol', body: 'Coupe SUV' },
  { category: '2w', type: 'Bikes', brand: 'Ather', name: 'Rizta', image: '', fuel: 'Electric', body: 'Scooter' },
  { category: '2w', type: 'Bikes', brand: 'Royal Enfield', name: 'Classic 350', image: '', fuel: 'Petrol', body: 'Motorcycle' },
];

function vrfOfferVehiclePool(vehicles) {
  const realImageVehicles = vehicles.filter((vehicle) => compactText(vehicle?.image) && !isSharedFallbackVehicleImage(vehicle.image));
  const uniqueByBrand = (items) => {
    const seenBrands = new Set();
    return items.filter((vehicle) => {
      const key = canonicalBrandKey(vehicle?.brand) || normalizeBrandKey(vehicle?.name);
      if (!key || seenBrands.has(key)) return false;
      seenBrands.add(key);
      return true;
    });
  };
  const carPool = uniqueByBrand(realImageVehicles.filter((vehicle) => vehicle.category === '4w'));
  const autoPool = uniqueByBrand(realImageVehicles.filter((vehicle) => vehicle.category === '3w'));
  const bikePool = uniqueByBrand(realImageVehicles.filter((vehicle) => vehicle.category === '2w'));
  const evPool = uniqueByBrand(realImageVehicles.filter((vehicle) => (
    vehicle?.type === 'EVs' || compactText(vehicle?.fuel).toLowerCase().includes('electric')
  )));
  const preferred = [
    carPool[0],
    carPool[1],
    autoPool[0] || carPool[2],
    carPool[2] || autoPool[1],
    evPool[0] || bikePool[0] || carPool[3],
    bikePool[0] || autoPool[1] || carPool[4],
    ...realImageVehicles,
  ].filter(Boolean);
  const seen = new Set();
  return preferred.filter((vehicle) => {
    const key = `${vehicle?.category || 'vehicle'}-${canonicalBrandKey(vehicle?.brand)}-${normalizeBrandKey(vehicle?.name)}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildVrfOfferSlides(vehicles) {
  const pool = vrfOfferVehiclePool(vehicles);
  if (!pool.length) return [];
  const source = pool;
  return VRF_OFFER_THEMES.map((offer, index) => {
    const vehicle = source[index % Math.max(source.length, 1)] || {};
    const modelLabel = compactText(vrfModelLabel(vehicle));
    return {
      ...offer,
      id: `${offer.tone}-${index}`,
      vehicle,
      vehicleName: modelLabel && !modelLabel.toLowerCase().includes('undefined') ? modelLabel : offer.title,
    };
  });
}

function VrfOffersCarousel({ vehicles, onExplore }) {
  const offers = React.useMemo(() => buildVrfOfferSlides(vehicles), [vehicles]);
  const loopedOffers = React.useMemo(() => [...offers, ...offers], [offers]);
  if (!offers.length) return null;

  return (
    <section id="offers" className="vrf-offer-carousel" aria-label="Latest dealer offers">
      <div className="vrf-offer-head">
        <div>
          <div className="vrf-offer-kicker"><window.Icons.spark size={13} /> Latest offers</div>
          <h2>Festival deals, exchange bonuses, and finance picks.</h2>
        </div>
        <button type="button" className="vrf-link-button" onClick={onExplore}>
          View all <window.Icons.chevronRight size={12} style={{ verticalAlign: '-2px' }} />
        </button>
      </div>

      <div className="vrf-offer-marquee" aria-live="off">
        <div className="vrf-offer-track">
          {loopedOffers.map((offer, index) => {
            const imageSrc = vehicleImageOrFallback(offer.vehicle);
            if (!imageSrc) return null;
            return (
            <article
              key={`${offer.id}-${index}`}
              className="vrf-offer-card"
              data-tone={offer.tone}
              data-vehicle-card="true"
              data-model-image-source={vehicleCardImageSourceKind(imageSrc)}
            >
              <div className="vrf-offer-media">
                <img src={imageSrc} alt={offer.vehicleName} onError={(event) => applyVehicleImageFallback(event, offer.vehicle)} />
                <span>{offer.eyebrow}</span>
              </div>
              <div className="vrf-offer-body">
                <div className="vrf-offer-brand">{displayBrandName(offer.vehicle?.brand || 'DealerSite')}</div>
                <h3>{offer.title}</h3>
                <strong>{offer.value}</strong>
                <p>{offer.note}</p>
                <button type="button" onClick={onExplore}>
                  Explore offer <window.Icons.arrowRight size={13} />
                </button>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VrfBrowseRails({ vehicles, budgets, bodies, brands, budget, body, brand, setBudget, setBody, selectBrand }) {
  return (
    <section className="vrf-section">
      <div className="vrf-container vrf-rail-stack">
        <VrfOffersCarousel vehicles={vehicles} onExplore={vrfScrollToListing} />

        <VrfBrandCarouselShowcase vehicles={vehicles} />
      </div>
    </section>
  );
}

function VrfChipButton({ active, children, onClick, count }) {
  return (
    <button type="button" className="vrf-chip" data-active={active} onClick={onClick}>
      {children}{typeof count === 'number' ? <span style={{ marginLeft: 6, opacity: 0.75 }}>{count}</span> : null}
    </button>
  );
}

function VrfCheckButton({ active, label, count, onClick }) {
  return (
    <button type="button" className="vrf-check-row" data-active={active} onClick={onClick}>
      <span className="vrf-check-box">{active ? '✓' : ''}</span>
      <span style={{ fontSize: 13, fontWeight: 800 }}>{label}</span>
      <span style={{ marginLeft: 'auto', color: 'var(--vrf-muted)', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
    </button>
  );
}

function VrfFilterGroup({ title, children }) {
  return (
    <div className="vrf-filter-group">
      <h3 className="vrf-filter-title">{title}</h3>
      {children}
    </div>
  );
}

function VrfConditionToggle({ condition, setCondition }) {
  const options = [
    { label: 'All', value: 'All' },
    { label: 'New', value: 'New' },
    { label: 'Used', value: 'Used' },
  ];

  return (
    <div className="vrf-condition-toggle" role="group" aria-label="New or used vehicle filter">
      {options.map((option) => {
        const active = condition === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className="vrf-condition-toggle-option"
            data-active={active}
            aria-pressed={active}
            onClick={() => setCondition(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function VrfFilterRail({
  vehicles,
  budgets,
  brands,
  bodies,
  fuels,
  transmissions,
  seatsList,
  conditions,
  budget,
  brand,
  body,
  fuel,
  transmission,
  seats,
  condition,
  setBudget,
  selectBrand,
  setBody,
  setFuel,
  setTransmission,
  setSeats,
  setCondition,
  vehicleCategoryFilter,
  setVehicleCategoryFilter,
  clearFilters,
}) {
  const categoryOptions = [
    { value: '2w', label: '2W', detail: 'Bikes', icon: window.Icons.bike },
    { value: '3w', label: '3W', detail: 'Autos', icon: window.Icons.auto },
    { value: '4w', label: '4W', detail: 'Cars', icon: window.Icons.car },
  ].map((item) => ({
    ...item,
    count: vrfUniqueCount(vehicles, (vehicle) => vehicle.category === item.value),
  })).filter((item) => item.count > 0);
  const scopedVehicles = vehicleCategoryFilter && vehicleCategoryFilter !== 'all'
    ? vehicles.filter((vehicle) => vehicle.category === vehicleCategoryFilter)
    : vehicles;
  const scopedBrands = uniqueValues(scopedVehicles.map((vehicle) => vehicle.brand));
  const budgetOptions = budgets
    .map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => vehicle.budget === item) }))
    .filter((option) => option.count > 0)
    .slice(0, 8);
  const brandOptions = scopedBrands
    .map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => brandMatchesVehicle(vehicle, item)) }))
    .filter((option) => option.count > 0);
  const bodyOptions = bodies
    .map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => vehicle.body === item) }))
    .filter((option) => option.count > 0)
    .slice(0, 8);
  const fuelOptions = fuels
    .map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => textOptionMatches(vehicle.fuel, item)) }))
    .filter((option) => option.count > 0)
    .slice(0, 8);
  const transmissionOptions = transmissions
    .map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => textOptionMatches(vehicle.transmission, item)) }))
    .filter((option) => option.count > 0)
    .slice(0, 6);
  const seatOptions = seatsList
    .map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => compactText(vehicle.seats) === item) }))
    .filter((option) => option.count > 0)
    .slice(0, 8);
  const conditionOptions = conditions
    .map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => conditionMatchesVehicle(vehicle, item)) }))
    .filter((option) => option.count > 0);
  const selectCategory = (value) => {
    setVehicleCategoryFilter(vehicleCategoryFilter === value ? 'all' : value);
    selectBrand('All', { preserveCategory: true });
    setBody('All');
    setFuel('All');
    setTransmission('All');
    setSeats('All');
  };

  return (
    <aside className="vrf-filter-rail">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 950, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Filters</h3>
        <button type="button" className="vrf-link-button" aria-label="Reset all vehicle filters" onClick={clearFilters}>Clear all</button>
      </div>

      <div className="vrf-category-switch" role="group" aria-label="Vehicle category filter">
        {categoryOptions.map((item) => {
          const Icon = item.icon;
          const active = vehicleCategoryFilter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              className="vrf-category-option"
              data-category={item.value}
              data-active={active}
              aria-pressed={active}
              onClick={() => selectCategory(item.value)}
            >
              <Icon size={15} />
              <span>{item.label}</span>
              <small>{item.detail}</small>
            </button>
          );
        })}
      </div>

      <VrfFilterGroup title="Condition">
        <div className="vrf-filter-options">
          {conditionOptions.map(({ item, count }) => (
            <VrfChipButton key={item} active={condition === item} count={count} onClick={() => setCondition(condition === item ? 'All' : item)}>
              {item}
            </VrfChipButton>
          ))}
        </div>
      </VrfFilterGroup>

      <VrfFilterGroup title="Price">
        <div className="vrf-filter-options">
          {budgetOptions.map(({ item, count }) => (
            <VrfChipButton key={item} active={budget === item} count={count} onClick={() => setBudget(budget === item ? 'All' : item)}>
              {item}
            </VrfChipButton>
          ))}
        </div>
      </VrfFilterGroup>

      <VrfFilterGroup title="Brand">
        {brandOptions.map(({ item, count }) => (
          <VrfCheckButton
            key={item}
            active={brandOptionIsSelected(item, brand)}
            label={displayBrandName(item)}
            count={count}
            onClick={() => selectBrand(brandOptionIsSelected(item, brand) ? 'All' : item, { preserveCategory: true })}
          />
        ))}
      </VrfFilterGroup>

      <VrfFilterGroup title="Body Type">
        <div className="vrf-filter-options">
          {bodyOptions.map(({ item }) => (
            <VrfChipButton key={item} active={body === item} onClick={() => setBody(body === item ? 'All' : item)}>{item}</VrfChipButton>
          ))}
        </div>
      </VrfFilterGroup>

      <VrfFilterGroup title="Fuel">
        <div className="vrf-filter-options">
          {fuelOptions.map(({ item }) => (
            <VrfChipButton key={item} active={fuel === item} onClick={() => setFuel(fuel === item ? 'All' : item)}>{item}</VrfChipButton>
          ))}
        </div>
      </VrfFilterGroup>

      <VrfFilterGroup title="Transmission">
        {transmissionOptions.map(({ item, count }) => (
          <VrfCheckButton
            key={item}
            active={transmission === item}
            label={item}
            count={count}
            onClick={() => setTransmission(transmission === item ? 'All' : item)}
          />
        ))}
      </VrfFilterGroup>

      <VrfFilterGroup title="Seating">
        <div className="vrf-filter-options">
          {seatOptions.map(({ item }) => (
            <VrfChipButton key={item} active={seats === item} onClick={() => setSeats(seats === item ? 'All' : item)}>{item}</VrfChipButton>
          ))}
        </div>
      </VrfFilterGroup>

    </aside>
  );
}

function VrfVehicleCard({ vehicle, compared, saved, onCompareToggle, onSaveToggle, onEnquire }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const imageSrc = vehicleImageOrFallback(vehicle);
  const modelLabel = vrfModelLabel(vehicle);
  const imageSourceKind = vehicleCardImageSourceKind(imageSrc);
  const brandLogo = brandLogoFor(vehicle.brand, vehicle.category);
  const isNewListing = conditionLabelFromDisplay(vehicle.condition || vehicle.badge) === 'New';
  const priceCaption = isNewListing ? 'Ex-showroom price*' : 'Dealer listing price';
  const specs = [
    { label: 'Fuel', value: vehicle.fuel, icon: 'fuel', tone: 'green' },
    { label: 'Trans', value: vehicle.transmission, icon: 'gauge', tone: 'blue' },
    { label: 'Seats', value: vehicle.seats, icon: 'used', tone: 'purple' },
    { label: vehicle.mileageLabel || (vehicle.km === 'Ready stock' ? 'Status' : 'Mileage'), value: vehicle.km, icon: 'ev', tone: 'orange' },
  ];

  if (!imageSrc) return null;

  return (
    <article className="vrf-vehicle-card" data-model-image-source={imageSourceKind}>
      <div className="vrf-card-media">
        <img
          src={imageSrc}
          alt={modelLabel}
          loading="lazy"
          onError={(event) => applyVehicleImageFallback(event, vehicle)}
        />
        <span className="vrf-badge" data-tone={vrfBadgeTone(vehicle)}>{vehicle.badge}</span>
        {vehicle.offer ? <span className="vrf-badge vrf-offer-badge" data-tone="warning">{vehicle.offer}</span> : null}
      </div>

      <div className="vrf-card-body">
        <div className="vrf-card-brand-row">
          {brandLogo ? <span className="vrf-card-brand-logo"><VrfBrandLogo name={vehicle.brand} category={vehicle.category} /></span> : null}
          <span className="vrf-card-brand">{displayBrandName(vehicle.brand)}</span>
        </div>
        <h3 className="vrf-card-title">
          <a href={vehicle.detailHref} target="_top">
            {vehicle.name}
          </a>
        </h3>
        <p className="vrf-card-sub">{vehicle.variant}</p>

        <div className="vrf-price-block">
          <div className="vrf-card-price">
            {vehicle.price}
            <small> onwards</small>
          </div>
          <div className="vrf-price-caption">{priceCaption}</div>
          <div className="vrf-emi-pill">
            <window.Icons.arrowUpRight size={14} /> EMI {vehicle.emi}
          </div>
        </div>

        <div className="vrf-spec-grid">
          {specs.map((spec) => {
            const Icon = window.Icons[spec.icon] || window.Icons.check;
            return (
              <div key={spec.label} data-tone={spec.tone}>
                <span className="vrf-spec-icon"><Icon size={18} /></span>
                <span className="vrf-spec-label">{spec.label}</span>
                <strong>{spec.value || 'Ask dealer'}</strong>
              </div>
            );
          })}
        </div>

        <div className="vrf-card-actions">
          <button type="button" className="vrf-card-enquire" onClick={() => onEnquire(vehicle.id, 'On-road price request')}>
            <window.Icons.arrowUpRight size={18} /> Enquire
          </button>
          <div className="vrf-card-more-wrap">
            <button
              type="button"
              className="vrf-card-more"
              aria-expanded={menuOpen}
              aria-label={`More actions for ${modelLabel}`}
              onClick={() => setMenuOpen((open) => !open)}
            >
              More <window.Icons.chevronRight size={14} />
            </button>
            {menuOpen ? (
              <div className="vrf-card-menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  data-active={compared}
                  onClick={() => {
                    onCompareToggle(vehicle.id);
                    setMenuOpen(false);
                  }}
                >
                  <window.Icons.link size={15} />
                  {compared ? 'Remove compare' : 'Compare'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  data-active={saved}
                  onClick={() => {
                    onSaveToggle(vehicle.id);
                    setMenuOpen(false);
                  }}
                >
                  <span aria-hidden="true">{saved ? '♥' : '♡'}</span>
                  {saved ? 'Saved' : 'Save'}
                </button>
                <a role="menuitem" href={vehicle.detailHref} target="_top">
                  <window.Icons.search size={15} />
                  View details
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function VrfListing(props) {
  const {
    vehicles,
    filtered,
    visibleVehicles,
    hasMoreVehicles,
    loadingVehicles,
    listingMessage,
    city,
    filters,
    query,
    setQuery,
    sort,
    setSort,
    viewMode,
    setViewMode,
    compareIds,
    savedIds,
    toggleCompare,
    toggleSave,
    handleEnquire,
    setVisibleCount,
    clearFilters,
    vehicleCategoryFilter,
    setVehicleCategoryFilter,
    budget,
    brand,
    body,
    fuel,
    transmission,
    seats,
    condition,
    setBudget,
    selectBrand,
    setBody,
    setFuel,
    setTransmission,
    setSeats,
    setCondition,
  } = props;

  const activeFilterItems = [
    vehicleCategoryFilter && vehicleCategoryFilter !== 'all'
      ? { key: 'category', label: categoryFilterLabel(vehicleCategoryFilter), clear: () => setVehicleCategoryFilter('all') }
      : null,
    query.trim()
      ? { key: 'query', label: `Search: ${query.trim()}`, clear: () => setQuery('') }
      : null,
    budget && budget !== 'All'
      ? { key: 'budget', label: budget, clear: () => setBudget('All') }
      : null,
    brand && brand !== 'All'
      ? { key: 'brand', label: displayBrandName(brand), clear: () => selectBrand('All', { preserveCategory: true }) }
      : null,
    body && body !== 'All'
      ? { key: 'body', label: body, clear: () => setBody('All') }
      : null,
    fuel && fuel !== 'All'
      ? { key: 'fuel', label: fuel, clear: () => setFuel('All') }
      : null,
    transmission && transmission !== 'All'
      ? { key: 'transmission', label: transmission, clear: () => setTransmission('All') }
      : null,
    seats && seats !== 'All'
      ? { key: 'seats', label: `${seats} seats`, clear: () => setSeats('All') }
      : null,
    condition && condition !== 'All'
      ? { key: 'condition', label: condition, clear: () => setCondition('All') }
      : null,
  ].filter(Boolean);
  const listingCountLabel = loadingVehicles && vehicles.length === 0
    ? 'Loading vehicles'
    : `${filtered.length} vehicles`;
  const visibleCity = city && normalizeBrandKey(city) !== 'india' ? city : '';
  const searchNeedle = query.trim().toLowerCase();
  const preOwnedVehicles = condition === 'All'
    ? filtered.filter(isPreOwnedVehicle).slice(0, 6)
    : [];
  const searchSuggestions = searchNeedle.length >= 1
    ? vehicles
        .filter((vehicle) => vehicleSearchText(vehicle).includes(searchNeedle))
        .sort((a, b) => {
          const aText = vehicleSearchText(a);
          const bText = vehicleSearchText(b);
          const aStarts = aText.startsWith(searchNeedle) || normalizeBrandKey(a.name).startsWith(searchNeedle) || normalizeBrandKey(a.brand).startsWith(searchNeedle);
          const bStarts = bText.startsWith(searchNeedle) || normalizeBrandKey(b.name).startsWith(searchNeedle) || normalizeBrandKey(b.brand).startsWith(searchNeedle);
          if (aStarts !== bStarts) return aStarts ? -1 : 1;
          return vrfModelLabel(a).localeCompare(vrfModelLabel(b));
        })
        .slice(0, 8)
    : [];

  return (
    <section id="listing" className="vrf-section vrf-listing">
      <div className="vrf-container">
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.1rem)', lineHeight: 1, fontWeight: 950 }}>All vehicles</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--vrf-muted)', fontSize: 14, fontWeight: 750 }}>{listingMessage}</p>
        </div>

        <div className="vrf-listing-grid">
          <VrfFilterRail {...props} />

          <div style={{ minWidth: 0 }}>
            <div className="vrf-list-toolbar">
              <div>
                <span style={{ fontSize: 14, fontWeight: 950 }}>{listingCountLabel}</span>
                {visibleCity ? <span style={{ marginLeft: 8, color: 'var(--vrf-muted)', fontSize: 12, fontWeight: 750 }}> in {visibleCity}</span> : null}
	              </div>
	              <div className="vrf-toolbar-actions">
	                <VrfConditionToggle condition={condition} setCondition={setCondition} />
	                <div className="vrf-search-suggest">
                  <input
                    className="vrf-input"
                    style={{ minHeight: 36, width: 240 }}
                    aria-label="Search vehicles"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search vehicles..."
                    autoComplete="off"
                  />
                  {searchSuggestions.length > 0 ? (
                    <div className="vrf-search-suggestions" role="listbox" aria-label="Vehicle search suggestions">
                      {searchSuggestions.map((vehicle) => (
                        <button
                          key={vehicle.id}
                          type="button"
                          className="vrf-search-suggestion"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setQuery(vrfModelLabel(vehicle));
                            setVehicleCategoryFilter(vehicle.category || 'all');
                          }}
                        >
                          <img src={vehicleImageOrFallback(vehicle)} alt="" onError={(event) => applyVehicleImageFallback(event, vehicle)} />
                          <span>
                            <strong>{vehicle.name}</strong>
                            <small>{displayBrandName(vehicle.brand)} · {vehicle.variant}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <select className="vrf-select" value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="popular">Sort: Popularity</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="emi">EMI</option>
                </select>
                <div className="vrf-view-toggle" aria-label="View mode">
                  <button type="button" className="vrf-icon-button" data-active={viewMode === 'grid'} onClick={() => setViewMode('grid')} aria-label="Grid view"><window.Icons.dashboard size={14} /></button>
                  <button type="button" className="vrf-icon-button" data-active={viewMode === 'list'} onClick={() => setViewMode('list')} aria-label="List view"><window.Icons.menu size={14} /></button>
                </div>
              </div>
            </div>

            <div className="vrf-active-filters">
              {activeFilterItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="vrf-active-filter"
                  aria-label={`Remove ${item.label} filter`}
                  onClick={item.clear}
                >
                  {item.label} ×
                </button>
              ))}
              {activeFilterItems.length > 0 ? (
                <button type="button" className="vrf-link-button" aria-label="Clear active vehicle filters" onClick={clearFilters}>Clear all</button>
              ) : null}
            </div>

            {preOwnedVehicles.length > 0 ? (
              <section style={{ margin: '0 0 22px', border: '1px solid rgb(15 23 42 / 0.10)', borderRadius: 22, background: 'linear-gradient(135deg, rgb(255 255 255 / 0.94), rgb(245 241 234 / 0.84))', padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
                  <div>
                    <p style={{ margin: 0, color: 'var(--vrf-accent)', fontSize: 11, fontWeight: 950, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Second-hand dealer stock</p>
                    <h3 style={{ margin: '5px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 2.4vw, 2rem)', lineHeight: 1, fontWeight: 950 }}>Pre-owned vehicles available now</h3>
                    <p style={{ margin: '7px 0 0', color: 'var(--vrf-muted)', fontSize: 13, fontWeight: 750 }}>Listings from used and hybrid dealers, using the same live filters below.</p>
                  </div>
                  <button
                    type="button"
                    className="vrf-secondary"
                    style={{ minHeight: 42, padding: '0 18px' }}
                    onClick={() => {
                      setCondition('Used');
                      setVisibleCount(12);
                    }}
                  >
                    View all used
                  </button>
                </div>
                <div className="vrf-card-grid" data-view="grid">
                  {preOwnedVehicles.map((vehicle) => (
                    <VrfVehicleCard
                      key={`pre-owned-${vehicle.id}`}
                      vehicle={vehicle}
                      compared={compareIds.includes(vehicle.id)}
                      saved={savedIds.includes(vehicle.id)}
                      onCompareToggle={toggleCompare}
                      onSaveToggle={toggleSave}
                      onEnquire={handleEnquire}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {filtered.length > 0 ? (
              <div className="vrf-card-grid" data-view={viewMode}>
                {visibleVehicles.map((vehicle) => (
                  <VrfVehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    compared={compareIds.includes(vehicle.id)}
                    saved={savedIds.includes(vehicle.id)}
                    onCompareToggle={toggleCompare}
                    onSaveToggle={toggleSave}
                    onEnquire={handleEnquire}
                  />
                ))}
              </div>
            ) : (
              <div className="vrf-empty">
                {loadingVehicles ? 'Loading model cards from the database...' : vehicles.length === 0 ? 'No vehicle model cards are available from the database yet.' : 'No DB vehicles match this search. Try another budget, brand, fuel type, or model.'}
              </div>
            )}

            {hasMoreVehicles ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <button type="button" className="vrf-secondary" style={{ minHeight: 48, padding: '0 28px', fontSize: 14 }} onClick={() => setVisibleCount((current) => current + 12)}>Load more vehicles</button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function VrfCompareTray({ vehicles, onRemove, onClear, onCompare }) {
  if (!vehicles.length) return null;
  const ready = vehicles.length >= 2;
  return (
    <div className="vrf-compare-tray">
      <div className="vrf-compare-thumbs">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="vrf-compare-thumb">
            <img
              src={vehicleImageOrFallback(vehicle)}
              alt={vehicle.name}
              onError={(event) => applyVehicleImageFallback(event, vehicle)}
            />
            <button type="button" aria-label={`Remove ${vehicle.name}`} onClick={() => onRemove(vehicle.id)} className="vrf-compare-thumb-remove">×</button>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 4 - vehicles.length) }).map((_, index) => (
          <div key={index} className="vrf-compare-thumb" style={{ display: 'grid', placeItems: 'center', border: '1px dashed rgb(255 255 255 / 0.22)', color: 'rgb(255 255 255 / 0.42)' }}>+</div>
        ))}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 950 }}>{vehicles.length} vehicles selected</div>
        <div style={{ color: 'rgb(248 250 252 / 0.62)', fontSize: 10, fontWeight: 750 }}>{ready ? 'Ready for side-by-side comparison' : 'Pick one more vehicle to compare'}</div>
      </div>
      <div className="vrf-compare-tray-actions">
        <button type="button" className="vrf-tray-secondary" onClick={onClear}>Clear</button>
        <button type="button" className="vrf-primary" data-ready={ready} onClick={onCompare}>
          {ready ? `Compare (${vehicles.length})` : 'Add 1 more'} <window.Icons.arrowRight size={14} style={{ verticalAlign: '-2px' }} />
        </button>
      </div>
    </div>
  );
}

function VrfComparePanel({ vehicles, visible, onRemove, onClose, onEnquire }) {
  React.useEffect(() => {
    if (!visible || vehicles.length < 2) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, vehicles.length, onClose]);

  if (!visible || vehicles.length < 2) return null;

  const rows = [
    ['Ex-showroom', (vehicle) => vehicle.price],
    ['On-road from', (vehicle) => vehicle.onRoad],
    ['EMI from', (vehicle) => vehicle.emi],
    ['Fuel', (vehicle) => vehicle.fuel],
    ['Transmission', (vehicle) => vehicle.transmission],
    ['Body type', (vehicle) => vehicle.body],
    ['Seats', (vehicle) => vehicle.seats],
    ['Range / usage', (vehicle) => vehicle.km],
  ];

  return (
    <section id="compare" className="vrf-compare-modal" role="dialog" aria-modal="true" aria-labelledby="vrf-compare-title">
      <button type="button" className="vrf-compare-backdrop" aria-label="Close comparison" onClick={onClose}></button>
      <div className="vrf-compare-dialog">
        <div className="vrf-compare-shell">
          <div className="vrf-section-head">
            <div>
              <div style={{ color: 'var(--bronze-400)', fontSize: 11, fontWeight: 950, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Side-by-side</div>
              <h2 id="vrf-compare-title">Compare selected vehicles</h2>
              <p>Review the marketplace listings you selected before opening a detail page or requesting price.</p>
            </div>
            <button type="button" className="vrf-secondary" onClick={onClose}>Hide comparison</button>
          </div>

          <div className="vrf-compare-table" style={{ '--compare-cols': vehicles.length }}>
            <div className="vrf-compare-label-cell">Model</div>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="vrf-compare-model-cell">
                <button type="button" aria-label={`Remove ${vehicle.name}`} onClick={() => onRemove(vehicle.id)} className="vrf-compare-remove">×</button>
                <img
                  src={vehicleImageOrFallback(vehicle)}
                  alt={vrfModelLabel(vehicle)}
                  onError={(event) => applyVehicleImageFallback(event, vehicle)}
                />
                <div className="vrf-card-brand">{displayBrandName(vehicle.brand)}</div>
                <h3>{vehicle.name}</h3>
                <p>{vehicle.variant}</p>
                <a href={vehicle.detailHref} target="_top">Open model details <window.Icons.arrowRight size={12} /></a>
              </div>
            ))}

            {rows.map(([label, getter]) => (
              <React.Fragment key={label}>
                <div className="vrf-compare-label-cell">{label}</div>
                {vehicles.map((vehicle) => (
                  <div key={`${vehicle.id}-${label}`} className="vrf-compare-value-cell">{getter(vehicle) || 'Ask dealer'}</div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="vrf-compare-actions">
            {vehicles.map((vehicle) => (
              <button key={vehicle.id} type="button" className="vrf-primary" onClick={() => onEnquire(vehicle.id, 'On-road price request')}>
                Get price for {vehicle.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VrfLaunches({ vehicles, onNotify }) {
  const launches = vehicles
    .filter((vehicle) => vehicle.condition === 'New' || normalizeBrandKey(vehicle.badge).includes('new') || normalizeBrandKey(vehicle.fuel).includes('electric'))
    .slice(0, 4);
  const source = launches.length ? launches : vehicles.slice(0, 4);

  if (!source.length) return null;

  return (
    <section id="launches" className="vrf-section">
      <div className="vrf-container">
        <VrfSectionHead title="New launches & coming soon" kicker="Fresh metal" action="" />
        <div className="vrf-launch-grid">
          <div className="vrf-launch-cards">
            {source.map((vehicle) => (
              <div key={vehicle.id} className="vrf-launch-card">
                <div className="vrf-launch-media">
                  <img
                    src={vehicleImageOrFallback(vehicle)}
                    alt={vehicle.name}
                    onError={(event) => applyVehicleImageFallback(event, vehicle)}
                  />
                  <span className="vrf-badge" data-tone="warning" style={{ position: 'absolute', left: 12, top: 12 }}>Just launched</span>
                </div>
                <div style={{ padding: 16 }}>
                  <div className="vrf-card-brand">{displayBrandName(vehicle.brand)}</div>
                  <h3 style={{ margin: '4px 0 0', fontSize: 17, fontWeight: 950 }}>{vehicle.name}</h3>
                  <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 950 }}>{vehicle.price} onwards</p>
                </div>
              </div>
            ))}
          </div>

          <div className="vrf-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 950 }}>Launching soon</h3>
              <window.Icons.spark size={16} style={{ color: 'var(--vrf-muted)' }} />
            </div>
            {source.map((vehicle, index) => (
              <div key={`${vehicle.id}-soon`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderTop: index === 0 ? 0 : '1px solid var(--vrf-hairline)', paddingTop: index === 0 ? 0 : 14, marginTop: index === 0 ? 0 : 14 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 950 }}>{displayBrandName(vehicle.brand)} {vehicle.name}</div>
                  <div style={{ color: 'var(--vrf-muted)', fontSize: 11, fontWeight: 750 }}>{vehicle.price} · {vehicle.year}</div>
                </div>
                <button type="button" className="vrf-secondary" style={{ minHeight: 34, fontSize: 10 }} onClick={() => onNotify(vehicle.id, 'Launch notification request')}>Notify</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VrfEVZone({ vehicle, evCount, onExplore }) {
  if (!vehicle) return null;

  return (
    <section id="ev" className="vrf-section">
      <div className="vrf-container">
        <div className="vrf-ev-panel">
          <div className="vrf-two-col">
            <div>
              <span className="vrf-kicker" style={{ color: 'var(--vrf-success)' }}><window.Icons.ev size={13} /> EV Zone</span>
              <h2 style={{ margin: '18px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', lineHeight: 1.08, fontWeight: 950 }}>Electric, made simple.</h2>
              <p style={{ maxWidth: 500, color: 'var(--vrf-muted)', fontSize: 15, lineHeight: 1.65, fontWeight: 700 }}>
                Filter by fuel type, live dealer availability, and EMI. {evCount} verified EV listings are available from the marketplace database.
              </p>
              <div className="vrf-stat-grid" style={{ marginTop: 28 }}>
                <div className="vrf-stat-card"><window.Icons.ev size={18} style={{ color: 'var(--vrf-success)' }} /><div style={{ marginTop: 12, fontSize: 28, fontWeight: 950 }}>{evCount}</div><div className="vrf-card-brand">EV listings</div></div>
                <div className="vrf-stat-card"><window.Icons.gauge size={18} style={{ color: 'var(--vrf-success)' }} /><div style={{ marginTop: 12, fontSize: 28, fontWeight: 950 }}>{vehicle.km}</div><div className="vrf-card-brand">Range / usage</div></div>
                <div className="vrf-stat-card"><window.Icons.check size={18} style={{ color: 'var(--vrf-success)' }} /><div style={{ marginTop: 12, fontSize: 28, fontWeight: 950 }}>Live</div><div className="vrf-card-brand">DB stock</div></div>
              </div>
              <button type="button" className="vrf-primary" style={{ marginTop: 28, background: 'var(--vrf-success)' }} onClick={onExplore}>Explore all EVs <window.Icons.arrowRight size={15} style={{ verticalAlign: '-2px' }} /></button>
            </div>
            <div className="vrf-hero-car">
              <img
                src={vehicleImageOrFallback(vehicle)}
                alt={vrfModelLabel(vehicle)}
                onError={(event) => applyVehicleImageFallback(event, vehicle)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VrfEmiCalculator({ vehicle, onEligibility }) {
  const basePrice = Math.max(vrfPriceNumber(vehicle), 400000) || 1500000;
  const [price, setPrice] = React.useState(basePrice);
  const [down, setDown] = React.useState(Math.round(basePrice * 0.2));
  const [tenure, setTenure] = React.useState(5);
  const [rate, setRate] = React.useState(8.5);
  const result = React.useMemo(() => {
    const principal = Math.max(0, price - Math.min(down, Math.floor(price / 2)));
    const monthlyRate = rate / 100 / 12;
    const months = tenure * 12;
    const emi = monthlyRate === 0 ? principal / months : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return {
      emi: Math.round(emi),
      principal,
      interest: Math.round(emi * months - principal),
      total: Math.round(emi * months),
    };
  }, [price, down, tenure, rate]);

  const format = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`;

  return (
    <section id="finance" className="vrf-section">
      <div className="vrf-container">
        <div className="vrf-emi-panel">
          <div className="vrf-emi-left">
            <span className="vrf-card-brand" style={{ color: 'var(--vrf-brand-text)' }}>EMI Calculator</span>
            <h2 style={{ margin: '8px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.6rem)', lineHeight: 1.08, fontWeight: 950 }}>Plan your finance with confidence.</h2>
            <p style={{ color: 'var(--vrf-muted)', fontSize: 14, fontWeight: 700 }}>Adjust price, down payment, tenure, and interest rate to fit your budget.</p>

            <div className="vrf-range-row">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 850 }}><span>Vehicle price</span><strong style={{ color: 'var(--vrf-brand-text)' }}>{format(price)}</strong></div>
              <input type="range" min="400000" max="5000000" step="50000" value={price} onChange={(event) => setPrice(Number(event.target.value))} />
            </div>
            <div className="vrf-range-row">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 850 }}><span>Down payment</span><strong style={{ color: 'var(--vrf-brand-text)' }}>{format(Math.min(down, Math.floor(price / 2)))}</strong></div>
              <input type="range" min="0" max={Math.floor(price / 2)} step="10000" value={Math.min(down, Math.floor(price / 2))} onChange={(event) => setDown(Number(event.target.value))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 28 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 850 }}>Tenure (years)</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {[3, 5, 7].map((item) => <button key={item} type="button" className="vrf-chip" data-active={tenure === item} onClick={() => setTenure(item)}>{item}</button>)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 850 }}>Interest rate</div>
                <input className="vrf-input" type="number" step="0.1" value={rate} onChange={(event) => setRate(Number(event.target.value))} style={{ marginTop: 10, textAlign: 'center', fontWeight: 950 }} />
              </div>
            </div>
          </div>

          <div className="vrf-emi-result">
            <div>
              <span className="vrf-emi-result-label" style={{ color: 'rgb(255 253 247 / 0.8)' }}>Estimated EMI</span>
              <div className="vrf-emi-result-amount" style={{ color: '#fffdf7', textShadow: '0 1px 18px rgb(255 253 247 / 0.16)' }}>{format(result.emi)}<small style={{ color: 'rgb(255 253 247 / 0.74)' }}>/mo</small></div>
            </div>
            <div className="vrf-emi-breakdown">
              <div className="vrf-emi-breakdown-row" style={{ color: 'rgb(255 253 247 / 0.76)' }}><span>Principal</span><strong style={{ color: '#fffdf7' }}>{format(result.principal)}</strong></div>
              <div className="vrf-emi-breakdown-row" style={{ color: 'rgb(255 253 247 / 0.76)' }}><span>Total interest</span><strong style={{ color: '#fffdf7' }}>{format(result.interest)}</strong></div>
              <div className="vrf-emi-breakdown-row" style={{ color: 'rgb(255 253 247 / 0.76)' }}><span>Total payable</span><strong style={{ color: '#fffdf7' }}>{format(result.total)}</strong></div>
            </div>
            <button type="button" className="vrf-primary" style={{ background: '#fffdf7', color: '#0b0e12' }} onClick={() => onEligibility(vehicle, result)}>Check eligibility <window.Icons.arrowRight size={14} style={{ verticalAlign: '-2px' }} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function VrfTrustBand() {
  const items = [
    ['Verified pricing', 'Real on-road costs with dealer-backed database inventory.', 'check'],
    ['Dealer-backed', 'Listings are connected to live DealerSite marketplace stock.', 'brands'],
    ['Doorstep test drive', 'Capture test-drive interest directly from each model card.', 'testdrive'],
    ['Easy financing', 'EMI planning is built into the discovery experience.', 'gauge'],
    ['Buyer concierge', 'Lead actions are ready for dealership follow-up.', 'phone'],
  ];

  return (
    <section className="vrf-section vrf-trust">
      <div className="vrf-container">
        <div style={{ maxWidth: 680, marginBottom: 34 }}>
          <span className="vrf-card-brand" style={{ color: 'var(--vrf-brand-text)' }}>Why DealerSite Market</span>
          <h2 style={{ margin: '8px 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.6rem)', lineHeight: 1.08, fontWeight: 950 }}>Built for first-time clarity.</h2>
        </div>
        <div className="vrf-trust-grid">
          {items.map(([title, body, icon]) => {
            const Icon = window.Icons[icon] || window.Icons.check;
            return (
              <div key={title} className="vrf-trust-card">
                <div className="vrf-icon-tile"><Icon size={20} /></div>
                <h3 style={{ margin: '16px 0 0', fontSize: 15, fontWeight: 950 }}>{title}</h3>
                <p style={{ margin: '6px 0 0', color: 'var(--vrf-muted)', fontSize: 12, lineHeight: 1.55, fontWeight: 700 }}>{body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VrfDealerLocator({ dealers, city, onDealerAction }) {
  const pins = [
    ['20%', '30%'],
    ['45%', '55%'],
    ['60%', '25%'],
    ['35%', '75%'],
  ];
  const visibleDealers = dealers.slice(0, 4);

  return (
    <section id="dealers" className="vrf-section" style={{ background: '#F5F1EA', color: '#0B0E12' }}>
      <div className="vrf-container">
        <VrfSectionHead title="Find an authorized dealer near you." kicker="Visit in person" action="" />
        <div className="vrf-dealer-grid">
          <div className="vrf-map">
            {pins.map(([top, left], index) => (
              <div key={index} className="vrf-map-pin" style={{ top, left }}><window.Icons.mapPin size={17} /></div>
            ))}
            <span style={{ position: 'absolute', left: 16, bottom: 16, borderRadius: 8, background: 'rgb(255 255 255 / 0.82)', padding: '7px 10px', fontSize: 11, fontWeight: 950 }}>{city} · {dealers.length || 1} dealers</span>
          </div>
          <div className="vrf-dealer-list">
            {(visibleDealers.length ? visibleDealers : [{ name: 'DealerSite partner', location: city, brands: 'Multi-brand', image: '' }]).map((dealer, index) => (
              <div key={`${dealer.name}-${index}`} className="vrf-dealer-row">
                <div className="vrf-icon-tile"><window.Icons.mapPin size={17} /></div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h4 style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 950 }}>{dealer.name}</h4>
                    <span style={{ borderRadius: 6, background: 'var(--vrf-surface-2)', color: 'var(--vrf-muted)', padding: '2px 6px', fontSize: 10, fontWeight: 950 }}>{(index + 1) * 2}.4 km</span>
                  </div>
                  <p style={{ margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--vrf-muted)', fontSize: 11 }}>{dealer.brands}</p>
                  <p style={{ margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--vrf-muted)', fontSize: 11 }}>{dealer.location}</p>
                </div>
                <button type="button" className="vrf-icon-button" aria-label={`Request call from ${dealer.name}`} onClick={() => onDealerAction(dealer)} style={{ border: '1px solid var(--vrf-hairline)', borderRadius: '999px', width: 36, height: 36 }}><window.Icons.phone size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VrfFooter({ onJoin, onFooterLink }) {
  const [email, setEmail] = React.useState('');
  const columns = [
    ['Browse', [
      ['By Budget', '/budget'],
      ['By Brand', '/brands'],
      ['By Body Type', '/body-type'],
      ['EV Zone', '/ev'],
      ['Upcoming', '/upcoming'],
    ]],
    ['Tools', [
      ['EMI Calculator', '/tools/emi-calculator'],
      ['Compare Vehicles', '/compare'],
      ['On-Road Price', '/tools/on-road-price'],
      ['Dealer Locator', '/dealers'],
    ]],
    ['Company', [
      ['About', '/about'],
      ['Careers', '/careers'],
      ['Press', '/press'],
      ['Contact', '/contact'],
    ]],
    ['Legal', [
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
      ['Disclaimer', '/disclaimer'],
      ['Sitemap', '/sitemap.xml'],
    ]],
  ];

  return (
    <footer className="vrf-footer">
      <div className="vrf-container">
        <div className="vrf-footer-grid">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 950, color: '#F5F1EA' }}>DealerSite Market</div>
            <p style={{ maxWidth: 380, color: 'rgb(248 250 252 / 0.62)', fontSize: 14, lineHeight: 1.65, fontWeight: 650 }}>
              A marketplace-style discovery layer for dealer websites, powered by live database inventory.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <input className="vrf-input" placeholder="Your email" value={email} onChange={(event) => setEmail(event.target.value)} style={{ background: 'rgb(255 255 255 / 0.1)', borderColor: 'rgb(255 255 255 / 0.14)', color: 'var(--vrf-bg)' }} />
              <button type="button" className="vrf-primary" onClick={() => onJoin(email)}>Join</button>
            </div>
          </div>
          {columns.map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ margin: 0, color: 'rgb(248 250 252 / 0.5)', fontSize: 10, fontWeight: 950, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{heading}</h4>
              <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'grid', gap: 9 }}>
                {links.map(([link, target]) => {
                  return (
                  <li key={link}>
                    <a
                      href={target.startsWith('/') || target.startsWith('mailto:') ? target : `#${target}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onFooterLink(link, target);
                      }}
                      style={{ color: 'rgb(248 250 252 / 0.8)', textDecoration: 'none', fontSize: 14, fontWeight: 650 }}
                    >
                      {link}
                    </a>
                  </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', borderTop: '1px solid rgb(255 255 255 / 0.1)', paddingTop: 24, color: 'rgb(248 250 252 / 0.5)', fontSize: 11 }}>
          <span>© 2026 DealerSite Pro. All rights reserved.</span>
          <span>Made for Indian dealers</span>
        </div>
      </div>
    </footer>
  );
}

function RideFinderVehicleExplorer({ setMode }) {
  const [dbVehicles, setDbVehicles] = React.useState([]);
  const [loadingVehicles, setLoadingVehicles] = React.useState(true);
  const [inventoryMessage, setInventoryMessage] = React.useState('Loading live inventory from the database.');
  const [query, setQuery] = React.useState(initialVehicleSearchQuery);
  const [quickMode, setQuickMode] = React.useState('budget');
  const [budget, setBudget] = React.useState('All');
  const [brand, setBrand] = React.useState('All');
  const [body, setBody] = React.useState('All');
  const [fuel, setFuel] = React.useState('All');
  const [transmission, setTransmission] = React.useState('All');
  const [seats, setSeats] = React.useState('All');
  const [condition, setCondition] = React.useState(initialMarketplaceConditionFilter);
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = React.useState(initialVehicleCategoryFilter);
  const [sort, setSort] = React.useState('popular');
  const [viewMode, setViewMode] = React.useState('grid');
  const [compareIds, setCompareIds] = React.useState([]);
  const [showComparePanel, setShowComparePanel] = React.useState(false);
  const [savedIds, setSavedIds] = React.useState([]);
  const [status, setStatus] = React.useState('');
  const [visibleCount, setVisibleCount] = React.useState(12);
  const [showAllBrands, setShowAllBrands] = React.useState(false);
  const [brandDirectoryType, setBrandDirectoryType] = React.useState('4w');

  React.useEffect(() => {
    let active = true;

    async function loadVehicles() {
      try {
        const payload = await fetchAllMarketplaceVehicles();
        const rows = Array.isArray(payload.rows) ? payload.rows : [];
        const mapped = rows
          .map(mapDbVehicleToExplorer)
          .filter(Boolean);

        if (!active) return;
        if (mapped.length > 0) {
          setDbVehicles(mapped);
          const breakdown = vehicleConditionBreakdownLabel(mapped);
          setInventoryMessage(`Showing ${payload.total || mapped.length} live marketplace vehicles${breakdown ? ` (${breakdown})` : ''} including second-hand dealer and hybrid dealer stock.`);
        } else {
          setDbVehicles([]);
          setInventoryMessage('No marketplace vehicles returned yet. Add new or second-hand vehicles to the database to show model cards.');
        }
      } catch (error) {
        if (active) {
          setDbVehicles([]);
          setInventoryMessage('Marketplace inventory could not load. Model cards are hidden until the database responds.');
        }
      } finally {
        if (active) setLoadingVehicles(false);
      }
    }

    loadVehicles();
    return () => { active = false; };
  }, []);

  const vehicles = dbVehicles;
  const browseBudgets = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.budget), ['Under ₹5L', '₹5-10L', '₹10-15L', '₹15-20L', '₹20-30L', '₹30L+']).slice(0, 6), [vehicles]);
  const browseBrands = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.brand)), [vehicles]);
  const browseBodies = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.body), ['Hatchback', 'Sedan', 'Compact SUV', 'SUV', 'MUV', 'Coupe', 'Pickup']).slice(0, 12), [vehicles]);
  const fuelOptions = React.useMemo(() => uniqueVehicleValues(vehicles, 'fuel', ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']), [vehicles]);
  const transmissionOptions = React.useMemo(() => uniqueVehicleValues(vehicles, 'transmission', ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT']), [vehicles]);
  const seatOptions = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => compactText(vehicle.seats)), ['5', '7']).slice(0, 8), [vehicles]);
  const conditionOptions = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.condition), ['Used', 'Certified', 'New']), [vehicles]);
  const city = locationCity(vehicles[0]?.location);
  const dealers = React.useMemo(() => uniqueDealerCards(vehicles), [vehicles]);

  React.useEffect(() => {
    setVisibleCount(12);
  }, [query, budget, brand, body, fuel, transmission, seats, condition, vehicleCategoryFilter, sort, dbVehicles.length]);

  const filters = [
    vehicleCategoryFilter !== 'all' ? categoryFilterLabel(vehicleCategoryFilter) : null,
    query.trim() ? `Search: ${query.trim()}` : null,
    budget !== 'All' ? budget : null,
    brand !== 'All' ? displayBrandName(brand) : null,
    body !== 'All' ? body : null,
    fuel !== 'All' ? fuel : null,
    transmission !== 'All' ? transmission : null,
    seats !== 'All' ? `${seats} seats` : null,
    condition !== 'All' ? condition : null,
  ].filter(Boolean);

  const filterVehicleList = (sourceVehicles) => sourceVehicles.filter((vehicle) => {
    const text = `${vehicle.brand} ${vehicle.name} ${vehicle.variant} ${vehicle.type} ${vehicle.fuel} ${vehicle.body} ${vehicle.location}`.toLowerCase();
    return (vehicleCategoryFilter === 'all' || vehicle.category === vehicleCategoryFilter)
      && (!query.trim() || text.includes(query.trim().toLowerCase()))
      && (budget === 'All' || vehicle.budget === budget)
      && brandMatchesVehicle(vehicle, brand)
      && (body === 'All' || vehicle.body === body)
      && textOptionMatches(vehicle.fuel, fuel)
      && textOptionMatches(vehicle.transmission, transmission)
      && (seats === 'All' || compactText(vehicle.seats) === seats)
      && conditionMatchesVehicle(vehicle, condition);
  });

  let filtered = filterVehicleList(vehicles);
  filtered = [...filtered].sort((a, b) => {
    const price = (vehicle) => vrfPriceNumber(vehicle);
    if (sort === 'low') return price(a) - price(b);
    if (sort === 'high') return price(b) - price(a);
    if (sort === 'emi') return (a.emiValue || 0) - (b.emiValue || 0);
    if (condition === 'All') {
      const conditionRank = preOwnedSortRank(a) - preOwnedSortRank(b);
      if (conditionRank !== 0) return conditionRank;
    }
    return a.name.localeCompare(b.name);
  });

  const heroVehicle = React.useMemo(() => {
    return [...vehicles]
      .filter((vehicle) => compactText(vehicle?.image) && !isSharedFallbackVehicleImage(vehicle.image))
      .sort((a, b) => vrfPriceNumber(b) - vrfPriceNumber(a))[0] || null;
  }, [vehicles]);
  const evVehicles = vehicles.filter((vehicle) => vehicle.type === 'EVs' || vehicle.fuel.toLowerCase().includes('electric'));
  const evVehicle = evVehicles[0] || null;
  const visibleVehicles = filtered.slice(0, visibleCount);
  const hasMoreVehicles = filtered.length > visibleVehicles.length;
  const comparedVehicles = compareIds.map((id) => vehicles.find((vehicle) => vehicle.id === id)).filter(Boolean);
  const quickItems = quickMode === 'budget' ? browseBudgets : quickMode === 'brand' ? browseBrands : browseBodies;
  const activeQuickValue = quickMode === 'budget' ? budget : quickMode === 'brand' ? brand : body;
  const listingMessage = vehicles.length > 0 && filters.length > 0 && filtered.length === 0
    ? 'No DB vehicles match the selected filters.'
    : inventoryMessage;

  const selectBrand = (value, options = {}) => {
    setBrand(value);
    setBudget('All');
    setBody('All');
    setFuel('All');
    setTransmission('All');
    setSeats('All');
    setCondition('All');
    if (!options.preserveCategory) setVehicleCategoryFilter('all');
    setQuery('');
  };

  const clearFilters = () => {
    setBudget('All');
    setBrand('All');
    setBody('All');
    setFuel('All');
    setTransmission('All');
    setSeats('All');
    setCondition('All');
    setVehicleCategoryFilter('all');
    setQuery('');
  };

  const applyQuickFilter = (value) => {
    if (quickMode === 'budget') setBudget(value);
    if (quickMode === 'brand') selectBrand(value);
    if (quickMode === 'body') setBody(value);
  };

  const toggleCompare = (id) => {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-4));
  };

  React.useEffect(() => {
    if (compareIds.length < 2) setShowComparePanel(false);
  }, [compareIds.length]);

  const showStatus = (message) => {
    setStatus(message);
    window.clearTimeout(window.__vrfStatusTimer);
    window.__vrfStatusTimer = window.setTimeout(() => setStatus(''), 2600);
  };

  const vehicleIntentHref = (vehicle, intent, section = 'overview') => {
    const href = compactText(vehicle?.detailHref);
    if (!href) return '';
    const [base] = href.split('#');
    const separator = base.includes('?') ? '&' : '?';
    const hash = section ? `#${section}` : '';
    return `${base}${separator}intent=${encodeURIComponent(intent)}${hash}`;
  };

  const openVehicleIntent = (vehicle, intent, section = 'overview') => {
    const href = vehicleIntentHref(vehicle, intent, section);
    if (!href) return false;
    window.top.location.href = href;
    return true;
  };

  const toggleSave = (id) => {
    const vehicle = vehicles.find((item) => item.id === id);
    setSavedIds((current) => {
      const exists = current.includes(id);
      showStatus(`${exists ? 'Removed saved model' : 'Saved model'}${vehicle ? `: ${vrfModelLabel(vehicle)}` : ''}.`);
      return exists ? current.filter((item) => item !== id) : [...current, id];
    });
  };

  const handleEnquire = (id, message) => {
    const vehicle = vehicles.find((item) => item.id === id);
    if (!vehicle) {
      showStatus(`${message} for selected vehicle.`);
      return;
    }

    const intentText = normalizeBrandKey(message);
    if (intentText.includes('test drive')) {
      if (openVehicleIntent(vehicle, 'test-drive', 'overview')) return;
    } else if (intentText.includes('on road') || intentText.includes('price')) {
      if (openVehicleIntent(vehicle, 'on-road-price', 'emi')) return;
    } else if (intentText.includes('launch')) {
      if (openVehicleIntent(vehicle, 'launch-notification', 'overview')) return;
    }

    if (openVehicleIntent(vehicle, 'enquiry', 'overview')) return;
    showStatus(`${message} for ${vrfModelLabel(vehicle)}.`);
  };

  const handleCompare = () => {
    if (comparedVehicles.length < 2) {
      showStatus('Select at least two vehicles to compare side by side.');
      return;
    }
    setShowComparePanel(true);
  };

  const handleEligibility = (vehicle, result) => {
    if (openVehicleIntent(vehicle, 'emi-eligibility', 'emi')) return;
    showStatus(`Eligibility check ready for ${vrfModelLabel(vehicle)} at approx ${formatInrShort(result.emi)}/month.`);
  };

  const handleDealerAction = (dealer) => {
    const dealerName = compactText(dealer.name, 'nearest dealer');
    const dealerLocation = compactText(dealer.location, city);
    window.top.location.href = `mailto:sales@dealersitepro.com?subject=${encodeURIComponent(`Request call from ${dealerName}`)}&body=${encodeURIComponent(`Please arrange a callback for ${dealerName} in ${dealerLocation}.`)}`;
  };

  const handleFooterJoin = (email) => {
    const clean = compactText(email);
    if (!clean.includes('@')) {
      showStatus('Enter an email to join vehicle market updates.');
      return;
    }
    window.top.location.href = `mailto:sales@dealersitepro.com?subject=${encodeURIComponent('Join DealerSite Market updates')}&body=${encodeURIComponent(`Please add ${clean} to DealerSite Market updates.`)}`;
  };

  const handleFooterLink = (label, target) => {
    const cleanTarget = compactText(target);
    if (cleanTarget.startsWith('/') || cleanTarget.startsWith('mailto:')) {
      window.top.location.href = cleanTarget;
      return;
    }
    if (cleanTarget) vrfScrollToId(cleanTarget);
  };

  const openAllBrands = (type = '4w') => {
    setBrandDirectoryType(validBrandDirectoryType(type));
    setShowAllBrands(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => vrfScrollToId('all-brands'));
    });
  };

  const closeAllBrands = () => {
    setShowAllBrands(false);
    window.requestAnimationFrame(() => vrfScrollToId('brands'));
  };

  React.useEffect(() => {
    const handleMarketFilter = (event) => {
      const detail = event.detail || {};
      const kind = normalizeBrandKey(detail.kind);
      const value = compactText(detail.value);

      if (kind === 'brand' && value) {
        setShowAllBrands(false);
        setVehicleCategoryFilter('all');
        selectBrand(value);
      } else if (kind === 'budget' && value) {
        setShowAllBrands(false);
        setVehicleCategoryFilter('all');
        setBudget(value);
        setBrand('All');
        setBody('All');
        setQuery('');
      } else if (kind === 'body' && value) {
        setShowAllBrands(false);
        setVehicleCategoryFilter('all');
        setBody(value);
        setBudget('All');
        setBrand('All');
        setQuery('');
      } else if (kind === 'type' && value) {
        setShowAllBrands(false);
        setVehicleCategoryFilter(categoryFilterForType(value));
        setQuery('');
        setBudget('All');
        setBrand('All');
        setBody('All');
        setFuel('All');
        setTransmission('All');
        setSeats('All');
      } else if (kind === 'search') {
        setShowAllBrands(false);
        setVehicleCategoryFilter('all');
        setQuery(value);
        setBudget('All');
        setBrand('All');
        setBody('All');
      }

      setVisibleCount(12);
      if (detail.scroll !== false) {
        window.requestAnimationFrame(vrfScrollToListing);
      }
    };

    window.addEventListener('dsp-market-filter', handleMarketFilter);
    return () => window.removeEventListener('dsp-market-filter', handleMarketFilter);
  }, []);

  React.useEffect(() => {
    const handleBrandsOpen = (event) => {
      openAllBrands(event.detail?.type || '4w');
    };

    window.addEventListener('dsp-market-brands-open', handleBrandsOpen);
    return () => window.removeEventListener('dsp-market-brands-open', handleBrandsOpen);
  }, []);

  const listingProps = {
    vehicles,
    filtered,
    visibleVehicles,
    hasMoreVehicles,
    loadingVehicles,
    listingMessage,
    city,
    filters,
    query,
    setQuery,
    sort,
    setSort,
    viewMode,
    setViewMode,
    compareIds,
    savedIds,
    toggleCompare,
    toggleSave,
    handleEnquire,
    setVisibleCount,
    clearFilters,
    vehicleCategoryFilter,
    setVehicleCategoryFilter,
    budgets: browseBudgets,
    brands: browseBrands,
    bodies: browseBodies,
    fuels: fuelOptions,
    transmissions: transmissionOptions,
    seatsList: seatOptions,
    conditions: conditionOptions,
    budget,
    brand,
    body,
    fuel,
    transmission,
    seats,
    condition,
    setBudget,
    selectBrand,
    setBody,
    setFuel,
    setTransmission,
    setSeats,
    setCondition,
  };

  return (
    <div id="market-top" className="vrf-market">
      <VrfHero
        vehicles={vehicles}
        heroVehicle={heroVehicle}
        query={query}
        setQuery={setQuery}
        quickMode={quickMode}
        setQuickMode={setQuickMode}
        quickItems={quickItems}
        activeQuickValue={activeQuickValue}
        applyQuickFilter={applyQuickFilter}
      />
      <VrfBrowseRails
        vehicles={vehicles}
        budgets={browseBudgets}
        bodies={browseBodies}
        brands={browseBrands}
        budget={budget}
        body={body}
        brand={brand}
        setBudget={setBudget}
        setBody={setBody}
        selectBrand={selectBrand}
        openAllBrands={openAllBrands}
      />
      <VrfAllBrandsDirectory
        vehicles={vehicles}
        visible={showAllBrands}
        activeType={brandDirectoryType}
        setActiveType={setBrandDirectoryType}
        onClose={closeAllBrands}
      />
      <VrfListing {...listingProps} />
      <VrfComparePanel
        vehicles={comparedVehicles}
        visible={showComparePanel}
        onRemove={toggleCompare}
        onClose={() => setShowComparePanel(false)}
        onEnquire={handleEnquire}
      />
      <VrfLaunches vehicles={vehicles} onNotify={handleEnquire} />
      <VrfEVZone vehicle={evVehicle} evCount={evVehicles.length} onExplore={() => { clearFilters(); setFuel('Electric'); vrfScrollToListing(); }} />
      {heroVehicle ? <VrfEmiCalculator vehicle={heroVehicle} onEligibility={handleEligibility} /> : null}
      <VrfTrustBand />
      <VrfDealerLocator dealers={dealers} city={city} onDealerAction={handleDealerAction} />
      <VrfFooter onJoin={handleFooterJoin} onFooterLink={handleFooterLink} />
      {!showComparePanel ? (
        <VrfCompareTray vehicles={comparedVehicles} onRemove={toggleCompare} onClear={() => setCompareIds([])} onCompare={handleCompare} />
      ) : null}
      {status ? <div className="vrf-toast"><window.Icons.check size={14} style={{ verticalAlign: '-2px' }} /> {status}</div> : null}
    </div>
  );
}

window.ExplorerToggle = ExplorerToggle;
window.VehicleExplorer = RideFinderVehicleExplorer;
