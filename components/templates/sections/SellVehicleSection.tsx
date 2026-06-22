import { ArrowRight, ClipboardCheck } from 'lucide-react'
import { getContrastText } from '@/lib/utils/color-contrast'

interface SellVehicleSectionProps {
    dealerName: string
    sellHref?: string
    brandColor: string
}

export function SellVehicleSection({ dealerName, sellHref, brandColor }: SellVehicleSectionProps) {
    if (!sellHref) return null

    return (
        <section id="sell-vehicle" className="border-t border-gray-200 bg-white px-4 py-12">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                    <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }}
                    >
                        <ClipboardCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Want to sell your vehicle?</p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950">Sell your car to {dealerName}</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                            Submit your owner, vehicle, insurance, condition, and inspection details for dealer review.
                        </p>
                    </div>
                </div>
                <a
                    href={sellHref}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }}
                >
                    Sell Your Car
                    <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </section>
    )
}
