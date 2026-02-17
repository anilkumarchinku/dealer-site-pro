/**
 * Route Selector
 * Choose between full domain and subdomain deployment
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, FolderTree, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface RouteSelectorProps {
    domain: string;
    recommendation: {
        route: 'full_domain' | 'subdomain';
        reason: string;
        warnings: string[];
    };
    onSubmit: (route: 'full_domain' | 'subdomain', subdomain?: string) => void;
}

export function RouteSelector({ domain, recommendation, onSubmit }: RouteSelectorProps) {
    const [selectedRoute, setSelectedRoute] = useState<'full_domain' | 'subdomain'>(recommendation.route);
    const [subdomainName, setSubdomainName] = useState('shop');
    const [error, setError] = useState('');

    const suggestedSubdomains = ['shop', 'store', 'cars', 'auto', 'showroom', 'dealer'];

    const handleSubmit = () => {
        setError('');

        if (selectedRoute === 'subdomain') {
            // Validate subdomain
            const cleanSubdomain = subdomainName.trim().toLowerCase();

            if (!cleanSubdomain) {
                setError('Please enter a subdomain name');
                return;
            }

            // Check subdomain format
            const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
            if (!subdomainRegex.test(cleanSubdomain)) {
                setError('Subdomain can only contain lowercase letters, numbers, and hyphens');
                return;
            }

            if (cleanSubdomain.length < 2 || cleanSubdomain.length > 63) {
                setError('Subdomain must be between 2 and 63 characters');
                return;
            }

            onSubmit('subdomain', cleanSubdomain);
        } else {
            onSubmit('full_domain');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Choose Deployment Route</CardTitle>
                    <CardDescription>
                        Decide how you want to deploy your dealership website on {domain}
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Route Options */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Full Domain Option */}
                <Card
                    className={`cursor-pointer transition-all ${
                        selectedRoute === 'full_domain'
                            ? 'border-2 border-blue-600 shadow-lg'
                            : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedRoute('full_domain')}
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Globe className="w-6 h-6 text-blue-600" />
                            </div>
                            {recommendation.route === 'full_domain' && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                    Recommended
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold mb-2">Full Domain</h3>
                        <p className="text-lg text-blue-600 font-mono mb-4">{domain}</p>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Maximum branding impact</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Better for SEO</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Cleaner URLs</span>
                            </div>
                            {recommendation.route !== 'full_domain' && recommendation.warnings.length > 0 && (
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-yellow-700">May affect existing services</span>
                                </div>
                            )}
                        </div>

                        <div className="text-xs text-gray-500 border-t pt-3">
                            Your website will be accessible at: <br />
                            <span className="font-mono">https://{domain}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Subdomain Option */}
                <Card
                    className={`cursor-pointer transition-all ${
                        selectedRoute === 'subdomain'
                            ? 'border-2 border-blue-600 shadow-lg'
                            : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedRoute('subdomain')}
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FolderTree className="w-6 h-6 text-purple-600" />
                            </div>
                            {recommendation.route === 'subdomain' && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                    Recommended
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold mb-2">Subdomain</h3>
                        <p className="text-lg text-purple-600 font-mono mb-4">
                            {subdomainName || 'your-choice'}.{domain}
                        </p>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Preserves existing website</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Keeps email services intact</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Safer deployment</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Easy rollback</span>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 border-t pt-3">
                            Your website will be accessible at: <br />
                            <span className="font-mono">https://{subdomainName || 'your-choice'}.{domain}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subdomain Name Input */}
            {selectedRoute === 'subdomain' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Choose Your Subdomain Name</CardTitle>
                        <CardDescription>
                            Pick a subdomain that represents your dealership
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="subdomain">Subdomain Name</Label>
                            <div className="flex items-center gap-2 mt-2">
                                <Input
                                    id="subdomain"
                                    value={subdomainName}
                                    onChange={(e) => setSubdomainName(e.target.value.toLowerCase())}
                                    placeholder="shop"
                                    className="flex-grow"
                                />
                                <span className="text-gray-500">.{domain}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Use lowercase letters, numbers, and hyphens only
                            </p>
                        </div>

                        {/* Suggested Names */}
                        <div>
                            <Label className="text-sm">Suggestions:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {suggestedSubdomains.map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => setSubdomainName(name)}
                                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                            subdomainName === name
                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                                        }`}
                                    >
                                        {name}.{domain}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error Message */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Warning for Full Domain */}
            {selectedRoute === 'full_domain' && recommendation.route === 'subdomain' && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-yellow-900 mb-1">
                                    Are you sure about using the full domain?
                                </h4>
                                <p className="text-sm text-yellow-800 mb-2">
                                    {recommendation.reason}
                                </p>
                                {recommendation.warnings.length > 0 && (
                                    <ul className="text-sm text-yellow-800 space-y-1">
                                        {recommendation.warnings.map((warning, idx) => (
                                            <li key={idx}>• {warning}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Continue Button */}
            <Button size="lg" className="w-full" onClick={handleSubmit}>
                Continue with {selectedRoute === 'full_domain' ? 'Full Domain' : 'Subdomain'}
                <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
        </div>
    );
}
