"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Car,
    Check,
    CircleDollarSign,
    ClipboardCheck,
    Hammer,
    Home,
    PhoneCall,
    RefreshCw,
    ShieldCheck,
    Wrench,
    Zap,
    type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";
import { validateOnboardingServices } from "@/lib/validations/onboarding";

const SERVICES: { id: Service; icon: LucideIcon; title: string; description: string }[] = [
    { id: "new_car_sales", icon: Car, title: "New Car Sales", description: "Sell brand new vehicles" },
    { id: "used_car_sales", icon: Car, title: "Used Car Sales", description: "Sell pre-owned vehicles" },
    { id: "financing", icon: CircleDollarSign, title: "Financing & Leasing", description: "Help customers finance their purchase" },
    { id: "service_maintenance", icon: Wrench, title: "Service & Maintenance", description: "Provide car repairs and upkeep" },
    { id: "body_shop", icon: Hammer, title: "Body Shop & Collision", description: "Collision repair and bodywork" },
    { id: "express_service", icon: Zap, title: "Express Service", description: "Quick oil changes and basic services" },
    { id: "insurance", icon: ClipboardCheck, title: "Insurance Services", description: "Help with auto insurance" },
    { id: "fleet_sales", icon: Building2, title: "Fleet Sales", description: "Sell to business customers" },
    { id: "home_test_drives", icon: Home, title: "Home Test Drives", description: "Bring cars to customers" },
    { id: "extended_warranties", icon: ShieldCheck, title: "Extended Warranties", description: "Offer additional protection plans" },
    { id: "trade_in", icon: RefreshCw, title: "Trade-In Appraisals", description: "Accept trade-in vehicles" },
    { id: "get_callback", icon: PhoneCall, title: "Get Call Back", description: "Request a call from our team" },
];

export default function Step3Page() {
    const router = useRouter();
    const { data, updateData, setStep, isUsedCarDealer } = useOnboardingStore();

    const isUsed = isUsedCarDealer();
    const isBoth = data.dealerCategory === "both";

    const defaultServices = useMemo<Service[]>(() => {
        if (isBoth) {
            return ["new_car_sales", "used_car_sales", "financing", "service_maintenance", "trade_in"];
        }
        if (isUsed) {
            return ["used_car_sales", "financing", "trade_in", "service_maintenance", "insurance"];
        }
        return ["new_car_sales", "financing", "service_maintenance", "trade_in"];
    }, [isBoth, isUsed]);

    const [selectedServices, setSelectedServices] = useState<Service[]>(
        data.services?.length ? data.services : defaultServices
    );
    const [error, setError] = useState("");

    useEffect(() => {
        setSelectedServices(data.services?.length ? data.services : defaultServices);
    }, [data.services, defaultServices]);

    const toggleService = (service: Service) => {
        setSelectedServices((prev) =>
            prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]
        );
        setError("");
    };

    const handleNext = () => {
        const validationError = validateOnboardingServices(selectedServices);
        if (validationError) {
            setError(validationError);
            return;
        }

        updateData({ services: selectedServices });
        setStep(4);
        router.push("/onboarding/step-4");
    };

    const handleBack = () => {
        router.push("/onboarding/step-2-inventory");
    };

    useEffect(() => {
        setStep(3);
    }, [setStep]);

    return (
        <Card className="animate-fade-in overflow-hidden rounded-xl border-[#D8E0EA] bg-white shadow-[0_18px_55px_rgba(7,20,54,0.08)]">
            <CardHeader className="border-b border-[#E3E9F2] bg-gradient-to-r from-[#F8FBFF] to-white px-7 py-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#155EEF]">
                            Service Pages
                        </p>
                        <CardTitle className="text-3xl font-black tracking-[-0.035em] text-[#071436]">
                            What services do you offer?
                        </CardTitle>
                        <CardDescription className="mt-2 max-w-2xl text-base font-medium leading-6 text-[#62708A]">
                            {isBoth
                                ? "You sell both new and pre-owned vehicles. Select every service you want published on the dealer website."
                                : isUsed
                                  ? "Tell us what you offer. We will build service pages tailored for pre-owned car buyers."
                                  : "We will create polished website pages for each selected service."}
                        </CardDescription>
                    </div>
                    <div className="w-fit rounded-full border border-[#CFE0FF] bg-white px-4 py-2 text-sm font-black text-[#155EEF] shadow-[0_10px_24px_rgba(21,94,239,0.08)]">
                        {selectedServices.length} selected
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5 px-7 py-6">
                <p className="text-sm font-bold text-[#35445C]">
                    Choose the services your dealership actively supports.
                </p>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {SERVICES.map((service) => {
                        const selected = selectedServices.includes(service.id);
                        const ServiceIcon = service.icon;

                        return (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() => toggleService(service.id)}
                                className={cn(
                                    "group relative flex min-h-[112px] items-start gap-4 rounded-lg border bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#155EEF] hover:shadow-[0_16px_38px_rgba(7,20,54,0.08)] focus:outline-none focus:ring-2 focus:ring-[#155EEF]",
                                    selected
                                        ? "border-[#155EEF] bg-[#F5F8FF] shadow-[0_14px_34px_rgba(21,94,239,0.12)]"
                                        : "border-[#D8E0EA] shadow-[0_8px_24px_rgba(7,20,54,0.04)]"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition",
                                        selected
                                            ? "border-[#155EEF] bg-[#155EEF] text-white"
                                            : "border-[#D8E0EA] bg-[#F7F9FC] text-[#155EEF]"
                                    )}
                                >
                                    <ServiceIcon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-sm font-black text-[#071436]">{service.title}</span>
                                        <span
                                            className={cn(
                                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
                                                selected
                                                    ? "border-[#155EEF] bg-[#155EEF] text-white"
                                                    : "border-[#CAD5E2] bg-white text-transparent group-hover:border-[#155EEF]"
                                            )}
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-xs font-medium leading-5 text-[#62708A]">
                                        {service.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                        {error}
                    </p>
                )}
            </CardContent>

            <CardFooter className="justify-between border-t border-[#E3E9F2] bg-[#F8FBFF] px-7 py-4">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="font-black text-[#35445C] hover:bg-white hover:text-[#155EEF]"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    className="h-11 rounded-md bg-[#155EEF] px-6 font-black text-white hover:bg-[#0F4FD3]"
                >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
