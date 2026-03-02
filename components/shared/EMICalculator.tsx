"use client"

import { useState, useMemo } from "react"

interface Props {
    defaultPrice?: number   // in INR
}

export function EMICalculator({ defaultPrice = 80000 }: Props) {
    const [principal, setPrincipal] = useState(defaultPrice)
    const [downPayment, setDownPayment] = useState(Math.round(defaultPrice * 0.2))
    const [interestRate, setInterestRate] = useState(9.5)
    const [tenure, setTenure] = useState(24) // months

    const emi = useMemo(() => {
        const loanAmount = principal - downPayment
        if (loanAmount <= 0) return 0
        const monthlyRate = interestRate / 12 / 100
        if (monthlyRate === 0) return loanAmount / tenure
        return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
               (Math.pow(1 + monthlyRate, tenure) - 1)
    }, [principal, downPayment, interestRate, tenure])

    const totalPayable = emi * tenure + downPayment
    const totalInterest = totalPayable - principal

    return (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h3 className="font-semibold text-lg">EMI Calculator</h3>

            {/* Inputs */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <label>Ex-Showroom Price</label>
                        <span className="font-medium">₹{principal.toLocaleString("en-IN")}</span>
                    </div>
                    <input
                        type="range"
                        min={20000}
                        max={500000}
                        step={5000}
                        value={principal}
                        onChange={e => {
                            const v = Number(e.target.value)
                            setPrincipal(v)
                            setDownPayment(Math.round(v * 0.2))
                        }}
                        className="w-full accent-primary"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <label>Down Payment</label>
                        <span className="font-medium">₹{downPayment.toLocaleString("en-IN")}</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={principal}
                        step={1000}
                        value={downPayment}
                        onChange={e => setDownPayment(Number(e.target.value))}
                        className="w-full accent-primary"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <label>Interest Rate</label>
                        <span className="font-medium">{interestRate}% p.a.</span>
                    </div>
                    <input
                        type="range"
                        min={6}
                        max={20}
                        step={0.5}
                        value={interestRate}
                        onChange={e => setInterestRate(Number(e.target.value))}
                        className="w-full accent-primary"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <label>Tenure</label>
                        <span className="font-medium">{tenure} months</span>
                    </div>
                    <div className="flex gap-2">
                        {[12, 24, 36, 48, 60].map(t => (
                            <button
                                key={t}
                                onClick={() => setTenure(t)}
                                className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                                    tenure === t
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "border-border hover:bg-muted/50"
                                }`}
                            >
                                {t}m
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Result */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">Monthly EMI</p>
                    <p className="text-3xl font-bold text-primary">₹{Math.round(emi).toLocaleString("en-IN")}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div>
                        <p className="text-muted-foreground text-xs">Loan Amount</p>
                        <p className="font-medium">₹{(principal - downPayment).toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs">Total Interest</p>
                        <p className="font-medium">₹{Math.round(totalInterest).toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs">Total Payable</p>
                        <p className="font-medium">₹{Math.round(totalPayable).toLocaleString("en-IN")}</p>
                    </div>
                </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
                * Indicative only. Actual EMI may vary based on lender and credit profile.
            </p>
        </div>
    )
}
