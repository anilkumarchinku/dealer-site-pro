/**
 * DNS Analysis Display
 * Shows comprehensive DNS scan results and recommendations
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Server,
    Mail,
    Globe,
    Shield,
    ArrowRight,
    Info
} from 'lucide-react';

interface DNSAnalysisDisplayProps {
    analysis: any;
    onContinue: (route: 'full_domain' | 'subdomain') => void;
}

export function DNSAnalysisDisplay({ analysis, onContinue }: DNSAnalysisDisplayProps) {
    const { dns_records, existing_services, registrar, recommendation } = analysis;

    const StatusBadge = ({ active }: { active: boolean }) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
            {active ? (
                <>
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                </>
            ) : (
                <>
                    <XCircle className="w-3 h-3" />
                    Not Found
                </>
            )}
        </span>
    );

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Server className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">DNS Analysis Complete</CardTitle>
                            <CardDescription>
                                We've scanned {analysis.domain} and analyzed its configuration
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Existing Services Detection */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Detected Services</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                                <StatusBadge active={existing_services.has_active_website} />
                            </div>
                            <h4 className="font-semibold">Website</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                {existing_services.has_active_website
                                    ? 'Active website detected'
                                    : 'No website found'}
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Mail className="w-5 h-5 text-purple-600" />
                                <StatusBadge active={existing_services.has_email} />
                            </div>
                            <h4 className="font-semibold">Email</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                {existing_services.has_email
                                    ? `${dns_records.mx_records.length} MX records found`
                                    : 'No email service'}
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Shield className="w-5 h-5 text-orange-600" />
                                <StatusBadge active={existing_services.using_cloudflare} />
                            </div>
                            <h4 className="font-semibold">Cloudflare</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                {existing_services.using_cloudflare
                                    ? 'Using Cloudflare CDN'
                                    : 'Not using Cloudflare'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DNS Records Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">DNS Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Nameservers */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Server className="w-4 h-4 text-gray-600" />
                                <h4 className="font-semibold">Nameservers</h4>
                                {registrar.detected && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {registrar.detected}
                                    </span>
                                )}
                            </div>
                            <div className="pl-6 space-y-1">
                                {dns_records.nameservers.map((ns: string, idx: number) => (
                                    <p key={idx} className="text-sm font-mono text-gray-700">
                                        {ns}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* A Records */}
                        {dns_records.a_records.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">A Records (IP Addresses)</h4>
                                <div className="pl-6 space-y-1">
                                    {dns_records.a_records.map((ip: string, idx: number) => (
                                        <p key={idx} className="text-sm font-mono text-gray-700">
                                            {ip}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* MX Records */}
                        {dns_records.mx_records.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">MX Records (Email)</h4>
                                <div className="pl-6 space-y-1">
                                    {dns_records.mx_records.map((mx: string, idx: number) => (
                                        <p key={idx} className="text-sm font-mono text-gray-700">
                                            {mx}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CNAME Records */}
                        {Object.keys(dns_records.cname_records).length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">CNAME Records</h4>
                                <div className="pl-6 space-y-1">
                                    {Object.entries(dns_records.cname_records).map(([subdomain, target]: [string, any]) => (
                                        <p key={subdomain} className="text-sm font-mono text-gray-700">
                                            {subdomain} → {target}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TXT Records Count */}
                        <div>
                            <h4 className="font-semibold mb-2">TXT Records</h4>
                            <p className="text-sm text-gray-600 pl-6">
                                {dns_records.txt_records_count} record(s) found
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recommendation */}
            <Card className={`border-2 ${
                recommendation.route === 'subdomain'
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-green-300 bg-green-50'
            }`}>
                <CardHeader>
                    <div className="flex items-start gap-3">
                        {recommendation.route === 'subdomain' ? (
                            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                        ) : (
                            <Info className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-grow">
                            <CardTitle className={`text-lg ${
                                recommendation.route === 'subdomain'
                                    ? 'text-yellow-900'
                                    : 'text-green-900'
                            }`}>
                                Our Recommendation: {recommendation.route === 'subdomain' ? 'Use a Subdomain' : 'Use Full Domain'}
                            </CardTitle>
                            <CardDescription className={
                                recommendation.route === 'subdomain'
                                    ? 'text-yellow-800'
                                    : 'text-green-800'
                            }>
                                {recommendation.explanation}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {recommendation.warnings.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Important Notes:</h4>
                            <ul className="space-y-1">
                                {recommendation.warnings.map((warning: string, idx: number) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">⚠️</span>
                                        <span>{warning}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button
                    size="lg"
                    className={`flex-1 ${
                        recommendation.route === 'full_domain'
                            ? 'bg-green-600 hover:bg-green-700'
                            : ''
                    }`}
                    onClick={() => onContinue('full_domain')}
                >
                    Use Full Domain
                    {recommendation.route === 'full_domain' && (
                        <span className="ml-2 text-xs">(Recommended)</span>
                    )}
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    className={`flex-1 ${
                        recommendation.route === 'subdomain'
                            ? 'border-yellow-600 text-yellow-700 hover:bg-yellow-50'
                            : ''
                    }`}
                    onClick={() => onContinue('subdomain')}
                >
                    Use Subdomain
                    {recommendation.route === 'subdomain' && (
                        <span className="ml-2 text-xs">(Recommended)</span>
                    )}
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>

            <p className="text-sm text-center text-gray-500">
                You can override our recommendation if you know what you're doing
            </p>
        </div>
    );
}
