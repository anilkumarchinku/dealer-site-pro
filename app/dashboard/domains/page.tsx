'use client'

import { useState, useEffect } from 'react'
import { Globe, Lock, CheckCircle, ArrowRight, Crown, Zap, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import ConnectCustomDomainModal from '@/components/ConnectCustomDomainModal'
import PurchaseManagedDomainModal from '@/components/PurchaseManagedDomainModal'
import DomainMonitoringWidget from '@/components/DomainMonitoringWidget'

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

export default function DomainSettingsPage() {
    const [domains, setDomains] = useState<Domain[]>([])
    const [loading, setLoading] = useState(true)
    const [showConnectModal, setShowConnectModal] = useState(false)
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)

    // TODO: Replace with actual dealer ID from auth
    const dealerId = 'temp-dealer-id'

    useEffect(() => {
        fetchDomains()
    }, [])

    async function fetchDomains() {
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

    const primaryDomain = domains.find(d => d.is_primary)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Domain Settings</h1>
                <p className="text-muted-foreground">Manage your website's domain and hosting</p>
            </div>

            {/* Monitoring Widget */}
            <DomainMonitoringWidget dealerId={dealerId} />

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
                                    "Use your own domain (abcmotors.com)",
                                    "Free SSL certificate",
                                    "Keep your subdomain as backup",
                                    "Easy DNS setup guide",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button onClick={() => setShowConnectModal(true)} className="w-full gap-2">
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
                                    "Domain purchase included",
                                    "Annual renewal included",
                                    "Email forwarding included",
                                    "100% managed by us",
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
                            q: "Can I use my free subdomain forever?",
                            a: `Yes! Your ${primaryDomain?.domain ?? "subdomain"} is completely free forever, even if you upgrade to a custom domain.`,
                        },
                        {
                            q: "What's the difference between PRO and PREMIUM?",
                            a: "PRO requires you to purchase your own domain from any registrar and connect it (we guide you through DNS setup). PREMIUM means we handle everything — domain purchase, renewal, and management.",
                        },
                        {
                            q: "How long does it take to connect a custom domain?",
                            a: "DNS changes typically take 5–30 minutes, but can take up to 48 hours. SSL certificates are provisioned automatically within 2–5 minutes after DNS verification.",
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
                dealerId={dealerId}
                onSuccess={fetchDomains}
            />
            <PurchaseManagedDomainModal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                dealerId={dealerId}
                onSuccess={fetchDomains}
            />
        </div>
    )
}
