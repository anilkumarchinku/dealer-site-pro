"use client"
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/types";
import { validateOnboardingServices } from "@/lib/validations/onboarding";

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

    const defaultServices = useMemo<Service[]>(() => {
        if (isBoth)  return ["new_car_sales", "used_car_sales", "service_maintenance", "financing", "trade_in"];
        if (isUsed)  return ["used_car_sales", "service_maintenance", "financing", "trade_in", "insurance"];
        return ["new_car_sales", "service_maintenance", "parts_accessories", "financing", "home_test_drives"];
    }, [isBoth, isUsed]);

    const [selectedServices, setSelectedServices] = useState<Service[]>(
        data.services?.length ? data.services : defaultServices
    );
    const [error, setError] = useState("");
    const [cyeproKey, setCyeproKey] = useState(data.cyeproApiKey ?? "");
    const [showKey, setShowKey] = useState(false);
    const servicesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedServices(data.services?.length ? data.services : defaultServices);
        setCyeproKey(data.cyeproApiKey ?? "");
    }, [data.services, data.cyeproApiKey, defaultServices]);

    const toggleService = (service: Service) => {
        setSelectedServices(prev =>
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
        setError("");
    };

    const selectAll = () => { setSelectedServices(SERVICES.map(s => s.id)); setError(""); };
    const clearAll = () => setSelectedServices([]);

    const handleNext = () => {
        const validationError = validateOnboardingServices(selectedServices);
        if (validationError) {
            setError(validationError);
            // Pull the user to the field that needs action: scroll it into view,
            // highlight it, and move focus there.
            requestAnimationFrame(() => {
                servicesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                servicesRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
            });
            return;
        }
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
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">Check all that apply</p>
                    <div className="flex items-center gap-3 text-xs font-medium">
                        <button type="button" onClick={selectAll} className="text-primary hover:underline">Select all</button>
                        <span className="text-border">•</span>
                        <button type="button" onClick={clearAll} className="text-muted-foreground hover:text-foreground hover:underline">Clear</button>
                    </div>
                </div>

                <div
                    ref={servicesRef}
                    aria-invalid={!!error}
                    className={cn(
                        "grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl transition-shadow",
                        error && "p-1 ring-2 ring-destructive ring-offset-2"
                    )}
                >
                    {SERVICES.map((service, i) => {
                        const isSel = selectedServices.includes(service.id);
                        return (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() => toggleService(service.id)}
                                aria-pressed={isSel}
                                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                                className={cn(
                                    "group flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all animate-fade-in-up",
                                    "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    isSel
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-input hover:border-primary/40 hover:bg-accent"
                                )}
                            >
                                <div className={cn(
                                    "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-colors",
                                    isSel ? "bg-primary" : "bg-muted group-hover:bg-primary/20"
                                )}>
                                    {isSel && <Check className="h-3 w-3 text-primary-foreground" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg leading-none">{service.icon}</span>
                                        <span className="text-sm font-semibold">{service.title}</span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {service.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {selectedServices.length} selected
                </span>

                {error && (
                    <div
                        role="alert"
                        aria-live="assertive"
                        className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive animate-fade-in"
                    >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* ── Cyepro integration — same key for CRM leads and stock sync ── */}
                <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                    <div>
                        <p className="text-sm font-semibold">Cyepro CRM & Inventory <span className="text-muted-foreground font-normal">(recommended)</span></p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Paste your Cyepro API key so generated website leads land in your Cyepro CRM account.
                            The same key can sync inventory where enabled.
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
