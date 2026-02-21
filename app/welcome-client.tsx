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
    Palette
} from "lucide-react";
import Link from "next/link";
import { CarGrid } from "@/components/cars/CarGrid";
import { Car as CarType } from "@/lib/types/car";

interface WelcomeClientProps {
    cars: CarType[];
}

const FEATURES = [
    { icon: Clock, title: "10 Minutes Setup", description: "Answer 5 simple questions and your website is live instantly" },
    { icon: Zap, title: "100% FREE Forever", description: "No setup fees, no monthly costs — completely free to use" },
    { icon: TrendingUp, title: "Automatic Marketing", description: "SEO, social media, and email campaigns — all automated" },
    { icon: Users, title: "More Customers", description: "Leads start coming in within days of launch" },
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
    { value: "10,000+", label: "Dealers Trust Us" },
    { value: "50,000+", label: "Leads Generated" },
    { value: "4.9/5", label: "Customer Rating" },
    { value: "10 Min", label: "Average Setup Time" },
];

export default function WelcomeClient({ cars }: WelcomeClientProps) {
    const router = useRouter();
    const { data, reset, isComplete } = useOnboardingStore();
    const hasStarted = data.dealershipName;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => { setIsVisible(true); }, []);

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
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => router.push('/cars')} className="hidden sm:flex">
                                Browse Cars
                            </Button>
                            <ThemeToggle />
                            {(hasStarted || isComplete()) && (
                                <Button variant="outline" size="sm" onClick={handleReset} className="hidden sm:flex">
                                    Reset
                                </Button>
                            )}
                            {isComplete() ? (
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
                    </div>
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
                                <span className="text-sm font-semibold text-foreground">100% FREE — No Credit Card</span>
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
                                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
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
                                                            <Image src={car.images.hero} alt={car.model} fill className="object-cover" />
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
                                <div className="w-14 h-14 rounded-2xl bg-foreground/8 flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                                    <feature.icon className="w-7 h-7 text-foreground" />
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
                        {TESTIMONIALS.map((t, i) => (
                            <Card key={i} className="p-6 bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                        ))}
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
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact</a>
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
