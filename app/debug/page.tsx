"use client"

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { automotiveBrands } from "@/lib/colors/automotive-brands";

export default function DebugPage() {
    const { data, reset } = useOnboardingStore();
    const primaryBrand = data.brands && data.brands.length > 0 ? data.brands[0] : 'Maruti Suzuki';
    const brandConfig = automotiveBrands[primaryBrand as keyof typeof automotiveBrands];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Debug Information</h1>
                    <div className="flex gap-2">
                        <Link href="/dashboard">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={reset}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset Store
                        </Button>
                    </div>
                </div>

                {/* Current Store Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Onboarding Store Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </CardContent>
                </Card>

                {/* Brand Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Brand Detection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">Stored Brands:</p>
                            <p className="font-mono text-lg">{JSON.stringify(data.brands)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Primary Brand (First in Array):</p>
                            <p className="font-mono text-lg font-bold">{primaryBrand}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Brand Config Found:</p>
                            <p className="font-mono text-lg">{brandConfig ? "✅ Yes" : "❌ No"}</p>
                        </div>
                        {brandConfig && (
                            <>
                                <div>
                                    <p className="text-sm text-gray-600">Primary Color:</p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-16 h-16 rounded-lg border-2 border-gray-300"
                                            style={{ backgroundColor: brandConfig.primary }}
                                        />
                                        <p className="font-mono text-lg">{brandConfig.primary}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Secondary Color:</p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-16 h-16 rounded-lg border-2 border-gray-300"
                                            style={{ backgroundColor: brandConfig.secondary }}
                                        />
                                        <p className="font-mono text-lg">{brandConfig.secondary}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Gradient:</p>
                                    <p className="font-mono text-sm">{brandConfig.gradient}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tagline:</p>
                                    <p className="italic">"{brandConfig.tagline}"</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Preview Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preview Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Current configuration:</p>
                            <Link href={`/preview?brand=${encodeURIComponent(primaryBrand)}&template=${data.styleTemplate || 'modern'}`}>
                                <Button className="w-full">
                                    View Preview with {primaryBrand}
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Test different brands:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {['Maruti Suzuki', 'Toyota', 'Mahindra', 'Hyundai', 'Tata Motors', 'Honda'].map((brand) => (
                                    <Link key={brand} href={`/preview?brand=${encodeURIComponent(brand)}&template=${data.styleTemplate || 'modern'}`}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            {brand}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* LocalStorage Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>localStorage Key</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-2">
                            Data is stored in your browser under the key: <code className="bg-gray-100 px-2 py-1 rounded">dealersite-onboarding</code>
                        </p>
                        <p className="text-sm text-gray-600">
                            If you're seeing incorrect data, click "Reset Store" above to clear it and start fresh.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
