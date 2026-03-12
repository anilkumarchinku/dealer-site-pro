"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import brandData from "@/lib/data/brand-models.json"

// ── Brand data ─────────────────────────────────────────────────────────────────

type BrandEntry = { brandId: string; brand: string }

const TWO_WHEELER_BRANDS: BrandEntry[] = [
    ...(brandData.twoWheelers.traditional as BrandEntry[]),
    ...(brandData.twoWheelers.electric    as BrandEntry[]),
]

const THREE_WHEELER_BRANDS: BrandEntry[] = (brandData.threeWheelers as BrandEntry[])

// Known 4W/car brands
const FOUR_WHEELER_BRANDS: BrandEntry[] = [
    { brandId: "maruti-suzuki",  brand: "Maruti Suzuki"   },
    { brandId: "hyundai",        brand: "Hyundai"          },
    { brandId: "tata-motors",    brand: "Tata Motors"      },
    { brandId: "mahindra",       brand: "Mahindra"         },
    { brandId: "toyota",         brand: "Toyota"           },
    { brandId: "honda",          brand: "Honda"            },
    { brandId: "kia",            brand: "Kia"              },
    { brandId: "mg",             brand: "MG"               },
    { brandId: "volkswagen",     brand: "Volkswagen"       },
    { brandId: "skoda",          brand: "Skoda"            },
    { brandId: "renault",        brand: "Renault"          },
    { brandId: "nissan",         brand: "Nissan"           },
    { brandId: "jeep",           brand: "Jeep"             },
    { brandId: "audi",           brand: "Audi"             },
    { brandId: "bmw",            brand: "BMW"              },
    { brandId: "mercedes-benz",  brand: "Mercedes-Benz"    },
    { brandId: "volvo",          brand: "Volvo"            },
    { brandId: "land-rover",     brand: "Land Rover"       },
    { brandId: "jaguar",         brand: "Jaguar"           },
    { brandId: "porsche",        brand: "Porsche"          },
    { brandId: "bentley",        brand: "Bentley"          },
    { brandId: "lexus",          brand: "Lexus"            },
    { brandId: "isuzu",          brand: "Isuzu"            },
    { brandId: "force-motors",   brand: "Force Motors"     },
    { brandId: "citroen",        brand: "Citroen"          },
    { brandId: "tesla",          brand: "Tesla"            },
    { brandId: "byd",            brand: "BYD"              },
]

function logoSrc(brandId: string) {
    const svgIds  = ["cfmoto-india", "tork-motors", "hop-electric", "yulu", "zontes-india"]
    const webpIds = ["okinawa-autotech"]
    const ext = svgIds.includes(brandId) ? "svg" : webpIds.includes(brandId) ? "webp" : "png"
    return `/data/brand-logos/${brandId}.${ext}`
}

// ── Config per type ────────────────────────────────────────────────────────────

type SegType = "2w" | "3w" | "4w"

const SEGMENT_CONFIG: Record<SegType, {
    emoji: string; title: string; subtitle: string
    accent: string; checkBg: string; brands: BrandEntry[]
}> = {
    "2w": {
        emoji:    "🏍️",
        title:    "Add Two-Wheeler Business",
        subtitle: "Select all two-wheeler brands you are authorised to sell.",
        accent:   "border-orange-500 bg-orange-500/5",
        checkBg:  "bg-orange-500",
        brands:   TWO_WHEELER_BRANDS,
    },
    "3w": {
        emoji:    "🛺",
        title:    "Add Three-Wheeler Business",
        subtitle: "Select all three-wheeler brands you are authorised to sell.",
        accent:   "border-purple-500 bg-purple-500/5",
        checkBg:  "bg-purple-500",
        brands:   THREE_WHEELER_BRANDS,
    },
    "4w": {
        emoji:    "🚗",
        title:    "Add Four-Wheeler Business",
        subtitle: "Select all car / SUV brands you are authorised to sell.",
        accent:   "border-blue-500 bg-blue-500/5",
        checkBg:  "bg-blue-500",
        brands:   FOUR_WHEELER_BRANDS,
    },
}

// ── Inner component (uses useSearchParams) ─────────────────────────────────────

