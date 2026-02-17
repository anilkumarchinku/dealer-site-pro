/**
 * Domain Onboarding Wizard
 * Main orchestrator component for the complete domain onboarding flow
 */

'use client';

import { useState } from 'react';
import { DomainInputForm } from './DomainInputForm';
import { VerificationSelector } from './VerificationSelector';
import { VerificationProgress } from './VerificationProgress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

type OnboardingStep =
    | 'domain_input'
    | 'verification_method'
    | 'verification_progress'
    | 'dns_analysis'
    | 'configuration'
    | 'propagation'
    | 'deployment'
    | 'complete';

interface OnboardingState {
    onboarding_id?: string;
    domain_name?: string;
    registrar?: string;
    verification_token?: string;
    verification_method?: 'dns_txt' | 'html_file' | 'email';
    verification_instructions?: any;
    dns_analysis?: any;
}

export function DomainOnboardingWizard() {
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('domain_input');
    const [state, setState] = useState<OnboardingState>({});
    const [isLoading, setIsLoading] = useState(false);

    const steps = [
        { id: 'domain_input', label: 'Enter Domain', number: 1 },
        { id: 'verification_method', label: 'Choose Verification', number: 2 },
        { id: 'verification_progress', label: 'Verify Ownership', number: 3 },
        { id: 'dns_analysis', label: 'DNS Analysis', number: 4 },
        { id: 'configuration', label: 'Configure DNS', number: 5 },
        { id: 'complete', label: 'Complete', number: 6 }
    ];

    const handleDomainSubmit = async (data: {
        domain_name: string;
        registrar: string;
        access_level: 'full' | 'limited';
    }) => {
        setIsLoading(true);

        try {
            // Call start-onboarding API
            const response = await fetch('/api/domain/start-onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    user_id: 'demo-user-123' // TODO: Get from auth
                })
            });

            const result = await response.json();

            if (result.success) {
                setState({
                    ...state,
                    onboarding_id: result.onboarding_id,
                    domain_name: result.domain_name,
                    registrar: data.registrar,
                    verification_token: result.verification_token
                });
                setCurrentStep('verification_method');
            } else {
                alert(result.error || 'Failed to start onboarding');
            }
        } catch (error) {
            console.error('Error starting onboarding:', error);
            alert('Failed to start onboarding. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMethodSelected = async (method: 'dns_txt' | 'html_file' | 'email') => {
        setIsLoading(true);

        try {
            // Call verify-ownership API
            const response = await fetch('/api/domain/verify-ownership', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    onboarding_id: state.onboarding_id,
                    method
                })
            });

            const result = await response.json();

            if (result.success) {
                setState({
                    ...state,
                    verification_method: method,
                    verification_instructions: result.instructions
                });
                setCurrentStep('verification_progress');
            } else {
                alert(result.error || 'Failed to start verification');
            }
        } catch (error) {
            console.error('Error starting verification:', error);
            alert('Failed to start verification. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerified = async () => {
        setIsLoading(true);
        setCurrentStep('dns_analysis');

        try {
            // Call DNS scan API
            const response = await fetch(`/api/domain/dns-scan/${state.onboarding_id}`);
            const result = await response.json();

            if (result.success) {
                setState({
                    ...state,
                    dns_analysis: result.analysis
                });

                // For now, show results and mark as complete
                setTimeout(() => {
                    setCurrentStep('complete');
                    setIsLoading(false);
                }, 2000);
            } else {
                alert(result.error || 'Failed to analyze DNS');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error analyzing DNS:', error);
            alert('Failed to analyze DNS. Please try again.');
            setIsLoading(false);
        }
    };

    const getStepStatus = (stepId: string) => {
        const currentIndex = steps.findIndex((s) => s.id === currentStep);
        const stepIndex = steps.findIndex((s) => s.id === stepId);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Progress Steps */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            {steps.map((step, idx) => {
                                const status = getStepStatus(step.id);

                                return (
                                    <div key={step.id} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                                    status === 'completed'
                                                        ? 'bg-blue-600 border-blue-600'
                                                        : status === 'current'
                                                            ? 'bg-white border-blue-600'
                                                            : 'bg-white border-gray-300'
                                                }`}
                                            >
                                                {status === 'completed' ? (
                                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                                ) : status === 'current' ? (
                                                    <Circle className="w-6 h-6 text-blue-600 fill-blue-600" />
                                                ) : (
                                                    <span className="text-gray-400">{step.number}</span>
                                                )}
                                            </div>
                                            <span
                                                className={`text-sm mt-2 text-center ${
                                                    status === 'current'
                                                        ? 'font-semibold text-blue-600'
                                                        : status === 'completed'
                                                            ? 'text-gray-700'
                                                            : 'text-gray-400'
                                                }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        {idx < steps.length - 1 && (
                                            <div
                                                className={`flex-1 h-0.5 mx-4 ${
                                                    status === 'completed' ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Step Content */}
                <div className="mt-8">
                    {currentStep === 'domain_input' && (
                        <DomainInputForm onSubmit={handleDomainSubmit} isLoading={isLoading} />
                    )}

                    {currentStep === 'verification_method' && state.domain_name && state.verification_token && (
                        <VerificationSelector
                            domain={state.domain_name}
                            verificationToken={state.verification_token}
                            onMethodSelected={handleMethodSelected}
                            isVerifying={isLoading}
                        />
                    )}

                    {currentStep === 'verification_progress' &&
                        state.onboarding_id &&
                        state.domain_name &&
                        state.verification_method &&
                        state.verification_instructions && (
                            <VerificationProgress
                                onboardingId={state.onboarding_id}
                                domain={state.domain_name}
                                method={state.verification_method}
                                instructions={state.verification_instructions}
                                onVerified={handleVerified}
                            />
                        )}

                    {currentStep === 'dns_analysis' && (
                        <Card className="max-w-2xl mx-auto">
                            <CardContent className="p-12 text-center">
                                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Analyzing DNS Records</h2>
                                <p className="text-gray-600">
                                    We're scanning your domain to detect existing services...
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 'complete' && (
                        <Card className="max-w-2xl mx-auto border-green-200 bg-green-50">
                            <CardContent className="p-12 text-center">
                                <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-6" />
                                <h2 className="text-3xl font-bold text-green-900 mb-4">
                                    Domain Analysis Complete!
                                </h2>
                                <p className="text-green-800 mb-6">
                                    Your domain <strong>{state.domain_name}</strong> has been verified and analyzed.
                                </p>

                                {state.dns_analysis && (
                                    <div className="text-left bg-white rounded-lg p-6 mb-6">
                                        <h3 className="font-bold mb-4">DNS Analysis Results:</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Domain:</span>
                                                <span className="font-medium">{state.dns_analysis.domain}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Active Website:</span>
                                                <span className="font-medium">
                                                    {state.dns_analysis.existing_services?.has_active_website ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Email Service:</span>
                                                <span className="font-medium">
                                                    {state.dns_analysis.existing_services?.has_email ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Recommended Route:</span>
                                                <span className="font-medium capitalize">
                                                    {state.dns_analysis.recommendation?.route?.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                                            <strong>Recommendation:</strong> {state.dns_analysis.recommendation?.explanation}
                                        </div>
                                    </div>
                                )}

                                <p className="text-sm text-gray-600">
                                    The next steps for DNS configuration and deployment will be available soon!
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
