'use client'

import { useState, useEffect } from 'react'
import { Globe, Lock, CheckCircle, ArrowRight, Zap, HelpCircle, Copy, RefreshCw, XCircle, Clock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import ConnectCustomDomainModal from '@/components/ConnectCustomDomainModal'
import DomainMonitoringWidget from '@/components/DomainMonitoringWidget'
import { useOnboardingStore } from '@/lib/store/onboarding-store'
import { PremiumPageHeader } from '@/components/dashboard/premium-ui'

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

type ProStatus = {
    active: boolean
    pricePaise: number
    plan: string
    status: string
}

type MxRecord = {
    exchange: string
    priority: number
}

type MxResult = {
    hasMx: boolean
    records: MxRecord[]
    message: string
} | null

function StatusBadge({ status, sslStatus }: { status: string; sslStatus: string }) {
    if (status === 'failed' || sslStatus === 'failed') {
        return (
            <Badge variant="outline" className="gap-1.5 bg-destructive/10 text-destructive border-destructive/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Failed
            </Badge>
        )
    }

    if (status === 'active' && sslStatus === 'active') {
        return (
            <Badge variant="outline" className="gap-1.5 bg-green-500/10 text-green-600 border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                HTTPS active
            </Badge>
        )
    }

    if (status === 'active' && sslStatus === 'provisioning') {
        return (
            <Badge variant="outline" className="gap-1.5 bg-primary/10 text-primary border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                SSL provisioning
            </Badge>
        )
    }

    return (
        <Badge variant="outline" className="gap-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            DNS pending
        </Badge>
    )
}

export default function DomainSettingsPage() {
    const [domains, setDomains] = useState<Domain[]>([])
    const [loading, setLoading] = useState(true)
    const [verifying, setVerifying] = useState(false)
    const [copiedCname, setCopiedCname] = useState(false)
    const [showConnectModal, setShowConnectModal] = useState(false)
    const [proStatus, setProStatus] = useState<ProStatus | null>(null)
    const [mxChecking, setMxChecking] = useState(false)
    const [mxResult, setMxResult] = useState<MxResult>(null)
    const [emailSupportSending, setEmailSupportSending] = useState(false)
    const [emailSupportMessage, setEmailSupportMessage] = useState('')
    const [emailSupportNotes, setEmailSupportNotes] = useState('')
    const [sslCheckingDomainId, setSslCheckingDomainId] = useState<string | null>(null)
    const [sslCheckMessage, setSslCheckMessage] = useState('')

    const { dealerId } = useOnboardingStore()

    useEffect(() => {
        fetchDomains()
        fetchProStatus()
        return;
    }, [dealerId])

    async function fetchDomains() {
        try {
            const response = await fetch('/api/domains')
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

    async function fetchProStatus() {
        try {
            const response = await fetch('/api/domains/pro-status')
            const data = await response.json()
            if (data.success) {
                setProStatus(data.pro)
            }
        } catch (error) {
            console.error('Error fetching PRO status:', error)
        }
    }

    async function handleVerifyDNS() {
        if (!pendingCustomDomain) return
        setVerifying(true)
        try {
            const response = await fetch('/api/domains/verify-dns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    domainId: pendingCustomDomain.id,
                    domain: pendingCustomDomain.domain,
                    dealerId,
                }),
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
        navigator.clipboard.writeText(process.env.NEXT_PUBLIC_CNAME_TARGET ?? 'cname.vercel-dns.com')
        setCopiedCname(true)
        setTimeout(() => setCopiedCname(false), 2000)
    }

    async function handleCheckEmailRecords(domain: Domain) {
        if (!dealerId) return
        setMxChecking(true)
        setEmailSupportMessage('')
        try {
            const response = await fetch('/api/domains/check-email-records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domainId: domain.id, domain: domain.domain, dealerId }),
            })
            const data = await response.json()
            if (data.success) {
                setMxResult({
                    hasMx: data.hasMx,
                    records: data.records ?? [],
                    message: data.message,
                })
            } else {
                setEmailSupportMessage(data.error || 'Could not check email records.')
            }
        } catch {
            setEmailSupportMessage('Could not check email records.')
        } finally {
            setMxChecking(false)
        }
    }

    async function handleRequestEmailSupport(domain: Domain) {
        if (!dealerId) return
        setEmailSupportSending(true)
        setEmailSupportMessage('')
        try {
            const response = await fetch('/api/domains/email-support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    domainId: domain.id,
                    domain: domain.domain,
                    dealerId,
                    notes: emailSupportNotes,
                }),
            })
            const data = await response.json()
            if (data.success) {
                setEmailSupportMessage(data.message)
                setMxResult({
                    hasMx: data.mxStatus === 'found',
                    records: data.mxRecords ?? [],
                    message: data.mxStatus === 'found'
                        ? 'MX records found. Our team will help you preserve them.'
                        : 'No MX records found. Our team will help you set them up.',
                })
            } else {
                setEmailSupportMessage(data.error || 'Could not send support request.')
            }
        } catch {
            setEmailSupportMessage('Could not send support request.')
        } finally {
            setEmailSupportSending(false)
        }
    }

    async function handleCheckSSL(domain: Domain) {
        if (!dealerId) return
        setSslCheckingDomainId(domain.id)
        setSslCheckMessage('')
        try {
            const response = await fetch('/api/domains/check-ssl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domainId: domain.id, domain: domain.domain, dealerId }),
            })
            const data = await response.json()
            if (data.success) {
                setSslCheckMessage(data.message)
                await fetchDomains()
            } else {
                setSslCheckMessage(data.error || 'Could not check SSL status.')
            }
        } catch {
            setSslCheckMessage('Could not check SSL status.')
        } finally {
            setSslCheckingDomainId(null)
        }
    }

    const primaryDomain = domains.find(d => d.is_primary)
    const customDomains = domains.filter(d => d.type === 'custom' || d.type === 'managed')
    const hasCustomDomain = customDomains.length > 0
    const pendingCustomDomain = customDomains.find(d => d.status === 'pending' || d.status === 'verifying')
    const emailSupportDomain = customDomains[0] ?? null
    const proPrice = proStatus ? `₹${(proStatus.pricePaise / 100).toLocaleString('en-IN')}/month` : '₹499/month'

    return (
        <div className="space-y-6 animate-fade-in">
            <PremiumPageHeader
                eyebrow="Website"
                title="Domain manager"
                description="Manage your free subdomain, custom domain, DNS verification, SSL status, and hosting health."
                actions={
                    <Button
                        onClick={() => setShowConnectModal(true)}
                        disabled={!dealerId}
                        className="h-11 rounded-xl gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Globe className="h-4 w-4" />
                        Connect Domain
                    </Button>
                }
            />

            {/* Monitoring Widget */}
            {dealerId && <DomainMonitoringWidget dealerId={dealerId} />}

            {/* Current Domain */}
            {loading ? (
                <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardContent className="py-8">
                        <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                            <div className="h-8 bg-muted rounded w-1/2"></div>
                        </div>
                    </CardContent>
                </Card>
            ) : primaryDomain ? (
                <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            Current Domain
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
                            <p className="break-all text-xl font-mono font-bold text-blue-400 sm:text-2xl">
                                {primaryDomain.domain}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-muted-foreground">
                                    Status: <strong className="text-green-500">{primaryDomain.status}</strong>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-green-500" />
                                <span className="text-muted-foreground">
                                    SSL: <strong className={primaryDomain.ssl_status === 'active' ? 'text-green-500' : 'text-amber-500'}>
                                        {primaryDomain.ssl_status === 'active'
                                            ? 'HTTPS active'
                                            : primaryDomain.ssl_status === 'provisioning'
                                                ? 'SSL provisioning'
                                                : 'Pending'}
                                    </strong>
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
                <Card variant="glass" className="rounded-2xl border-amber-500/20 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardContent className="py-6">
                        <p className="text-amber-400">
                            No domain found. Please complete onboarding to get your free subdomain.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* All Domains List */}
            {!loading && customDomains.length > 0 && (
                <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
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
                                className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="break-all font-mono font-semibold">{d.domain}</p>
                                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                                        {d.type} domain · SSL {d.ssl_status}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <StatusBadge status={d.status} sslStatus={d.ssl_status} />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCheckSSL(d)}
                                        disabled={sslCheckingDomainId === d.id || !dealerId}
                                        className="gap-2"
                                    >
                                        {sslCheckingDomainId === d.id ? (
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Lock className="w-3.5 h-3.5" />
                                        )}
                                        Check SSL
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {sslCheckMessage && (
                            <p className="text-sm text-muted-foreground">{sslCheckMessage}</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* DNS Setup Instructions — shown when a custom domain is pending/verifying */}
            {!loading && pendingCustomDomain && (
                <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
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
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                    1
                                </span>
                                <span className="text-muted-foreground pt-0.5">
                                    Log into your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                    2
                                </span>
                                <span className="text-muted-foreground pt-0.5">
                                    Go to <strong className="text-foreground">DNS Management</strong> for{' '}
                                    <span className="font-mono">{pendingCustomDomain.domain}</span>
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                    3
                                </span>
                                <div className="pt-0.5 flex-1">
                                    <p className="text-muted-foreground mb-2">
                                        Add this <strong className="text-foreground">CNAME record</strong>:
                                    </p>
                                    <div className="rounded-xl border border-border bg-muted p-4 font-mono text-xs">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                    <p className="break-all font-bold">{process.env.NEXT_PUBLIC_CNAME_TARGET ?? 'cname.vercel-dns.com'}</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={handleCopyCname}
                                                        className="h-7 w-full px-1.5 text-primary hover:text-blue-400 font-normal text-xs gap-1 sm:h-6 sm:w-auto"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        {copiedCname ? 'Copied!' : 'Copy'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-border text-muted-foreground">
                                            TTL: <span className="text-foreground">600</span>
                                            <span className="mt-1 block text-xs sm:ml-4 sm:mt-0 sm:inline">
                                                For www subdomain: add a separate CNAME with host{' '}
                                                <span className="text-foreground">www</span> pointing to the same value.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
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
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
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
                            className="mt-6 bg-primary hover:bg-primary/90 gap-2"
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

            {!loading && emailSupportDomain && (
                <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" />
                            Professional Email Setup
                        </CardTitle>
                        <CardDescription>
                            Check existing MX records before changing DNS, then request help if you want us to preserve or set up email.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-muted-foreground">
                            Keep existing MX records if you already use Google Workspace, Zoho, Microsoft 365, or another mail provider.
                            Website DNS uses A/CNAME records; email usually depends on MX records.
                        </div>

                        {mxResult && (
                            <div className={`rounded-xl border p-4 text-sm ${mxResult.hasMx
                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                }`}>
                                <p className="font-semibold">{mxResult.message}</p>
                                {mxResult.records.length > 0 && (
                                    <ul className="mt-2 space-y-1 font-mono text-xs">
                                        {mxResult.records.map((record) => (
                                            <li key={`${record.exchange}-${record.priority}`}>
                                                {record.exchange} · priority {record.priority}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        <Textarea
                            value={emailSupportNotes}
                            onChange={(event) => setEmailSupportNotes(event.target.value)}
                            maxLength={1000}
                            rows={3}
                            placeholder="Optional notes, current email provider, or what help you need"
                        />

                        {emailSupportMessage && (
                            <p className="text-sm text-muted-foreground">{emailSupportMessage}</p>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleCheckEmailRecords(emailSupportDomain)}
                                disabled={mxChecking || !dealerId}
                                className="gap-2"
                            >
                                {mxChecking ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Mail className="w-4 h-4" />
                                )}
                                Check MX Records
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleRequestEmailSupport(emailSupportDomain)}
                                disabled={emailSupportSending || !dealerId}
                                className="gap-2 bg-primary hover:bg-primary/90"
                            >
                                {emailSupportSending ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <HelpCircle className="w-4 h-4" />
                                )}
                                Request Email Support
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Connect Custom Domain CTA — shown when no custom domain exists yet */}
            {!loading && !hasCustomDomain && (
                <Card className="rounded-2xl border-dashed border-2 border-border/80 bg-card/90 shadow-sm transition-colors hover:border-primary/50 dark:bg-card/80">
                    <CardContent className="p-8 text-center">
                        <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-bold text-lg mb-2">Connect Your Domain</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            Use your own domain like <span className="font-mono">bharat-hyundai.com</span> instead of a subdomain
                        </p>
                        <Button
                            onClick={() => setShowConnectModal(true)}
                            disabled={!dealerId}
                            className="bg-primary hover:bg-primary/90"
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

                <div className="max-w-md">
                    {/* PRO Plan */}
                    <Card variant="glass" className="rounded-2xl border-primary/30 bg-card/90 shadow-sm transition-colors hover:border-primary/50 dark:bg-card/80">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-primary/10">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold">PRO</h3>
                                        <Badge variant="outline" className={proStatus?.active ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600' : 'border-amber-500/30 bg-amber-500/10 text-amber-600'}>
                                            {proStatus?.active ? 'Active' : proStatus?.status === 'trialing' ? 'Payment pending' : 'Not active'}
                                        </Badge>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-400">
                                        {proPrice}<span className="text-sm font-normal text-muted-foreground"> — Custom Domain</span>
                                    </p>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm mb-4">
                                Pay for PRO, connect your own domain, then verify DNS and SSL from this dashboard.
                            </p>

                            <ul className="space-y-2.5 mb-6">
                                {[
                                    'Use your existing domain (abcmotors.com)',
                                    'Free SSL certificate with HTTPS status',
                                    'Keep your subdomain as backup',
                                    'Step-by-step DNS setup guide',
                                    'Professional email setup support',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => setShowConnectModal(true)}
                                disabled={!dealerId}
                                className="w-full gap-2 bg-primary hover:bg-primary/90"
                            >
                                {proStatus?.active ? 'Connect My Domain' : 'Activate PRO & Connect Domain'}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Domain status legend */}
            <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Domain Status Guide
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 md:grid-cols-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-muted-foreground">DNS pending — awaiting A/CNAME</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-muted-foreground">SSL provisioning — HTTPS is being issued</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-muted-foreground">HTTPS active — fully working</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="w-3.5 h-3.5 text-destructive" />
                            <span className="text-muted-foreground">Failed — check DNS settings</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* FAQ */}
            <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
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
                            q: 'How long does it take to connect a custom domain?',
                            a: 'DNS changes typically take 5–30 minutes, but can take up to 48 hours. SSL certificates are provisioned automatically within 2–5 minutes after DNS verification.',
                        },
                        {
                            q: 'What CNAME value should I use?',
                            a: `Set a CNAME record pointing to ${process.env.NEXT_PUBLIC_CNAME_TARGET ?? 'cname.vercel-dns.com'}. Use "@" or your root domain as the host. For www, add a separate CNAME with host "www" pointing to the same value.`,
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
                dealerId={dealerId ?? ''}
                onSuccess={() => {
                    fetchDomains()
                    fetchProStatus()
                }}
            />
        </div>
    )
}
