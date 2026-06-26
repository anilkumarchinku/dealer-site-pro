"use client";

import { useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Bike,
    Building2,
    Car,
    Check,
    ClipboardCheck,
    Eye,
    EyeOff,
    FileSpreadsheet,
    Globe,
    ImageIcon,
    LayoutTemplate,
    Link,
    MapPin,
    Phone,
    Rocket,
    Search,
    Store,
    Truck,
    Upload,
    Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CyeproApiBenefits } from "@/components/onboarding/CyeproApiBenefits";
import { cn } from "@/lib/utils";

type VehicleType = "2w" | "3w" | "4w";
type DealerType = "new" | "old" | "hybrid";
type WizardPhase = "vehicle" | "dealer" | "flow";

type Step = {
    id: number;
    label: string;
    title: string;
    description: string;
};

const vehicleOptions: {
    id: VehicleType;
    label: string;
    title: string;
    description: string;
    icon: typeof Car;
}[] = [
    {
        id: "2w",
        label: "2W",
        title: "Two-wheelers",
        description: "Bikes, scooters, EV two-wheelers.",
        icon: Bike,
    },
    {
        id: "3w",
        label: "3W",
        title: "Three-wheelers",
        description: "Passenger autos, cargo, loaders.",
        icon: Truck,
    },
    {
        id: "4w",
        label: "4W",
        title: "Cars",
        description: "Cars, SUVs, MUVs, hatchbacks.",
        icon: Car,
    },
];

const dealerOptions: {
    id: DealerType;
    title: string;
    description: string;
    icon: typeof Store;
}[] = [
    {
        id: "new",
        title: "New",
        description: "Authorised dealer selling first-hand vehicles.",
        icon: Building2,
    },
    {
        id: "old",
        title: "Old",
        description: "Used or pre-owned vehicle dealership.",
        icon: Store,
    },
    {
        id: "hybrid",
        title: "Hybrid",
        description: "Both new and used vehicles in one site.",
        icon: ClipboardCheck,
    },
];

const flowSteps: Step[] = [
    {
        id: 1,
        label: "Dealer Details",
        title: "Dealer details",
        description: "Business identity, contact details, location, URL, and optional branch details.",
    },
    {
        id: 2,
        label: "Brand Details",
        title: "Brand selection",
        description: "Authorised brand selection based on selected 2W, 3W, and 4W categories.",
    },
    {
        id: 3,
        label: "Services",
        title: "Services offered",
        description: "Sales, used sales, finance, service, insurance, parts, trade-in, callback, and more.",
    },
    {
        id: 4,
        label: "Inventory",
        title: "Inventory method",
        description: "Manual entry, Excel or CSV upload, or Cyepro sync.",
    },
    {
        id: 5,
        label: "Website",
        title: "Website design",
        description: "Template, copy, working hours, social links, logo, and hero image.",
    },
    {
        id: 6,
        label: "Review",
        title: "Review and launch",
        description: "Confirm everything, preview URL, and publish the website.",
    },
];

const brandSamples: Record<VehicleType, string[]> = {
    "2w": ["Hero", "Honda", "TVS", "Bajaj", "Yamaha", "Ather"],
    "3w": ["Bajaj RE", "Piaggio", "Mahindra", "Atul", "YC Electric"],
    "4w": ["Maruti Suzuki", "Hyundai", "Tata Motors", "Mahindra", "Toyota", "Kia"],
};

const serviceItems = [
    "New vehicle sales",
    "Used vehicle sales",
    "Finance and EMI",
    "Service and maintenance",
    "Insurance",
    "Parts and accessories",
    "Trade-in",
    "Request callback",
];

const csvFields = [
    "make",
    "model",
    "variant",
    "year",
    "price",
    "km",
    "fuel",
    "transmission",
    "color",
    "reg number",
];

const websiteFields = [
    "Hero title",
    "Hero subtitle",
    "CTA text",
    "Features title",
    "Working hours",
    "Social links",
    "Logo",
    "Hero image",
];

