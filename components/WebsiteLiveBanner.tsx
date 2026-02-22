'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Globe, CheckCircle, Circle, Copy, Check, ArrowRight,
    ExternalLink, Zap, Crown, ChevronDown, ChevronUp, Car,
    Rocket, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { dealerSiteHref, brandToUrlSlug } from '@/lib/utils/domain'

interface Props {
    dealerId: string
    dealershipName: string
    vehicleCount: number
    sellsNewCars: boolean
    sellsUsedCars: boolean
    brands: string[]
    slug: string
}

interface Deployment {
    id: string
    status: string
    site_url: string | null
    github_repo: string | null
}

export default function WebsiteLiveBanner({
    dealerId, dealershipName, vehicleCount, sellsNewCars, sellsUsedCars, brands, slug
}: Props) {
    const [deployment,      setDeployment]      = useState<Deployment | null>(null)
    const [hasCustomDomain, setHasCustomDomain] = useState(false)
    const [loading,         setLoading]         = useState(true)
    const [copiedUrl,       setCopiedUrl]       = useState(false)
    const [showDomainGuide, setShowDomainGuide] = useState(false)

    const isNewCarDealer  = sellsNewCars && !sellsUsedCars
    const isUsedCarDealer = sellsUsedCars && !sellsNewCars
    const isHybridDealer  = sellsNewCars && sellsUsedCars

    // Build the live site links based on dealer type
    const siteLinks = (() => {
        if (!slug) return []
        if (isHybridDealer) {
            return [
                {
                    label: 'New Cars Site',
                    sublabel: brands[0] ?? 'New Cars',
                    href: dealerSiteHref(`${slug}-${brandToUrlSlug(brands[0] ?? 'new')}`),
                    color: 'blue' as const,
                    icon: '🚗',
                },
                {
                    label: 'Pre-Owned Site',
                    sublabel: 'Used Cars',
                    href: dealerSiteHref(`${slug}-used`),
                    color: 'amber' as const,
                    icon: '🔁',
                },
            ]
        }
        if (isNewCarDealer) {
            // Multi-brand: one link per brand; single brand: one main link
            if (brands.length > 1) {
                return brands.map(brand => ({
                    label: `${brand} Site`,
                    sublabel: 'New Cars',
                    href: dealerSiteHref(`${slug}-${brandToUrlSlug(brand)}`),
                    color: 'blue' as const,
                    icon: '🚗',
                }))
            }
            return [{
                label: 'New Cars Site',
                sublabel: brands[0] ?? 'New Cars',
                href: dealerSiteHref(brands.length === 1 ? `${slug}-${brandToUrlSlug(brands[0])}` : slug),
                color: 'blue' as const,
                icon: '🚗',
            }]
        }
        // Used-only
        return [{
            label: 'Pre-Owned Site',
            sublabel: 'Used Cars',
            href: dealerSiteHref(slug),
            color: 'amber' as const,
            icon: '🔁',
        }]
    })()

    useEffect(() => {
        if (!dealerId) return
        async function load() {
            try {
                // Fetch most recent Vercel deployment
                const { data: dep } = await supabase
                    .from('dealer_deployments')
                    .select('id, status, site_url, github_repo')
                    .eq('dealer_id', dealerId)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()
                setDeployment(dep ?? null)

                // Check for custom domain (for checklist)
                const { data: doms } = await supabase
                    .from('domains')
                    .select('type')
                    .eq('dealer_id', dealerId)
                if (doms) setHasCustomDomain(doms.some(d => d.type === 'custom' || d.type === 'managed'))
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [dealerId])

    const isLive  = deployment?.status === 'ready' && !!deployment?.site_url
    const siteUrl = deployment?.site_url ?? null

    const copyUrl = () => {
        if (!siteUrl) return
        navigator.clipboard.writeText(siteUrl)
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
    }

    const checklist = [
        {
            label: 'Website created',
            done:  true,
            description: 'Your dealership site is ready to be published.',
            href:  null,
        },
        isNewCarDealer
            ? {
                label: `${brands[0] ?? 'Brand'} catalog is live`,
                done:  true,
                description: `Your website automatically shows the full ${brands[0] ?? ''} catalog.`,
                href:  null,
            }
            : {
                label: vehicleCount > 0
                    ? `${vehicleCount} vehicle${vehicleCount > 1 ? 's' : ''} in stock`
                    : 'Add your first vehicle',
                done:  vehicleCount > 0,
                description: vehicleCount > 0
                    ? 'Customers can browse your listed vehicles.'
                    : 'Add your used cars to start showing inventory.',
                href:  vehicleCount === 0 ? '/dashboard/inventory/add' : '/dashboard/inventory',
            },
        {
            label: hasCustomDomain ? 'Custom domain connected' : 'Connect a custom domain',
            done:  hasCustomDomain,
            description: hasCustomDomain
                ? 'You\'re on a custom domain — great for brand recognition!'
                : 'Upgrade to a professional domain (e.g. abcmotors.com) for ₹499/mo.',
            href:  hasCustomDomain ? null : '/dashboard/domains',
        },
    ]

    const completedCount = checklist.filter(c => c.done).length

    if (loading) {
        return (
            <Card className="border-border">
                <CardContent className="p-5 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Loading site status…</span>
                </CardContent>
            </Card>
        )
    }

    const linkColors = {
        blue:  { card: 'border-blue-500/30 bg-blue-500/5 hover:border-blue-400/60 hover:bg-blue-500/10', icon: 'bg-blue-500/15 border-blue-500/30', text: 'text-blue-400', btn: 'text-blue-400 hover:text-blue-300' },
        amber: { card: 'border-amber-500/30 bg-amber-500/5 hover:border-amber-400/60 hover:bg-amber-500/10', icon: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', btn: 'text-amber-400 hover:text-amber-300' },
    }

    return (
        <div className="space-y-4">
            {/* ── My Websites ─────────────────────────────────────────────────── */}
            {siteLinks.length > 0 && (
                <Card className="border-border">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <p className="text-sm font-semibold text-foreground">
                                My Website{siteLinks.length > 1 ? 's' : ''}
                            </p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                {siteLinks.length} site{siteLinks.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className={`grid gap-3 ${siteLinks.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                            {siteLinks.map((site) => {
                                const c = linkColors[site.color]
                                return (
                                    <a
                                        key={site.href}
                                        href={site.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${c.card}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 text-lg ${c.icon}`}>
                                            {site.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{site.label}</p>
                                            <p className={`text-xs truncate ${c.text}`}>{site.sublabel}</p>
                                            <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
                                                {site.href.replace('https://', '').replace('http://', '')}
                                            </p>
                                        </div>
                                        <ExternalLink className={`w-4 h-4 flex-shrink-0 transition-colors ${c.btn}`} />
                                    </a>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Status Card ─────────────────────────────────────────────────── */}
            {isLive ? (
                /* DEPLOYED — show Vercel URL */
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
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <p className="text-sm font-mono text-blue-400 truncate">{siteUrl}</p>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={copyUrl} className="text-muted-foreground hover:text-blue-400 transition-colors" title="Copy URL">
                                                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                            <a href={siteUrl!} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                size="sm" asChild
                                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-shrink-0"
                            >
                                <a href={siteUrl!} target="_blank" rel="noopener noreferrer">
                                    Visit Site <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>

                        {/* Checklist */}
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
                                            : <Circle      className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                                        }
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-semibold ${item.done ? 'text-emerald-400' : 'text-foreground'}`}>
                                                {item.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                                            {!item.done && item.href && (
                                                <Link href={item.href} className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1.5 font-medium">
                                                    Do it now <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {isUsedCarDealer && vehicleCount === 0 && (
                                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-xs text-muted-foreground">
                                        💡 <strong className="text-foreground">Used car dealer</strong> — go to{' '}
                                        <Link href="/dashboard/inventory/add" className="text-blue-400 underline">Add Vehicle</Link>{' '}
                                        to start listing stock.
                                    </p>
                                </div>
                            )}
                            {isNewCarDealer && (
                                <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <p className="text-xs text-muted-foreground">
                                        <Car className="inline w-3.5 h-3.5 text-blue-400 mr-1" />
                                        <strong className="text-foreground">New car dealer</strong> — your website automatically shows the full catalog for {brands.join(', ')}.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                /* NOT DEPLOYED — show Go Live CTA */
                <Card className="border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
                    <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                                    <Rocket className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">Ready to Go Live?</p>
                                    <p className="text-sm text-muted-foreground">
                                        Publish your dealership site to get a public URL. Takes under a minute.
                                    </p>
                                </div>
                            </div>
                            <Link href="/dashboard/webpage">
                                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-shrink-0">
                                    <Rocket className="w-4 h-4" />
                                    Go Live
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Domain Guidance — collapsible ─────────────────────────────── */}
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
                            ? <ChevronUp   className="w-4 h-4 text-muted-foreground" />
                            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        }
                    </button>

                    {showDomainGuide && (
                        <div className="px-4 pb-4 space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Every DealerSite Pro account starts with a <strong className="text-foreground">free Vercel subdomain</strong>.
                                Upgrade anytime to a branded custom domain.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-3">
                                {/* FREE */}
                                <div className="p-3 rounded-xl bg-muted/30 border border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                            <Rocket className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-foreground">FREE</p>
                                            <p className="text-xs text-emerald-500 font-semibold">₹0 / forever</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Your site at a free <span className="font-mono text-foreground/70">dealer-name.vercel.app</span> URL after going live.
                                    </p>
                                    <p className="text-xs text-emerald-500 mt-1">✅ Included with every account</p>
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
                                        <strong className="text-foreground">We buy & manage</strong> a domain for you. Includes renewal + email forwarding.
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
                                💡 <strong className="text-foreground">Tip:</strong> Your free Vercel URL stays active even after upgrading — it&apos;s always your backup. Custom domains build trust and are easier to share on business cards.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
