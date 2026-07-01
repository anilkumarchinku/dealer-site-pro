// DealerSite Pro — top navigation + hero (the most important section).
function Logo({ dark = false }) {
  const c = dark ? 'var(--cream-50)' : 'var(--text-strong)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, background: dark ? 'var(--cream-50)' : 'var(--ink-900)', color: dark ? 'var(--ink-900)' : 'var(--cream-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em' }}>D</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.025em', color: c }}>DealerSite<span style={{ color: dark ? 'var(--bronze-400)' : 'var(--accent)' }}> Pro</span></span>
    </div>
  );
}

const VEHICLE_MARKET_BRANDS = [
  ['Maruti Suzuki', '/data/brand-logos/maruti-suzuki.png', '4w'],
  ['Hyundai', '/data/brand-logos/hyundai.png', '4w'],
  ['Tata Motors', '/data/brand-logos/tata-motors.png', '4w'],
  ['Kia', '/data/brand-logos/kia.png', '4w'],
  ['Mahindra', '/data/brand-logos/mahindra.png', '4w'],
  ['Toyota', '/data/brand-logos/toyota.png', '4w'],
  ['Honda', '/data/brand-logos/honda.png', '4w'],
  ['MG', '/data/brand-logos/mg.png', '4w'],
  ['Skoda', '/data/brand-logos/skoda.png', '4w'],
  ['Volkswagen', '/data/brand-logos/volkswagen.png', '4w'],
];

const VEHICLE_MARKET_BODY_TYPES = [
  ['🚗', 'Hatchback'],
  ['🚘', 'Sedan'],
  ['🚙', 'SUV'],
  ['🚐', 'MPV'],
  ['🏎️', 'Coupe'],
  ['🌤️', 'Convertible'],
  ['🛻', 'Pickup'],
];

const VEHICLE_MARKET_BUDGETS = [
  ['Under 5 Lakh', 'Under ₹5L'],
  ['5 - 10 Lakh', '₹5-10L'],
  ['10 - 15 Lakh', '₹10-15L'],
  ['15 - 20 Lakh', '₹15-20L'],
  ['20 - 30 Lakh', '₹20-30L'],
  ['Above 30 Lakh', '₹30L+'],
];

function emitVehicleFilter(kind, value, options = {}) {
  window.dispatchEvent(new CustomEvent('dsp-market-filter', { detail: { kind, value, ...options } }));
  if (options.scroll === false) return;
  scrollToMarketingSection('listing');
}

function emitBrandsDirectoryOpen(type = '4w') {
  window.dispatchEvent(new CustomEvent('dsp-market-brands-open', { detail: { type } }));
}

function scrollToMarketingSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const hash = `#${id}`;
  if (window.location.hash === hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.location.hash = id;
  window.setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const topOffset = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dsp-topnav-height'), 10) || 90;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - topOffset - 18);
    try {
      window.scrollTo({ top, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, top);
    }
  }, 0);
}

function openOnboardingFlow() {
  window.top.location.href = '/onboarding';
}

function openPreviewPage() {
  scrollToMarketingSection('preview');
}

Object.assign(window, {
  scrollToMarketingSection,
  openOnboardingFlow,
  openPreviewPage,
});

function VehicleMarketBrandLogo({ name, src }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <span className="dsp-market-menu-logo">
      {src && !failed ? (
        <img src={src} alt={`${name} logo`} onError={() => setFailed(true)} />
      ) : (
        <span>{name.slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}

function VehicleMarketMenuAction({ children, onClick, href = '#listing', icon }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        if (onClick) {
          event.preventDefault();
          onClick();
        }
      }}
      className="dsp-market-menu-action"
    >
      {icon ? <span className="dsp-market-menu-emoji">{icon}</span> : null}
      {children}
    </a>
  );
}