function selectionLabel(selectedVehicles: VehicleType[], dealerType: DealerType | null) {
    const vehicles = selectedVehicles.length
        ? selectedVehicles.map((type) => type.toUpperCase()).join(", ")
        : "Select vehicle type";

    const dealer = dealerType
        ? dealerOptions.find((item) => item.id === dealerType)?.title
        : "Select dealer type";

    return `${vehicles} / ${dealer}`;
}

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Car;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-[#E7E0D7] bg-[#FFFDF7] p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#0B0E12] text-[#F8F2E8]">
                <Icon className="h-4 w-4" />
            </span>
            <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#A8793A]">{label}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#34302A]">{value}</p>
            </div>
        </div>
    );
}

function OptionCard({
    active,
    children,
    onClick,
    testId,
}: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
    testId: string;
}) {
    return (
        <button
            type="button"
            data-testid={testId}
            onClick={onClick}
            className={cn(
                "group relative flex min-h-[164px] flex-col rounded-lg border p-5 text-left transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#A8793A]",
                active
                    ? "border-[#0B0E12] bg-[#0B0E12] text-[#FFFDF7] shadow-[0_24px_60px_rgba(11,14,18,0.18)]"
                    : "border-[#E7E0D7] bg-[#FFFDF7] text-[#0B0E12] shadow-[0_14px_34px_rgba(11,14,18,0.06)] hover:border-[#A8793A]"
            )}
        >
            {children}
            <span
                className={cn(
                    "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border",
                    active ? "border-[#F3D59C] bg-[#F3D59C] text-[#0B0E12]" : "border-[#D6CBBB] text-transparent"
                )}
            >
                <Check className="h-3.5 w-3.5" />
            </span>
        </button>
    );
}

function FlowStepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="rounded-lg border border-[#E7E0D7] bg-[#FFFDF7] p-3 shadow-[0_16px_44px_rgba(11,14,18,0.06)]">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                {flowSteps.map((step, index) => {
                    const complete = step.id < currentStep;
                    const active = step.id === currentStep;
                    return (
                        <div key={step.id} className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <span
                                    className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black",
                                        complete && "border-[#2E8B5A] bg-[#2E8B5A] text-white",
                                        active && "border-[#0B0E12] bg-[#0B0E12] text-white shadow-[0_0_0_4px_rgba(168,121,58,0.16)]",
                                        !complete && !active && "border-[#E1D6C8] bg-[#FFFDF7] text-[#A39E94]"
                                    )}
                                >
                                    {complete ? <Check className="h-4 w-4" /> : step.id}
                                </span>
                                <span className="min-w-0">
                                    <span
                                        className={cn(
                                            "block truncate text-xs font-black",
                                            active ? "text-[#A8793A]" : complete ? "text-[#2E8B5A]" : "text-[#6F6A61]"
                                        )}
                                    >
                                        {step.label}
                                    </span>
                                </span>
                            </div>
                            {index < flowSteps.length - 1 && (
                                <span className={cn("hidden h-px min-w-7 flex-1 lg:block", complete ? "bg-[#2E8B5A]" : "bg-[#E7E0D7]")} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function SetupFlowPreviewPage() {
    const [phase, setPhase] = useState<WizardPhase>("vehicle");
    const [selectedVehicles, setSelectedVehicles] = useState<VehicleType[]>([]);
    const [dealerType, setDealerType] = useState<DealerType | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [previewCyeproKey, setPreviewCyeproKey] = useState("");
    const [showPreviewKey, setShowPreviewKey] = useState(false);

    const selectedStep = flowSteps[currentStep - 1];
    const needsBrandSelection = dealerType === "new" || dealerType === "hybrid";
    const includesCars = selectedVehicles.includes("4w");

    const activeVehicleNames = useMemo(
        () => selectedVehicles.map((type) => vehicleOptions.find((item) => item.id === type)?.title ?? type),
        [selectedVehicles]
    );

    const toggleVehicle = (vehicle: VehicleType) => {
        setSelectedVehicles((current) =>
            current.includes(vehicle)
                ? current.filter((item) => item !== vehicle)
                : [...current, vehicle]
        );
    };

    const goNext = () => {
        if (phase === "vehicle" && selectedVehicles.length > 0) {
            setPhase("dealer");
            return;
        }
        if (phase === "dealer" && dealerType) {
            setPhase("flow");
            setCurrentStep(1);
            return;
        }
        if (phase === "flow" && currentStep < flowSteps.length) {
            setCurrentStep((step) => step + 1);
        }
    };

    const goBack = () => {
        if (phase === "dealer") {
            setPhase("vehicle");
            return;
        }
        if (phase === "flow" && currentStep === 1) {
            setPhase("dealer");
            return;
        }
        if (phase === "flow") {
            setCurrentStep((step) => Math.max(1, step - 1));
        }
    };

    return (
        <main className="min-h-screen bg-[#F5F1EA] text-[#0B0E12]">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
                <header className="flex items-center justify-between border-b border-[#E7E0D7] py-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0B0E12] text-[#F8F2E8]">
                            <Store className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-lg font-black tracking-[-0.02em]">DealerSite Pro</p>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A8793A]">Onboarding flow preview</p>
                        </div>
                    </div>
                    <div className="hidden rounded-full border border-[#E7E0D7] bg-[#FFFDF7] px-4 py-2 text-sm font-black text-[#6F6A61] sm:block">
                        {selectionLabel(selectedVehicles, dealerType)}
                    </div>
                </header>

                <section className="grid flex-1 gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="min-w-0">
                        {phase === "vehicle" && (
                            <div className="space-y-7">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#A8793A]">Start here</p>
                                    <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
                                        Which vehicle types does this dealer sell?
                                    </h1>
                                    <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#6F6A61]">
                                        First select 2W, 3W, 4W, or a mix. The brand step will change based on this selection.
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {vehicleOptions.map((option) => {
                                        const active = selectedVehicles.includes(option.id);
                                        const Icon = option.icon;
                                        return (
                                            <OptionCard key={option.id} active={active} onClick={() => toggleVehicle(option.id)} testId={`vehicle-${option.id}`}>
                                                <span className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-md", active ? "bg-white/10" : "bg-[#EFE5D7]")}>
                                                    <Icon className="h-6 w-6" />
                                                </span>
                                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#A8793A]">{option.label}</p>
                                                <h2 className="mt-2 text-xl font-black">{option.title}</h2>
                                                <p className={cn("mt-2 text-sm font-medium leading-6", active ? "text-[#D7D0C4]" : "text-[#6F6A61]")}>
                                                    {option.description}
                                                </p>
                                            </OptionCard>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {phase === "dealer" && (
                            <div className="space-y-7">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#A8793A]">Next question</p>
                                    <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
                                        Is this dealer new, old, or hybrid?
                                    </h1>
                                    <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#6F6A61]">
                                        This decides whether we show authorised brand selection and used-stock inventory setup.
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {dealerOptions.map((option) => {
                                        const active = dealerType === option.id;
                                        const Icon = option.icon;
                                        return (
                                            <OptionCard key={option.id} active={active} onClick={() => setDealerType(option.id)} testId={`dealer-${option.id}`}>
                                                <span className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-md", active ? "bg-white/10" : "bg-[#EFE5D7]")}>
                                                    <Icon className="h-6 w-6" />
                                                </span>
                                                <h2 className="text-xl font-black">{option.title}</h2>
                                                <p className={cn("mt-2 text-sm font-medium leading-6", active ? "text-[#D7D0C4]" : "text-[#6F6A61]")}>
                                                    {option.description}
                                                </p>
                                            </OptionCard>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {phase === "flow" && selectedStep && (
                            <div className="space-y-6">
                                <FlowStepper currentStep={currentStep} />

                                <section className="overflow-hidden rounded-xl border border-[#E7E0D7] bg-[#FFFDF7] shadow-[0_24px_70px_rgba(11,14,18,0.08)]">
                                    <div className="border-b border-[#E7E0D7] bg-gradient-to-r from-[#FFFDF7] to-[#F4E9D7] px-6 py-5 sm:px-7">
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#A8793A]">
                                            Step {selectedStep.id} of {flowSteps.length}
                                        </p>
                                        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em]">{selectedStep.title}</h1>
                                        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#6F6A61]">{selectedStep.description}</p>
                                    </div>

                                    <div className="p-6 sm:p-7">
                                        {currentStep === 1 && (
                                            <div className="grid gap-4 lg:grid-cols-2">
                                                <DetailRow icon={Store} label="Required" value="Dealership name" />
                                                <DetailRow icon={Link} label="Required" value="Site URL slug" />
                                                <DetailRow icon={MapPin} label="Required" value="Location" />
                                                <DetailRow icon={Phone} label="Required" value="Phone and email" />
                                                <DetailRow icon={ClipboardCheck} label="Optional" value="Years in business, GSTIN, tagline" />
                                                <DetailRow icon={Globe} label="Optional" value="WhatsApp, full address, Google Maps link" />
                                                {includesCars && (dealerType === "new" || dealerType === "hybrid") && (
                                                    <DetailRow icon={Building2} label="Car new or hybrid" value="Multiple branches: city, state, address, phone" />
                                                )}
                                            </div>
                                        )}

                                        {currentStep === 2 && (
                                            <div className="space-y-5">
                                                {needsBrandSelection ? (
                                                    selectedVehicles.map((vehicle) => (
                                                        <div key={vehicle} className="rounded-lg border border-[#E7E0D7] bg-white p-5">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div>
                                                                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#A8793A]">
                                                                        {vehicle.toUpperCase()} brands
                                                                    </p>
                                                                    <h3 className="mt-1 text-lg font-black">
                                                                        Select authorised {vehicle.toUpperCase()} brands
                                                                    </h3>
                                                                </div>
                                                                <Search className="h-5 w-5 text-[#A8793A]" />
                                                            </div>
                                                            <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                                                {brandSamples[vehicle].map((brand, index) => (
                                                                    <div
                                                                        key={brand}
                                                                        className={cn(
                                                                            "flex items-center justify-between rounded-md border px-3 py-2 text-sm font-bold",
                                                                            index < 2
                                                                                ? "border-[#0B0E12] bg-[#0B0E12] text-white"
                                                                                : "border-[#E7E0D7] bg-[#FFFDF7] text-[#34302A]"
                                                                        )}
                                                                    >
                                                                        {brand}
                                                                        {index < 2 && <Check className="h-4 w-4 text-[#F3D59C]" />}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="rounded-lg border border-[#E7E0D7] bg-white p-6">
                                                        <p className="text-lg font-black">No authorised brand selection for old-only dealers.</p>
                                                        <p className="mt-2 text-sm font-semibold leading-6 text-[#6F6A61]">
                                                            Used vehicle brands will come from inventory rows or manual vehicle entry.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {currentStep === 3 && (
                                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                                {serviceItems.map((service, index) => (
                                                    <div
                                                        key={service}
                                                        className={cn(
                                                            "rounded-lg border p-4 text-sm font-bold",
                                                            index < 5
                                                                ? "border-[#0B0E12] bg-[#0B0E12] text-white"
                                                                : "border-[#E7E0D7] bg-white text-[#34302A]"
                                                        )}
                                                    >
                                                        <Wrench className={cn("mb-3 h-5 w-5", index < 5 ? "text-[#F3D59C]" : "text-[#A8793A]")} />
                                                        {service}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {currentStep === 4 && (
                                            <div className="space-y-5">
                                                <div className="grid gap-4 md:grid-cols-3">
                                                    {[
                                                        { title: "Manual", text: "Add vehicles one by one.", icon: ClipboardCheck },
                                                        { title: "Excel / CSV", text: "Upload catalog file.", icon: Upload },
                                                        { title: "Cyepro Sync", text: "Connect API key.", icon: FileSpreadsheet },
                                                    ].map((item, index) => (
                                                        <div
                                                            key={item.title}
                                                            className={cn(
                                                                "rounded-lg border p-5",
                                                                index === 1 ? "border-[#0B0E12] bg-[#0B0E12] text-white" : "border-[#E7E0D7] bg-white"
                                                            )}
                                                        >
                                                            <item.icon className={cn("h-6 w-6", index === 1 ? "text-[#F3D59C]" : "text-[#A8793A]")} />
                                                            <h3 className="mt-4 text-lg font-black">{item.title}</h3>
                                                            <p className={cn("mt-2 text-sm font-semibold leading-6", index === 1 ? "text-[#D7D0C4]" : "text-[#6F6A61]")}>
                                                                {item.text}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="rounded-lg border border-[#E7E0D7] bg-white p-5">
                                                    <p className="text-sm font-black text-[#34302A]">CSV fields</p>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {csvFields.map((field) => (
                                                            <span key={field} className="rounded-full border border-[#E7E0D7] bg-[#FFFDF7] px-3 py-1 text-xs font-black text-[#6F6A61]">
                                                                {field}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="rounded-lg border border-[#E7E0D7] bg-[#F7F9FC] p-5">
                                                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
                                                        <div>
                                                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                                                                Cyepro connected
                                                            </span>
                                                            <h3 className="mt-3 text-lg font-black text-[#0B0E12]">Enter your Cyepro API key</h3>
                                                            <p className="mt-2 text-sm font-semibold leading-6 text-[#6F6A61]">
                                                                Show this explanation beside the key field so dealers understand the CRM and inventory advantage before they connect.
                                                            </p>
                                                            <div className="relative mt-4">
                                                                <input
                                                                    type={showPreviewKey ? "text" : "password"}
                                                                    value={previewCyeproKey}
                                                                    onChange={(event) => setPreviewCyeproKey(event.target.value)}
                                                                    placeholder="Paste your Cyepro API key here"
                                                                    className="h-11 w-full rounded-md border border-[#D8E0EA] bg-white px-4 pr-11 text-sm font-mono font-semibold text-[#0B0E12] outline-none focus:ring-2 focus:ring-[#A8793A]"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowPreviewKey((value) => !value)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A61] transition hover:text-[#0B0E12]"
                                                                    aria-label={showPreviewKey ? "Hide Cyepro API key" : "Show Cyepro API key"}
                                                                >
                                                                    {showPreviewKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <CyeproApiBenefits />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {currentStep === 5 && (
                                            <div className="space-y-5">
                                                <div className="grid gap-4 md:grid-cols-3">
                                                    {["Modern", "Classic", "Sporty"].map((template, index) => (
                                                        <div
                                                            key={template}
                                                            className={cn(
                                                                "overflow-hidden rounded-lg border",
                                                                index === 0 ? "border-[#0B0E12] ring-4 ring-[#A8793A]/15" : "border-[#E7E0D7]"
                                                            )}
                                                        >
                                                            <div className={cn("h-28", index === 0 ? "bg-[#0B0E12]" : index === 1 ? "bg-[#EFE5D7]" : "bg-[#6F1D1B]")} />
                                                            <div className="bg-white p-4">
                                                                <LayoutTemplate className="mb-3 h-5 w-5 text-[#A8793A]" />
                                                                <p className="font-black">{template}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                                    {websiteFields.map((field) => (
                                                        <div key={field} className="rounded-lg border border-[#E7E0D7] bg-white p-4 text-sm font-bold text-[#34302A]">
                                                            <ImageIcon className="mb-3 h-5 w-5 text-[#A8793A]" />
                                                            {field}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {currentStep === 6 && (
                                            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                                                <div className="rounded-lg border border-[#E7E0D7] bg-white p-5">
                                                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#A8793A]">Summary</p>
                                                    <h3 className="mt-2 text-2xl font-black">Kumar Motors setup is ready.</h3>
                                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                                        <DetailRow icon={Store} label="Vehicles" value={activeVehicleNames.join(", ")} />
                                                        <DetailRow icon={ClipboardCheck} label="Dealer type" value={dealerOptions.find((item) => item.id === dealerType)?.title ?? ""} />
                                                        <DetailRow icon={Globe} label="Website URL" value="kumarmotors.indrav.in" />
                                                        <DetailRow icon={Rocket} label="Action" value="Review and publish website" />
                                                    </div>
                                                </div>
                                                <div className="rounded-lg border border-[#2E8B5A]/30 bg-[#EFF8F2] p-5">
                                                    <Rocket className="h-8 w-8 text-[#2E8B5A]" />
                                                    <p className="mt-4 text-lg font-black text-[#0B0E12]">Launch checklist</p>
                                                    <div className="mt-4 space-y-3">
                                                        {["Dealer details", "Brands", "Services", "Inventory", "Website copy"].map((item) => (
                                                            <p key={item} className="flex items-center gap-2 text-sm font-bold text-[#2E8B5A]">
                                                                <Check className="h-4 w-4" />
                                                                {item}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>

                    <aside className="space-y-4">
                        <div className="rounded-xl border border-[#0B0E12] bg-[#0B0E12] p-5 text-[#FFFDF7] shadow-[0_24px_70px_rgba(11,14,18,0.16)]">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F3D59C]">Flow order</p>
                            <div className="mt-5 space-y-3">
                                <div className={cn("rounded-lg border p-3", phase === "vehicle" ? "border-[#F3D59C] bg-white/10" : "border-white/10")}>
                                    <p className="text-sm font-black">Before flow: vehicle type</p>
                                    <p className="mt-1 text-xs font-semibold text-white/65">2W, 3W, 4W first</p>
                                </div>
                                <div className={cn("rounded-lg border p-3", phase === "dealer" ? "border-[#F3D59C] bg-white/10" : "border-white/10")}>
                                    <p className="text-sm font-black">Before flow: dealer type</p>
                                    <p className="mt-1 text-xs font-semibold text-white/65">New, old, hybrid second</p>
                                </div>
                                <div className={cn("rounded-lg border p-3", phase === "flow" ? "border-[#F3D59C] bg-white/10" : "border-white/10")}>
                                    <p className="text-sm font-black">Then onboarding starts</p>
                                    <p className="mt-1 text-xs font-semibold text-white/65">Dealer details to launch</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#E7E0D7] bg-[#FFFDF7] p-5">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#A8793A]">Selected now</p>
                            <p className="mt-3 text-lg font-black">{selectionLabel(selectedVehicles, dealerType)}</p>
                            {phase === "flow" && (
                                <p className="mt-2 text-sm font-semibold leading-6 text-[#6F6A61]">
                                    Active step: {selectedStep?.label}
                                </p>
                            )}
                        </div>
                    </aside>
                </section>

                <footer className="flex flex-col-reverse gap-3 border-t border-[#E7E0D7] py-5 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        data-testid="flow-back"
                        onClick={goBack}
                        disabled={phase === "vehicle"}
                        className="h-11 rounded-md border-[#D8CEBF] bg-[#FFFDF7] px-5 font-black text-[#34302A] hover:bg-white disabled:opacity-40"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button
                        type="button"
                        data-testid="flow-continue"
                        onClick={goNext}
                        disabled={(phase === "vehicle" && selectedVehicles.length === 0) || (phase === "dealer" && !dealerType)}
                        className="h-11 rounded-md bg-[#0B0E12] px-6 font-black text-[#FFFDF7] hover:bg-[#1A1E24] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {phase === "flow" && currentStep === flowSteps.length ? "Preview complete" : "Continue"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </footer>
            </div>
        </main>
    );
}
