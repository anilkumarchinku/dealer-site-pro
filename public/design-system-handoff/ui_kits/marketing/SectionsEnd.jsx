// DealerSite Pro — Leads, Brand & Domain, Templates, Final CTA, Footer.
function LeadChannel({ icon, name, blurb }) {
  const Icon = window.Icons[icon];
  return (
    <div style={{ display: 'flex', gap: 14, padding: 'var(--space-5)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
      <span style={{ width: 42, height: 42, flex: 'none', borderRadius: 'var(--radius-md)', background: 'var(--cream-200)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-900)' }}><Icon size={21} /></span>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-strong)' }}>{name}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{blurb}</div>
      </div>
    </div>
  );
}

function LeadDashboard() {
  const { vehicles, status } = window.useMarketplacePreviewVehicles(3);
  const names = ['Priya Nair', 'Amit Verma', 'Sana Khan'];
  const actions = ['Test drive', 'Enquiry', 'Call back'];
  const channels = ['whatsapp', 'enquiry', 'phone'];
  const rows = vehicles.map((vehicle, index) => ({
    n: names[index] || 'New buyer',
    v: `${vehicle.name} · ${actions[index] || 'Enquiry'}`,
    t: ['2m', '14m', '1h'][index] || 'now',
    c: channels[index] || 'enquiry',
  }));
  return (
    <div style={{ background: 'var(--surface-dark)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-inverse)', display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--cream-50)' }}>Lead Dashboard</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'var(--success)' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }} /> Live</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((r) => {
          const Icon = window.Icons[r.c];
          return (
            <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,253,247,0.04)', border: '1px solid var(--border-inverse)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ width: 34, height: 34, flex: 'none', borderRadius: '50%', background: 'rgba(255,253,247,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bronze-400)' }}><Icon size={16} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--cream-50)' }}>{r.n}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-on-dark-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.v}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-on-dark-muted)' }}>{r.t}</span>
            </div>
            );
        })}
        {rows.length === 0 && (
          <div style={{ padding: '16px 14px', background: 'rgba(255,253,247,0.04)', border: '1px dashed var(--border-inverse)', borderRadius: 'var(--radius-md)', color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
            {status === 'loading' ? 'Loading DB vehicle enquiries...' : 'Vehicle enquiry rows will appear from DB inventory.'}
          </div>
        )}
      </div>
    </div>
  );
}

function Leads() {
  const D = window.DSP_DATA;
  return (
    <window.Section tone="page" id="leads">
      <window.Container>
        <window.SectionHead eyebrow="Leads included"
          title="Every website is built to convert."
          sub="Visitors turn into enquiries, calls, and test drives — all captured in one place." />
        <div className="dsp-leads-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 56, alignItems: 'stretch' }}>
          <window.Reveal><LeadDashboard /></window.Reveal>
          <window.Reveal delay={90} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {D.leads.slice(0, 4).map((l) => <LeadChannel key={l.name} {...l} />)}
          </window.Reveal>
        </div>
      </window.Container>
    </window.Section>
  );
}

function BrandDomain() {
  const { Input, Button } = window.DesignSystem_a49d67;
  const D = window.DSP_DATA;
  const swatches = ['#0B0E12', '#A8793A', '#2E8B5A', '#C7453E', '#1E5BFF'];
  return (
    <window.Section tone="canvas" id="brand">
      <window.Container>
        <div className="dsp-brand-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}>
          <div>
            <window.SectionHead align="left" max={520} eyebrow="Brand & domain control"
              title="Your brand. Your domain. Your site."
              sub="Make it unmistakably yours, then publish on a free subdomain or connect a domain you already own." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32 }}>
              {D.brandControls.map((b, i) => {
                const Icon = window.Icons[b.icon];
                return (
                  <window.Reveal key={b.name} delay={i * 60} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-900)' }}><Icon size={18} /></span>
                    <div>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-strong)' }}>{b.name}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}> — {b.blurb}</span>
                    </div>
                  </window.Reveal>
                );
              })}
            </div>
          </div>

          {/* brand control panel mock */}
          <window.Reveal delay={120}>
            <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ display:'flex', alignItems:'center', justifyContent:'center', height:56, padding:'0 6px', borderRadius:'var(--radius-lg)', background:'var(--cream-100)', border:'1px solid var(--border-default)' }}>
                  <img src="../../assets/sharma-motors-emblem.png" alt="Shrama Motors logo" style={{ height:34, width:'auto', display:'block' }} />
                </span>
                <div><div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'var(--text-lg)', color:'var(--text-strong)', whiteSpace:'nowrap' }}>Shrama Motors</div><div style={{ fontFamily:'var(--font-body)', fontSize:13, color:'var(--text-muted)' }}>Logo · uploaded</div></div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Brand colour</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {swatches.map((c, i) => (
                    <span key={c} style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: c, border: i === 1 ? '2px solid var(--ink-900)' : '1px solid var(--border-default)', boxShadow: i === 1 ? '0 0 0 3px var(--cream-50), 0 0 0 4px var(--ink-900)' : 'none' }} />
                  ))}
                </div>
              </div>
              <Input label="Custom domain" defaultValue="sharmamotors.in"
                iconLeft={<window.Icons.globe size={16} />}
                trailing={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'var(--success)' }}><window.Icons.check size={14} /> Verified</span>} />
              <Button variant="primary" fullWidth iconRight={<window.Icons.arrowRight size={17} />} onClick={() => { window.top.location.href = '/onboarding'; }}>Publish website</Button>
            </div>
          </window.Reveal>
        </div>
      </window.Container>
    </window.Section>
  );
}

