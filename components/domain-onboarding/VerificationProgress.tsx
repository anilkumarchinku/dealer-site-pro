/**
 * Verification Progress
 * Shows verification status and polls for completion
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, Clock, AlertCircle } from 'lucide-react';

interface VerificationProgressProps {
    onboardingId: string;
    domain: string;
    method: 'dns_txt' | 'html_file' | 'email';
    instructions: any;
    onVerified: () => void;
}

export function VerificationProgress({
    onboardingId,
    domain,
    method,
    instructions,
    onVerified
}: VerificationProgressProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);

    const methodNames = {
        dns_txt: 'DNS TXT Record',
        html_file: 'HTML File Upload',
        email: 'Email Verification'
    };

    useEffect(() => {
        if (autoCheckEnabled && !verified) {
            const interval = setInterval(() => {
                checkVerification();
            }, 30000); // Check every 30 seconds

            return () => clearInterval(interval);
        }
    }, [autoCheckEnabled, verified]);

    const checkVerification = async () => {
        setIsChecking(true);
        setError('');

        try {
            const response = await fetch(`/api/domain/verification-status/${onboardingId}`);
            const data = await response.json();

            if (data.verified) {
                setVerified(true);
                setAutoCheckEnabled(false);
                setTimeout(() => onVerified(), 1500);
            } else {
                setAttempts(data.attempts || attempts + 1);
                if (!data.result?.verified) {
                    setError(data.result?.error || 'Verification not yet complete. Please ensure you\'ve completed all steps.');
                }
            }
        } catch (err) {
            setError('Failed to check verification status. Please try again.');
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Status Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        {verified ? (
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                        ) : isChecking ? (
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        )}
                        <div>
                            <CardTitle className="text-2xl">
                                {verified ? 'Domain Verified!' : 'Waiting for Verification'}
                            </CardTitle>
                            <CardDescription>
                                {verified
                                    ? `Successfully verified ownership of ${domain}`
                                    : `Using ${methodNames[method]} method`}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {!verified && (
                <>
                    {/* Instructions Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Complete These Steps</CardTitle>
                            <CardDescription>
                                Follow the instructions below to verify your domain ownership
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-3">
                                {instructions.steps.map((step: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                            {idx + 1}
                                        </span>
                                        <span className="pt-0.5">{step}</span>
                                    </li>
                                ))}
                            </ol>

                            {/* Method-specific details */}
                            {method === 'dns_txt' && instructions.txt_record && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                                    <h4 className="font-semibold mb-2">DNS Record Details:</h4>
                                    <div className="space-y-2 text-sm font-mono">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Type:</span>
                                            <span>{instructions.txt_record.type}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Name:</span>
                                            <span>{instructions.txt_record.name}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Value:</span>
                                            <span className="break-all">{instructions.txt_record.value}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">TTL:</span>
                                            <span>{instructions.txt_record.ttl}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {method === 'html_file' && instructions.file && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                                    <h4 className="font-semibold mb-2">File Details:</h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">File Name: </span>
                                            <span className="font-mono">{instructions.file.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Upload Path: </span>
                                            <span className="font-mono">{instructions.file.upload_path}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(instructions.download_url, '_blank')}
                                        >
                                            Download File
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Error Message */}
                    {error && (
                        <Card className="border-yellow-200 bg-yellow-50">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-yellow-900">Not verified yet</p>
                                        <p className="text-sm text-yellow-800 mt-1">{error}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            size="lg"
                            className="flex-1"
                            onClick={checkVerification}
                            disabled={isChecking}
                        >
                            {isChecking ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Checking...
                                </>
                            ) : (
                                <>Check Verification Status</>
                            )}
                        </Button>

                        <Button
                            size="lg"
                            variant={autoCheckEnabled ? 'secondary' : 'outline'}
                            onClick={() => setAutoCheckEnabled(!autoCheckEnabled)}
                        >
                            {autoCheckEnabled ? 'Auto-checking enabled' : 'Enable Auto-check'}
                        </Button>
                    </div>

                    {autoCheckEnabled && (
                        <p className="text-sm text-center text-gray-500">
                            Automatically checking every 30 seconds...
                        </p>
                    )}

                    {attempts > 0 && (
                        <p className="text-sm text-center text-gray-500">
                            Verification attempts: {attempts}
                        </p>
                    )}
                </>
            )}

            {verified && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-6 text-center">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-900 mb-2">
                            Domain Ownership Verified!
                        </h3>
                        <p className="text-green-800 mb-4">
                            Proceeding to DNS analysis...
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
