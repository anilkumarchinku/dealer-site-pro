"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Eye, LayoutGrid, RefreshCw, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import brandModelsData from "@/lib/data/brand-models.json";

type AdminTemplateId = "modern" | "luxury" | "sporty" | "family";

type BrandCategory = {
    name: string;
    brands: string[];
};

const ALL_2W_TRADITIONAL = (brandModelsData.twoWheelers.traditional as { brand: string }[]).map((b) => b.brand);
const ALL_2W_ELECTRIC = (brandModelsData.twoWheelers.electric as { brand: string }[]).map((b) => b.brand);
const ALL_3W = (brandModelsData.threeWheelers as { brand: string }[]).map((b) => b.brand);

const BRAND_CATEGORIES: BrandCategory[] = [
    {
        name: "Mass Market",
        brands: ["Maruti Suzuki", "Tata Motors", "Mahindra", "Hyundai", "Honda", "Toyota", "Kia", "Renault", "Nissan", "Volkswagen"],
    },
    {
        name: "Premium",
        brands: ["Skoda", "MG", "Jeep", "Citroen", "Force Motors", "Isuzu"],
    },
    {
        name: "Luxury",
        brands: ["Mercedes-Benz", "BMW", "Audi", "Jaguar", "Land Rover", "Volvo", "Lexus", "Porsche", "Bentley", "Lamborghini", "Aston Martin"],
    },
    {
        name: "Electric",
        brands: ["BYD", "Tesla", "VinFast", "Ola Electric", "Ather Energy"],
    },
    {
        name: "Two Wheelers (ICE)",
        brands: ALL_2W_TRADITIONAL,
    },
    {
        name: "Two Wheelers (EV)",
        brands: ALL_2W_ELECTRIC,
    },
    {
        name: "Three Wheelers",
        brands: ALL_3W,
    },
];

const ALL_BRANDS = Array.from(new Set(BRAND_CATEGORIES.flatMap((category) => category.brands)));

const TEMPLATE_OPTIONS: Array<{ id: AdminTemplateId; label: string; accent: string }> = [
    { id: "modern", label: "Modern", accent: "from-blue-500 to-indigo-600" },
    { id: "luxury", label: "Luxury", accent: "from-amber-500 to-yellow-600" },
    { id: "sporty", label: "Sporty", accent: "from-red-500 to-rose-600" },
    { id: "family", label: "Family", accent: "from-teal-500 to-emerald-600" },
];

function getVehicleTypeLabel(brand: string): string {
    if (ALL_3W.includes(brand)) return "3W";
    if (ALL_2W_TRADITIONAL.includes(brand) || ALL_2W_ELECTRIC.includes(brand)) return "2W";
    return "4W";
}

function PreviewFrame({ brand, template }: { brand: string; template: AdminTemplateId }) {
    const src = `/preview?brand=${encodeURIComponent(brand)}&template=${template}`;

    return (
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted/20">
            <iframe
                title={`${brand} ${template} preview`}
                src={src}
                loading="lazy"
                className="pointer-events-none absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-[0.25] border-0 bg-white"
            />
        </div>
    );
}

export default function AdminPreviewGalleryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTemplate = (searchParams.get("template") as AdminTemplateId | null) ?? "modern";

    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState<AdminTemplateId>(initialTemplate);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        let isMounted = true;

        fetch("/api/admin/session")
            .then(async (res) => {
                const data = await res.json();
                if (!isMounted) return;

                if (!data.authenticated) {
                    router.replace("/admin");
                    return;
                }

                setLoading(false);
            })
            .catch(() => {
                if (!isMounted) return;
                router.replace("/admin");
            });

        return () => {
            isMounted = false;
        };
    }, [router]);

    const visibleBrands = useMemo(() => {
        const categoryBrands = activeCategory === "all"
            ? ALL_BRANDS
            : BRAND_CATEGORIES.find((category) => category.name === activeCategory)?.brands ?? [];

        return categoryBrands.filter((brand) => brand.toLowerCase().includes(search.toLowerCase()));
    }, [activeCategory, search]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 font-medium">Loading admin preview gallery...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1800px] mx-auto px-6 py-8 space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Admin
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">All Brand Preview Gallery</h1>
                            <p className="text-sm text-muted-foreground">
                                Scan every brand website output in one screen using the same preview engine as admin.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                        {visibleBrands.length} brands
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1.5 text-sm">
                        Template: {template}
                    </Badge>
                </div>
            </div>

            <Card className="p-5 space-y-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Template</p>
                        <div className="flex flex-wrap gap-2">
                            {TEMPLATE_OPTIONS.map((option) => {
                                const isSelected = option.id === template;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setTemplate(option.id)}
                                        className={cn(
                                            "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                                            isSelected
                                                ? `bg-gradient-to-r ${option.accent} text-white border-transparent shadow-sm`
                                                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full xl:max-w-md">
                        <p className="text-sm font-medium text-foreground mb-2">Search Brand</p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search Toyota, Hero MotoCorp, Bajaj..."
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Category</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveCategory("all")}
                            className={cn(
                                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                                activeCategory === "all"
                                    ? "bg-foreground text-background"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            All ({ALL_BRANDS.length})
                        </button>
                        {BRAND_CATEGORIES.map((category) => (
                            <button
                                key={category.name}
                                type="button"
                                onClick={() => setActiveCategory(category.name)}
                                className={cn(
                                    "rounded-full px-4 py-2 text-sm font-medium transition-all",
                                    activeCategory === category.name
                                        ? "bg-foreground text-background"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                            >
                                {category.name} ({category.brands.length})
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {visibleBrands.length === 0 ? (
                <Card className="p-10 text-center">
                    <p className="text-lg font-medium text-foreground">No brands matched this filter.</p>
                    <p className="text-sm text-muted-foreground mt-1">Try a different search or switch categories.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {visibleBrands.map((brand) => (
                        <Card key={`${template}-${brand}`} className="p-4 space-y-4 overflow-hidden">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary">{getVehicleTypeLabel(brand)}</Badge>
                                        <Badge variant="outline" className="capitalize">{template}</Badge>
                                    </div>
                                    <h2 className="text-lg font-semibold text-foreground leading-tight">{brand}</h2>
                                </div>

                                <Button asChild variant="outline" size="sm" className="shrink-0">
                                    <Link href={`/preview?brand=${encodeURIComponent(brand)}&template=${template}`}>
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open
                                    </Link>
                                </Button>
                            </div>

                            <PreviewFrame brand={brand} template={template} />

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground truncate">
                                    /preview?brand={brand}&template={template}
                                </span>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={`/preview?brand=${encodeURIComponent(brand)}&template=${template}`}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Full
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
