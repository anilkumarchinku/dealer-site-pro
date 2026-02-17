"use client"

/**
 * Admin Dashboard - PRO Edition
 * Professional control center for template and brand management
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Check,
    ExternalLink,
    RefreshCw,
    LayoutTemplate,
    Car,
    Sparkles,
    Crown,
    Zap,
    Heart,
    Settings,
    Eye,
    ChevronRight,
    Palette,
    Globe,
    TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { automotiveBrands } from "@/lib/colors/automotive-brands";
import { allCars } from "@/lib/data/cars";
import { CarGrid } from "@/components/cars/CarGrid";

const TEMPLATES = [
    {
        id: "modern",
        name: "Modern",
        description: "Clean lines, blue gradients, floating navigation. Perfect for contemporary dealerships.",
        icon: Sparkles,
        gradient: "from-blue-500 to-indigo-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        accentColor: "text-blue-600",
        preview: "Blue & Indigo",
    },
    {
        id: "luxury",
        name: "Luxury",
        description: "Elegant serif typography, gold accents, cinematic hero. For premium brands.",
        icon: Crown,
        gradient: "from-amber-500 to-yellow-600",
        bgColor: "bg-gradient-to-br from-neutral-900 to-neutral-800",
        borderColor: "border-amber-500/30",
        accentColor: "text-amber-500",
        preview: "Gold & Black",
        dark: true,
    },
    {
        id: "sporty",
        name: "Sporty",
        description: "High-energy design, aggressive angles, racing aesthetic. For performance cars.",
        icon: Zap,
        gradient: "from-red-500 to-rose-600",
        bgColor: "bg-gradient-to-br from-gray-900 to-red-950",
        borderColor: "border-red-500/30",
        accentColor: "text-red-500",
        preview: "Red & Black",
        dark: true,
    },
    {
        id: "family",
        name: "Family",
        description: "Warm, friendly design with teal accents. Safe, trustworthy feel for families.",
        icon: Heart,
        gradient: "from-teal-500 to-emerald-600",
        bgColor: "bg-gradient-to-br from-teal-50 to-emerald-50",
        borderColor: "border-teal-200",
        accentColor: "text-teal-600",
        preview: "Teal & Emerald",
    },
];

const BRAND_CATEGORIES = [
    {
        name: "Mass Market",
        brands: ["Maruti Suzuki", "Tata Motors", "Mahindra", "Hyundai", "Honda", "Toyota", "Kia", "Renault", "Nissan", "Volkswagen"]
    },
    {
        name: "Premium",
        brands: ["Skoda", "MG", "Jeep", "Citroen", "Force Motors", "Isuzu"]
    },
    {
        name: "Luxury",
        brands: ["Mercedes-Benz", "BMW", "Audi", "Jaguar", "Land Rover", "Volvo", "Lexus", "Porsche", "Bentley", "Lamborghini"]
    },
    {
        name: "Electric",
        brands: ["BYD", "Tesla", "Ola Electric", "Ather Energy"]
    }
];

const ALL_BRANDS = BRAND_CATEGORIES.flatMap(cat => cat.brands);

export default function AdminDashboard() {
    const router = useRouter();
    const { data, updateData } = useOnboardingStore();

    const [selectedTemplate, setSelectedTemplate] = useState<string>(data.styleTemplate || "modern");
    const [selectedBrand, setSelectedBrand] = useState<string>(data.brands?.[0] || "Toyota");
    const [isLaunching, setIsLaunching] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const handleLaunch = () => {
        setIsLaunching(true);

        updateData({
            styleTemplate: selectedTemplate as any,
            brands: [selectedBrand as any],
            dealershipName: data.dealershipName || "Demo Motors",
            location: data.location || "123 Auto Park, City Center",
            phone: data.phone || "+91 98765 43210",
            email: data.email || "sales@demo-motors.com",
            sellsNewCars: true,
            sellsUsedCars: true,
            services: ["new_car_sales", "service_maintenance", "parts_accessories"],
        });

        setTimeout(() => {
            router.push(`/preview?brand=${encodeURIComponent(selectedBrand)}&template=${selectedTemplate}`);
        }, 500);
    };

    const filteredBrands = activeCategory === "all"
        ? ALL_BRANDS
        : BRAND_CATEGORIES.find(cat => cat.name === activeCategory)?.brands || [];

    const selectedTemplateData = TEMPLATES.find(t => t.id === selectedTemplate);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Premium Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-16 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-xs text-gray-500">Template Control Center</p>
                            </div>
                        </div>

                        {/* Current Selection */}
                        <div className="hidden md:flex items-center gap-6">
                            <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">Template:</span>
                                    <span className="text-sm font-semibold text-gray-900 capitalize">{selectedTemplate}</span>
                                </div>
                                <div className="w-px h-4 bg-gray-200" />
                                <div className="flex items-center gap-2">
                                    <Car className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">Brand:</span>
                                    <span className="text-sm font-semibold text-gray-900">{selectedBrand}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleLaunch}
                                disabled={isLaunching}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30"
                            >
                                {isLaunching ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Eye className="w-4 h-4 mr-2" />
                                )}
                                Preview Site
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Templates", value: "4", icon: LayoutTemplate, color: "blue" },
                        { label: "Brands", value: ALL_BRANDS.length.toString(), icon: Car, color: "emerald" },
                        { label: "Categories", value: BRAND_CATEGORIES.length.toString(), icon: Globe, color: "violet" },
                        { label: "Active", value: "1", icon: TrendingUp, color: "amber" },
                    ].map((stat, i) => (
                        <Card key={i} className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    stat.color === "blue" && "bg-blue-100 text-blue-600",
                                    stat.color === "emerald" && "bg-emerald-100 text-emerald-600",
                                    stat.color === "violet" && "bg-violet-100 text-violet-600",
                                    stat.color === "amber" && "bg-amber-100 text-amber-600",
                                )}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Templates Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <LayoutTemplate className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Choose Template</h2>
                                <p className="text-sm text-gray-500">Select the perfect design for your dealership</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEMPLATES.map((template) => {
                            const Icon = template.icon;
                            const isSelected = selectedTemplate === template.id;

                            return (
                                <Card
                                    key={template.id}
                                    className={cn(
                                        "cursor-pointer transition-all duration-300 overflow-hidden group",
                                        "hover:shadow-xl hover:-translate-y-1",
                                        isSelected && "ring-2 ring-offset-2 ring-blue-500 shadow-xl scale-[1.02]"
                                    )}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    {/* Preview Area */}
                                    <div className={cn(
                                        "aspect-[4/3] relative overflow-hidden",
                                        template.bgColor
                                    )}>
                                        {/* Template Preview Image */}
                                        <Image
                                            src={`/assets/templates/${template.id}.png`}
                                            alt={template.name}
                                            fill
                                            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity",
                                            `bg-gradient-to-br ${template.gradient}`
                                        )} />

                                        {/* Selected Badge */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}

                                        {/* Template Icon */}
                                        <div className={cn(
                                            "absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm",
                                            template.dark ? "bg-white/20" : "bg-black/10"
                                        )}>
                                            <Icon className={cn("w-5 h-5", template.dark ? "text-white" : "text-gray-700")} />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                                            <span className={cn(
                                                "text-xs font-medium px-2 py-1 rounded-full",
                                                `bg-gradient-to-r ${template.gradient} text-white`
                                            )}>
                                                {template.preview}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Brands Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Select Brand</h2>
                                <p className="text-sm text-gray-500">Choose the automotive brand to showcase</p>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => setActiveCategory("all")}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    activeCategory === "all"
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                All ({ALL_BRANDS.length})
                            </button>
                            {BRAND_CATEGORIES.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                        activeCategory === cat.name
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {filteredBrands.map((brandName) => {
                            const isSelected = selectedBrand === brandName;
                            const brandConfig = automotiveBrands[brandName as keyof typeof automotiveBrands];
                            const brandColor = brandConfig?.primary || '#3B82F6';

                            return (
                                <Card
                                    key={brandName}
                                    className={cn(
                                        "p-4 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 relative",
                                        "hover:shadow-lg hover:-translate-y-1",
                                        isSelected
                                            ? "ring-2 bg-gray-50 shadow-lg"
                                            : "hover:bg-gray-50"
                                    )}
                                    style={isSelected ? { borderColor: brandColor } : {}}
                                    onClick={() => setSelectedBrand(brandName)}
                                >
                                    <div className="w-12 h-12 relative">
                                        <Image
                                            src={`/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                            alt={brandName}
                                            fill
                                            className="object-contain"
                                            sizes="48px"
                                        />
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium text-center line-clamp-1",
                                        isSelected ? "font-bold" : "text-gray-600"
                                    )}
                                    style={isSelected ? { color: brandColor } : {}}>
                                        {brandName}
                                    </span>

                                    {/* Brand Color Indicator */}
                                    <div
                                        className="w-full h-1 rounded-full mt-1"
                                        style={{ backgroundColor: brandColor }}
                                    />

                                    {isSelected && (
                                        <div
                                            className="absolute top-2 right-2 w-5 h-5 rounded-full text-white flex items-center justify-center"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Browse All Cars Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Browse All Available Cars</h2>
                                <p className="text-sm text-gray-500">Click any car to view details and specifications</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/cars')}
                        >
                            View All with Filters
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <CarGrid
                        cars={allCars}
                        variant="compact"
                        showEMI={true}
                        onViewDetails={(carId) => router.push(`/cars/${carId}`)}
                    />
                </section>

                {/* Preview Card */}
                <section>
                    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl" />

                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    <span className="text-amber-400 text-sm font-medium">Ready to Preview</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">
                                    {selectedBrand} with {selectedTemplateData?.name} Template
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    See how your dealership website will look with the selected template and brand combination.
                                </p>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleLaunch}
                                        disabled={isLaunching}
                                        size="lg"
                                        className="bg-white text-gray-900 hover:bg-gray-100"
                                    >
                                        {isLaunching ? (
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                        )}
                                        Launch Preview
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-white/20 text-white hover:bg-white/10"
                                        onClick={() => router.push('/dashboard')}
                                    >
                                        Go to Dashboard
                                    </Button>
                                </div>
                            </div>

                            {/* Preview Thumbnail */}
                            <div className="relative w-full md:w-72 aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                <Image
                                    src={`/assets/templates/${selectedTemplate}.png`}
                                    alt="Template Preview"
                                    fill
                                    className="object-cover"
                                />
                                <div className={cn(
                                    "absolute inset-0 opacity-30",
                                    `bg-gradient-to-br ${selectedTemplateData?.gradient}`
                                )} />
                            </div>
                        </div>
                    </Card>
                </section>
            </main>

            {/* Mobile Fixed Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                <Button
                    onClick={handleLaunch}
                    disabled={isLaunching}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="lg"
                >
                    {isLaunching ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Eye className="w-4 h-4 mr-2" />
                    )}
                    Preview: {selectedTemplate} / {selectedBrand}
                </Button>
            </div>
        </div>
    );
}
