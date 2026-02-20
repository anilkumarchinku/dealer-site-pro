'use client'

import { useState } from 'react'
import { X, Globe, Copy, Check, AlertCircle, Loader2, Palette, CreditCard } from 'lucide-react'
import { getDNSInstructions } from '@/lib/services/dns-verification-service'
import { allTemplates, TemplateStyle } from '@/lib/templates/template-styles'
import { openRazorpayCheckout, type RazorpaySuccessResponse } from '@/lib/utils/razorpay'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
    isOpen: boolean
    onClose: () => void
    dealerId: string
    onSuccess: () => void
}

type Step = 'enter-domain' | 'select-template' | 'payment' | 'dns-instructions' | 'verifying' | 'success' | 'failed'

export default function ConnectCustomDomainModal({ isOpen, onClose, dealerId, onSuccess }: Props) {
    const [step, setStep] = useState<Step>('enter-domain')
    const [domain, setDomain] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('family')
    const [domainId, setDomainId] = useState('')
    const [error, setError] = useState('')
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen) return null

    const dnsInstructions = domain ? getDNSInstructions(domain) : null

    const handleContinueToTemplate = () => {
        if (domain) setStep('select-template')
    }

    // Step 2 → create domain record → payment → DNS instructions
    const handleProceedToPayment = async () => {
        setError('')
        setIsLoading(true)
        setStep('payment')

        try {
            // 1. Create domain record first (pending status) to get a domain_id
            const domainRes = await fetch('/api/domains/connect-custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dealerId, customDomain: domain, templateId: selectedTemplate }),
            })
            const domainData = await domainRes.json()

            if (!domainData.success) {
                setError(domainData.error || 'Failed to register domain')
                setStep('select-template')
                setIsLoading(false)
                return
            }

            const createdDomainId = domainData.domain.id
            setDomainId(createdDomainId)

            // 2. Create Razorpay subscription with domain_id
            const subRes = await fetch('/api/payments/create-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dealerId, tier: 'pro', domainId: createdDomainId }),
            })
            const subData = await subRes.json()

            if (!subData.success) {
                setError(subData.error || 'Failed to initialise payment')
                setStep('select-template')
                setIsLoading(false)
                return
            }

            // 3. Open Razorpay checkout (mock or real)
            openRazorpayCheckout({
                subscriptionId: subData.subscriptionId,
                tier: 'pro',
                onSuccess: async (paymentData: RazorpaySuccessResponse) => {
                    // 4. Verify payment
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId: subData.orderId,
                            paymentId: paymentData.razorpay_payment_id,
                            signature: paymentData.razorpay_signature,
                            subscriptionId: paymentData.razorpay_subscription_id,
                        }),
                    })
                    const verifyData = await verifyRes.json()

                    if (!verifyData.success) {
                        setError('Payment verification failed. Please contact support.')
                        setStep('select-template')
                        setIsLoading(false)
                        return
                    }

                    // 5. Done — show DNS instructions
                    setStep('dns-instructions')
                    setIsLoading(false)
                },
                onFailure: (err) => {
                    setError(err.error || 'Payment failed. Please try again.')
                    setStep('select-template')
                    setIsLoading(false)
                },
            })
        } catch {
            setError('Payment initialisation failed. Please try again.')
            setStep('select-template')
            setIsLoading(false)
        }
    }

    const handleVerifyDNS = async () => {
        setStep('verifying')
        setError('')

        try {
            const response = await fetch('/api/domains/verify-dns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domainId, domain }),
            })
            const result = await response.json()

            if (result.success && result.verification.allVerified) {
                setStep('success')
                setTimeout(() => {
                    onSuccess()
                    handleClose()
                }, 2000)
            } else {
                setStep('failed')
                setError(result.verification?.message || 'DNS verification failed')
            }
        } catch {
            setStep('failed')
            setError('Failed to verify DNS. Please try again.')
        }
    }

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const handleClose = () => {
        setStep('enter-domain')
        setDomain('')
        setSelectedTemplate('family')
        setDomainId('')
        setError('')
        setIsLoading(false)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <Globe className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <DialogTitle>Connect Custom Domain</DialogTitle>
                            <p className="text-sm text-muted-foreground">PRO Tier – ₹499/month</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Step 1: Enter Domain */}
                    {step === 'enter-domain' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Your Domain Name</label>
                                <Input
                                    type="text"
                                    placeholder="example.com"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value.toLowerCase().trim())}
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Enter the domain you own (purchased from GoDaddy, Namecheap, etc.)
                                </p>
                            </div>

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-destructive whitespace-pre-wrap">{error}</div>
                                </div>
                            )}

                            <Button onClick={handleContinueToTemplate} disabled={!domain} className="w-full">
                                Continue
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Select Template */}
                    {step === 'select-template' && (
                        <div className="space-y-4">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Palette className="w-5 h-5 text-blue-500" />
                                    <p className="text-sm text-foreground font-semibold">Choose Your Website Style</p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Domain: <strong className="text-foreground">{domain}</strong>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {allTemplates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                                            selectedTemplate === template.id
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-border hover:border-muted-foreground/40 hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {selectedTemplate === template.id && (
                                                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-foreground">
                                                    {template.icon} {template.name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                                <CreditCard className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold text-foreground">PRO Plan – ₹499/month</p>
                                    <p className="text-muted-foreground mt-0.5">
                                        You'll complete payment via Razorpay on the next step. Includes free SSL and DNS setup guide.
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-destructive whitespace-pre-wrap">{error}</div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep('enter-domain')} className="flex-1">
                                    Back
                                </Button>
                                <Button onClick={handleProceedToPayment} disabled={isLoading} className="flex-1">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Pay & Connect Domain
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Payment in progress (Razorpay popup is open) */}
                    {step === 'payment' && (
                        <div className="py-12 text-center">
                            <CreditCard className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">Complete Payment</h3>
                            <p className="text-muted-foreground">
                                Complete the payment in the Razorpay popup to continue.
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Do not close this window.
                            </p>
                        </div>
                    )}

                    {/* Step 3: DNS Instructions */}
                    {step === 'dns-instructions' && dnsInstructions && (
                        <div className="space-y-6">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                                    ✅ Payment successful! Now configure DNS.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Domain: <strong className="text-foreground">{domain}</strong>
                                </p>
                            </div>

                            <div className="border border-border rounded-xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Type</th>
                                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Name</th>
                                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Value</th>
                                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">TTL</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {dnsInstructions.records.map((record, index) => (
                                            <tr key={index} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-mono text-xs">{record.type}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{record.name}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{record.value}</td>
                                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{record.ttl}</td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => copyToClipboard(record.value, index)}
                                                        className="text-blue-500 hover:text-blue-400 transition-colors"
                                                    >
                                                        {copiedIndex === index ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Step-by-Step Guide:</h3>
                                <ol className="space-y-2">
                                    {dnsInstructions.steps.map((stepText, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm text-muted-foreground">{stepText}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <Button onClick={handleVerifyDNS} className="w-full">
                                Verify Domain
                            </Button>
                        </div>
                    )}

                    {/* Verifying */}
                    {step === 'verifying' && (
                        <div className="py-12 text-center">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Verifying DNS Records...</h3>
                            <p className="text-muted-foreground">This may take a few seconds</p>
                        </div>
                    )}

                    {/* Success */}
                    {step === 'success' && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Domain Connected! 🎉</h3>
                            <p className="text-muted-foreground">
                                Your custom domain is live. SSL is being provisioned automatically.
                            </p>
                        </div>
                    )}

                    {/* Failed */}
                    {step === 'failed' && (
                        <div className="space-y-4">
                            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">Verification Failed</h3>
                                    <p className="text-sm text-muted-foreground">{error}</p>
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                <p className="text-sm text-muted-foreground">
                                    DNS changes can take up to 48 hours to propagate. Please wait a few minutes and try again.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep('dns-instructions')} className="flex-1">
                                    Review DNS Settings
                                </Button>
                                <Button onClick={handleVerifyDNS} className="flex-1">
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
