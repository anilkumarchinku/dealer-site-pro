'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Globe, CheckCircle, Circle, Copy, Check, ArrowRight,
    ExternalLink, Zap, Crown, ChevronDown, ChevronUp, Car
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { dealerSiteUrl, brandToUrlSlug, BASE_DOMAIN } from '@/lib/utils/domain'

interface Props {
    dealerId: string
    dealershipName: string
    vehicleCount: number
    sellsNewCars: boolean
    sellsUsedCars: boolean
    brands: string[]         // from onboarding store
}

interface PrimaryDomain {
    domain: string
    slug: string
    type: 'subdomain' | 'custom' | 'managed'
    status: string
    is_primary: boolean
}

export default function WebsiteLiveBanner({
    dealerId, dealershipName, vehicleCount, sellsNewCars, sellsUsedCars, brands
}: Props) {
    const [domains, setDomains] = useState<PrimaryDomain[]>([])
    const [loading, setLoading] = useState(true)
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
    const [showDomainGuide, setShowDomainGuide] = useState(false)

    const isNewCarDealer  = sellsNewCars && !sellsUsedCars
    const isUsedCarDealer = sellsUsedCars && !sellsNewCars
    const isMultiBrand    = isNewCarDealer && brands.length > 1

    // ── Fetch domains ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!dealerId) return
        fetch('/api/domains')
            .then(r => r.json())
            .then(data => { if (data.success) setDomains(data.domains ?? []) })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [dealerId])

    const primaryDomain = domains.find(d => d.is_primary) ?? domains[0] ?? null
    const hasCustomDomain = domains.some(d => d.type === 'custom' || d.type === 'managed')

    // ── Brand-specific URLs for multi-brand new dealers ─────────────────────
    // e.g.  abhi-auto-motors-tata.dealersitepro.com   (subdomain mode)
    // e.g.  your-app.vercel.app/sites/abhi-auto-motors-tata  (path mode)
    const brandUrls = isMultiBrand && primaryDomain
        ? brands.map(brand => ({
            brand,
            url: dealerSiteUrl(`${primaryDomain.slug}-${brandToUrlSlug(brand)}`),
        }))
        : []

    const protocol = BASE_DOMAIN.startsWith('localhost') ? 'http' : 'https'
    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(`${protocol}://${url}`)
        setCopiedUrl(url)
        setTimeout(() => setCopiedUrl(null), 2000)
    }

    // ── Build checklist items ────────────────────────────────────────────────
    const checklist = [
        {
            label: 'Website created',
            done: true,
            description: 'Your dealership site is live at your free subdomain.',
            href: null,
        },
        // New-car dealers: no manual inventory needed — the brand catalog IS their stock
        // Used-car dealers: must add their stock manually
        isNewCarDealer
            ? {
                label: isMultiBrand
                    ? `${brands.length} brand websites ready`
                    : `${brands[0] ?? 'Brand'} catalog is live`,
                done: true,
                description: isMultiBrand
                    ? `You have ${brands.length} brand-specific websites with the full catalog for each.`
                    : `Your website shows the complete ${brands[0] ?? ''} catalog automatically.`,
                href: null,
            }
            : {
                label: vehicleCount > 0
                    ? `${vehicleCount} vehicle${vehicleCount > 1 ? 's' : ''} in stock`
                    : 'Add your first vehicle',
                done: vehicleCount > 0,
                description: vehicleCount > 0
                    ? 'Customers can browse your listed vehicles.'
                    : 'Add your used cars to start showing inventory.',
                href: vehicleCount === 0 ? '/dashboard/inventory/add' : '/dashboard/inventory',
            },
        {
            label: hasCustomDomain ? 'Custom domain connected' : 'Connect a custom domain',
            done: hasCustomDomain,
            description: hasCustomDomain
                ? 'You\'re on a custom domain — great for brand recognition!'
                : 'Upgrade to a professional domain (e.g. abcmotors.com) for ₹499/mo.',
            href: hasCustomDomain ? null : '/dashboard/domains',
        },
    ]

    const completedCount = checklist.filter(c => c.done).length

    return (
        <div className="space-y-4">
            {/* ── Live Status Card ──────────────────────────────────────── */}
            <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-blue-500/5">
                <CardContent className="p-5">
                    {/* Header row */}
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <Globe className="w-5 h-5 text-emerald-500" />
                                </div>
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-foreground">Your Website is Live!</p>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">LIVE</span>
                                </div>

                                {loading ? (
                                    <div className="h-4 w-48 bg-muted rounded animate-pulse mt-1" />
                                ) : primaryDomain ? (
                                    <>
                                        {/* Main URL */}
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <p className="text-sm text-muted-foreground font-mono truncate">
                                                https://<span className="text-blue-400">{primaryDomain.domain}</span>
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => copyUrl(primaryDomain.domain)}
                                                    className="text-muted-foreground hover:text-blue-400 transition-colors"
                                                    title="Copy URL"
                                                >
                                                    {copiedUrl === primaryDomain.domain
                                                        ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                        : <Copy className="w-3.5 h-3.5" />
                                                    }
                                                </button>
                                                <a
                                                    href={`${protocol}://${primaryDomain.domain}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-blue-400 transition-colors"
                                                    title="Visit site"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Brand-specific URLs for multi-brand dealers */}
                                        {brandUrls.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs text-muted-foreground font-semibold">Brand websites:</p>
                                                {brandUrls.map(({ brand, url }) => (
                                                    <div key={brand} className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                                        <p className="text-xs font-mono text-blue-400 truncate">{url}</p>
                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            <button
                                                                onClick={() => copyUrl(url)}
                                                                className="text-muted-foreground hover:text-blue-400 transition-colors"
                                                                title={`Copy ${brand} URL`}
                                                            >
                                                                {copiedUrl === url
                                                                    ? <Check className="w-3 h-3 text-emerald-500" />
                                                                    : <Copy className="w-3 h-3" />
                                                                }
                                                            </button>
                                                            <a
                                                                href={`${protocol}://${url}`}
                                                                target="_blank" rel="noopener noreferrer"
                                                                className="text-muted-foreground hover:text-blue-400 transition-colors"
                                                            >
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Setting up your domain...</p>
                                )}
                            </div>
                        </div>

                        {/* Visit button */}
                        {primaryDomain && (
                            <Button
                                size="sm"
                                asChild
                                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-shrink-0"
                            >
                                <a href={`${protocol}://${primaryDomain.domain}`} target="_blank" rel="noopener noreferrer">
                                    Visit Site <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        )}
                    </div>

                    {/* ── Setup Progress ─────────────────────────────────── */}
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-foreground">Setup Progress</p>
                            <span className="text-sm text-muted-foreground">{completedCount}/{checklist.length} complete</span>
                        </div>

                        <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                            />
                        </div>

                        <div className="grid sm:grid-cols-3 gap-2">
                            {checklist.map((item, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition-colors ${
                                        item.done
                                            ? 'bg-emerald-500/5 border-emerald-500/20'
                                            : 'bg-muted/30 border-border hover:border-blue-500/30'
                                    }`}
                                >
                                    {item.done
                                        ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        : <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                                    }
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold ${item.done ? 'text-emerald-400' : 'text-foreground'}`}>
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                            {item.description}
                                        </p>
                                        {!item.done && item.href && (
                                            <Link
                                                href={item.href}
                                                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1.5 font-medium"
                                            >
                                                Do it now <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dealer type hint */}
                        {isUsedCarDealer && vehicleCount === 0 && (
                            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-xs text-muted-foreground">
                                    💡 <strong className="text-foreground">You&apos;re a used car dealer</strong> — customers see only your listed stock.
                                    Go to <Link href="/dashboard/inventory/add" className="text-blue-400 underline">Add Vehicle</Link> to start adding cars.
                                </p>
                            </div>
                        )}
                        {isNewCarDealer && (
                            <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <p className="text-xs text-muted-foreground">
                                    <Car className="inline w-3.5 h-3.5 text-blue-400 mr-1" />
                                    <strong className="text-foreground">New car dealer</strong> — your website automatically shows the full catalog
                                    for {brands.join(', ')}. No manual inventory entry needed!
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── Domain Guidance — collapsible ─────────────────────────── */}
            <Card variant="glass">
                <CardContent className="p-0">
                    <button
                        onClick={() => setShowDomainGuide(v => !v)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10">
                                <Globe className="w-4 h-4 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">Domain Options — What should I do next?</p>
                                <p className="text-xs text-muted-foreground">Understand your website address options</p>
                            </div>
                        </div>
                        {showDomainGuide
                            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        }
                    </button>

                    {showDomainGuide && (
                        <div className="px-4 pb-4 space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Every DealerSite Pro account starts with a <strong className="text-foreground">free subdomain</strong>.
                                Upgrade anytime to a branded custom domain.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-3">
                                {/* FREE */}
                                <div className="p-3 rounded-xl bg-muted/30 border border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                            <Globe className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-foreground">FREE</p>
                                            <p className="text-xs text-emerald-500 font-semibold">₹0 / forever</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Your site at <span className="font-mono text-foreground/70">
                                            {primaryDomain?.domain ?? dealerSiteUrl(dealershipName.toLowerCase().replace(/\s+/g, '-'))}
                                        </span>
                                    </p>
                                    <p className="text-xs text-emerald-500 mt-1">✅ Already active!</p>
                                </div>

                                {/* PRO */}
                                <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-lg bg-blue-500/10">
                                            <Zap className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-foreground">PRO</p>
                                            <p className="text-xs text-blue-400 font-semibold">₹499/month</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Use <strong className="text-foreground">your own domain</strong> (e.g. abcmotors.com) from GoDaddy or Namecheap.
                                        We guide you step-by-step.
                                    </p>
                                    {!hasCustomDomain && (
                                        <Link href="/dashboard/domains">
                                            <Button size="sm" className="w-full mt-2 h-7 text-xs gap-1">
                                                Connect Domain <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>

                                {/* PREMIUM */}
                                <div className="p-3 rounded-xl border border-violet-500/30 bg-violet-500/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-lg bg-violet-500/10">
                                            <Crown className="w-4 h-4 text-violet-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-foreground">PREMIUM</p>
                                            <p className="text-xs text-violet-400 font-semibold">₹999/month</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">We buy & manage</strong> a domain for you.
                                        Includes renewal + email forwarding. 100% hands-off.
                                    </p>
                                    {!hasCustomDomain && (
                                        <Link href="/dashboard/domains">
                                            <Button
                                                size="sm"
                                                className="w-full mt-2 h-7 text-xs gap-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                                            >
                                                Get My Domain <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                                💡 <strong className="text-foreground">Tip:</strong> Your free subdomain stays active even after upgrading — it&apos;s always your backup URL. Custom domains build trust and are easier to share on business cards.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
