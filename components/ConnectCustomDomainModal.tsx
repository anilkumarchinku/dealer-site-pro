'use client'

import { useState } from 'react'
import { X, Globe, Copy, Check, AlertCircle, Loader2, Palette } from 'lucide-react'
import { getDNSInstructions } from '@/lib/services/dns-verification-service'
import { allTemplates } from '@/lib/templates/template-styles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
    isOpen: boolean
    onClose: () => void
    dealerId: string
    onSuccess: () => void
}

type Step = 'enter-domain' | 'select-template' | 'dns-instructions' | 'verifying' | 'success' | 'failed'
type TemplateStyle = 'luxury' | 'family' | 'sporty' | 'professional'

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
        if (domain) {
            setStep('select-template')
        }
    }

    const handleSubmitDomain = async () => {
        setError('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/domains/connect-custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealerId,
                    customDomain: domain,
                    templateId: selectedTemplate
                })
            })

            const result = await response.json()

            if (result.success) {
                setDomainId(result.domain.id)
                setStep('dns-instructions')
            } else {
                // Show detailed error message
                let errorMessage = result.error || 'Failed to add domain'
                if (result.details && process.env.NODE_ENV === 'development') {
                    errorMessage += `\n\nDetails: ${result.details}`
                }
                setError(errorMessage)
                setStep('enter-domain')
            }
        } catch (err) {
            console.error('Error submitting domain:', err)
            setError('Network error. Please check your connection and try again.')
            setStep('enter-domain')
        } finally {
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
                body: JSON.stringify({ domainId, domain })
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
        } catch (err) {
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
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle>Connect Custom Domain</DialogTitle>
                            <p className="text-sm text-muted-foreground">PRO Tier - ₹499/month</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Step 1: Enter Domain */}
                    {step === 'enter-domain' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Your Domain Name
                                </label>
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
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-destructive whitespace-pre-wrap">{error}</div>
                                </div>
                            )}

                            <Button
                                onClick={handleContinueToTemplate}
                                disabled={!domain}
                                className="w-full"
                            >
                                Continue
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Select Template */}
                    {step === 'select-template' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Palette className="w-5 h-5 text-blue-600" />
                                    <p className="text-sm text-blue-900 font-semibold">
                                        Choose Your Website Style
                                    </p>
                                </div>
                                <p className="text-xs text-blue-700">
                                    Domain: <strong>{domain}</strong>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {allTemplates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                                            selectedTemplate === template.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {selectedTemplate === template.id && (
                                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">
                                                    {template.icon} {template.name}
                                                </h4>
                                                <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-xs text-gray-600">
                                    💡 <strong>Tip:</strong> You can change the template anytime from your dashboard settings.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-destructive whitespace-pre-wrap">{error}</div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep('enter-domain')}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSubmitDomain}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Continue'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: DNS Instructions */}
                    {step === 'dns-instructions' && dnsInstructions && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-900 font-semibold mb-2">
                                    📋 Configure these DNS records at your domain registrar:
                                </p>
                                <p className="text-xs text-blue-700">
                                    Domain: <strong>{domain}</strong> • Template: <strong className="capitalize">{selectedTemplate}</strong>
                                </p>
                            </div>

                            {/* DNS Records Table */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Value</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">TTL</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dnsInstructions.records.map((record, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="px-4 py-3 font-mono text-xs">{record.type}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{record.name}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{record.value}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{record.ttl}</td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => copyToClipboard(record.value, index)}
                                                        className="text-blue-600 hover:text-blue-700"
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

                            {/* Step-by-step instructions */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Step-by-Step Guide:</h3>
                                <ol className="space-y-2">
                                    {dnsInstructions.steps.map((stepText, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm text-gray-700">{stepText}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep('select-template')}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleVerifyDNS}
                                    className="flex-1"
                                >
                                    Verify Domain
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Verifying */}
                    {step === 'verifying' && (
                        <div className="py-12 text-center">
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifying DNS Records...</h3>
                            <p className="text-gray-600">This may take a few seconds</p>
                        </div>
                    )}

                    {/* Step 5: Success */}
                    {step === 'success' && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Domain Verified! 🎉</h3>
                            <p className="text-gray-600">Your custom domain is now connected and SSL is being provisioned.</p>
                            <p className="text-sm text-gray-500 mt-2">Template: <span className="capitalize font-semibold">{selectedTemplate}</span></p>
                        </div>
                    )}

                    {/* Step 6: Failed */}
                    {step === 'failed' && (
                        <div className="space-y-4">
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Verification Failed</h3>
                                        <p className="text-sm text-muted-foreground">{error}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                <p className="text-sm">
                                    <strong>Note:</strong> DNS changes can take up to 48 hours to propagate.
                                    Please wait a few minutes and try again.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep('dns-instructions')}
                                    className="flex-1"
                                >
                                    Review DNS Settings
                                </Button>
                                <Button
                                    onClick={handleVerifyDNS}
                                    className="flex-1"
                                >
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
