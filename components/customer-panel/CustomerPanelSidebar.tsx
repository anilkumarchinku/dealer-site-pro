"use client"

import { Calendar, Car, LayoutDashboard, Search, Store, User, Wrench } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SectionId, NavItem } from "./types"

const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inquiries", label: "Inquiries", icon: Search },
    { id: "test-drives", label: "Test Drives", icon: Calendar },
    { id: "sell-requests", label: "Sell Requests", icon: Car },
    { id: "service-bookings", label: "Service Bookings", icon: Wrench },
    { id: "dealer-info", label: "Dealer Info", icon: Store },
]

interface Props {
    activeSection: SectionId
    onSectionChange: (id: SectionId) => void
    counts: Partial<Record<SectionId, number>>
}

export function CustomerPanelSidebar({ activeSection, onSectionChange, counts }: Props) {
    return (
        <nav className="flex h-full flex-col bg-white">
            <div className="border-b border-slate-100 p-4">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-slate-700" />
                    <span className="font-semibold text-slate-900">Customer Panel</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {NAV_ITEMS.map(item => {
                    const count = counts[item.id] ?? 0
                    const isActive = activeSection === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                isActive
                                    ? "bg-slate-100 text-slate-900 font-semibold"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1 text-left">{item.label}</span>
                            {count > 0 && item.id !== "dashboard" && item.id !== "dealer-info" && (
                                <Badge variant="secondary" className="text-xs">{count}</Badge>
                            )}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
