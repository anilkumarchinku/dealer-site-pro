// DealerSite Pro — elevation sections: animated stats band + brand marquee.

// Count-up number that animates when scrolled into view.
function CountUp({ to, prefix = '', suffix = '', dur = 1400 }) {
  const ref = React.useRef(null);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVal(to); return; }
    const el = ref.current; if (!el) return;
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
      es.forEach((e) => { if (e.isIntersecting && !started) { started = true; run(performance.now()); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  const display = Number.isInteger(to) ? Math.round(val).toLocaleString('en-IN') : val.toFixed(1);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function StatsBand() {
  const stats = [
    { node: <CountUp to={500} suffix="+" />, label: 'Dealers onboarded', sub: 'across 12 Indian cities' },
    { node: <CountUp to={2400} suffix="+" />, label: 'Enquiries captured', sub: 'every single month' },
    { node: <span><CountUp to={48} />hrs</span>, label: 'Average time to live', sub: 'from first sign-up' },
    { node: <span><CountUp to={4.8} />/5</span>, label: 'Dealer satisfaction', sub: 'from 320+ reviews' },
  ];
  return (
    <div style={{ background: 'var(--surface-stage)', paddingBottom: 'var(--section-y)' }}>
      <window.Container wide>
        <window.Reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '1px solid var(--border-inverse)', borderBottom: '1px solid var(--border-inverse)' }} className="dsp-stats-band">
          {stats.map((s, i) => (
            <div key={s.label} className="dsp-stat-cell" style={{ padding: '40px clamp(16px, 3vw, 40px)', borderLeft: i === 0 ? 'none' : '1px solid var(--border-inverse)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.2rem, 4vw, 3.25rem)', letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--cream-50)' }}>{s.node}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--cream-50)', marginTop: 6 }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-on-dark-muted)' }}>{s.sub}</span>
            </div>
          ))}
        </window.Reveal>
      </window.Container>
    </div>
  );
}

function BrandStrip() {
  const brands = ['MARUTI SUZUKI', 'HYUNDAI', 'TATA MOTORS', 'MAHINDRA', 'HONDA', 'TOYOTA', 'ROYAL ENFIELD', 'KIA', 'TVS', 'ASHOK LEYLAND'];
  const Row = ({ ariaHidden }) => (
    <div aria-hidden={ariaHidden} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(36px, 6vw, 72px)', paddingRight: 'clamp(36px, 6vw, 72px)', flex: 'none' }}>
      {brands.map((b) => (
        <span key={b} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '0.04em', color: 'var(--stone-400)', whiteSpace: 'nowrap', flex: 'none' }}>{b}</span>
      ))}
    </div>
  );
  return (
    <div style={{ background: 'var(--surface-page)', borderBottom: '1px solid var(--border-default)', padding: '40px 0' }}>
      <window.Container wide>
        <p style={{ margin: '0 0 26px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Every brand on your floor — one website
        </p>
      </window.Container>
      <div className="dsp-marquee" style={{
        position: 'relative', overflow: 'hidden', display: 'flex',
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}>
        <div className="dsp-marquee-track" style={{ display: 'flex' }}>
          <Row /><Row ariaHidden />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CountUp, StatsBand, BrandStrip });
