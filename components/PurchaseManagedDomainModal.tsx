'use client'

import { useState, useEffect } from 'react'
import { X, Search, Loader2, Check, AlertCircle, Crown } from 'lucide-react'
import type { DomainAvailability } from '@/lib/services/domain-search-service'

interface Props {
    isOpen: boolean
    onClose: () => void
    dealerId: string
    onSuccess: () => void
}

export default function PurchaseManagedDomainModal({ isOpen, onClose, dealerId, onSuccess }: Props) {
    const [step, setStep] = useState<'search' | 'contact' | 'confirm' | 'purchasing' | 'success'>('search')
    const [query, setQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<DomainAvailability[]>([])
    const [selectedDomain, setSelectedDomain] = useState<DomainAvailability | null>(null)
    const [contactInfo, setContactInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'IN'
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
        } catch (err) {
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

    const handlePurchase = async () => {
        if (!selectedDomain) return

        setStep('purchasing')
        setError('')

        try {
            const response = await fetch('/api/domains/purchase-managed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealerId,
                    domain: selectedDomain.domain,
                    contactInfo
                })
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
        } catch (err) {
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

    const formatPrice = (paise: number) => {
        return `₹${(paise / 100).toLocaleString('en-IN')}`
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Crown className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Get Managed Domain</h2>
                            <p className="text-sm text-gray-600">PREMIUM Tier - ₹999/month</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Step 1: Search */}
                    {step === 'search' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Search for your perfect domain
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="abcmotors"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        disabled={!query || isSearching}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSearching ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-5 h-5" />
                                                Search
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            {results.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Available Domains:</h3>
                                    <div className="space-y-2">
                                        {results.map((result, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center justify-between p-4 border rounded-lg ${result.available
                                                    ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 cursor-pointer'
                                                    : 'border-gray-200 bg-gray-50 opacity-50'
                                                    }`}
                                                onClick={() => handleSelectDomain(result)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {result.available ? (
                                                        <Check className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-red-600" />
                                                    )}
                                                    <span className="font-mono font-semibold text-gray-900">{result.domain}</span>
                                                </div>
                                                <div className="text-right">
                                                    {result.available ? (
                                                        <>
                                                            <p className="font-bold text-purple-600">{formatPrice(result.price!)}/year</p>
                                                            <p className="text-xs text-gray-600">Click to select</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-gray-600">Taken</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Contact Info */}
                    {step === 'contact' && selectedDomain && (
                        <div className="space-y-4">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                                <p className="text-sm font-semibold text-purple-900">Selected Domain:</p>
                                <p className="text-lg font-mono font-bold text-purple-600">{selectedDomain.domain}</p>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-3">Contact Information (for WHOIS):</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={contactInfo.name}
                                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={contactInfo.email}
                                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={contactInfo.phone}
                                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={contactInfo.city}
                                    onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Address"
                                value={contactInfo.address}
                                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={contactInfo.state}
                                    onChange={(e) => setContactInfo({ ...contactInfo, state: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Postal Code"
                                    value={contactInfo.postalCode}
                                    onChange={(e) => setContactInfo({ ...contactInfo, postalCode: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setStep('search')}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep('confirm')}
                                    disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                                    className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm & Pay */}
                    {step === 'confirm' && selectedDomain && (
                        <div className="space-y-6">
                            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                                <h3 className="font-bold text-purple-900 text-lg mb-4">Order Summary</h3>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Domain:</span>
                                        <span className="font-mono font-semibold">{selectedDomain.domain}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Registration (1 year):</span>
                                        <span className="font-semibold">{formatPrice(selectedDomain.price!)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">PREMIUM Subscription:</span>
                                        <span className="font-semibold">₹999/month</span>
                                    </div>
                                    <div className="border-t border-purple-200 pt-3 flex justify-between">
                                        <span className="font-bold text-gray-900">First Payment:</span>
                                        <span className="font-bold text-purple-600">{formatPrice(selectedDomain.price! + 99900)}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-purple-700">
                                    Includes domain registration + first month of PREMIUM hosting
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('contact')}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePurchase}
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700"
                                >
                                    Purchase Domain
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Purchasing */}
                    {step === 'purchasing' && (
                        <div className="py-12 text-center">
                            <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchasing Domain...</h3>
                            <p className="text-gray-600">This will take just a moment</p>
                        </div>
                    )}

                    {/* Step 5: Success */}
                    {step === 'success' && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Domain Purchased! 🎉</h3>
                            <p className="text-gray-600">
                                Your domain is being configured automatically. You'll receive an email with details.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
