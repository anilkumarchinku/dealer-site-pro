"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
    slug: string
    email: string
    dealerName: string
    onLogout: () => void
    onMenuToggle: () => void
}

export function CustomerPanelTopBar({ slug, email, dealerName, onLogout, onMenuToggle }: Props) {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="flex h-14 items-center justify-between gap-3 px-4">
                <div className="flex items-center gap-3 min-w-0">
                    <Button variant="outline" size="icon" className="shrink-0 lg:hidden" onClick={onMenuToggle}>
                        <Menu className="h-4 w-4" />
                    </Button>
                    <h1 className="text-lg font-bold truncate">{dealerName}</h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="truncate max-w-[180px]">{email}</span>
                    </span>
                    <div className="hidden sm:block w-px h-5 bg-slate-200" />
                    <Link
                        href={`/sites/${slug}`}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
                        title="Back to showroom"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden md:inline">Showroom</span>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={onLogout} className="gap-1.5 text-slate-600">
                        <LogOut className="h-4 w-4" />
                        <span className="hidden md:inline">Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
