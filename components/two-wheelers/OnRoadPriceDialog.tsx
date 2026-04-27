'use client'

import { useEffect, useMemo, useState } from 'react'
import {
    calculateTwoWheelerOnRoadPrice,
    formatInr,
    parseTwoWheelerPriceToPaise,
    TWO_WHEELER_STATE_OPTIONS,
    type TwoWheelerFuelType,
    type TwoWheelerOnRoadVariantOption,
} from '@/lib/utils/on-road-price-2w'
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
import { Bike, MapPin, Shield, FileText, Wallet, Info } from 'lucide-react'

interface RawVariant {
    name?: string
    price?: string
}

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    brand: string
    model: string
    defaultVariantLabel?: string | null
    exShowroomPaise: number
    fuelType: string
    engineCc: number | null
    variants?: RawVariant[]
    brandColor?: string
}

function normalizeVariantLabel(value: string | null | undefined): string {
    return String(value ?? '')
        .toLowerCase()
        .replace(/[^\w]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export function OnRoadPriceDialog({
    open,
    onOpenChange,
    brand,
    model,
    defaultVariantLabel,
    exShowroomPaise,
    fuelType,
    engineCc,
    variants = [],
    brandColor = '#2563eb',
}: Props) {
    const normalizedFuelType: TwoWheelerFuelType = fuelType === 'electric' ? 'electric' : 'petrol'
    const variantOptions = useMemo<TwoWheelerOnRoadVariantOption[]>(() => {
        const rows = variants
            .map((variant, index) => {
                const parsedPrice = parseTwoWheelerPriceToPaise(variant.price)
                const fallbackPrice = index === 0 ? exShowroomPaise : 0
                const effectivePrice = parsedPrice > 0 ? parsedPrice : fallbackPrice
                if (effectivePrice <= 0) return null
                return {
                    id: `${variant.name ?? 'variant'}-${index}`,
                    label: variant.name || `Variant ${index + 1}`,
                    exShowroomPaise: effectivePrice,
                }
            })
            .filter((variant): variant is TwoWheelerOnRoadVariantOption => Boolean(variant))

        if (rows.length > 0) return rows

        return [{
            id: 'default',
            label: defaultVariantLabel || `${brand} ${model}`,
            exShowroomPaise,
        }]
    }, [brand, defaultVariantLabel, exShowroomPaise, model, variants])

    const [stateCode, setStateCode] = useState('KA')
    const [variantId, setVariantId] = useState('')
    const [financed, setFinanced] = useState(false)

    useEffect(() => {
        const targetLabel = normalizeVariantLabel(defaultVariantLabel)
        const matching = variantOptions.find((variant) =>
            normalizeVariantLabel(variant.label) === targetLabel
        )
        setVariantId(matching?.id ?? variantOptions[0]?.id ?? '')
        setStateCode('KA')
        setFinanced(false)
    }, [defaultVariantLabel, variantOptions])

    const activeVariant = variantOptions.find((variant) => variant.id === variantId) ?? variantOptions[0]

    const breakdown = useMemo(() => {
        if (!activeVariant) return null
        return calculateTwoWheelerOnRoadPrice({
            exShowroomPaise: activeVariant.exShowroomPaise,
            engineCc,
            fuelType: normalizedFuelType,
            stateCode,
            financed,
        })
    }, [activeVariant, engineCc, financed, normalizedFuelType, stateCode])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 bg-white text-gray-900 border border-gray-200 shadow-2xl overflow-hidden">
                <DialogTitle className="sr-only">
                    {brand} {model} on-road price calculator
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Select your state and variant to estimate the on-road price for {brand} {model}.
                </DialogDescription>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <div className="border-r border-gray-200 bg-gray-50 p-6">
                        <Badge variant="outline" className="mb-3 gap-1.5 border-gray-300 bg-white text-gray-700">
                            <MapPin className="h-3.5 w-3.5" />
                            State-based estimate
                        </Badge>
                        <h2 className="text-2xl font-bold text-gray-900">On-Road Price</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Select the state and bike variant to view the estimated on-road breakup.
                        </p>

                        <div className="mt-6 space-y-5">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">State</Label>
                                <Select value={stateCode} onValueChange={setStateCode}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80">
                                        {TWO_WHEELER_STATE_OPTIONS.map((state) => (
                                            <SelectItem key={state.code} value={state.code}>
                                                {state.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Variant</Label>
                                <Select value={activeVariant?.id ?? ''} onValueChange={setVariantId}>
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
                                    id="two-wheeler-financed"
                                    checked={financed}
                                    onCheckedChange={(checked) => setFinanced(Boolean(checked))}
                                    className="mt-0.5"
                                />
                                <div>
                                    <Label htmlFor="two-wheeler-financed" className="cursor-pointer text-sm font-medium text-gray-900">
                                        Vehicle financed
                                    </Label>
                                    <p className="mt-1 text-xs text-gray-600">
                                        Adds hypothecation charges.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl p-5 text-white" style={{ backgroundColor: brandColor }}>
                            <div className="flex items-center gap-2 text-sm opacity-90">
                                <Bike className="h-4 w-4" />
                                {activeVariant?.label || `${brand} ${model}`}
                            </div>
                            <p className="mt-2 text-sm opacity-80">Ex-showroom</p>
                            <p className="text-3xl font-bold">
                                {activeVariant ? formatInr(activeVariant.exShowroomPaise / 100) : '—'}
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        {breakdown && (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{breakdown.stateName}</p>
                                            <h3 className="text-2xl font-bold text-gray-900">Estimated On-Road Price</h3>
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
                                        { label: 'Ex-showroom price', value: formatInr(breakdown.exShowroom), icon: Bike },
                                        { label: `RTO / road tax (${breakdown.rtoPercent}%)`, value: formatInr(breakdown.rtoCharges), icon: FileText },
                                        { label: 'Insurance', value: formatInr(breakdown.insurance), icon: Shield },
                                        { label: 'Handling & logistics', value: formatInr(breakdown.handling), icon: Wallet },
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
                                            ['Ex-showroom price', breakdown.exShowroom],
                                            [`RTO / road tax (${breakdown.rtoPercent}%)`, breakdown.rtoCharges],
                                            ['Insurance', breakdown.insurance],
                                            ['Handling & logistics', breakdown.handling],
                                            ...(breakdown.hypothecation > 0 ? [['Hypothecation', breakdown.hypothecation] as const] : []),
                                        ].map(([label, amount]) => (
                                            <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
                                                <span className="text-gray-600">{label}</span>
                                                <span className="font-medium text-gray-900">{formatInr(Number(amount))}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-between px-5 py-4 text-base font-bold">
                                            <span>Total on-road price</span>
                                            <span style={{ color: brandColor }}>{formatInr(breakdown.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                    <div className="mb-2 flex items-center gap-2 font-semibold">
                                        <Info className="h-4 w-4" />
                                        Indicative estimate
                                    </div>
                                    <p>
                                        This estimate adds state tax, insurance and purchase-time charges above the ex-showroom price.
                                        Dealer discounts, insurance provider quotes and accessories can change the final amount.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