function VehicleMarketMegaMenu({ closeMenu }) {
  return (
    <div className="dsp-market-mega" onMouseLeave={closeMenu}>
      <window.Container wide>
        <div className="dsp-market-mega-grid">
          <section className="dsp-market-mega-column">
            <h3>Popular Brands</h3>
            <div className="dsp-market-menu-list">
              {VEHICLE_MARKET_BRANDS.map(([name, logo, category]) => (
                <VehicleMarketMenuAction
                  key={name}
                  onClick={() => {
                    closeMenu();
                    emitVehicleFilter('brand', name);
                  }}
                >
                  <VehicleMarketBrandLogo name={name} src={logo} />
                  <span>{name}</span>
                </VehicleMarketMenuAction>
              ))}
              <a
                href="#all-brands"
                onClick={(event) => {
                  event.preventDefault();
                  closeMenu();
                  emitBrandsDirectoryOpen('4w');
                }}
                className="dsp-market-menu-view-all"
              >
                View All Brands <window.Icons.arrowRight size={15} />
              </a>
            </div>
          </section>

          <section className="dsp-market-mega-column">
            <h3>By Body Type</h3>
            <div className="dsp-market-menu-list">
              {VEHICLE_MARKET_BODY_TYPES.map(([icon, label]) => (
                <VehicleMarketMenuAction
                  key={label}
                  icon={icon}
                  onClick={() => {
                    closeMenu();
                    emitVehicleFilter('body', label);
                  }}
                >
                  {label}
                </VehicleMarketMenuAction>
              ))}
            </div>
          </section>

          <section className="dsp-market-mega-column">
            <h3>By Budget</h3>
            <div className="dsp-market-menu-list">
              {VEHICLE_MARKET_BUDGETS.map(([label, value]) => (
                <VehicleMarketMenuAction
                  key={value}
                  onClick={() => {
                    closeMenu();
                    emitVehicleFilter('budget', value);
                  }}
                >
                  {label}
                </VehicleMarketMenuAction>
              ))}
            </div>
          </section>

          <section className="dsp-market-mega-column">
            <h3>Explore</h3>
            <div className="dsp-market-menu-list">
              <VehicleMarketMenuAction icon="☆" onClick={() => { closeMenu(); emitVehicleFilter('type', 'Cars'); }}>All Cars</VehicleMarketMenuAction>
              <VehicleMarketMenuAction icon="🏍️" onClick={() => { closeMenu(); emitVehicleFilter('type', 'Bikes'); }}>Bikes & Scooters</VehicleMarketMenuAction>
              <VehicleMarketMenuAction icon="🛺" onClick={() => { closeMenu(); emitVehicleFilter('type', 'Autos'); }}>Autos & 3W</VehicleMarketMenuAction>
            </div>
          </section>
        </div>
      </window.Container>
    </div>
  );
}

