/**
 * Verification Selector
 * Choose domain ownership verification method
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Mail, Download, Copy, CheckCircle2 } from 'lucide-react';

interface VerificationSelectorProps {
    domain: string;
    verificationToken: string;
    onMethodSelected: (method: 'dns_txt' | 'html_file' | 'email') => void;
    isVerifying?: boolean;
}

export function VerificationSelector({
    domain,
    verificationToken,
    onMethodSelected,
    isVerifying = false
}: VerificationSelectorProps) {
    const [selectedMethod, setSelectedMethod] = useState<'dns_txt' | 'html_file' | 'email' | null>(null);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const verificationMethods = [
        {
            id: 'dns_txt' as const,
            icon: Shield,
            title: 'DNS TXT Record',
            description: 'Add a TXT record to your domain\'s DNS settings',
            difficulty: 'Intermediate',
            time: '10-15 minutes',
            recommended: true,
            steps: [
                'Log in to your domain registrar',
                'Go to DNS settings',
                'Add a TXT record',
                'Wait for DNS propagation'
            ]
        },
        {
            id: 'html_file' as const,
            icon: FileText,
            title: 'HTML File Upload',
            description: 'Upload a verification file to your website',
            difficulty: 'Easy',
            time: '5 minutes',
            recommended: false,
            steps: [
                'Download verification file',
                'Upload to website root',
                'Verify file is accessible',
                'Complete verification'
            ]
        },
        {
            id: 'email' as const,
            icon: Mail,
            title: 'Email Verification',
            description: 'Verify via email sent to domain admin',
            difficulty: 'Easy',
            time: '5-10 minutes',
            recommended: false,
            steps: [
                'Check admin email',
                'Click verification link',
                'Return to this page',
                'Complete setup'
            ]
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Verify Domain Ownership</CardTitle>
                            <CardDescription>
                                Choose how you'd like to verify that you own <strong>{domain}</strong>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Verification Methods */}
            <div className="grid md:grid-cols-3 gap-4">
                {verificationMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;

                    return (
                        <Card
                            key={method.id}
                            className={`cursor-pointer transition-all ${
                                isSelected
                                    ? 'border-blue-600 border-2 bg-blue-50'
                                    : 'hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedMethod(method.id)}
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                            isSelected ? 'bg-blue-600' : 'bg-gray-100'
                                        }`}>
                                            <Icon className={`w-5 h-5 ${
                                                isSelected ? 'text-white' : 'text-gray-600'
                                            }`} />
                                        </div>
                                        {method.recommended && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                                Recommended
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4 flex-grow">
                                        {method.description}
                                    </p>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Difficulty:</span>
                                            <span className="font-medium">{method.difficulty}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Time:</span>
                                            <span className="font-medium">{method.time}</span>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Steps:</p>
                                            <ul className="text-xs space-y-1">
                                                {method.steps.map((step, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Verification Token Display */}
            {selectedMethod && (
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-bold mb-4">Your Verification Token</h3>

                        <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <code className="text-sm font-mono break-all">
                                    {verificationToken}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(verificationToken)}
                                    className="ml-2"
                                >
                                    {copied ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {selectedMethod === 'html_file' && (
                            <Button
                                variant="outline"
                                className="w-full mb-4"
                                onClick={() => {
                                    window.open(`/api/domain/download-verification-file?token=${verificationToken}`, '_blank');
                                }}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Verification File
                            </Button>
                        )}

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => onMethodSelected(selectedMethod)}
                            disabled={isVerifying}
                        >
                            {isVerifying ? 'Starting Verification...' : 'Continue with This Method'}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
