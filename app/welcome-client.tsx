"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
    ArrowRight,
    CheckCircle,
    Globe,
    LogIn,
    MessageSquare,
    Play,
    Star,
    TrendingUp,
    Clock,
    Zap,
    Users,
    Car,
    Award,
    Shield,
    Palette,
    CalendarClock,
    Fuel,
    Gauge,
    Truck,
    Bus,
    Crown,
    CircleDot,
    Mountain,
    Bike,
    Menu,
    X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CarGrid } from "@/components/cars/CarGrid";
import { Car as CarType } from "@/lib/types/car";
import { getBrandLogo } from "@/lib/data/brand-logos";

interface WelcomeClientProps {
    cars: CarType[];
}

const FEATURES = [
    { icon: Clock, title: "10 Minutes Setup", description: "Answer 5 simple questions and your website is live instantly", color: "bg-blue-500/10 text-blue-500" },
    { icon: Zap, title: "Free to Start", description: "Launch your dealership website free. Upgrade to connect your own domain.", color: "bg-amber-500/10 text-amber-500" },
    { icon: TrendingUp, title: "Built-in Lead Capture", description: "Every enquiry, test drive request, and offer goes straight to your dashboard.", color: "bg-emerald-500/10 text-emerald-500" },
    { icon: Users, title: "More Customers", description: "Leads start coming in within days of launch", color: "bg-purple-500/10 text-purple-500" },
];

const STEPS = [
    { num: 1, title: "Dealership Info", description: "Tell us about your business", icon: Car },
    { num: 2, title: "Select Brands", description: "Choose brands you sell", icon: Award },
    { num: 3, title: "Pick Services", description: "Select your services", icon: Shield },
    { num: 4, title: "Choose Style", description: "Pick your website look", icon: Palette },
    { num: 5, title: "Go Live!", description: "Launch your website", icon: Globe },
];

const TESTIMONIALS = [
    {
        name: "Rajesh Kumar",
        role: "Owner, Kumar Motors",
        content: "Within 2 weeks of launch, we got 15 genuine leads. This platform is amazing!",
        avatar: "RK",
    },
    {
        name: "Priya Sharma",
        role: "Manager, AutoWorld",
        content: "The setup was so easy. Our website looks more professional than competitors who paid lakhs.",
        avatar: "PS",
    },
    {
        name: "Mohammed Ali",
        role: "Director, Elite Cars",
        content: "Best decision we made. Customer inquiries increased by 300% in the first month.",
        avatar: "MA",
    },
];

const STATS = [
    { value: "10,000+", label: "Dealers Trust Us", icon: Users, color: "bg-blue-500/10 text-blue-500" },
    { value: "50,000+", label: "Leads Generated", icon: Car, color: "bg-emerald-500/10 text-emerald-500" },
    { value: "4.9/5", label: "Customer Rating", icon: Star, color: "bg-amber-500/10 text-amber-500" },
    { value: "10 Min", label: "Average Setup Time", icon: Clock, color: "bg-purple-500/10 text-purple-500" },
];

const UPCOMING_LAUNCHES = [
    { brand: 'Tata Motors', model: 'Curvv EV', expectedPrice: '17.49 - 21.99 Lakh', launchDate: 'Mar 2026', type: 'Electric SUV' },
    { brand: 'Hyundai', model: 'Creta N Line', expectedPrice: '16.50 - 20.00 Lakh', launchDate: 'Apr 2026', type: 'Sport SUV' },
    { brand: 'Maruti Suzuki', model: 'eVX', expectedPrice: '15.00 - 20.00 Lakh', launchDate: 'Q2 2026', type: 'Electric SUV' },
    { brand: 'Mahindra', model: 'XUV.e8', expectedPrice: '18.00 - 25.00 Lakh', launchDate: 'May 2026', type: 'Electric SUV' },
    { brand: 'Kia', model: 'EV6 Facelift', expectedPrice: '60.00 - 65.00 Lakh', launchDate: 'Q3 2026', type: 'Electric Crossover' },
    { brand: 'Toyota', model: 'Urban Cruiser EV', expectedPrice: '12.00 - 17.00 Lakh', launchDate: 'Jun 2026', type: 'Electric Compact SUV' },
];

const LAUNCH_COLORS = [
    'border-l-blue-500',
    'border-l-emerald-500',
    'border-l-purple-500',
    'border-l-amber-500',
    'border-l-red-500',
    'border-l-indigo-500',
];

