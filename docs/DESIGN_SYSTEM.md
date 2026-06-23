# Design System — "2 skins, 1 kit"

This app deliberately renders **two visual skins** on top of **one shared component kit**.
Knowing which skin a surface belongs to tells you which color approach to use.

## The shared UI kit — `components/ui/*`
Token-driven shadcn primitives (`button`, `input`, `textarea`, `select`, `checkbox`,
`badge`, `tabs`, `dialog`, `popover`, `sheet`, `table`, `separator`, `label`, `slider`).
They use **semantic tokens only** (`bg-background`, `text-foreground`, `border-input`,
`bg-popover`, `bg-accent`, `bg-primary`, `ring-ring`, …) so they adapt to light/dark and to
the active skin automatically. **Do not** hardcode grays in these primitives.

Tokens are defined in `app/globals.css` and mapped in `tailwind.config.ts`:
neutral set (`background/foreground/card/muted/border/input/ring/popover/accent/secondary`),
brand (`primary`), and status (`success/warning/info/destructive`, each with `-foreground`).

## Skin 1 — App skin (tokens + dark mode)
**Surfaces:** dashboard, tools, auth (login + register), the standalone listing/detail
pages (`/cars`, `/bikes`, `/autos`), brands, compare.
**Rule:** use semantic tokens + `dark:` variants. The dashboard "premium" card vocabulary is
`rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80`, headers via
`PremiumPageHeader`, headings `font-black tracking-tight`. Status chips must include `dark:`
variants (or use the `success/warning/info/destructive` tokens).

## Skin 2 — Public dealer-site skin (fixed light + per-brand)
**Surfaces:** the 4 templates (Modern/Luxury/Sporty/Family) + the 2W/3W templates, rendered
under `.dealer-site-surface` (`app/sites/[slug]/layout.tsx`), which forces a light palette.
**Rule:** this skin is **intentionally light-independent of the app theme** — a dealer's public
site must look the same regardless of the operator's dark-mode preference. So these templates
use a **fixed light palette** (`bg-white`/`text-gray-900`/`border-gray-200`), NOT the app
tokens, and inject the dealer's brand color at runtime (per-dealer hex via inline `style`).
Shared pieces: `components/templates/shared/SocialLinks.tsx` (footer icons), and a single
canonical contact-form input style:
`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2`
with the brand ring via `style={{ '--tw-ring-color': <brand> }}`.

> Per-template *character* (Luxury serif/light, Sporty black/uppercase, Family rounded/warm,
> Modern clean) is intentional and should be preserved.

## Marketing brand — landing + onboarding (intentional exception)
**Surfaces:** the marketing landing page (`app/welcome-client-v2.tsx`) and the onboarding
wizard (`components/onboarding/*`, `app/onboarding/**`).
**Decision:** these are a deliberate, internally-consistent **marketing brand** built on a
literal-hex palette (`#071436` navy, `#155EEF` blue, …). They are **kept as-is** (not migrated
to tokens) — they're cohesive and purpose-built, and forcing app tokens would dilute the
marketing look without clear benefit. Revisit only during an intentional brand refresh.
(Auth pages — login + register — were converged to the **app skin**, so the auth pair matches.)

## Open follow-ups (not yet done)
- Structural de-duplication of the template **nav + footer shells** across the 4 templates
  (~2,400 duplicated lines). Deferred because it's a customer-facing structural refactor best
  done with visual QA on a running preview.
- Optional: a per-dealer brand-variable layer (`--brand` from the dealer hex) to replace the
  remaining inline brand-color `style` usages in templates.
