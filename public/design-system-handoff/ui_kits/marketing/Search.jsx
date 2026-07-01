// DealerSite Pro — Search & discover: buyers search inventory and see full specs.
function SearchDiscover() {
  const { vehicles, status } = window.useMarketplacePreviewVehicles(1);
  const [mockMessage, setMockMessage] = React.useState('');
  const v = vehicles[0];
  const showMockAction = (action) => {
    setMockMessage(`${action} is mocked in this preview. No page change was made.`);
  };
  const filters = v
    ? [v.price, v.fuel, v.transmission, v.year, v.body].filter(Boolean).slice(0, 5)
    : [status === 'loading' ? 'Loading DB vehicles' : 'No DB vehicles yet'];
  const specs = v ? [
    { icon: 'gauge', label: 'Year', value: v.year },
    { icon: 'fuel', label: 'Fuel', value: v.fuel },
    { icon: 'car', label: 'Transmission', value: v.transmission },
    { icon: 'testdrive', label: 'Driven', value: v.driven },
  ].filter((item) => item.value) : [];
  const searchLabel = v ? v.name : 'Search live DB vehicles';
  return (
    <window.Section tone="page" id="search">
      <window.Container>
        <window.SectionHead eyebrow="Search & discover"
          title="Buyers find the right vehicle in seconds."
          sub="Every site comes with smart search and filters — visitors look up any vehicle and see full specs, photos, and price before they enquire." />

        <window.Reveal delay={100} style={{ marginTop: 56, maxWidth: 940, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
            {/* search bar */}
            <div style={{ padding: 'clamp(18px, 2.4vw, 26px)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 54, padding: '0 18px', background: 'var(--cream-100)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-full)' }}>
                <span style={{ color: 'var(--text-muted)', flex: 'none' }}><window.Icons.search size={20} /></span>
                <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--text-strong)', fontWeight: 500 }}>
                  {searchLabel}<span className="dsp-caret" style={{ display: 'inline-block', width: 2, height: 20, background: 'var(--ink-900)', marginLeft: 2, transform: 'translateY(3px)' }} />
                </span>
                <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 38, padding: '0 18px', borderRadius: 'var(--radius-full)', background: 'var(--ink-900)', color: 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>Search</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                {filters.map((f, i) => (
                  <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, background: i < 2 ? 'var(--ink-900)' : 'var(--cream-200)', color: i < 2 ? 'var(--cream-50)' : 'var(--text-body)', border: i < 2 ? 'none' : '1px solid var(--border-default)' }}>
                    {i < 2 && <window.Icons.check size={13} />}{f}
                  </span>
                ))}
              </div>
            </div>

            {/* result: vehicle + full info */}
            {v ? (
              <div className="dsp-search-result" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 0 }}>
                <div style={{ position: 'relative', minHeight: 230, background: 'var(--cream-300)' }}>
                  <img src={v.image} alt={v.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: 14, left: 14, padding: '4px 11px', borderRadius: 'var(--radius-full)', background: 'var(--ink-900)', color: 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>1 DB match · {v.tag}</span>
                </div>
                <div style={{ padding: 'clamp(22px, 2.6vw, 32px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', letterSpacing: '-0.025em', color: 'var(--text-strong)', lineHeight: 1.1 }}>{v.name}</h3>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 600 }}>{[v.fuel, v.transmission, v.body].filter(Boolean).join(' · ')}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.03em', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{v.price}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {specs.map((s) => {
                      const Icon = window.Icons[s.icon];
                      return (
                        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', background: 'var(--cream-100)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ color: 'var(--text-muted)', flex: 'none' }}><Icon size={18} /></span>
                          <div>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{s.label}</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>{s.value}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                    <button type="button" onClick={() => showMockAction('Vehicle details')} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 44, border: 0, borderRadius: 'var(--radius-md)', background: 'var(--ink-900)', color: 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700, cursor: 'pointer' }}>View full details</button>
                    <button type="button" onClick={() => showMockAction('Enquiry')} style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 44, padding: '0 18px', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', color: 'var(--text-strong)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700, cursor: 'pointer' }}><window.Icons.whatsapp size={16} /> Enquire</button>
                  </div>
                  {mockMessage && (
                    <div role="status" style={{ marginTop: -6, border: '1px solid rgb(46 125 80 / 0.22)', borderRadius: 'var(--radius-md)', background: 'rgb(46 125 80 / 0.08)', color: 'var(--success)', padding: '9px 12px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 750 }}>
                      {mockMessage}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: 34, textAlign: 'center', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                {status === 'loading' ? 'Loading a vehicle result from the database...' : 'No database vehicle is available for this search preview yet.'}
              </div>
            )}
          </div>
        </window.Reveal>
      </window.Container>
    </window.Section>
  );
}

window.SearchDiscover = SearchDiscover;
