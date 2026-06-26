// DealerSite Pro — scroll reveal (IntersectionObserver). Substitutes Framer
// Motion in this environment: fade + subtle rise, optional stagger delay.
// Honors prefers-reduced-motion.
function Reveal({ children, delay = 0, y = 22, as = 'div', style = {}, ...rest }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  const reduce = React.useRef(typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  React.useEffect(() => {
    if (reduce.current) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    // Already in (or near) the viewport on mount — reveal right away so
    // above-the-fold content (hero) never sits hidden.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.92) { setShown(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    // Safety net: never leave content invisible (covers capture/print edge cases).
    const t = setTimeout(() => setShown(true), 2600);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity var(--dur-reveal) var(--ease-out) ${delay}ms, transform var(--dur-reveal) var(--ease-out) ${delay}ms`,
        willChange: 'opacity, transform',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
window.Reveal = Reveal;
