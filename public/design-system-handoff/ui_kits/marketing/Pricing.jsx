// DealerSite Pro — Pricing + FAQ: the decision section that closes the journey.
const DSP_PRICING = [
  {
    name: 'Starter', price: '₹0', period: '/forever', tagline: 'Get online today on a free subdomain.',
    cta: 'Start free', variant: 'secondary', featured: false,
    features: ['1 dealer website', 'Free yourname.dealersite.pro', 'Up to 25 vehicles', 'Enquiry & WhatsApp leads', 'Mobile-ready templates'],
  },
  {
    name: 'Pro', price: '₹499', period: '/month', tagline: 'Your own domain, SSL, DNS guidance, and lead tools.',
    cta: 'Start Pro', variant: 'accent', featured: true, badge: 'Most popular',
    features: ['Everything in Starter', 'Connect your own domain', 'Free SSL certificate', 'DNS setup guide', 'Professional email setup support', 'Lead dashboard + call tracking'],
  },
  {
    name: 'Multi-Brand', price: '₹3,999', period: '/month', tagline: 'For groups selling many brands & locations.',
    cta: 'Talk to sales', variant: 'secondary', featured: false,
    features: ['Everything in Pro', 'Up to 5 showroom locations', 'Per-brand layouts', 'Team accounts & roles', 'Priority support'],
  },
];

const DSP_FAQ = [
  { q: 'Do I need any technical skills?', a: 'None at all. If you can fill a form, you can launch a DealerSite Pro website. The guided wizard takes you from sign-up to live in five steps.' },
  { q: 'Can I use my own domain?', a: 'Yes. Start free on a yourname.dealersite.pro subdomain, then connect any .com or .in domain you own on the Pro plan — we walk you through it in minutes.' },
  { q: 'What kinds of vehicles does it support?', a: 'Cars, bikes, scooters, EVs, autos, and three-wheelers. Layouts adapt to each category, and multi-brand dealers can show every brand on one site.' },
  { q: 'How do leads reach me?', a: 'Every enquiry, call, WhatsApp message, and test-drive request lands in one lead dashboard — and pings you instantly so you never miss a buyer.' },
  { q: 'Can I change my plan later?', a: 'Anytime. Upgrade, downgrade, or cancel from your dashboard with no lock-in. Your website and leads stay exactly where they are.' },
];

function PlanCard({ plan }) {
  const { Button } = window.DesignSystem_a49d67;
  const featured = plan.featured;
  const handleCta = () => {
    if (/talk to sales/i.test(plan.cta)) {
      window.top.location.href = 'mailto:sales@dealersitepro.com?subject=DealerSite%20Pro%20sales';
      return;
    }
    window.top.location.href = '/onboarding';
  };
  return (
    <div style={{
      position: 'relative', display: 'flex', flexDirection: 'column', gap: 22,
      padding: featured ? 'clamp(28px, 3vw, 40px)' : 'clamp(24px, 3vw, 36px)',
      background: featured ? 'var(--surface-stage)' : 'var(--surface-card)',
      border: `1px solid ${featured ? 'transparent' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-2xl)',
      boxShadow: featured ? 'var(--shadow-xl)' : 'var(--shadow-sm)',
      transform: featured ? 'translateY(-10px)' : 'none',
      overflow: 'hidden', height: '100%',
    }}>
      {featured && <div aria-hidden="true" style={{ position: 'absolute', top: -110, right: -70, width: 300, height: 300, background: 'radial-gradient(circle, rgba(199,154,91,0.22), transparent 68%)', pointerEvents: 'none' }} />}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', letterSpacing: '-0.02em', color: featured ? 'var(--cream-50)' : 'var(--text-strong)' }}>{plan.name}</span>
        {plan.badge && <span style={{ padding: '4px 11px', borderRadius: 'var(--radius-full)', background: 'var(--accent)', color: 'var(--cream-50)', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.02em' }}>{plan.badge}</span>}
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.4rem, 4vw, 3rem)', letterSpacing: '-0.04em', color: featured ? 'var(--cream-50)' : 'var(--text-strong)' }}>{plan.price}</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: featured ? 'var(--text-on-dark-muted)' : 'var(--text-muted)' }}>{plan.period}</span>
      </div>
      <p style={{ position: 'relative', margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 1.5, color: featured ? 'var(--text-on-dark-muted)' : 'var(--text-body)', minHeight: 40 }}>{plan.tagline}</p>
      <div style={{ position: 'relative' }}>
        <Button variant={plan.variant} size="lg" fullWidth onClick={handleCta}>{plan.cta}</Button>
      </div>
      <div style={{ position: 'relative', height: 1, background: featured ? 'var(--border-inverse)' : 'var(--border-subtle)' }} />
      <ul style={{ position: 'relative', listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: featured ? 'var(--cream-50)' : 'var(--text-body)' }}>
            <span style={{ flex: 'none', marginTop: 1, color: featured ? 'var(--bronze-400)' : 'var(--success)' }}><window.Icons.check size={16} /></span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pricing() {
  return (
    <window.Section tone="canvas" id="pricing">
      <window.Container>
        <window.SectionHead eyebrow="Simple pricing"
          title="Start free. Upgrade when you sell more."
          sub="No setup fees, no lock-in. Every plan includes hosting, leads, and mobile-ready templates." />
        <div className="dsp-price-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, marginTop: 60, alignItems: 'stretch' }}>
          {DSP_PRICING.map((p, i) => (
            <window.Reveal key={p.name} delay={i * 90} style={{ display: 'flex' }}>
              <div style={{ width: '100%' }}><PlanCard plan={p} /></div>
            </window.Reveal>
          ))}
        </div>
      </window.Container>
    </window.Section>
  );
}

function FaqRow({ item, open, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-default)' }}>
      <button onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        padding: '24px 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', letterSpacing: '-0.015em', color: 'var(--text-strong)' }}>{item.q}</span>
        <span style={{ flex: 'none', width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-strong)', transition: 'transform var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out)', transform: open ? 'rotate(45deg)' : 'none', background: open ? 'var(--cream-200)' : 'transparent' }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
        </span>
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? 220 : 0, transition: 'max-height var(--dur-base) var(--ease-out)' }}>
        <p style={{ margin: 0, padding: '0 48px 24px 4px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 1.6, color: 'var(--text-body)', textWrap: 'pretty' }}>{item.a}</p>
      </div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = React.useState(0);
  return (
    <window.Section tone="page" id="faq">
      <window.Container>
        <div className="dsp-faq-grid" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'start' }}>
          <window.Reveal>
            <window.SectionHead align="left" max={420} eyebrow="Questions"
              title="Everything you need to know."
              sub="Still unsure? Our team replies on WhatsApp within the hour." />
          </window.Reveal>
          <window.Reveal delay={100}>
            <div>
              {DSP_FAQ.map((item, i) => (
                <FaqRow key={item.q} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
              ))}
            </div>
          </window.Reveal>
        </div>
      </window.Container>
    </window.Section>
  );
}

Object.assign(window, { Pricing, Faq });
