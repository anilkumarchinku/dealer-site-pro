"use client"

import {
    Building2,
    Clock,
    Globe,
    ImageIcon,
    KeyRound,
    Link as LinkIcon,
    MapPin,
    Palette,
    Shield,
    UploadCloud,
} from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { OnboardingData, Service, StyleTemplate } from "@/lib/types"
import { dealerVehicleSiteUrl } from "@/lib/utils/domain"

type ReviewVehicleType = "car" | "two-wheeler" | "three-wheeler"

type DetailItem = {
    label: string
    value?: string | number | null
    href?: string
    mono?: boolean
    swatch?: string
}

const CATEGORY_LABELS: Record<string, string> = {
    new:  "New vehicles",
    used: "Pre-owned vehicles",
    both: "New + pre-owned vehicles",
}

const TEMPLATE_LABELS: Record<StyleTemplate, string> = {
    luxury:       "Modern / Luxury",
    family:       "Family",
    sporty:       "Sporty",
    professional: "Professional",
}

const SERVICE_LABELS: Record<Service, string> = {
    new_car_sales:       "New vehicle sales",
    used_car_sales:      "Used vehicle sales",
    financing:           "Financing / EMI",
    service_maintenance: "Service & maintenance",
    parts_accessories:   "Parts & accessories",
    body_shop:           "Body shop",
    express_service:     "Express service",
    insurance:           "Insurance",
    fleet_sales:         "Fleet sales",
    home_test_drives:    "Home test rides / demos",
    extended_warranties: "Extended warranty / AMC",
    trade_in:            "Exchange / trade-in",
    get_callback:        "Get callback",
    buy_accessories:     "Buy accessories online",
}

const HIDDEN_REVIEW_SERVICE_IDS = new Set<Service>(["parts_accessories", "buy_accessories"])

const SOCIAL_LABELS = [
    ["facebook", "Facebook"],
    ["instagram", "Instagram"],
    ["twitter", "X / Twitter"],
    ["youtube", "YouTube"],
    ["linkedin", "LinkedIn"],
] as const

function clean(value: unknown) {
    if (typeof value === "string") return value.trim()
    if (typeof value === "number" && Number.isFinite(value)) return String(value)
    return ""
}

