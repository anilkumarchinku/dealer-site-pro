'use client'

import { useState } from 'react'
import { X, Search, Loader2, Check, AlertCircle, Crown, CreditCard } from 'lucide-react'
import { openRazorpayCheckout, type RazorpaySuccessResponse } from '@/lib/utils/razorpay'
import type { DomainAvailability } from '@/lib/services/domain-search-service'

interface Props {
    isOpen: boolean
    onClose: () => void
    dealerId: string
    onSuccess: () => void
}

export default function PurchaseManagedDomainModal({ isOpen, onClose, dealerId, onSuccess }: Props) {
    const [step, setStep] = useState<'search' | 'contact' | 'confirm' | 'payment' | 'purchasing' | 'success'>('search')
    const [query, setQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<DomainAvailability[]>([])
    const [selectedDomain, setSelectedDomain] = useState<DomainAvailability | null>(null)
    const [contactInfo, setContactInfo] = useState({
        name: '', email: '', phone: '',
        address: '', city: '', state: '', postalCode: '', country: 'IN',
    })
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSearch = async () => {
        if (!query.trim()) return
        setIsSearching(true)
        setError('')
        try {
            const response = await fetch(`/api/domains/search?query=${encodeURIComponent(query)}`)
            const data = await response.json()
            if (data.success) {
                setResults(data.results)
            } else {
                setError(data.error || 'Search failed')
            }
        } catch {
            setError('Failed to search domains. Please try again.')
        } finally {
            setIsSearching(false)
        }
    }

    const handleSelectDomain = (domain: DomainAvailability) => {
        if (!domain.available) return
        setSelectedDomain(domain)
        setStep('contact')
    }

    // confirm → open Razorpay → verify → purchase domain
    const handleProceedToPayment = async () => {
        if (!selectedDomain) return
        setError('')
        setStep('payment')

        try {
            // 1. Create PREMIUM subscription
            const subRes = await fetch('/api/payments/create-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dealerId, tier: 'premium' }),
            })
            const subData = await subRes.json()

            if (!subData.success) {
                setError(subData.error || 'Failed to initialise payment')
                setStep('confirm')
                return
            }

            // 2. Open Razorpay checkout
            openRazorpayCheckout({
                subscriptionId: subData.subscriptionId,
                tier: 'premium',
                prefill: {
                    name: contactInfo.name,
                    email: contactInfo.email,
                    contact: contactInfo.phone,
                },
                onSuccess: async (paymentData: RazorpaySuccessResponse) => {
                    // 3. Verify payment
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
                        setStep('confirm')
                        return
                    }

                    // 4. Purchase domain
                    await purchaseDomain()
                },
                onFailure: (err) => {
                    setError(err.error || 'Payment failed. Please try again.')
                    setStep('confirm')
                },
            })
        } catch {
            setError('Payment initialisation failed. Please try again.')
            setStep('confirm')
        }
    }

    const purchaseDomain = async () => {
        if (!selectedDomain) return
        setStep('purchasing')
        setError('')

        try {
            const response = await fetch('/api/domains/purchase-managed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dealerId, domain: selectedDomain.domain, contactInfo }),
            })
            const data = await response.json()

            if (data.success) {
                setStep('success')
                setTimeout(() => {
                    onSuccess()
                    handleClose()
                }, 3000)
            } else {
                setError(data.error || 'Purchase failed')
                setStep('confirm')
            }
        } catch {
            setError('Failed to purchase domain. Please try again.')
            setStep('confirm')
        }
    }

    const handleClose = () => {
        setStep('search')
        setQuery('')
        setResults([])
        setSelectedDomain(null)
        setError('')
        onClose()
    }

    const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-background border border-border rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-500/10 rounded-xl">
                            <Crown className="w-6 h-6 text-violet-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Get Managed Domain</h2>
                            <p className="text-sm text-muted-foreground">PREMIUM Tier – ₹999/month</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Step 1: Search */}
                    {step === 'search' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Search for your perfect domain
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="abcmotors"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="flex-1 px-4 py-3 border border-input bg-background rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        disabled={!query || isSearching}
                                        className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                                    >
                                        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                        {isSearching ? 'Searching...' : 'Search'}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            {results.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold mb-3">Available Domains:</h3>
                                    {results.map((result, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectDomain(result)}
                                            className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
                                                result.available
                                                    ? 'border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 cursor-pointer'
                                                    : 'border-border bg-muted/30 opacity-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {result.available
                                                    ? <Check className="w-5 h-5 text-emerald-500" />
                                                    : <X className="w-5 h-5 text-red-500" />
                                                }
                                                <span className="font-mono font-semibold">{result.domain}</span>
                                            </div>
                                            <div className="text-right">
                                                {result.available ? (
                                                    <>
                                                        <p className="font-bold text-violet-500">{formatPrice(result.price!)}/year</p>
                                                        <p className="text-xs text-muted-foreground">Click to select</p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">Taken</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Contact Info */}
                    {step === 'contact' && selectedDomain && (
                        <div className="space-y-4">
                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                                <p className="text-sm font-semibold text-violet-400">Selected Domain:</p>
                                <p className="text-lg font-mono font-bold">{selectedDomain.domain}</p>
                            </div>

                            <h3 className="font-semibold">Contact Information (for WHOIS):</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { key: 'name', placeholder: 'Full Name' },
                                    { key: 'email', placeholder: 'Email', type: 'email' },
                                    { key: 'phone', placeholder: 'Phone', type: 'tel' },
                                    { key: 'city', placeholder: 'City' },
                                ].map(({ key, placeholder, type = 'text' }) => (
                                    <input
                                        key={key}
                                        type={type}
                                        placeholder={placeholder}
                                        value={(contactInfo as any)[key]}
                                        onChange={(e) => setContactInfo({ ...contactInfo, [key]: e.target.value })}
                                        className="px-4 py-2 border border-input bg-background rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                    />
                                ))}
                            </div>

                            <input
                                type="text"
                                placeholder="Address"
                                value={contactInfo.address}
                                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                                className="w-full px-4 py-2 border border-input bg-background rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text" placeholder="State"
                                    value={contactInfo.state}
                                    onChange={(e) => setContactInfo({ ...contactInfo, state: e.target.value })}
                                    className="px-4 py-2 border border-input bg-background rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                />
                                <input
                                    type="text" placeholder="Postal Code"
                                    value={contactInfo.postalCode}
                                    onChange={(e) => setContactInfo({ ...contactInfo, postalCode: e.target.value })}
                                    className="px-4 py-2 border border-input bg-background rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setStep('search')} className="flex-1 py-3 border border-border rounded-xl font-semibold hover:bg-muted/30 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep('confirm')}
                                    disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                                    className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm & Pay */}
                    {step === 'confirm' && selectedDomain && (
                        <div className="space-y-6">
                            <div className="border-2 border-violet-500/30 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Domain:</span>
                                        <span className="font-mono font-semibold">{selectedDomain.domain}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Registration (1 year):</span>
                                        <span className="font-semibold">{formatPrice(selectedDomain.price!)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">PREMIUM Subscription:</span>
                                        <span className="font-semibold">₹999/month</span>
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between">
                                        <span className="font-bold">First Payment:</span>
                                        <span className="font-bold text-violet-500">{formatPrice(selectedDomain.price! + 99900)}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Includes domain registration + first month PREMIUM subscription
                                </p>
                            </div>

                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 flex items-start gap-3">
                                <CreditCard className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    Payment is securely processed via <strong className="text-foreground">Razorpay</strong>.
                                    You'll be redirected to complete payment in a popup.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => setStep('contact')} className="flex-1 py-3 border border-border rounded-xl font-semibold hover:bg-muted/30 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={handleProceedToPayment}
                                    className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Pay & Purchase Domain
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Payment in progress */}
                    {step === 'payment' && (
                        <div className="py-12 text-center">
                            <CreditCard className="w-16 h-16 text-violet-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Complete Payment</h3>
                            <p className="text-muted-foreground">Complete the payment in the Razorpay popup to continue.</p>
                            <p className="text-xs text-muted-foreground mt-2">Do not close this window.</p>
                        </div>
                    )}

                    {/* Purchasing */}
                    {step === 'purchasing' && (
                        <div className="py-12 text-center">
                            <Loader2 className="w-16 h-16 text-violet-500 animate-spin mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Purchasing Domain...</h3>
                            <p className="text-muted-foreground">This will take just a moment</p>
                        </div>
                    )}

                    {/* Success */}
                    {step === 'success' && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Domain Purchased! 🎉</h3>
                            <p className="text-muted-foreground">
                                Your domain is being configured automatically. You'll receive an email with details.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
