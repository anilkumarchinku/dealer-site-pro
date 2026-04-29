'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Car } from '@/lib/types/car'
import {
    buildCarOnRoadVariantOptions,
    calculateCarOnRoadPrice,
    formatInr,
    INDIAN_STATE_OPTIONS,
    type IndianStateCode,
} from '@/lib/utils/on-road-price'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MapPin, Car as CarIcon, FileText, Shield, CreditCard, Info } from 'lucide-react'
import { getContrastText } from '@/lib/utils/color-contrast'

interface OnRoadPriceDialogProps {
    car: Car | null
    open: boolean
    onOpenChange: (open: boolean) => void
    brandColor?: string
    defaultVariantLabel?: string | null
}

function normalizeVariantLabel(value: string | null | undefined): string {
    return String(value ?? '')
        .toLowerCase()
        .replace(/[^\w]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export function OnRoadPriceDialog({
    car,
    open,
    onOpenChange,
    brandColor = '#2563eb',
    defaultVariantLabel = null,
}: OnRoadPriceDialogProps) {
    const variantOptions = useMemo(() => (car ? buildCarOnRoadVariantOptions(car) : []), [car])
    const [stateCode, setStateCode] = useState<IndianStateCode>('DL')
    const [variantId, setVariantId] = useState<string>('')
    const [financed, setFinanced] = useState(false)

    useEffect(() => {
        if (!car) return
        const targetVariant = normalizeVariantLabel(defaultVariantLabel || car.variant)
        const matchingVariant = variantOptions.find((variant) =>
            normalizeVariantLabel(variant.label) === targetVariant
        )
        setVariantId(matchingVariant?.id ?? '')
        setStateCode('DL')
        setFinanced(false)
    }, [car, defaultVariantLabel, variantOptions])

    const activeVariant = useMemo(() => {
        if (variantOptions.length === 0) return null
        return variantOptions.find((variant) => variant.id === variantId) ?? variantOptions[0]
    }, [variantId, variantOptions])

    const breakdown = useMemo(() => {
        if (!car || !activeVariant || activeVariant.exShowroom <= 0) return null
        return calculateCarOnRoadPrice({
            exShowroom: activeVariant.exShowroom,
            fuelType: activeVariant.fuelType,
            engineCc: activeVariant.engineCc,
            stateCode,
            financed,
            exactInsurance: car.ownership?.insuranceCost?.comprehensive ?? null,
            exactOnRoad: stateCode === 'TS' ? activeVariant.exactOnRoad : null,
        })
    }, [activeVariant, car, financed, stateCode])

    const contrast = getContrastText(brandColor)

    if (!car) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 bg-white text-gray-900 border border-gray-200 shadow-2xl overflow-hidden">
                <DialogTitle className="sr-only">
                    {car.make} {car.model} on-road price calculator
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Select your state and variant to estimate the on-road price for {car.make} {car.model}.
                </DialogDescription>

                <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)]">
                    <div className="border-r border-gray-200 bg-gray-50 p-6">
                        <div className="mb-6">
                            <Badge variant="outline" className="mb-3 gap-1.5 border-gray-300 bg-white text-gray-700">
                                <MapPin className="h-3.5 w-3.5" />
                                State-based estimate
                            </Badge>
                            <h2 className="text-2xl font-bold text-gray-900">On-Road Price*</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Pick the state and model variant to estimate the payable price above ex-showroom.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">State</Label>
                                <Select value={stateCode} onValueChange={(value) => setStateCode(value as IndianStateCode)}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80">
                                        {INDIAN_STATE_OPTIONS.map((state) => (
                                            <SelectItem key={state.code} value={state.code}>
                                                {state.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Variant</Label>
                                <Select
                                    value={variantId || activeVariant?.id || ''}
                                    onValueChange={setVariantId}
                                    disabled={variantOptions.length === 0}
                                >
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select variant" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80">
                                        {variantOptions.map((variant) => (
                                            <SelectItem key={variant.id} value={variant.id}>
                                                {variant.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                                <Checkbox
                                    id="financed"
                                    checked={financed}
                                    onCheckedChange={(checked) => setFinanced(Boolean(checked))}
                                    className="mt-0.5"
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="financed" className="cursor-pointer text-sm font-medium text-gray-900">
                                        Vehicle will be financed
                                    </Label>
                                    <p className="text-xs text-gray-600">
                                        Adds hypothecation charges to the estimate.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl p-5" style={{ backgroundColor: brandColor, color: contrast }}>
                            <div className="flex items-center gap-2 text-sm opacity-90">
                                <CarIcon className="h-4 w-4" />
                                {activeVariant?.label || car.model}
                            </div>
                            <p className="mt-2 text-sm opacity-80">Ex-showroom*</p>
                            <p className="text-3xl font-bold">
                                {activeVariant ? formatInr(activeVariant.exShowroom) : '—'}
                            </p>
                            <p className="mt-2 text-xs opacity-80">
                                Insurance is {breakdown?.insuranceSource === 'catalog' ? 'using catalog pricing' : 'estimated from standard inputs'}.
                                {breakdown?.totalSource === 'catalog' ? ' Total uses stored Hyderabad on-road data.' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        {breakdown ? (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{breakdown.stateName}</p>
                                            <h3 className="text-2xl font-bold text-gray-900">Estimated On-Road Price*</h3>
                                        </div>
                                        <div className="rounded-2xl px-5 py-4 text-right" style={{ backgroundColor: `${brandColor}12` }}>
                                            <p className="text-xs uppercase tracking-wide text-gray-600">Total payable</p>
                                            <p className="mt-1 text-3xl font-extrabold" style={{ color: brandColor }}>
                                                {formatInr(breakdown.total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {[
                                        { label: 'Ex-showroom price*', value: formatInr(breakdown.exShowroom), icon: CarIcon },
                                        { label: `Road tax / RTO (${breakdown.roadTaxPercent}%)`, value: formatInr(breakdown.roadTax), icon: FileText },
                                        { label: 'Insurance', value: formatInr(breakdown.insurance), icon: Shield },
                                        { label: 'TCS', value: breakdown.tcs > 0 ? formatInr(breakdown.tcs) : 'Not applicable', icon: CreditCard },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                            <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-2xl border border-gray-200 overflow-hidden">
                                    <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
                                        <h4 className="font-semibold text-gray-900">Price breakdown</h4>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {[
                                            ['Ex-showroom price*', breakdown.exShowroom],
                                            [`Road tax / registration (${breakdown.roadTaxPercent}%)`, breakdown.roadTax],
                                            ['Registration fee', breakdown.registrationFee],
                                            ['Smart card fee', breakdown.smartCardFee],
                                            ['HSRP / number plate', breakdown.hsrpFee],
                                            ['FASTag', breakdown.fastagFee],
                                            ['Insurance', breakdown.insurance],
                                            ...(breakdown.tcs > 0 ? [['TCS (1% above ₹10 lakh)', breakdown.tcs] as const] : []),
                                            ...(breakdown.hypothecationFee > 0 ? [['Hypothecation', breakdown.hypothecationFee] as const] : []),
                                        ].map(([label, amount]) => (
                                            <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
                                                <span className="text-gray-600">{label}</span>
                                                <span className="font-medium text-gray-900">{formatInr(Number(amount))}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-between px-5 py-4 text-base font-bold">
                                            <span>Total on-road price*</span>
                                            <span style={{ color: brandColor }}>{formatInr(breakdown.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                    <div className="mb-2 flex items-center gap-2 font-semibold">
                                        <Info className="h-4 w-4" />
                                        What this estimate includes
                                    </div>
                                    <p>
                                        This popup adds the typical purchase-time items above ex-showroom price:
                                        state road tax, registration-related fees, HSRP, FASTag, insurance, TCS and optional hypothecation.
                                        Dealer discounts, accessories, municipal cess and insurer-specific quotes can still change the final payable amount.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
                                Select a state and variant to calculate the on-road price.
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
