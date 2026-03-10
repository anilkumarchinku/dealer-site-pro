"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

const SERVICES: { id: Service; icon: string; title: string; description: string }[] = [
    { id: "new_car_sales",        icon: "🏍️", title: "New Bike Sales",         description: "Sell brand new bikes and scooters"          },
    { id: "used_car_sales",       icon: "🔄", title: "Used Bike Sales",         description: "Sell pre-owned bikes and scooters"          },
    { id: "service_maintenance",  icon: "🔧", title: "Service & Maintenance",   description: "Bike repairs, tune-ups and upkeep"          },
    { id: "parts_accessories",    icon: "⚙️", title: "Parts & Accessories",     description: "Genuine parts, helmets, riding gear"       },
    { id: "financing",            icon: "💰", title: "Financing & EMI",         description: "Easy EMI and loan assistance for buyers"    },
    { id: "insurance",            icon: "📋", title: "Insurance Services",      description: "Two-wheeler insurance and renewals"         },
    { id: "home_test_drives",     icon: "🏠", title: "Free Test Rides",         description: "Let customers test ride before buying"     },
    { id: "trade_in",             icon: "🔄", title: "Exchange / Trade-In",     description: "Accept old bikes as part-exchange"          },
    { id: "express_service",      icon: "⚡", title: "Express Service",          description: "Quick servicing with fast turnaround"       },
    { id: "extended_warranties",  icon: "🛡️", title: "Extended Warranty",       description: "Offer additional protection plans"          },
    { id: "get_callback",         icon: "📞", title: "Get a Callback",          description: "Request a call from our team"               },
    { id: "buy_accessories",      icon: "🛍️", title: "Buy Accessories Online",  description: "Shop for helmets, gloves & accessories"     },
];

export default function TwoWheelerStep2Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    const isUsed = data.dealerCategory === 'used';
    const isBoth = data.dealerCategory === 'both';

    const getDefaultServices = (): Service[] => {
        if (isBoth)  return ["new_car_sales", "used_car_sales", "service_maintenance", "financing", "trade_in"];
        if (isUsed)  return ["used_car_sales", "service_maintenance", "financing", "trade_in", "insurance"];
        return ["new_car_sales", "service_maintenance", "parts_accessories", "financing", "home_test_drives"];
    };

    const [selectedServices, setSelectedServices] = useState<Service[]>(
        data.services?.length ? data.services : getDefaultServices()
    );
    const [error, setError] = useState("");
    const [cyeproKey, setCyeproKey] = useState(data.cyeproApiKey ?? "");
    const [showKey, setShowKey] = useState(false);

    const toggleService = (service: Service) => {
        setSelectedServices(prev =>
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
        setError("");
    };

    const handleNext = () => {
        if (selectedServices.length === 0) { setError("Please select at least one service"); return; }
        updateData({ services: selectedServices, cyeproApiKey: cyeproKey.trim() || undefined });
        setStep(3);
        router.push("/onboarding/two-wheelers/step-3");
    };

    useEffect(() => { setStep(2); }, [setStep]);

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <CardTitle>What services do you offer?</CardTitle>
                <CardDescription>
                    {isBoth
                        ? "You sell both new and pre-owned bikes — select all services you offer"
                        : isUsed
                            ? "Tell us what you offer — we'll build pages tailored for pre-owned bike buyers"
                            : "We'll create pages for each service on your website"}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">Check all that apply:</p>

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

                {error && <p className="text-sm text-destructive">{error}</p>}

                {/* ── Optional Cyepro DMS integration ── */}
                <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                    <div>
                        <p className="text-sm font-semibold">Cyepro DMS — Used Stock Sync <span className="text-muted-foreground font-normal">(optional)</span></p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            If you manage used two-wheelers in Cyepro, paste your API key below to sync inventory automatically.
                        </p>
                    </div>
                    <div className="relative">
                        <input
                            type={showKey ? "text" : "password"}
                            value={cyeproKey}
                            onChange={e => setCyeproKey(e.target.value)}
                            placeholder="Paste your Cyepro API key here"
                            className="w-full px-3 py-2 pr-10 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey(s => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="justify-between">
                <Button variant="ghost" onClick={() => router.push("/onboarding/two-wheelers/step-1")}>
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
