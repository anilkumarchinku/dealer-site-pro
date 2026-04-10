"use client"

import { useState, useMemo } from "react"

interface ROIInputs {
    vehiclePrice: number
    downPayment: number
    loanInterestRate: number
    loanTenureMonths: number
    dailyTrips: number
    farePerTrip: number
    workingDaysPerMonth: number
    fuelCostPerDay: number
    maintenanceCostPerMonth: number
    driverSalary: number
}

function fmt(n: number): string {
    return "₹" + Math.round(n).toLocaleString("en-IN")
}

interface InputRowProps {
    label: string
    value: number
    onChange: (v: number) => void
    step?: number
    min?: number
    max?: number
}

function InputRow({ label, value, onChange, step = 1, min = 0, max }: InputRowProps) {
    return (
        <div className="flex justify-between items-center gap-4 py-2 border-b border-border/40">
            <label className="text-sm text-foreground">{label}</label>
            <input
                type="number"
                value={value}
                step={step}
                min={min}
                max={max}
                onChange={e => onChange(Number(e.target.value))}
                className="w-32 text-right border border-input rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
        </div>
    )
}

export function FleetROICalculator() {
    const [inputs, setInputs] = useState<ROIInputs>({
        vehiclePrice: 200000,
        downPayment: 50000,
        loanInterestRate: 12,
        loanTenureMonths: 36,
        dailyTrips: 8,
        farePerTrip: 80,
        workingDaysPerMonth: 25,
        fuelCostPerDay: 150,
        maintenanceCostPerMonth: 800,
        driverSalary: 0,
    })

    function set<K extends keyof ROIInputs>(key: K, value: number) {
        setInputs(prev => ({ ...prev, [key]: value }))
    }

    const results = useMemo(() => {
        const {
            vehiclePrice,
            downPayment,
            loanInterestRate,
            loanTenureMonths,
            dailyTrips,
            farePerTrip,
            workingDaysPerMonth,
            fuelCostPerDay,
            maintenanceCostPerMonth,
            driverSalary,
        } = inputs

        const loanAmount = vehiclePrice - downPayment
        const monthlyRate = loanInterestRate / 100 / 12
        const emi =
            monthlyRate === 0
                ? loanAmount / loanTenureMonths
                : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths)) /
                  (Math.pow(1 + monthlyRate, loanTenureMonths) - 1)

        const monthlyRevenue = dailyTrips * farePerTrip * workingDaysPerMonth
        const monthlyFuel = fuelCostPerDay * workingDaysPerMonth
        const monthlyExpenses =
            monthlyFuel + maintenanceCostPerMonth + driverSalary + Math.round(emi)
        const monthlyProfit = monthlyRevenue - monthlyExpenses

        const totalCost = downPayment + emi * loanTenureMonths
        const paybackMonths =
            monthlyProfit > 0 ? Math.ceil(totalCost / monthlyProfit) : null

        return {
            emi,
            monthlyRevenue,
            monthlyExpenses,
            monthlyProfit,
            annualProfit: monthlyProfit * 12,
            paybackMonths,
        }
    }, [inputs])

    const { emi, monthlyRevenue, monthlyExpenses, monthlyProfit, annualProfit, paybackMonths } =
        results

    const paybackColor =
        paybackMonths === null
            ? "text-red-500"
            : paybackMonths <= 24
            ? "text-green-600"
            : "text-amber-500"

    const showGoodTip = paybackMonths !== null && paybackMonths <= 12
    const showBadTip = monthlyProfit <= 0 || (paybackMonths !== null && paybackMonths > 36)

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Left column — Inputs */}
            <div>
                {/* Vehicle Cost */}
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-6">
                    Vehicle Cost
                </p>
                <InputRow
                    label="Vehicle Price (₹)"
                    value={inputs.vehiclePrice}
                    onChange={v => set("vehiclePrice", v)}
                    step={1000}
                    min={0}
                />
                <InputRow
                    label="Down Payment (₹)"
                    value={inputs.downPayment}
                    onChange={v => set("downPayment", v)}
                    step={1000}
                    min={0}
                />
                <InputRow
                    label="Loan Interest (%)"
                    value={inputs.loanInterestRate}
                    onChange={v => set("loanInterestRate", v)}
                    step={0.5}
                    min={0}
                />
                <div className="flex justify-between items-center gap-4 py-2 border-b border-border/40">
                    <label className="text-sm text-foreground">Loan Tenure (months)</label>
                    <select
                        value={inputs.loanTenureMonths}
                        onChange={e => set("loanTenureMonths", Number(e.target.value))}
                        className="w-32 text-right border border-input rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        {[12, 24, 36, 48, 60].map(t => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Daily Operations */}
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-6">
                    Daily Operations
                </p>
                <InputRow
                    label="Daily Trips"
                    value={inputs.dailyTrips}
                    onChange={v => set("dailyTrips", v)}
                    min={1}
                />
                <InputRow
                    label="Fare per Trip (₹)"
                    value={inputs.farePerTrip}
                    onChange={v => set("farePerTrip", v)}
                    min={0}
                />
                <InputRow
                    label="Working Days/Month"
                    value={inputs.workingDaysPerMonth}
                    onChange={v => set("workingDaysPerMonth", v)}
                    min={1}
                    max={30}
                />
                <InputRow
                    label="Fuel Cost/Day (₹)"
                    value={inputs.fuelCostPerDay}
                    onChange={v => set("fuelCostPerDay", v)}
                    min={0}
                />

                {/* Monthly Costs */}
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-6">
                    Monthly Costs
                </p>
                <InputRow
                    label="Maintenance (₹/mo)"
                    value={inputs.maintenanceCostPerMonth}
                    onChange={v => set("maintenanceCostPerMonth", v)}
                    min={0}
                />
                <InputRow
                    label="Driver Salary (₹/mo)"
                    value={inputs.driverSalary}
                    onChange={v => set("driverSalary", v)}
                    min={0}
                />
            </div>

            {/* Right column — Results */}
            <div className="md:sticky md:top-8 self-start">
                <div className="bg-card border border-border rounded-2xl p-6 space-y-1">
                    <h3 className="font-semibold text-lg mb-4">Monthly Breakdown</h3>

                    {/* Revenue */}
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                        <span className="text-green-600 font-semibold">{fmt(monthlyRevenue)}</span>
                    </div>

                    {/* EMI */}
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">Monthly EMI</span>
                        <span className="font-medium">{fmt(emi)}</span>
                    </div>

                    {/* Total Expenses */}
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">Monthly Expenses</span>
                        <span className="font-medium">{fmt(monthlyExpenses)}</span>
                    </div>

                    <hr className="border-border my-2" />

                    {/* Monthly Profit */}
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-semibold">Monthly Profit</span>
                        <span
                            className={`text-xl font-bold ${
                                monthlyProfit >= 0 ? "text-primary" : "text-red-500"
                            }`}
                        >
                            {fmt(monthlyProfit)}
                        </span>
                    </div>

                    <hr className="border-border my-2" />

                    {/* Annual Profit */}
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">Annual Profit</span>
                        <span className="font-medium">{fmt(annualProfit)}</span>
                    </div>

                    {/* Payback Period */}
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">Payback Period</span>
                        <span className={`font-semibold ${paybackColor}`}>
                            {paybackMonths !== null ? `${paybackMonths} months` : "Not profitable"}
                        </span>
                    </div>
                </div>

                {/* Tip boxes */}
                {showGoodTip && (
                    <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800">
                        🚀 Excellent ROI! Vehicle pays for itself in under a year.
                    </div>
                )}
                {showBadTip && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                        ⚠️ Low returns. Consider increasing trips or reducing costs.
                    </div>
                )}
            </div>
        </div>
    )
}