function VehicleMarketTopNav({ mode, setMode }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const closeMenu = () => setMenuOpen(false);
  const runTopNavAction = (action) => {
    closeMenu();
    action();
  };

  return (
    <div className="dsp-market-topnav-shell">
      <window.Container wide>
        <nav className="dsp-market-topnav">
          <a href="#market-top" className="dsp-market-topnav-brand" aria-label="DealerSite Pro marketplace home">
            <Logo dark />
          </a>

          <div className="dsp-market-topnav-links">
            <button
              type="button"
              className="dsp-market-topnav-link dsp-market-topnav-pill"
              aria-expanded={menuOpen}
              onClick={() => {
                emitVehicleFilter('type', 'Cars', { scroll: false });
                setMenuOpen((current) => !current);
              }}
              onMouseEnter={() => setMenuOpen(true)}
            >
              New Cars <window.Icons.chevronRight size={15} style={{ transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 160ms var(--ease-out)' }} />
            </button>
            <button type="button" className="dsp-market-topnav-link" onClick={() => runTopNavAction(() => emitVehicleFilter('type', 'Bikes'))}><window.Icons.bike size={17} /> Bikes</button>
            <button type="button" className="dsp-market-topnav-link" onClick={() => runTopNavAction(() => emitVehicleFilter('type', 'Autos'))}><window.Icons.auto size={17} /> Autos</button>
            <button type="button" className="dsp-market-topnav-link" onClick={() => runTopNavAction(() => scrollToMarketingSection('brands'))}>Brands</button>
            <button type="button" className="dsp-market-topnav-cta" onClick={() => { window.top.location.href = '/onboarding'; }}>
              Create My Website <window.Icons.arrowRight size={16} />
            </button>
          </div>
        </nav>
      </window.Container>
      {menuOpen ? <VehicleMarketMegaMenu closeMenu={closeMenu} /> : null}
    </div>
  );
}

function TopNav({ step, setStep, mode, setMode }) {
  const { Button } = window.DesignSystem_a49d67;
  const isVehicleMode = mode === 'vehicles';
  if (isVehicleMode) return <VehicleMarketTopNav mode={mode} setMode={setMode} />;

  const links = isVehicleMode
    ? [
      ['#listing', 'Buy New'],
      ['#brands', 'By Brand'],
      ['#budget', 'By Budget'],
      ['#body', 'Body Type'],
      ['#ev', 'EV Zone'],
      ['#dealers', 'Dealers'],
    ]
    : [
      ['#dealers', 'Dealers'],
      ['#preview', 'Preview'],
      ['#pricing', 'Pricing'],
      ['#faq', 'FAQ'],
    ];
  return (
    <div
      className="dsp-topnav-shell"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        background: isVehicleMode ? 'rgba(248,250,252,0.9)' : 'linear-gradient(180deg, rgba(11,14,18,0.96), rgba(11,14,18,0.88))',
        borderBottom: isVehicleMode ? '1px solid #e2e8f0' : '1px solid rgba(255,253,247,0.12)',
        boxShadow: isVehicleMode ? '0 12px 30px rgba(15,23,42,0.08)' : '0 16px 36px rgba(11,14,18,0.2)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <window.Container wide>
        <nav className="dsp-topnav" style={{ minHeight: 'var(--dsp-topnav-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingTop: 14, paddingBottom: 14, flexWrap: 'wrap' }}>
          <Logo dark={!isVehicleMode} />
          <div className="dsp-topnav-actions" style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
            <div className="dsp-topnav-links" style={{ display: 'flex', gap: 26, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: isVehicleMode ? 'var(--vrf-muted)' : 'var(--text-on-dark-muted)' }}>
              {links.map(([href, label], index) => {
                const targetId = href.startsWith('#') ? href.slice(1) : '';
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={(event) => {
                      if (!targetId) return;
                      event.preventDefault();
                      window.history.replaceState(null, '', href);
                      scrollToMarketingSection(targetId);
                    }}
                    style={{ textDecoration: 'none', color: isVehicleMode && index === 0 ? 'var(--vrf-foreground)' : 'inherit' }}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
            {isVehicleMode ? (
              <button type="button" onClick={() => scrollToMarketingSection('dealers')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 36, borderRadius: 'var(--radius-full)', border: '1px solid var(--vrf-hairline)', background: 'var(--vrf-surface)', color: 'var(--vrf-foreground)', padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>
                <window.Icons.mapPin size={14} style={{ color: 'var(--vrf-brand)' }} /> Hyderabad
              </button>
            ) : null}
            <Button variant={isVehicleMode ? 'primary' : 'inverse'} size="sm" iconRight={<window.Icons.arrowRight size={16} />} onClick={openOnboardingFlow}>Create My Website</Button>
          </div>
        </nav>
      </window.Container>
    </div>
  );
}

function FloatBubble({ style }) {
  const { Avatar } = window.DesignSystem_a49d67;
  const { vehicles } = window.useMarketplacePreviewVehicles(1);
  const vehicleLabel = vehicles[0]?.name ? `${vehicles[0].name} · test drive` : 'DB vehicle · test drive';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 15px 11px 11px', background: 'var(--cream-50)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-default)', ...style }}>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <Avatar name="New Lead" size={38} />
        <span style={{ position: 'absolute', right: -1, bottom: -1, width: 12, height: 12, borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--cream-50)' }} />
      </span>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--text-strong)' }}>New enquiry</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>{vehicleLabel}</div>
      </div>
    </div>
  );
}

function DomainBadge({ style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', background: 'var(--ink-900)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-xl)', color: 'var(--cream-50)', ...style }}>
      <window.Icons.globe size={15} style={{ color: 'var(--bronze-400)' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500 }}>sharmamotors.in</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--success)' }}>
        <window.Icons.check size={13} /> Live
      </span>
    </div>
  );
}

function Hero({ step, setStep }) {
  const { Button, Badge, Avatar } = window.DesignSystem_a49d67;
  return (
    <window.Container wide style={{ paddingBottom: 56 }}>
      <window.Reveal className="dsp-hero-canvas" style={{
        background: 'var(--surface-canvas)', borderRadius: 'var(--radius-3xl)',
        padding: 'clamp(28px, 4vw, 64px)', position: 'relative', overflow: 'hidden',
        boxShadow: '0 2px 0 rgba(255,255,255,0.5) inset',
      }}>
        {/* soft light wash top-right */}
        <div aria-hidden="true" style={{ position: 'absolute', top: -160, right: -120, width: 520, height: 520, background: 'radial-gradient(circle, rgba(255,253,247,0.9), rgba(245,241,234,0) 70%)', pointerEvents: 'none' }} />

        <div className="dsp-hero-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1.04fr', gap: 'clamp(32px, 4vw, 64px)', alignItems: 'center' }}>
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26 }}>
            <window.Reveal delay={40}><Badge variant="outline" size="md"><window.Icons.spark size={13} style={{ color: 'var(--accent)' }} /> V1 Dealer Launch Kit</Badge></window.Reveal>
            <window.Reveal delay={90}>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.8rem, 6vw, 4.75rem)', lineHeight: 0.98, letterSpacing: '-0.035em', color: 'var(--text-strong)', textWrap: 'balance' }}>
                Launch a dealer website that <span style={{ fontStyle: 'italic', fontWeight: 800 }}>sells.</span>
              </h1>
            </window.Reveal>
            <window.Reveal delay={150}>
              <p style={{ margin: 0, maxWidth: 460, fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', lineHeight: 1.55, color: 'var(--text-body)', textWrap: 'pretty' }}>
                Add your showroom, vehicles, brand style, and domain. DealerSite Pro turns it into a polished website for cars, bikes, and autos.
              </p>
            </window.Reveal>
            <window.Reveal delay={210} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Button variant="primary" size="lg" iconRight={<window.Icons.arrowRight size={18} />} onClick={openOnboardingFlow}>Create My Website</Button>
              <Button variant="secondary" size="lg" iconLeft={<window.Icons.play size={15} />} onClick={openPreviewPage}>See Sample Site</Button>
            </window.Reveal>
            <window.Reveal delay={270} style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 6, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {['Rohit Sharma', 'Priya Nair', 'Amit Verma', 'Sana Khan'].map((n, i) => (
                  <span key={n} style={{ marginLeft: i === 0 ? 0 : -10, borderRadius: '50%', boxShadow: '0 0 0 2px var(--surface-canvas)' }}><Avatar name={n} size={32} /></span>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ display: 'inline-flex', gap: 2, color: 'var(--accent)' }}>
                  {[0,1,2,3,4].map((i) => <window.Icons.star key={i} size={14} />)}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-body)' }}>Loved by <strong style={{ color: 'var(--text-strong)' }}>500+ dealers</strong> across India</span>
              </div>
            </window.Reveal>
          </div>

          {/* RIGHT — floating dealer preview with depth */}
          <window.Reveal delay={160} className="dsp-hero-preview" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '8% -2% -6% 6%', background: 'var(--ink-900)', borderRadius: 'var(--radius-2xl)', opacity: 0.06, transform: 'rotate(2deg)' }} aria-hidden="true" />
            <div className="dsp-car-float">
              <window.DealerPreview device="desktop" style={{ position: 'relative', transform: 'perspective(1400px) rotateY(-7deg) rotateX(3deg)', transformOrigin: 'center' }} />
            </div>
            <FloatBubble style={{ position: 'absolute', left: -28, bottom: 38, zIndex: 3 }} />
            <DomainBadge style={{ position: 'absolute', right: -18, top: -16, zIndex: 3 }} />
          </window.Reveal>
        </div>
      </window.Reveal>
    </window.Container>
  );
}

function Header({ step, setStep, mode = 'builder', setMode = () => {} }) {
  const isVehicleMode = mode === 'vehicles';
  return (
    <div style={{ position: 'relative', background: isVehicleMode ? 'var(--vrf-bg)' : 'var(--surface-stage)', paddingTop: 'var(--dsp-topnav-height)', paddingBottom: isVehicleMode ? 0 : 4, overflow: 'hidden' }}>
      {/* fine grid texture, fading downward */}
      {!isVehicleMode && <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,253,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,253,247,0.05) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(120% 80% at 50% 0%, #000 40%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(120% 80% at 50% 0%, #000 40%, transparent 78%)',
        pointerEvents: 'none',
      }} />}
      {/* aurora glows */}
      {!isVehicleMode && <div aria-hidden="true" style={{ position: 'absolute', top: -180, left: '12%', width: 620, height: 480, background: 'radial-gradient(ellipse at center, rgba(199,154,91,0.22), transparent 68%)', pointerEvents: 'none', filter: 'blur(8px)' }} />}
      {!isVehicleMode && <div aria-hidden="true" style={{ position: 'absolute', top: -120, right: '6%', width: 520, height: 460, background: 'radial-gradient(ellipse at center, rgba(110,124,160,0.18), transparent 70%)', pointerEvents: 'none', filter: 'blur(8px)' }} />}
      <div style={{ position: 'relative' }}>
        <TopNav step={step} setStep={setStep} mode={mode} setMode={setMode} />
        {mode === 'builder' && <Hero step={step} setStep={setStep} />}
      </div>
    </div>
  );
}

window.Header = Header;
