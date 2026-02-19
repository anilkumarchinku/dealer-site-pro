'use client'

import { useState } from 'react'
import {
    X, Globe, Copy, Check, ExternalLink,
    Link2, ShoppingBag, ChevronRight,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { dealerSiteHref, dealerSiteUrl } from '@/lib/utils/domain'
import ConnectCustomDomainModal from '@/components/ConnectCustomDomainModal'
import PurchaseManagedDomainModal from '@/components/PurchaseManagedDomainModal'

interface SiteInfo {
    slug: string
    label: string
}

interface Props {
    site: SiteInfo
    dealerId: string
    dealerName: string
    onClose: () => void
}

type SubModal = 'custom' | 'managed' | null

export function SiteDomainModal({ site, dealerId, dealerName, onClose }: Props) {
    const [copied, setCopied] = useState(false)
    const [subModal, setSubModal] = useState<SubModal>(null)

    const freeUrl     = dealerSiteUrl(site.slug)
    const freeUrlFull = dealerSiteHref(site.slug)

    function handleCopy() {
        navigator.clipboard.writeText(freeUrlFull)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Sub-modal open → hide this modal's visible content but keep it mounted
    // so it's still in the tree when sub-modal closes
    if (subModal === 'custom') {
        return (
            <ConnectCustomDomainModal
                isOpen
                onClose={() => setSubModal(null)}
                dealerId={dealerId}
                onSuccess={() => { setSubModal(null); onClose() }}
            />
        )
    }
    if (subModal === 'managed') {
        return (
            <PurchaseManagedDomainModal
                isOpen
                onClose={() => setSubModal(null)}
                dealerId={dealerId}
                onSuccess={() => { setSubModal(null); onClose() }}
            />
        )
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        Domain Settings
                        {site.label !== dealerName && (
                            <span className="ml-1 text-sm font-normal text-muted-foreground">
                                — {site.label}
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 pt-1">

                    {/* ── Option 1: Free subdomain (always active) ── */}
                    <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    Free Subdomain
                                </span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide">
                                Active
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <a
                                href={freeUrlFull}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-sm font-mono text-blue-500 hover:underline truncate"
                            >
                                {freeUrl}
                            </a>
                            <button
                                onClick={handleCopy}
                                className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="Copy URL"
                            >
                                {copied
                                    ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                            </button>
                            <a
                                href={freeUrlFull}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="Open site"
                            >
                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                            </a>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            Always available — your permanent free address.
                        </p>
                    </div>

                    {/* ── Option 2: Connect custom domain ── */}
                    <button
                        onClick={() => setSubModal('custom')}
                        className="w-full rounded-xl border border-border hover:border-blue-500/50 hover:bg-blue-500/5 p-4 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Link2 className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Connect Your Domain</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        e.g. tata.abhimotors.com &nbsp;·&nbsp; ₹499/month
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 pl-12">
                            Point a domain you already own to this site. Add a CNAME record — we verify and connect it automatically.
                        </p>
                    </button>

                    {/* ── Option 3: Buy a managed domain ── */}
                    <button
                        onClick={() => setSubModal('managed')}
                        className="w-full rounded-xl border border-border hover:border-indigo-500/50 hover:bg-indigo-500/5 p-4 text-left transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Buy a New Domain</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        e.g. abhimotorstata.in &nbsp;·&nbsp; ₹999/month
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 pl-12">
                            Search for an available domain. We register and manage it for you — DNS, SSL, renewals all included.
                        </p>
                    </button>

                </div>

                <Button variant="ghost" size="sm" onClick={onClose} className="w-full mt-1">
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    )
}
