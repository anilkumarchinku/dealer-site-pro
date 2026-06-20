"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import {
    ArrowRight,
    Bike,
    Building2,
    Car,
    Check,
    CheckCircle2,
    ClipboardCheck,
    ExternalLink,
    Eye,
    FileText,
    Fuel,
    Gauge,
    GitCompare,
    Globe2,
    Heart,
    LayoutTemplate,
    LogIn,
    Mail,
    MapPin,
    Menu,
    MessageSquare,
    Moon,
    Palette,
    Phone,
    Rocket,
    Send,
    ShieldCheck,
    Store,
    Sun,
    Truck,
    Users,
    X,
    Zap,
} from "lucide-react";
import { toast } from "@/lib/utils/toast";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { supabase } from "@/lib/supabase";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { getBrandLogo } from "@/lib/data/brand-logos";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import type { Car as CarType } from "@/lib/types/car";
import { cn } from "@/lib/utils";

interface WelcomeClientProps {
    cars: CarType[];
}

const navLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Examples", href: "#examples" },
    { label: "For dealers", href: "#for-dealers" },
    { label: "Pricing", href: "#pricing" },
];

const heroProof = [
    { icon: Globe2, title: "Free subdomain" },
    { icon: Car, title: "Works for cars, bikes, and autos" },
    { icon: MessageSquare, title: "Lead dashboard included" },
];

const setupSteps = [
    { number: "1", title: "Business details", caption: "Showroom info", icon: Store },
    { number: "2", title: "Vehicles you sell", caption: "Cars, bikes, autos", icon: Car },
    { number: "3", title: "Pick a style", caption: "Choose a template", icon: Palette },
    { number: "4", title: "Add inventory", caption: "Upload vehicles", icon: ClipboardCheck },
    { number: "5", title: "Go live", caption: "Site published", icon: Check },
];

const previewVehicles = [
    {
        name: "Maruti Swift",
        meta: "2024 - Petrol - Manual",
        price: "Rs 5,45,000",
        image: "/data/brand-model-images/4w-galleries/maruti-suzuki/swift/colors/sizzling-red.avif",
    },
    {
        name: "Hyundai Creta",
        meta: "2024 - Diesel - Manual",
        price: "Rs 13,75,000",
        image: "/data/brand-model-images/4w/hyundai/creta.jpg",
    },
    {
        name: "Royal Enfield Classic 350",
        meta: "2024 - Petrol - Manual",
        price: "Rs 1,65,000",
        image: "/data/brand-model-images/royal-enfield/classic-350.png",
    },
    {
        name: "Bajaj Maxima Z",
        meta: "2024 - CNG - Manual",
        price: "Rs 2,45,000",
        image: "/data/brand-model-images/bajaj-auto/maxima-z.png",
    },
];

const timeline = [
    { icon: FileText, title: "Details", text: "Add your dealership name, address, and contact info." },
    { icon: Car, title: "Vehicles", text: "Add cars, bikes, or autos with photos and prices." },
    { icon: LayoutTemplate, title: "Design", text: "Choose a clean website style that fits your brand." },
    { icon: Rocket, title: "Publish", text: "Go live instantly and start getting enquiries." },
];

const examples = [
    {
        title: "Car dealership",
        text: "New cars, used cars, test drives, finance enquiries, and brand pages.",
        icon: Car,
    },
    {
        title: "Bike showroom",
        text: "Bikes, scooters, EVs, bookings, service requests, and WhatsApp leads.",
        icon: Bike,
    },
    {
        title: "Auto dealer",
        text: "Passenger autos, cargo vehicles, fleet enquiries, and city-wise availability.",
        icon: Truck,
    },
];

const features = [
    "Professional website",
    "Inventory pages",
    "Lead dashboard",
    "WhatsApp and call actions",
    "Service bookings",
    "Custom domain ready",
    "Reviews and offers",
    "Mobile-friendly design",
];

const dealerTypes = [
    "Single-brand showroom",
    "Multi-brand dealer",
    "Used vehicle seller",
    "Cars, bikes, and autos",
];

const carBrands = [
    "Maruti Suzuki",
    "Hyundai",
    "Tata Motors",
    "Kia",
    "Mahindra",
    "Toyota",
    "Honda",
    "MG",
    "Skoda",
    "BMW",
];

