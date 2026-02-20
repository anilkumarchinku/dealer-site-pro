"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/types";

const BRANDS: { name: Brand; logo: string }[] = [
    // ========== MASS MARKET BRANDS (Popular in India) ==========
    { name: "Maruti Suzuki", logo: "/assets/logos/maruti-suzuki.png" },
    { name: "Tata Motors", logo: "/assets/logos/tata-motors.png" },
    { name: "Mahindra", logo: "/assets/logos/mahindra.png" },
    { name: "Hyundai", logo: "/assets/logos/hyundai.png" },
    { name: "Honda", logo: "/assets/logos/honda.png" },
    { name: "Toyota", logo: "/assets/logos/toyota.png" },
    { name: "Kia", logo: "/assets/logos/kia.png" },
    { name: "Renault", logo: "/assets/logos/renault.png" },
    { name: "Nissan", logo: "/assets/logos/nissan.png" },
    { name: "Volkswagen", logo: "/assets/logos/volkswagen.png" },

    // ========== MID-PREMIUM & UTILITY BRANDS ==========
    { name: "Skoda", logo: "/assets/logos/skoda.png" },
    { name: "MG", logo: "/assets/logos/mg.png" },
    { name: "Jeep", logo: "/assets/logos/jeep.png" },
    { name: "Citroen", logo: "/assets/logos/citroen.png" },
    { name: "Force Motors", logo: "/assets/logos/force-motors.png" },
    { name: "Isuzu", logo: "/assets/logos/isuzu.png" },

    // ========== LUXURY SEGMENT ==========
    { name: "Mercedes-Benz", logo: "/assets/logos/mercedes-benz.png" },
    { name: "BMW", logo: "/assets/logos/bmw.png" },
    { name: "Audi", logo: "/assets/logos/audi.png" },
    { name: "Jaguar", logo: "/assets/logos/jaguar.png" },
    { name: "Land Rover", logo: "/assets/logos/land-rover.png" },
    { name: "Volvo", logo: "/assets/logos/volvo.png" },
    { name: "Lexus", logo: "/assets/logos/lexus.png" },
    { name: "Porsche", logo: "/assets/logos/porsche.png" },
    { name: "Bentley", logo: "/assets/logos/bentley.png" },
    { name: "Lamborghini", logo: "/assets/logos/lamborghini.png" },

    // ========== ELECTRIC & NEW AGE ==========
    { name: "BYD", logo: "/assets/logos/byd.png" },
    { name: "Tesla", logo: "/assets/logos/tesla.png" },
];

export default function Step2Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    const [selectedBrands, setSelectedBrands] = useState<Brand[]>(data.brands || []);
    const [error, setError] = useState("");

    const toggleBrand = (brand: Brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
        setError("");
    };

    const handleNext = () => {
        if (selectedBrands.length === 0) {
            setError("Please select at least one brand you're authorized to sell");
            return;
        }

        updateData({
            sellsNewCars: true,
            sellsUsedCars: data.dealerCategory === 'both',
            brands: selectedBrands,
        });
        setStep(3);
        router.push("/onboarding/step-3");
    };

    const handleBack = () => {
        router.push("/onboarding/step-1");
    };

    useEffect(() => {
        setStep(2);
    }, [setStep]);

    // Dynamic dealer type label - New cars only
    const getDealerTypeLabel = () => {
        if (selectedBrands.length === 0) return null;
        return selectedBrands.length === 1 ? "Single OEM Dealer" :
            selectedBrands.length > 1 ? "Multi OEM Dealer" : null;
    };

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <CardTitle>Select Your Authorized Brands</CardTitle>
                <CardDescription>
                    Choose the manufacturers you&apos;re authorized to sell new vehicles for
                    {data.dealerCategory === 'both' && (
                        <span className="block mt-1 text-violet-600 font-medium">
                            Hybrid dealership — new car brands + used inventory will both be enabled
                        </span>
                    )}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Dealer Type Indicator */}
                {getDealerTypeLabel() && (
                    <div className="p-3 rounded-md bg-primary/10 border border-primary/20 text-foreground text-sm">
                        → You're a <strong>{getDealerTypeLabel()}</strong>
                    </div>
                )}

                {/* Brand Selection */}
                <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-1">Available Brands</h3>
                            <p className="text-sm text-muted-foreground">
                                Click on each brand you're authorized to sell new vehicles for
                            </p>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {BRANDS.map((brand) => (
                                <button
                                    key={brand.name}
                                    onClick={() => toggleBrand(brand.name)}
                                    className={cn(
                                        "p-3 rounded-md border-2 flex flex-col items-center gap-2 transition-colors hover:bg-accent relative",
                                        selectedBrands.includes(brand.name)
                                            ? "border-primary bg-primary/5"
                                            : "border-input"
                                    )}
                                >
                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                        <Image
                                            src={brand.logo}
                                            alt={`${brand.name} logo`}
                                            width={48}
                                            height={48}
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-xs font-medium truncate w-full text-center">
                                        {brand.name}
                                    </span>
                                    {selectedBrands.includes(brand.name) && (
                                        <div className="absolute top-1 right-1">
                                            <Check className="w-4 h-4 text-primary bg-white rounded-full p-0.5" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {selectedBrands.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                Selected: <strong>{selectedBrands.length} brand{selectedBrands.length > 1 ? 's' : ''}</strong> ({selectedBrands.join(', ')})
                            </p>
                        )}
                    </div>

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
            </CardContent>

            <CardFooter className="justify-between">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                </Button>
                <Button onClick={handleNext}>
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
