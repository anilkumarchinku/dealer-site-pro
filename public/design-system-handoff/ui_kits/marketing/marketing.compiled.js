var DealerSiteMarketingBundle = (() => {
  const Svg = ({ size = 24, children, style }) => /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style
    },
    children
  );
  const Icons = {
    car: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" }), /* @__PURE__ */ React.createElement("path", { d: "M3 16v-2a2 2 0 0 1 1-1.7L5 11h14l1 .3A2 2 0 0 1 21 14v2" }), /* @__PURE__ */ React.createElement("path", { d: "M4 16h16v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" }), /* @__PURE__ */ React.createElement("circle", { cx: "7.5", cy: "13.5", r: ".6", fill: "currentColor" }), /* @__PURE__ */ React.createElement("circle", { cx: "16.5", cy: "13.5", r: ".6", fill: "currentColor" })),
    bike: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "5.5", cy: "17", r: "3.2" }), /* @__PURE__ */ React.createElement("circle", { cx: "18.5", cy: "17", r: "3.2" }), /* @__PURE__ */ React.createElement("path", { d: "M8.5 17l3.2-6h4.3" }), /* @__PURE__ */ React.createElement("path", { d: "M11.7 11L9 7H6.8" }), /* @__PURE__ */ React.createElement("path", { d: "M16 11l2.5 6" }), /* @__PURE__ */ React.createElement("path", { d: "M14 7h3l-1 2" })),
    ev: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z" })),
    auto: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 7h10v8H3z" }), /* @__PURE__ */ React.createElement("path", { d: "M13 10h4l3 3v2h-7z" }), /* @__PURE__ */ React.createElement("circle", { cx: "7", cy: "17", r: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "17", cy: "17", r: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M3 7V5h10v2" })),
    used: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 9l9-6 9 6v10a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z" }), /* @__PURE__ */ React.createElement("path", { d: "M9.5 13.5l1.5 1.5 3-3" })),
    brands: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 3l8 4.5v9L12 21l-8-4.5v-9z" }), /* @__PURE__ */ React.createElement("path", { d: "M12 3v18" }), /* @__PURE__ */ React.createElement("path", { d: "M4 7.5l8 4.5 8-4.5" })),
    enquiry: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 5h16v11H8l-4 3z" }), /* @__PURE__ */ React.createElement("path", { d: "M8 9h8M8 12h5" })),
    phone: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" })),
    whatsapp: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 20l1.4-4A8 8 0 1 1 8 18.6z" }), /* @__PURE__ */ React.createElement("path", { d: "M9 10c0 3 2 5 5 5l.8-1.6-2-.9-.8.9a4 4 0 0 1-2-2l.9-.8-.9-2z" })),
    testdrive: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8.5" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "1.4", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M12 5.5v2M12 16.5v2M5.5 12h2M16.5 12h2" }), /* @__PURE__ */ React.createElement("path", { d: "M13.2 10.8l3-2.3" })),
    dashboard: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "8", height: "8", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "13", y: "3", width: "8", height: "5", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "13", y: "10", width: "8", height: "11", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "3", y: "13", width: "8", height: "8", rx: "1.5" })),
    palette: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3z" }), /* @__PURE__ */ React.createElement("circle", { cx: "7.5", cy: "11", r: "1", fill: "currentColor" }), /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "7.5", r: "1", fill: "currentColor" }), /* @__PURE__ */ React.createElement("circle", { cx: "14.5", cy: "7.5", r: "1", fill: "currentColor" })),
    swatch: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "4", width: "6", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "4", width: "6", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "4", y: "14", width: "6", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("path", { d: "M14 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" })),
    globe: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M3 12h18" }), /* @__PURE__ */ React.createElement("path", { d: "M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" })),
    link: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M9 15l6-6" }), /* @__PURE__ */ React.createElement("path", { d: "M10.5 6.5l1.5-1.5a4 4 0 0 1 5.5 5.5L15 12" }), /* @__PURE__ */ React.createElement("path", { d: "M13.5 17.5L12 19a4 4 0 0 1-5.5-5.5L9 11" })),
    template: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M3 9h18M9 9v11" })),
    logo: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M9 8.5h2.5a3.5 3.5 0 0 1 0 7H9z" }), /* @__PURE__ */ React.createElement("path", { d: "M9 8.5v7" })),
    check: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M20 6L9 17l-5-5" })),
    arrowRight: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 12h15M13 6l6 6-6 6" })),
    arrowUpRight: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M7 17L17 7M8 7h9v9" })),
    chevronRight: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M9 6l6 6-6 6" })),
    star: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 3l2.6 5.6L20.5 9.4l-4.3 4.1 1 6L12 16.8 6.8 19.5l1-6-4.3-4.1 5.9-.8z", fill: "currentColor", stroke: "none" })),
    spark: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z", fill: "currentColor", stroke: "none" })),
    play: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M7 5l11 7-11 7z", fill: "currentColor", stroke: "none" })),
    menu: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M3 6h18M3 12h18M3 18h18" })),
    mapPin: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "2.5" })),
    fuel: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "3", width: "9", height: "18", rx: "1.5" }), /* @__PURE__ */ React.createElement("path", { d: "M13 8h3l2 2v7a1.5 1.5 0 0 1-3 0v-4h-2" }), /* @__PURE__ */ React.createElement("path", { d: "M4 11h9" })),
    gauge: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("path", { d: "M4 16a8 8 0 1 1 16 0" }), /* @__PURE__ */ React.createElement("path", { d: "M12 16l4-4" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "16", r: "1.2", fill: "currentColor" })),
    search: (p) => /* @__PURE__ */ React.createElement(Svg, { ...p }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React.createElement("path", { d: "M16 16l4.5 4.5" }))
  };
  window.Icons = Icons;
  function Container({ children, wide = false, style = {} }) {
    return /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: wide ? "var(--container-wide)" : "var(--container)", margin: "0 auto", padding: "0 var(--gutter)", ...style } }, children);
  }
  function Section({ children, tone = "page", id, style = {} }) {
    const bg = tone === "stage" ? "var(--surface-stage)" : tone === "canvas" ? "var(--surface-canvas)" : "var(--surface-page)";
    return /* @__PURE__ */ React.createElement("section", { id, style: { background: bg, paddingTop: "var(--section-y)", paddingBottom: "var(--section-y)", ...style } }, children);
  }
  function SectionHead({ eyebrow, title, sub, dark = false, align = "center", max = 720 }) {
    const { Eyebrow } = window.DesignSystem_a49d67;
    return /* @__PURE__ */ React.createElement(window.Reveal, { style: { display: "flex", flexDirection: "column", gap: 16, alignItems: align === "center" ? "center" : "flex-start", textAlign: align, maxWidth: max, margin: align === "center" ? "0 auto" : 0 } }, eyebrow && /* @__PURE__ */ React.createElement(Eyebrow, { tone: dark ? "dark" : "light" }, eyebrow), /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 4.2vw, 3rem)", lineHeight: 1.05, letterSpacing: "var(--tracking-tight)", color: dark ? "var(--cream-50)" : "var(--text-strong)", textWrap: "balance" } }, title), sub && /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", lineHeight: 1.55, color: dark ? "var(--text-on-dark-muted)" : "var(--text-body)", maxWidth: 580, textWrap: "pretty" } }, sub));
  }
  Object.assign(window, { Container, Section, SectionHead });
  function Reveal({ children, delay = 0, y = 22, as = "div", style = {}, ...rest }) {
    const ref = React.useRef(null);
    const [shown, setShown] = React.useState(false);
    const reduce = React.useRef(typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    React.useEffect(() => {
      if (reduce.current) {
        setShown(true);
        return;
      }
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.92) {
        setShown(true);
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
      io.observe(el);
      const t = setTimeout(() => setShown(true), 2600);
      return () => {
        io.disconnect();
        clearTimeout(t);
      };
    }, []);
    const Tag = as;
    return /* @__PURE__ */ React.createElement(
      Tag,
      {
        ref,
        style: {
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : `translateY(${y}px)`,
          transition: `opacity var(--dur-reveal) var(--ease-out) ${delay}ms, transform var(--dur-reveal) var(--ease-out) ${delay}ms`,
          willChange: "opacity, transform",
          ...style
        },
        ...rest
      },
      children
    );
  }
  window.Reveal = Reveal;
  const U = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
  const DSP_MARKETPLACE_PREVIEW_ENDPOINT = "/api/marketplace?pageSize=48&category=all&condition=all";
  const DSP_PREVIEW_FALLBACK_IMAGES = {
    car: "",
    suv: "",
    csuv: "",
    sedan: "",
    hatch: "",
    mpv: "",
    ev: "",
    bike: "",
    auto: ""
  };
  const DSP_PREVIEW_NEW_VEHICLE_IMAGES = [
    DSP_PREVIEW_FALLBACK_IMAGES.car,
    DSP_PREVIEW_FALLBACK_IMAGES.suv,
    DSP_PREVIEW_FALLBACK_IMAGES.csuv,
    DSP_PREVIEW_FALLBACK_IMAGES.ev,
    DSP_PREVIEW_FALLBACK_IMAGES.hatch,
    DSP_PREVIEW_FALLBACK_IMAGES.sedan,
    DSP_PREVIEW_FALLBACK_IMAGES.mpv
  ];
  const DSP_PREVIEW_TWO_WHEELER_BRANDS = [
    "ather",
    "bajaj",
    "hero",
    "honda motorcycles",
    "ola",
    "royal enfield",
    "suzuki motorcycle",
    "tvs",
    "yamaha"
  ];
  const DSP_PREMIUM_HERO_IMAGES = [
    {
      label: "Mercedes-Benz G-Class",
      image: "/data/brand-model-images/4w-galleries/mercedes-benz/g-class/colors/obsidian-black-metallic.avif"
    },
    {
      label: "Porsche 911",
      image: "/data/brand-model-images/4w-galleries/porsche/911/colors/jet-black-metallic.avif"
    },
    {
      label: "BMW X7",
      image: "/data/brand-model-images/4w-galleries/bmw/x7/colors/mineral-white-metallic.avif"
    },
    {
      label: "Land Rover Defender",
      image: "/data/brand-model-images/4w-galleries/land-rover/defender/colors/fuji-white.avif"
    },
    {
      label: "Audi Q7",
      image: "/data/brand-model-images/4w-galleries/audi/q7/colors/mythos-black-metallic.avif"
    },
    {
      label: "Rolls-Royce Phantom",
      image: "/data/brand-model-images/4w-galleries/rolls-royce/phantom/colors/diamond-black.avif"
    }
  ];
  const DSP_MODEL_GALLERY_IMAGES = [
    { makes: ["maruti suzuki", "maruti"], models: ["wagonr", "wagon r"], image: "/data/brand-model-images/4w-galleries/maruti-suzuki/wagon-r/colors/pearl-metallic-nutmeg-brown.avif" },
    { makes: ["maruti suzuki", "maruti"], models: ["swift"], image: "/data/brand-model-images/4w-galleries/maruti-suzuki/swift/colors/pearl-arctic-white.avif" },
    { makes: ["hyundai"], models: ["aura"], image: "/data/brand-model-images/4w-galleries/hyundai/aura/colors/typhoon-silver.avif" },
    { makes: ["hyundai"], models: ["creta"], image: "/data/brand-model-images/4w-galleries/hyundai/creta/colors/atlas-white.avif" },
    { makes: ["toyota"], models: ["innova hycross"], image: "/data/brand-model-images/4w-galleries/toyota/innova-hycross/colors/platinum-white-pearl.avif" },
    { makes: ["tata motors", "tata"], models: ["nexon ev"], image: "/data/brand-model-images/4w-galleries/tata/nexon-ev/colors/pristine-white-dual-tone.avif" },
    { makes: ["mg"], models: ["zs ev"], image: "/data/brand-model-images/4w-galleries/mg/zs-ev/colors/starry-black.avif" },
    { makes: ["honda", "honda city"], models: ["city"], image: "/data/brand-model-images/4w-galleries/honda/city/colors/platinum-white-pearl.avif" },
    { makes: ["mahindra"], models: ["xuv700"], image: "/data/brand-model-images/4w-galleries/mahindra/xuv700/colors/everest-white.avif" }
  ];
  function dspText(value, fallback = "") {
    return String(value != null ? value : fallback).trim();
  }
  function dspNormalize(value) {
    return dspText(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function dspNumberFromPaise(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric / 100) : 0;
  }
  function dspFormatInrShort(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) return "Price on request";
    if (amount >= 1e7) return `\u20B9${(amount / 1e7).toFixed(2).replace(/\.00$/, "")}Cr`;
    if (amount >= 1e5) return `\u20B9${(amount / 1e5).toFixed(amount >= 1e6 ? 2 : 1).replace(/\.0$/, "")}L`;
    return `\u20B9${Math.round(amount).toLocaleString("en-IN")}`;
  }
  function dspConditionLabel(condition) {
    if (condition === "certified_pre_owned") return "Certified";
    if (condition === "used") return "Used";
    if (condition === "new") return "New";
    return "Available";
  }
  function dspIsNewVehicle(row) {
    return dspText(row.condition).toLowerCase() === "new";
  }
  function dspModelGalleryImageFor(make, model) {
    const makeKey = dspNormalize(make);
    const modelKey = dspNormalize(model);
    if (!makeKey && !modelKey) return "";
    const match = DSP_MODEL_GALLERY_IMAGES.find((item) => {
      const makeMatches = item.makes.some((entry) => makeKey === dspNormalize(entry));
      const modelMatches = item.models.some((entry) => modelKey === dspNormalize(entry));
      return makeMatches && modelMatches;
    });
    return (match == null ? void 0 : match.image) || "";
  }
  function dspPremiumHeroImageFor(key = "showroom") {
    var _a;
    const offsets = { showroom: 0, bronze: 1, electric: 2, market: 3 };
    return DSP_PREMIUM_HERO_IMAGES[(_a = offsets[key]) != null ? _a : 0] || DSP_PREMIUM_HERO_IMAGES[0];
  }
  function dspBadPreviewImageUrl(url) {
    const value = dspText(url).toLowerCase();
    const normalizedPath = value.split("?")[0].replace(/\.(?:avif|webp|png|jpe?g)$/i, "");
    if (!value) return true;
    return [
      "whatsapp",
      "logo",
      "avatar",
      "icon",
      "placeholder",
      "stimg.cardekho.com/images/carexteriorimages",
      "dealer-assets/dealers",
      "/assets/cars/aston-martin/dbs-superleggera",
      "/data/brand-model-images/4w/aston-martin/dbs-superleggera",
      "/data/brand-model-images/4w/aston-martin/aston-martin-dbs-superleggera",
      "/assets/cars/mclaren/750s",
      "/assets/cars/bmw/8-series-gran-coupe"
    ].some((token) => value.includes(token) || normalizedPath.includes(token));
  }
  function dspPreviewVehicleKind(row) {
    var _a, _b, _c, _d;
    const text = `${(_a = row.make) != null ? _a : ""} ${(_b = row.model) != null ? _b : ""} ${(_c = row.body_type) != null ? _c : ""} ${(_d = row.fuel_type) != null ? _d : ""}`.toLowerCase();
    if (text.includes("auto") || text.includes("rickshaw") || text.includes("three-wheeler")) return "auto";
    if (text.includes("scooter") || text.includes("motorcycle") || text.includes("bike")) return "bike";
    if (DSP_PREVIEW_TWO_WHEELER_BRANDS.some((brand) => text.includes(brand))) return "bike";
    if (text.includes("electric") || text.includes("ev")) return "ev";
    return "car";
  }
  function dspPreviewVehiclePriority(row) {
    var _a;
    const conditionPriority = dspIsNewVehicle(row) ? 0 : 10;
    const kind = dspPreviewVehicleKind(row);
    const kindPriority = (_a = { car: 0, ev: 1, bike: 2, auto: 3 }[kind]) != null ? _a : 4;
    return conditionPriority + kindPriority;
  }
  function dspPreviewVehicleDetailHref(row) {
    const explicitHref = dspText(row.detail_href);
    if (explicitHref) return explicitHref;
    const id = encodeURIComponent(dspText(row.id));
    if (!id) return "/cars";
    const kind = dspPreviewVehicleKind(row);
    if (kind === "bike") return `/bikes/${id}`;
    if (kind === "auto") return `/autos/${id}`;
    return `/cars/${id}`;
  }
  function dspPreviewFallbackImage(row, index = 0) {
    return "";
  }
  function dspPreviewImage(row, index = 0) {
    const localModelImage = dspIsNewVehicle(row) ? dspModelGalleryImageFor(row.make, row.model) : "";
    if (localModelImage) return localModelImage;
    const imageList = Array.isArray(row.image_urls) ? row.image_urls.filter(Boolean) : [];
    const image = [row.image_url, ...imageList].map((item) => dspText(item)).find((item) => item && !dspBadPreviewImageUrl(item));
    if (image) return image;
    return dspPreviewFallbackImage(row, index);
  }
  function dspMapPreviewVehicle(row, index) {
    const make = dspText(row.make, "Dealer");
    const model = dspText(row.model, "Vehicle");
    const year = dspText(row.year, "Recent");
    const fuel = dspText(row.fuel_type, "Fuel details");
    const transmission = dspText(row.transmission, "Transmission");
    const price = dspFormatInrShort(dspNumberFromPaise(row.price_paise));
    const mileage = Number(row.mileage_km) > 0 ? `${Number(row.mileage_km).toLocaleString("en-IN")} km` : "";
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
      driven: mileage || "Ready stock",
      body: dspText(row.body_type, "Vehicle"),
      detailHref: dspPreviewVehicleDetailHref(row)
    };
  }
  const DSP_VEHICLE_STORE = {
    status: "idle",
    vehicles: [],
    error: null,
    promise: null,
    subscribers: /* @__PURE__ */ new Set()
  };
  function dspNotifyVehicleSubscribers() {
    DSP_VEHICLE_STORE.subscribers.forEach((subscriber) => subscriber({
      status: DSP_VEHICLE_STORE.status,
      vehicles: DSP_VEHICLE_STORE.vehicles,
      error: DSP_VEHICLE_STORE.error
    }));
  }
  function dspLoadPreviewVehicles() {
    if (DSP_VEHICLE_STORE.promise) return DSP_VEHICLE_STORE.promise;
    DSP_VEHICLE_STORE.status = "loading";
    dspNotifyVehicleSubscribers();
    DSP_VEHICLE_STORE.promise = fetch(DSP_MARKETPLACE_PREVIEW_ENDPOINT, { headers: { Accept: "application/json" } }).then((response) => {
      if (!response.ok) throw new Error(`Marketplace API returned ${response.status}`);
      return response.json();
    }).then((payload) => {
      var _a;
      const rows = Array.isArray((_a = payload == null ? void 0 : payload.data) == null ? void 0 : _a.vehicles) ? payload.data.vehicles : [];
      const orderedRows = [...rows].sort((a, b) => dspPreviewVehiclePriority(a) - dspPreviewVehiclePriority(b));
      DSP_VEHICLE_STORE.vehicles = orderedRows.map(dspMapPreviewVehicle).filter(Boolean);
      DSP_VEHICLE_STORE.status = "ready";
      DSP_VEHICLE_STORE.error = null;
      dspNotifyVehicleSubscribers();
      return DSP_VEHICLE_STORE.vehicles;
    }).catch((error) => {
      DSP_VEHICLE_STORE.vehicles = [];
      DSP_VEHICLE_STORE.status = "error";
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
      error: DSP_VEHICLE_STORE.error
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
      error: state.error
    };
  }
  window.DSP_DATA = {
    heroVehicle: U("1503376780353-7e6692767b70", 1200),
    // sleek sports car
    vehicles: [],
    bikes: [],
    categories: [
      { icon: "car", name: "Cars", blurb: "New, used, and premium car inventory." },
      { icon: "bike", name: "Bikes & Scooters", blurb: "Showcase your two-wheeler lineup." },
      { icon: "ev", name: "EV Dealers", blurb: "Range, charging, and EV-first layouts." },
      { icon: "auto", name: "Autos & Three-Wheelers", blurb: "Built for commercial and last-mile." },
      { icon: "used", name: "Used Vehicle Dealers", blurb: "Trust-building pages for pre-owned." },
      { icon: "brands", name: "Multi-Brand Dealers", blurb: "One website for every brand you sell." }
    ],
    steps: [
      { title: "Add details", blurb: "Showroom name, location, and contact \u2014 in minutes." },
      { title: "Choose vehicles", blurb: "Pick the categories you sell: cars, bikes, EVs, autos." },
      { title: "Pick style", blurb: "Choose a template and apply your brand colours." },
      { title: "Add inventory", blurb: "Upload vehicles with photos, prices, and specs." },
      { title: "Go live", blurb: "Publish on a free subdomain or your own domain." }
    ],
    leads: [
      { icon: "enquiry", name: "Enquiries", blurb: "Forms on every vehicle page." },
      { icon: "phone", name: "Calls", blurb: "Tap-to-call from any device." },
      { icon: "whatsapp", name: "WhatsApp", blurb: "Instant chat with one tap." },
      { icon: "testdrive", name: "Test Drives", blurb: "Booking requests, scheduled." },
      { icon: "dashboard", name: "Lead Dashboard", blurb: "Every lead in one place." }
    ],
    brandControls: [
      { icon: "logo", name: "Add your logo", blurb: "Upload once \u2014 applied site-wide." },
      { icon: "palette", name: "Use brand colours", blurb: "Match your showroom identity." },
      { icon: "template", name: "Choose a template", blurb: "Five dealer-ready layouts." },
      { icon: "globe", name: "Free subdomain", blurb: "yourname.dealersite.pro, instantly." },
      { icon: "link", name: "Connect your domain", blurb: "Point your own .com or .in." }
    ],
    templates: [
      { name: "Clean Showroom", tag: "Cars", image: U("1492144534655-ae79c964c9d7") },
      { name: "Premium Used Cars", tag: "Used", image: U("1503736334956-4c8f8e92946d") },
      { name: "Performance Bikes", tag: "Bikes", image: U("1558981806-ec527fa84c39") },
      { name: "Family Dealer", tag: "Family", image: U("1605559424843-9e4c228bf1c2") },
      { name: "Auto & Three-Wheeler", tag: "Auto", image: U("1519003722824-194d4455a60c") }
    ]
  };
  window.useMarketplacePreviewVehicles = useMarketplacePreviewVehicles;
  window.dspLoadPreviewVehicles = dspLoadPreviewVehicles;
  window.DSP_PREMIUM_HERO_IMAGES = DSP_PREMIUM_HERO_IMAGES;
  window.dspModelGalleryImageFor = dspModelGalleryImageFor;
  window.dspPremiumHeroImageFor = dspPremiumHeroImageFor;
  const DSP_THEMES = {
    showroom: { key: "showroom", label: "Clean Showroom", name: "Shrama Motors", initial: "S", logo: "../../assets/sharma-motors-emblem.png", accent: "#0B0E12", onAccent: "#FFFDF7", url: "shramamotors.dealersite.pro", hero: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=72", tagline: "Drive home\nsomething premium." },
    bronze: { key: "bronze", label: "Premium Used", name: "Apex Auto Gallery", initial: "A", accent: "#A8793A", onAccent: "#FFFDF7", url: "apexautogallery.in", hero: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=72", tagline: "Certified pre-owned,\nshowroom-fresh." },
    electric: { key: "electric", label: "EV First", name: "Volt Motors", initial: "V", accent: "#16794d", onAccent: "#FFFDF7", url: "voltmotors.in", hero: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=72", tagline: "The future is\nfully charged." }
  };
  window.DSP_THEMES = DSP_THEMES;
  function BrowserChrome({ url = "sharmamotors.dealersite.pro", children, style = {} }) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: "var(--cream-50)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      border: "1px solid var(--border-default)",
      boxShadow: "var(--shadow-float)",
      ...style
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", background: "var(--cream-100)", borderBottom: "1px solid var(--border-default)" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("i", { style: { width: 10, height: 10, borderRadius: "50%", background: "#E7E0D7" } }), /* @__PURE__ */ React.createElement("i", { style: { width: 10, height: 10, borderRadius: "50%", background: "#E7E0D7" } }), /* @__PURE__ */ React.createElement("i", { style: { width: 10, height: 10, borderRadius: "50%", background: "#E7E0D7" } })), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, marginLeft: 6, height: 24, borderRadius: "var(--radius-full)", background: "var(--cream-50)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", gap: 7, padding: "0 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, /* @__PURE__ */ React.createElement(window.Icons.globe, { size: 12, style: { opacity: 0.6 } }), " ", url)), children);
  }
  function DealerEmblem({ theme, size = 30 }) {
    const ac = theme.accent, on = theme.onAccent;
    if (theme.logo) {
      return /* @__PURE__ */ React.createElement("img", { src: theme.logo, alt: theme.name + " logo", style: { height: Math.round(size * 1.12), width: "auto", display: "block", flex: "none" } });
    }
    return /* @__PURE__ */ React.createElement("span", { style: { position: "relative", width: size, height: size, flex: "none", borderRadius: Math.round(size * 0.28), background: ac, color: on, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)", transition: "background var(--dur-base) var(--ease-out)" } }, /* @__PURE__ */ React.createElement(window.Icons.car, { size: Math.round(size * 0.62) }), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", bottom: Math.round(size * 0.16), right: Math.round(size * 0.18), width: Math.max(3, Math.round(size * 0.13)), height: Math.max(3, Math.round(size * 0.13)), borderRadius: "50%", background: on, opacity: 0.9 } }));
  }
  function DealerSiteContent({ compact = false, theme = DSP_THEMES.showroom }) {
    var _a, _b, _c;
    const { vehicles: tiles, status } = window.useMarketplacePreviewVehicles(compact ? 2 : 3);
    const premiumHero = (_a = window.dspPremiumHeroImageFor) == null ? void 0 : _a.call(window, theme.key);
    const featuredImage = (premiumHero == null ? void 0 : premiumHero.image) || ((_b = tiles[0]) == null ? void 0 : _b.image) || theme.hero;
    const featuredAlt = (premiumHero == null ? void 0 : premiumHero.label) || ((_c = tiles[0]) == null ? void 0 : _c.name) || "Featured first-hand vehicle";
    const ac = theme.accent, on = theme.onAccent;
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream-50)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: compact ? 12 : 20, padding: compact ? "12px 16px" : "16px 22px", borderBottom: "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flex: "none" } }, /* @__PURE__ */ React.createElement(DealerEmblem, { theme, size: 30 }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: compact ? 14 : 16, color: "var(--text-strong)", letterSpacing: "-0.02em", whiteSpace: "nowrap" } }, theme.name)), !compact && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 18, marginLeft: "auto", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" } }, /* @__PURE__ */ React.createElement("span", null, "Inventory"), /* @__PURE__ */ React.createElement("span", null, "About"), /* @__PURE__ */ React.createElement("span", null, "Finance"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-strong)" } }, "Contact")), /* @__PURE__ */ React.createElement("span", { style: { flex: "none", marginLeft: compact ? "auto" : 0, padding: "7px 13px", borderRadius: "var(--radius-full)", background: ac, color: on, fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", transition: "background var(--dur-base) var(--ease-out)" } }, "Enquire")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: compact ? 130 : 188, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("img", { src: featuredImage, alt: featuredAlt, style: { width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(11,14,18,0.78) 0%, rgba(11,14,18,0.32) 55%, transparent 100%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: compact ? 16 : 24, top: "50%", transform: "translateY(-50%)", maxWidth: "64%" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,253,247,0.7)", marginBottom: 6 } }, "Featured this week"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: compact ? 18 : 26, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--cream-50)", marginBottom: compact ? 8 : 12, whiteSpace: "pre-line" } }, theme.tagline), !compact && /* @__PURE__ */ React.createElement("span", { style: { padding: "8px 14px", borderRadius: "var(--radius-full)", background: "var(--cream-50)", color: "var(--ink-900)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700 } }, "Browse inventory"))), /* @__PURE__ */ React.createElement("div", { style: { padding: compact ? "14px 16px" : "18px 22px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: compact ? 13 : 15, color: "var(--text-strong)" } }, "Latest inventory"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: ac, transition: "color var(--dur-base) var(--ease-out)" } }, "View all \u2192")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: `repeat(${Math.max(tiles.length, 1)}, 1fr)`, gap: 12 } }, tiles.map((v) => /* @__PURE__ */ React.createElement("div", { key: v.name, style: { borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-subtle)", background: "var(--cream-50)" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "var(--cream-300)" } }, /* @__PURE__ */ React.createElement("img", { src: v.image, alt: v.name, style: { width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", top: 7, left: 7, padding: "2px 8px", borderRadius: "var(--radius-full)", background: ac, color: on, fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, transition: "background var(--dur-base) var(--ease-out)" } }, v.tag)), /* @__PURE__ */ React.createElement("div", { style: { padding: "9px 10px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: compact ? 11 : 12.5, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, v.name), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: compact ? 11 : 12.5, color: "var(--text-strong)", whiteSpace: "nowrap" } }, v.price), /* @__PURE__ */ React.createElement("span", { style: { padding: "3px 8px", borderRadius: "var(--radius-full)", border: `1px solid ${ac}`, color: ac, fontFamily: "var(--font-body)", fontSize: 9.5, fontWeight: 700, transition: "border-color var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)" } }, "Enquire"))))), tiles.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { borderRadius: "var(--radius-md)", border: "1px dashed var(--border-default)", background: "var(--cream-100)", padding: compact ? 12 : 16, textAlign: "center", fontFamily: "var(--font-body)", fontSize: compact ? 10.5 : 12, fontWeight: 700, color: "var(--text-muted)" } }, status === "loading" ? "Loading DB inventory..." : "No DB inventory yet"))));
  }
  function MobileDealerSite({ theme }) {
    var _a, _b, _c;
    const ac = theme.accent, on = theme.onAccent;
    const { vehicles: tiles, status } = window.useMarketplacePreviewVehicles(3);
    const premiumHero = (_a = window.dspPremiumHeroImageFor) == null ? void 0 : _a.call(window, theme.key);
    const featuredImage = (premiumHero == null ? void 0 : premiumHero.image) || ((_b = tiles[0]) == null ? void 0 : _b.image) || theme.hero;
    const featuredAlt = (premiumHero == null ? void 0 : premiumHero.label) || ((_c = tiles[0]) == null ? void 0 : _c.name) || "Featured first-hand vehicle";
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream-50)", height: "100%", display: "flex", flexDirection: "column", fontFamily: "var(--font-body)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 20px 4px", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-strong)" } }, /* @__PURE__ */ React.createElement("span", null, "9:41"), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement("svg", { width: "15", height: "11", viewBox: "0 0 18 12", fill: "currentColor" }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "7", width: "3", height: "5", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "5", y: "4", width: "3", height: "8", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "10", y: "1.5", width: "3", height: "10.5", rx: "1", opacity: "0.4" })), /* @__PURE__ */ React.createElement("svg", { width: "15", height: "11", viewBox: "0 0 16 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4" }, /* @__PURE__ */ React.createElement("path", { d: "M1 4.5C4.5 1.5 11.5 1.5 15 4.5M3.2 7C5.5 5 10.5 5 12.8 7M6 9.4c1-.9 3-.9 4 0", strokeLinecap: "round" })), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 16, height: 8, border: "1.2px solid currentColor", borderRadius: 2, display: "inline-flex", padding: 1 } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, background: "currentColor", borderRadius: 1 } }))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(DealerEmblem, { theme, size: 26 }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, letterSpacing: "-0.02em", color: "var(--text-strong)", whiteSpace: "nowrap" } }, theme.name)), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", color: "var(--text-strong)" } }, /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M3 6h18M3 12h18M3 18h18" })))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 14, padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", borderRadius: 18, overflow: "hidden", height: 168, flex: "none", boxShadow: "var(--shadow-md)" } }, /* @__PURE__ */ React.createElement("img", { src: featuredImage, alt: featuredAlt, style: { width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,14,18,0.86) 8%, rgba(11,14,18,0.15) 60%, transparent)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 14, right: 14, bottom: 13 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,253,247,0.75)", marginBottom: 5 } }, "Featured this week"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--cream-50)", whiteSpace: "pre-line", marginBottom: 9 } }, theme.tagline), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", padding: "6px 13px", borderRadius: "var(--radius-full)", background: "var(--cream-50)", color: "var(--ink-900)", fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap" } }, "Browse inventory"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 7, flex: "none" } }, ["All", "Cars", "Bikes", "EV"].map((c, i) => /* @__PURE__ */ React.createElement("span", { key: c, style: { padding: "6px 13px", borderRadius: "var(--radius-full)", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", background: i === 0 ? ac : "var(--cream-200)", color: i === 0 ? on : "var(--text-body)", border: i === 0 ? "none" : "1px solid var(--border-default)" } }, c))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 11 } }, tiles.map((v) => /* @__PURE__ */ React.createElement("div", { key: v.name, style: { display: "flex", gap: 11, padding: 9, borderRadius: 14, border: "1px solid var(--border-subtle)", background: "var(--cream-50)", boxShadow: "var(--shadow-xs)" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 78, height: 62, flex: "none", borderRadius: 10, overflow: "hidden", background: "var(--cream-300)" } }, /* @__PURE__ */ React.createElement("img", { src: v.image, alt: v.name, style: { width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", top: 5, left: 5, padding: "1px 6px", borderRadius: "var(--radius-full)", background: ac, color: on, fontSize: 7.5, fontWeight: 700 } }, v.tag)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 3 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12.5, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, v.name), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5 } }, v.specs.slice(0, 2).map((sp, si) => /* @__PURE__ */ React.createElement(React.Fragment, { key: sp }, si > 0 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "var(--text-faint)" } }, "\xB7"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 600, color: "var(--text-muted)" } }, sp)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "var(--text-strong)", whiteSpace: "nowrap" } }, v.price), /* @__PURE__ */ React.createElement("span", { style: { padding: "3px 9px", borderRadius: "var(--radius-full)", border: `1px solid ${ac}`, color: ac, fontSize: 9, fontWeight: 700 } }, "Enquire"))))), tiles.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 14, borderRadius: 14, border: "1px dashed var(--border-default)", background: "var(--cream-100)", textAlign: "center", fontSize: 11, fontWeight: 700, color: "var(--text-muted)" } }, status === "loading" ? "Loading DB inventory..." : "No DB inventory yet"))), /* @__PURE__ */ React.createElement("div", { style: { flex: "none", display: "flex", gap: 8, padding: "10px 14px 8px", borderTop: "1px solid var(--border-subtle)", background: "var(--cream-50)" } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: 36, borderRadius: "var(--radius-full)", background: ac, color: on, fontSize: 11.5, fontWeight: 700 } }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" })), "Call now"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: 36, borderRadius: "var(--radius-full)", background: "var(--cream-50)", border: `1px solid ${ac}`, color: ac, fontSize: 11.5, fontWeight: 700 } }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M4 20l1.4-4A8 8 0 1 1 8 18.6z" })), "WhatsApp")));
  }
  function DealerPreview({ device = "desktop", url, theme = DSP_THEMES.showroom, style = {} }) {
    if (device === "mobile") {
      return (
        // iPhone 17 Pro Max — titanium frame, thin uniform bezels, Dynamic Island
        /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 252, height: 540, ...style } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", left: -2.5, top: 96, width: 3, height: 26, borderRadius: 3, background: "linear-gradient(90deg, #1a1a1c, #48484a)" } }), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", left: -2.5, top: 138, width: 3, height: 40, borderRadius: 3, background: "linear-gradient(90deg, #1a1a1c, #48484a)" } }), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", left: -2.5, top: 186, width: 3, height: 40, borderRadius: 3, background: "linear-gradient(90deg, #1a1a1c, #48484a)" } }), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", right: -2.5, top: 120, width: 3, height: 34, borderRadius: 3, background: "linear-gradient(270deg, #1a1a1c, #48484a)" } }), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", right: -2.5, top: 172, width: 3, height: 64, borderRadius: 3, background: "linear-gradient(270deg, #1a1a1c, #48484a)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, borderRadius: 52, padding: 2.5, background: "linear-gradient(145deg, #6b6b6e 0%, #2c2c2e 22%, #1b1b1d 50%, #2c2c2e 78%, #5a5a5d 100%)", boxShadow: "var(--shadow-float)" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%", borderRadius: 49.5, padding: 9, background: "#050608" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%", borderRadius: 41, overflow: "hidden", background: "var(--cream-50)" } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 92, height: 27, borderRadius: "var(--radius-full)", background: "#050608", zIndex: 6, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 9, height: 9, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #2b3a52, #070b12 70%)", boxShadow: "inset 0 0 0 1px rgba(120,150,200,0.25)" } })), /* @__PURE__ */ React.createElement(MobileDealerSite, { theme }), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 100, height: 4, borderRadius: "var(--radius-full)", background: "var(--ink-900)", opacity: 0.26, zIndex: 6 } })))))
      );
    }
    return /* @__PURE__ */ React.createElement(BrowserChrome, { url: url || theme.url, style }, /* @__PURE__ */ React.createElement(DealerSiteContent, { theme }));
  }
  window.DealerPreview = DealerPreview;
  function Logo({ dark = false }) {
    const c = dark ? "var(--cream-50)" : "var(--text-strong)";
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 34, height: 34, borderRadius: 10, background: dark ? "var(--cream-50)" : "var(--ink-900)", color: dark ? "var(--ink-900)" : "var(--cream-50)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 18, letterSpacing: "-0.04em" } }, "D"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.025em", color: c } }, "DealerSite", /* @__PURE__ */ React.createElement("span", { style: { color: dark ? "var(--bronze-400)" : "var(--accent)" } }, " Pro")));
  }
  const VEHICLE_MARKET_BRANDS = [
    ["Maruti Suzuki", "/data/brand-logos/maruti-suzuki.png", "4w"],
    ["Hyundai", "/data/brand-logos/hyundai.png", "4w"],
    ["Tata Motors", "/data/brand-logos/tata-motors.png", "4w"],
    ["Kia", "/data/brand-logos/kia.png", "4w"],
    ["Mahindra", "/data/brand-logos/mahindra.png", "4w"],
    ["Toyota", "/data/brand-logos/toyota.png", "4w"],
    ["Honda", "/data/brand-logos/honda.png", "4w"],
    ["MG", "/data/brand-logos/mg.png", "4w"],
    ["Skoda", "/data/brand-logos/skoda.png", "4w"],
    ["Volkswagen", "/data/brand-logos/volkswagen.png", "4w"]
  ];
  const VEHICLE_MARKET_BODY_TYPES = [
    ["\u{1F697}", "Hatchback"],
    ["\u{1F698}", "Sedan"],
    ["\u{1F699}", "SUV"],
    ["\u{1F690}", "MPV"],
    ["\u{1F3CE}\uFE0F", "Coupe"],
    ["\u{1F324}\uFE0F", "Convertible"],
    ["\u{1F6FB}", "Pickup"]
  ];
  const VEHICLE_MARKET_BUDGETS = [
    ["Under 5 Lakh", "Under \u20B95L"],
    ["5 - 10 Lakh", "\u20B95-10L"],
    ["10 - 15 Lakh", "\u20B910-15L"],
    ["15 - 20 Lakh", "\u20B915-20L"],
    ["20 - 30 Lakh", "\u20B920-30L"],
    ["Above 30 Lakh", "\u20B930L+"]
  ];
  function emitVehicleFilter(kind, value, options = {}) {
    window.dispatchEvent(new CustomEvent("dsp-market-filter", { detail: { kind, value, ...options } }));
    if (options.scroll === false) return;
    scrollToMarketingSection("listing");
  }
  function emitBrandsDirectoryOpen(type = "4w") {
    window.dispatchEvent(new CustomEvent("dsp-market-brands-open", { detail: { type } }));
  }
  function scrollToMarketingSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const hash = `#${id}`;
    if (window.location.hash === hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.location.hash = id;
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const topOffset = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--dsp-topnav-height"), 10) || 90;
      const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - topOffset - 18);
      try {
        window.scrollTo({ top, behavior: "smooth" });
      } catch (e) {
        window.scrollTo(0, top);
      }
    }, 0);
  }
  function openOnboardingFlow() {
    window.top.location.href = "/onboarding";
  }
  function openPreviewPage() {
    scrollToMarketingSection("preview");
  }
  Object.assign(window, {
    scrollToMarketingSection,
    openOnboardingFlow,
    openPreviewPage
  });
  function VehicleMarketBrandLogo({ name, src }) {
    const [failed, setFailed] = React.useState(false);
    return /* @__PURE__ */ React.createElement("span", { className: "dsp-market-menu-logo" }, src && !failed ? /* @__PURE__ */ React.createElement("img", { src, alt: `${name} logo`, onError: () => setFailed(true) }) : /* @__PURE__ */ React.createElement("span", null, name.slice(0, 2).toUpperCase()));
  }
  function VehicleMarketMenuAction({ children, onClick, href = "#listing", icon }) {
    return /* @__PURE__ */ React.createElement(
      "a",
      {
        href,
        onClick: (event) => {
          if (onClick) {
            event.preventDefault();
            onClick();
          }
        },
        className: "dsp-market-menu-action"
      },
      icon ? /* @__PURE__ */ React.createElement("span", { className: "dsp-market-menu-emoji" }, icon) : null,
      children
    );
  }
  function VehicleMarketMegaMenu({ closeMenu }) {
    return /* @__PURE__ */ React.createElement("div", { className: "dsp-market-mega", onMouseLeave: closeMenu }, /* @__PURE__ */ React.createElement(window.Container, { wide: true }, /* @__PURE__ */ React.createElement("div", { className: "dsp-market-mega-grid" }, /* @__PURE__ */ React.createElement("section", { className: "dsp-market-mega-column" }, /* @__PURE__ */ React.createElement("h3", null, "Popular Brands"), /* @__PURE__ */ React.createElement("div", { className: "dsp-market-menu-list" }, VEHICLE_MARKET_BRANDS.map(([name, logo, category]) => /* @__PURE__ */ React.createElement(
      VehicleMarketMenuAction,
      {
        key: name,
        onClick: () => {
          closeMenu();
          emitVehicleFilter("brand", name);
        }
      },
      /* @__PURE__ */ React.createElement(VehicleMarketBrandLogo, { name, src: logo }),
      /* @__PURE__ */ React.createElement("span", null, name)
    )), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: "#all-brands",
        onClick: (event) => {
          event.preventDefault();
          closeMenu();
          emitBrandsDirectoryOpen("4w");
        },
        className: "dsp-market-menu-view-all"
      },
      "View All Brands ",
      /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 15 })
    ))), /* @__PURE__ */ React.createElement("section", { className: "dsp-market-mega-column" }, /* @__PURE__ */ React.createElement("h3", null, "By Body Type"), /* @__PURE__ */ React.createElement("div", { className: "dsp-market-menu-list" }, VEHICLE_MARKET_BODY_TYPES.map(([icon, label]) => /* @__PURE__ */ React.createElement(
      VehicleMarketMenuAction,
      {
        key: label,
        icon,
        onClick: () => {
          closeMenu();
          emitVehicleFilter("body", label);
        }
      },
      label
    )))), /* @__PURE__ */ React.createElement("section", { className: "dsp-market-mega-column" }, /* @__PURE__ */ React.createElement("h3", null, "By Budget"), /* @__PURE__ */ React.createElement("div", { className: "dsp-market-menu-list" }, VEHICLE_MARKET_BUDGETS.map(([label, value]) => /* @__PURE__ */ React.createElement(
      VehicleMarketMenuAction,
      {
        key: value,
        onClick: () => {
          closeMenu();
          emitVehicleFilter("budget", value);
        }
      },
      label
    )))), /* @__PURE__ */ React.createElement("section", { className: "dsp-market-mega-column" }, /* @__PURE__ */ React.createElement("h3", null, "Explore"), /* @__PURE__ */ React.createElement("div", { className: "dsp-market-menu-list" }, /* @__PURE__ */ React.createElement(VehicleMarketMenuAction, { icon: "\u2606", onClick: () => {
      closeMenu();
      emitVehicleFilter("type", "Cars");
    } }, "All Cars"), /* @__PURE__ */ React.createElement(VehicleMarketMenuAction, { icon: "\u{1F3CD}\uFE0F", onClick: () => {
      closeMenu();
      emitVehicleFilter("type", "Bikes");
    } }, "Bikes & Scooters"), /* @__PURE__ */ React.createElement(VehicleMarketMenuAction, { icon: "\u{1F6FA}", onClick: () => {
      closeMenu();
      emitVehicleFilter("type", "Autos");
    } }, "Autos & 3W"))))));
  }
  function VehicleMarketTopNav({ mode, setMode }) {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const closeMenu = () => setMenuOpen(false);
    const runTopNavAction = (action) => {
      closeMenu();
      action();
    };
    return /* @__PURE__ */ React.createElement("div", { className: "dsp-market-topnav-shell" }, /* @__PURE__ */ React.createElement(window.Container, { wide: true }, /* @__PURE__ */ React.createElement("nav", { className: "dsp-market-topnav" }, /* @__PURE__ */ React.createElement("a", { href: "#market-top", className: "dsp-market-topnav-brand", "aria-label": "DealerSite Pro marketplace home" }, /* @__PURE__ */ React.createElement(Logo, { dark: true })), /* @__PURE__ */ React.createElement("div", { className: "dsp-market-topnav-links" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "dsp-market-topnav-link dsp-market-topnav-pill",
        "aria-expanded": menuOpen,
        onClick: () => {
          emitVehicleFilter("type", "Cars", { scroll: false });
          setMenuOpen((current) => !current);
        },
        onMouseEnter: () => setMenuOpen(true)
      },
      "New Cars ",
      /* @__PURE__ */ React.createElement(window.Icons.chevronRight, { size: 15, style: { transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 160ms var(--ease-out)" } })
    ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "dsp-market-topnav-link", onClick: () => runTopNavAction(() => emitVehicleFilter("type", "Bikes")) }, /* @__PURE__ */ React.createElement(window.Icons.bike, { size: 17 }), " Bikes"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "dsp-market-topnav-link", onClick: () => runTopNavAction(() => emitVehicleFilter("type", "Autos")) }, /* @__PURE__ */ React.createElement(window.Icons.auto, { size: 17 }), " Autos"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "dsp-market-topnav-link", onClick: () => runTopNavAction(() => scrollToMarketingSection("brands")) }, "Brands"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "dsp-market-topnav-cta", onClick: () => {
      window.top.location.href = "/onboarding";
    } }, "Create My Website ", /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 16 }))))), menuOpen ? /* @__PURE__ */ React.createElement(VehicleMarketMegaMenu, { closeMenu }) : null);
  }
  function TopNav({ step, setStep, mode, setMode }) {
    const { Button } = window.DesignSystem_a49d67;
    const isVehicleMode = mode === "vehicles";
    if (isVehicleMode) return /* @__PURE__ */ React.createElement(VehicleMarketTopNav, { mode, setMode });
    const links = isVehicleMode ? [
      ["#listing", "Buy New"],
      ["#brands", "By Brand"],
      ["#budget", "By Budget"],
      ["#body", "Body Type"],
      ["#ev", "EV Zone"],
      ["#dealers", "Dealers"]
    ] : [
      ["#dealers", "Dealers"],
      ["#preview", "Preview"],
      ["#pricing", "Pricing"],
      ["#faq", "FAQ"]
    ];
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "dsp-topnav-shell",
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          background: isVehicleMode ? "rgba(248,250,252,0.9)" : "linear-gradient(180deg, rgba(11,14,18,0.96), rgba(11,14,18,0.88))",
          borderBottom: isVehicleMode ? "1px solid #e2e8f0" : "1px solid rgba(255,253,247,0.12)",
          boxShadow: isVehicleMode ? "0 12px 30px rgba(15,23,42,0.08)" : "0 16px 36px rgba(11,14,18,0.2)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)"
        }
      },
      /* @__PURE__ */ React.createElement(window.Container, { wide: true }, /* @__PURE__ */ React.createElement("nav", { className: "dsp-topnav", style: { minHeight: "var(--dsp-topnav-height)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, paddingTop: 14, paddingBottom: 14, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Logo, { dark: !isVehicleMode }), /* @__PURE__ */ React.createElement("div", { className: "dsp-topnav-actions", style: { display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { className: "dsp-topnav-links", style: { display: "flex", gap: 26, fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, color: isVehicleMode ? "var(--vrf-muted)" : "var(--text-on-dark-muted)" } }, links.map(([href, label], index) => {
        const targetId = href.startsWith("#") ? href.slice(1) : "";
        return /* @__PURE__ */ React.createElement(
          "a",
          {
            key: href,
            href,
            onClick: (event) => {
              if (!targetId) return;
              event.preventDefault();
              window.history.replaceState(null, "", href);
              scrollToMarketingSection(targetId);
            },
            style: { textDecoration: "none", color: isVehicleMode && index === 0 ? "var(--vrf-foreground)" : "inherit" }
          },
          label
        );
      })), isVehicleMode ? /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => scrollToMarketingSection("dealers"), style: { display: "inline-flex", alignItems: "center", gap: 8, minHeight: 36, borderRadius: "var(--radius-full)", border: "1px solid var(--vrf-hairline)", background: "var(--vrf-surface)", color: "var(--vrf-foreground)", padding: "0 12px", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 900, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(window.Icons.mapPin, { size: 14, style: { color: "var(--vrf-brand)" } }), " Hyderabad") : null, /* @__PURE__ */ React.createElement(Button, { variant: isVehicleMode ? "primary" : "inverse", size: "sm", iconRight: /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 16 }), onClick: openOnboardingFlow }, "Create My Website"))))
    );
  }
  function FloatBubble({ style }) {
    var _a;
    const { Avatar } = window.DesignSystem_a49d67;
    const { vehicles } = window.useMarketplacePreviewVehicles(1);
    const vehicleLabel = ((_a = vehicles[0]) == null ? void 0 : _a.name) ? `${vehicles[0].name} \xB7 test drive` : "DB vehicle \xB7 test drive";
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 11, padding: "11px 15px 11px 11px", background: "var(--cream-50)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xl)", border: "1px solid var(--border-default)", ...style } }, /* @__PURE__ */ React.createElement("span", { style: { position: "relative", display: "inline-flex" } }, /* @__PURE__ */ React.createElement(Avatar, { name: "New Lead", size: 38 }), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", right: -1, bottom: -1, width: 12, height: 12, borderRadius: "50%", background: "var(--success)", border: "2px solid var(--cream-50)" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: "var(--text-strong)" } }, "New enquiry"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" } }, vehicleLabel)));
  }
  function DomainBadge({ style }) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", background: "var(--ink-900)", borderRadius: "var(--radius-full)", boxShadow: "var(--shadow-xl)", color: "var(--cream-50)", ...style } }, /* @__PURE__ */ React.createElement(window.Icons.globe, { size: 15, style: { color: "var(--bronze-400)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500 } }, "sharmamotors.in"), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--success)" } }, /* @__PURE__ */ React.createElement(window.Icons.check, { size: 13 }), " Live"));
  }
  function Hero({ step, setStep }) {
    const { Button, Badge, Avatar } = window.DesignSystem_a49d67;
    return /* @__PURE__ */ React.createElement(window.Container, { wide: true, style: { paddingBottom: 56 } }, /* @__PURE__ */ React.createElement(window.Reveal, { className: "dsp-hero-canvas", style: {
      background: "var(--surface-canvas)",
      borderRadius: "var(--radius-3xl)",
      padding: "clamp(28px, 4vw, 64px)",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 2px 0 rgba(255,255,255,0.5) inset"
    } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "absolute", top: -160, right: -120, width: 520, height: 520, background: "radial-gradient(circle, rgba(255,253,247,0.9), rgba(245,241,234,0) 70%)", pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { className: "dsp-hero-grid", style: { position: "relative", display: "grid", gridTemplateColumns: "1fr 1.04fr", gap: "clamp(32px, 4vw, 64px)", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 26 } }, /* @__PURE__ */ React.createElement(window.Reveal, { delay: 40 }, /* @__PURE__ */ React.createElement(Badge, { variant: "outline", size: "md" }, /* @__PURE__ */ React.createElement(window.Icons.spark, { size: 13, style: { color: "var(--accent)" } }), " V1 Dealer Launch Kit")), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 90 }, /* @__PURE__ */ React.createElement("h1", { style: { margin: 0, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2.8rem, 6vw, 4.75rem)", lineHeight: 0.98, letterSpacing: "-0.035em", color: "var(--text-strong)", textWrap: "balance" } }, "Launch a dealer website that ", /* @__PURE__ */ React.createElement("span", { style: { fontStyle: "italic", fontWeight: 800 } }, "sells."))), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 150 }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, maxWidth: 460, fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", lineHeight: 1.55, color: "var(--text-body)", textWrap: "pretty" } }, "Add your showroom, vehicles, brand style, and domain. DealerSite Pro turns it into a polished website for cars, bikes, and autos.")), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 210, style: { display: "flex", flexWrap: "wrap", gap: 12 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", iconRight: /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 18 }), onClick: openOnboardingFlow }, "Create My Website"), /* @__PURE__ */ React.createElement(Button, { variant: "secondary", size: "lg", iconLeft: /* @__PURE__ */ React.createElement(window.Icons.play, { size: 15 }), onClick: openPreviewPage }, "See Sample Site")), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 270, style: { display: "flex", alignItems: "center", gap: 18, marginTop: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center" } }, ["Rohit Sharma", "Priya Nair", "Amit Verma", "Sana Khan"].map((n, i) => /* @__PURE__ */ React.createElement("span", { key: n, style: { marginLeft: i === 0 ? 0 : -10, borderRadius: "50%", boxShadow: "0 0 0 2px var(--surface-canvas)" } }, /* @__PURE__ */ React.createElement(Avatar, { name: n, size: 32 })))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", gap: 2, color: "var(--accent)" } }, [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ React.createElement(window.Icons.star, { key: i, size: 14 }))), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--text-body)" } }, "Loved by ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--text-strong)" } }, "500+ dealers"), " across India")))), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 160, className: "dsp-hero-preview", style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: "8% -2% -6% 6%", background: "var(--ink-900)", borderRadius: "var(--radius-2xl)", opacity: 0.06, transform: "rotate(2deg)" }, "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "dsp-car-float" }, /* @__PURE__ */ React.createElement(window.DealerPreview, { device: "desktop", style: { position: "relative", transform: "perspective(1400px) rotateY(-7deg) rotateX(3deg)", transformOrigin: "center" } })), /* @__PURE__ */ React.createElement(FloatBubble, { style: { position: "absolute", left: -28, bottom: 38, zIndex: 3 } }), /* @__PURE__ */ React.createElement(DomainBadge, { style: { position: "absolute", right: -18, top: -16, zIndex: 3 } })))));
  }
  function Header({ step, setStep, mode = "builder", setMode = () => {
  } }) {
    const isVehicleMode = mode === "vehicles";
    return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", background: isVehicleMode ? "var(--vrf-bg)" : "var(--surface-stage)", paddingTop: "var(--dsp-topnav-height)", paddingBottom: isVehicleMode ? 0 : 4, overflow: "hidden" } }, !isVehicleMode && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "linear-gradient(rgba(255,253,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,253,247,0.05) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
      maskImage: "radial-gradient(120% 80% at 50% 0%, #000 40%, transparent 78%)",
      WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000 40%, transparent 78%)",
      pointerEvents: "none"
    } }), !isVehicleMode && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "absolute", top: -180, left: "12%", width: 620, height: 480, background: "radial-gradient(ellipse at center, rgba(199,154,91,0.22), transparent 68%)", pointerEvents: "none", filter: "blur(8px)" } }), !isVehicleMode && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "absolute", top: -120, right: "6%", width: 520, height: 460, background: "radial-gradient(ellipse at center, rgba(110,124,160,0.18), transparent 70%)", pointerEvents: "none", filter: "blur(8px)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(TopNav, { step, setStep, mode, setMode }), mode === "builder" && /* @__PURE__ */ React.createElement(Hero, { step, setStep })));
  }
  window.Header = Header;
  function CountUp({ to, prefix = "", suffix = "", dur = 1400 }) {
    const ref = React.useRef(null);
    const [val, setVal] = React.useState(0);
    React.useEffect(() => {
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setVal(to);
        return;
      }
      const el = ref.current;
      if (!el) return;
      let raf, started = false;
      const run = (t0) => {
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
          else setVal(to);
        };
        raf = requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            run(performance.now());
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      io.observe(el);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
      };
    }, [to]);
    const display = Number.isInteger(to) ? Math.round(val).toLocaleString("en-IN") : val.toFixed(1);
    return /* @__PURE__ */ React.createElement("span", { ref }, prefix, display, suffix);
  }
  function StatsBand() {
    const stats = [
      { node: /* @__PURE__ */ React.createElement(CountUp, { to: 500, suffix: "+" }), label: "Dealers onboarded", sub: "across 12 Indian cities" },
      { node: /* @__PURE__ */ React.createElement(CountUp, { to: 2400, suffix: "+" }), label: "Enquiries captured", sub: "every single month" },
      { node: /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(CountUp, { to: 48 }), "hrs"), label: "Average time to live", sub: "from first sign-up" },
      { node: /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(CountUp, { to: 4.8 }), "/5"), label: "Dealer satisfaction", sub: "from 320+ reviews" }
    ];
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--surface-stage)", paddingBottom: "var(--section-y)" } }, /* @__PURE__ */ React.createElement(window.Container, { wide: true }, /* @__PURE__ */ React.createElement(window.Reveal, { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--border-inverse)", borderBottom: "1px solid var(--border-inverse)" }, className: "dsp-stats-band" }, stats.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: s.label, className: "dsp-stat-cell", style: { padding: "40px clamp(16px, 3vw, 40px)", borderLeft: i === 0 ? "none" : "1px solid var(--border-inverse)", display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 3.25rem)", letterSpacing: "-0.04em", lineHeight: 1, color: "var(--cream-50)" } }, s.node), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "var(--text-base)", color: "var(--cream-50)", marginTop: 6 } }, s.label), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-on-dark-muted)" } }, s.sub))))));
  }
  function BrandStrip() {
    const brands = ["MARUTI SUZUKI", "HYUNDAI", "TATA MOTORS", "MAHINDRA", "HONDA", "TOYOTA", "ROYAL ENFIELD", "KIA", "TVS", "ASHOK LEYLAND"];
    const Row = ({ ariaHidden }) => /* @__PURE__ */ React.createElement("div", { "aria-hidden": ariaHidden, style: { display: "flex", alignItems: "center", gap: "clamp(36px, 6vw, 72px)", paddingRight: "clamp(36px, 6vw, 72px)", flex: "none" } }, brands.map((b) => /* @__PURE__ */ React.createElement("span", { key: b, style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "0.04em", color: "var(--stone-400)", whiteSpace: "nowrap", flex: "none" } }, b)));
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--surface-page)", borderBottom: "1px solid var(--border-default)", padding: "40px 0" } }, /* @__PURE__ */ React.createElement(window.Container, { wide: true }, /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 26px", textAlign: "center", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" } }, "Every brand on your floor \u2014 one website")), /* @__PURE__ */ React.createElement("div", { className: "dsp-marquee", style: {
      position: "relative",
      overflow: "hidden",
      display: "flex",
      maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)"
    } }, /* @__PURE__ */ React.createElement("div", { className: "dsp-marquee-track", style: { display: "flex" } }, /* @__PURE__ */ React.createElement(Row, null), /* @__PURE__ */ React.createElement(Row, { ariaHidden: true }))));
  }
  Object.assign(window, { CountUp, StatsBand, BrandStrip });
  function SearchDiscover() {
    const { vehicles, status } = window.useMarketplacePreviewVehicles(1);
    const [mockMessage, setMockMessage] = React.useState("");
    const v = vehicles[0];
    const showMockAction = (action) => {
      setMockMessage(`${action} is mocked in this preview. No page change was made.`);
    };
    const filters = v ? [v.price, v.fuel, v.transmission, v.year, v.body].filter(Boolean).slice(0, 5) : [status === "loading" ? "Loading DB vehicles" : "No DB vehicles yet"];
    const specs = v ? [
      { icon: "gauge", label: "Year", value: v.year },
      { icon: "fuel", label: "Fuel", value: v.fuel },
      { icon: "car", label: "Transmission", value: v.transmission },
      { icon: "testdrive", label: "Driven", value: v.driven }
    ].filter((item) => item.value) : [];
    const searchLabel = v ? v.name : "Search live DB vehicles";
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "page", id: "search" }, /* @__PURE__ */ React.createElement(window.Container, null, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        eyebrow: "Search & discover",
        title: "Buyers find the right vehicle in seconds.",
        sub: "Every site comes with smart search and filters \u2014 visitors look up any vehicle and see full specs, photos, and price before they enquire."
      }
    ), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 100, style: { marginTop: 56, maxWidth: 940, marginLeft: "auto", marginRight: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-lg)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "clamp(18px, 2.4vw, 26px)", borderBottom: "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, height: 54, padding: "0 18px", background: "var(--cream-100)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-full)" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)", flex: "none" } }, /* @__PURE__ */ React.createElement(window.Icons.search, { size: 20 })), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", color: "var(--text-strong)", fontWeight: 500 } }, searchLabel, /* @__PURE__ */ React.createElement("span", { className: "dsp-caret", style: { display: "inline-block", width: 2, height: 20, background: "var(--ink-900)", marginLeft: 2, transform: "translateY(3px)" } })), /* @__PURE__ */ React.createElement("span", { style: { flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", height: 38, padding: "0 18px", borderRadius: "var(--radius-full)", background: "var(--ink-900)", color: "var(--cream-50)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700 } }, "Search")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 } }, filters.map((f, i) => /* @__PURE__ */ React.createElement("span", { key: f, style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: "var(--radius-full)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 600, background: i < 2 ? "var(--ink-900)" : "var(--cream-200)", color: i < 2 ? "var(--cream-50)" : "var(--text-body)", border: i < 2 ? "none" : "1px solid var(--border-default)" } }, i < 2 && /* @__PURE__ */ React.createElement(window.Icons.check, { size: 13 }), f)))), v ? /* @__PURE__ */ React.createElement("div", { className: "dsp-search-result", style: { display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", minHeight: 230, background: "var(--cream-300)" } }, /* @__PURE__ */ React.createElement("img", { src: v.image, alt: v.name, style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", top: 14, left: 14, padding: "4px 11px", borderRadius: "var(--radius-full)", background: "var(--ink-900)", color: "var(--cream-50)", fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 700 } }, "1 DB match \xB7 ", v.tag)), /* @__PURE__ */ React.createElement("div", { style: { padding: "clamp(22px, 2.6vw, 32px)", display: "flex", flexDirection: "column", gap: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { margin: "0 0 4px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", letterSpacing: "-0.025em", color: "var(--text-strong)", lineHeight: 1.1 } }, v.name), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-muted)", fontWeight: 600 } }, [v.fuel, v.transmission, v.body].filter(Boolean).join(" \xB7 "))), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "var(--text-2xl)", letterSpacing: "-0.03em", color: "var(--text-strong)", whiteSpace: "nowrap" } }, v.price)), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 } }, specs.map((s) => {
      const Icon = window.Icons[s.icon];
      return /* @__PURE__ */ React.createElement("div", { key: s.label, style: { display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", background: "var(--cream-100)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)", flex: "none" } }, /* @__PURE__ */ React.createElement(Icon, { size: 18 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)" } }, s.label), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text-strong)" } }, s.value)));
    })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 2 } }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => showMockAction("Vehicle details"), style: { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, height: 44, border: 0, borderRadius: "var(--radius-md)", background: "var(--ink-900)", color: "var(--cream-50)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700, cursor: "pointer" } }, "View full details"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => showMockAction("Enquiry"), style: { flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, height: 44, padding: "0 18px", borderRadius: "var(--radius-md)", background: "var(--surface-card)", border: "1px solid var(--border-default)", color: "var(--text-strong)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(window.Icons.whatsapp, { size: 16 }), " Enquire")), mockMessage && /* @__PURE__ */ React.createElement("div", { role: "status", style: { marginTop: -6, border: "1px solid rgb(46 125 80 / 0.22)", borderRadius: "var(--radius-md)", background: "rgb(46 125 80 / 0.08)", color: "var(--success)", padding: "9px 12px", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 750 } }, mockMessage))) : /* @__PURE__ */ React.createElement("div", { style: { padding: 34, textAlign: "center", borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 700 } }, status === "loading" ? "Loading a vehicle result from the database..." : "No database vehicle is available for this search preview yet.")))));
  }
  window.SearchDiscover = SearchDiscover;
  function IconTile({ name, dark = false, size = 48 }) {
    const Icon = window.Icons[name];
    return /* @__PURE__ */ React.createElement("span", { style: {
      width: size,
      height: size,
      flex: "none",
      borderRadius: "var(--radius-md)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: dark ? "rgba(255,253,247,0.06)" : "var(--cream-200)",
      border: `1px solid ${dark ? "var(--border-inverse)" : "var(--border-default)"}`,
      color: dark ? "var(--cream-50)" : "var(--ink-900)"
    } }, /* @__PURE__ */ React.createElement(Icon, { size: Math.round(size * 0.5) }));
  }
  function Categories() {
    const { Card } = window.DesignSystem_a49d67;
    const D = window.DSP_DATA;
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "page", id: "dealers" }, /* @__PURE__ */ React.createElement(window.Container, null, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        eyebrow: "Built for every dealer",
        title: "One platform. Every kind of showroom.",
        sub: "Cars, bikes, EVs, autos \u2014 DealerSite Pro adapts to what you sell with layouts tuned for each category."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "dsp-cat-grid", style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 56 } }, D.categories.map((c, i) => /* @__PURE__ */ React.createElement(window.Reveal, { key: c.name, delay: i * 70 }, /* @__PURE__ */ React.createElement(Card, { tone: "card", interactive: true, padding: "lg", radius: "lg", style: { height: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(IconTile, { name: c.icon }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { margin: "0 0 6px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-xl)", letterSpacing: "-0.02em", color: "var(--text-strong)" } }, c.name), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-base)", lineHeight: 1.5, color: "var(--text-body)" } }, c.blurb)))))))));
  }
  function HowItWorks() {
    const D = window.DSP_DATA;
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "canvas", id: "how" }, /* @__PURE__ */ React.createElement(window.Container, null, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        eyebrow: "How it works",
        title: "From showroom to website in five steps.",
        sub: "A guided setup wizard takes you from sign-up to a published, lead-ready website."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "dsp-steps", style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18, marginTop: 60, position: "relative" } }, D.steps.map((s, i) => /* @__PURE__ */ React.createElement(window.Reveal, { key: s.title, delay: i * 80, style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 44, height: 44, flex: "none", borderRadius: "50%", background: "var(--ink-900)", color: "var(--cream-50)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18 } }, i + 1), i < D.steps.length - 1 && /* @__PURE__ */ React.createElement("span", { className: "dsp-step-line", style: { flex: 1, height: 2, background: "var(--border-default)", borderRadius: 2 } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { margin: "0 0 6px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-lg)", letterSpacing: "-0.02em", color: "var(--text-strong)" } }, s.title), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-body)" } }, s.blurb))))))));
  }
  function Showcase() {
    const { Button } = window.DesignSystem_a49d67;
    const themes = window.DSP_THEMES;
    const order = ["showroom", "bronze", "electric"];
    const [active, setActive] = React.useState("showroom");
    const theme = themes[active];
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "stage", id: "preview" }, /* @__PURE__ */ React.createElement(window.Container, { wide: true }, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        dark: true,
        eyebrow: "See it live",
        title: "Change the style. Watch it transform.",
        sub: "Pick a look and DealerSite Pro re-skins the whole site instantly \u2014 colours, branding, and layout. This is the real preview, updating live."
      }
    ), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 80, style: { display: "flex", justifyContent: "center", marginTop: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, padding: 6, borderRadius: "var(--radius-full)", background: "rgba(255,253,247,0.06)", border: "1px solid var(--border-inverse)" } }, order.map((k) => {
      const t = themes[k];
      const on = active === k;
      return /* @__PURE__ */ React.createElement("button", { key: k, onClick: () => setActive(k), style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        height: 42,
        padding: "0 18px",
        border: "none",
        borderRadius: "var(--radius-full)",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        fontWeight: 700,
        whiteSpace: "nowrap",
        background: on ? "var(--cream-50)" : "transparent",
        color: on ? "var(--ink-900)" : "var(--text-on-dark-muted)",
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
      } }, /* @__PURE__ */ React.createElement("span", { style: { width: 14, height: 14, borderRadius: "50%", background: t.accent, boxShadow: on ? "0 0 0 2px var(--cream-50), 0 0 0 3px " + t.accent : "0 0 0 2px rgba(255,253,247,0.25)", flex: "none" } }), t.label);
    }))), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 140, className: "dsp-showcase", style: { marginTop: 44, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "clamp(16px, 4vw, 56px)", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "absolute", inset: "6% 12% 0 12%", background: `radial-gradient(ellipse at center, ${theme.accent}33, transparent 70%)`, pointerEvents: "none", transition: "background var(--dur-slow) var(--ease-out)" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: "0 1 760px", maxWidth: 760, position: "relative", zIndex: 2 } }, /* @__PURE__ */ React.createElement(window.DealerPreview, { key: theme.key, device: "desktop", theme })), /* @__PURE__ */ React.createElement("div", { className: "dsp-showcase-mobile", style: { flex: "none", position: "relative", zIndex: 3, marginBottom: -8 } }, /* @__PURE__ */ React.createElement(window.DealerPreview, { key: theme.key, device: "mobile", theme }))), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 200, style: { display: "flex", justifyContent: "center", marginTop: 48 } }, /* @__PURE__ */ React.createElement(Button, { variant: "inverse", size: "lg", iconRight: /* @__PURE__ */ React.createElement(window.Icons.arrowUpRight, { size: 18 }), onClick: () => {
      var _a;
      return (_a = document.getElementById("preview")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
    } }, "See Sample Site"))));
  }
  Object.assign(window, { Categories, HowItWorks, Showcase, IconTile });
  function LeadChannel({ icon, name, blurb }) {
    const Icon = window.Icons[icon];
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, padding: "var(--space-5)", background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 42, height: 42, flex: "none", borderRadius: "var(--radius-md)", background: "var(--cream-200)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-900)" } }, /* @__PURE__ */ React.createElement(Icon, { size: 21 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-base)", color: "var(--text-strong)" } }, name), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: 2 } }, blurb)));
  }
  function LeadDashboard() {
    const { vehicles, status } = window.useMarketplacePreviewVehicles(3);
    const names = ["Priya Nair", "Amit Verma", "Sana Khan"];
    const actions = ["Test drive", "Enquiry", "Call back"];
    const channels = ["whatsapp", "enquiry", "phone"];
    const rows = vehicles.map((vehicle, index) => ({
      n: names[index] || "New buyer",
      v: `${vehicle.name} \xB7 ${actions[index] || "Enquiry"}`,
      t: ["2m", "14m", "1h"][index] || "now",
      c: channels[index] || "enquiry"
    }));
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--surface-dark)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border-inverse)", display: "flex", flexDirection: "column", gap: 16, height: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--cream-50)" } }, "Lead Dashboard"), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--success)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 7, height: 7, borderRadius: "50%", background: "var(--success)" } }), " Live")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, rows.map((r) => {
      const Icon = window.Icons[r.c];
      return /* @__PURE__ */ React.createElement("div", { key: r.n, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,253,247,0.04)", border: "1px solid var(--border-inverse)", borderRadius: "var(--radius-md)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 34, height: 34, flex: "none", borderRadius: "50%", background: "rgba(255,253,247,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bronze-400)" } }, /* @__PURE__ */ React.createElement(Icon, { size: 16 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: "var(--cream-50)" } }, r.n), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-on-dark-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, r.v)), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-on-dark-muted)" } }, r.t));
    }), rows.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 14px", background: "rgba(255,253,247,0.04)", border: "1px dashed var(--border-inverse)", borderRadius: "var(--radius-md)", color: "var(--text-on-dark-muted)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, textAlign: "center" } }, status === "loading" ? "Loading DB vehicle enquiries..." : "Vehicle enquiry rows will appear from DB inventory.")));
  }
  function Leads() {
    const D = window.DSP_DATA;
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "page", id: "leads" }, /* @__PURE__ */ React.createElement(window.Container, null, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        eyebrow: "Leads included",
        title: "Every website is built to convert.",
        sub: "Visitors turn into enquiries, calls, and test drives \u2014 all captured in one place."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "dsp-leads-grid", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 56, alignItems: "stretch" } }, /* @__PURE__ */ React.createElement(window.Reveal, null, /* @__PURE__ */ React.createElement(LeadDashboard, null)), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 90, style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } }, D.leads.slice(0, 4).map((l) => /* @__PURE__ */ React.createElement(LeadChannel, { key: l.name, ...l }))))));
  }
  function BrandDomain() {
    const { Input, Button } = window.DesignSystem_a49d67;
    const D = window.DSP_DATA;
    const swatches = ["#0B0E12", "#A8793A", "#2E8B5A", "#C7453E", "#1E5BFF"];
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "canvas", id: "brand" }, /* @__PURE__ */ React.createElement(window.Container, null, /* @__PURE__ */ React.createElement("div", { className: "dsp-brand-grid", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        align: "left",
        max: 520,
        eyebrow: "Brand & domain control",
        title: "Your brand. Your domain. Your site.",
        sub: "Make it unmistakably yours, then publish on a free subdomain or connect a domain you already own."
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14, marginTop: 32 } }, D.brandControls.map((b, i) => {
      const Icon = window.Icons[b.icon];
      return /* @__PURE__ */ React.createElement(window.Reveal, { key: b.name, delay: i * 60, style: { display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 38, height: 38, flex: "none", borderRadius: "var(--radius-md)", background: "var(--surface-card)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-900)" } }, /* @__PURE__ */ React.createElement(Icon, { size: 18 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "var(--text-base)", color: "var(--text-strong)" } }, b.name), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-muted)" } }, " \u2014 ", b.blurb)));
    }))), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 120 }, /* @__PURE__ */ React.createElement("div", { style: { background: "var(--surface-card)", borderRadius: "var(--radius-2xl)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-lg)", padding: "var(--space-8)", display: "flex", flexDirection: "column", gap: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: 56, padding: "0 6px", borderRadius: "var(--radius-lg)", background: "var(--cream-100)", border: "1px solid var(--border-default)" } }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/sharma-motors-emblem.png", alt: "Shrama Motors logo", style: { height: 34, width: "auto", display: "block" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--text-strong)", whiteSpace: "nowrap" } }, "Shrama Motors"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" } }, "Logo \xB7 uploaded"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 } }, "Brand colour"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12 } }, swatches.map((c, i) => /* @__PURE__ */ React.createElement("span", { key: c, style: { width: 38, height: 38, borderRadius: "var(--radius-md)", background: c, border: i === 1 ? "2px solid var(--ink-900)" : "1px solid var(--border-default)", boxShadow: i === 1 ? "0 0 0 3px var(--cream-50), 0 0 0 4px var(--ink-900)" : "none" } })))), /* @__PURE__ */ React.createElement(
      Input,
      {
        label: "Custom domain",
        defaultValue: "sharmamotors.in",
        iconLeft: /* @__PURE__ */ React.createElement(window.Icons.globe, { size: 16 }),
        trailing: /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--success)" } }, /* @__PURE__ */ React.createElement(window.Icons.check, { size: 14 }), " Verified")
      }
    ), /* @__PURE__ */ React.createElement(Button, { variant: "primary", fullWidth: true, iconRight: /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 17 }), onClick: () => {
      window.top.location.href = "/onboarding";
    } }, "Publish website"))))));
  }
  function Templates() {
    const D = window.DSP_DATA;
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "page", id: "templates" }, /* @__PURE__ */ React.createElement(window.Container, null, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        eyebrow: "Templates & styles",
        title: "Start from a style that fits your floor.",
        sub: "Five dealer-ready templates \u2014 pick one, apply your brand, and you're 90% there."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "dsp-tpl-grid", style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 20, marginTop: 56 } }, D.templates.map((t, i) => /* @__PURE__ */ React.createElement(window.Reveal, { key: t.name, delay: i * 60, className: i < 2 ? "dsp-tpl-lg" : "dsp-tpl-sm", style: { gridColumn: i < 2 ? "span 3" : "span 2" } }, /* @__PURE__ */ React.createElement("div", { className: "dsp-tpl-card", style: { position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)", aspectRatio: i < 2 ? "16/10" : "4/5", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("img", { src: t.image, alt: t.name, style: { width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,14,18,0.82), rgba(11,14,18,0.05) 55%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 16, right: 16, bottom: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--cream-50)", letterSpacing: "-0.02em", lineHeight: 1.1 } }, t.name), /* @__PURE__ */ React.createElement("span", { style: { flex: "none", padding: "3px 10px", borderRadius: "var(--radius-full)", background: "rgba(255,253,247,0.16)", backdropFilter: "blur(6px)", color: "var(--cream-50)", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700 } }, t.tag))))))));
  }
  function FinalCTA() {
    const { Button } = window.DesignSystem_a49d67;
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "page", style: { paddingBottom: "clamp(64px, 8vw, 112px)" } }, /* @__PURE__ */ React.createElement(window.Container, { wide: true }, /* @__PURE__ */ React.createElement(window.Reveal, { style: { position: "relative", overflow: "hidden", background: "var(--surface-stage)", borderRadius: "var(--radius-3xl)", padding: "clamp(48px, 7vw, 110px) clamp(28px, 5vw, 80px)", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "absolute", bottom: -180, left: "50%", transform: "translateX(-50%)", width: 720, height: 480, background: "radial-gradient(ellipse at center, rgba(199,154,91,0.22), transparent 70%)", pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 26 } }, /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, maxWidth: 880, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2.4rem, 5.5vw, 4.25rem)", lineHeight: 1.02, letterSpacing: "-0.035em", color: "var(--cream-50)", textWrap: "balance" } }, "Your dealership website can go live faster than you think."), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, maxWidth: 560, fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", lineHeight: 1.55, color: "var(--text-on-dark-muted)", textWrap: "pretty" } }, "Start with your showroom details, pick your vehicles, and publish a professional website built for leads."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 4 } }, /* @__PURE__ */ React.createElement(Button, { variant: "inverse", size: "lg", iconRight: /* @__PURE__ */ React.createElement(window.Icons.arrowRight, { size: 18 }), onClick: () => {
      window.top.location.href = "/onboarding";
    } }, "Create My Website"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "lg", style: { color: "var(--cream-50)" }, iconLeft: /* @__PURE__ */ React.createElement(window.Icons.play, { size: 15 }), onClick: () => {
      var _a;
      (_a = window.openPreviewPage) == null ? void 0 : _a.call(window);
    } }, "View Demo"))))));
  }
  function Footer() {
    const cols = [
      { h: "Product", links: ["Templates", "Pricing", "Sample sites", "Custom domains"] },
      { h: "Dealers", links: ["Cars", "Bikes & scooters", "EV dealers", "Used vehicles"] },
      { h: "Company", links: ["About", "Contact", "Support", "Careers"] }
    ];
    return /* @__PURE__ */ React.createElement("footer", { style: { background: "var(--surface-stage)", paddingTop: "var(--section-y)", paddingBottom: 40 } }, /* @__PURE__ */ React.createElement(window.Container, { wide: true }, /* @__PURE__ */ React.createElement("div", { className: "dsp-footer-grid", style: { display: "grid", gridTemplateColumns: "1.4fr repeat(3, 1fr)", gap: 40, paddingBottom: 48, borderBottom: "1px solid var(--border-inverse)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16, maxWidth: 280 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.025em", color: "var(--cream-50)" } }, "DealerSite", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--bronze-400)" } }, " Pro")), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55, color: "var(--text-on-dark-muted)" } }, "Professional dealership websites for cars, bikes, EVs, and autos \u2014 without code.")), cols.map((col) => /* @__PURE__ */ React.createElement("div", { key: col.h, style: { display: "flex", flexDirection: "column", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-on-dark-muted)" } }, col.h), col.links.map((l) => /* @__PURE__ */ React.createElement("a", { key: l, href: `#${l === "Pricing" ? "pricing" : l === "Templates" || l === "Sample sites" ? "templates" : l === "Custom domains" ? "brand" : l === "Contact" || l === "Support" ? "leads" : l === "Cars" || l === "Bikes & scooters" || l === "EV dealers" || l === "Used vehicles" ? "dealers" : "market-top"}`, style: { fontFamily: "var(--font-body)", fontSize: 14, color: "var(--cream-50)", textDecoration: "none", opacity: 0.78 } }, l))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 28 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-on-dark-muted)" } }, "\xA9 2026 DealerSite Pro. All rights reserved."), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-on-dark-muted)", display: "flex", gap: 20 } }, /* @__PURE__ */ React.createElement("a", { href: "/privacy", target: "_top", style: { color: "inherit", textDecoration: "none" } }, "Privacy"), /* @__PURE__ */ React.createElement("a", { href: "/terms", target: "_top", style: { color: "inherit", textDecoration: "none" } }, "Terms")))));
  }
  Object.assign(window, { Leads, BrandDomain, Templates, FinalCTA, Footer });
  const DSP_PRICING = [
    {
      name: "Starter",
      price: "\u20B90",
      period: "/forever",
      tagline: "Get online today on a free subdomain.",
      cta: "Start free",
      variant: "secondary",
      featured: false,
      features: ["1 dealer website", "Free yourname.dealersite.pro", "Up to 25 vehicles", "Enquiry & WhatsApp leads", "Mobile-ready templates"]
    },
    {
      name: "Pro",
      price: "\u20B9499",
      period: "/month",
      tagline: "Your own domain, SSL, DNS guidance, and lead tools.",
      cta: "Start Pro",
      variant: "accent",
      featured: true,
      badge: "Most popular",
      features: ["Everything in Starter", "Connect your own domain", "Free SSL certificate", "DNS setup guide", "Professional email setup support", "Lead dashboard + call tracking"]
    },
    {
      name: "Multi-Brand",
      price: "\u20B93,999",
      period: "/month",
      tagline: "For groups selling many brands & locations.",
      cta: "Talk to sales",
      variant: "secondary",
      featured: false,
      features: ["Everything in Pro", "Up to 5 showroom locations", "Per-brand layouts", "Team accounts & roles", "Priority support"]
    }
  ];
  const DSP_FAQ = [
    { q: "Do I need any technical skills?", a: "None at all. If you can fill a form, you can launch a DealerSite Pro website. The guided wizard takes you from sign-up to live in five steps." },
    { q: "Can I use my own domain?", a: "Yes. Start free on a yourname.dealersite.pro subdomain, then connect any .com or .in domain you own on the Pro plan \u2014 we walk you through it in minutes." },
    { q: "What kinds of vehicles does it support?", a: "Cars, bikes, scooters, EVs, autos, and three-wheelers. Layouts adapt to each category, and multi-brand dealers can show every brand on one site." },
    { q: "How do leads reach me?", a: "Every enquiry, call, WhatsApp message, and test-drive request lands in one lead dashboard \u2014 and pings you instantly so you never miss a buyer." },
    { q: "Can I change my plan later?", a: "Anytime. Upgrade, downgrade, or cancel from your dashboard with no lock-in. Your website and leads stay exactly where they are." }
  ];
  function PlanCard({ plan }) {
    const { Button } = window.DesignSystem_a49d67;
    const featured = plan.featured;
    const handleCta = () => {
      if (/talk to sales/i.test(plan.cta)) {
        window.top.location.href = "mailto:sales@dealersitepro.com?subject=DealerSite%20Pro%20sales";
        return;
      }
      window.top.location.href = "/onboarding";
    };
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 22,
      padding: featured ? "clamp(28px, 3vw, 40px)" : "clamp(24px, 3vw, 36px)",
      background: featured ? "var(--surface-stage)" : "var(--surface-card)",
      border: `1px solid ${featured ? "transparent" : "var(--border-default)"}`,
      borderRadius: "var(--radius-2xl)",
      boxShadow: featured ? "var(--shadow-xl)" : "var(--shadow-sm)",
      transform: featured ? "translateY(-10px)" : "none",
      overflow: "hidden",
      height: "100%"
    } }, featured && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "absolute", top: -110, right: -70, width: 300, height: 300, background: "radial-gradient(circle, rgba(199,154,91,0.22), transparent 68%)", pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-xl)", letterSpacing: "-0.02em", color: featured ? "var(--cream-50)" : "var(--text-strong)" } }, plan.name), plan.badge && /* @__PURE__ */ React.createElement("span", { style: { padding: "4px 11px", borderRadius: "var(--radius-full)", background: "var(--accent)", color: "var(--cream-50)", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.02em" } }, plan.badge)), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex", alignItems: "baseline", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2.4rem, 4vw, 3rem)", letterSpacing: "-0.04em", color: featured ? "var(--cream-50)" : "var(--text-strong)" } }, plan.price), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-base)", fontWeight: 600, color: featured ? "var(--text-on-dark-muted)" : "var(--text-muted)" } }, plan.period)), /* @__PURE__ */ React.createElement("p", { style: { position: "relative", margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.5, color: featured ? "var(--text-on-dark-muted)" : "var(--text-body)", minHeight: 40 } }, plan.tagline), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(Button, { variant: plan.variant, size: "lg", fullWidth: true, onClick: handleCta }, plan.cta)), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 1, background: featured ? "var(--border-inverse)" : "var(--border-subtle)" } }), /* @__PURE__ */ React.createElement("ul", { style: { position: "relative", listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 } }, plan.features.map((f) => /* @__PURE__ */ React.createElement("li", { key: f, style: { display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: featured ? "var(--cream-50)" : "var(--text-body)" } }, /* @__PURE__ */ React.createElement("span", { style: { flex: "none", marginTop: 1, color: featured ? "var(--bronze-400)" : "var(--success)" } }, /* @__PURE__ */ React.createElement(window.Icons.check, { size: 16 })), f))));
  }
  function Pricing() {
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "canvas", id: "pricing" }, /* @__PURE__ */ React.createElement(window.Container, null, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        eyebrow: "Simple pricing",
        title: "Start free. Upgrade when you sell more.",
        sub: "No setup fees, no lock-in. Every plan includes hosting, leads, and mobile-ready templates."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "dsp-price-grid", style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginTop: 60, alignItems: "stretch" } }, DSP_PRICING.map((p, i) => /* @__PURE__ */ React.createElement(window.Reveal, { key: p.name, delay: i * 90, style: { display: "flex" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%" } }, /* @__PURE__ */ React.createElement(PlanCard, { plan: p })))))));
  }
  function FaqRow({ item, open, onToggle }) {
    return /* @__PURE__ */ React.createElement("div", { style: { borderBottom: "1px solid var(--border-default)" } }, /* @__PURE__ */ React.createElement("button", { onClick: onToggle, style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "24px 4px",
      background: "none",
      border: "none",
      cursor: "pointer",
      textAlign: "left"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-lg)", letterSpacing: "-0.015em", color: "var(--text-strong)" } }, item.q), /* @__PURE__ */ React.createElement("span", { style: { flex: "none", width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-strong)", transition: "transform var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out)", transform: open ? "rotate(45deg)" : "none", background: open ? "var(--cream-200)" : "transparent" } }, /* @__PURE__ */ React.createElement("svg", { width: "15", height: "15", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M8 3v10M3 8h10" })))), /* @__PURE__ */ React.createElement("div", { style: { overflow: "hidden", maxHeight: open ? 220 : 0, transition: "max-height var(--dur-base) var(--ease-out)" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, padding: "0 48px 24px 4px", fontFamily: "var(--font-body)", fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-body)", textWrap: "pretty" } }, item.a)));
  }
  function Faq() {
    const [open, setOpen] = React.useState(0);
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "page", id: "faq" }, /* @__PURE__ */ React.createElement(window.Container, null, /* @__PURE__ */ React.createElement("div", { className: "dsp-faq-grid", style: { display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "start" } }, /* @__PURE__ */ React.createElement(window.Reveal, null, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        align: "left",
        max: 420,
        eyebrow: "Questions",
        title: "Everything you need to know.",
        sub: "Still unsure? Our team replies on WhatsApp within the hour."
      }
    )), /* @__PURE__ */ React.createElement(window.Reveal, { delay: 100 }, /* @__PURE__ */ React.createElement("div", null, DSP_FAQ.map((item, i) => /* @__PURE__ */ React.createElement(FaqRow, { key: item.q, item, open: open === i, onToggle: () => setOpen(open === i ? -1 : i) })))))));
  }
  Object.assign(window, { Pricing, Faq });
  const DSP_TESTIMONIALS = {
    featured: {
      quote: "We went from a Facebook page to a real website in one afternoon. Enquiries doubled in the first month \u2014 buyers finally take us seriously.",
      name: "Rohit Sharma",
      role: "Owner \xB7 Shrama Motors, Pune",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    cards: [
      { quote: "The WhatsApp and call buttons alone paid for it. Every lead lands in one dashboard.", name: "Priya Nair", role: "Apex Auto Gallery", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
      { quote: "I sell bikes and EVs both \u2014 the layouts just fit. Setup took a cup of chai.", name: "Amit Verma", role: "Volt Motors, Nagpur", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { quote: "Connected my own domain in minutes. Looks like an agency built it for lakhs.", name: "Sana Khan", role: "Khan Cars, Hyderabad", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" }
    ]
  };
  function QuoteMark({ color = "var(--accent)" }) {
    return /* @__PURE__ */ React.createElement("svg", { width: "40", height: "32", viewBox: "0 0 40 32", fill: color, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M0 32V18C0 8 5 1.5 15 0l1.6 5C10.8 6.4 8 9.7 7.7 14H15v18H0zm22 0V18C22 8 27 1.5 37 0l1.6 5C32.8 6.4 30 9.7 29.7 14H37v18H22z", opacity: "0.9" }));
  }
  function Testimonials() {
    const { Avatar, Card } = window.DesignSystem_a49d67;
    const T = DSP_TESTIMONIALS;
    return /* @__PURE__ */ React.createElement(window.Section, { tone: "page", id: "testimonials" }, /* @__PURE__ */ React.createElement(window.Container, null, /* @__PURE__ */ React.createElement(
      window.SectionHead,
      {
        eyebrow: "Loved by dealers",
        title: "Real showrooms. Real results.",
        sub: "Hundreds of dealers across India run their entire online presence on DealerSite Pro."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "dsp-testi-grid", style: { display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 24, marginTop: 56, alignItems: "stretch" } }, /* @__PURE__ */ React.createElement(window.Reveal, { style: { display: "flex" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", overflow: "hidden", background: "var(--surface-stage)", borderRadius: "var(--radius-2xl)", padding: "clamp(32px, 4vw, 52px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32, width: "100%", boxShadow: "var(--shadow-lg)" } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "absolute", top: -120, right: -80, width: 360, height: 360, background: "radial-gradient(circle, rgba(199,154,91,0.18), transparent 68%)", pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex", flexDirection: "column", gap: 24 } }, /* @__PURE__ */ React.createElement(QuoteMark, { color: "var(--bronze-400)" }), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", lineHeight: 1.25, letterSpacing: "-0.02em", color: "var(--cream-50)", textWrap: "pretty" } }, "\u201C", T.featured.quote, "\u201D")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement(Avatar, { src: T.featured.avatar, name: T.featured.name, size: 52 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--cream-50)" } }, T.featured.name), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-on-dark-muted)" } }, T.featured.role))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, T.cards.map((c, i) => /* @__PURE__ */ React.createElement(window.Reveal, { key: c.name, delay: i * 80, style: { display: "flex" } }, /* @__PURE__ */ React.createElement(Card, { tone: "card", padding: "lg", radius: "lg", style: { width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", gap: 2, color: "var(--accent)" } }, [0, 1, 2, 3, 4].map((s) => /* @__PURE__ */ React.createElement(window.Icons.star, { key: s, size: 14 }))), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-base)", lineHeight: 1.55, color: "var(--text-body)", textWrap: "pretty" } }, "\u201C", c.quote, "\u201D"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 2 } }, /* @__PURE__ */ React.createElement(Avatar, { src: c.avatar, name: c.name, size: 40 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-base)", color: "var(--text-strong)" } }, c.name), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-muted)" } }, c.role)))))))))));
  }
  Object.assign(window, { Testimonials });
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
    const normalizedPath = value.split("?")[0].replace(/\.(?:avif|webp|png|jpe?g)$/i, "");
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
    ].some((token) => value.includes(token) || normalizedPath.includes(token));
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