function Templates() {
  const D = window.DSP_DATA;
  return (
    <window.Section tone="page" id="templates">
      <window.Container>
        <window.SectionHead eyebrow="Templates & styles"
          title="Start from a style that fits your floor."
          sub="Five dealer-ready templates — pick one, apply your brand, and you're 90% there." />
        <div className="dsp-tpl-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20, marginTop: 56 }}>
          {D.templates.map((t, i) => (
            <window.Reveal key={t.name} delay={i * 60} className={i < 2 ? 'dsp-tpl-lg' : 'dsp-tpl-sm'} style={{ gridColumn: i < 2 ? 'span 3' : 'span 2' }}>
              <div className="dsp-tpl-card" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', aspectRatio: i < 2 ? '16/10' : '4/5', cursor: 'pointer' }}>
                <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,14,18,0.82), rgba(11,14,18,0.05) 55%)' }} />
                <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--cream-50)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{t.name}</span>
                  <span style={{ flex: 'none', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(255,253,247,0.16)', backdropFilter: 'blur(6px)', color: 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700 }}>{t.tag}</span>
                </div>
              </div>
            </window.Reveal>
          ))}
        </div>
      </window.Container>
    </window.Section>
  );
}

function FinalCTA() {
  const { Button } = window.DesignSystem_a49d67;
  return (
    <window.Section tone="page" style={{ paddingBottom: 'clamp(64px, 8vw, 112px)' }}>
      <window.Container wide>
        <window.Reveal style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-stage)', borderRadius: 'var(--radius-3xl)', padding: 'clamp(48px, 7vw, 110px) clamp(28px, 5vw, 80px)', textAlign: 'center' }}>
          <div aria-hidden="true" style={{ position: 'absolute', bottom: -180, left: '50%', transform: 'translateX(-50%)', width: 720, height: 480, background: 'radial-gradient(ellipse at center, rgba(199,154,91,0.22), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
            <h2 style={{ margin: 0, maxWidth: 880, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)', lineHeight: 1.02, letterSpacing: '-0.035em', color: 'var(--cream-50)', textWrap: 'balance' }}>
              Your dealership website can go live faster than you think.
            </h2>
            <p style={{ margin: 0, maxWidth: 560, fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', lineHeight: 1.55, color: 'var(--text-on-dark-muted)', textWrap: 'pretty' }}>
              Start with your showroom details, pick your vehicles, and publish a professional website built for leads.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 4 }}>
              <Button variant="inverse" size="lg" iconRight={<window.Icons.arrowRight size={18} />} onClick={() => { window.top.location.href = '/onboarding'; }}>Create My Website</Button>
              <Button variant="ghost" size="lg" style={{ color: 'var(--cream-50)' }} iconLeft={<window.Icons.play size={15} />} onClick={() => { window.openPreviewPage?.(); }}>View Demo</Button>
            </div>
          </div>
        </window.Reveal>
      </window.Container>
    </window.Section>
  );
}

function Footer() {
  const cols = [
    { h: 'Product', links: ['Templates', 'Pricing', 'Sample sites', 'Custom domains'] },
    { h: 'Dealers', links: ['Cars', 'Bikes & scooters', 'EV dealers', 'Used vehicles'] },
    { h: 'Company', links: ['About', 'Contact', 'Support', 'Careers'] },
  ];
  return (
    <footer style={{ background: 'var(--surface-stage)', paddingTop: 'var(--section-y)', paddingBottom: 40 }}>
      <window.Container wide>
        <div className="dsp-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: 40, paddingBottom: 48, borderBottom: '1px solid var(--border-inverse)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 280 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.025em', color: 'var(--cream-50)' }}>DealerSite<span style={{ color: 'var(--bronze-400)' }}> Pro</span></span>
            <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--text-on-dark-muted)' }}>Professional dealership websites for cars, bikes, EVs, and autos — without code.</p>
          </div>
          {cols.map((col) => (
            <div key={col.h} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-on-dark-muted)' }}>{col.h}</span>
              {col.links.map((l) => <a key={l} href={`#${l === 'Pricing' ? 'pricing' : l === 'Templates' || l === 'Sample sites' ? 'templates' : l === 'Custom domains' ? 'brand' : l === 'Contact' || l === 'Support' ? 'leads' : l === 'Cars' || l === 'Bikes & scooters' || l === 'EV dealers' || l === 'Used vehicles' ? 'dealers' : 'market-top'}`} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cream-50)', textDecoration: 'none', opacity: 0.78 }}>{l}</a>)}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 28 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-on-dark-muted)' }}>© 2026 DealerSite Pro. All rights reserved.</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-on-dark-muted)', display: 'flex', gap: 20 }}><a href="/privacy" target="_top" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a><a href="/terms" target="_top" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a></span>
        </div>
      </window.Container>
    </footer>
  );
}

Object.assign(window, { Leads, BrandDomain, Templates, FinalCTA, Footer });
