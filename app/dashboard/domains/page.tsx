'use client'

import { useState, useEffect } from 'react'
import { Globe, Lock, CheckCircle, ArrowRight, Crown, Zap, HelpCircle, Copy, RefreshCw, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import ConnectCustomDomainModal from '@/components/ConnectCustomDomainModal'
import PurchaseManagedDomainModal from '@/components/PurchaseManagedDomainModal'
import DomainMonitoringWidget from '@/components/DomainMonitoringWidget'
import { useOnboardingStore } from '@/lib/store/onboarding-store'

interface Domain {
    id: string
    domain: string
    slug: string
    type: 'subdomain' | 'custom' | 'managed'
    status: string
    ssl_status: string
    is_primary: boolean
    created_at: string
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'active':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active + SSL
                </span>
            )
        case 'verifying':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Verifying
                </span>
            )
        case 'failed':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Failed
                </span>
            )
        default:
            // pending or anything else
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Pending DNS
                </span>
            )
    }
}

export default function DomainSettingsPage() {
    const [domains, setDomains] = useState<Domain[]>([])
    const [loading, setLoading] = useState(true)
    const [verifying, setVerifying] = useState(false)
    const [copiedCname, setCopiedCname] = useState(false)
    const [showConnectModal, setShowConnectModal] = useState(false)
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)

    const { dealerId } = useOnboardingStore()

    useEffect(() => {
        if (dealerId) fetchDomains()
    }, [dealerId])

    async function fetchDomains() {
        if (!dealerId) return
        try {
            const response = await fetch(`/api/domains?dealer_id=${dealerId}`)
            const data = await response.json()
            if (data.success) {
                setDomains(data.domains)
            }
        } catch (error) {
            console.error('Error fetching domains:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleVerifyDNS() {
        if (!dealerId) return
        setVerifying(true)
        try {
            const response = await fetch('/api/domains/verify-dns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dealerId }),
            })
            if (response.ok) {
                await fetchDomains()
            }
        } catch (error) {
            console.error('Error verifying DNS:', error)
        } finally {
            setVerifying(false)
        }
    }

    function handleCopyCname() {
        navigator.clipboard.writeText('cname.vercel-dns.com')
        setCopiedCname(true)
        setTimeout(() => setCopiedCname(false), 2000)
    }

    const primaryDomain = domains.find(d => d.is_primary)
    const customDomains = domains.filter(d => d.type === 'custom' || d.type === 'managed')
    const hasCustomDomain = customDomains.length > 0
    const pendingCustomDomain = customDomains.find(d => d.status === 'pending' || d.status === 'verifying')

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Domain Settings</h1>
                <p className="text-muted-foreground">Manage your website's domain and hosting</p>
            </div>

            {/* Monitoring Widget */}
            {dealerId && <DomainMonitoringWidget dealerId={dealerId} />}

            {/* Current Domain */}
            {loading ? (
                <Card variant="glass">
                    <CardContent className="py-8">
                        <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                            <div className="h-8 bg-muted rounded w-1/2"></div>
                        </div>
                    </CardContent>
                </Card>
            ) : primaryDomain ? (
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" />
                            Current Domain
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                            <p className="text-2xl font-mono font-bold text-blue-400">
                                {primaryDomain.domain}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-muted-foreground">
                                    Status: <strong className="text-emerald-500">{primaryDomain.status}</strong>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-emerald-500" />
                                <span className="text-muted-foreground">
                                    SSL: <strong className="text-emerald-500">Secure (HTTPS)</strong>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">
                                    Type: <strong className="text-foreground capitalize">{primaryDomain.type}</strong>
                                </span>
                            </div>
                        </div>
                        <Button asChild variant="outline">
                            <a href={`https://${primaryDomain.domain}`} target="_blank" rel="noopener noreferrer">
                                Visit Site
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card variant="glass" className="border-amber-500/20">
                    <CardContent className="py-6">
                        <p className="text-amber-400">
                            No domain found. Please complete onboarding to get your free subdomain.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* All Domains List */}
            {!loading && customDomains.length > 0 && (
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-violet-500" />
                            Your Domains
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {customDomains.map((d) => (
                            <div
                                key={d.id}
                                className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30"
                            >
                                <div>
                                    <p className="font-mono font-semibold">{d.domain}</p>
                                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{d.type} domain</p>
                                </div>
                                <StatusBadge status={d.status} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* DNS Setup Instructions — shown when a custom domain is pending/verifying */}
            {!loading && pendingCustomDomain && (
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            DNS Setup Instructions
                        </CardTitle>
                        <CardDescription>
                            Add this record in your domain registrar (GoDaddy, Namecheap, etc.) to connect{' '}
                            <strong>{pendingCustomDomain.domain}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-4 text-sm">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold">
                                    1
                                </span>
                                <span className="text-muted-foreground pt-0.5">
                                    Log into your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold">
                                    2
                                </span>
                                <span className="text-muted-foreground pt-0.5">
                                    Go to <strong className="text-foreground">DNS Management</strong> for{' '}
                                    <span className="font-mono">{pendingCustomDomain.domain}</span>
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold">
                                    3
                                </span>
                                <div className="pt-0.5 flex-1">
                                    <p className="text-muted-foreground mb-2">
                                        Add this <strong className="text-foreground">CNAME record</strong>:
                                    </p>
                                    <div className="rounded-xl border border-border bg-muted p-4 font-mono text-xs">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-muted-foreground mb-1">Type</p>
                                                <p className="font-bold">CNAME</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1">Host / Name</p>
                                                <p className="font-bold">@ (or www)</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1">Points to / Value</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold">cname.vercel-dns.com</p>
                                                    <button
                                                        onClick={handleCopyCname}
                                                        className="text-blue-500 hover:text-blue-400 flex items-center gap-1"
                                                        title="Copy to clipboard"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        <span>{copiedCname ? 'Copied!' : 'Copy'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-border text-muted-foreground">
                                            TTL: <span className="text-foreground">600</span>
                                            <span className="ml-4 text-xs">
                                                For www subdomain: add a separate CNAME with host{' '}
                                                <span className="text-foreground">www</span> pointing to the same value.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold">
                                    4
                                </span>
                                <div className="pt-0.5 flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">
                                        Save the record and wait <strong className="text-foreground">5–30 minutes</strong> for DNS to
                                        propagate (can take up to 24 hours in rare cases).
                                    </span>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold">
                                    5
                                </span>
                                <span className="text-muted-foreground pt-0.5">
                                    Come back here and click <strong className="text-foreground">Verify DNS</strong> below.
                                    SSL will be provisioned automatically within 2–5 minutes after verification.
                                </span>
                            </li>
                        </ol>

                        <Button
                            onClick={handleVerifyDNS}
                            disabled={verifying}
                            className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                        >
                            {verifying ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Checking DNS...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Verify DNS
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Connect Custom Domain CTA — shown when no custom domain exists yet */}
            {!loading && !hasCustomDomain && (
                <Card className="border-dashed border-2 hover:border-blue-500/50 transition-colors">
                    <CardContent className="p-8 text-center">
                        <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-bold text-lg mb-2">Connect Your Domain</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            Use your own domain like <span className="font-mono">bharat-hyundai.com</span> instead of a subdomain
                        </p>
                        <Button
                            onClick={() => setShowConnectModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            Connect Domain
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Upgrade Options */}
            <div>
                <h2 className="text-lg font-semibold mb-1">Upgrade to Custom Domain</h2>
                <p className="text-muted-foreground text-sm mb-6">
                    Stand out with your own professional domain name
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* PRO Plan */}
                    <Card variant="glass" className="border-blue-500/30 hover:border-blue-500/50 transition-colors">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-blue-500/10">
                                    <Zap className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">PRO</h3>
                                    <p className="text-2xl font-bold text-blue-400">
                                        ₹499<span className="text-sm font-normal text-muted-foreground">/month</span>
                                    </p>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm mb-4">
                                Already have a domain? Connect it to your DealerSite Pro website.
                            </p>

                            <ul className="space-y-2.5 mb-6">
                                {[
                                    'Use your own domain (abcmotors.com)',
                                    'Free SSL certificate',
                                    'Keep your subdomain as backup',
                                    'Easy DNS setup guide',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => setShowConnectModal(true)}
                                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                Connect My Domain
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">Phase 2 — Active</p>
                        </CardContent>
                    </Card>

                    {/* PREMIUM Plan */}
                    <Card variant="glass" className="border-violet-500/30 hover:border-violet-500/50 transition-colors">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-violet-500/10">
                                    <Crown className="w-6 h-6 text-violet-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">PREMIUM</h3>
                                    <p className="text-2xl font-bold text-violet-400">
                                        ₹999<span className="text-sm font-normal text-muted-foreground">/month</span>
                                    </p>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm mb-4">
                                Don't have a domain? We'll purchase and manage one for you — completely hands-off.
                            </p>

                            <ul className="space-y-2.5 mb-6">
                                {[
                                    'Domain purchase included',
                                    'Annual renewal included',
                                    'Email forwarding included',
                                    '100% managed by us',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => setShowPurchaseModal(true)}
                                className="w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                            >
                                Get My Domain
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">Phase 3 — Active</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Domain status legend */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Domain Status Guide
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-muted-foreground">Pending DNS — awaiting CNAME</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-muted-foreground">Verifying — DNS check in progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-muted-foreground">Active + SSL — fully working</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-muted-foreground">Failed — check DNS settings</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* FAQ */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-amber-500" />
                        Frequently Asked Questions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        {
                            q: 'Can I use my free subdomain forever?',
                            a: `Yes! Your ${primaryDomain?.domain ?? 'subdomain'} is completely free forever, even if you upgrade to a custom domain.`,
                        },
                        {
                            q: "What's the difference between PRO and PREMIUM?",
                            a: 'PRO requires you to purchase your own domain from any registrar and connect it (we guide you through DNS setup). PREMIUM means we handle everything — domain purchase, renewal, and management.',
                        },
                        {
                            q: 'How long does it take to connect a custom domain?',
                            a: 'DNS changes typically take 5–30 minutes, but can take up to 48 hours. SSL certificates are provisioned automatically within 2–5 minutes after DNS verification.',
                        },
                        {
                            q: 'What CNAME value should I use?',
                            a: 'Set a CNAME record pointing to cname.vercel-dns.com. Use "@" or your root domain as the host. For www, add a separate CNAME with host "www" pointing to the same value.',
                        },
                    ].map((faq, index) => (
                        <div key={index} className="p-4 rounded-xl bg-muted/30">
                            <h4 className="font-semibold mb-1">{faq.q}</h4>
                            <p className="text-sm text-muted-foreground">{faq.a}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Modals */}
            <ConnectCustomDomainModal
                isOpen={showConnectModal}
                onClose={() => setShowConnectModal(false)}
                dealerId={dealerId!}
                onSuccess={fetchDomains}
            />
            <PurchaseManagedDomainModal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                dealerId={dealerId!}
                onSuccess={fetchDomains}
            />
        </div>
    )
}
