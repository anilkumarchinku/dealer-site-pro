"use client"

import Link from "next/link"
import { Calendar, Car, Gift, MapPin, Phone, Search, Wrench } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "./StatusBadge"
import { formatDate, formatPrice, formatServiceType } from "./utils"
import type { PanelData, SectionId } from "./types"

interface Props {
    data: PanelData
    slug: string
    onSectionChange: (id: SectionId) => void
}

type ActivityItem = {
    id: string
    type: "inquiry" | "test-drive" | "sell-request" | "service-booking"
    title: string
    subtitle: string
    status: string
    created_at: string
}

function buildRecentActivity(data: PanelData): ActivityItem[] {
    const items: ActivityItem[] = []

    for (const item of data.history.inquiries) {
        items.push({
            id: item.id, type: "inquiry",
            title: item.vehicle_interest || item.lead_type.replace(/_/g, " "),
            subtitle: formatDate(item.created_at), status: item.status, created_at: item.created_at,
        })
    }
    for (const item of data.history.test_drives) {
        items.push({
            id: item.id, type: "test-drive",
            title: item.vehicle_interest || "Test drive",
            subtitle: `${formatDate(item.preferred_date)}${item.preferred_time ? ` at ${item.preferred_time}` : ""}`,
            status: item.status, created_at: item.created_at,
        })
    }
    for (const item of data.history.sell_requests) {
        items.push({
            id: item.id, type: "sell-request",
            title: [item.year, item.make, item.model].filter(Boolean).join(" "),
            subtitle: `Price ${formatPrice(item.expected_price_paise)}`,
            status: item.status, created_at: item.created_at,
        })
    }
    for (const item of data.history.service_bookings) {
        items.push({
            id: item.id, type: "service-booking",
            title: formatServiceType(item.service_type),
            subtitle: `${formatDate(item.preferred_date)} · ${item.preferred_slot}`,
            status: item.status, created_at: item.created_at,
        })
    }

    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
}

const TYPE_ICON: Record<ActivityItem["type"], React.ReactNode> = {
    "inquiry": <Search className="h-4 w-4 text-blue-500" />,
    "test-drive": <Calendar className="h-4 w-4 text-emerald-500" />,
    "sell-request": <Car className="h-4 w-4 text-amber-500" />,
    "service-booking": <Wrench className="h-4 w-4 text-purple-500" />,
}

export function CustomerPanelDashboard({ data, slug, onSectionChange }: Props) {
    const recentActivity = buildRecentActivity(data)
    const summaryCards: { icon: React.ReactNode; label: string; value: number; section: SectionId }[] = [
        { icon: <Search className="h-5 w-5" />, label: "Inquiries", value: data.history.inquiries.length, section: "inquiries" },
        { icon: <Calendar className="h-5 w-5" />, label: "Test Drives", value: data.history.test_drives.length, section: "test-drives" },
        { icon: <Car className="h-5 w-5" />, label: "Sell Requests", value: data.history.sell_requests.length, section: "sell-requests" },
        { icon: <Wrench className="h-5 w-5" />, label: "Service Bookings", value: data.history.service_bookings.length, section: "service-bookings" },
    ]

    return (
        <div className="space-y-6">
            {/* Hero */}
            <section className="rounded-2xl bg-slate-950 p-6 text-white">
                <p className="text-sm text-slate-300">Welcome back to</p>
                <h2 className="mt-1 text-2xl font-bold">{data.dealer.dealership_name}</h2>
                <p className="mt-2 max-w-2xl text-slate-300">{data.dealer.tagline || `Your showroom in ${data.dealer.location}`}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5"><MapPin className="h-4 w-4" />{data.dealer.location}</span>
                    <a className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20 transition-colors" href={`tel:${data.dealer.phone}`}><Phone className="h-4 w-4" />{data.dealer.phone}</a>
                </div>
            </section>

            {/* Summary Cards */}
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {summaryCards.map(card => (
                    <Card
                        key={card.label}
                        className="cursor-pointer transition-colors hover:border-slate-300"
                        onClick={() => onSectionChange(card.section)}
                    >
                        <CardContent className="p-5">
                            <div className="mb-3 text-slate-500">{card.icon}</div>
                            <p className="text-sm text-slate-500">{card.label}</p>
                            <p className="text-3xl font-bold">{card.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
                <section>
                    <h3 className="mb-3 text-lg font-bold">Recent Activity</h3>
                    <div className="grid gap-2">
                        {recentActivity.map(item => (
                            <div key={item.id} className="flex items-center gap-3 rounded-xl border bg-white p-3">
                                <div className="shrink-0">{TYPE_ICON[item.type]}</div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium truncate">{item.title}</p>
                                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                                </div>
                                <StatusBadge status={item.status} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* New Arrivals */}
            {data.new_arrivals.length > 0 && (
                <section>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold"><Car className="h-5 w-5" /> New Arrivals</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {data.new_arrivals.slice(0, 4).map(vehicle => (
                            <Link key={vehicle.id} href={`/sites/${slug}/${vehicle.id}`} className="rounded-xl border bg-white p-4 transition hover:border-slate-400">
                                <p className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                                <p className="mt-1 text-sm text-slate-600">{vehicle.variant || "Available stock"}</p>
                                <p className="mt-3 font-bold">{formatPrice(vehicle.price_paise)}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {vehicle.fuel_type && <Badge variant="outline">{vehicle.fuel_type}</Badge>}
                                    {vehicle.transmission && <Badge variant="outline">{vehicle.transmission}</Badge>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Promotions */}
            {data.offers.length > 0 && (
                <section>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold"><Gift className="h-5 w-5" /> Promotions</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {data.offers.slice(0, 2).map(offer => (
                            <div key={offer.id} className="rounded-xl border bg-white p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="font-semibold">{offer.title}</p>
                                    {offer.tag && <Badge>{offer.tag}</Badge>}
                                </div>
                                {offer.description && <p className="mt-2 text-sm text-slate-600">{offer.description}</p>}
                                {offer.valid_until && <p className="mt-3 text-xs text-slate-500">Valid until {formatDate(offer.valid_until)}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
