// DealerSite Pro — line icon set (Lucide-style: 24px, stroke 1.75, round).
// No brand icon assets were supplied; this is a consistent custom line set
// matching premium editorial styling. Swap for a licensed set if available.
const Svg = ({ size = 24, children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

const Icons = {
  car: (p) => <Svg {...p}><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><path d="M3 16v-2a2 2 0 0 1 1-1.7L5 11h14l1 .3A2 2 0 0 1 21 14v2"/><path d="M4 16h16v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="13.5" r=".6" fill="currentColor"/><circle cx="16.5" cy="13.5" r=".6" fill="currentColor"/></Svg>,
  bike: (p) => <Svg {...p}><circle cx="5.5" cy="17" r="3.2"/><circle cx="18.5" cy="17" r="3.2"/><path d="M8.5 17l3.2-6h4.3"/><path d="M11.7 11L9 7H6.8"/><path d="M16 11l2.5 6"/><path d="M14 7h3l-1 2"/></Svg>,
  ev: (p) => <Svg {...p}><path d="M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z"/></Svg>,
  auto: (p) => <Svg {...p}><path d="M3 7h10v8H3z"/><path d="M13 10h4l3 3v2h-7z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M3 7V5h10v2"/></Svg>,
  used: (p) => <Svg {...p}><path d="M3 9l9-6 9 6v10a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z"/><path d="M9.5 13.5l1.5 1.5 3-3"/></Svg>,
  brands: (p) => <Svg {...p}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 3v18"/><path d="M4 7.5l8 4.5 8-4.5"/></Svg>,
  enquiry: (p) => <Svg {...p}><path d="M4 5h16v11H8l-4 3z"/><path d="M8 9h8M8 12h5"/></Svg>,
  phone: (p) => <Svg {...p}><path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></Svg>,
  whatsapp: (p) => <Svg {...p}><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z"/><path d="M9 10c0 3 2 5 5 5l.8-1.6-2-.9-.8.9a4 4 0 0 1-2-2l.9-.8-.9-2z"/></Svg>,
  testdrive: (p) => <Svg {...p}><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><path d="M12 5.5v2M12 16.5v2M5.5 12h2M16.5 12h2"/><path d="M13.2 10.8l3-2.3"/></Svg>,
  dashboard: (p) => <Svg {...p}><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></Svg>,
  palette: (p) => <Svg {...p}><path d="M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3z"/><circle cx="7.5" cy="11" r="1" fill="currentColor"/><circle cx="10" cy="7.5" r="1" fill="currentColor"/><circle cx="14.5" cy="7.5" r="1" fill="currentColor"/></Svg>,
  swatch: (p) => <Svg {...p}><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></Svg>,
  globe: (p) => <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></Svg>,
  link: (p) => <Svg {...p}><path d="M9 15l6-6"/><path d="M10.5 6.5l1.5-1.5a4 4 0 0 1 5.5 5.5L15 12"/><path d="M13.5 17.5L12 19a4 4 0 0 1-5.5-5.5L9 11"/></Svg>,
  template: (p) => <Svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></Svg>,
  logo: (p) => <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9 8.5h2.5a3.5 3.5 0 0 1 0 7H9z"/><path d="M9 8.5v7"/></Svg>,
  check: (p) => <Svg {...p}><path d="M20 6L9 17l-5-5"/></Svg>,
  arrowRight: (p) => <Svg {...p}><path d="M4 12h15M13 6l6 6-6 6"/></Svg>,
  arrowUpRight: (p) => <Svg {...p}><path d="M7 17L17 7M8 7h9v9"/></Svg>,
  chevronRight: (p) => <Svg {...p}><path d="M9 6l6 6-6 6"/></Svg>,
  star: (p) => <Svg {...p}><path d="M12 3l2.6 5.6L20.5 9.4l-4.3 4.1 1 6L12 16.8 6.8 19.5l1-6-4.3-4.1 5.9-.8z" fill="currentColor" stroke="none"/></Svg>,
  spark: (p) => <Svg {...p}><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" fill="currentColor" stroke="none"/></Svg>,
  play: (p) => <Svg {...p}><path d="M7 5l11 7-11 7z" fill="currentColor" stroke="none"/></Svg>,
  menu: (p) => <Svg {...p}><path d="M3 6h18M3 12h18M3 18h18"/></Svg>,
  mapPin: (p) => <Svg {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></Svg>,
  fuel: (p) => <Svg {...p}><rect x="4" y="3" width="9" height="18" rx="1.5"/><path d="M13 8h3l2 2v7a1.5 1.5 0 0 1-3 0v-4h-2"/><path d="M4 11h9"/></Svg>,
  gauge: (p) => <Svg {...p}><path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-4"/><circle cx="12" cy="16" r="1.2" fill="currentColor"/></Svg>,
  search: (p) => <Svg {...p}><circle cx="11" cy="11" r="7"/><path d="M16 16l4.5 4.5"/></Svg>,
};

window.Icons = Icons;