function AddVehicleTypeInner() {
    const router       = useRouter()
    const searchParams = useSearchParams()
    const rawType      = searchParams.get("type") ?? "3w"
    const addType: SegType = (["2w", "3w", "4w"].includes(rawType) ? rawType : "3w") as SegType

    const { dealerId, setSellsTwoWheelers, setSellsThreeWheelers, setSellsFourWheelers } = useOnboardingStore()

    const cfg = SEGMENT_CONFIG[addType]

    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const [brandSearch,    setBrandSearch]     = useState("")
    const [brandError,     setBrandError]      = useState("")
    const [saving,         setSaving]          = useState(false)

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])
        setBrandError("")
    }

    const handleSave = async () => {
        if (!dealerId) return
        if (selectedBrands.length === 0) { setBrandError("Please select at least one brand."); return }

        setSaving(true)
        try {
            const vehicleTypeVal = addType  // '2w' | '3w' | '4w'

            // Insert brand rows for this segment
            const brandRows = selectedBrands.map((brand, i) => ({
                dealer_id:    dealerId,
                brand_name:   brand,
                is_primary:   i === 0,
                vehicle_type: vehicleTypeVal,
            }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: brandErr } = await supabase.from("dealer_brands").insert(brandRows as any)
            if (brandErr) throw brandErr

            // Update the correct segment flag on dealers row
            const dealerUpdate =
                addType === "2w" ? { sells_two_wheelers:   true } :
                addType === "3w" ? { sells_three_wheelers: true } :
                                   { sells_four_wheelers:  true }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: dealerErr } = await (supabase as any)
                .from("dealers")
                .update(dealerUpdate)
                .eq("id", dealerId)
            if (dealerErr) throw dealerErr

            // Sync to store
            if (addType === "2w") setSellsTwoWheelers(true)
            else if (addType === "3w") setSellsThreeWheelers(true)
            else setSellsFourWheelers(true)

            router.replace("/dashboard/settings")
        } catch (err) {
            console.error(err)
            setBrandError("Failed to save. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    const filtered = cfg.brands.filter(b =>
        b.brand.toLowerCase().includes(brandSearch.toLowerCase())
    )

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 space-y-6 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Back to Settings
            </Button>

            <Card>
                <CardHeader>
                    <div className="mb-2">
                        <span className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border",
                            addType === "2w" ? "bg-orange-500/10 text-orange-700 border-orange-500/20" :
                            addType === "3w" ? "bg-purple-500/10 text-purple-700 border-purple-500/20" :
                                               "bg-blue-500/10 text-blue-700 border-blue-500/20"
                        )}>
                            {cfg.emoji} {cfg.title}
                        </span>
                    </div>
                    <CardTitle>Which brands do you sell?</CardTitle>
                    <CardDescription>{cfg.subtitle}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={brandSearch}
                            onChange={e => setBrandSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    {/* Brand grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {filtered.map(brand => {
                            const selected = selectedBrands.includes(brand.brand)
                            const initials = brand.brand.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase()
                            return (
                                <button
                                    key={brand.brandId}
                                    type="button"
                                    onClick={() => toggleBrand(brand.brand)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-accent relative",
                                        selected ? cfg.accent : "border-input"
                                    )}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={logoSrc(brand.brandId)}
                                        alt={brand.brand}
                                        className="w-10 h-10 object-contain"
                                        onError={e => {
                                            e.currentTarget.style.display = "none";
                                            (e.currentTarget.nextElementSibling as HTMLElement | null)?.style &&
                                            ((e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex")
                                        }}
                                    />
                                    <span className="w-10 h-10 rounded-full bg-muted text-muted-foreground text-xs font-bold items-center justify-center hidden">
                                        {initials}
                                    </span>
                                    <span className="text-xs font-medium text-center leading-tight">{brand.brand}</span>
                                    {selected && (
                                        <div className={cn("absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center", cfg.checkBg)}>
                                            <Check className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {selectedBrands.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Selected: <strong className="text-foreground">
                                {selectedBrands.length} brand{selectedBrands.length > 1 ? "s" : ""}
                            </strong>
                            {selectedBrands.length <= 3 && <span> ({selectedBrands.join(", ")})</span>}
                        </p>
                    )}

                    {brandError && <p className="text-sm text-destructive">{brandError}</p>}
                </CardContent>

                <CardFooter className="justify-end gap-3">
                    <Button variant="outline" onClick={() => router.back()} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving || selectedBrands.length === 0}>
                        {saving
                            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                            : `Add ${cfg.emoji} ${addType.toUpperCase()} Segment`}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

// ── Page wrapper with Suspense ─────────────────────────────────────────────────

export default function AddVehicleTypePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <AddVehicleTypeInner />
        </Suspense>
    )
}
