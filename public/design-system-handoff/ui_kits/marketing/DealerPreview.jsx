// DealerSite Pro — a realistic mock dealer website inside a browser frame.
// Reused in the hero (floating) and the showcase. `device` = 'desktop'|'mobile'.
// `theme` makes it live-skinnable for the interactive Showcase switcher.
const DSP_THEMES = {
  showroom: { key: 'showroom', label: 'Clean Showroom', name: 'Shrama Motors', initial: 'S', logo: '../../assets/sharma-motors-emblem.png', accent: '#0B0E12', onAccent: '#FFFDF7', url: 'shramamotors.dealersite.pro', hero: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=72', tagline: 'Drive home\nsomething premium.' },
  bronze:   { key: 'bronze', label: 'Premium Used', name: 'Apex Auto Gallery', initial: 'A', accent: '#A8793A', onAccent: '#FFFDF7', url: 'apexautogallery.in', hero: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=72', tagline: 'Certified pre-owned,\nshowroom-fresh.' },
  electric: { key: 'electric', label: 'EV First', name: 'Volt Motors', initial: 'V', accent: '#16794d', onAccent: '#FFFDF7', url: 'voltmotors.in', hero: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=72', tagline: 'The future is\nfully charged.' },
};
window.DSP_THEMES = DSP_THEMES;

function BrowserChrome({ url = 'sharmamotors.dealersite.pro', children, style = {} }) {
  return (
    <div style={{
      background: 'var(--cream-50)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-float)', ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'var(--cream-100)', borderBottom: '1px solid var(--border-default)' }}>
        <span style={{ display: 'flex', gap: 6 }}>
          <i style={{ width: 10, height: 10, borderRadius: '50%', background: '#E7E0D7' }} />
          <i style={{ width: 10, height: 10, borderRadius: '50%', background: '#E7E0D7' }} />
          <i style={{ width: 10, height: 10, borderRadius: '50%', background: '#E7E0D7' }} />
        </span>
        <span style={{ flex: 1, marginLeft: 6, height: 24, borderRadius: 'var(--radius-full)', background: 'var(--cream-50)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 7, padding: '0 12px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          <window.Icons.globe size={12} style={{ opacity: 0.6 }} /> {url}
        </span>
      </div>
      {children}
    </div>
  );
}

function DealerEmblem({ theme, size = 30 }) {
  const ac = theme.accent, on = theme.onAccent;
  if (theme.logo) {
    return <img src={theme.logo} alt={theme.name + ' logo'} style={{ height: Math.round(size * 1.12), width: 'auto', display: 'block', flex: 'none' }} />;
  }
  return (
    <span style={{ position: 'relative', width: size, height: size, flex: 'none', borderRadius: Math.round(size * 0.28), background: ac, color: on, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)', transition: 'background var(--dur-base) var(--ease-out)' }}>
      <window.Icons.car size={Math.round(size * 0.62)} />
      <span style={{ position: 'absolute', bottom: Math.round(size * 0.16), right: Math.round(size * 0.18), width: Math.max(3, Math.round(size * 0.13)), height: Math.max(3, Math.round(size * 0.13)), borderRadius: '50%', background: on, opacity: 0.9 }} />
    </span>
  );
}

function DealerSiteContent({ compact = false, theme = DSP_THEMES.showroom }) {
  const { vehicles: tiles, status } = window.useMarketplacePreviewVehicles(compact ? 2 : 3);
  const premiumHero = window.dspPremiumHeroImageFor?.(theme.key);
  const featuredImage = premiumHero?.image || tiles[0]?.image || theme.hero;
  const featuredAlt = premiumHero?.label || tiles[0]?.name || 'Featured first-hand vehicle';
  const ac = theme.accent, on = theme.onAccent;
  return (
    <div style={{ background: 'var(--cream-50)' }}>
      {/* dealer header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 12 : 20, padding: compact ? '12px 16px' : '16px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
          <DealerEmblem theme={theme} size={30} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: compact ? 14 : 16, color: 'var(--text-strong)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{theme.name}</span>
        </div>
        {!compact && (
          <div style={{ display: 'flex', gap: 18, marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            <span>Inventory</span><span>About</span><span>Finance</span><span style={{ color: 'var(--text-strong)' }}>Contact</span>
          </div>
        )}
        <span style={{ flex: 'none', marginLeft: compact ? 'auto' : 0, padding: '7px 13px', borderRadius: 'var(--radius-full)', background: ac, color: on, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', transition: 'background var(--dur-base) var(--ease-out)' }}>Enquire</span>
      </div>

      {/* hero band */}
      <div style={{ position: 'relative', height: compact ? 130 : 188, overflow: 'hidden' }}>
        <img src={featuredImage} alt={featuredAlt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,14,18,0.78) 0%, rgba(11,14,18,0.32) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', left: compact ? 16 : 24, top: '50%', transform: 'translateY(-50%)', maxWidth: '64%' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,253,247,0.7)', marginBottom: 6 }}>Featured this week</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: compact ? 18 : 26, lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--cream-50)', marginBottom: compact ? 8 : 12, whiteSpace: 'pre-line' }}>{theme.tagline}</div>
          {!compact && <span style={{ padding: '8px 14px', borderRadius: 'var(--radius-full)', background: 'var(--cream-50)', color: 'var(--ink-900)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700 }}>Browse inventory</span>}
        </div>
      </div>

      {/* inventory grid */}
      <div style={{ padding: compact ? '14px 16px' : '18px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: compact ? 13 : 15, color: 'var(--text-strong)' }}>Latest inventory</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: ac, transition: 'color var(--dur-base) var(--ease-out)' }}>View all →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(tiles.length, 1)}, 1fr)`, gap: 12 }}>
          {tiles.map((v) => (
            <div key={v.name} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--cream-50)' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--cream-300)' }}>
                <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 7, left: 7, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: ac, color: on, fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, transition: 'background var(--dur-base) var(--ease-out)' }}>{v.tag}</span>
              </div>
              <div style={{ padding: '9px 10px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: compact ? 11 : 12.5, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: compact ? 11 : 12.5, color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{v.price}</span>
                  <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-full)', border: `1px solid ${ac}`, color: ac, fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 700, transition: 'border-color var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)' }}>Enquire</span>
                </div>
              </div>
            </div>
          ))}
          {tiles.length === 0 && (
            <div style={{ borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-default)', background: 'var(--cream-100)', padding: compact ? 12 : 16, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: compact ? 10.5 : 12, fontWeight: 700, color: 'var(--text-muted)' }}>
              {status === 'loading' ? 'Loading DB inventory...' : 'No DB inventory yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileDealerSite({ theme }) {
  const ac = theme.accent, on = theme.onAccent;
  const { vehicles: tiles, status } = window.useMarketplacePreviewVehicles(3);
  const premiumHero = window.dspPremiumHeroImageFor?.(theme.key);
  const featuredImage = premiumHero?.image || tiles[0]?.image || theme.hero;
  const featuredAlt = premiumHero?.label || tiles[0]?.name || 'Featured first-hand vehicle';
  return (
    <div style={{ background: 'var(--cream-50)', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>
      {/* status bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 20px 4px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--text-strong)' }}>
        <span>9:41</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="15" height="11" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4" width="3" height="8" rx="1"/><rect x="10" y="1.5" width="3" height="10.5" rx="1" opacity="0.4"/></svg>
          <svg width="15" height="11" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 4.5C4.5 1.5 11.5 1.5 15 4.5M3.2 7C5.5 5 10.5 5 12.8 7M6 9.4c1-.9 3-.9 4 0" strokeLinecap="round"/></svg>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}><span style={{ width: 16, height: 8, border: '1.2px solid currentColor', borderRadius: 2, display: 'inline-flex', padding: 1 }}><span style={{ flex: 1, background: 'currentColor', borderRadius: 1 }} /></span></span>
        </span>
      </div>

      {/* app header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DealerEmblem theme={theme} size={26} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{theme.name}</span>
        </div>
        <span style={{ display: 'inline-flex', color: 'var(--text-strong)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg></span>
      </div>

      {/* scroll body */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14, padding: '0 14px' }}>
        {/* hero card */}
        <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', height: 168, flex: 'none', boxShadow: 'var(--shadow-md)' }}>
          <img src={featuredImage} alt={featuredAlt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,14,18,0.86) 8%, rgba(11,14,18,0.15) 60%, transparent)' }} />
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 13 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,253,247,0.75)', marginBottom: 5 }}>Featured this week</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--cream-50)', whiteSpace: 'pre-line', marginBottom: 9 }}>{theme.tagline}</div>
            <span style={{ display: 'inline-block', padding: '6px 13px', borderRadius: 'var(--radius-full)', background: 'var(--cream-50)', color: 'var(--ink-900)', fontSize: 10.5, fontWeight: 700, whiteSpace: 'nowrap' }}>Browse inventory</span>
          </div>
        </div>

        {/* category chips */}
        <div style={{ display: 'flex', gap: 7, flex: 'none' }}>
          {['All', 'Cars', 'Bikes', 'EV'].map((c, i) => (
            <span key={c} style={{ padding: '6px 13px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', background: i === 0 ? ac : 'var(--cream-200)', color: i === 0 ? on : 'var(--text-body)', border: i === 0 ? 'none' : '1px solid var(--border-default)' }}>{c}</span>
          ))}
        </div>

        {/* vehicle list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {tiles.map((v) => (
            <div key={v.name} style={{ display: 'flex', gap: 11, padding: 9, borderRadius: 14, border: '1px solid var(--border-subtle)', background: 'var(--cream-50)', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ position: 'relative', width: 78, height: 62, flex: 'none', borderRadius: 10, overflow: 'hidden', background: 'var(--cream-300)' }}>
                <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 5, left: 5, padding: '1px 6px', borderRadius: 'var(--radius-full)', background: ac, color: on, fontSize: 7.5, fontWeight: 700 }}>{v.tag}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12.5, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {v.specs.slice(0, 2).map((sp, si) => (
                    <React.Fragment key={sp}>
                      {si > 0 && <span style={{ fontSize: 9, color: 'var(--text-faint)' }}>·</span>}
                      <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)' }}>{sp}</span>
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{v.price}</span>
                  <span style={{ padding: '3px 9px', borderRadius: 'var(--radius-full)', border: `1px solid ${ac}`, color: ac, fontSize: 9, fontWeight: 700 }}>Enquire</span>
                </div>
              </div>
            </div>
          ))}
          {tiles.length === 0 && (
            <div style={{ padding: 14, borderRadius: 14, border: '1px dashed var(--border-default)', background: 'var(--cream-100)', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
              {status === 'loading' ? 'Loading DB inventory...' : 'No DB inventory yet'}
            </div>
          )}
        </div>
      </div>

      {/* sticky bottom contact bar */}
      <div style={{ flex: 'none', display: 'flex', gap: 8, padding: '10px 14px 8px', borderTop: '1px solid var(--border-subtle)', background: 'var(--cream-50)' }}>
        <span style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 36, borderRadius: 'var(--radius-full)', background: ac, color: on, fontSize: 11.5, fontWeight: 700 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>
          Call now
        </span>
        <span style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 36, borderRadius: 'var(--radius-full)', background: 'var(--cream-50)', border: `1px solid ${ac}`, color: ac, fontSize: 11.5, fontWeight: 700 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z"/></svg>
          WhatsApp
        </span>
      </div>
    </div>
  );
}

function DealerPreview({ device = 'desktop', url, theme = DSP_THEMES.showroom, style = {} }) {
  if (device === 'mobile') {
    return (
      // iPhone 17 Pro Max — titanium frame, thin uniform bezels, Dynamic Island
      <div style={{ position: 'relative', width: 252, height: 540, ...style }}>
        {/* side buttons (titanium) */}
        <span aria-hidden="true" style={{ position: 'absolute', left: -2.5, top: 96, width: 3, height: 26, borderRadius: 3, background: 'linear-gradient(90deg, #1a1a1c, #48484a)' }} />{/* action button */}
        <span aria-hidden="true" style={{ position: 'absolute', left: -2.5, top: 138, width: 3, height: 40, borderRadius: 3, background: 'linear-gradient(90deg, #1a1a1c, #48484a)' }} />{/* vol up */}
        <span aria-hidden="true" style={{ position: 'absolute', left: -2.5, top: 186, width: 3, height: 40, borderRadius: 3, background: 'linear-gradient(90deg, #1a1a1c, #48484a)' }} />{/* vol down */}
        <span aria-hidden="true" style={{ position: 'absolute', right: -2.5, top: 120, width: 3, height: 34, borderRadius: 3, background: 'linear-gradient(270deg, #1a1a1c, #48484a)' }} />{/* camera control */}
        <span aria-hidden="true" style={{ position: 'absolute', right: -2.5, top: 172, width: 3, height: 64, borderRadius: 3, background: 'linear-gradient(270deg, #1a1a1c, #48484a)' }} />{/* side button */}

        {/* titanium outer band */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 52, padding: 2.5, background: 'linear-gradient(145deg, #6b6b6e 0%, #2c2c2e 22%, #1b1b1d 50%, #2c2c2e 78%, #5a5a5d 100%)', boxShadow: 'var(--shadow-float)' }}>
          {/* black bezel */}
          <div style={{ position: 'relative', height: '100%', borderRadius: 49.5, padding: 9, background: '#050608' }}>
            {/* screen */}
            <div style={{ position: 'relative', height: '100%', borderRadius: 41, overflow: 'hidden', background: 'var(--cream-50)' }}>
              {/* Dynamic Island */}
              <span aria-hidden="true" style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 92, height: 27, borderRadius: 'var(--radius-full)', background: '#050608', zIndex: 6, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #2b3a52, #070b12 70%)', boxShadow: 'inset 0 0 0 1px rgba(120,150,200,0.25)' }} />
              </span>
              <MobileDealerSite theme={theme} />
              {/* home indicator */}
              <span aria-hidden="true" style={{ position: 'absolute', bottom: 7, left: '50%', transform: 'translateX(-50%)', width: 100, height: 4, borderRadius: 'var(--radius-full)', background: 'var(--ink-900)', opacity: 0.26, zIndex: 6 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <BrowserChrome url={url || theme.url} style={style}>
      <DealerSiteContent theme={theme} />
    </BrowserChrome>
  );
}

window.DealerPreview = DealerPreview;
