import { MapPin, Phone, Clock } from "lucide-react"

type Branch = { city: string; address: string; phone?: string }
type ServiceCenterLocation = {
    name: string
    address: string
    city?: string | null
    phone?: string | null
    working_hours?: string | null
    maps_url?: string | null
}

interface Props {
    dealerName: string
    mainAddress: string
    mainPhone: string
    branches?: Branch[] | null
    serviceCenters?: ServiceCenterLocation[] | null
    brandColor?: string
}

function MapCard({
    label,
    address,
    phone,
    workingHours,
    mapsUrl,
    brandColor,
}: {
    label: string
    address: string
    phone?: string | null
    workingHours?: string | null
    mapsUrl?: string | null
    brandColor: string
}) {
    const mapQuery = encodeURIComponent(address)
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="h-48">
                <iframe
                    src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
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
                {workingHours && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 shrink-0" style={{ color: brandColor }} />
                        <span>{workingHours}</span>
                    </div>
                )}
                {mapsUrl && (
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium hover:underline"
                        style={{ color: brandColor }}
                    >
                        <MapPin className="h-3.5 w-3.5" />
                        Get Directions
                    </a>
                )}
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
    brandColor = "#1e293b",
}: Props) {
    const hasBranches = branches && branches.length > 0
    const hasServiceCenters = serviceCenters && serviceCenters.length > 0
    if (!hasBranches && !hasServiceCenters) return null

    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-2xl font-bold text-gray-900">Our Locations</h3>
                <p className="mt-1 text-sm text-gray-600">Find us at any of our locations below</p>
            </div>
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
                {hasServiceCenters && serviceCenters.map((sc, idx) => (
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
        </section>
    )
}
