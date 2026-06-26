// DealerSite Pro — Testimonials: the human proof. Featured quote + supporting cards.
const DSP_TESTIMONIALS = {
  featured: {
    quote: 'We went from a Facebook page to a real website in one afternoon. Enquiries doubled in the first month — buyers finally take us seriously.',
    name: 'Rohit Sharma',
    role: 'Owner · Shrama Motors, Pune',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  cards: [
    { quote: 'The WhatsApp and call buttons alone paid for it. Every lead lands in one dashboard.', name: 'Priya Nair', role: 'Apex Auto Gallery', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    { quote: 'I sell bikes and EVs both — the layouts just fit. Setup took a cup of chai.', name: 'Amit Verma', role: 'Volt Motors, Nagpur', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
    { quote: 'Connected my own domain in minutes. Looks like an agency built it for lakhs.', name: 'Sana Khan', role: 'Khan Cars, Hyderabad', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
  ],
};

function QuoteMark({ color = 'var(--accent)' }) {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" fill={color} aria-hidden="true">
      <path d="M0 32V18C0 8 5 1.5 15 0l1.6 5C10.8 6.4 8 9.7 7.7 14H15v18H0zm22 0V18C22 8 27 1.5 37 0l1.6 5C32.8 6.4 30 9.7 29.7 14H37v18H22z" opacity="0.9"/>
    </svg>
  );
}

function Testimonials() {
  const { Avatar, Card } = window.DesignSystem_a49d67;
  const T = DSP_TESTIMONIALS;
  return (
    <window.Section tone="page" id="testimonials">
      <window.Container>
        <window.SectionHead eyebrow="Loved by dealers"
          title="Real showrooms. Real results."
          sub="Hundreds of dealers across India run their entire online presence on DealerSite Pro." />

        <div className="dsp-testi-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 24, marginTop: 56, alignItems: 'stretch' }}>
          {/* featured quote — dark editorial card */}
          <window.Reveal style={{ display: 'flex' }}>
            <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-stage)', borderRadius: 'var(--radius-2xl)', padding: 'clamp(32px, 4vw, 52px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32, width: '100%', boxShadow: 'var(--shadow-lg)' }}>
              <div aria-hidden="true" style={{ position: 'absolute', top: -120, right: -80, width: 360, height: 360, background: 'radial-gradient(circle, rgba(199,154,91,0.18), transparent 68%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <QuoteMark color="var(--bronze-400)" />
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--cream-50)', textWrap: 'pretty' }}>
                  “{T.featured.quote}”
                </p>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar src={T.featured.avatar} name={T.featured.name} size={52} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--cream-50)' }}>{T.featured.name}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-on-dark-muted)' }}>{T.featured.role}</div>
                </div>
              </div>
            </div>
          </window.Reveal>

          {/* supporting cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {T.cards.map((c, i) => (
              <window.Reveal key={c.name} delay={i * 80} style={{ display: 'flex' }}>
                <Card tone="card" padding="lg" radius="lg" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <span style={{ display: 'inline-flex', gap: 2, color: 'var(--accent)' }}>
                      {[0,1,2,3,4].map((s) => <window.Icons.star key={s} size={14} />)}
                    </span>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--text-body)', textWrap: 'pretty' }}>“{c.quote}”</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
                      <Avatar src={c.avatar} name={c.name} size={40} />
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-strong)' }}>{c.name}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{c.role}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </window.Reveal>
            ))}
          </div>
        </div>
      </window.Container>
    </window.Section>
  );
}

Object.assign(window, { Testimonials });
