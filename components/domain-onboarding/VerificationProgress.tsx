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
        // Return undefined for other cases (no cleanup needed)
        return undefined;
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
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <div>
                                    <CardTitle>Verification Complete</CardTitle>
                                    <CardDescription>Your domain has been successfully verified</CardDescription>
                                </div>
                            </>
                        ) : (
                            <>
                                <Clock className="w-5 h-5 text-blue-600" />
                                <div>
                                    <CardTitle>Verifying Domain</CardTitle>
                                    <CardDescription>Waiting for {methodNames[method]} verification</CardDescription>
                                </div>
                            </>
                        )}
                    </div>
                </CardHeader>
                {error && (
                    <CardContent>
                        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Instructions Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Verification Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {instructions && Object.entries(instructions).map(([key, value]) => (
                            <div key={key} className="text-sm">
                                <p className="font-semibold text-gray-900 mb-1">{key}:</p>
                                <p className="text-gray-600">{String(value)}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={checkVerification}
                    disabled={isChecking || verified}
                    className="flex-1"
                >
                    {isChecking ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Checking...
                        </>
                    ) : (
                        'Check Now'
                    )}
                </Button>
                <Button
                    variant={autoCheckEnabled ? 'default' : 'outline'}
                    onClick={() => setAutoCheckEnabled(!autoCheckEnabled)}
                    disabled={verified}
                    className="flex-1"
                >
                    {autoCheckEnabled ? 'Auto-checking enabled' : 'Enable Auto-check'}
                </Button>
            </div>

            {/* Status Information */}
            {!verified && (
                <div className="text-sm text-gray-600 space-y-1">
                    <p>Attempts: {attempts}</p>
                    {autoCheckEnabled && <p>Auto-checking every 30 seconds...</p>}
                </div>
            )}
        </div>
    );
}
