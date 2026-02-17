"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { automotiveBrands } from "@/lib/colors/automotive-brands";
import { getCarsByMake } from "@/lib/data/cars";
import { Check, X, Eye, ArrowLeft } from "lucide-react";

const ALL_BRANDS = [
    // Mass Market
    "Maruti Suzuki", "Tata Motors", "Mahindra", "Hyundai", "Honda",
    "Toyota", "Kia", "Renault", "Nissan", "Volkswagen",
    // Mid-Premium
    "Skoda", "MG", "Jeep", "Citroen", "Force Motors", "Isuzu",
    // Luxury
    "Mercedes-Benz", "BMW", "Audi", "Jaguar", "Land Rover",
    "Volvo", "Lexus", "Porsche", "Bentley", "Lamborghini",
    // Electric
    "BYD", "Tesla",
];

export default function TestBrandsPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'luxury' | 'sporty' | 'family'>('family');

    const getBrandStatus = (brand: string) => {
        const hasColors = !!automotiveBrands[brand as keyof typeof automotiveBrands];
        const cars = getCarsByMake(brand);
        const hasCars = cars.length > 0;

        return {
            hasColors,
            hasCars,
            carCount: cars.length,
            color: hasColors ? automotiveBrands[brand as keyof typeof automotiveBrands].primary : '#999',
            isWorking: hasColors && hasCars
        };
    };

    const stats = ALL_BRANDS.map(brand => ({
        brand,
        ...getBrandStatus(brand)
    }));

    const workingCount = stats.filter(s => s.isWorking).length;
    const withColors = stats.filter(s => s.hasColors).length;
    const withCars = stats.filter(s => s.hasCars).length;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">🧪 Brand Testing Dashboard</h1>
                        <p className="text-gray-600 mt-1">Test all {ALL_BRANDS.length} brands - Colors, Cars & Preview</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-green-600">{workingCount}/{ALL_BRANDS.length}</div>
                            <p className="text-sm text-gray-600">Fully Working</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-blue-600">{withColors}/{ALL_BRANDS.length}</div>
                            <p className="text-sm text-gray-600">With Colors</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-purple-600">{withCars}/{ALL_BRANDS.length}</div>
                            <p className="text-sm text-gray-600">With Cars</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-amber-600">{ALL_BRANDS.length - workingCount}</div>
                            <p className="text-sm text-gray-600">Issues</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Template Selector */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preview Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            {(['modern', 'luxury', 'sporty', 'family'] as const).map((template) => (
                                <Button
                                    key={template}
                                    variant={selectedTemplate === template ? 'default' : 'outline'}
                                    onClick={() => setSelectedTemplate(template)}
                                    className="capitalize"
                                >
                                    {template}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Brand Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Brands ({ALL_BRANDS.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {stats.map(({ brand, hasColors, hasCars, carCount, color, isWorking }) => (
                                <div
                                    key={brand}
                                    className={`p-4 rounded-lg border-2 ${
                                        isWorking
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-red-200 bg-red-50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 relative">
                                                <Image
                                                    src={`/assets/logos/${brand.toLowerCase().replace(/\s+/g, '-')}.png`}
                                                    alt={brand}
                                                    fill
                                                    className="object-contain"
                                                    sizes="32px"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm">{brand}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div
                                                        className="w-4 h-4 rounded border"
                                                        style={{ backgroundColor: color }}
                                                        title={color}
                                                    />
                                                    <span className="text-xs text-gray-600">{carCount} cars</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {isWorking ? (
                                                <Check className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <X className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-3">
                                        <div className="flex items-center gap-2 text-xs">
                                            {hasColors ? (
                                                <Check className="w-3 h-3 text-green-600" />
                                            ) : (
                                                <X className="w-3 h-3 text-red-600" />
                                            )}
                                            <span className={hasColors ? 'text-green-700' : 'text-red-700'}>
                                                Colors {hasColors ? 'configured' : 'missing'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            {hasCars ? (
                                                <Check className="w-3 h-3 text-green-600" />
                                            ) : (
                                                <X className="w-3 h-3 text-red-600" />
                                            )}
                                            <span className={hasCars ? 'text-green-700' : 'text-red-700'}>
                                                {carCount} car{carCount !== 1 ? 's' : ''} available
                                            </span>
                                        </div>
                                    </div>

                                    <Link href={`/preview?brand=${encodeURIComponent(brand)}&template=${selectedTemplate}`}>
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            variant={isWorking ? 'default' : 'secondary'}
                                            disabled={!isWorking}
                                        >
                                            <Eye className="w-3 h-3 mr-2" />
                                            Preview
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Issues Section */}
                {workingCount < ALL_BRANDS.length && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-red-900">⚠️ Brands with Issues</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {stats.filter(s => !s.isWorking).map(({ brand, hasColors, hasCars, carCount }) => (
                                    <div key={brand} className="bg-white p-3 rounded-lg">
                                        <p className="font-semibold">{brand}</p>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {!hasColors && <p>❌ Missing color configuration</p>}
                                            {!hasCars && <p>❌ No cars in database ({carCount} found)</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
