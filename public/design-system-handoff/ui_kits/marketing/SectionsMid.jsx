// DealerSite Pro — Categories, How it works, Showcase.
function IconTile({ name, dark = false, size = 48 }) {
  const Icon = window.Icons[name];
  return (
    <span style={{
      width: size, height: size, flex: 'none', borderRadius: 'var(--radius-md)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: dark ? 'rgba(255,253,247,0.06)' : 'var(--cream-200)',
      border: `1px solid ${dark ? 'var(--border-inverse)' : 'var(--border-default)'}`,
      color: dark ? 'var(--cream-50)' : 'var(--ink-900)',
    }}>
      <Icon size={Math.round(size * 0.5)} />
    </span>
  );
}

function Categories() {
  const { Card } = window.DesignSystem_a49d67;
  const D = window.DSP_DATA;
  return (
    <window.Section tone="page" id="dealers">
      <window.Container>
        <window.SectionHead eyebrow="Built for every dealer"
          title="One platform. Every kind of showroom."
          sub="Cars, bikes, EVs, autos — DealerSite Pro adapts to what you sell with layouts tuned for each category." />
        <div className="dsp-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 56 }}>
          {D.categories.map((c, i) => (
            <window.Reveal key={c.name} delay={i * 70}>
              <Card tone="card" interactive padding="lg" radius="lg" style={{ height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <IconTile name={c.icon} />
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>{c.name}</h3>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--text-body)' }}>{c.blurb}</p>
                  </div>
                </div>
              </Card>
            </window.Reveal>
          ))}
        </div>
      </window.Container>
    </window.Section>
  );
}

function HowItWorks() {
  const D = window.DSP_DATA;
  return (
    <window.Section tone="canvas" id="how">
      <window.Container>
        <window.SectionHead eyebrow="How it works"
          title="From showroom to website in five steps."
          sub="A guided setup wizard takes you from sign-up to a published, lead-ready website." />
        <div className="dsp-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, marginTop: 60, position: 'relative' }}>
          {D.steps.map((s, i) => (
            <window.Reveal key={s.title} delay={i * 80} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 44, height: 44, flex: 'none', borderRadius: '50%', background: 'var(--ink-900)', color: 'var(--cream-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>{i + 1}</span>
                  {i < D.steps.length - 1 && <span className="dsp-step-line" style={{ flex: 1, height: 2, background: 'var(--border-default)', borderRadius: 2 }} />}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>{s.title}</h3>
                  <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 1.5, color: 'var(--text-body)' }}>{s.blurb}</p>
                </div>
              </div>
            </window.Reveal>
          ))}
        </div>
      </window.Container>
    </window.Section>
  );
}

function Showcase() {
  const { Button } = window.DesignSystem_a49d67;
  const themes = window.DSP_THEMES;
  const order = ['showroom', 'bronze', 'electric'];
  const [active, setActive] = React.useState('showroom');
  const theme = themes[active];
  return (
    <window.Section tone="stage" id="preview">
      <window.Container wide>
        <window.SectionHead dark eyebrow="See it live"
          title="Change the style. Watch it transform."
          sub="Pick a look and DealerSite Pro re-skins the whole site instantly — colours, branding, and layout. This is the real preview, updating live." />

        {/* live style switcher */}
        <window.Reveal delay={80} style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <div style={{ display: 'flex', gap: 8, padding: 6, borderRadius: 'var(--radius-full)', background: 'rgba(255,253,247,0.06)', border: '1px solid var(--border-inverse)' }}>
            {order.map((k) => {
              const t = themes[k];
              const on = active === k;
              return (
                <button key={k} onClick={() => setActive(k)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9, height: 42, padding: '0 18px',
                  border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
                  background: on ? 'var(--cream-50)' : 'transparent',
                  color: on ? 'var(--ink-900)' : 'var(--text-on-dark-muted)',
                  transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
                }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: t.accent, boxShadow: on ? '0 0 0 2px var(--cream-50), 0 0 0 3px ' + t.accent : '0 0 0 2px rgba(255,253,247,0.25)', flex: 'none' }} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </window.Reveal>

        <window.Reveal delay={140} className="dsp-showcase" style={{ marginTop: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(16px, 4vw, 56px)', position: 'relative' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: '6% 12% 0 12%', background: `radial-gradient(ellipse at center, ${theme.accent}33, transparent 70%)`, pointerEvents: 'none', transition: 'background var(--dur-slow) var(--ease-out)' }} />
          <div style={{ flex: '0 1 760px', maxWidth: 760, position: 'relative', zIndex: 2 }}>
            <window.DealerPreview key={theme.key} device="desktop" theme={theme} />
          </div>
          <div className="dsp-showcase-mobile" style={{ flex: 'none', position: 'relative', zIndex: 3, marginBottom: -8 }}>
            <window.DealerPreview key={theme.key} device="mobile" theme={theme} />
          </div>
        </window.Reveal>
        <window.Reveal delay={200} style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <Button variant="inverse" size="lg" iconRight={<window.Icons.arrowUpRight size={18} />} onClick={() => document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>See Sample Site</Button>
        </window.Reveal>
      </window.Container>
    </window.Section>
  );
}

Object.assign(window, { Categories, HowItWorks, Showcase, IconTile });