function titleCase(value: string) {
    return value
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function fallbackSlug(data: Partial<OnboardingData>) {
    return clean(data.slug) || clean(data.dealershipName)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
}

function visibleItems(items: DetailItem[]) {
    return items.filter((item) => clean(item.value))
}

function formatInventoryMethod(data: Partial<OnboardingData>) {
    const uploadedCount = data.uploadedVehicles?.length ?? 0

    if (data.inventorySource === "cyepro" || data.inventoryEntryMode === "cyepro") return "Cyepro Sync"
    if (data.inventorySource === "own" && uploadedCount > 0) return "Excel / CSV upload"
    if (data.inventoryEntryMode === "upload") return "Excel / CSV upload"
    if (data.inventorySource === "own") return "Manual / own inventory"
    if (data.cyeproApiKey) return "Cyepro CRM key added"
    return ""
}

function formatPhoneWithCountry(phone?: string, code?: string) {
    const value = clean(phone)
    if (!value) return ""
    if (value.startsWith("+")) return value
    return `${clean(code) || "+91"}${value}`
}

function vehicleSegments(data: Partial<OnboardingData>, vehicleType: ReviewVehicleType) {
    const segments = new Set<string>()

    if (data.sellsFourWheelers || vehicleType === "car") segments.add("Cars / 4W")
    if (data.sellsTwoWheelers || vehicleType === "two-wheeler") segments.add("Two-wheelers")
    if (data.sellsThreeWheelers || vehicleType === "three-wheeler") segments.add("Three-wheelers")

    return Array.from(segments)
}

function DetailGrid({ items }: { items: DetailItem[] }) {
    const shownItems = visibleItems(items)
    if (shownItems.length === 0) return null

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {shownItems.map((item) => {
                const value = clean(item.value)
                const content = (
                    <span className={cn("break-words font-semibold text-foreground", item.mono && "font-mono text-sm")}>
                        {value}
                    </span>
                )

                return (
                    <div key={`${item.label}-${value}`} className="min-w-0 rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5">
                        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{item.label}</p>
                        <div className="mt-1 flex min-w-0 items-center gap-2">
                            {item.swatch && (
                                <span
                                    className="h-4 w-4 shrink-0 rounded-full border border-border"
                                    style={{ backgroundColor: item.swatch }}
                                />
                            )}
                            {item.href ? (
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="min-w-0 break-words font-semibold text-primary hover:underline"
                                >
                                    {value}
                                </a>
                            ) : content}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function ChipList({
    items,
    tone = "neutral",
}: {
    items?: string[]
    tone?: "neutral" | "orange" | "green" | "blue"
}) {
    if (!items?.length) return null

    const toneClass = {
        neutral: "border-border bg-muted text-muted-foreground",
        orange:  "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
        green:   "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400",
        blue:    "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    }[tone]

    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item) => (
                <span key={item} className={cn("rounded-full border px-3 py-1 text-sm font-medium", toneClass)}>
                    {item}
                </span>
            ))}
        </div>
    )
}

function ReviewSection({
    title,
    icon,
    children,
}: {
    title: string
    icon: ReactNode
    children: ReactNode
}) {
    return (
        <section className="border-t border-border pt-5">
            <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {icon}
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">{title}</h3>
            </div>
            {children}
        </section>
    )
}

export function OnboardingReviewSummary({
    data,
    vehicleType,
}: {
    data: Partial<OnboardingData>
    vehicleType: ReviewVehicleType
}) {
    const templateConfig = data.templateConfig
    const slug = fallbackSlug(data)
    const siteUrl = dealerVehicleSiteUrl(slug, vehicleType)
    const services = data.services
        ?.filter((service) => !HIDDEN_REVIEW_SERVICE_IDS.has(service))
        .map((service) => SERVICE_LABELS[service] ?? titleCase(service)) ?? []
    const uploadedCount = data.uploadedVehicles?.length ?? 0
    const inventoryMethod = formatInventoryMethod(data)
    const branchRows = data.branches?.filter((branch) => clean(branch.city) || clean(branch.address) || clean(branch.phone)) ?? []
    const socialLinks = SOCIAL_LABELS.map(([field, label]) => ({
        label,
        value: templateConfig?.[field],
        href:  clean(templateConfig?.[field]),
    }))
    const selectedSegments = vehicleSegments(data, vehicleType)
    const hasMedia = Boolean(data.brandLogo || data.heroImage)
    const hasColors = Boolean(data.brandColor || data.brandAccentColor || data.brandColorPreset)
    const hasTemplateCopy = Boolean(
        templateConfig?.heroTitle ||
        templateConfig?.heroSubtitle ||
        templateConfig?.heroCtaText ||
        templateConfig?.featuresTitle ||
        templateConfig?.workingHours
    )
    const hasSocialLinks = visibleItems(socialLinks).length > 0

    return (
        <div className="space-y-5">
            <div className="space-y-4">
                <div className="md:col-span-2 rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Dealership Name</p>
                    <p className="mt-1 break-words text-lg font-semibold text-foreground">{data.dealershipName || "Not provided"}</p>
                    {data.tagline && <p className="mt-1 text-sm italic text-muted-foreground">&ldquo;{data.tagline}&rdquo;</p>}
                </div>

                <DetailGrid
                    items={[
                        { label: "Business type", value: data.dealerCategory ? CATEGORY_LABELS[data.dealerCategory] : undefined },
                        { label: "Vehicle category", value: selectedSegments.join(", ") },
                        { label: "Site URL slug", value: data.slug || slug, mono: true },
                        { label: "Location", value: data.location },
                        { label: "Email", value: data.email },
                        { label: "Phone", value: data.phone },
                        { label: "WhatsApp", value: data.whatsapp },
                        { label: "Years in business", value: data.yearsInBusiness ? `${data.yearsInBusiness} years` : undefined },
                        { label: "GSTIN", value: data.gstin },
                        { label: "Full address", value: data.fullAddress },
                        { label: "Google Maps link", value: data.mapLink, href: clean(data.mapLink) },
                    ]}
                />
            </div>

            {(data.brands?.length || data.brands2w?.length || data.brands3w?.length) && (
                <ReviewSection title="Brands" icon={<Building2 className="h-4 w-4" />}>
                    <div className="space-y-3">
                        {Boolean(data.brands?.length) && (
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Car / 4W brands</p>
                                <ChipList items={data.brands} tone="blue" />
                            </div>
                        )}
                        {Boolean(data.brands2w?.length) && (
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Two-wheeler brands</p>
                                <ChipList items={data.brands2w} tone="orange" />
                            </div>
                        )}
                        {Boolean(data.brands3w?.length) && (
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Three-wheeler brands</p>
                                <ChipList items={data.brands3w} tone="green" />
                            </div>
                        )}
                    </div>
                </ReviewSection>
            )}

            {branchRows.length > 0 && (
                <ReviewSection title={`Branches (${branchRows.length})`} icon={<MapPin className="h-4 w-4" />}>
                    <div className="grid gap-3 md:grid-cols-2">
                        {branchRows.map((branch, index) => (
                            <div key={`${branch.city}-${index}`} className="rounded-lg border border-border/70 bg-muted/20 p-3">
                                <p className="text-sm font-semibold text-foreground">
                                    {clean(branch.city) || `Branch ${index + 1}`}
                                    {branch.state ? `, ${branch.state}` : ""}
                                </p>
                                {branch.address && <p className="mt-1 text-sm text-muted-foreground">{branch.address}</p>}
                                {branch.phone && (
                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {formatPhoneWithCountry(branch.phone, branch.phoneCountryCode)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </ReviewSection>
            )}

            {services.length > 0 && (
                <ReviewSection title={`Services (${services.length})`} icon={<Shield className="h-4 w-4" />}>
                    <ChipList items={services} />
                </ReviewSection>
            )}

            {(inventoryMethod || data.cyeproApiKey || uploadedCount > 0) && (
                <ReviewSection title="Inventory & CRM" icon={<UploadCloud className="h-4 w-4" />}>
                    <DetailGrid
                        items={[
                            { label: "Inventory method", value: inventoryMethod },
                            { label: "Cyepro API key", value: data.cyeproApiKey ? "Added, hidden for security" : undefined },
                            { label: "Uploaded vehicles", value: uploadedCount ? `${uploadedCount} vehicle${uploadedCount === 1 ? "" : "s"}` : undefined },
                        ]}
                    />
                    {uploadedCount > 0 && (
                        <div className="mt-3 overflow-hidden rounded-lg border border-border/70">
                            <div className="grid grid-cols-[1.4fr_0.6fr_0.9fr] bg-muted px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                <span>Vehicle</span>
                                <span>Year</span>
                                <span>Price</span>
                            </div>
                            {data.uploadedVehicles?.slice(0, 3).map((vehicle, index) => (
                                <div key={`${vehicle.make}-${vehicle.model}-${index}`} className="grid grid-cols-[1.4fr_0.6fr_0.9fr] border-t border-border/70 px-3 py-2 text-sm">
                                    <span className="font-medium text-foreground">{[vehicle.make, vehicle.model, vehicle.variant].filter(Boolean).join(" ")}</span>
                                    <span className="text-muted-foreground">{vehicle.year}</span>
                                    <span className="font-medium text-foreground">₹{vehicle.price_inr.toLocaleString("en-IN")}</span>
                                </div>
                            ))}
                            {uploadedCount > 3 && (
                                <p className="border-t border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground">
                                    +{uploadedCount - 3} more vehicles
                                </p>
                            )}
                        </div>
                    )}
                </ReviewSection>
            )}

            <ReviewSection title="Website" icon={<Globe className="h-4 w-4" />}>
                <DetailGrid
                    items={[
                        { label: "Website template", value: data.styleTemplate ? `${TEMPLATE_LABELS[data.styleTemplate]} Style` : undefined },
                        { label: "Free website domain", value: siteUrl, mono: true },
                    ]}
                />
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
                    <Shield className="h-4 w-4 shrink-0" />
                    <span>Free SSL certificate included · No setup required</span>
                </div>
            </ReviewSection>

            {hasTemplateCopy && (
                <ReviewSection title="Website Copy" icon={<Clock className="h-4 w-4" />}>
                    <DetailGrid
                        items={[
                            { label: "Hero title", value: templateConfig?.heroTitle },
                            { label: "Hero subtitle", value: templateConfig?.heroSubtitle },
                            { label: "CTA text", value: templateConfig?.heroCtaText },
                            { label: "Features title", value: templateConfig?.featuresTitle },
                            { label: "Working hours", value: templateConfig?.workingHours },
                        ]}
                    />
                </ReviewSection>
            )}

            {hasSocialLinks && (
                <ReviewSection title="Social Links" icon={<LinkIcon className="h-4 w-4" />}>
                    <DetailGrid items={socialLinks} />
                </ReviewSection>
            )}

            {hasColors && (
                <ReviewSection title="Brand Colors" icon={<Palette className="h-4 w-4" />}>
                    <DetailGrid
                        items={[
                            { label: "Primary color", value: data.brandColor, swatch: clean(data.brandColor) },
                            { label: "Accent color", value: data.brandAccentColor, swatch: clean(data.brandAccentColor) },
                            { label: "Color preset", value: data.brandColorPreset ? titleCase(data.brandColorPreset) : undefined },
                        ]}
                    />
                </ReviewSection>
            )}

            {hasMedia && (
                <ReviewSection title="Images" icon={<ImageIcon className="h-4 w-4" />}>
                    <DetailGrid
                        items={[
                            { label: "Logo", value: data.brandLogo ? "Added" : undefined },
                            { label: "Hero image", value: data.heroImage ? "Added" : undefined },
                        ]}
                    />
                </ReviewSection>
            )}

            {data.cyeproApiKey && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                    <KeyRound className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>The Cyepro key is saved privately and is never shown in full on this review page.</span>
                </div>
            )}
        </div>
    )
}
