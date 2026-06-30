import { MapPin, Phone, Clock, Building2, MessageCircle } from "lucide-react"

type Branch = { city: string; address: string; phone?: string; whatsapp?: string }
type ServiceCenterLocation = {
    name: string
    address: string
    city?: string | null
    phone?: string | null
    working_hours?: string | null
    maps_url?: string | null
}

type OutletLocation = {
    brandName: string
    outletName?: string | null
    phone?: string | null
    fullAddress?: string | null
    city?: string | null
    googleMapsUrl?: string | null
    branches?: Branch[] | null
}

interface Props {
    dealerName: string
    mainAddress: string
    mainPhone: string
    branches?: Branch[] | null
    serviceCenters?: ServiceCenterLocation[] | null
    outlets?: OutletLocation[] | null
    brandColor?: string
}

function MapCard({
    label,
    address,
    phone,
    whatsapp,
    workingHours,
    mapsUrl,
    googleMapsUrl,
    brandColor,
}: {
    label: string
    address: string
    phone?: string | null
    whatsapp?: string | null
    workingHours?: string | null
    mapsUrl?: string | null
    googleMapsUrl?: string | null
    brandColor: string
}) {
    const mapQuery = encodeURIComponent(address)
    // Prefer the dealer-provided Google Maps URL for embedding (more precise pin)
    const pinUrl = googleMapsUrl || mapsUrl
    const embedSrc = pinUrl
        ? `https://maps.google.com/maps?q=${encodeURIComponent(pinUrl)}&output=embed`
        : `https://maps.google.com/maps?q=${mapQuery}&output=embed`
    const directionsUrl = pinUrl || `https://maps.google.com/?q=${mapQuery}`
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="h-48">
                <iframe
                    src={embedSrc}
                    className="h-full w-full"
                    loading="lazy"
                    title={`${label} location map`}
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
            <div className="p-4 space-y-2">
                <h4 className="font-bold text-gray-900">{label}</h4>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: brandColor }} />
                    <span>{address}</span>
                </div>
                {phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 shrink-0" style={{ color: brandColor }} />
                        <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                    </div>
                )}
                {whatsapp && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageCircle className="h-4 w-4 shrink-0" style={{ color: brandColor }} />
                        <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{whatsapp}</a>
                    </div>
                )}
                {workingHours && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 shrink-0" style={{ color: brandColor }} />
                        <span>{workingHours}</span>
                    </div>
                )}
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium hover:underline"
                    style={{ color: brandColor }}
                >
                    <MapPin className="h-3.5 w-3.5" />
                    Get Directions
                </a>
            </div>
        </div>
    )
}

export function LocationsMapSection({
    dealerName,
    mainAddress,
    mainPhone,
    branches,
    serviceCenters,
    outlets,
    brandColor = "#1e293b",
}: Props) {
    const hasBranches = branches && branches.length > 0
    const hasServiceCenters = serviceCenters && serviceCenters.length > 0
    const hasOutlets = outlets && outlets.some(o => o.fullAddress)
    if (!hasBranches && !hasServiceCenters && !hasOutlets) return null

    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-2xl font-bold text-gray-900">Our Locations</h3>
                <p className="mt-1 text-sm text-gray-600">Find us at any of our locations below</p>
            </div>

            {/* Outlet-specific locations */}
            {hasOutlets && (
                <div className="space-y-6">
                    {outlets.filter(o => o.fullAddress).map((outlet, idx) => {
                        const outletLabel = outlet.outletName || outlet.brandName
                        const outletBranches = outlet.branches ?? []
                        return (
                            <div key={`outlet-${idx}`} className="space-y-3">
                                <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                    <Building2 className="h-4 w-4" style={{ color: brandColor }} />
                                    {outletLabel}
                                    {outlet.city && <span className="text-sm font-normal text-gray-500">— {outlet.city}</span>}
                                </h4>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <MapCard
                                        label={outletLabel}
                                        address={outlet.fullAddress!}
                                        phone={outlet.phone}
                                        googleMapsUrl={outlet.googleMapsUrl}
                                        brandColor={brandColor}
                                    />
                                    {outletBranches.map((branch, bIdx) => (
                                        <MapCard
                                            key={`outlet-${idx}-branch-${bIdx}`}
                                            label={`${outletLabel} — ${branch.city}`}
                                            address={branch.address}
                                            phone={branch.phone}
                                            whatsapp={branch.whatsapp}
                                            brandColor={brandColor}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Dealer-level branches & main address (shown when no outlets have addresses) */}
            {!hasOutlets && (hasBranches || hasServiceCenters) && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <MapCard
                        label={`${dealerName} — Main`}
                        address={mainAddress}
                        phone={mainPhone}
                        brandColor={brandColor}
                    />
                    {hasBranches && branches.map((branch, idx) => (
                        <MapCard
                            key={`branch-${idx}`}
                            label={branch.city}
                            address={branch.address}
                            phone={branch.phone}
                            brandColor={brandColor}
                        />
                    ))}
                </div>
            )}

            {/* Service Centers (always shown when present) */}
            {hasServiceCenters && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {serviceCenters.map((sc, idx) => (
                        <MapCard
                            key={`sc-${idx}`}
                            label={sc.name}
                            address={sc.address}
                            phone={sc.phone}
                            workingHours={sc.working_hours}
                            mapsUrl={sc.maps_url}
                            brandColor={brandColor}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
