/**
 * EMI Calculator Page Content
 * Standalone page wrapper for the EMI calculator
 */

'use client';

import Link from 'next/link';
import { EmiCalculator } from '@/components/ui/EmiCalculator';
import { Card, CardContent } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronRight, Calculator, Info, HelpCircle, TrendingDown, Percent, Calendar, CreditCard } from 'lucide-react';

export function EmiCalculatorPageContent() {
    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium">EMI Calculator</span>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Calculator className="w-8 h-8 text-primary" />
                        Car Loan EMI Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Calculate your monthly car loan EMI instantly. Adjust vehicle price, down payment, loan tenure, and interest rate to find the perfect financing plan.
                    </p>
                </div>

                {/* Calculator */}
                <div className="mb-12">
                    <EmiCalculator brandColor="#2563eb" theme="light" />
                </div>

                {/* How EMI is Calculated */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-500" />
                            How is Car Loan EMI Calculated?
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-3">
                            <p>
                                EMI (Equated Monthly Installment) is calculated using the following formula:
                            </p>
                            <div className="bg-muted/50 p-4 rounded-lg font-mono text-center text-foreground">
                                EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
                            </div>
                            <p>Where:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>P</strong> = Principal loan amount (Vehicle Price - Down Payment)</li>
                                <li><strong>R</strong> = Monthly interest rate (Annual Rate / 12 / 100)</li>
                                <li><strong>N</strong> = Loan tenure in months</li>
                            </ul>
                            <p>
                                For example, if you take a loan of ₹8,00,000 at 9.5% annual interest for 60 months,
                                your monthly EMI would be approximately ₹16,785.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Tips */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Tips for Getting the Best Car Loan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    title: 'Compare Multiple Lenders',
                                    desc: 'Interest rates vary across banks and NBFCs. Compare at least 3-4 lenders before choosing.',
                                    icon: TrendingDown,
                                    color: 'text-blue-500',
                                    border: 'border-blue-500/50',
                                },
                                {
                                    title: 'Higher Down Payment',
                                    desc: 'A 20-30% down payment reduces your loan amount and total interest significantly.',
                                    icon: Percent,
                                    color: 'text-emerald-500',
                                    border: 'border-emerald-500/50',
                                },
                                {
                                    title: 'Shorter Tenure',
                                    desc: 'While EMI is higher, a shorter tenure (3-4 years) saves you thousands in interest.',
                                    icon: Calendar,
                                    color: 'text-amber-500',
                                    border: 'border-amber-500/50',
                                },
                                {
                                    title: 'Check Processing Fees',
                                    desc: 'Banks charge 0.5-2% processing fee. Negotiate this or look for zero-processing offers.',
                                    icon: CreditCard,
                                    color: 'text-purple-500',
                                    border: 'border-purple-500/50',
                                },
                            ].map((tip, i) => (
                                <div key={i} className={`p-4 bg-muted/30 rounded-lg border-l-4 ${tip.border}`}>
                                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                                        <tip.icon className={`w-4 h-4 ${tip.color}`} />
                                        {tip.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* FAQs */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-muted-foreground" />
                        EMI Calculator FAQs
                    </h2>
                    <Card>
                        <CardContent className="p-5">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="what-is-emi">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        What is EMI?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground">
                                        EMI stands for Equated Monthly Installment. It is the fixed amount you pay every month to repay your car loan. Each EMI includes both principal and interest components.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="ideal-down-payment">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        What is the ideal down payment for a car loan?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground">
                                        Experts recommend a down payment of 20-30% of the vehicle price. This reduces your loan amount, monthly EMI, and total interest paid. Most banks require a minimum of 10-15% down payment.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="interest-rate">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        What is the current car loan interest rate?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground">
                                        Car loan interest rates typically range from 7.5% to 12% per annum, depending on the lender, your credit score, loan amount, and tenure. New car loans usually have lower rates than used car loans.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="tenure">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        What tenure should I choose?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground">
                                        Car loan tenures range from 1 to 7 years. A shorter tenure means higher EMI but less total interest. A longer tenure means lower EMI but more total interest. Choose based on your monthly budget and total cost preference.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
