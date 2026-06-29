"use client"

import { MapPin, Phone as PhoneIcon, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Dealer } from "./types"

interface Props {
    dealer: Dealer
}

export function CustomerPanelDealerInfo({ dealer }: Props) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Dealer Info</h2>

            <div className="rounded-xl border bg-white p-5">
                <h3 className="text-lg font-bold">{dealer.dealership_name}</h3>
                <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{dealer.full_address || dealer.location}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={`tel:${dealer.phone}`}><PhoneIcon className="h-4 w-4" /> Call</a>
                    </Button>
                    {dealer.whatsapp && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <a href={`https://wa.me/${dealer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                                <MessageCircle className="h-4 w-4" /> WhatsApp
                            </a>
                        </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={`mailto:${dealer.email}`}><Mail className="h-4 w-4" /> Email</a>
                    </Button>
                </div>
            </div>

            {dealer.branches && dealer.branches.length > 0 && (
                <>
                    <h3 className="text-lg font-bold">Branches</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {dealer.branches.map((branch, index) => (
                            <div key={index} className="rounded-xl border bg-white p-4">
                                <p className="font-semibold">{branch.city || `Branch ${index + 1}`}</p>
                                {branch.address && <p className="mt-1 text-sm text-slate-600">{branch.address}</p>}
                                {branch.phone && (
                                    <a href={`tel:${branch.phone}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                                        <PhoneIcon className="h-3.5 w-3.5" /> {branch.phone}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
