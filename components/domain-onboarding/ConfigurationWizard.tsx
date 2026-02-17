/**
 * Configuration Wizard
 * Guide users through DNS configuration with registrar-specific instructions
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Settings,
    Copy,
    CheckCircle2,
    ExternalLink,
    FileText,
    Video,
    AlertCircle
} from 'lucide-react';

interface ConfigurationWizardProps {
    targetDomain: string;
    dnsInstructions: any;
    manualConfiguration: any;
    cloudflareOption: any;
    registrar?: string;
    onContinue: () => void;
}

export function ConfigurationWizard({
    targetDomain,
    dnsInstructions,
    manualConfiguration,
    cloudflareOption,
    registrar = 'unknown',
    onContinue
}: ConfigurationWizardProps) {
    const [copiedRecord, setCopiedRecord] = useState<number | null>(null);
    const [configMethod, setConfigMethod] = useState<'manual' | 'cloudflare'>('manual');

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedRecord(index);
        setTimeout(() => setCopiedRecord(null), 2000);
    };

    const getRegistrarHelp = () => {
        const help = manualConfiguration.registrar_specific_help;
        return help[registrar] || help.other;
    };

    const registrarLogos: Record<string, string> = {
        godaddy: '🌐',
        namecheap: '🔷',
        bigrock: '🗻',
        hostgator: '🐊',
        bluehost: '🔵',
        cloudflare: '☁️',
        other: '🌍'
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Settings className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Configure DNS Records</CardTitle>
                            <CardDescription>
                                Set up DNS for <strong>{targetDomain}</strong>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Configuration Method Selector */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card
                    className={`cursor-pointer transition-all ${
                        configMethod === 'manual'
                            ? 'border-2 border-blue-600'
                            : 'hover:border-gray-400'
                    }`}
                    onClick={() => setConfigMethod('manual')}
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Most Common
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Manual Configuration</h3>
                        <p className="text-sm text-gray-600">
                            Add DNS records directly at your registrar
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className={`cursor-pointer transition-all ${
                        configMethod === 'cloudflare'
                            ? 'border-2 border-orange-600'
                            : 'hover:border-gray-400'
                    }`}
                    onClick={() => setConfigMethod('cloudflare')}
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="text-4xl">☁️</div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Faster
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Cloudflare Setup</h3>
                        <p className="text-sm text-gray-600">
                            Automated DNS with free SSL and CDN
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Manual Configuration */}
            {configMethod === 'manual' && (
                <>
                    {/* Registrar Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{registrarLogos[registrar]}</span>
                                <div>
                                    <CardTitle className="text-lg capitalize">
                                        {registrar === 'unknown' ? 'Your Registrar' : registrar} Instructions
                                    </CardTitle>
                                    <CardDescription>
                                        {getRegistrarHelp()}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Step-by-Step Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Follow These Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-4">
                                {manualConfiguration.steps.map((step: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {idx + 1}
                                        </span>
                                        <span className="pt-1">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>

                    {/* DNS Records to Add */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">DNS Records to Add</CardTitle>
                            <CardDescription>
                                Copy each record exactly as shown below
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dnsInstructions.records_to_add.map((record: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold mb-2">
                                                    Record {idx + 1}
                                                </span>
                                                <p className="text-sm text-gray-600">{record.description}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(record.value, idx)}
                                            >
                                                {copiedRecord === idx ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 font-medium">Type:</span>
                                                <p className="font-mono font-bold">{record.type}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 font-medium">Name:</span>
                                                <p className="font-mono font-bold">{record.name}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-gray-500 font-medium">Value:</span>
                                                <p className="font-mono font-bold break-all">{record.value}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 font-medium">TTL:</span>
                                                <p className="font-mono font-bold">{record.ttl}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Help Resources */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-grow">
                                    <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                                    <div className="space-y-2">
                                        <a
                                            href="#"
                                            className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
                                        >
                                            <Video className="w-4 h-4" />
                                            Watch video tutorial
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View detailed guide
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Cloudflare Configuration */}
            {configMethod === 'cloudflare' && cloudflareOption.available && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Cloudflare Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {cloudflareOption.benefits.map((benefit: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Update Your Nameservers</CardTitle>
                            <CardDescription>
                                Change nameservers at your registrar to use Cloudflare
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold mb-2">New Nameservers:</h4>
                                    {cloudflareOption.nameservers.map((ns: string, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between py-2">
                                            <span className="font-mono">{ns}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(ns, idx + 100)}
                                            >
                                                {copiedRecord === idx + 100 ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <ol className="space-y-3">
                                    {cloudflareOption.steps.map((step: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                {idx + 1}
                                            </span>
                                            <span className="pt-0.5">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Estimated Time */}
            <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">⏱️</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-900">Estimated Propagation Time</h4>
                            <p className="text-sm text-green-800">
                                {configMethod === 'cloudflare' ? '5-10 minutes' : '5-30 minutes'} after you save your changes
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Continue Button */}
            <Button size="lg" className="w-full" onClick={onContinue}>
                I've Added the DNS Records - Check Propagation
            </Button>

            <p className="text-sm text-center text-gray-500">
                Don't worry, we'll automatically check if your DNS records are propagating correctly
            </p>
        </div>
    );
}