const LAUNCH_BADGE_COLORS = [
    'bg-blue-500/10 text-blue-600',
    'bg-emerald-500/10 text-emerald-600',
    'bg-purple-500/10 text-purple-600',
    'bg-amber-500/10 text-amber-600',
    'bg-red-500/10 text-red-600',
    'bg-indigo-500/10 text-indigo-600',
];

export default function WelcomeClient({ cars }: WelcomeClientProps) {
    const router = useRouter();
    const { data, reset, isComplete } = useOnboardingStore();
    const hasStarted = data.dealershipName;
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => { setIsVisible(true); setMounted(true); }, []);

    const handleStart = () => { reset(); setTimeout(() => router.push("/onboarding"), 100); };
    const handleContinue = () => router.push("/onboarding");
    const handleDashboard = () => router.push("/dashboard");
    const handleReset = () => { reset(); window.location.reload(); };

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ── Navigation ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <BrandLogo />

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => router.push('/cars')}>
                                Browse Cars
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => router.push('/#two-wheelers')} className="flex items-center gap-1.5">
                                <Bike className="w-4 h-4" />
                                Bikes
                            </Button>
                            <Link href="/brands">
                                <Button variant="ghost" size="sm">Brands</Button>
                            </Link>
                            <ThemeToggle />
                            {mounted && isComplete() ? (
                                <Button size="sm" onClick={handleDashboard} className="bg-foreground text-background hover:bg-foreground/90">
                                    Dashboard <ArrowRight className="ml-1 w-3.5 h-3.5" />
                                </Button>
                            ) : (
                                <Link href="/auth/login">
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile nav */}
                        <div className="flex md:hidden items-center gap-2">
                            <ThemeToggle />
                            {mounted && isComplete() ? (
                                <Button size="sm" onClick={handleDashboard} className="bg-foreground text-background hover:bg-foreground/90">
                                    Dashboard
                                </Button>
                            ) : (
                                <Link href="/auth/login">
                                    <Button size="sm" variant="outline">Sign In</Button>
                                </Link>
                            )}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-md hover:bg-muted transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile dropdown menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-border py-3 space-y-1">
                            <Link href="/cars" className="block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                Browse Cars
                            </Link>
                            <Link href="/#two-wheelers" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <Bike className="w-4 h-4" /> Bikes & Scooters
                            </Link>
                            <Link href="/#three-wheelers" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span>🛺</span> Autos & 3W
                            </Link>
                            <Link href="/brands" className="block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                All Brands
                            </Link>
                            <Link href="/onboarding" className="block px-3 py-2.5 text-sm font-medium text-primary rounded-md hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                Get Started FREE →
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="relative pt-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left — Content */}
                        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {/* Overline badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-border mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                                <span className="text-sm font-semibold text-foreground">Free to Start — No Credit Card</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                                Your Dealership<br />
                                Website in{' '}
                                <span className="italic">10 Minutes</span>
                            </h1>

                            <p className="text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
                                Get a beautiful, professional website that brings customers to your door. No tech skills needed — just answer 5 simple questions.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                {hasStarted && !isComplete() ? (
                                    <>
                                        <Button size="lg" onClick={handleContinue}
                                            className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 py-6 h-auto group">
                                            Continue Setup
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button size="lg" variant="outline" onClick={handleStart} className="text-lg px-8 py-6 h-auto">
                                            Start Over
                                        </Button>
                                    </>
                                ) : isComplete() ? (
                                    <>
                                        <Button size="lg" onClick={handleDashboard}
                                            className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 py-6 h-auto group">
                                            Go to Dashboard
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button size="lg" variant="outline" onClick={() => router.push("/preview")} className="text-lg px-8 py-6 h-auto">
                                            <Globe className="mr-2 w-5 h-5" />
                                            View Website
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="lg" onClick={handleStart}
                                            className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 py-6 h-auto group">
                                            Get Started FREE
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto" onClick={() => router.push('/onboarding')}>
                                            <Play className="mr-2 w-5 h-5" />
                                            Watch Demo
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Trust badges */}
                            <div className="flex flex-wrap items-center gap-6">
                                {["No Hidden Fees", "Setup in 10 Min", "24/7 Support"].map((text, i) => (
                                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                                        <CheckCircle className="w-4 h-4 text-foreground" />
                                        <span className="text-sm font-medium">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Browser Mock */}
                        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="relative">
                                {/* Subtle glow */}
                                <div className="absolute -inset-4 bg-foreground/[0.03] rounded-3xl blur-2xl" />

                                <div className="relative bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                                    {/* Browser chrome */}
                                    <div className="bg-foreground p-4 flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-background/20" />
                                            <div className="w-3 h-3 rounded-full bg-background/20" />
                                            <div className="w-3 h-3 rounded-full bg-background/20" />
                                        </div>
                                        <div className="flex-1 mx-4">
                                            <div className="h-6 bg-background/10 rounded-lg flex items-center px-3">
                                                <span className="text-xs text-background/60">yourdealership.dealersitepro.com</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Preview */}
                                    <div className="p-5 space-y-4 bg-background">
                                        {/* Mini Hero */}
                                        <div className="h-32 bg-foreground rounded-xl flex items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-xs text-background/60">Your Dealership</p>
                                                <p className="text-lg font-bold text-background">Premium Cars Await</p>
                                            </div>
                                        </div>

                                        {/* Mini Car Cards */}
                                        <div className="grid grid-cols-3 gap-3">
                                            {cars.slice(0, 3).map((car, i) => (
                                                <div key={i} className="bg-muted/50 rounded-lg p-2 border border-border">
                                                    <div className="aspect-video bg-muted rounded mb-2 overflow-hidden relative">
                                                        {car.images.hero && (
                                                            <Image src={car.images.hero} alt={car.model} fill unoptimized className="object-cover" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-medium truncate text-foreground">{car.model}</p>
                                                    <p className="text-xs text-muted-foreground font-semibold">₹{((car.pricing.exShowroom.min ?? 0) / 100000).toFixed(1)}L</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating — Leads */}
                                <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-xl p-4 border border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-foreground/8 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">This Week</p>
                                            <p className="text-lg font-bold text-foreground">+247 Leads</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating — Rating */}
                                <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-xl p-4 border border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-foreground/8 flex items-center justify-center">
                                            <Star className="w-5 h-5 text-foreground fill-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Rating</p>
                                            <p className="text-lg font-bold text-foreground">4.9/5</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <section className="py-16 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
                        {STATS.map((stat, i) => (
                            <div key={i} className="text-center px-4">
                                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                                <p className="text-muted-foreground text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Browse Inventory ── */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Our Inventory</p>
                        <h2 className="text-4xl font-bold text-foreground mb-4">Browse All Available Cars</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore our complete collection of vehicles. Click any car to see detailed specs, pricing, and features.
                        </p>
                    </div>

                    <CarGrid
                        cars={cars}
                        variant="compact"
                        showEMI={true}
                        onViewDetails={(carId) => router.push(`/cars/${carId}`)}
                        className="mb-8"
                    />

                    <div className="text-center mt-12">
                        <Button size="lg" variant="outline" onClick={() => router.push('/cars')}
                            className="text-lg px-10 py-6 h-auto group">
                            View All Cars with Filters
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Browse by Brand ── */}
            <section className="py-16 bg-muted/20 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Popular Brands</p>
                        <h2 className="text-3xl font-bold text-foreground">Browse by Brand</h2>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-4">
                        {['Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Kia', 'Mahindra', 'Toyota', 'Honda', 'MG', 'Skoda', 'BMW'].map((brand) => (
                            <Link key={brand} href={`/brands/${encodeURIComponent(brand)}`}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-card hover:shadow-md transition-all group">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    {getBrandLogo(brand) ? (
                                        <Image src={getBrandLogo(brand)!} alt={brand} width={56} height={56} unoptimized className="object-contain" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                                            <span className="text-xl font-bold text-primary">{brand.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight">{brand}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link href="/brands">
                            <Button variant="outline" size="sm" className="group">
                                View All Brands
                                <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Browse by Body Type ── */}
            <section className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Find Your Style</p>
                        <h2 className="text-3xl font-bold text-foreground">Browse by Body Type</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {[
                            { name: 'Hatchback', Icon: Gauge, color: 'bg-blue-500/10 text-blue-500' },
                            { name: 'Sedan', Icon: Car, color: 'bg-emerald-500/10 text-emerald-500' },
                            { name: 'SUV', Icon: Truck, color: 'bg-orange-500/10 text-orange-500' },
                            { name: 'MUV', Icon: Bus, color: 'bg-purple-500/10 text-purple-500' },
                            { name: 'Compact SUV', Icon: Mountain, color: 'bg-rose-500/10 text-rose-500' },
                            { name: 'Luxury', Icon: Crown, color: 'bg-amber-500/10 text-amber-500' },
                        ].map((type) => {
                            const count = cars.filter(c => c.bodyType?.toLowerCase() === type.name.toLowerCase()).length;
                            return (
                                <Link key={type.name} href={`/cars?bodyType=${encodeURIComponent(type.name)}`}>
                                    <Card className="p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group border-border">
                                        <div className="flex justify-center mb-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type.color} group-hover:scale-110 transition-transform`}>
                                                <type.Icon className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-foreground mb-1">{type.name}</p>
                                        {count > 0 && (
                                            <p className="text-[10px] text-muted-foreground">{count} {count === 1 ? 'car' : 'cars'}</p>
                                        )}
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Two-Wheelers & Three-Wheelers ── */}
            <section id="two-wheelers" className="py-16 bg-muted/20 border-y border-border scroll-mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Beyond Cars</p>
                        <h2 className="text-3xl font-bold text-foreground">Two-Wheelers & Three-Wheelers</h2>
                        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                            Browse bikes, scooters, and auto-rickshaws from verified dealers across India
                        </p>
                    </div>

                    {/* Two-Wheelers */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                    <Bike className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground leading-tight">Two-Wheelers</h3>
                                    <p className="text-xs text-muted-foreground">Bikes, Scooters & EVs</p>
                                </div>
                            </div>
                            <Link href="/bikes">
                                <Button variant="outline" size="sm" className="group text-xs h-8">
                                    Browse All <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                            {[
                                { name: 'Royal Enfield', logo: '/assets/logos/2w/royal-enfield.svg' },
                                { name: 'Hero MotoCorp', logo: '/assets/logos/2w/hero-motocorp.svg' },
                                { name: 'Bajaj Auto',    logo: '/assets/logos/2w/bajaj-auto.svg' },
                                { name: 'TVS Motor',     logo: '/assets/logos/2w/tvs-motor.svg' },
                                { name: 'Honda',         logo: '/assets/logos/2w/honda-motorcycles.svg' },
                                { name: 'Yamaha',        logo: '/assets/logos/2w/yamaha.svg' },
                                { name: 'KTM',           logo: '/assets/logos/2w/ktm.svg' },
                                { name: 'Suzuki',        logo: '/assets/logos/2w/suzuki-motorcycle.svg' },
                                { name: 'Triumph',       logo: '/assets/logos/2w/triumph.svg' },
                                { name: 'Ather Energy',  logo: '/assets/logos/2w/ather-energy.svg' },
                            ].map((brand) => (
                                <Link
                                    key={brand.name}
                                    href={`/bikes?make=${encodeURIComponent(brand.name)}`}
                                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-card hover:shadow-md transition-all group"
                                >
                                    <div className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center group-hover:border-orange-200 transition-colors">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            width={36}
                                            height={36}
                                            unoptimized
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight">{brand.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Three-Wheelers */}
                    <div id="three-wheelers" className="bg-card rounded-2xl border border-border p-6 scroll-mt-16">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <span className="text-lg">🛺</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground leading-tight">Three-Wheelers & Autos</h3>
                                    <p className="text-xs text-muted-foreground">Auto-Rickshaws, E-Autos & Cargo</p>
                                </div>
                            </div>
                            <Link href="/autos">
                                <Button variant="outline" size="sm" className="group text-xs h-8">
                                    Browse All <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {[
                                { name: 'Bajaj Qute',     make: 'Bajaj Auto (3W)', desc: 'Passenger Auto',  emoji: '🛺', color: 'bg-blue-500/8' },
                                { name: 'TVS King',       make: 'TVS King',        desc: 'Cargo & Passenger', emoji: '🛺', color: 'bg-red-500/8' },
                                { name: 'Mahindra Treo',  make: 'Mahindra (3W)',   desc: 'Electric Auto',   emoji: '⚡', color: 'bg-green-500/8' },
                                { name: 'Piaggio Ape',    make: 'Piaggio Ape',     desc: 'Cargo Vehicle',   emoji: '🚛', color: 'bg-amber-500/8' },
                                { name: 'Atul Gemini',    make: 'Atul Auto',       desc: 'E-Rickshaw',      emoji: '🔋', color: 'bg-purple-500/8' },
                            ].map((v) => (
                                <Link
                                    key={v.name}
                                    href={`/autos?make=${encodeURIComponent(v.make)}`}
                                    className={`flex flex-col items-center gap-2 p-4 ${v.color} rounded-xl border border-border hover:shadow-md hover:-translate-y-0.5 transition-all text-center group`}
                                >
                                    <span className="text-3xl">{v.emoji}</span>
                                    <p className="text-sm font-semibold text-foreground">{v.name}</p>
                                    <p className="text-xs text-muted-foreground">{v.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Upcoming Launches ── */}
            <section className="py-16 bg-muted/20 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Coming Soon</p>
                        <h2 className="text-3xl font-bold text-foreground">Upcoming Car Launches</h2>
                        <p className="text-muted-foreground mt-2">Most anticipated cars launching in India in 2026</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {UPCOMING_LAUNCHES.map((car, i) => (
                            <Card key={i} className={`p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all border-border group border-l-4 ${LAUNCH_COLORS[i % LAUNCH_COLORS.length]}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            {getBrandLogo(car.brand) && (
                                                <Image src={getBrandLogo(car.brand)!} alt={car.brand} width={20} height={20} unoptimized className="object-contain" />
                                            )}
                                            <p className="text-xs text-muted-foreground font-medium">{car.brand}</p>
                                        </div>
                                        <p className="text-base font-bold text-foreground">{car.model}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${LAUNCH_BADGE_COLORS[i % LAUNCH_BADGE_COLORS.length]}`}>
                                        <CalendarClock className="w-3 h-3" />
                                        {car.launchDate}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="text-[10px]">{car.type}</Badge>
                                </div>
                                <div className="pt-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground mb-0.5">Expected Price</p>
                                    <p className="text-base font-bold text-primary">&#8377; {car.expectedPrice}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-24 bg-muted/20 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Why Choose Us</p>
                        <h2 className="text-4xl font-bold text-foreground mb-4">Everything You Need to Succeed</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Get all the tools you need to build your online presence and grow your dealership
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feature, i) => (
                            <Card key={i} className="p-6 hover:shadow-xl transition-all duration-300 group border border-border bg-card hover:-translate-y-1">
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">How It Works</p>
                        <h2 className="text-4xl font-bold text-foreground mb-4">5 Simple Steps to Launch</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Get your professional dealership website up and running in minutes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {STEPS.map((step, index) => (
                            <div key={index} className="relative text-center group">
                                {index < STEPS.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-border" />
                                )}
                                <div className="relative z-10 bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:-translate-y-1">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground flex items-center justify-center text-background font-bold text-lg">
                                        {step.num}
                                    </div>
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-foreground/8 flex items-center justify-center">
                                        <step.icon className="w-7 h-7 text-foreground" />
                                    </div>
                                    <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button size="lg" onClick={handleStart}
                            className="bg-foreground text-background hover:bg-foreground/90 text-lg px-10 py-6 h-auto group">
                            Start Now — It&apos;s Free
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-24 bg-muted/20 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Testimonials</p>
                        <h2 className="text-4xl font-bold text-foreground mb-4">Trusted by Thousands of Dealers</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            See what our customers have to say about their experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((t, i) => {
                            const borderColors = ['border-l-blue-500/50', 'border-l-emerald-500/50', 'border-l-purple-500/50'];
                            return (
                                <Card key={i} className={`p-6 bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 ${borderColors[i % 3]}`}>
                                    <div className="flex gap-1 mb-5">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <Star key={j} className="w-4 h-4 text-foreground fill-foreground" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 leading-relaxed text-[15px]">&ldquo;{t.content}&rdquo;</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center font-bold text-xs text-background">
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">{t.name}</p>
                                            <p className="text-xs text-muted-foreground">{t.role}</p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-32 bg-foreground relative overflow-hidden">
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-background/50 mb-6">Join 10,000+ Dealers</p>
                    <h2 className="text-4xl md:text-6xl font-bold text-background mb-6 leading-tight">
                        Ready to Grow<br />Your Dealership?
                    </h2>
                    <p className="text-xl text-background/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of dealers already using DealerSite Pro to attract more customers and boost sales.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" onClick={handleStart}
                            className="bg-background text-foreground hover:bg-background/90 text-lg px-10 py-6 h-auto group font-semibold">
                            Get Started FREE
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button size="lg"
                            onClick={() => window.open('mailto:sales@dealersitepro.com', '_blank')}
                            className="bg-transparent text-background border border-background/30 hover:bg-background/10 text-lg px-10 py-6 h-auto">
                            <MessageSquare className="mr-2 w-5 h-5" />
                            Talk to Sales
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-12 bg-card border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <BrandLogo />
                        <div className="flex gap-8">
                            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</Link>
                            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</Link>
                            <Link href="mailto:support@dealersitepro.com" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact</Link>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            © {new Date().getFullYear()} DealerSite Pro. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
