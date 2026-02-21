"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

const SERVICES: { id: Service; icon: string; title: string; description: string }[] = [
    { id: "new_car_sales", icon: "🚗", title: "New Car Sales", description: "Sell brand new vehicles" },
    { id: "used_car_sales", icon: "🚙", title: "Used Car Sales", description: "Sell pre-owned vehicles" },
    { id: "financing", icon: "💰", title: "Financing & Leasing", description: "Help customers finance their purchase" },
    { id: "service_maintenance", icon: "🔧", title: "Service & Maintenance", description: "Provide car repairs and upkeep" },
    { id: "parts_accessories", icon: "⚙️", title: "Parts & Accessories", description: "Sell genuine parts and add-ons" },
    { id: "body_shop", icon: "🔨", title: "Body Shop & Collision", description: "Collision repair and bodywork" },
    { id: "express_service", icon: "⚡", title: "Express Service", description: "Quick oil changes and basic services" },
    { id: "insurance", icon: "📋", title: "Insurance Services", description: "Help with auto insurance" },
    { id: "fleet_sales", icon: "🏢", title: "Fleet Sales", description: "Sell to business customers" },
    { id: "home_test_drives", icon: "🏠", title: "Home Test Drives", description: "Bring cars to customers" },
    { id: "extended_warranties", icon: "🛡️", title: "Extended Warranties", description: "Offer additional protection plans" },
    { id: "trade_in", icon: "🔄", title: "Trade-In Appraisals", description: "Accept trade-in vehicles" },
    { id: "get_callback", icon: "📞", title: "Get Call Back", description: "Request a call from our team" },
    { id: "buy_accessories", icon: "🛍️", title: "Buy Accessories", description: "Shop for official car accessories" },
];

export default function Step3Page() {
    const router = useRouter();
    const { data, updateData, setStep, isUsedCarDealer } = useOnboardingStore();

    const isUsed = isUsedCarDealer();
    const isBoth = data.dealerCategory === 'both';

    // Pre-select sensible defaults based on dealer type
    const getDefaultServices = (): Service[] => {
        if (isBoth) {
            return [
                "new_car_sales",
                "used_car_sales",
                "financing",
                "service_maintenance",
                "trade_in",
            ];
        }
        if (isUsed) {
            return [
                "used_car_sales",
                "financing",
                "trade_in",
                "service_maintenance",
                "insurance",
            ];
        }
        return [
            "new_car_sales",
            "financing",
            "service_maintenance",
            "parts_accessories",
            "trade_in",
        ];
    };

    const [selectedServices, setSelectedServices] = useState<Service[]>(
        data.services?.length ? data.services : getDefaultServices()
    );
    const [error, setError] = useState("");

    const toggleService = (service: Service) => {
        setSelectedServices(prev =>
            prev.includes(service)
                ? prev.filter(s => s !== service)
                : [...prev, service]
        );
        setError("");
    };

    const handleNext = () => {
        if (selectedServices.length === 0) {
            setError("Please select at least one service");
            return;
        }

        updateData({ services: selectedServices });
        setStep(4);
        router.push("/onboarding/step-4");
    };

    const handleBack = () => {
        if (data.dealerCategory === 'used') {
            // Used dealers: back to inventory source selection
            router.push("/onboarding/step-2-inventory");
        } else {
            // New dealers: brands are collected in step-1, go back there
            router.push("/onboarding/step-1");
        }
    };

    useEffect(() => {
        setStep(3);
    }, [setStep]);

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <CardTitle>What services do you offer?</CardTitle>
                <CardDescription>
                    {isBoth
                        ? "You sell both new and pre-owned vehicles — select all services you offer"
                        : isUsed
                            ? "Tell us what you offer — we'll build service pages tailored for pre-owned car buyers"
                            : "We'll create pages for each service on your website"}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                    Check all that apply:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICES.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={cn(
                                "p-4 rounded-lg border-2 text-left transition-colors flex items-start gap-3",
                                selectedServices.includes(service.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-input hover:bg-accent"
                            )}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5",
                                selectedServices.includes(service.id) ? "bg-primary" : "bg-muted"
                            )}>
                                {selectedServices.includes(service.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span>{service.icon}</span>
                                    <span className="font-medium text-sm">{service.title}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                    {service.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                <p className="text-sm text-muted-foreground">
                    Selected: <strong>{selectedServices.length} services</strong>
                </p>

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