const browseGroups = {
    cars: {
        label: "Cars",
        title: "Browse by Body Type",
        href: "/cars",
        items: [
            { name: "Hatchback", count: "4 cars", icon: Gauge, color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Sedan", count: "6 cars", icon: Car, color: "text-emerald-600", bg: "bg-emerald-50" },
            { name: "SUV", count: "2 cars", icon: Truck, color: "text-orange-600", bg: "bg-orange-50" },
            { name: "MUV", count: "3 cars", icon: Truck, color: "text-violet-600", bg: "bg-violet-50" },
            { name: "Compact SUV", count: "8 cars", icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50" },
            { name: "Luxury", count: "12 cars", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
        ],
    },
    bikes: {
        label: "Bikes",
        title: "Browse by Bike Type",
        href: "/bikes",
        items: [
            { name: "Commuter", count: "18 bikes", icon: Bike, color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Scooter", count: "14 scooters", icon: Bike, color: "text-emerald-600", bg: "bg-emerald-50" },
            { name: "Electric", count: "11 EVs", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
            { name: "Sports", count: "7 bikes", icon: Gauge, color: "text-rose-600", bg: "bg-rose-50" },
            { name: "Cruiser", count: "5 bikes", icon: ShieldCheck, color: "text-violet-600", bg: "bg-violet-50" },
            { name: "Premium", count: "9 bikes", icon: CheckCircle2, color: "text-orange-600", bg: "bg-orange-50" },
        ],
    },
    autos: {
        label: "Autos",
        title: "Browse by Auto Type",
        href: "/autos",
        items: [
            { name: "Passenger", count: "10 autos", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Cargo", count: "8 autos", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50" },
            { name: "Electric", count: "6 EV autos", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
            { name: "CNG", count: "9 autos", icon: Fuel, color: "text-orange-600", bg: "bg-orange-50" },
            { name: "E-Rickshaw", count: "5 models", icon: Car, color: "text-violet-600", bg: "bg-violet-50" },
            { name: "Fleet Ready", count: "12 models", icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50" },
        ],
    },
} as const;

type BrowseGroupKey = keyof typeof browseGroups;

const twoWheelerBrands = [
    { name: "Royal Enfield", logo: "/data/brand-logos/royal-enfield.png" },
    { name: "Hero MotoCorp", logo: "/data/brand-logos/hero-motocorp.png" },
    { name: "Bajaj Auto", logo: "/data/brand-logos/bajaj-auto.png" },
    { name: "TVS Motor", logo: "/data/brand-logos/tvs-motor.png" },
    { name: "Honda", logo: "/data/brand-logos/honda-hmsi.png" },
    { name: "Yamaha", logo: "/data/brand-logos/yamaha-india.png" },
    { name: "KTM", logo: "/data/brand-logos/ktm-india.png" },
    { name: "Suzuki", logo: "/data/brand-logos/suzuki-motorcycle.png" },
    { name: "Triumph", logo: "/data/brand-logos/triumph-india.png" },
    { name: "Ather Energy", logo: "/data/brand-logos/ather-energy.png" },
];

const threeWheelerModels = [
    { name: "Bajaj Qute", caption: "Passenger Auto", logo: "/data/brand-logos/bajaj-auto-3w.png" },
    { name: "TVS King", caption: "Cargo & Passenger", logo: "/data/brand-logos/tvs-king.png" },
    { name: "Mahindra Treo", caption: "Electric Auto", logo: "/data/brand-logos/mahindra-3w.png", featured: true },
    { name: "Piaggio Ape", caption: "Cargo Vehicle", logo: "/assets/logos/piaggio.png" },
    { name: "Atul Gemini", caption: "E-Rickshaw", logo: "/data/brand-logos/atul-auto.png" },
];

const premiumInventory = [
    {
        category: "Car",
        brand: "Ferrari",
        model: "Amalfi",
        variant: "V8",
        price: "₹5.59 Cr",
        emi: "EMI ₹939,203/mo",
        image: "/data/brand-model-images/4w/ferrari/amalfi.jpg",
        accent: "bg-red-600",
        specs: [
            { label: "Fuel", value: "Petrol", icon: Fuel, color: "text-emerald-600" },
            { label: "Trans", value: "Auto", icon: Gauge, color: "text-blue-600" },
            { label: "Seats", value: "2", icon: Users, color: "text-violet-600" },
            { label: "Mileage", value: "9.0 km/l", icon: Zap, color: "text-amber-600" },
        ],
    },
    {
        category: "Car",
        brand: "Ferrari",
        model: "849 Testarossa",
        variant: "PHEV",
        price: "₹10.37 Cr",
        emi: "EMI ₹1,742,314/mo",
        image: "/data/brand-model-images/4w/ferrari/849-testarossa.jpg",
        accent: "bg-red-600",
        specs: [
            { label: "Fuel", value: "Hybrid", icon: Fuel, color: "text-emerald-600" },
            { label: "Trans", value: "Auto", icon: Gauge, color: "text-blue-600" },
            { label: "Seats", value: "2", icon: Users, color: "text-violet-600" },
            { label: "Mileage", value: "12.0 km/l", icon: Zap, color: "text-amber-600" },
        ],
    },
    {
        category: "Car",
        brand: "Audi",
        model: "Q8 e-tron",
        variant: "55 quattro Technology",
        price: "₹1.15 Cr",
        comparePrice: "₹1.73 Cr",
        emi: "EMI ₹192,377/mo",
        image: "/data/brand-model-images/4w/audi/q8-sportback-e-tron.jpg",
        accent: "bg-slate-950",
        specs: [
            { label: "Fuel", value: "Petrol", icon: Fuel, color: "text-emerald-600" },
            { label: "Trans", value: "Manual", icon: Gauge, color: "text-blue-600" },
            { label: "Seats", value: "5", icon: Users, color: "text-violet-600" },
            { label: "Range", value: "528 km", icon: Zap, color: "text-amber-600" },
        ],
    },
    {
        category: "Two-Wheeler",
        brand: "Royal Enfield",
        model: "Classic 350",
        variant: "Heritage motorcycle",
        price: "\u20B91.93 Lakh",
        emi: "EMI \u20B93,245/mo",
        image: "/data/brand-model-images/2w/royal-enfield/classic-350.jpg",
        accent: "bg-red-700",
        specs: [
            { label: "Fuel", value: "Petrol", icon: Fuel, color: "text-emerald-600" },
            { label: "Type", value: "Bike", icon: Bike, color: "text-blue-600" },
            { label: "Seats", value: "2", icon: Users, color: "text-violet-600" },
            { label: "Mileage", value: "35 km/l", icon: Zap, color: "text-amber-600" },
        ],
    },
    {
        category: "Two-Wheeler",
        brand: "Ather",
        model: "450X",
        variant: "Electric scooter",
        price: "\u20B91.47 Lakh",
        emi: "EMI \u20B92,468/mo",
        image: "/data/brand-model-images/2w/ather-energy/450x.jpg",
        accent: "bg-emerald-600",
        specs: [
            { label: "Fuel", value: "Electric", icon: Fuel, color: "text-emerald-600" },
            { label: "Type", value: "Scooter", icon: Bike, color: "text-blue-600" },
            { label: "Seats", value: "2", icon: Users, color: "text-violet-600" },
            { label: "Range", value: "150 km", icon: Zap, color: "text-amber-600" },
        ],
    },
    {
        category: "Two-Wheeler",
        brand: "TVS",
        model: "Raider 125",
        variant: "Commuter motorcycle",
        price: "\u20B995,000",
        emi: "EMI \u20B91,594/mo",
        image: "/data/brand-model-images/2w/tvs-motor/raider-125.jpg",
        accent: "bg-blue-600",
        specs: [
            { label: "Fuel", value: "Petrol", icon: Fuel, color: "text-emerald-600" },
            { label: "Type", value: "Bike", icon: Bike, color: "text-blue-600" },
            { label: "Seats", value: "2", icon: Users, color: "text-violet-600" },
            { label: "Mileage", value: "56 km/l", icon: Zap, color: "text-amber-600" },
        ],
    },
    {
        category: "Auto",
        brand: "Bajaj",
        model: "Maxima Z",
        variant: "Passenger three-wheeler",
        price: "\u20B92.45 Lakh",
        emi: "EMI \u20B94,112/mo",
        image: "/data/brand-model-images/3w/bajaj-auto-3w/maxima-z.jpg",
        accent: "bg-orange-500",
        specs: [
            { label: "Fuel", value: "CNG", icon: Fuel, color: "text-emerald-600" },
            { label: "Type", value: "Auto", icon: Truck, color: "text-blue-600" },
            { label: "Seats", value: "4", icon: Users, color: "text-violet-600" },
            { label: "Use", value: "Passenger", icon: Zap, color: "text-amber-600" },
        ],
    },
    {
        category: "Auto",
        brand: "Mahindra",
        model: "Treo",
        variant: "Electric three-wheeler",
        price: "\u20B93.06 Lakh",
        emi: "EMI \u20B95,134/mo",
        image: "/data/brand-model-images/3w/mahindra-3w/treo.jpg",
        accent: "bg-blue-700",
        specs: [
            { label: "Fuel", value: "Electric", icon: Fuel, color: "text-emerald-600" },
            { label: "Type", value: "E-Auto", icon: Truck, color: "text-blue-600" },
            { label: "Seats", value: "4", icon: Users, color: "text-violet-600" },
            { label: "Range", value: "125 km", icon: Zap, color: "text-amber-600" },
        ],
    },
    {
        category: "Auto",
        brand: "Piaggio",
        model: "Ape Auto Classic",
        variant: "City passenger auto",
        price: "\u20B92.85 Lakh",
        emi: "EMI \u20B94,782/mo",
        image: "/data/brand-model-images/3w/piaggio-ape/auto-classic.jpg",
        accent: "bg-sky-600",
        specs: [
            { label: "Fuel", value: "CNG", icon: Fuel, color: "text-emerald-600" },
            { label: "Type", value: "Auto", icon: Truck, color: "text-blue-600" },
            { label: "Seats", value: "4", icon: Users, color: "text-violet-600" },
            { label: "Use", value: "City", icon: Zap, color: "text-amber-600" },
        ],
    },
];

type PremiumInventoryItem = (typeof premiumInventory)[number];

function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3.5 text-[#071436] dark:text-white">
            <Image
                src="/dealersite-pro-shield.png"
                alt="DealerSite Pro"
                width={52}
                height={50}
                priority
                className="h-11 w-11 object-contain"
            />
            <span className="text-xl font-black tracking-[-0.02em] sm:text-2xl">DealerSite Pro</span>
        </Link>
    );
}

function LandingThemeToggle({ className = "" }: { className?: string }) {
    const [isDark, setIsDark] = useState(false);
    const [pageRipple, setPageRipple] = useState<{ key: number; x: number; y: number; color: string } | null>(null);

    useEffect(() => {
        const root = document.documentElement;
        let stored: string | null = null;
        try {
            stored = window.localStorage?.getItem("dealer-theme") ?? null;
        } catch {
            stored = null;
        }

        const initialDark = stored === "dark" || (!stored && root.classList.contains("dark"));
        root.classList.toggle("dark", initialDark);
        setIsDark(initialDark);
    }, []);

    const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPageRipple({
            key: Date.now(),
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            color: isDark ? "rgba(251, 191, 36, 0.24)" : "rgba(21, 94, 239, 0.24)",
        });
        setIsDark((current) => {
            const next = !current;
            document.documentElement.classList.toggle("dark", next);
            try {
                window.localStorage?.setItem("dealer-theme", next ? "dark" : "light");
            } catch {
                // The visual theme still changes even if storage is unavailable.
            }
            return next;
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={toggleTheme}
                className={`relative flex items-center justify-center rounded-lg border transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
                <Sun className={`absolute h-4 w-4 text-amber-400 transition-all duration-300 ${isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-90 opacity-0"}`} />
                <Moon className={`absolute h-4 w-4 text-slate-700 transition-all duration-300 dark:text-slate-300 ${isDark ? "scale-50 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`} />
            </button>
            {pageRipple && (
                <span
                    key={pageRipple.key}
                    className="theme-page-ripple pointer-events-none fixed z-[9999] aspect-square w-[220vmax] rounded-full"
                    style={{ left: pageRipple.x, top: pageRipple.y, backgroundColor: pageRipple.color }}
                />
            )}
        </>
    );
}

function WebsitePreview() {
    return (
        <div className="mx-auto max-w-[680px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 px-3.5 py-2 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                    <Image src="/dealersite-pro-shield.png" alt="" width={28} height={27} className="h-7 w-7 object-contain" />
                    <div>
                        <p className="text-xs font-extrabold tracking-wide text-slate-950 dark:text-white">SHREE MOTORS</p>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Your Journey, Our Priority</p>
                    </div>
                </div>
                <div className="hidden items-center gap-4 text-[10px] font-semibold text-slate-600 dark:text-slate-300 sm:flex">
                    <span className="border-b-2 border-blue-600 pb-1 text-blue-700">Home</span>
                    <span>Inventory</span>
                    <span>About Us</span>
                    <span>Services</span>
                    <span>Contact</span>
                </div>
                <div className="hidden items-center gap-2 text-[10px] font-bold text-slate-950 dark:text-white md:flex">
                    <Phone className="h-3.5 w-3.5" />
                    +91 98765 43210
                </div>
            </div>

            <div className="relative min-h-[168px] overflow-hidden bg-slate-950 px-5 py-5 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(90deg,#07142f_0%,#111827_48%,#e5e7eb_100%)]" />
                <div className="relative z-10 max-w-[245px]">
                    <h3 className="text-[22px] font-extrabold leading-tight">Reliable Vehicles. Trusted Service.</h3>
                    <p className="mt-2 text-[11px] font-medium leading-relaxed text-white/80">
                        Cars, bikes and autos from top brands. Best deals. Easy finance.
                    </p>
                    <div className="mt-4 flex gap-2">
                        <span className="rounded-md bg-blue-600 px-3.5 py-2 text-[11px] font-bold">View Inventory</span>
                        <span className="hidden rounded-md border border-white/45 px-3.5 py-2 text-[11px] font-bold sm:inline-flex">Contact Us</span>
                    </div>
                </div>
                <Image
                    src="/data/brand-model-images/4w-galleries/hyundai/creta/colors/abyss-black.avif"
                    alt="Hyundai Creta"
                    width={430}
                    height={260}
                    unoptimized
                    className="absolute bottom-1 right-6 z-10 w-[45%] max-w-[285px] object-contain drop-shadow-2xl mix-blend-multiply brightness-110 contrast-125"
                />
            </div>

            <div className="px-4 py-3">
                <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <h4 className="text-sm font-extrabold text-slate-950 dark:text-white">Explore Our Inventory</h4>
                        <div className="flex gap-3 text-[11px] font-bold">
                            <span className="border-b-2 border-blue-600 pb-1 text-blue-700">Cars</span>
                            <span className="text-slate-500">Bikes</span>
                            <span className="text-slate-500">Autos</span>
                        </div>
                    </div>
                    <span className="hidden text-[11px] font-bold text-blue-700 sm:block">View all vehicles</span>
                </div>

                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {previewVehicles.map((vehicle) => (
                        <div key={vehicle.name} className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
                            <div className="relative mb-1.5 flex h-12 items-center justify-center rounded-md bg-slate-50 dark:bg-slate-900">
                                <Image
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    fill
                                    unoptimized
                                    className="object-contain p-1"
                                />
                            </div>
                            <p className="truncate text-[10px] font-extrabold text-slate-950 dark:text-white">{vehicle.name}</p>
                            <p className="mt-0.5 truncate text-[9px] font-medium text-slate-500 dark:text-slate-400">{vehicle.meta}</p>
                            <p className="mt-0.5 text-[10px] font-extrabold text-slate-950 dark:text-white">{vehicle.price}</p>
                            <div className="mt-1.5 rounded-md border border-blue-600 px-2 py-1 text-center text-[9px] font-bold text-blue-700">
                                Enquire Now
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SetupStrip() {
    return (
        <div className="relative mx-auto max-w-[760px]">
            <div className="absolute left-[10%] right-[10%] top-3 hidden border-t border-dashed border-blue-300 lg:block" />
            <div className="grid grid-cols-5 gap-1">
                {setupSteps.map((step, index) => {
                    const isLive = index === setupSteps.length - 1;
                    return (
                        <div key={step.title} className="relative text-center">
                            <div className={`relative z-10 mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold text-white ${isLive ? "bg-green-600" : "bg-blue-600"}`}>
                                {step.number}
                            </div>
                            <div className={`mx-auto mb-1.5 flex h-10 w-10 items-center justify-center rounded-full border ${isLive ? "border-green-100 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}>
                                <step.icon className={`h-5 w-5 ${isLive ? "text-green-600" : "text-slate-950 dark:text-white"}`} />
                            </div>
                            <p className="text-[10px] font-extrabold text-slate-950 dark:text-white md:text-[11px]">{step.title}</p>
                            <p className="mx-auto mt-0.5 max-w-[76px] text-[8px] font-medium leading-snug text-slate-500 dark:text-slate-400">{step.caption}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Renders modal content into <body> so it escapes the page's stacking context
 * (the sticky header + card buttons would otherwise paint over it). Returns
 * null on the server where document is unavailable.
 */
function ModalPortal({ children }: { children: ReactNode }) {
    if (typeof document === "undefined") return null;
    return createPortal(children, document.body);
}

/**
 * Live Supabase auth status for the marketing landing — reflects the real
 * session cookie and updates on sign in/out. The static nav button alone
 * can't tell us whether the visitor is actually signed in.
 */
function useAuthStatus() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        let active = true;
        supabase.auth.getUser().then(({ data }) => { if (active) setIsAuthenticated(!!data.user); });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session?.user);
        });
        return () => { active = false; sub.subscription.unsubscribe(); };
    }, []);
    return isAuthenticated;
}

function PremiumQuickViewModal({ car, onClose }: { car: PremiumInventoryItem | null; onClose: () => void }) {
    if (!car) {
        return null;
    }

    return (
        <ModalPortal>
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`${car.brand} ${car.model} quick view`}
            onClick={onClose}
        >
            <div
                className="grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-white/20 bg-white shadow-[0_32px_100px_rgba(7,20,54,0.28)] dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-[1.05fr_0.95fr]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="relative min-h-[280px] bg-[#EEF2F7] dark:bg-slate-800">
                    <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-md border border-white/80 bg-white/95 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#071436] shadow-[0_10px_24px_rgba(7,20,54,0.10)]">
                        <span className={`h-2.5 w-2.5 rounded-sm ${car.accent}`} />
                        {car.category}
                    </div>
                    <Image
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        unoptimized
                        className="object-contain p-10 pt-20"
                    />
                </div>

                <div className="overflow-y-auto p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#155EEF]">{car.brand}</p>
                            <h3 className="mt-2 text-3xl font-black leading-tight text-[#071436] dark:text-white">{car.model}</h3>
                            <p className="mt-1 text-sm font-semibold text-[#62708A] dark:text-slate-300">{car.variant}</p>
                        </div>
                        <button
                            type="button"
                            aria-label="Close quick view"
                            onClick={onClose}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#D8E0EA] text-[#35445C] transition hover:bg-[#F7F9FC] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-6 rounded-lg border border-[#D8E0EA] bg-[#F7F9FC] p-4 dark:border-slate-700 dark:bg-slate-950">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#62708A]">Starting price</p>
                        <div className="mt-2 flex flex-wrap items-end gap-3">
                            <p className="text-3xl font-black leading-none text-[#071436] dark:text-white">{car.price}</p>
                            {car.comparePrice && <p className="text-sm font-semibold text-[#8A97AA]">was {car.comparePrice}</p>}
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-[#CFE0FF] bg-[#EEF4FF] px-3 py-2 text-sm font-black text-[#155EEF]">
                            <ArrowRight className="h-4 w-4 -rotate-45" />
                            {car.emi}
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2.5">
                        {car.specs.map((spec) => (
                            <div key={`quick-${car.model}-${spec.label}`} className="flex min-h-[72px] items-center gap-3 rounded-md border border-[#D8E0EA] bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#D8E0EA] bg-[#F7F9FC] dark:border-slate-700 dark:bg-slate-900">
                                    <spec.icon className={`h-[18px] w-[18px] ${spec.color}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-[#62708A]">{spec.label}</p>
                                    <p className="mt-0.5 truncate text-sm font-black text-[#071436] dark:text-white">{spec.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button className="h-12 flex-1 rounded-md bg-[#155EEF] text-sm font-black text-white hover:bg-[#0F4FD3]">
                            <Send className="mr-2 h-[18px] w-[18px]" />
                            Enquire now
                        </Button>
                        <Button variant="outline" onClick={onClose} className="h-12 rounded-md border-[#CFE0FF] px-5 font-black text-[#155EEF] hover:bg-[#EEF4FF]">
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        </ModalPortal>
    );
}

function PremiumCarCard({ car, onQuickView, isAuthenticated, isCompared, onToggleCompare }: { car: PremiumInventoryItem; onQuickView: (car: PremiumInventoryItem) => void; isAuthenticated: boolean; isCompared: boolean; onToggleCompare: (car: PremiumInventoryItem) => void }) {
    const primarySpecs = car.specs.slice(0, 4);

    // Stable per-vehicle key for the persisted favourites store (demo cards have no DB id).
    const carId = `premium-${car.brand}-${car.model}`.toLowerCase().replace(/\s+/g, "-");
    const saved = useWishlistStore((s) => s.items.includes(carId));
    const toggleSaved = useWishlistStore((s) => s.toggle);

    const handleSave = () => {
        if (!isAuthenticated) { toast.info("Please sign in to add to favourites", { action: { label: "Sign in", href: "/auth/login" } }); return; }
        toast.success(saved ? `${car.model} removed from favourites` : `${car.model} saved to favourites`);
        toggleSaved(carId);
    };

    const handleCompare = () => {
        if (!isAuthenticated) { toast.info("Please sign in to compare vehicles", { action: { label: "Sign in", href: "/auth/login" } }); return; }
        onToggleCompare(car);
    };
    // Autos use object-contain (taller vehicles must not be cropped); cars/bikes
    // use object-cover (edge-to-edge).
    const imageClassName = car.category === "Auto"
        ? "object-contain p-3"
        : "object-cover";

    // Light photo tile in BOTH themes. Source photos have mixed backgrounds
    // (studio-grey + pure-white cutouts); mix-blend-multiply blends any light/white
    // image background INTO this tile for a consistent grey across cars/bikes/autos.
    // The tile stays light in dark mode too (the card chrome around it is dark) —
    // a dark tile would render the white image backgrounds as glaring boxes.
    const mediaBgClass = "bg-[#F2F6FB] dark:bg-[#E9EEF5]";

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D8E0EA] bg-white p-4 shadow-[0_18px_48px_rgba(7,20,54,0.09)] transition duration-300 hover:-translate-y-1 hover:border-[#B8C7DA] hover:shadow-[0_28px_70px_rgba(7,20,54,0.14)] dark:border-slate-800 dark:bg-slate-900">
            <div className={`group/media relative overflow-hidden rounded-xl ${mediaBgClass}`}>
                <div className="absolute right-3 top-3 z-10 flex gap-2">
                    <button
                        type="button"
                        onClick={handleCompare}
                        aria-label={`Compare ${car.model}`}
                        aria-pressed={isCompared}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border border-white shadow-[0_10px_22px_rgba(7,20,54,0.13)] transition hover:-translate-y-0.5 ${isCompared ? "bg-[#155EEF] text-white" : "bg-white text-[#155EEF] hover:bg-[#EEF4FF]"}`}
                    >
                        <GitCompare className="h-[18px] w-[18px]" />
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        aria-label={saved ? `Remove ${car.model} from favourites` : `Save ${car.model} to favourites`}
                        aria-pressed={saved}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-slate-400 shadow-[0_10px_22px_rgba(7,20,54,0.13)] transition hover:-translate-y-0.5 hover:bg-[#EEF4FF] hover:text-[#155EEF]"
                    >
                        <Heart className={`h-[18px] w-[18px] ${saved ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => onQuickView(car)}
                    data-testid={`quick-view-${car.model.toLowerCase().replaceAll(" ", "-")}`}
                    aria-label={`Quick view ${car.brand} ${car.model}`}
                    className="absolute left-1/2 top-1/2 z-20 inline-flex -translate-x-1/2 -translate-y-1/2 scale-95 items-center gap-2 rounded-full border border-white bg-white/95 px-5 py-3 text-sm font-black text-[#071436] opacity-0 shadow-[0_16px_34px_rgba(7,20,54,0.18)] transition duration-200 pointer-events-none group-hover/media:scale-100 group-hover/media:opacity-100 group-hover/media:pointer-events-auto hover:bg-[#EEF4FF] hover:shadow-[0_20px_44px_rgba(7,20,54,0.22)] focus:scale-100 focus:opacity-100 focus:pointer-events-auto focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                >
                    <Eye className="h-4 w-4" />
                    Quick View
                </button>

                <div className="relative h-[218px] sm:h-[236px]">
                    <Image
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        unoptimized
                        className={`${imageClassName} mix-blend-multiply transition duration-500 group-hover:scale-[1.035]`}
                    />
                </div>
            </div>

            <div className="flex flex-1 flex-col px-2 pb-1 pt-5">
                <div className="min-w-0">
                    <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#155EEF] dark:text-blue-300">{car.brand}</p>
                    <h3 className="mt-2 text-[28px] font-black leading-[1.02] tracking-[-0.045em] text-[#071436] dark:text-white">{car.model}</h3>
                </div>

                <div className="mt-4 grid grid-cols-4 overflow-hidden rounded-xl border border-[#CFE0FF] bg-[#F8FBFF] dark:border-slate-700 dark:bg-slate-950">
                    {primarySpecs.map((spec) => (
                        <div
                            key={`${car.model}-${spec.label}`}
                            className="flex min-w-0 flex-col items-center justify-center gap-1 border-r border-[#D8E7FF] px-1.5 py-2.5 text-center last:border-r-0 dark:border-slate-700"
                        >
                            <spec.icon className={`h-4 w-4 ${spec.color}`} />
                            <span className="max-w-full truncate text-[10px] font-black uppercase tracking-[-0.01em] text-[#071436] dark:text-white">
                                {spec.value}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-5">
                    <div className="mb-3 flex items-end justify-between gap-4 rounded-xl border border-[#D8E0EA] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(7,20,54,0.05)] dark:border-slate-700 dark:bg-slate-950">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#62708A] dark:text-slate-400">Ex-showroom</p>
                            <p className="mt-1 text-3xl font-black leading-none tracking-[-0.05em] text-[#071436] dark:text-white">{car.price}</p>
                        </div>
                        <div className="hidden rounded-full border border-[#CFE0FF] bg-[#EEF4FF] px-3 py-1 text-[10px] font-black uppercase text-[#155EEF] sm:block">
                            Best price
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={() => onQuickView(car)}
                        className="h-14 w-full rounded-xl bg-[#155EEF] py-4 text-base font-black text-white shadow-[0_16px_34px_rgba(21,94,239,0.20)] hover:bg-[#0F4FD3]"
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                </div>
            </div>
        </article>
    );
}

function PremiumCompareModal({ cars, onClose }: { cars: PremiumInventoryItem[]; onClose: () => void }) {
    if (cars.length < 2) return null;

    // Build spec rows from the union of labels, carrying each spec's icon/colour
    // and flagging rows where the two cars differ (so we can spotlight them).
    const labels: string[] = [];
    cars.forEach((c) => c.specs.forEach((s) => { if (!labels.includes(s.label)) labels.push(s.label); }));
    const rows = labels.map((label) => {
        const perCar = cars.map((c) => c.specs.find((s) => s.label === label));
        const meta = perCar.find(Boolean)!;
        const values = perCar.map((s) => s?.value ?? "—");
        return { label, Icon: meta.icon, color: meta.color, values, differs: new Set(values).size > 1 };
    });

    return (
        <ModalPortal>
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Compare vehicles"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/20 bg-white shadow-[0_32px_100px_rgba(7,20,54,0.34)] dark:border-slate-700 dark:bg-slate-900"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-[#E6ECF3] px-6 py-5 dark:border-slate-800">
                    <div>
                        <h3 className="text-xl font-black tracking-[-0.02em] text-[#071436] dark:text-white">Compare vehicles</h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-[#62708A] dark:text-slate-400">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#155EEF]" />
                            Differences are highlighted in blue
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close comparison"
                        onClick={onClose}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E6ECF3] text-[#35445C] transition hover:bg-[#F7F9FC] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Hero cards with a VS badge */}
                <div className="relative grid grid-cols-2 gap-px bg-[#E6ECF3] dark:bg-slate-800">
                    {cars.map((car) => (
                        <div key={`hero-${car.model}`} className="bg-white p-5 dark:bg-slate-900">
                            <div className="relative h-36 overflow-hidden rounded-xl bg-[#F2F6FB] dark:bg-[#E9EEF5]">
                                <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#071436] shadow-[0_6px_16px_rgba(7,20,54,0.12)]">
                                    <span className={`h-2 w-2 rounded-sm ${car.accent}`} /> {car.category}
                                </span>
                                <Image src={car.image} alt={`${car.brand} ${car.model}`} fill unoptimized className="object-contain p-2 mix-blend-multiply" />
                            </div>
                            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.26em] text-[#155EEF]">{car.brand}</p>
                            <h4 className="mt-1 text-lg font-black leading-tight text-[#071436] dark:text-white">{car.model}</h4>
                            <div className="mt-2 flex flex-wrap items-end gap-2">
                                <p className="text-2xl font-black leading-none tracking-[-0.04em] text-[#071436] dark:text-white">{car.price}</p>
                                {car.comparePrice && <p className="text-xs font-semibold text-[#8A97AA] line-through">{car.comparePrice}</p>}
                            </div>
                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[#CFE0FF] bg-[#EEF4FF] px-2.5 py-1 text-xs font-bold text-[#155EEF] dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
                                <ArrowRight className="h-3.5 w-3.5 -rotate-45" /> {car.emi}
                            </span>
                        </div>
                    ))}
                    <div className="pointer-events-none absolute left-1/2 top-[92px] z-10 -translate-x-1/2 -translate-y-1/2">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#071436] text-xs font-black text-white shadow-[0_10px_24px_rgba(7,20,54,0.35)] dark:border-slate-900">VS</span>
                    </div>
                </div>

                {/* Spec rows: [icon + label] [car A] [car B], differences spotlighted */}
                <div className="divide-y divide-[#EEF2F7] dark:divide-slate-800">
                    {rows.map((row) => (
                        <div key={row.label} className="grid grid-cols-[1.1fr_1fr_1fr] items-center gap-2 px-6 py-3.5 transition-colors hover:bg-[#F7F9FC] dark:hover:bg-slate-800/50">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2F6FB] dark:bg-slate-800">
                                    <row.Icon className={`h-4 w-4 ${row.color}`} />
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#62708A] dark:text-slate-400">{row.label}</span>
                            </div>
                            {row.values.map((value, i) => (
                                <span
                                    key={i}
                                    className={`text-center text-sm font-black ${row.differs ? "text-[#155EEF] dark:text-blue-300" : "text-[#071436] dark:text-white"}`}
                                >
                                    {value}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </ModalPortal>
    );
}

function PremiumInventorySection() {
    const [quickViewCar, setQuickViewCar] = useState<PremiumInventoryItem | null>(null);
    const [compareModels, setCompareModels] = useState<string[]>([]);
    const [compareOpen, setCompareOpen] = useState(false);
    const isAuthenticated = useAuthStatus();

    // Compare flow: first pick prompts for a second, the second opens the
    // side-by-side comparison. Toasts/opens are computed OUTSIDE setState so
    // React Strict Mode's double-invoked updater can't fire them twice.
    const toggleCompare = (car: PremiumInventoryItem) => {
        if (compareModels.includes(car.model)) {
            setCompareModels((list) => list.filter((m) => m !== car.model));
            return;
        }
        if (compareModels.length >= 2) {
            toast.info("Compare two at a time — remove one to swap.");
            return;
        }
        const next = [...compareModels, car.model];
        setCompareModels(next);
        if (next.length === 1) {
            toast.info("Select another vehicle to compare");
        } else if (next.length === 2) {
            setCompareOpen(true);
        }
    };

    const compareCars = premiumInventory.filter((c) => compareModels.includes(c.model));
    const closeCompare = () => { setCompareOpen(false); setCompareModels([]); };

    return (
        <section id="inventory-style" className="bg-[#F7F9FC] py-20 dark:bg-slate-950">
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-[#155EEF] dark:text-blue-300">Inventory experience</p>
                        <h2 className="text-4xl font-black tracking-[-0.035em] text-[#071436] dark:text-white sm:text-5xl">
                            Premium cards for cars, bikes, and autos.
                        </h2>
                    </div>
                    <p className="max-w-xl text-base font-medium leading-7 text-[#35445C] dark:text-slate-300">
                        Show every dealer vehicle type in one polished format, with large photos, pricing, EMI visibility, specs, and direct enquiry actions.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {premiumInventory.map((car) => (
                        <PremiumCarCard
                            key={car.model}
                            car={car}
                            onQuickView={setQuickViewCar}
                            isAuthenticated={isAuthenticated}
                            isCompared={compareModels.includes(car.model)}
                            onToggleCompare={toggleCompare}
                        />
                    ))}
                </div>
            </div>

            <PremiumQuickViewModal car={quickViewCar} onClose={() => setQuickViewCar(null)} />
            {compareOpen && <PremiumCompareModal cars={compareCars} onClose={closeCompare} />}

            {compareModels.length > 0 && !compareOpen && (
                <ModalPortal>
                    <div className="fixed bottom-6 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#071436] px-6 py-3 text-white shadow-[0_24px_60px_rgba(7,20,54,0.45)] ring-1 ring-white/15 dark:bg-slate-800 dark:ring-white/20">
                        <span className="text-sm font-bold text-white">
                            {compareModels.length === 1 ? "1 selected — pick one more to compare" : `${compareModels.length} vehicles selected`}
                        </span>
                        {compareModels.length >= 2 && (
                            <Button onClick={() => setCompareOpen(true)} className="h-9 rounded-full bg-[#155EEF] px-4 text-sm font-black text-white hover:bg-[#0F4FD3]">
                                Compare
                            </Button>
                        )}
                        <span className="h-5 w-px bg-white/25" aria-hidden="true" />
                        <button type="button" onClick={() => setCompareModels([])} className="rounded-full text-sm font-bold text-slate-200 transition hover:text-white">
                            Clear
                        </button>
                    </div>
                </ModalPortal>
            )}
        </section>
    );
}

function BrandTile({ name, logo }: { name: string; logo: string | null }) {
    return (
        <Link href="/brands" className="group flex flex-col items-center gap-4 rounded-xl p-3 transition hover:bg-white hover:shadow-[0_16px_40px_rgba(7,20,54,0.08)] dark:hover:bg-slate-900">
            {/* Light logo chip in both themes — brand logos are designed for light
                backgrounds, so this renders every logo consistently (no white boxes
                from opaque-bg PNGs, no low contrast on the dark section). */}
            <div className="flex h-16 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700">
                {logo ? (
                    <Image src={logo} alt={name} width={96} height={64} unoptimized className="max-h-12 w-auto object-contain transition group-hover:scale-105" />
                ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-lg font-black text-[#155EEF]">
                        {name.slice(0, 2).toUpperCase()}
                    </span>
                )}
            </div>
            <span className="text-sm font-semibold text-[#35445C] dark:text-slate-300">{name}</span>
        </Link>
    );
}

// Clean brand tile for the bikes/autos sections — mirrors the cars BrandTile
// (logo chip + name) so all three "browse by brand" rows read consistently.
// Optional caption is used by autos, where the per-model descriptor varies.
function BeyondBrandTile({ name, logo, href, caption }: { name: string; logo: string; href: string; caption?: string }) {
    return (
        <Link href={href} className="group flex flex-col items-center gap-4 rounded-xl p-3 text-center transition hover:bg-white hover:shadow-[0_16px_40px_rgba(7,20,54,0.08)] dark:hover:bg-slate-900">
            <div className="flex h-16 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700">
                <Image src={logo} alt={name} width={96} height={64} unoptimized className="max-h-12 w-auto object-contain transition group-hover:scale-105" />
            </div>
            <div>
                <span className="block text-sm font-semibold text-[#35445C] dark:text-slate-300">{name}</span>
                {caption && <span className="mt-0.5 block text-xs font-medium text-[#62708A] dark:text-slate-400">{caption}</span>}
            </div>
        </Link>
    );
}

function BrowseByBrandSection() {
    return (
        <section className="border-y border-[#D8E0EA] bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">
                <h2 className="text-center text-4xl font-black tracking-[-0.03em] text-[#071436] dark:text-white">Browse by Brand</h2>

                <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
                    {carBrands.map((brand) => (
                        <BrandTile key={brand} name={brand} logo={getBrandLogo(brand)} />
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <Link href="/brands">
                        <Button variant="outline" className="h-12 rounded-lg border-[#D8E0EA] px-5 text-base font-bold text-[#071436] hover:bg-[#F7F9FC] dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                            View All Brands
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function BrowseByBodyTypeSection() {
    const [selectedGroup, setSelectedGroup] = useState<BrowseGroupKey>("cars");
    const activeGroup = browseGroups[selectedGroup];

    return (
        <section className="border-b border-[#D8E0EA] bg-[#F7F9FC] py-20 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">
                <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-[#62708A] dark:text-slate-400">Find your style</p>
                    <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] text-[#071436] dark:text-white">{activeGroup.title}</h2>
                </div>

                <div className="mt-8 flex justify-center">
                    <div className="inline-flex rounded-xl border border-[#D8E0EA] bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        {(Object.keys(browseGroups) as BrowseGroupKey[]).map((key) => {
                            const group = browseGroups[key];
                            const isActive = selectedGroup === key;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelectedGroup(key)}
                                    aria-pressed={isActive}
                                    className={cn(
                                        "h-11 min-w-[92px] rounded-lg px-4 text-sm font-black transition",
                                        isActive
                                            ? "bg-[#155EEF] text-white shadow-[0_10px_24px_rgba(21,94,239,0.24)]"
                                            : "text-[#62708A] hover:bg-[#F7F9FC] hover:text-[#071436] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                                    )}
                                >
                                    {group.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
                    {activeGroup.items.map((type) => (
                        <Link key={`${selectedGroup}-${type.name}`} href={activeGroup.href} className="group rounded-xl border border-[#D8E0EA] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,20,54,0.10)] dark:border-slate-800 dark:bg-slate-950">
                            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${type.bg}`}>
                                <type.icon className={`h-8 w-8 ${type.color}`} />
                            </div>
                            <h3 className="mt-5 text-lg font-extrabold text-[#071436] dark:text-white">{type.name}</h3>
                            <p className="mt-2 text-xs font-medium text-[#62708A] dark:text-slate-400">{type.count}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function BeyondCarsSection() {
    return (
        <section className="border-b border-[#D8E0EA] bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">
                <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-[#62708A] dark:text-slate-400">All vehicle types</p>
                    <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] text-[#071436] dark:text-white">Browse Bikes, Scooters & Autos</h2>
                    <p className="mx-auto mt-4 max-w-3xl text-xl font-medium text-[#62708A] dark:text-slate-300">
                        Keep bikes, scooters, EVs, passenger autos, and cargo autos in one simple browsing experience.
                    </p>
                </div>

                <div className="mt-14 space-y-8">
                    <div>
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                                    <Bike className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#071436] dark:text-white">Bike & Scooter Brands</h3>
                                    <p className="text-sm font-medium text-[#62708A] dark:text-slate-400">Two-wheelers, scooters, and EV brands</p>
                                </div>
                            </div>
                            <Link href="/bikes" className="hidden text-sm font-extrabold text-[#155EEF] sm:inline-flex">
                                Browse bikes
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                            {twoWheelerBrands.map((brand) => (
                                <BeyondBrandTile key={brand.name} name={brand.name} logo={brand.logo} href="/bikes" />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#071436] dark:text-white">Auto Brands</h3>
                                    <p className="text-sm font-medium text-[#62708A] dark:text-slate-400">Passenger autos, e-autos, and cargo three-wheelers</p>
                                </div>
                            </div>
                            <Link href="/autos" className="hidden text-sm font-extrabold text-emerald-700 dark:text-emerald-300 sm:inline-flex">
                                Browse autos
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                            {threeWheelerModels.map((model) => (
                                <BeyondBrandTile key={model.name} name={model.name} logo={model.logo} href="/autos" caption={model.caption} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function WelcomeClient({ cars: _cars }: WelcomeClientProps) {
    const router = useRouter();
    const { data, reset, isComplete } = useOnboardingStore();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    const hasStarted = Boolean(data.dealershipName);

    const handleStart = () => {
        reset();
        setTimeout(() => router.push("/onboarding"), 100);
    };

    const handleContinue = () => router.push("/onboarding");
    const handleDashboard = () => router.push("/dashboard");
    const isAuthenticated = useAuthStatus();
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const primaryAction = mounted && isComplete()
        ? { label: "Go to Dashboard", onClick: handleDashboard }
        : hasStarted
            ? { label: "Continue Setup", onClick: handleContinue }
            : { label: "Create My Website", onClick: handleStart };

    return (
        <div className="min-h-screen bg-white text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
            <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
                <div className="mx-auto flex h-20 max-w-[1536px] items-center justify-between px-5 sm:px-8 lg:px-10">
                    <Logo />

                    <nav className="hidden items-center gap-10 text-sm font-bold text-slate-700 dark:text-slate-300 lg:flex">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="transition-colors hover:text-blue-700">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                        <LandingThemeToggle className="h-11 w-11 border-slate-200 bg-white text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
                        {isAuthenticated ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="outline" className="h-11 gap-2 border-slate-200 px-5 text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                                        <LayoutTemplate className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button onClick={handleSignOut} className="h-11 bg-blue-600 px-6 font-bold hover:bg-blue-700">
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="outline" className="h-11 gap-2 border-slate-200 px-5 text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                                        <LogIn className="h-4 w-4" />
                                        Sign In
                                    </Button>
                                </Link>
                                <Button onClick={handleStart} className="h-11 bg-blue-600 px-6 font-bold hover:bg-blue-700">
                                    Start Free
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        <LandingThemeToggle className="h-10 w-10 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
                        <button
                            onClick={() => setMobileMenuOpen((value) => !value)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
                        <div className="mx-auto flex max-w-[1536px] flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} className="rounded-lg px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900" onClick={() => setMobileMenuOpen(false)}>
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mt-2 grid grid-cols-[auto_1fr_1fr] gap-3">
                                <LandingThemeToggle className="h-10 w-10 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
                                {isAuthenticated ? (
                                    <>
                                        <Link href="/dashboard">
                                            <Button variant="outline" className="w-full dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Dashboard</Button>
                                        </Link>
                                        <Button onClick={handleSignOut} className="w-full bg-blue-600 hover:bg-blue-700">Sign Out</Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth/login">
                                            <Button variant="outline" className="w-full dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Sign In</Button>
                                        </Link>
                                        <Button onClick={handleStart} className="w-full bg-blue-600 hover:bg-blue-700">Start Free</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main>
                <section className="mx-auto grid max-w-[1400px] items-start gap-8 px-5 pb-12 pt-12 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:px-10 lg:pb-7 lg:pt-10">
                    <div className="relative flex flex-col lg:pt-2">
                        {/* Subtle on-brand glow (decorative, behind text) */}
                        <div aria-hidden className="pointer-events-none absolute left-0 top-10 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl dark:bg-blue-500/10" />

                        <h1 className="relative max-w-[680px] text-5xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl lg:text-[62px]">
                            Create your dealership website in{" "}
                            <span className="relative inline-block whitespace-nowrap text-blue-600">
                                10 minutes
                                {/* hand-drawn highlighter swoosh */}
                                <svg
                                    aria-hidden
                                    viewBox="0 0 300 16"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-2 left-0 h-3 w-full text-blue-500/40 dark:text-blue-400/40"
                                >
                                    <path d="M4 11 C 70 3, 150 3, 296 8" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <div className="relative mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                            <Button onClick={primaryAction.onClick} className="group h-[56px] rounded-xl bg-blue-600 px-8 text-base font-extrabold text-white shadow-[0_16px_36px_rgba(37,99,235,0.30)] transition-all hover:bg-blue-700 hover:shadow-[0_20px_46px_rgba(37,99,235,0.40)]">
                                {primaryAction.label}
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                            </Button>
                            <Button variant="outline" asChild className="group h-[56px] rounded-xl border-slate-200 px-7 text-base font-extrabold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-blue-500/10">
                                <a href="https://lakshmi-motors-audi.indrav.in/" target="_blank" rel="noopener noreferrer">
                                    See Sample Website
                                    <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </a>
                            </Button>
                        </div>

                        <div className="relative mt-9 flex flex-wrap gap-2.5">
                            {heroProof.map((item) => (
                                <div key={item.title} className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-[0_2px_10px_rgba(7,20,54,0.04)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_8px_20px_rgba(37,99,235,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300">
                                        <item.icon className="h-3.5 w-3.5" />
                                    </span>
                                    {item.title}
                                </div>
                            ))}
                        </div>

                        {/* Works with leading brands — fills the column + adds credibility */}
                        <div className="relative mt-10">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                                Works with leading brands
                            </p>
                            <div className="mt-4 flex flex-wrap items-center gap-2.5">
                                {[
                                    { name: "Maruti Suzuki", logo: "/data/brand-logos/maruti-suzuki.png" },
                                    { name: "Hyundai", logo: "/data/brand-logos/hyundai.png" },
                                    { name: "Tata Motors", logo: "/data/brand-logos/tata-motors.png" },
                                    { name: "Mahindra", logo: "/data/brand-logos/mahindra.png" },
                                    { name: "Hero MotoCorp", logo: "/data/brand-logos/hero-motocorp.png" },
                                    { name: "Bajaj Auto", logo: "/data/brand-logos/bajaj-auto.png" },
                                    { name: "TVS Motor", logo: "/data/brand-logos/tvs-motor.png" },
                                ].map((b) => (
                                    <div
                                        key={b.name}
                                        className="flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 shadow-[0_1px_4px_rgba(7,20,54,0.05)] dark:border-slate-700"
                                    >
                                        <Image
                                            src={b.logo}
                                            alt={b.name}
                                            width={80}
                                            height={28}
                                            unoptimized
                                            className="h-6 w-auto max-w-[80px] object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0">
                        <SetupStrip />
                        <div className="mt-3 flex justify-center">
                            <ArrowRight className="h-4 w-4 rotate-90 text-slate-400" />
                        </div>
                        <div className="mx-auto mt-2 max-w-[700px]">
                            <WebsitePreview />
                        </div>
                    </div>
                </section>

                <section id="how-it-works" className="border-y border-slate-200 bg-slate-50/80 py-16 dark:border-slate-800 dark:bg-slate-900/70">
                    <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
                        <div className="mb-10 flex flex-col items-center gap-4 text-center">
                            <div className="flex w-full items-center justify-center gap-8">
                                <span className="hidden h-px flex-1 bg-slate-200 md:block" />
                                <h2 className="text-3xl font-black tracking-[-0.02em] text-slate-950 dark:text-white">From setup to live site</h2>
                                <span className="hidden h-px flex-1 bg-slate-200 md:block" />
                            </div>
                            <p className="max-w-2xl text-base font-medium text-slate-600 dark:text-slate-300">
                                The whole process is built for dealership owners, not developers.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-4">
                            {timeline.map((item, index) => (
                                <div key={item.title} className="relative rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
                                    <div className="mb-5 flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                                            <item.icon className="h-7 w-7" />
                                        </div>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">{item.title}</h3>
                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <PremiumInventorySection />

                <BrowseByBrandSection />

                <BrowseByBodyTypeSection />

                <BeyondCarsSection />

                <section id="examples" className="py-20 dark:bg-slate-950">
                    <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
                        <div className="mb-10 max-w-2xl">
                            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Examples</p>
                            <h2 className="text-4xl font-black tracking-[-0.03em] text-slate-950 dark:text-white">One platform for every vehicle dealer.</h2>
                            <p className="mt-4 text-lg font-medium leading-8 text-slate-600 dark:text-slate-300">
                                Start with a simple dealer website, then add the tools your showroom needs as you grow.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {examples.map((example) => (
                                <div key={example.title} className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <example.icon className="h-9 w-9 text-blue-700 dark:text-blue-300" />
                                    <h3 className="mt-5 text-xl font-extrabold text-slate-950 dark:text-white">{example.title}</h3>
                                    <p className="mt-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">{example.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-slate-950 py-20 text-white">
                    <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1fr]">
                        <div>
                            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-blue-300">Product</p>
                            <h2 className="text-4xl font-black tracking-[-0.03em]">Everything a dealer needs to be found and contacted.</h2>
                            <p className="mt-5 text-lg font-medium leading-8 text-slate-300">
                                The homepage should not feel technical. It should tell dealers exactly what they get: a site, inventory, leads, and an easy way to manage them.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                                    <span className="text-sm font-bold text-slate-100">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="for-dealers" className="py-20 dark:bg-slate-950">
                    <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
                        <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center">
                            <div>
                                <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">For dealers</p>
                                <h2 className="text-4xl font-black tracking-[-0.03em] text-slate-950 dark:text-white">Built for real Indian showroom workflows.</h2>
                                <p className="mt-5 text-lg font-medium leading-8 text-slate-600 dark:text-slate-300">
                                    DealerSite Pro keeps the language simple for owners, while still giving managers the tools they need to respond quickly.
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {dealerTypes.map((type) => (
                                    <div key={type} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                                        <ShieldCheck className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                                        <span className="font-extrabold text-slate-950 dark:text-white">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="border-y border-slate-200 bg-slate-50/80 py-16 dark:border-slate-800 dark:bg-slate-900/70">
                    <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Pricing</p>
                            <h2 className="text-3xl font-black tracking-[-0.02em] text-slate-950 dark:text-white">Start free. Upgrade when you need your own domain.</h2>
                            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600 dark:text-slate-300">
                                Launch on a free subdomain first. Connect a custom domain, advanced tools, and premium support when your dealership is ready.
                            </p>
                        </div>
                        <Button onClick={handleStart} className="h-14 bg-blue-600 px-7 font-extrabold hover:bg-blue-700">
                            Start Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </section>

                <section className="px-5 py-20 dark:bg-slate-950 sm:px-8">
                    <div className="mx-auto max-w-[1180px] rounded-2xl bg-slate-950 px-8 py-14 text-center text-white sm:px-12">
                        <Building2 className="mx-auto h-10 w-10 text-blue-300" />
                        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black tracking-[-0.03em]">
                            Ready to put your dealership online?
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-300">
                            Create your website, show your stock, and start collecting enquiries from customers today.
                        </p>
                        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                            <Button onClick={handleStart} className="h-14 bg-white px-7 text-base font-extrabold text-slate-950 hover:bg-slate-100">
                                Create My Website
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Link href="mailto:sales@dealersitepro.com">
                                <Button variant="outline" className="h-14 border-white/25 bg-transparent px-7 text-base font-extrabold text-white hover:bg-white/10 hover:text-white">
                                    Talk to Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
                    {/* Top — brand + link columns */}
                    <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
                        {/* Brand */}
                        <div className="max-w-xs">
                            <Logo />
                            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                Professional dealership websites in minutes — for cars, bikes, and autos. No coding, no agency.
                            </p>
                            <div className="mt-5 flex flex-col gap-2 text-sm">
                                <a href="mailto:sales@dealersitepro.com" className="inline-flex items-center gap-2 text-slate-600 transition hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300">
                                    <Mail className="h-4 w-4" /> sales@dealersitepro.com
                                </a>
                                <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <MapPin className="h-4 w-4" /> Made in India 🇮🇳
                                </span>
                            </div>
                        </div>

                        {/* Product */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">Product</h3>
                            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <li><a href="#how-it-works" className="transition hover:text-blue-700 dark:hover:text-blue-300">How it works</a></li>
                                <li><a href="#inventory-style" className="transition hover:text-blue-700 dark:hover:text-blue-300">Inventory experience</a></li>
                                <li><a href="#examples" className="transition hover:text-blue-700 dark:hover:text-blue-300">Examples</a></li>
                                <li><a href="#pricing" className="transition hover:text-blue-700 dark:hover:text-blue-300">Pricing</a></li>
                            </ul>
                        </div>

                        {/* Browse */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">Browse</h3>
                            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <li><Link href="/cars" className="transition hover:text-blue-700 dark:hover:text-blue-300">Cars</Link></li>
                                <li><Link href="/bikes" className="transition hover:text-blue-700 dark:hover:text-blue-300">Bikes</Link></li>
                                <li><Link href="/autos" className="transition hover:text-blue-700 dark:hover:text-blue-300">Autos</Link></li>
                                <li><Link href="/brands" className="transition hover:text-blue-700 dark:hover:text-blue-300">Brands</Link></li>
                            </ul>
                        </div>

                        {/* Get started */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">Get started</h3>
                            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <li><Link href="/onboarding" className="transition hover:text-blue-700 dark:hover:text-blue-300">Create your site</Link></li>
                                <li><Link href="/auth/login" className="transition hover:text-blue-700 dark:hover:text-blue-300">Sign in</Link></li>
                                <li><a href="mailto:sales@dealersitepro.com" className="transition hover:text-blue-700 dark:hover:text-blue-300">Talk to sales</a></li>
                                <li><a href="mailto:support@dealersitepro.com" className="transition hover:text-blue-700 dark:hover:text-blue-300">Support</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-6 dark:border-slate-800 sm:flex-row">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            &copy; {new Date().getFullYear()} DealerSite Pro. All rights reserved.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <Link href="/privacy" className="transition hover:text-blue-700 dark:hover:text-blue-300">Privacy</Link>
                            <Link href="/terms" className="transition hover:text-blue-700 dark:hover:text-blue-300">Terms</Link>
                            <a href="mailto:support@dealersitepro.com" className="transition hover:text-blue-700 dark:hover:text-blue-300">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
