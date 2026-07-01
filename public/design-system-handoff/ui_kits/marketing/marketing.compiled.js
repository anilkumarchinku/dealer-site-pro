var VehicleExplorerBundle = (() => {
  const DSP_MARKETPLACE_PAGE_SIZE = 48;
  const DSP_MARKETPLACE_ENDPOINT = `/api/marketplace?pageSize=${DSP_MARKETPLACE_PAGE_SIZE}&category=all&condition=all`;
  const DSP_BRAND_ALIASES = {
    ambasador: "ambassador",
    ambassador: "ambassador",
    "bajaj auto": "bajaj",
    "bajaj auto 3w": "bajaj",
    "bajaj 3w": "bajaj",
    "hero motocorp": "hero",
    "honda motorcycle and scooter india": "honda motorcycles",
    "honda motorcycles and scooters india": "honda motorcycles",
    "honda city": "honda",
    "hyundai creta": "hyundai",
    "maruti suzuki": "maruti",
    "ola electric": "ola",
    "piaggio ape": "piaggio",
    "royal enfield": "royal enfield",
    "suzuki motorcycle": "suzuki",
    "tata motors": "tata",
    "tvs motor": "tvs",
    "tvs motor company": "tvs",
    "tvs king": "tvs"
  };
  const DSP_BRAND_LOGOS = {
    acura: "/assets/logos/acura.png",
    ambasador: "/assets/logos/ambassador.svg",
    ambassador: "/assets/logos/ambassador.svg",
    aprilia: "/assets/logos/2w/aprilia.svg",
    "ashok leyland": "/assets/logos/ashok-leyland.png",
    "aston martin": "/assets/logos/aston-martin.svg",
    ather: "/assets/logos/2w/ather-energy.svg",
    "ather energy": "/assets/logos/2w/ather-energy.svg",
    audi: "/assets/logos/audi.png",
    bajaj: "/assets/logos/2w/bajaj-auto.svg",
    "bajaj auto": "/assets/logos/2w/bajaj-auto.svg",
    bentley: "/assets/logos/bentley.png",
    bmw: "/assets/logos/bmw.png",
    "bmw motorrad": "/assets/logos/2w/bmw-motorrad.svg",
    byd: "/assets/logos/byd.png",
    cfmoto: "/assets/logos/2w/cfmoto.png",
    chevrolet: "/assets/logos/chevrolet.png",
    citroen: "/assets/logos/citroen.png",
    ducati: "/assets/logos/2w/ducati.svg",
    ferrari: "/assets/logos/ferrari.svg",
    force: "/assets/logos/force-motors.png",
    "force motors": "/assets/logos/force-motors.png",
    ford: "/assets/logos/ford.png",
    gmc: "/assets/logos/gmc.png",
    greaves: "/assets/logos/greaves.png",
    "harley davidson": "/assets/logos/2w/harley-davidson.svg",
    hero: "/assets/logos/2w/hero-motocorp.svg",
    "hero motocorp": "/assets/logos/2w/hero-motocorp.svg",
    honda: "/assets/logos/honda.png",
    "honda motorcycles": "/assets/logos/2w/honda-motorcycles.svg",
    husqvarna: "/assets/logos/2w/husqvarna.svg",
    hyundai: "/assets/logos/hyundai.png",
    isuzu: "/assets/logos/isuzu.png",
    jaguar: "/assets/logos/jaguar.png",
    jeep: "/assets/logos/jeep.png",
    kawasaki: "/assets/logos/2w/kawasaki.svg",
    kia: "/assets/logos/kia.png",
    kinetic: "/assets/logos/kinetic.png",
    ktm: "/assets/logos/2w/ktm.svg",
    lamborghini: "/assets/logos/lamborghini.png",
    "land rover": "/assets/logos/land-rover.png",
    lexus: "/assets/logos/lexus.png",
    mahindra: "/assets/logos/mahindra.png",
    maruti: "/assets/logos/maruti-suzuki.png",
    "maruti suzuki": "/assets/logos/maruti-suzuki.png",
    maserati: "/assets/logos/maserati.svg",
    mazda: "/assets/logos/mazda.png",
    "mercedes benz": "/assets/logos/mercedes-benz.png",
    mg: "/assets/logos/mg.png",
    mini: "/assets/logos/mini.png",
    nissan: "/assets/logos/nissan.png",
    ola: "/assets/logos/2w/ola-electric.svg",
    "ola electric": "/assets/logos/2w/ola-electric.svg",
    piaggio: "/assets/logos/piaggio.png",
    porsche: "/assets/logos/porsche.png",
    ram: "/assets/logos/ram.png",
    renault: "/assets/logos/renault.png",
    "rolls royce": "/assets/logos/rolls-royce.svg",
    "royal enfield": "/assets/logos/2w/royal-enfield.svg",
    skoda: "/assets/logos/skoda.png",
    subaru: "/assets/logos/subaru.png",
    suzuki: "/assets/logos/2w/suzuki-motorcycle.png",
    "suzuki motorcycle": "/assets/logos/2w/suzuki-motorcycle.png",
    tata: "/assets/logos/tata-motors.png",
    "tata motors": "/assets/logos/tata-motors.png",
    tesla: "/assets/logos/tesla.png",
    toyota: "/assets/logos/toyota.png",
    triumph: "/assets/logos/2w/triumph.svg",
    tvs: "/assets/logos/2w/tvs-motor.svg",
    "tvs motor": "/assets/logos/2w/tvs-motor.svg",
    vespa: "/assets/logos/2w/vespa.svg",
    vinfast: "/assets/logos/vinfast.png",
    volkswagen: "/assets/logos/volkswagen.png",
    volvo: "/assets/logos/volvo.png",
    vw: "/assets/logos/volkswagen.png",
    yamaha: "/assets/logos/2w/yamaha.svg"
  };
  const DSP_CATEGORY_BRAND_LOGOS = {
    "2w": {
      ather: "/data/brand-logos/ather-energy.png",
      "ather energy": "/data/brand-logos/ather-energy.png",
      bajaj: "/data/brand-logos/bajaj-auto.png",
      "bajaj auto": "/data/brand-logos/bajaj-auto.png",
      "bajaj chetak": "/data/brand-logos/bajaj-chetak-ev.png",
      "bajaj chetak ev": "/data/brand-logos/bajaj-chetak-ev.png",
      bmw: "/data/brand-logos/bmw-motorrad-india.png",
      "bmw motorrad": "/data/brand-logos/bmw-motorrad-india.png",
      "bmw motorrad india": "/data/brand-logos/bmw-motorrad-india.png",
      greaves: "/data/brand-logos/greaves-mobility.png",
      hero: "/data/brand-logos/hero-motocorp.png",
      "hero motocorp": "/data/brand-logos/hero-motocorp.png",
      "hero electric": "/data/brand-logos/hero-electric.png",
      "hero ev": "/data/brand-logos/hero-ev.png",
      honda: "/data/brand-logos/honda-hmsi.png",
      "honda hmsi": "/data/brand-logos/honda-hmsi.png",
      "honda motorcycles": "/data/brand-logos/honda-hmsi.png",
      "honda motorcycle and scooter india": "/data/brand-logos/honda-hmsi.png",
      indian: "/data/brand-logos/indian-motorcycle.png",
      "indian motorcycle": "/data/brand-logos/indian-motorcycle.png",
      kawasaki: "/data/brand-logos/kawasaki-india.png",
      "kawasaki india": "/data/brand-logos/kawasaki-india.png",
      ktm: "/data/brand-logos/ktm-india.png",
      "ktm india": "/data/brand-logos/ktm-india.png",
      mahindra: "/data/brand-logos/mahindra-two-wheelers.png",
      "mahindra two wheelers": "/data/brand-logos/mahindra-two-wheelers.png",
      ola: "/data/brand-logos/ola-electric.png",
      "ola electric": "/data/brand-logos/ola-electric.png",
      piaggio: "/data/brand-logos/vespa-india.png",
      suzuki: "/data/brand-logos/suzuki-motorcycle.png",
      "suzuki motorcycle": "/data/brand-logos/suzuki-motorcycle.png",
      triumph: "/data/brand-logos/triumph-india.png",
      "triumph india": "/data/brand-logos/triumph-india.png",
      tvs: "/data/brand-logos/tvs-motor.png",
      "tvs motor": "/data/brand-logos/tvs-motor.png",
      "tvs motor company": "/data/brand-logos/tvs-motor-company.png",
      vespa: "/data/brand-logos/vespa-india.png",
      "vespa india": "/data/brand-logos/vespa-india.png",
      yamaha: "/data/brand-logos/yamaha-india.png",
      "yamaha india": "/data/brand-logos/yamaha-india.png"
    },
    "3w": {
      atul: "/data/brand-logos/atul-auto.png",
      "atul auto": "/data/brand-logos/atul-auto.png",
      bajaj: "/data/brand-logos/bajaj-auto-3w.png",
      "bajaj auto": "/data/brand-logos/bajaj-auto-3w.png",
      "bajaj auto 3w": "/data/brand-logos/bajaj-auto-3w.png",
      greaves: "/data/brand-logos/greaves-electric-3w.png",
      "greaves electric": "/data/brand-logos/greaves-electric-3w.png",
      "greaves electric 3w": "/data/brand-logos/greaves-electric-3w.png",
      mahindra: "/data/brand-logos/mahindra-3w.png",
      "mahindra 3w": "/data/brand-logos/mahindra-3w.png",
      "mahindra last mile mobility": "/data/brand-logos/mahindra-last-mile-mobility.png",
      piaggio: "/data/brand-logos/piaggio-ape.png",
      "piaggio ape": "/data/brand-logos/piaggio-ape.png",
      "piaggio vehicles": "/data/brand-logos/piaggio-vehicles.png",
      tvs: "/data/brand-logos/tvs-king.png",
      "tvs king": "/data/brand-logos/tvs-king.png"
    },
    "4w": {
      bajaj: "/data/brand-logos/bajaj-auto.png",
      bmw: "/data/brand-logos/bmw.png",
      honda: "/data/brand-logos/honda.png",
      mahindra: "/data/brand-logos/mahindra.png",
      maruti: "/data/brand-logos/maruti-suzuki.png",
      "maruti suzuki": "/data/brand-logos/maruti-suzuki.png",
      piaggio: "/data/brand-logos/piaggio-vehicles.png",
      suzuki: "/data/brand-logos/maruti-suzuki.png",
      tata: "/data/brand-logos/tata-motors.png",
      "tata motors": "/data/brand-logos/tata-motors.png"
    }
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
    "zontes india": "/data/brand-logos/zontes-india.png"
  };
  const DSP_LOCAL_MODEL_IMAGE_OVERRIDES = [
    ["4w", ["ferrari"], ["12cilindri"], "/data/brand-model-images/4w/ferrari/amalfi.jpg"],
    ["4w", ["ferrari"], ["ferrari 12cilindri"], "/data/brand-model-images/4w/ferrari/amalfi.jpg"],
    ["3w", ["altigreen"], ["neev bhai flatbed"], "/images/3w/altigreen/neev-bhai-flatbed.jpg"],
    ["3w", ["altigreen"], ["neev bhai low deck"], "/images/3w/altigreen/neev-bhai-low-deck.jpg"],
    ["3w", ["altigreen"], ["neev flatbed"], "/images/3w/altigreen/neev-flatbed.jpg"],
    ["3w", ["altigreen"], ["neev high deck"], "/images/3w/altigreen/neev-high-deck.jpg"],
    ["3w", ["altigreen"], ["neev low deck"], "/images/3w/altigreen/neev-low-deck.jpg"],
    ["3w", ["altigreen"], ["neev rahi"], "/images/3w/altigreen/neev-rahi.jpg"],
    ["3w", ["altigreen"], ["neev tez"], "/images/3w/altigreen/neev-tez.jpg"],
    ["3w", ["mahindra"], ["alfa champ"], "/images/3w/mahindra-3w/alfa-champ.jpg"],
    ["3w", ["mahindra"], ["alfa comfy"], "/images/3w/mahindra-3w/alfa-comfy.jpg"],
    ["3w", ["mahindra"], ["alfa dx duo"], "/images/3w/mahindra-3w/alfa-dx-duo.jpg"],
    ["3w", ["mahindra"], ["alfa dx"], "/images/3w/mahindra-3w/alfa-dx.jpg"],
    ["3w", ["mahindra"], ["alfa plus duo"], "/data/brand-model-images/mahindra-last-mile-mobility/alfa-plus-duo.png"],
    ["3w", ["mahindra"], ["alfa plus"], "/images/3w/mahindra-3w/alfa-plus.jpg"],
    ["3w", ["mahindra"], ["alfa load"], "/images/3w/mahindra-3w/alfa-load.jpg"],
    ["3w", ["mahindra"], ["e alfa cargo"], "/images/3w/mahindra-3w/e-alfa-cargo.jpg"],
    ["3w", ["mahindra"], ["e alfa mini"], "/images/3w/mahindra-3w/e-alfa-mini.jpg"],
    ["3w", ["mahindra"], ["e alfa plus"], "/images/3w/mahindra-3w/e-alfa-plus.jpg"],
    ["3w", ["mahindra"], ["e alfa super"], "/images/3w/mahindra-3w/e-alfa-super.jpg"],
    ["3w", ["mahindra"], ["treo yaari cargo"], "/images/3w/mahindra-3w/treo-yaari-cargo.jpg"],
    ["3w", ["mahindra"], ["treo yaari passenger"], "/images/3w/mahindra-3w/treo-yaari-passenger.jpg"],
    ["3w", ["mahindra"], ["treo yaari"], "/images/3w/mahindra-3w/treo-yaari.jpg"],
    ["3w", ["mahindra"], ["treo plus"], "/images/3w/mahindra-3w/treo-plus.jpg"],
    ["3w", ["mahindra"], ["treo zor"], "/images/3w/mahindra-3w/treo-zor.jpg"],
    ["3w", ["mahindra"], ["treo"], "/images/3w/mahindra-3w/treo.jpg"],
    ["3w", ["mahindra"], ["zor grand range plus"], "/images/3w/mahindra-3w/zor-grand-range-plus.jpg"],
    ["3w", ["mahindra"], ["zor grand"], "/images/3w/mahindra-3w/zor-grand.jpg"],
    ["3w", ["mahindra"], ["udo"], "/images/3w/mahindra-3w/udo.jpg"]
  ];
  function marketplacePageUrl(page = 1, condition = "all") {
    const params = new URLSearchParams({
      pageSize: String(DSP_MARKETPLACE_PAGE_SIZE),
      page: String(page),
      category: "all",
      condition
    });
    return `/api/marketplace?${params.toString()}`;
  }
  function isBadVehicleImageUrl(url) {
    const value = compactText(url).toLowerCase();
    if (!value) return true;
    return [
      "whatsapp",
      "logo",
      "avatar",
      "icon",
      "placeholder",
      "stimg.cardekho.com/images/carexteriorimages",
      "dealer-assets/dealers",
      "/assets/cars/aston-martin/db11",
      "/assets/cars/aston-martin/aston-martin-db11",
      "/assets/cars/aston-martin/dbs-superleggera",
      "/assets/cars/mclaren/750s",
      "/assets/cars/bmw/8-series-gran-coupe",
      "/assets/cars/ferrari/12cilindri",
      "/assets/cars/ferrari/ferrari-12cilindri",
      "/assets/cars/bugatti/divo",
      "/assets/cars/bugatti/bugatti-divo",
      "/data/brand-model-images/4w/ferrari/12cilindri",
      "/data/brand-model-images/4w/ferrari/ferrari-12cilindri",
      "/data/brand-model-images/4w/bugatti/divo",
      "/data/brand-model-images/4w/bugatti/bugatti-divo",
      "/data/brand-model-images/4w/aston-martin/dbs-superleggera",
      "/data/brand-model-images/4w/aston-martin/aston-martin-dbs-superleggera",
      "/data/brand-model-images/4w/citroen/a",
      "/data/brand-model-images/4w/citroen/citroen-a",
      "/data/brand-model-images/4w/tata/indigo",
      "/data/brand-model-images/4w/tata/tata-indigo",
      "/data/brand-model-images/3w/altigreen/neev-bhai-flatbed",
      "/data/brand-model-images/3w/altigreen/neev-flatbed",
      "/data/brand-model-images/3w/altigreen/neev-bhai-low-deck",
      "/data/brand-model-images/3w/altigreen/neev-high-deck",
      "/data/brand-model-images/3w/altigreen/neev-bhai",
      "/data/brand-model-images/3w/altigreen/neev-bhai-low",
      "/data/brand-model-images/3w/altigreen/neev-high"
    ].some((token) => value.includes(token));
  }
  async function fetchMarketplacePage(page = 1, condition = "all") {
    const response = await fetch(marketplacePageUrl(page, condition), { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Marketplace API returned ${response.status}`);
    return response.json();
  }
  async function fetchMarketplaceCondition(condition) {
    var _a, _b, _c;
    const firstPayload = await fetchMarketplacePage(1, condition);
    const firstRows = Array.isArray((_a = firstPayload == null ? void 0 : firstPayload.data) == null ? void 0 : _a.vehicles) ? firstPayload.data.vehicles : [];
    const totalPages = Math.max(1, Number((_b = firstPayload == null ? void 0 : firstPayload.data) == null ? void 0 : _b.totalPages) || 1);
    const restPages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => index + 2);
    const restPayloads = await Promise.all(restPages.map((page) => fetchMarketplacePage(page, condition)));
    const restRows = restPayloads.flatMap((payload) => {
      var _a2;
      return Array.isArray((_a2 = payload == null ? void 0 : payload.data) == null ? void 0 : _a2.vehicles) ? payload.data.vehicles : [];
    });
    return {
      rows: [...firstRows, ...restRows],
      total: Number((_c = firstPayload == null ? void 0 : firstPayload.data) == null ? void 0 : _c.total) || firstRows.length + restRows.length,
      totalPages
    };
  }
  async function fetchAllMarketplaceVehicles() {
    const payloads = [
      await fetchMarketplaceCondition("all").catch(() => ({ rows: [], total: 0, totalPages: 0 })),
      await fetchMarketplaceCondition("used").catch(() => ({ rows: [], total: 0, totalPages: 0 })),
      await fetchMarketplaceCondition("certified_pre_owned").catch(() => ({ rows: [], total: 0, totalPages: 0 }))
    ];
    const seen = /* @__PURE__ */ new Set();
    const rows = payloads.flatMap((payload) => payload.rows).filter((row) => {
      const key = `${(row == null ? void 0 : row.vehicle_category) || "vehicle"}:${(row == null ? void 0 : row.condition) || "available"}:${(row == null ? void 0 : row.id) || ""}`;
      if (!(row == null ? void 0 : row.id) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return {
      rows,
      total: payloads.reduce((sum, payload) => sum + (Number(payload.total) || payload.rows.length), 0),
      totalPages: Math.max(...payloads.map((payload) => Number(payload.totalPages) || 0), 1)
    };
  }
  function compactText(value, fallback = "") {
    return String(value != null ? value : fallback).trim();
  }
  function normalizeBrandKey(value) {
    return compactText(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function simplifyBrandKey(value) {
    return normalizeBrandKey(value).replace(/\b(motors?|motorcycles?|motocorp|automobiles?|auto|electric|cars|india|ltd|limited|pvt|private)\b/g, " ").replace(/\s+/g, " ").trim();
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
    if (selectedBrand === "All") return true;
    const selected = canonicalBrandKey(selectedBrand);
    return [vehicle.brand, vehicle.brandKey, `${vehicle.brand} ${vehicle.name}`].some((value) => {
      const candidate = canonicalBrandKey(value);
      return candidate === selected || candidate.includes(selected) || selected.includes(candidate);
    });
  }
  function brandOptionIsSelected(optionBrand, selectedBrand) {
    return selectedBrand !== "All" && canonicalBrandKey(optionBrand) === canonicalBrandKey(selectedBrand);
  }
  function validVehicleCategory(value) {
    return value === "2w" || value === "3w" || value === "4w" ? value : "";
  }
  function brandLogoFor(name, category = "") {
    const raw = normalizeBrandKey(name);
    const simple = simplifyBrandKey(name);
    const canonical = canonicalBrandKey(name);
    const safeCategory = validVehicleCategory(category);
    const categoryLogos = safeCategory ? DSP_CATEGORY_BRAND_LOGOS[safeCategory] : null;
    if (categoryLogos) {
      const categoryKeys = [raw, simple, canonical].filter(Boolean);
      const exactCategoryKey = categoryKeys.find((key) => categoryLogos[key]);
      if (exactCategoryKey) return categoryLogos[exactCategoryKey];
      const categoryMatch = Object.keys(categoryLogos).sort((a, b) => b.length - a.length).find((key) => categoryKeys.some((candidate) => candidate === key || candidate.startsWith(`${key} `) || candidate.includes(` ${key} `) || key.startsWith(`${candidate} `)));
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
    return dataSimpleMatch ? DSP_DATA_BRAND_LOGOS[dataSimpleMatch] : "";
  }
  function displayBrandName(name) {
    const key = normalizeBrandKey(name);
    if (key === "ambasador") return "Ambassador";
    if (key === "honda motorcycle and scooter india") return "Honda";
    if (key === "tvs motor company") return "TVS";
    if (key === "bajaj auto 3w") return "Bajaj";
    if (key === "piaggio ape") return "Piaggio";
    if (key === "mahindra 3w") return "Mahindra";
    return name;
  }
  function brandPageHrefFor(name, category = "4w") {
    const safeCategory = category === "2w" || category === "3w" || category === "4w" ? category : "4w";
    return `/brands/${encodeURIComponent(name)}?type=${safeCategory}`;
  }
  function openTopWindowHref(href) {
    const cleanHref = compactText(href);
    if (!cleanHref) return;
    try {
      window.top.location.href = cleanHref;
    } catch (e) {
      window.location.href = cleanHref;
    }
  }
  function numberFromPaise(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric / 100) : 0;
  }
  function formatInrShort(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) return "Price on request";
    if (amount >= 1e7) return `\u20B9${(amount / 1e7).toFixed(2).replace(/\.00$/, "")}Cr`;
    if (amount >= 1e5) return `\u20B9${(amount / 1e5).toFixed(amount >= 1e6 ? 2 : 1).replace(/\.0$/, "")}L`;
    return `\u20B9${Math.round(amount).toLocaleString("en-IN")}`;
  }
  function estimateEmi(priceInr) {
    if (!priceInr || priceInr <= 0) return "Ask dealer";
    return `\u20B9${Math.max(2500, Math.round(priceInr * 0.019 / 50) * 50).toLocaleString("en-IN")}/mo`;
  }
  function budgetForPrice(priceInr) {
    const lakh = priceInr / 1e5;
    if (!priceInr || lakh < 5) return "Under \u20B95L";
    if (lakh < 10) return "\u20B95-10L";
    if (lakh < 15) return "\u20B910-15L";
    if (lakh < 20) return "\u20B915-20L";
    if (lakh < 30) return "\u20B920-30L";
    return "\u20B930L+";
  }
  function normalizeBodyType(row, vehicleType) {
    const body = compactText(row.body_type);
    if (body) return body;
    if (vehicleType === "Bikes") return "Motorcycle";
    if (vehicleType === "Autos") return "Passenger Auto";
    return "Car";
  }
  function inferVehicleType(row) {
    var _a, _b, _c, _d;
    if (row.vehicle_category === "2w") return "Bikes";
    if (row.vehicle_category === "3w") return "Autos";
    if (row.vehicle_category === "4w") return "Cars";
    const text = `${(_a = row.make) != null ? _a : ""} ${(_b = row.model) != null ? _b : ""} ${(_c = row.body_type) != null ? _c : ""} ${(_d = row.fuel_type) != null ? _d : ""}`.toLowerCase();
    if (text.includes("auto") || text.includes("rickshaw") || text.includes("three-wheeler")) return "Autos";
    if (text.includes("scooter")) return "Bikes";
    if (text.includes("motorcycle") || text.includes("bike") || text.includes("motocorp") || text.includes("royal enfield") || text.includes("yamaha") || text.includes("tvs")) return "Bikes";
    if (text.includes("electric") || text.includes("ev")) return "EVs";
    return "Cars";
  }
  function categoryFilterForType(value) {
    const clean = normalizeBrandKey(value);
    if (clean.includes("bike") || clean.includes("scooter") || clean === "2w") return "2w";
    if (clean.includes("auto") || clean.includes("3w") || clean.includes("three wheeler")) return "3w";
    if (clean.includes("car") || clean === "4w" || clean.includes("four wheeler")) return "4w";
    return "all";
  }
  function categoryFilterLabel(value) {
    if (value === "2w") return "Bikes & Scooters";
    if (value === "3w") return "Autos & 3W";
    if (value === "4w") return "Cars";
    return "All vehicle types";
  }
  function initialVehicleCategoryFilter() {
    try {
      const params = new URLSearchParams(window.location.search);
      const category = compactText(params.get("category") || params.get("type")).toLowerCase();
      if (category === "2w" || category === "bike" || category === "bikes") return "2w";
      if (category === "3w" || category === "auto" || category === "autos") return "3w";
      if (category === "4w" || category === "car" || category === "cars") return "4w";
    } catch (e) {
      return "all";
    }
    return "all";
  }
  function initialVehicleSearchQuery() {
    try {
      const params = new URLSearchParams(window.location.search);
      return compactText(params.get("q") || params.get("search"));
    } catch (e) {
      return "";
    }
  }
  function initialMarketplaceConditionFilter() {
    try {
      const params = new URLSearchParams(window.location.search);
      const condition = normalizeBrandKey(params.get("condition"));
      if (condition === "new") return "New";
      if (condition === "used") return "Used";
      if (condition === "certified" || condition === "certified pre owned" || condition === "certified_pre_owned") return "Certified";
    } catch (e) {
      return "All";
    }
    return "All";
  }
  function localModelOverrideImageFor(row) {
    const category = validVehicleCategory(row.vehicle_category);
    const makeKey = canonicalBrandKey(row.make);
    const modelKey = normalizeBrandKey(`${row.model || ""} ${row.variant || ""}`);
    const match = DSP_LOCAL_MODEL_IMAGE_OVERRIDES.find(([entryCategory, makes, models]) => {
      if (entryCategory && entryCategory !== category) return false;
      const makeMatches = makes.some((make) => makeKey === canonicalBrandKey(make));
      if (!makeMatches) return false;
      return models.some((model) => {
        const normalizedModel = normalizeBrandKey(model);
        return modelKey === normalizedModel || modelKey.startsWith(`${normalizedModel} `) || modelKey.includes(` ${normalizedModel} `);
      });
    });
    return (match == null ? void 0 : match[3]) || "";
  }
  function imageForVehicle(row, vehicleType, bodyType) {
    var _a;
    const localOverrideImage = localModelOverrideImageFor(row);
    if (localOverrideImage) return localOverrideImage;
    const localModelImage = ((_a = window.dspModelGalleryImageFor) == null ? void 0 : _a.call(window, row.make, row.model)) || "";
    if (compactText(row.condition).toLowerCase() === "new" && localModelImage && !isBadVehicleImageUrl(localModelImage)) return localModelImage;
    const imageList = Array.isArray(row.image_urls) ? row.image_urls.filter(Boolean) : [];
    const image = [row.image_url, ...imageList].map((item) => compactText(item)).find((item) => item && !isBadVehicleImageUrl(item));
    if (image) return image;
    if (localModelImage && !isBadVehicleImageUrl(localModelImage)) return localModelImage;
    return "";
  }
  function vehicleImageOrFallback(vehicle) {
    return compactText(vehicle == null ? void 0 : vehicle.image);
  }
  function vehicleCardImageSourceKind(src) {
    const value = compactText(src).toLowerCase();
    if (value.includes("/storage/v1/object/public/dealer-assets/vehicles/") || value.includes("/storage/v1/object/public/dealer-assets/sell-requests/")) {
      return "inventory-photo";
    }
    return "resolved-model";
  }
  function applyVehicleImageFallback(event, vehicle) {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied === "true") return;
    image.dataset.fallbackApplied = "true";
    const card = image.closest(".vrf-vehicle-card, [data-vehicle-card], article");
    if (card && /\b(emi|price|dealer listing|enquire|used|new|fuel|trans|seats)\b/i.test(card.textContent || "")) {
      card.style.display = "none";
      image.style.display = "none";
      return;
    }
    image.style.display = "none";
  }
  function vehicleImageIdentity(url) {
    const value = compactText(url);
    if (!value) return "";
    try {
      const parsed = new URL(value, window.location.origin);
      return parsed.pathname.toLowerCase().replace(/\/+/g, "/");
    } catch (e) {
      return value.toLowerCase().split("?")[0].replace(/^https?:\/\/[^/]+/i, "").replace(/\/+/g, "/");
    }
  }
  function vehicleModelIdentity(vehicle) {
    return `${canonicalBrandKey(vehicle == null ? void 0 : vehicle.brand)}|${normalizeBrandKey(vehicle == null ? void 0 : vehicle.name)}`;
  }
  function isSharedFallbackVehicleImage(url) {
    const key = vehicleImageIdentity(url);
    return !key || key.includes("/design-system-handoff/ride-finder-assets/") || key.includes("images.unsplash.com");
  }
  function vehicleSearchText(vehicle) {
    return `${vehicle.brand} ${displayBrandName(vehicle.brand)} ${vehicle.name} ${vehicle.variant} ${vehicle.type} ${vehicle.fuel} ${vehicle.body} ${vehicle.transmission}`.toLowerCase();
  }
  function dealerForVehicle(row) {
    return Array.isArray(row.dealers) ? row.dealers[0] : row.dealers;
  }
  function conditionLabel(condition) {
    if (condition === "certified_pre_owned") return "Certified";
    if (condition === "used") return "Used";
    if (condition === "new") return "New";
    return "Available";
  }
  function mapDbVehicleToExplorer(row, index) {
    var _a;
    if (!row || !row.id) return null;
    const dealer = (_a = dealerForVehicle(row)) != null ? _a : {};
    const priceValue = numberFromPaise(row.price_paise);
    const onRoadValue = numberFromPaise(row.on_road_price_paise);
    const vehicleType = inferVehicleType(row);
    const bodyType = normalizeBodyType(row, vehicleType);
    const condition = conditionLabel(row.condition);
    const make = compactText(row.make, "Dealer");
    const model = compactText(row.model, "Vehicle");
    const variant = compactText(row.variant) || condition;
    const location = compactText(dealer.location, "India");
    const kmplValue = Number(row.mileage_kmpl) > 0 ? Number(row.mileage_kmpl) : null;
    const rangeValue = Number(row.range_km) > 0 ? Number(row.range_km) : null;
    const odometerValue = Number(row.mileage_km) > 0 ? Number(row.mileage_km) : null;
    let mileageLabel, km;
    if (rangeValue) {
      mileageLabel = "Range";
      km = `${rangeValue.toLocaleString("en-IN")} km`;
    } else if (kmplValue) {
      mileageLabel = "Mileage";
      km = `${kmplValue} kmpl`;
    } else if (odometerValue) {
      mileageLabel = "Mileage";
      km = `${odometerValue.toLocaleString("en-IN")} km`;
    } else {
      mileageLabel = "Status";
      km = "Ready stock";
    }
    const rawDealerName = compactText(dealer.dealership_name);
    const dealerName = rawDealerName.toLowerCase() === "dealersite catalog" ? "" : rawDealerName;
    const category = row.vehicle_category === "2w" || row.vehicle_category === "3w" || row.vehicle_category === "4w" ? row.vehicle_category : vehicleType === "Bikes" ? "2w" : vehicleType === "Autos" ? "3w" : "4w";
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
      onRoad: onRoadValue > 0 ? formatInrShort(onRoadValue) : "Ask dealer",
      emi: estimateEmi(priceValue),
      image: imageForVehicle(row, vehicleType, bodyType),
      location,
      year: compactText(row.year, "Recent"),
      fuel: normalizeVehicleOptionLabel(row.fuel_type) || "Fuel details",
      transmission: normalizeVehicleOptionLabel(row.transmission) || "Transmission",
      km,
      mileageLabel,
      seats: compactText(row.seating_capacity, vehicleType === "Bikes" ? "2" : "5"),
      badge: condition,
      condition,
      offer: dealerName,
      priceValue,
      onRoadValue,
      emiValue: priceValue > 0 ? Math.max(2500, Math.round(priceValue * 0.019 / 50) * 50) : 0,
      detailHref: compactText(row.detail_href) || (category === "2w" ? `/bikes/${encodeURIComponent(row.id)}` : category === "3w" ? `/autos/${encodeURIComponent(row.id)}` : `/cars/${encodeURIComponent(row.id)}`),
      brandHref: compactText(row.brand_href) || brandPageHrefFor(make, category),
      sourceIndex: index
    };
  }
  function uniqueValues(values, fallback = []) {
    const seen = /* @__PURE__ */ new Set();
    return [...values, ...fallback].map((item) => compactText(item)).filter((item) => {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
  }
  function normalizeVehicleOptionLabel(value) {
    const raw = compactText(value);
    const key = normalizeBrandKey(raw);
    const canonical = {
      petrol: "Petrol",
      diesel: "Diesel",
      cng: "CNG",
      lpg: "LPG",
      electric: "Electric",
      hybrid: "Hybrid",
      "cng petrol": "CNG + Petrol",
      "petrol cng": "CNG + Petrol",
      manual: "Manual",
      automatic: "Automatic",
      amt: "AMT",
      cvt: "CVT",
      dct: "DCT"
    };
    return canonical[key] || raw;
  }
  function uniqueVehicleValues(vehicles, field, fallback = []) {
    const seen = /* @__PURE__ */ new Set();
    return vehicles.map((vehicle) => normalizeVehicleOptionLabel(vehicle[field])).filter((item) => {
      const key = normalizeBrandKey(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
  }
  function conditionMatchesVehicle(vehicle, selectedCondition) {
    if (selectedCondition === "All") return true;
    return normalizeBrandKey(vehicle.condition || vehicle.badge) === normalizeBrandKey(selectedCondition);
  }
  function vehicleConditionBreakdownLabel(vehicles) {
    const counts = vehicles.reduce((acc, vehicle) => {
      const key = conditionLabelFromDisplay(vehicle.condition);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return [
      counts.New ? `${counts.New} new` : "",
      counts.Used ? `${counts.Used} used` : "",
      counts.Certified ? `${counts.Certified} certified` : ""
    ].filter(Boolean).join(" / ");
  }
  function conditionLabelFromDisplay(value) {
    const key = normalizeBrandKey(value);
    if (key === "certified" || key === "certified pre owned" || key === "certified_pre_owned") return "Certified";
    if (key === "used") return "Used";
    if (key === "new") return "New";
    return "Available";
  }
  function isPreOwnedVehicle(vehicle) {
    const label = conditionLabelFromDisplay((vehicle == null ? void 0 : vehicle.condition) || (vehicle == null ? void 0 : vehicle.badge));
    return label === "Used" || label === "Certified";
  }
  function preOwnedSortRank(vehicle) {
    const label = conditionLabelFromDisplay((vehicle == null ? void 0 : vehicle.condition) || (vehicle == null ? void 0 : vehicle.badge));
    if (label === "Used") return 0;
    if (label === "Certified") return 1;
    if (label === "New") return 2;
    return 3;
  }
  function textOptionMatches(value, selectedOption) {
    if (selectedOption === "All") return true;
    const source = normalizeBrandKey(value);
    const selected = normalizeBrandKey(selectedOption);
    return source === selected || source.includes(selected) || selected.includes(source);
  }
  function locationCity(location) {
    return compactText(location, "India").split(",")[0].trim() || "India";
  }
  function uniqueDealerCards(vehicles) {
    const seen = /* @__PURE__ */ new Set();
    return vehicles.map((vehicle) => ({
      name: compactText(vehicle.offer, "DealerSite partner"),
      location: compactText(vehicle.location, "India"),
      brands: vehicle.brand,
      image: vehicle.image
    })).filter((dealer) => {
      const key = `${dealer.name}-${dealer.location}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  function ExplorerToggle({ mode, setMode }) {
    const isBuilder = mode === "builder";
    const targetMode = isBuilder ? "vehicles" : "builder";
    const label = isBuilder ? "Vehicle Search" : "Website Builder";
    const Icon = isBuilder ? window.Icons.car : window.Icons.template;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "dsp-floating-mode-switch",
        "data-label": label,
        "aria-label": `Open ${label}`,
        title: label,
        onClick: () => {
          setMode(targetMode);
          window.requestAnimationFrame(() => {
            try {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (e) {
              window.scrollTo(0, 0);
            }
          });
        }
      },
      /* @__PURE__ */ React.createElement(Icon, { size: 22 })
    );
  }
  function vrfScrollToListing() {
    vrfScrollToId("listing");
  }
  function vrfScrollToId(id) {
    const node = document.getElementById(id);
    if (!node) return;
    const hash = `#${id}`;
    if (window.location.hash === hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.location.hash = id;
    window.setTimeout(() => {
      const currentNode = document.getElementById(id);
      if (!currentNode) return;
      const topOffset = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--dsp-topnav-height"), 10) || 90;
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
    if (text.includes("electric") || text.includes("ev") || text.includes("new")) return "success";
    if (text.includes("launch") || text.includes("certified")) return "warning";
    return "brand";
  }
  function vrfUniqueCount(vehicles, predicate) {
    return vehicles.filter(predicate).length;
  }
  function VrfSectionHead({ title, kicker, href = "#listing", action = "View all" }) {
    return /* @__PURE__ */ React.createElement("div", { className: "vrf-section-head" }, /* @__PURE__ */ React.createElement("div", null, kicker ? /* @__PURE__ */ React.createElement("div", { style: { color: "var(--vrf-brand-text)", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 } }, kicker) : null, /* @__PURE__ */ React.createElement("h2", null, title)), action ? /* @__PURE__ */ React.createElement("a", { href }, action, " ", /* @__PURE__ */ React.createElement(window.Icons.chevronRight, { size: 12, style: { verticalAlign: "-2px" } })) : null);
  }
  function validBrandDirectoryType(value) {
    return value === "2w" || value === "3w" || value === "4w" ? value : "4w";
  }
  function VrfBrandLogo({ name, category = "" }) {
    const logo = brandLogoFor(name, category);
    if (logo) return /* @__PURE__ */ React.createElement("img", { src: logo, alt: `${displayBrandName(name)} logo` });
    return null;
  }
  const VRF_BRAND_DIRECTORY_TYPES = [
    { value: "2w", label: "2W", name: "Two-Wheelers", icon: "bike" },
    { value: "3w", label: "3W", name: "Three-Wheelers", icon: "auto" },
    { value: "4w", label: "4W", name: "Cars", icon: "car" }
  ];
  function priceRangeLabel(min, max) {
    if (!min && !max) return "Price on request";
    if (!max || min === max) return formatInrShort(min || max);
    return `${formatInrShort(min)} - ${formatInrShort(max)}`;
  }
  function buildBrandDirectoryCards(vehicles, category) {
    const brandMap = /* @__PURE__ */ new Map();
    vehicles.filter((vehicle) => vehicle.category === category).forEach((vehicle) => {
      const key = canonicalBrandKey(vehicle.brand);
      const current = brandMap.get(key) || {
        name: displayBrandName(vehicle.brand),
        rawName: vehicle.brand,
        category,
        href: vehicle.brandHref || brandPageHrefFor(vehicle.brand, category),
        models: /* @__PURE__ */ new Set(),
        priceMin: 0,
        priceMax: 0
      };
      current.models.add(normalizeBrandKey(vehicle.name) || vehicle.id);
      const price = vrfPriceNumber(vehicle);
      if (price > 0 && (!current.priceMin || price < current.priceMin)) current.priceMin = price;
      if (price > current.priceMax) current.priceMax = price;
      if (!current.href && vehicle.brandHref) current.href = vehicle.brandHref;
      brandMap.set(key, current);
    });
    return Array.from(brandMap.values()).map((item) => ({
      ...item,
      modelCount: item.models.size,
      priceRange: priceRangeLabel(item.priceMin, item.priceMax)
    })).sort((a, b) => b.modelCount - a.modelCount || a.name.localeCompare(b.name));
  }
  function VrfBrandDirectoryCard({ brand }) {
    return /* @__PURE__ */ React.createElement(
      "a",
      {
        href: brand.href,
        target: "_top",
        className: "vrf-directory-card",
        "aria-label": `Open ${brand.name} brand page`,
        onClick: (event) => {
          event.preventDefault();
          openTopWindowHref(brand.href);
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "vrf-directory-logo" }, /* @__PURE__ */ React.createElement(VrfBrandLogo, { name: brand.rawName, category: brand.category })),
      /* @__PURE__ */ React.createElement("h3", null, brand.name),
      /* @__PURE__ */ React.createElement("span", { className: "vrf-directory-count" }, brand.modelCount, " ", brand.modelCount === 1 ? "Model" : "Models"),
      /* @__PURE__ */ React.createElement("p", null, brand.priceRange),
      /* @__PURE__ */ React.createElement("span", { className: "vrf-directory-link" }, "Open brand page ", /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 12 }))
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
    return /* @__PURE__ */ React.createElement("section", { id: "all-brands", className: "vrf-section vrf-brand-directory" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-directory-crumb" }, /* @__PURE__ */ React.createElement("a", { href: "#market-top" }, "Home"), /* @__PURE__ */ React.createElement(window.Icons.chevronRight, { size: 14 }), /* @__PURE__ */ React.createElement("span", null, "All Brands")), /* @__PURE__ */ React.createElement("div", { className: "vrf-directory-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "All Vehicle Brands"), /* @__PURE__ */ React.createElement("p", null, activeConfig.label, " ", activeConfig.name, " \xB7 ", brandCards.length, " brands from first-hand marketplace data")), /* @__PURE__ */ React.createElement("div", { className: "vrf-directory-actions" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-directory-tabs", role: "tablist", "aria-label": "Vehicle brand category" }, VRF_BRAND_DIRECTORY_TYPES.map((item) => {
      const Icon = window.Icons[item.icon] || window.Icons.car;
      const active = item.value === activeType;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: item.value,
          type: "button",
          role: "tab",
          "aria-selected": active,
          "aria-label": `Show ${item.label} brands`,
          className: "vrf-directory-tab",
          "data-active": active,
          onClick: () => setActiveType(item.value)
        },
        /* @__PURE__ */ React.createElement(Icon, { size: 17 }),
        /* @__PURE__ */ React.createElement("strong", null, item.label),
        /* @__PURE__ */ React.createElement("span", null, item.name),
        /* @__PURE__ */ React.createElement("em", null, categoryCounts[item.value] || 0)
      );
    })), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-secondary vrf-directory-close", onClick: onClose }, /* @__PURE__ */ React.createElement(window.Icons.chevronRight, { size: 14, style: { transform: "rotate(-90deg)" } }), " Hide directory"))), brandCards.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "vrf-directory-grid" }, brandCards.map((brand) => /* @__PURE__ */ React.createElement(VrfBrandDirectoryCard, { key: `${activeType}-${brand.rawName}`, brand }))) : /* @__PURE__ */ React.createElement("div", { className: "vrf-empty" }, "No ", activeConfig.name.toLowerCase(), " brands are available from the database yet.")));
  }
  function VrfBrandRailCard({ brand }) {
    return /* @__PURE__ */ React.createElement(
      "a",
      {
        href: brand.href,
        target: "_top",
        className: "vrf-brand-rail-card",
        "aria-label": `Open ${brand.name} brand page`,
        onClick: (event) => {
          event.preventDefault();
          openTopWindowHref(brand.href);
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "vrf-brand-rail-logo" }, /* @__PURE__ */ React.createElement(VrfBrandLogo, { name: brand.rawName, category: brand.category })),
      /* @__PURE__ */ React.createElement("span", { className: "vrf-brand-rail-name" }, brand.name),
      /* @__PURE__ */ React.createElement("span", { className: "vrf-brand-rail-meta" }, brand.modelCount, " ", brand.modelCount === 1 ? "model" : "models")
    );
  }
  function VrfBrandMarquee({ title, label, type, brands, direction = "clockwise" }) {
    var _a;
    if (!brands.length) return null;
    const loopBrands = [...brands, ...brands, ...brands];
    const directoryHref = `/brands?type=${validBrandDirectoryType(type || ((_a = brands[0]) == null ? void 0 : _a.category) || "4w")}`;
    return /* @__PURE__ */ React.createElement("div", { className: "vrf-brand-marquee-row", "data-direction": direction }, /* @__PURE__ */ React.createElement(
      "a",
      {
        href: directoryHref,
        target: "_top",
        className: "vrf-brand-marquee-label",
        "aria-label": `Open ${label} brand directory`,
        onClick: (event) => {
          event.preventDefault();
          openTopWindowHref(directoryHref);
        }
      },
      /* @__PURE__ */ React.createElement("span", null, title),
      /* @__PURE__ */ React.createElement("strong", null, label)
    ), /* @__PURE__ */ React.createElement("div", { className: "vrf-brand-marquee-viewport" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-brand-marquee-track" }, loopBrands.map((brand, index) => /* @__PURE__ */ React.createElement(VrfBrandRailCard, { key: `${title}-${brand.rawName}-${index}`, brand })))));
  }
  function VrfBrandCarouselShowcase({ vehicles }) {
    const brandGroups = React.useMemo(() => {
      const pick = (category, limit) => buildBrandDirectoryCards(vehicles, category).slice(0, limit);
      return {
        "4w": pick("4w", 6),
        "3w": pick("3w", 4),
        "2w": pick("2w", 6)
      };
    }, [vehicles]);
    const totalBrands = React.useMemo(() => buildBrandDirectoryCards(vehicles, "4w").length + buildBrandDirectoryCards(vehicles, "3w").length + buildBrandDirectoryCards(vehicles, "2w").length, [vehicles]);
    return /* @__PURE__ */ React.createElement("div", { id: "brands", className: "vrf-brand-rotator" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-section-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--bronze-400)", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 } }, "Featured brand lanes"), /* @__PURE__ */ React.createElement("h2", null, "Browse by Brand"), /* @__PURE__ */ React.createElement("p", null, "A calmer brand preview: 4W and 2W glide forward, 3W moves the opposite way, and the full directory opens only when needed.")), /* @__PURE__ */ React.createElement("div", { className: "vrf-brand-actions" }, /* @__PURE__ */ React.createElement("span", null, totalBrands, " live brands"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-link-button", onClick: () => openTopWindowHref("/brands?type=4w") }, "View all ", /* @__PURE__ */ React.createElement(window.Icons.chevronRight, { size: 12, style: { verticalAlign: "-2px" } })))), /* @__PURE__ */ React.createElement("div", { className: "vrf-brand-marquee-stack", "aria-label": "Featured vehicle brands" }, /* @__PURE__ */ React.createElement(VrfBrandMarquee, { title: "4W", label: "Cars", type: "4w", brands: brandGroups["4w"], direction: "clockwise" }), /* @__PURE__ */ React.createElement(VrfBrandMarquee, { title: "3W", label: "Autos", type: "3w", brands: brandGroups["3w"], direction: "anticlockwise" }), /* @__PURE__ */ React.createElement(VrfBrandMarquee, { title: "2W", label: "Bikes", type: "2w", brands: brandGroups["2w"], direction: "clockwise" })));
  }
  function VrfHero({
    vehicles,
    heroVehicle
  }) {
    const heroSlides = React.useMemo(() => {
      const uniqueModels = /* @__PURE__ */ new Set();
      const realImageVehicles = vehicles.filter((vehicle) => compactText(vehicle == null ? void 0 : vehicle.image) && !isSharedFallbackVehicleImage(vehicle.image));
      const source = vehicles.filter((vehicle) => (vehicle == null ? void 0 : vehicle.category) === "4w" && String(vehicle == null ? void 0 : vehicle.year).includes("2026")).filter((vehicle) => compactText(vehicle == null ? void 0 : vehicle.image) && !isSharedFallbackVehicleImage(vehicle.image)).filter((vehicle) => {
        const key = vehicleModelIdentity(vehicle);
        if (!key || uniqueModels.has(key)) return false;
        uniqueModels.add(key);
        return true;
      });
      const fallback = realImageVehicles.filter((vehicle) => (vehicle == null ? void 0 : vehicle.category) === "4w").slice(0, 6);
      return (source.length ? source : fallback.length ? fallback : [heroVehicle]).filter(Boolean).slice(0, 6);
    }, [vehicles, heroVehicle]);
    const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);
    const activeSlide = heroSlides[activeSlideIndex % Math.max(heroSlides.length, 1)] || heroVehicle;
    const activeSlideName = activeSlide ? vrfModelLabel(activeSlide) : "Featured vehicle";
    const activeSlideImage = vehicleImageOrFallback(activeSlide);
    React.useEffect(() => {
      setActiveSlideIndex(0);
    }, [heroSlides]);
    React.useEffect(() => {
      if (heroSlides.length < 2) return void 0;
      const timer = window.setInterval(() => {
        setActiveSlideIndex((current) => (current + 1) % heroSlides.length);
      }, 3200);
      return () => window.clearInterval(timer);
    }, [heroSlides.length]);
    return /* @__PURE__ */ React.createElement("section", { className: "vrf-hero" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-hero-grid" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-hero-copy" }, /* @__PURE__ */ React.createElement("span", { className: "vrf-kicker" }, /* @__PURE__ */ React.createElement(window.Icons.spark, { size: 13 }), " New and pre-owned marketplace"), /* @__PURE__ */ React.createElement("h1", null, /* @__PURE__ */ React.createElement("span", { className: "vrf-hero-line" }, "Find your"), " ", /* @__PURE__ */ React.createElement("span", { className: "vrf-hero-line" }, "next ride"), " ", /* @__PURE__ */ React.createElement("span", { className: "vrf-hero-line" }, "with"), " ", /* @__PURE__ */ React.createElement("span", { className: "vrf-hero-line", style: { color: "var(--bronze-400)" } }, "total clarity.")), /* @__PURE__ */ React.createElement("p", null, "Verified on-road pricing, direct dealer inventory, and zero-hassle discovery on live vehicles from your marketplace database."), /* @__PURE__ */ React.createElement("div", { className: "vrf-proof-row" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(window.Icons.check, { size: 16, style: { color: "var(--vrf-success)" } }), " Verified on-road pricing"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(window.Icons.brands, { size: 16, style: { color: "var(--vrf-warning)" } }), " Dealer-backed inventory"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(window.Icons.spark, { size: 16, style: { color: "var(--vrf-warning)" } }), " ", vehicles.length, "+ live offers"))), /* @__PURE__ */ React.createElement("div", { className: "vrf-hero-media" }, activeSlideImage ? /* @__PURE__ */ React.createElement("div", { className: "vrf-hero-car", "data-carousel": "true" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        key: (activeSlide == null ? void 0 : activeSlide.id) || activeSlideName,
        src: activeSlideImage,
        alt: activeSlideName,
        onError: (event) => applyVehicleImageFallback(event, activeSlide)
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "vrf-float-pill", style: { left: 16, top: 16 } }, "2026 release"), /* @__PURE__ */ React.createElement("div", { className: "vrf-hero-name-card" }, /* @__PURE__ */ React.createElement("span", null, "Now scrolling"), /* @__PURE__ */ React.createElement("strong", null, activeSlideName), /* @__PURE__ */ React.createElement("small", null, [activeSlide == null ? void 0 : activeSlide.fuel, activeSlide == null ? void 0 : activeSlide.body].filter(Boolean).join(" \xB7 ") || "Marketplace lineup")), /* @__PURE__ */ React.createElement("div", { className: "vrf-float-pill", style: { right: 16, bottom: 16, display: "inline-flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(window.Icons.gauge, { size: 14 }), " 360\xB0 View"), /* @__PURE__ */ React.createElement("div", { className: "vrf-float-card", style: { left: 16, bottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--vrf-muted)", fontSize: 10, fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase" } }, "EMI from"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--vrf-success)", fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 950 } }, (activeSlide == null ? void 0 : activeSlide.emi) || "Ask dealer")), /* @__PURE__ */ React.createElement("div", { className: "vrf-float-card", style: { right: 12, top: 66 } }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--vrf-muted)", fontSize: 10, fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase" } }, "On-road"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 950 } }, (activeSlide == null ? void 0 : activeSlide.onRoad) || "Ask dealer")), /* @__PURE__ */ React.createElement("div", { className: "vrf-hero-slide-dots", "aria-hidden": "true" }, heroSlides.map((vehicle, index) => /* @__PURE__ */ React.createElement("span", { key: vehicle.id || `${vehicle.brand}-${vehicle.name}`, "data-active": index === activeSlideIndex })))) : null))));
  }
  const VRF_OFFER_THEMES = [
    {
      eyebrow: "Festival offer",
      title: "Festival booking bonus",
      value: "Extra \u20B925,000 benefit",
      note: "Priority delivery, accessory support, and dealer-backed quote help.",
      tone: "festival"
    },
    {
      eyebrow: "Exchange",
      title: "Exchange upgrade week",
      value: "Up to \u20B935,000 upgrade value",
      note: "Trade in your current vehicle with quick dealer valuation support.",
      tone: "exchange"
    },
    {
      eyebrow: "Finance",
      title: "Low EMI start",
      value: "EMI from \u20B95,250/mo",
      note: "Shortlist now and request a custom finance quote from the dealer.",
      tone: "finance"
    },
    {
      eyebrow: "Fast delivery",
      title: "Ready stock advantage",
      value: "Same-week delivery slots",
      note: "Find verified ready-stock vehicles from active marketplace dealers.",
      tone: "delivery"
    },
    {
      eyebrow: "EV offer",
      title: "Green drive bonus",
      value: "Range-focused savings",
      note: "Compare EV running cost, warranty, and finance options in one place.",
      tone: "ev"
    },
    {
      eyebrow: "Business",
      title: "Corporate fleet deal",
      value: "Bulk enquiry support",
      note: "Best for offices, ride-share fleets, and local delivery teams.",
      tone: "fleet"
    }
  ];
  function vrfOfferVehiclePool(vehicles) {
    const realImageVehicles = vehicles.filter((vehicle) => compactText(vehicle == null ? void 0 : vehicle.image) && !isSharedFallbackVehicleImage(vehicle.image));
    const uniqueByBrand = (items) => {
      const seenBrands = /* @__PURE__ */ new Set();
      return items.filter((vehicle) => {
        const key = canonicalBrandKey(vehicle == null ? void 0 : vehicle.brand) || normalizeBrandKey(vehicle == null ? void 0 : vehicle.name);
        if (!key || seenBrands.has(key)) return false;
        seenBrands.add(key);
        return true;
      });
    };
    const carPool = uniqueByBrand(realImageVehicles.filter((vehicle) => vehicle.category === "4w"));
    const autoPool = uniqueByBrand(realImageVehicles.filter((vehicle) => vehicle.category === "3w"));
    const bikePool = uniqueByBrand(realImageVehicles.filter((vehicle) => vehicle.category === "2w"));
    const evPool = uniqueByBrand(realImageVehicles.filter((vehicle) => (vehicle == null ? void 0 : vehicle.type) === "EVs" || compactText(vehicle == null ? void 0 : vehicle.fuel).toLowerCase().includes("electric")));
    const preferred = [
      carPool[0],
      carPool[1],
      autoPool[0] || carPool[2],
      carPool[2] || autoPool[1],
      evPool[0] || bikePool[0] || carPool[3],
      bikePool[0] || autoPool[1] || carPool[4],
      ...realImageVehicles
    ].filter(Boolean);
    const seen = /* @__PURE__ */ new Set();
    return preferred.filter((vehicle) => {
      const key = `${(vehicle == null ? void 0 : vehicle.category) || "vehicle"}-${canonicalBrandKey(vehicle == null ? void 0 : vehicle.brand)}-${normalizeBrandKey(vehicle == null ? void 0 : vehicle.name)}`;
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
        vehicleName: modelLabel && !modelLabel.toLowerCase().includes("undefined") ? modelLabel : offer.title
      };
    });
  }
  function VrfOffersCarousel({ vehicles, onExplore }) {
    const offers = React.useMemo(() => buildVrfOfferSlides(vehicles), [vehicles]);
    const loopedOffers = React.useMemo(() => [...offers, ...offers], [offers]);
    if (!offers.length) return null;
    return /* @__PURE__ */ React.createElement("section", { id: "offers", className: "vrf-offer-carousel", "aria-label": "Latest dealer offers" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-offer-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "vrf-offer-kicker" }, /* @__PURE__ */ React.createElement(window.Icons.spark, { size: 13 }), " Latest offers"), /* @__PURE__ */ React.createElement("h2", null, "Festival deals, exchange bonuses, and finance picks.")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-link-button", onClick: onExplore }, "View all ", /* @__PURE__ */ React.createElement(window.Icons.chevronRight, { size: 12, style: { verticalAlign: "-2px" } }))), /* @__PURE__ */ React.createElement("div", { className: "vrf-offer-marquee", "aria-live": "off" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-offer-track" }, loopedOffers.map((offer, index) => {
      var _a;
      const imageSrc = vehicleImageOrFallback(offer.vehicle);
      if (!imageSrc) return null;
      return /* @__PURE__ */ React.createElement(
        "article",
        {
          key: `${offer.id}-${index}`,
          className: "vrf-offer-card",
          "data-tone": offer.tone,
          "data-vehicle-card": "true",
          "data-model-image-source": vehicleCardImageSourceKind(imageSrc)
        },
        /* @__PURE__ */ React.createElement("div", { className: "vrf-offer-media" }, /* @__PURE__ */ React.createElement("img", { src: imageSrc, alt: offer.vehicleName, onError: (event) => applyVehicleImageFallback(event, offer.vehicle) }), /* @__PURE__ */ React.createElement("span", null, offer.eyebrow)),
        /* @__PURE__ */ React.createElement("div", { className: "vrf-offer-body" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-offer-brand" }, displayBrandName(((_a = offer.vehicle) == null ? void 0 : _a.brand) || "DealerSite")), /* @__PURE__ */ React.createElement("h3", null, offer.title), /* @__PURE__ */ React.createElement("strong", null, offer.value), /* @__PURE__ */ React.createElement("p", null, offer.note), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: onExplore }, "Explore offer ", /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 13 })))
      );
    }))));
  }
  function VrfBrowseRails({ vehicles, budgets, bodies, brands, budget, body, brand, setBudget, setBody, selectBrand }) {
    return /* @__PURE__ */ React.createElement("section", { className: "vrf-section" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container vrf-rail-stack" }, /* @__PURE__ */ React.createElement(VrfOffersCarousel, { vehicles, onExplore: vrfScrollToListing }), /* @__PURE__ */ React.createElement(VrfBrandCarouselShowcase, { vehicles })));
  }
  function VrfChipButton({ active, children, onClick, count }) {
    return /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-chip", "data-active": active, onClick }, children, typeof count === "number" ? /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 6, opacity: 0.75 } }, count) : null);
  }
  function VrfCheckButton({ active, label, count, onClick }) {
    return /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-check-row", "data-active": active, onClick }, /* @__PURE__ */ React.createElement("span", { className: "vrf-check-box" }, active ? "\u2713" : ""), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 800 } }, label), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", color: "var(--vrf-muted)", fontSize: 11, fontVariantNumeric: "tabular-nums" } }, count));
  }
  function VrfFilterGroup({ title, children }) {
    return /* @__PURE__ */ React.createElement("div", { className: "vrf-filter-group" }, /* @__PURE__ */ React.createElement("h3", { className: "vrf-filter-title" }, title), children);
  }
  function VrfConditionToggle({ condition, setCondition }) {
    const options = [
      { label: "All", value: "All" },
      { label: "New", value: "New" },
      { label: "Used", value: "Used" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "vrf-condition-toggle", role: "group", "aria-label": "New or used vehicle filter" }, options.map((option) => {
      const active = condition === option.value;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: option.value,
          type: "button",
          className: "vrf-condition-toggle-option",
          "data-active": active,
          "aria-pressed": active,
          onClick: () => setCondition(option.value)
        },
        option.label
      );
    }));
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
    clearFilters
  }) {
    const categoryOptions = [
      { value: "2w", label: "2W", detail: "Bikes", icon: window.Icons.bike },
      { value: "3w", label: "3W", detail: "Autos", icon: window.Icons.auto },
      { value: "4w", label: "4W", detail: "Cars", icon: window.Icons.car }
    ].map((item) => ({
      ...item,
      count: vrfUniqueCount(vehicles, (vehicle) => vehicle.category === item.value)
    })).filter((item) => item.count > 0);
    const scopedVehicles = vehicleCategoryFilter && vehicleCategoryFilter !== "all" ? vehicles.filter((vehicle) => vehicle.category === vehicleCategoryFilter) : vehicles;
    const scopedBrands = uniqueValues(scopedVehicles.map((vehicle) => vehicle.brand));
    const budgetOptions = budgets.map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => vehicle.budget === item) })).filter((option) => option.count > 0).slice(0, 8);
    const brandOptions = scopedBrands.map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => brandMatchesVehicle(vehicle, item)) })).filter((option) => option.count > 0);
    const bodyOptions = bodies.map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => vehicle.body === item) })).filter((option) => option.count > 0).slice(0, 8);
    const fuelOptions = fuels.map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => textOptionMatches(vehicle.fuel, item)) })).filter((option) => option.count > 0).slice(0, 8);
    const transmissionOptions = transmissions.map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => textOptionMatches(vehicle.transmission, item)) })).filter((option) => option.count > 0).slice(0, 6);
    const seatOptions = seatsList.map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => compactText(vehicle.seats) === item) })).filter((option) => option.count > 0).slice(0, 8);
    const conditionOptions = conditions.map((item) => ({ item, count: vrfUniqueCount(scopedVehicles, (vehicle) => conditionMatchesVehicle(vehicle, item)) })).filter((option) => option.count > 0);
    const selectCategory = (value) => {
      setVehicleCategoryFilter(vehicleCategoryFilter === value ? "all" : value);
      selectBrand("All", { preserveCategory: true });
      setBody("All");
      setFuel("All");
      setTransmission("All");
      setSeats("All");
    };
    return /* @__PURE__ */ React.createElement("aside", { className: "vrf-filter-rail" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: 13, fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase" } }, "Filters"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-link-button", "aria-label": "Reset all vehicle filters", onClick: clearFilters }, "Clear all")), /* @__PURE__ */ React.createElement("div", { className: "vrf-category-switch", role: "group", "aria-label": "Vehicle category filter" }, categoryOptions.map((item) => {
      const Icon = item.icon;
      const active = vehicleCategoryFilter === item.value;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: item.value,
          type: "button",
          className: "vrf-category-option",
          "data-category": item.value,
          "data-active": active,
          "aria-pressed": active,
          onClick: () => selectCategory(item.value)
        },
        /* @__PURE__ */ React.createElement(Icon, { size: 15 }),
        /* @__PURE__ */ React.createElement("span", null, item.label),
        /* @__PURE__ */ React.createElement("small", null, item.detail)
      );
    })), /* @__PURE__ */ React.createElement(VrfFilterGroup, { title: "Condition" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-filter-options" }, conditionOptions.map(({ item, count }) => /* @__PURE__ */ React.createElement(VrfChipButton, { key: item, active: condition === item, count, onClick: () => setCondition(condition === item ? "All" : item) }, item)))), /* @__PURE__ */ React.createElement(VrfFilterGroup, { title: "Price" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-filter-options" }, budgetOptions.map(({ item, count }) => /* @__PURE__ */ React.createElement(VrfChipButton, { key: item, active: budget === item, count, onClick: () => setBudget(budget === item ? "All" : item) }, item)))), /* @__PURE__ */ React.createElement(VrfFilterGroup, { title: "Brand" }, brandOptions.map(({ item, count }) => /* @__PURE__ */ React.createElement(
      VrfCheckButton,
      {
        key: item,
        active: brandOptionIsSelected(item, brand),
        label: displayBrandName(item),
        count,
        onClick: () => selectBrand(brandOptionIsSelected(item, brand) ? "All" : item, { preserveCategory: true })
      }
    ))), /* @__PURE__ */ React.createElement(VrfFilterGroup, { title: "Body Type" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-filter-options" }, bodyOptions.map(({ item }) => /* @__PURE__ */ React.createElement(VrfChipButton, { key: item, active: body === item, onClick: () => setBody(body === item ? "All" : item) }, item)))), /* @__PURE__ */ React.createElement(VrfFilterGroup, { title: "Fuel" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-filter-options" }, fuelOptions.map(({ item }) => /* @__PURE__ */ React.createElement(VrfChipButton, { key: item, active: fuel === item, onClick: () => setFuel(fuel === item ? "All" : item) }, item)))), /* @__PURE__ */ React.createElement(VrfFilterGroup, { title: "Transmission" }, transmissionOptions.map(({ item, count }) => /* @__PURE__ */ React.createElement(
      VrfCheckButton,
      {
        key: item,
        active: transmission === item,
        label: item,
        count,
        onClick: () => setTransmission(transmission === item ? "All" : item)
      }
    ))), /* @__PURE__ */ React.createElement(VrfFilterGroup, { title: "Seating" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-filter-options" }, seatOptions.map(({ item }) => /* @__PURE__ */ React.createElement(VrfChipButton, { key: item, active: seats === item, onClick: () => setSeats(seats === item ? "All" : item) }, item)))));
  }
  function VrfVehicleCard({ vehicle, compared, saved, onCompareToggle, onSaveToggle, onEnquire }) {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const imageSrc = vehicleImageOrFallback(vehicle);
    const modelLabel = vrfModelLabel(vehicle);
    const imageSourceKind = vehicleCardImageSourceKind(imageSrc);
    const brandLogo = brandLogoFor(vehicle.brand, vehicle.category);
    const isNewListing = conditionLabelFromDisplay(vehicle.condition || vehicle.badge) === "New";
    const priceCaption = isNewListing ? "Ex-showroom price*" : "Dealer listing price";
    const specs = [
      { label: "Fuel", value: vehicle.fuel, icon: "fuel", tone: "green" },
      { label: "Trans", value: vehicle.transmission, icon: "gauge", tone: "blue" },
      { label: "Seats", value: vehicle.seats, icon: "used", tone: "purple" },
      { label: vehicle.mileageLabel || (vehicle.km === "Ready stock" ? "Status" : "Mileage"), value: vehicle.km, icon: "ev", tone: "orange" }
    ];
    if (!imageSrc) return null;
    return /* @__PURE__ */ React.createElement("article", { className: "vrf-vehicle-card", "data-model-image-source": imageSourceKind }, /* @__PURE__ */ React.createElement("div", { className: "vrf-card-media" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: imageSrc,
        alt: modelLabel,
        loading: "lazy",
        onError: (event) => applyVehicleImageFallback(event, vehicle)
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "vrf-badge", "data-tone": vrfBadgeTone(vehicle) }, vehicle.badge), vehicle.offer ? /* @__PURE__ */ React.createElement("span", { className: "vrf-badge vrf-offer-badge", "data-tone": "warning" }, vehicle.offer) : null), /* @__PURE__ */ React.createElement("div", { className: "vrf-card-body" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-card-brand-row" }, brandLogo ? /* @__PURE__ */ React.createElement("span", { className: "vrf-card-brand-logo" }, /* @__PURE__ */ React.createElement(VrfBrandLogo, { name: vehicle.brand, category: vehicle.category })) : null, /* @__PURE__ */ React.createElement("span", { className: "vrf-card-brand" }, displayBrandName(vehicle.brand))), /* @__PURE__ */ React.createElement("h3", { className: "vrf-card-title" }, /* @__PURE__ */ React.createElement("a", { href: vehicle.detailHref, target: "_top" }, vehicle.name)), /* @__PURE__ */ React.createElement("p", { className: "vrf-card-sub" }, vehicle.variant), /* @__PURE__ */ React.createElement("div", { className: "vrf-price-block" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-card-price" }, vehicle.price, /* @__PURE__ */ React.createElement("small", null, " onwards")), /* @__PURE__ */ React.createElement("div", { className: "vrf-price-caption" }, priceCaption), /* @__PURE__ */ React.createElement("div", { className: "vrf-emi-pill" }, /* @__PURE__ */ React.createElement(window.Icons.arrowUpRight, { size: 14 }), " EMI ", vehicle.emi)), /* @__PURE__ */ React.createElement("div", { className: "vrf-spec-grid" }, specs.map((spec) => {
      const Icon = window.Icons[spec.icon] || window.Icons.check;
      return /* @__PURE__ */ React.createElement("div", { key: spec.label, "data-tone": spec.tone }, /* @__PURE__ */ React.createElement("span", { className: "vrf-spec-icon" }, /* @__PURE__ */ React.createElement(Icon, { size: 18 })), /* @__PURE__ */ React.createElement("span", { className: "vrf-spec-label" }, spec.label), /* @__PURE__ */ React.createElement("strong", null, spec.value || "Ask dealer"));
    })), /* @__PURE__ */ React.createElement("div", { className: "vrf-card-actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-card-enquire", onClick: () => onEnquire(vehicle.id, "On-road price request") }, /* @__PURE__ */ React.createElement(window.Icons.arrowUpRight, { size: 18 }), " Enquire"), /* @__PURE__ */ React.createElement("div", { className: "vrf-card-more-wrap" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "vrf-card-more",
        "aria-expanded": menuOpen,
        "aria-label": `More actions for ${modelLabel}`,
        onClick: () => setMenuOpen((open) => !open)
      },
      "More ",
      /* @__PURE__ */ React.createElement(window.Icons.chevronRight, { size: 14 })
    ), menuOpen ? /* @__PURE__ */ React.createElement("div", { className: "vrf-card-menu", role: "menu" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        role: "menuitem",
        "data-active": compared,
        onClick: () => {
          onCompareToggle(vehicle.id);
          setMenuOpen(false);
        }
      },
      /* @__PURE__ */ React.createElement(window.Icons.link, { size: 15 }),
      compared ? "Remove compare" : "Compare"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        role: "menuitem",
        "data-active": saved,
        onClick: () => {
          onSaveToggle(vehicle.id);
          setMenuOpen(false);
        }
      },
      /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, saved ? "\u2665" : "\u2661"),
      saved ? "Saved" : "Save"
    ), /* @__PURE__ */ React.createElement("a", { role: "menuitem", href: vehicle.detailHref, target: "_top" }, /* @__PURE__ */ React.createElement(window.Icons.search, { size: 15 }), "View details")) : null))));
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
      setCondition
    } = props;
    const activeFilterItems = [
      vehicleCategoryFilter && vehicleCategoryFilter !== "all" ? { key: "category", label: categoryFilterLabel(vehicleCategoryFilter), clear: () => setVehicleCategoryFilter("all") } : null,
      query.trim() ? { key: "query", label: `Search: ${query.trim()}`, clear: () => setQuery("") } : null,
      budget && budget !== "All" ? { key: "budget", label: budget, clear: () => setBudget("All") } : null,
      brand && brand !== "All" ? { key: "brand", label: displayBrandName(brand), clear: () => selectBrand("All", { preserveCategory: true }) } : null,
      body && body !== "All" ? { key: "body", label: body, clear: () => setBody("All") } : null,
      fuel && fuel !== "All" ? { key: "fuel", label: fuel, clear: () => setFuel("All") } : null,
      transmission && transmission !== "All" ? { key: "transmission", label: transmission, clear: () => setTransmission("All") } : null,
      seats && seats !== "All" ? { key: "seats", label: `${seats} seats`, clear: () => setSeats("All") } : null,
      condition && condition !== "All" ? { key: "condition", label: condition, clear: () => setCondition("All") } : null
    ].filter(Boolean);
    const listingCountLabel = loadingVehicles && vehicles.length === 0 ? "Loading vehicles" : `${filtered.length} vehicles`;
    const visibleCity = city && normalizeBrandKey(city) !== "india" ? city : "";
    const searchNeedle = query.trim().toLowerCase();
    const preOwnedVehicles = condition === "All" ? filtered.filter(isPreOwnedVehicle).slice(0, 6) : [];
    const searchSuggestions = searchNeedle.length >= 1 ? vehicles.filter((vehicle) => vehicleSearchText(vehicle).includes(searchNeedle)).sort((a, b) => {
      const aText = vehicleSearchText(a);
      const bText = vehicleSearchText(b);
      const aStarts = aText.startsWith(searchNeedle) || normalizeBrandKey(a.name).startsWith(searchNeedle) || normalizeBrandKey(a.brand).startsWith(searchNeedle);
      const bStarts = bText.startsWith(searchNeedle) || normalizeBrandKey(b.name).startsWith(searchNeedle) || normalizeBrandKey(b.brand).startsWith(searchNeedle);
      if (aStarts !== bStarts) return aStarts ? -1 : 1;
      return vrfModelLabel(a).localeCompare(vrfModelLabel(b));
    }).slice(0, 8) : [];
    return /* @__PURE__ */ React.createElement("section", { id: "listing", className: "vrf-section vrf-listing" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.1rem)", lineHeight: 1, fontWeight: 950 } }, "All vehicles"), /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 0", color: "var(--vrf-muted)", fontSize: 14, fontWeight: 750 } }, listingMessage)), /* @__PURE__ */ React.createElement("div", { className: "vrf-listing-grid" }, /* @__PURE__ */ React.createElement(VrfFilterRail, { ...props }), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "vrf-list-toolbar" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 950 } }, listingCountLabel), visibleCity ? /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, color: "var(--vrf-muted)", fontSize: 12, fontWeight: 750 } }, " in ", visibleCity) : null), /* @__PURE__ */ React.createElement("div", { className: "vrf-toolbar-actions" }, /* @__PURE__ */ React.createElement(VrfConditionToggle, { condition, setCondition }), /* @__PURE__ */ React.createElement("div", { className: "vrf-search-suggest" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "vrf-input",
        style: { minHeight: 36, width: 240 },
        "aria-label": "Search vehicles",
        value: query,
        onChange: (event) => setQuery(event.target.value),
        placeholder: "Search vehicles...",
        autoComplete: "off"
      }
    ), searchSuggestions.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "vrf-search-suggestions", role: "listbox", "aria-label": "Vehicle search suggestions" }, searchSuggestions.map((vehicle) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: vehicle.id,
        type: "button",
        className: "vrf-search-suggestion",
        onMouseDown: (event) => {
          event.preventDefault();
          setQuery(vrfModelLabel(vehicle));
          setVehicleCategoryFilter(vehicle.category || "all");
        }
      },
      /* @__PURE__ */ React.createElement("img", { src: vehicleImageOrFallback(vehicle), alt: "", onError: (event) => applyVehicleImageFallback(event, vehicle) }),
      /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, vehicle.name), /* @__PURE__ */ React.createElement("small", null, displayBrandName(vehicle.brand), " \xB7 ", vehicle.variant))
    ))) : null), /* @__PURE__ */ React.createElement("select", { className: "vrf-select", value: sort, onChange: (event) => setSort(event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "popular" }, "Sort: Popularity"), /* @__PURE__ */ React.createElement("option", { value: "low" }, "Price: Low to High"), /* @__PURE__ */ React.createElement("option", { value: "high" }, "Price: High to Low"), /* @__PURE__ */ React.createElement("option", { value: "emi" }, "EMI")), /* @__PURE__ */ React.createElement("div", { className: "vrf-view-toggle", "aria-label": "View mode" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-icon-button", "data-active": viewMode === "grid", onClick: () => setViewMode("grid"), "aria-label": "Grid view" }, /* @__PURE__ */ React.createElement(window.Icons.dashboard, { size: 14 })), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-icon-button", "data-active": viewMode === "list", onClick: () => setViewMode("list"), "aria-label": "List view" }, /* @__PURE__ */ React.createElement(window.Icons.menu, { size: 14 }))))), /* @__PURE__ */ React.createElement("div", { className: "vrf-active-filters" }, activeFilterItems.map((item) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: item.key,
        type: "button",
        className: "vrf-active-filter",
        "aria-label": `Remove ${item.label} filter`,
        onClick: item.clear
      },
      item.label,
      " \xD7"
    )), activeFilterItems.length > 0 ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-link-button", "aria-label": "Clear active vehicle filters", onClick: clearFilters }, "Clear all") : null), preOwnedVehicles.length > 0 ? /* @__PURE__ */ React.createElement("section", { style: { margin: "0 0 22px", border: "1px solid rgb(15 23 42 / 0.10)", borderRadius: 22, background: "linear-gradient(135deg, rgb(255 255 255 / 0.94), rgb(245 241 234 / 0.84))", padding: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, color: "var(--vrf-accent)", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" } }, "Second-hand dealer stock"), /* @__PURE__ */ React.createElement("h3", { style: { margin: "5px 0 0", fontFamily: "var(--font-display)", fontSize: "clamp(1.35rem, 2.4vw, 2rem)", lineHeight: 1, fontWeight: 950 } }, "Pre-owned vehicles available now"), /* @__PURE__ */ React.createElement("p", { style: { margin: "7px 0 0", color: "var(--vrf-muted)", fontSize: 13, fontWeight: 750 } }, "Listings from used and hybrid dealers, using the same live filters below.")), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "vrf-secondary",
        style: { minHeight: 42, padding: "0 18px" },
        onClick: () => {
          setCondition("Used");
          setVisibleCount(12);
        }
      },
      "View all used"
    )), /* @__PURE__ */ React.createElement("div", { className: "vrf-card-grid", "data-view": "grid" }, preOwnedVehicles.map((vehicle) => /* @__PURE__ */ React.createElement(
      VrfVehicleCard,
      {
        key: `pre-owned-${vehicle.id}`,
        vehicle,
        compared: compareIds.includes(vehicle.id),
        saved: savedIds.includes(vehicle.id),
        onCompareToggle: toggleCompare,
        onSaveToggle: toggleSave,
        onEnquire: handleEnquire
      }
    )))) : null, filtered.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "vrf-card-grid", "data-view": viewMode }, visibleVehicles.map((vehicle) => /* @__PURE__ */ React.createElement(
      VrfVehicleCard,
      {
        key: vehicle.id,
        vehicle,
        compared: compareIds.includes(vehicle.id),
        saved: savedIds.includes(vehicle.id),
        onCompareToggle: toggleCompare,
        onSaveToggle: toggleSave,
        onEnquire: handleEnquire
      }
    ))) : /* @__PURE__ */ React.createElement("div", { className: "vrf-empty" }, loadingVehicles ? "Loading model cards from the database..." : vehicles.length === 0 ? "No vehicle model cards are available from the database yet." : "No DB vehicles match this search. Try another budget, brand, fuel type, or model."), hasMoreVehicles ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", marginTop: 40 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-secondary", style: { minHeight: 48, padding: "0 28px", fontSize: 14 }, onClick: () => setVisibleCount((current) => current + 12) }, "Load more vehicles")) : null))));
  }
  function VrfCompareTray({ vehicles, onRemove, onClear, onCompare }) {
    if (!vehicles.length) return null;
    const ready = vehicles.length >= 2;
    return /* @__PURE__ */ React.createElement("div", { className: "vrf-compare-tray" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-compare-thumbs" }, vehicles.map((vehicle) => /* @__PURE__ */ React.createElement("div", { key: vehicle.id, className: "vrf-compare-thumb" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: vehicleImageOrFallback(vehicle),
        alt: vehicle.name,
        onError: (event) => applyVehicleImageFallback(event, vehicle)
      }
    ), /* @__PURE__ */ React.createElement("button", { type: "button", "aria-label": `Remove ${vehicle.name}`, onClick: () => onRemove(vehicle.id), className: "vrf-compare-thumb-remove" }, "\xD7"))), Array.from({ length: Math.max(0, 4 - vehicles.length) }).map((_, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "vrf-compare-thumb", style: { display: "grid", placeItems: "center", border: "1px dashed rgb(255 255 255 / 0.22)", color: "rgb(255 255 255 / 0.42)" } }, "+"))), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 950 } }, vehicles.length, " vehicles selected"), /* @__PURE__ */ React.createElement("div", { style: { color: "rgb(248 250 252 / 0.62)", fontSize: 10, fontWeight: 750 } }, ready ? "Ready for side-by-side comparison" : "Pick one more vehicle to compare")), /* @__PURE__ */ React.createElement("div", { className: "vrf-compare-tray-actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-tray-secondary", onClick: onClear }, "Clear"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-primary", "data-ready": ready, onClick: onCompare }, ready ? `Compare (${vehicles.length})` : "Add 1 more", " ", /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 14, style: { verticalAlign: "-2px" } }))));
  }
  function VrfComparePanel({ vehicles, visible, onRemove, onClose, onEnquire }) {
    React.useEffect(() => {
      if (!visible || vehicles.length < 2) return void 0;
      const previousOverflow = document.body.style.overflow;
      const handleKeyDown = (event) => {
        if (event.key === "Escape") onClose();
      };
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [visible, vehicles.length, onClose]);
    if (!visible || vehicles.length < 2) return null;
    const rows = [
      ["Ex-showroom", (vehicle) => vehicle.price],
      ["On-road from", (vehicle) => vehicle.onRoad],
      ["EMI from", (vehicle) => vehicle.emi],
      ["Fuel", (vehicle) => vehicle.fuel],
      ["Transmission", (vehicle) => vehicle.transmission],
      ["Body type", (vehicle) => vehicle.body],
      ["Seats", (vehicle) => vehicle.seats],
      ["Range / usage", (vehicle) => vehicle.km]
    ];
    return /* @__PURE__ */ React.createElement("section", { id: "compare", className: "vrf-compare-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "vrf-compare-title" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-compare-backdrop", "aria-label": "Close comparison", onClick: onClose }), /* @__PURE__ */ React.createElement("div", { className: "vrf-compare-dialog" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-compare-shell" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-section-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--bronze-400)", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 } }, "Side-by-side"), /* @__PURE__ */ React.createElement("h2", { id: "vrf-compare-title" }, "Compare selected vehicles"), /* @__PURE__ */ React.createElement("p", null, "Review the marketplace listings you selected before opening a detail page or requesting price.")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-secondary", onClick: onClose }, "Hide comparison")), /* @__PURE__ */ React.createElement("div", { className: "vrf-compare-table", style: { "--compare-cols": vehicles.length } }, /* @__PURE__ */ React.createElement("div", { className: "vrf-compare-label-cell" }, "Model"), vehicles.map((vehicle) => /* @__PURE__ */ React.createElement("div", { key: vehicle.id, className: "vrf-compare-model-cell" }, /* @__PURE__ */ React.createElement("button", { type: "button", "aria-label": `Remove ${vehicle.name}`, onClick: () => onRemove(vehicle.id), className: "vrf-compare-remove" }, "\xD7"), /* @__PURE__ */ React.createElement(
      "img",
      {
        src: vehicleImageOrFallback(vehicle),
        alt: vrfModelLabel(vehicle),
        onError: (event) => applyVehicleImageFallback(event, vehicle)
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "vrf-card-brand" }, displayBrandName(vehicle.brand)), /* @__PURE__ */ React.createElement("h3", null, vehicle.name), /* @__PURE__ */ React.createElement("p", null, vehicle.variant), /* @__PURE__ */ React.createElement("a", { href: vehicle.detailHref, target: "_top" }, "Open model details ", /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 12 })))), rows.map(([label, getter]) => /* @__PURE__ */ React.createElement(React.Fragment, { key: label }, /* @__PURE__ */ React.createElement("div", { className: "vrf-compare-label-cell" }, label), vehicles.map((vehicle) => /* @__PURE__ */ React.createElement("div", { key: `${vehicle.id}-${label}`, className: "vrf-compare-value-cell" }, getter(vehicle) || "Ask dealer"))))), /* @__PURE__ */ React.createElement("div", { className: "vrf-compare-actions" }, vehicles.map((vehicle) => /* @__PURE__ */ React.createElement("button", { key: vehicle.id, type: "button", className: "vrf-primary", onClick: () => onEnquire(vehicle.id, "On-road price request") }, "Get price for ", vehicle.name))))));
  }
  function VrfLaunches({ vehicles, onNotify }) {
    const launches = vehicles.filter((vehicle) => vehicle.condition === "New" || normalizeBrandKey(vehicle.badge).includes("new") || normalizeBrandKey(vehicle.fuel).includes("electric")).slice(0, 4);
    const source = launches.length ? launches : vehicles.slice(0, 4);
    if (!source.length) return null;
    return /* @__PURE__ */ React.createElement("section", { id: "launches", className: "vrf-section" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container" }, /* @__PURE__ */ React.createElement(VrfSectionHead, { title: "New launches & coming soon", kicker: "Fresh metal", action: "" }), /* @__PURE__ */ React.createElement("div", { className: "vrf-launch-grid" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-launch-cards" }, source.map((vehicle) => /* @__PURE__ */ React.createElement("div", { key: vehicle.id, className: "vrf-launch-card" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-launch-media" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: vehicleImageOrFallback(vehicle),
        alt: vehicle.name,
        onError: (event) => applyVehicleImageFallback(event, vehicle)
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "vrf-badge", "data-tone": "warning", style: { position: "absolute", left: 12, top: 12 } }, "Just launched")), /* @__PURE__ */ React.createElement("div", { style: { padding: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "vrf-card-brand" }, displayBrandName(vehicle.brand)), /* @__PURE__ */ React.createElement("h3", { style: { margin: "4px 0 0", fontSize: 17, fontWeight: 950 } }, vehicle.name), /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 0", fontSize: 14, fontWeight: 950 } }, vehicle.price, " onwards"))))), /* @__PURE__ */ React.createElement("div", { className: "vrf-panel", style: { padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: 15, fontWeight: 950 } }, "Launching soon"), /* @__PURE__ */ React.createElement(window.Icons.spark, { size: 16, style: { color: "var(--vrf-muted)" } })), source.map((vehicle, index) => /* @__PURE__ */ React.createElement("div", { key: `${vehicle.id}-soon`, style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, borderTop: index === 0 ? 0 : "1px solid var(--vrf-hairline)", paddingTop: index === 0 ? 0 : 14, marginTop: index === 0 ? 0 : 14 } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 950 } }, displayBrandName(vehicle.brand), " ", vehicle.name), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--vrf-muted)", fontSize: 11, fontWeight: 750 } }, vehicle.price, " \xB7 ", vehicle.year)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-secondary", style: { minHeight: 34, fontSize: 10 }, onClick: () => onNotify(vehicle.id, "Launch notification request") }, "Notify")))))));
  }
  function VrfEVZone({ vehicle, evCount, onExplore }) {
    if (!vehicle) return null;
    return /* @__PURE__ */ React.createElement("section", { id: "ev", className: "vrf-section" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-ev-panel" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-two-col" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "vrf-kicker", style: { color: "var(--vrf-success)" } }, /* @__PURE__ */ React.createElement(window.Icons.ev, { size: 13 }), " EV Zone"), /* @__PURE__ */ React.createElement("h2", { style: { margin: "18px 0 0", fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3rem)", lineHeight: 1.08, fontWeight: 950 } }, "Electric, made simple."), /* @__PURE__ */ React.createElement("p", { style: { maxWidth: 500, color: "var(--vrf-muted)", fontSize: 15, lineHeight: 1.65, fontWeight: 700 } }, "Filter by fuel type, live dealer availability, and EMI. ", evCount, " verified EV listings are available from the marketplace database."), /* @__PURE__ */ React.createElement("div", { className: "vrf-stat-grid", style: { marginTop: 28 } }, /* @__PURE__ */ React.createElement("div", { className: "vrf-stat-card" }, /* @__PURE__ */ React.createElement(window.Icons.ev, { size: 18, style: { color: "var(--vrf-success)" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, fontSize: 28, fontWeight: 950 } }, evCount), /* @__PURE__ */ React.createElement("div", { className: "vrf-card-brand" }, "EV listings")), /* @__PURE__ */ React.createElement("div", { className: "vrf-stat-card" }, /* @__PURE__ */ React.createElement(window.Icons.gauge, { size: 18, style: { color: "var(--vrf-success)" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, fontSize: 28, fontWeight: 950 } }, vehicle.km), /* @__PURE__ */ React.createElement("div", { className: "vrf-card-brand" }, "Range / usage")), /* @__PURE__ */ React.createElement("div", { className: "vrf-stat-card" }, /* @__PURE__ */ React.createElement(window.Icons.check, { size: 18, style: { color: "var(--vrf-success)" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, fontSize: 28, fontWeight: 950 } }, "Live"), /* @__PURE__ */ React.createElement("div", { className: "vrf-card-brand" }, "DB stock"))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-primary", style: { marginTop: 28, background: "var(--vrf-success)" }, onClick: onExplore }, "Explore all EVs ", /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 15, style: { verticalAlign: "-2px" } }))), /* @__PURE__ */ React.createElement("div", { className: "vrf-hero-car" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: vehicleImageOrFallback(vehicle),
        alt: vrfModelLabel(vehicle),
        onError: (event) => applyVehicleImageFallback(event, vehicle)
      }
    ))))));
  }
  function VrfEmiCalculator({ vehicle, onEligibility }) {
    const basePrice = Math.max(vrfPriceNumber(vehicle), 4e5) || 15e5;
    const [price, setPrice] = React.useState(basePrice);
    const [down, setDown] = React.useState(Math.round(basePrice * 0.2));
    const [tenure, setTenure] = React.useState(5);
    const [rate, setRate] = React.useState(8.5);
    const result = React.useMemo(() => {
      const principal = Math.max(0, price - Math.min(down, Math.floor(price / 2)));
      const monthlyRate = rate / 100 / 12;
      const months = tenure * 12;
      const emi = monthlyRate === 0 ? principal / months : principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      return {
        emi: Math.round(emi),
        principal,
        interest: Math.round(emi * months - principal),
        total: Math.round(emi * months)
      };
    }, [price, down, tenure, rate]);
    const format = (value) => `\u20B9${Math.round(value).toLocaleString("en-IN")}`;
    return /* @__PURE__ */ React.createElement("section", { id: "finance", className: "vrf-section" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-emi-panel" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-emi-left" }, /* @__PURE__ */ React.createElement("span", { className: "vrf-card-brand", style: { color: "var(--vrf-brand-text)" } }, "EMI Calculator"), /* @__PURE__ */ React.createElement("h2", { style: { margin: "8px 0 0", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.6rem)", lineHeight: 1.08, fontWeight: 950 } }, "Plan your finance with confidence."), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--vrf-muted)", fontSize: 14, fontWeight: 700 } }, "Adjust price, down payment, tenure, and interest rate to fit your budget."), /* @__PURE__ */ React.createElement("div", { className: "vrf-range-row" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 850 } }, /* @__PURE__ */ React.createElement("span", null, "Vehicle price"), /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--vrf-brand-text)" } }, format(price))), /* @__PURE__ */ React.createElement("input", { type: "range", min: "400000", max: "5000000", step: "50000", value: price, onChange: (event) => setPrice(Number(event.target.value)) })), /* @__PURE__ */ React.createElement("div", { className: "vrf-range-row" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 850 } }, /* @__PURE__ */ React.createElement("span", null, "Down payment"), /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--vrf-brand-text)" } }, format(Math.min(down, Math.floor(price / 2))))), /* @__PURE__ */ React.createElement("input", { type: "range", min: "0", max: Math.floor(price / 2), step: "10000", value: Math.min(down, Math.floor(price / 2)), onChange: (event) => setDown(Number(event.target.value)) })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 28 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 850 } }, "Tenure (years)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 10 } }, [3, 5, 7].map((item) => /* @__PURE__ */ React.createElement("button", { key: item, type: "button", className: "vrf-chip", "data-active": tenure === item, onClick: () => setTenure(item) }, item)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 850 } }, "Interest rate"), /* @__PURE__ */ React.createElement("input", { className: "vrf-input", type: "number", step: "0.1", value: rate, onChange: (event) => setRate(Number(event.target.value)), style: { marginTop: 10, textAlign: "center", fontWeight: 950 } })))), /* @__PURE__ */ React.createElement("div", { className: "vrf-emi-result" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "vrf-emi-result-label", style: { color: "rgb(255 253 247 / 0.8)" } }, "Estimated EMI"), /* @__PURE__ */ React.createElement("div", { className: "vrf-emi-result-amount", style: { color: "#fffdf7", textShadow: "0 1px 18px rgb(255 253 247 / 0.16)" } }, format(result.emi), /* @__PURE__ */ React.createElement("small", { style: { color: "rgb(255 253 247 / 0.74)" } }, "/mo"))), /* @__PURE__ */ React.createElement("div", { className: "vrf-emi-breakdown" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-emi-breakdown-row", style: { color: "rgb(255 253 247 / 0.76)" } }, /* @__PURE__ */ React.createElement("span", null, "Principal"), /* @__PURE__ */ React.createElement("strong", { style: { color: "#fffdf7" } }, format(result.principal))), /* @__PURE__ */ React.createElement("div", { className: "vrf-emi-breakdown-row", style: { color: "rgb(255 253 247 / 0.76)" } }, /* @__PURE__ */ React.createElement("span", null, "Total interest"), /* @__PURE__ */ React.createElement("strong", { style: { color: "#fffdf7" } }, format(result.interest))), /* @__PURE__ */ React.createElement("div", { className: "vrf-emi-breakdown-row", style: { color: "rgb(255 253 247 / 0.76)" } }, /* @__PURE__ */ React.createElement("span", null, "Total payable"), /* @__PURE__ */ React.createElement("strong", { style: { color: "#fffdf7" } }, format(result.total)))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-primary", style: { background: "#fffdf7", color: "#0b0e12" }, onClick: () => onEligibility(vehicle, result) }, "Check eligibility ", /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 14, style: { verticalAlign: "-2px" } }))))));
  }
  function VrfTrustBand() {
    const items = [
      ["Verified pricing", "Real on-road costs with dealer-backed database inventory.", "check"],
      ["Dealer-backed", "Listings are connected to live DealerSite marketplace stock.", "brands"],
      ["Doorstep test drive", "Capture test-drive interest directly from each model card.", "testdrive"],
      ["Easy financing", "EMI planning is built into the discovery experience.", "gauge"],
      ["Buyer concierge", "Lead actions are ready for dealership follow-up.", "phone"]
    ];
    return /* @__PURE__ */ React.createElement("section", { className: "vrf-section vrf-trust" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container" }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 680, marginBottom: 34 } }, /* @__PURE__ */ React.createElement("span", { className: "vrf-card-brand", style: { color: "var(--vrf-brand-text)" } }, "Why DealerSite Market"), /* @__PURE__ */ React.createElement("h2", { style: { margin: "8px 0 0", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.6rem)", lineHeight: 1.08, fontWeight: 950 } }, "Built for first-time clarity.")), /* @__PURE__ */ React.createElement("div", { className: "vrf-trust-grid" }, items.map(([title, body, icon]) => {
      const Icon = window.Icons[icon] || window.Icons.check;
      return /* @__PURE__ */ React.createElement("div", { key: title, className: "vrf-trust-card" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-icon-tile" }, /* @__PURE__ */ React.createElement(Icon, { size: 20 })), /* @__PURE__ */ React.createElement("h3", { style: { margin: "16px 0 0", fontSize: 15, fontWeight: 950 } }, title), /* @__PURE__ */ React.createElement("p", { style: { margin: "6px 0 0", color: "var(--vrf-muted)", fontSize: 12, lineHeight: 1.55, fontWeight: 700 } }, body));
    }))));
  }
  function VrfDealerLocator({ dealers, city, onDealerAction }) {
    const pins = [
      ["20%", "30%"],
      ["45%", "55%"],
      ["60%", "25%"],
      ["35%", "75%"]
    ];
    const visibleDealers = dealers.slice(0, 4);
    return /* @__PURE__ */ React.createElement("section", { id: "dealers", className: "vrf-section", style: { background: "#F5F1EA", color: "#0B0E12" } }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container" }, /* @__PURE__ */ React.createElement(VrfSectionHead, { title: "Find an authorized dealer near you.", kicker: "Visit in person", action: "" }), /* @__PURE__ */ React.createElement("div", { className: "vrf-dealer-grid" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-map" }, pins.map(([top, left], index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "vrf-map-pin", style: { top, left } }, /* @__PURE__ */ React.createElement(window.Icons.mapPin, { size: 17 }))), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 16, bottom: 16, borderRadius: 8, background: "rgb(255 255 255 / 0.82)", padding: "7px 10px", fontSize: 11, fontWeight: 950 } }, city, " \xB7 ", dealers.length || 1, " dealers")), /* @__PURE__ */ React.createElement("div", { className: "vrf-dealer-list" }, (visibleDealers.length ? visibleDealers : [{ name: "DealerSite partner", location: city, brands: "Multi-brand", image: "" }]).map((dealer, index) => /* @__PURE__ */ React.createElement("div", { key: `${dealer.name}-${index}`, className: "vrf-dealer-row" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-icon-tile" }, /* @__PURE__ */ React.createElement(window.Icons.mapPin, { size: 17 })), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0, flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("h4", { style: { margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 14, fontWeight: 950 } }, dealer.name), /* @__PURE__ */ React.createElement("span", { style: { borderRadius: 6, background: "var(--vrf-surface-2)", color: "var(--vrf-muted)", padding: "2px 6px", fontSize: 10, fontWeight: 950 } }, (index + 1) * 2, ".4 km")), /* @__PURE__ */ React.createElement("p", { style: { margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--vrf-muted)", fontSize: 11 } }, dealer.brands), /* @__PURE__ */ React.createElement("p", { style: { margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--vrf-muted)", fontSize: 11 } }, dealer.location)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-icon-button", "aria-label": `Request call from ${dealer.name}`, onClick: () => onDealerAction(dealer), style: { border: "1px solid var(--vrf-hairline)", borderRadius: "999px", width: 36, height: 36 } }, /* @__PURE__ */ React.createElement(window.Icons.phone, { size: 14 }))))))));
  }
  function VrfFooter({ onJoin, onFooterLink }) {
    const [email, setEmail] = React.useState("");
    const columns = [
      ["Browse", [
        ["By Budget", "/budget"],
        ["By Brand", "/brands"],
        ["By Body Type", "/body-type"],
        ["EV Zone", "/ev"],
        ["Upcoming", "/upcoming"]
      ]],
      ["Tools", [
        ["EMI Calculator", "/tools/emi-calculator"],
        ["Compare Vehicles", "/compare"],
        ["On-Road Price", "/tools/on-road-price"],
        ["Dealer Locator", "/dealers"]
      ]],
      ["Company", [
        ["About", "/about"],
        ["Careers", "/careers"],
        ["Press", "/press"],
        ["Contact", "/contact"]
      ]],
      ["Legal", [
        ["Privacy", "/privacy"],
        ["Terms", "/terms"],
        ["Disclaimer", "/disclaimer"],
        ["Sitemap", "/sitemap.xml"]
      ]]
    ];
    return /* @__PURE__ */ React.createElement("footer", { className: "vrf-footer" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-container" }, /* @__PURE__ */ React.createElement("div", { className: "vrf-footer-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 950, color: "#F5F1EA" } }, "DealerSite Market"), /* @__PURE__ */ React.createElement("p", { style: { maxWidth: 380, color: "rgb(248 250 252 / 0.62)", fontSize: 14, lineHeight: 1.65, fontWeight: 650 } }, "A marketplace-style discovery layer for dealer websites, powered by live database inventory."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 24 } }, /* @__PURE__ */ React.createElement("input", { className: "vrf-input", placeholder: "Your email", value: email, onChange: (event) => setEmail(event.target.value), style: { background: "rgb(255 255 255 / 0.1)", borderColor: "rgb(255 255 255 / 0.14)", color: "var(--vrf-bg)" } }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "vrf-primary", onClick: () => onJoin(email) }, "Join"))), columns.map(([heading, links]) => /* @__PURE__ */ React.createElement("div", { key: heading }, /* @__PURE__ */ React.createElement("h4", { style: { margin: 0, color: "rgb(248 250 252 / 0.5)", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" } }, heading), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", margin: "16px 0 0", padding: 0, display: "grid", gap: 9 } }, links.map(([link, target]) => {
      return /* @__PURE__ */ React.createElement("li", { key: link }, /* @__PURE__ */ React.createElement(
        "a",
        {
          href: target.startsWith("/") || target.startsWith("mailto:") ? target : `#${target}`,
          onClick: (event) => {
            event.preventDefault();
            onFooterLink(link, target);
          },
          style: { color: "rgb(248 250 252 / 0.8)", textDecoration: "none", fontSize: 14, fontWeight: 650 }
        },
        link
      ));
    }))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 56, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderTop: "1px solid rgb(255 255 255 / 0.1)", paddingTop: 24, color: "rgb(248 250 252 / 0.5)", fontSize: 11 } }, /* @__PURE__ */ React.createElement("span", null, "\xA9 2026 DealerSite Pro. All rights reserved."), /* @__PURE__ */ React.createElement("span", null, "Made for Indian dealers"))));
  }
  function RideFinderVehicleExplorer({ setMode }) {
    var _a;
    const [dbVehicles, setDbVehicles] = React.useState([]);
    const [loadingVehicles, setLoadingVehicles] = React.useState(true);
    const [inventoryMessage, setInventoryMessage] = React.useState("Loading live inventory from the database.");
    const [query, setQuery] = React.useState(initialVehicleSearchQuery);
    const [quickMode, setQuickMode] = React.useState("budget");
    const [budget, setBudget] = React.useState("All");
    const [brand, setBrand] = React.useState("All");
    const [body, setBody] = React.useState("All");
    const [fuel, setFuel] = React.useState("All");
    const [transmission, setTransmission] = React.useState("All");
    const [seats, setSeats] = React.useState("All");
    const [condition, setCondition] = React.useState(initialMarketplaceConditionFilter);
    const [vehicleCategoryFilter, setVehicleCategoryFilter] = React.useState(initialVehicleCategoryFilter);
    const [sort, setSort] = React.useState("popular");
    const [viewMode, setViewMode] = React.useState("grid");
    const [compareIds, setCompareIds] = React.useState([]);
    const [showComparePanel, setShowComparePanel] = React.useState(false);
    const [savedIds, setSavedIds] = React.useState([]);
    const [status, setStatus] = React.useState("");
    const [visibleCount, setVisibleCount] = React.useState(12);
    const [showAllBrands, setShowAllBrands] = React.useState(false);
    const [brandDirectoryType, setBrandDirectoryType] = React.useState("4w");
    React.useEffect(() => {
      let active = true;
      async function loadVehicles() {
        try {
          const payload = await fetchAllMarketplaceVehicles();
          const rows = Array.isArray(payload.rows) ? payload.rows : [];
          const mapped = rows.map(mapDbVehicleToExplorer).filter(Boolean);
          if (!active) return;
          if (mapped.length > 0) {
            setDbVehicles(mapped);
            const breakdown = vehicleConditionBreakdownLabel(mapped);
            setInventoryMessage(`Showing ${payload.total || mapped.length} live marketplace vehicles${breakdown ? ` (${breakdown})` : ""} including second-hand dealer and hybrid dealer stock.`);
          } else {
            setDbVehicles([]);
            setInventoryMessage("No marketplace vehicles returned yet. Add new or second-hand vehicles to the database to show model cards.");
          }
        } catch (error) {
          if (active) {
            setDbVehicles([]);
            setInventoryMessage("Marketplace inventory could not load. Model cards are hidden until the database responds.");
          }
        } finally {
          if (active) setLoadingVehicles(false);
        }
      }
      loadVehicles();
      return () => {
        active = false;
      };
    }, []);
    const vehicles = dbVehicles;
    const browseBudgets = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.budget), ["Under \u20B95L", "\u20B95-10L", "\u20B910-15L", "\u20B915-20L", "\u20B920-30L", "\u20B930L+"]).slice(0, 6), [vehicles]);
    const browseBrands = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.brand)), [vehicles]);
    const browseBodies = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.body), ["Hatchback", "Sedan", "Compact SUV", "SUV", "MUV", "Coupe", "Pickup"]).slice(0, 12), [vehicles]);
    const fuelOptions = React.useMemo(() => uniqueVehicleValues(vehicles, "fuel", ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]), [vehicles]);
    const transmissionOptions = React.useMemo(() => uniqueVehicleValues(vehicles, "transmission", ["Manual", "Automatic", "AMT", "CVT", "DCT"]), [vehicles]);
    const seatOptions = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => compactText(vehicle.seats)), ["5", "7"]).slice(0, 8), [vehicles]);
    const conditionOptions = React.useMemo(() => uniqueValues(vehicles.map((vehicle) => vehicle.condition), ["Used", "Certified", "New"]), [vehicles]);
    const city = locationCity((_a = vehicles[0]) == null ? void 0 : _a.location);
    const dealers = React.useMemo(() => uniqueDealerCards(vehicles), [vehicles]);
    React.useEffect(() => {
      setVisibleCount(12);
    }, [query, budget, brand, body, fuel, transmission, seats, condition, vehicleCategoryFilter, sort, dbVehicles.length]);
    const filters = [
      vehicleCategoryFilter !== "all" ? categoryFilterLabel(vehicleCategoryFilter) : null,
      query.trim() ? `Search: ${query.trim()}` : null,
      budget !== "All" ? budget : null,
      brand !== "All" ? displayBrandName(brand) : null,
      body !== "All" ? body : null,
      fuel !== "All" ? fuel : null,
      transmission !== "All" ? transmission : null,
      seats !== "All" ? `${seats} seats` : null,
      condition !== "All" ? condition : null
    ].filter(Boolean);
    const filterVehicleList = (sourceVehicles) => sourceVehicles.filter((vehicle) => {
      const text = `${vehicle.brand} ${vehicle.name} ${vehicle.variant} ${vehicle.type} ${vehicle.fuel} ${vehicle.body} ${vehicle.location}`.toLowerCase();
      return (vehicleCategoryFilter === "all" || vehicle.category === vehicleCategoryFilter) && (!query.trim() || text.includes(query.trim().toLowerCase())) && (budget === "All" || vehicle.budget === budget) && brandMatchesVehicle(vehicle, brand) && (body === "All" || vehicle.body === body) && textOptionMatches(vehicle.fuel, fuel) && textOptionMatches(vehicle.transmission, transmission) && (seats === "All" || compactText(vehicle.seats) === seats) && conditionMatchesVehicle(vehicle, condition);
    });
    let filtered = filterVehicleList(vehicles);
    filtered = [...filtered].sort((a, b) => {
      const price = (vehicle) => vrfPriceNumber(vehicle);
      if (sort === "low") return price(a) - price(b);
      if (sort === "high") return price(b) - price(a);
      if (sort === "emi") return (a.emiValue || 0) - (b.emiValue || 0);
      if (condition === "All") {
        const conditionRank = preOwnedSortRank(a) - preOwnedSortRank(b);
        if (conditionRank !== 0) return conditionRank;
      }
      return a.name.localeCompare(b.name);
    });
    const heroVehicle = React.useMemo(() => {
      return [...vehicles].filter((vehicle) => compactText(vehicle == null ? void 0 : vehicle.image) && !isSharedFallbackVehicleImage(vehicle.image)).sort((a, b) => vrfPriceNumber(b) - vrfPriceNumber(a))[0] || null;
    }, [vehicles]);
    const evVehicles = vehicles.filter((vehicle) => vehicle.type === "EVs" || vehicle.fuel.toLowerCase().includes("electric"));
    const evVehicle = evVehicles[0] || null;
    const visibleVehicles = filtered.slice(0, visibleCount);
    const hasMoreVehicles = filtered.length > visibleVehicles.length;
    const comparedVehicles = compareIds.map((id) => vehicles.find((vehicle) => vehicle.id === id)).filter(Boolean);
    const quickItems = quickMode === "budget" ? browseBudgets : quickMode === "brand" ? browseBrands : browseBodies;
    const activeQuickValue = quickMode === "budget" ? budget : quickMode === "brand" ? brand : body;
    const listingMessage = vehicles.length > 0 && filters.length > 0 && filtered.length === 0 ? "No DB vehicles match the selected filters." : inventoryMessage;
    const selectBrand = (value, options = {}) => {
      setBrand(value);
      setBudget("All");
      setBody("All");
      setFuel("All");
      setTransmission("All");
      setSeats("All");
      setCondition("All");
      if (!options.preserveCategory) setVehicleCategoryFilter("all");
      setQuery("");
    };
    const clearFilters = () => {
      setBudget("All");
      setBrand("All");
      setBody("All");
      setFuel("All");
      setTransmission("All");
      setSeats("All");
      setCondition("All");
      setVehicleCategoryFilter("all");
      setQuery("");
    };
    const applyQuickFilter = (value) => {
      if (quickMode === "budget") setBudget(value);
      if (quickMode === "brand") selectBrand(value);
      if (quickMode === "body") setBody(value);
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
      window.__vrfStatusTimer = window.setTimeout(() => setStatus(""), 2600);
    };
    const vehicleIntentHref = (vehicle, intent, section = "overview") => {
      const href = compactText(vehicle == null ? void 0 : vehicle.detailHref);
      if (!href) return "";
      const [base] = href.split("#");
      const separator = base.includes("?") ? "&" : "?";
      const hash = section ? `#${section}` : "";
      return `${base}${separator}intent=${encodeURIComponent(intent)}${hash}`;
    };
    const openVehicleIntent = (vehicle, intent, section = "overview") => {
      const href = vehicleIntentHref(vehicle, intent, section);
      if (!href) return false;
      window.top.location.href = href;
      return true;
    };
    const toggleSave = (id) => {
      const vehicle = vehicles.find((item) => item.id === id);
      setSavedIds((current) => {
        const exists = current.includes(id);
        showStatus(`${exists ? "Removed saved model" : "Saved model"}${vehicle ? `: ${vrfModelLabel(vehicle)}` : ""}.`);
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
      if (intentText.includes("test drive")) {
        if (openVehicleIntent(vehicle, "test-drive", "overview")) return;
      } else if (intentText.includes("on road") || intentText.includes("price")) {
        if (openVehicleIntent(vehicle, "on-road-price", "emi")) return;
      } else if (intentText.includes("launch")) {
        if (openVehicleIntent(vehicle, "launch-notification", "overview")) return;
      }
      if (openVehicleIntent(vehicle, "enquiry", "overview")) return;
      showStatus(`${message} for ${vrfModelLabel(vehicle)}.`);
    };
    const handleCompare = () => {
      if (comparedVehicles.length < 2) {
        showStatus("Select at least two vehicles to compare side by side.");
        return;
      }
      setShowComparePanel(true);
    };
    const handleEligibility = (vehicle, result) => {
      if (openVehicleIntent(vehicle, "emi-eligibility", "emi")) return;
      showStatus(`Eligibility check ready for ${vrfModelLabel(vehicle)} at approx ${formatInrShort(result.emi)}/month.`);
    };
    const handleDealerAction = (dealer) => {
      const dealerName = compactText(dealer.name, "nearest dealer");
      const dealerLocation = compactText(dealer.location, city);
      window.top.location.href = `mailto:sales@dealersitepro.com?subject=${encodeURIComponent(`Request call from ${dealerName}`)}&body=${encodeURIComponent(`Please arrange a callback for ${dealerName} in ${dealerLocation}.`)}`;
    };
    const handleFooterJoin = (email) => {
      const clean = compactText(email);
      if (!clean.includes("@")) {
        showStatus("Enter an email to join vehicle market updates.");
        return;
      }
      window.top.location.href = `mailto:sales@dealersitepro.com?subject=${encodeURIComponent("Join DealerSite Market updates")}&body=${encodeURIComponent(`Please add ${clean} to DealerSite Market updates.`)}`;
    };
    const handleFooterLink = (label, target) => {
      const cleanTarget = compactText(target);
      if (cleanTarget.startsWith("/") || cleanTarget.startsWith("mailto:")) {
        window.top.location.href = cleanTarget;
        return;
      }
      if (cleanTarget) vrfScrollToId(cleanTarget);
    };
    const openAllBrands = (type = "4w") => {
      setBrandDirectoryType(validBrandDirectoryType(type));
      setShowAllBrands(true);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => vrfScrollToId("all-brands"));
      });
    };
    const closeAllBrands = () => {
      setShowAllBrands(false);
      window.requestAnimationFrame(() => vrfScrollToId("brands"));
    };
    React.useEffect(() => {
      const handleMarketFilter = (event) => {
        const detail = event.detail || {};
        const kind = normalizeBrandKey(detail.kind);
        const value = compactText(detail.value);
        if (kind === "brand" && value) {
          setShowAllBrands(false);
          setVehicleCategoryFilter("all");
          selectBrand(value);
        } else if (kind === "budget" && value) {
          setShowAllBrands(false);
          setVehicleCategoryFilter("all");
          setBudget(value);
          setBrand("All");
          setBody("All");
          setQuery("");
        } else if (kind === "body" && value) {
          setShowAllBrands(false);
          setVehicleCategoryFilter("all");
          setBody(value);
          setBudget("All");
          setBrand("All");
          setQuery("");
        } else if (kind === "type" && value) {
          setShowAllBrands(false);
          setVehicleCategoryFilter(categoryFilterForType(value));
          setQuery("");
          setBudget("All");
          setBrand("All");
          setBody("All");
          setFuel("All");
          setTransmission("All");
          setSeats("All");
        } else if (kind === "search") {
          setShowAllBrands(false);
          setVehicleCategoryFilter("all");
          setQuery(value);
          setBudget("All");
          setBrand("All");
          setBody("All");
        }
        setVisibleCount(12);
        if (detail.scroll !== false) {
          window.requestAnimationFrame(vrfScrollToListing);
        }
      };
      window.addEventListener("dsp-market-filter", handleMarketFilter);
      return () => window.removeEventListener("dsp-market-filter", handleMarketFilter);
    }, []);
    React.useEffect(() => {
      const handleBrandsOpen = (event) => {
        var _a2;
        openAllBrands(((_a2 = event.detail) == null ? void 0 : _a2.type) || "4w");
      };
      window.addEventListener("dsp-market-brands-open", handleBrandsOpen);
      return () => window.removeEventListener("dsp-market-brands-open", handleBrandsOpen);
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
      setCondition
    };
    return /* @__PURE__ */ React.createElement("div", { id: "market-top", className: "vrf-market" }, /* @__PURE__ */ React.createElement(
      VrfHero,
      {
        vehicles,
        heroVehicle,
        query,
        setQuery,
        quickMode,
        setQuickMode,
        quickItems,
        activeQuickValue,
        applyQuickFilter
      }
    ), /* @__PURE__ */ React.createElement(
      VrfBrowseRails,
      {
        vehicles,
        budgets: browseBudgets,
        bodies: browseBodies,
        brands: browseBrands,
        budget,
        body,
        brand,
        setBudget,
        setBody,
        selectBrand,
        openAllBrands
      }
    ), /* @__PURE__ */ React.createElement(
      VrfAllBrandsDirectory,
      {
        vehicles,
        visible: showAllBrands,
        activeType: brandDirectoryType,
        setActiveType: setBrandDirectoryType,
        onClose: closeAllBrands
      }
    ), /* @__PURE__ */ React.createElement(VrfListing, { ...listingProps }), /* @__PURE__ */ React.createElement(
      VrfComparePanel,
      {
        vehicles: comparedVehicles,
        visible: showComparePanel,
        onRemove: toggleCompare,
        onClose: () => setShowComparePanel(false),
        onEnquire: handleEnquire
      }
    ), /* @__PURE__ */ React.createElement(VrfLaunches, { vehicles, onNotify: handleEnquire }), /* @__PURE__ */ React.createElement(VrfEVZone, { vehicle: evVehicle, evCount: evVehicles.length, onExplore: () => {
      clearFilters();
      setFuel("Electric");
      vrfScrollToListing();
    } }), heroVehicle ? /* @__PURE__ */ React.createElement(VrfEmiCalculator, { vehicle: heroVehicle, onEligibility: handleEligibility }) : null, /* @__PURE__ */ React.createElement(VrfTrustBand, null), /* @__PURE__ */ React.createElement(VrfDealerLocator, { dealers, city, onDealerAction: handleDealerAction }), /* @__PURE__ */ React.createElement(VrfFooter, { onJoin: handleFooterJoin, onFooterLink: handleFooterLink }), !showComparePanel ? /* @__PURE__ */ React.createElement(VrfCompareTray, { vehicles: comparedVehicles, onRemove: toggleCompare, onClear: () => setCompareIds([]), onCompare: handleCompare }) : null, status ? /* @__PURE__ */ React.createElement("div", { className: "vrf-toast" }, /* @__PURE__ */ React.createElement(window.Icons.check, { size: 14, style: { verticalAlign: "-2px" } }), " ", status) : null);
  }
  window.ExplorerToggle = ExplorerToggle;
  window.VehicleExplorer = RideFinderVehicleExplorer;
})();
