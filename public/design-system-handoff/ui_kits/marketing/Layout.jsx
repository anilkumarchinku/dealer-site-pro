// DealerSite Pro — layout primitives for the landing page.
function Container({ children, wide = false, style = {} }) {
  return <div style={{ width: '100%', maxWidth: wide ? 'var(--container-wide)' : 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', ...style }}>{children}</div>;
}

// A full-bleed section. tone: 'stage' (dark) | 'canvas' (cream) | 'page'
function Section({ children, tone = 'page', id, style = {} }) {
  const bg = tone === 'stage' ? 'var(--surface-stage)' : (tone === 'canvas' ? 'var(--surface-canvas)' : 'var(--surface-page)');
  return (
    <section id={id} style={{ background: bg, paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)', ...style }}>
      {children}
    </section>
  );
}

// Centered section header: eyebrow + headline + optional sub.
function SectionHead({ eyebrow, title, sub, dark = false, align = 'center', max = 720 }) {
  const { Eyebrow } = window.DesignSystem_a49d67;
  return (
    <window.Reveal style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: align === 'center' ? 'center' : 'flex-start', textAlign: align, maxWidth: max, margin: align === 'center' ? '0 auto' : 0 }}>
      {eyebrow && <Eyebrow tone={dark ? 'dark' : 'light'}>{eyebrow}</Eyebrow>}
      <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.05, letterSpacing: 'var(--tracking-tight)', color: dark ? 'var(--cream-50)' : 'var(--text-strong)', textWrap: 'balance' }}>{title}</h2>
      {sub && <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', lineHeight: 1.55, color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-body)', maxWidth: 580, textWrap: 'pretty' }}>{sub}</p>}
    </window.Reveal>
  );
}

Object.assign(window, { Container, Section, SectionHead });
