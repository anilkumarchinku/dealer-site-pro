/**
 * Propagation Tracker
 * Monitor DNS propagation with real-time status and visual progress
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle2,
    XCircle,
    Loader2,
    Globe,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

interface PropagationTrackerProps {
    onboardingId: string;
    targetDomain: string;
    deploymentRoute: 'full_domain' | 'subdomain';
    onComplete: () => void;
}

export function PropagationTracker({
    onboardingId,
    targetDomain,
    deploymentRoute,
    onComplete
}: PropagationTrackerProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [propagationStatus, setPropagationStatus] = useState<any>(null);
    const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
    const [checkCount, setCheckCount] = useState(0);

    useEffect(() => {
        // Initial check
        checkPropagation();
    }, []);

    useEffect(() => {
        if (autoCheckEnabled && !propagationStatus?.overall?.fully_propagated) {
            const interval = setInterval(() => {
                checkPropagation();
            }, 30000); // Check every 30 seconds

            return () => clearInterval(interval);
        }
    }, [autoCheckEnabled, propagationStatus]);

    const checkPropagation = async () => {
        setIsChecking(true);
        setCheckCount(prev => prev + 1);

        try {
            const response = await fetch(`/api/domain/propagation-status/${onboardingId}`);
            const data = await response.json();

            if (data.success) {
                setPropagationStatus(data.propagation_status);

                if (data.propagation_status.overall.fully_propagated) {
                    setAutoCheckEnabled(false);
                    setTimeout(() => onComplete(), 2000);
                }
            }
        } catch (error) {
            console.error('Error checking propagation:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const RecordStatus = ({ record, label }: { record: any; label: string }) => (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
                {record.propagated ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : isChecking ? (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : (
                    <XCircle className="w-6 h-6 text-gray-400" />
                )}
                <div>
                    <h4 className="font-semibold">{label}</h4>
                    <p className="text-sm text-gray-600">
                        {record.propagated ? 'Propagated' : 'Not propagated yet'}
                    </p>
                </div>
            </div>
            {record.current_values && record.current_values.length > 0 && (
                <div className="text-right">
                    <p className="text-xs text-gray-500">Current Value:</p>
                    <p className="text-sm font-mono">{record.current_values[0]}</p>
                </div>
            )}
        </div>
    );

    if (!propagationStatus) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-12 text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Checking DNS Propagation</h2>
                    <p className="text-gray-600">Please wait...</p>
                </CardContent>
            </Card>
        );
    }

    const { overall, records, estimated_time_remaining } = propagationStatus;
    const isComplete = overall.fully_propagated;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isComplete ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                            {isComplete ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : isChecking ? (
                                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                            ) : (
                                <Globe className="w-6 h-6 text-blue-600" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-2xl">
                                {isComplete ? 'DNS Fully Propagated!' : 'DNS Propagation in Progress'}
                            </CardTitle>
                            <CardDescription>
                                {targetDomain} - {overall.checks_passed} of {overall.total_checks} checks passed
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Progress Bar */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Overall Progress</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {overall.percentage}%
                            </span>
                        </div>
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${
                                    isComplete ? 'bg-green-600' : 'bg-blue-600'
                                }`}
                                style={{ width: `${overall.percentage}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            {isComplete
                                ? 'All DNS records have propagated successfully!'
                                : `Estimated time remaining: ${estimated_time_remaining}`
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Record Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">DNS Records Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <RecordStatus
                            record={records.a_record}
                            label="A Record (IP Address)"
                        />

                        {deploymentRoute === 'full_domain' && records.www_record && (
                            <RecordStatus
                                record={records.www_record}
                                label="WWW Record"
                            />
                        )}

                        <RecordStatus
                            record={records.txt_record}
                            label="TXT Record (Verification)"
                        />
                    </div>
                </CardContent>
            </Card>

            {!isComplete && (
                <>
                    {/* What's Happening */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-1">What's Happening?</h4>
                                    <p className="text-sm text-blue-800">
                                        DNS changes can take 5-30 minutes to propagate across the internet.
                                        We're continuously checking if your DNS records are visible from our servers.
                                        This is completely normal - please be patient!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            size="lg"
                            className="flex-1"
                            onClick={checkPropagation}
                            disabled={isChecking}
                        >
                            {isChecking ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Checking...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Check Again
                                </>
                            )}
                        </Button>

                        <Button
                            size="lg"
                            variant={autoCheckEnabled ? 'secondary' : 'outline'}
                            className="flex-1"
                            onClick={() => setAutoCheckEnabled(!autoCheckEnabled)}
                        >
                            {autoCheckEnabled ? (
                                <>Auto-checking enabled</>
                            ) : (
                                <>Enable Auto-check</>
                            )}
                        </Button>
                    </div>

                    {autoCheckEnabled && (
                        <p className="text-sm text-center text-gray-500">
                            Automatically checking every 30 seconds... ({checkCount} checks so far)
                        </p>
                    )}
                </>
            )}

            {isComplete && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-8 text-center">
                        <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-900 mb-2">
                            DNS Propagation Complete!
                        </h3>
                        <p className="text-green-800 mb-6">
                            Your domain {targetDomain} is now properly configured and ready for deployment.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                            <Globe className="w-4 h-4" />
                            <span>Your website will be live in just a few more steps</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Troubleshooting */}
            {!isComplete && checkCount > 5 && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-yellow-900 mb-2">
                                    Taking longer than expected?
                                </h4>
                                <ul className="text-sm text-yellow-800 space-y-1">
                                    <li>• Double-check that you added all DNS records correctly</li>
                                    <li>• Verify there are no typos in the record values</li>
                                    <li>• Some registrars can take up to 48 hours for full propagation</li>
                                    <li>• Contact support if propagation hasn't started after 1 hour</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
