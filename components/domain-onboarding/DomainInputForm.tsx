/**
 * Domain Input Form
 * First step in domain onboarding - collect domain name and registrar info
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, ArrowRight, AlertCircle } from 'lucide-react';

interface DomainInputFormProps {
    onSubmit: (data: {
        domain_name: string;
        registrar: string;
        access_level: 'full' | 'limited';
    }) => void;
    isLoading?: boolean;
}

export function DomainInputForm({ onSubmit, isLoading = false }: DomainInputFormProps) {
    const [domainName, setDomainName] = useState('');
    const [registrar, setRegistrar] = useState('');
    const [accessLevel, setAccessLevel] = useState<'full' | 'limited'>('full');
    const [error, setError] = useState('');

    const popularRegistrars = [
        { value: 'godaddy', label: 'GoDaddy' },
        { value: 'namecheap', label: 'Namecheap' },
        { value: 'bigrock', label: 'BigRock' },
        { value: 'hostgator', label: 'HostGator India' },
        { value: 'bluehost', label: 'Bluehost India' },
        { value: 'cloudflare', label: 'Cloudflare' },
        { value: 'route53', label: 'AWS Route 53' },
        { value: 'google-domains', label: 'Google Domains' },
        { value: 'other', label: 'Other' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!domainName.trim()) {
            setError('Please enter your domain name');
            return;
        }

        // Remove protocol and www if present
        let cleanDomain = domainName.trim().toLowerCase();
        cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/, '');

        // Basic domain format validation
        const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
        if (!domainRegex.test(cleanDomain)) {
            setError('Please enter a valid domain name (e.g., yourdomain.com)');
            return;
        }

        onSubmit({
            domain_name: cleanDomain,
            registrar: registrar || 'unknown',
            access_level: accessLevel
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Connect Your Domain</CardTitle>
                        <CardDescription>
                            Let's get your dealership website live on your domain
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Domain Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="domain">Your Domain Name</Label>
                        <Input
                            id="domain"
                            type="text"
                            placeholder="yourdealership.com"
                            value={domainName}
                            onChange={(e) => setDomainName(e.target.value)}
                            disabled={isLoading}
                            className="text-lg"
                        />
                        <p className="text-sm text-gray-500">
                            Enter the domain you've already purchased (without https:// or www)
                        </p>
                    </div>

                    {/* Registrar Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="registrar">Where did you buy your domain?</Label>
                        <Select value={registrar} onValueChange={setRegistrar} disabled={isLoading}>
                            <SelectTrigger id="registrar">
                                <SelectValue placeholder="Select your registrar" />
                            </SelectTrigger>
                            <SelectContent>
                                {popularRegistrars.map((reg) => (
                                    <SelectItem key={reg.value} value={reg.value}>
                                        {reg.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500">
                            This helps us provide specific instructions for your registrar
                        </p>
                    </div>

                    {/* Access Level */}
                    <div className="space-y-2">
                        <Label>Domain Access Level</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setAccessLevel('full')}
                                disabled={isLoading}
                                className={`p-4 border-2 rounded-lg text-left transition-all ${
                                    accessLevel === 'full'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="font-semibold mb-1">Full Access</div>
                                <div className="text-sm text-gray-600">
                                    I can change DNS settings at my registrar
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAccessLevel('limited')}
                                disabled={isLoading}
                                className={`p-4 border-2 rounded-lg text-left transition-all ${
                                    accessLevel === 'limited'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="font-semibold mb-1">Limited Access</div>
                                <div className="text-sm text-gray-600">
                                    I need help with DNS settings
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                Continue
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                        )}
                    </Button>

                    {/* Help Text */}
                    <div className="text-center text-sm text-gray-500">
                        Don't have a domain yet?{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                            Buy one now
                        </a>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
