"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import {
    Car,
    Sparkles,
    Globe,
    CheckCircle,
    ArrowRight,
    Zap,
    Users,
    TrendingUp,
    Clock,
    Shield,
    Star,
    Play,
    Palette,
    MessageSquare,
    Award,
} from "lucide-react";
import Link from "next/link";
import { allCars } from "@/lib/data/cars";
import { CarGrid } from "@/components/cars/CarGrid";

const FEATURES = [
    {
        icon: Clock,
        title: "10 Minutes Setup",
        description: "Answer 5 simple questions and your website is live instantly",
        color: "blue",
    },
    {
        icon: Zap,
        title: "100% FREE Forever",
        description: "No setup fees, no monthly costs - completely free to use",
        color: "emerald",
    },
    {
        icon: TrendingUp,
        title: "Automatic Marketing",
        description: "SEO, social media, and email campaigns - all automated",
        color: "violet",
    },
    {
        icon: Users,
        title: "More Customers",
        description: "Leads start coming in within days of launch",
        color: "amber",
    },
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
        rating: 5,
        avatar: "RK",
    },
    {
        name: "Priya Sharma",
        role: "Manager, AutoWorld",
        content: "The setup was so easy. Our website looks more professional than competitors who paid lakhs.",
        rating: 5,
        avatar: "PS",
    },
    {
        name: "Mohammed Ali",
        role: "Director, Elite Cars",
        content: "Best decision we made. Customer inquiries increased by 300% in the first month.",
        rating: 5,
        avatar: "MA",
    },
];

const STATS = [
    { value: "10,000+", label: "Dealers Trust Us" },
    { value: "50,000+", label: "Leads Generated" },
    { value: "4.9/5", label: "Customer Rating" },
    { value: "10 Min", label: "Average Setup Time" },
];

export default function WelcomePage() {
    const router = useRouter();
    const { data, reset, isComplete } = useOnboardingStore();
    const hasStarted = data.dealershipName;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleStart = () => {
        reset();
        setTimeout(() => {
            router.push("/onboarding/step-1");
        }, 100);
    };

    const handleContinue = () => {
        router.push("/onboarding/step-1");
    };

    const handleDashboard = () => {
        router.push("/dashboard");
    };

    const handleReset = () => {
        reset();
        window.location.reload();
    };

    const colorConfig = {
        blue: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
        emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
        violet: { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20" },
        amber: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <BrandLogo />
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" onClick={() => router.push('/cars')}>
                                Browse Cars
                            </Button>
                            {(hasStarted || isComplete()) && (
                                <Button variant="outline" size="sm" onClick={handleReset}>
                                    Reset
                                </Button>
                            )}
                            {isComplete() && (
                                <Button onClick={handleDashboard}>
                                    Dashboard
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-16 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-white" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-gray-100 rounded-full blur-[100px] opacity-30" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-gray-100 rounded-full blur-[120px] opacity-30" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Column - Content */}
                        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-300 mb-8">
                                <Sparkles className="w-4 h-4 text-gray-900" />
                                <span className="text-sm font-semibold text-gray-900">100% FREE - No Credit Card</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                                Your Dealership Website in{' '}
                                <span className="text-gray-900">
                                    10 Minutes
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                                Get a beautiful, professional website that brings customers to your door. No tech skills needed - just answer 5 simple questions.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                {hasStarted && !isComplete() ? (
                                    <>
                                        <Button
                                            size="lg"
                                            onClick={handleContinue}
                                            className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-6 h-auto shadow-xl group"
                                        >
                                            Continue Setup
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button size="lg" variant="outline" onClick={handleStart} className="text-lg px-8 py-6 h-auto border-gray-300">
                                            Start Over
                                        </Button>
                                    </>
                                ) : isComplete() ? (
                                    <>
                                        <Button
                                            size="lg"
                                            onClick={handleDashboard}
                                            className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-6 h-auto shadow-xl group"
                                        >
                                            Go to Dashboard
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button size="lg" variant="outline" onClick={() => router.push("/preview")} className="text-lg px-8 py-6 h-auto border-gray-300">
                                            <Globe className="mr-2 w-5 h-5" />
                                            View Website
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            size="lg"
                                            onClick={handleStart}
                                            className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-6 h-auto shadow-xl group"
                                        >
                                            Get Started FREE
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-gray-300">
                                            <Play className="mr-2 w-5 h-5" />
                                            Watch Demo
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap items-center gap-6">
                                {[
                                    { icon: CheckCircle, text: "No Hidden Fees" },
                                    { icon: CheckCircle, text: "Setup in 10 Min" },
                                    { icon: CheckCircle, text: "24/7 Support" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-gray-600">
                                        <item.icon className="w-5 h-5 text-gray-900" />
                                        <span className="text-sm font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Visual */}
                        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {/* Main Image/Card */}
                            <div className="relative">
                                {/* Glow Effect */}
                                <div className="absolute -inset-4 bg-gray-200/20 rounded-3xl blur-2xl" />

                                {/* Dashboard Preview Card */}
                                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                                    {/* Header */}
                                    <div className="bg-gray-900 p-4 flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-gray-500" />
                                            <div className="w-3 h-3 rounded-full bg-gray-500" />
                                            <div className="w-3 h-3 rounded-full bg-gray-500" />
                                        </div>
                                        <div className="flex-1 mx-4">
                                            <div className="h-6 bg-gray-700 rounded-lg flex items-center px-3">
                                                <span className="text-xs text-gray-400">yourdealership.dealersitepro.com</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Preview */}
                                    <div className="p-6 space-y-4">
                                        {/* Mini Hero */}
                                        <div className="h-32 bg-gray-900 rounded-xl flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <p className="text-xs opacity-70">Your Dealership</p>
                                                <p className="text-lg font-bold">Premium Cars Await</p>
                                            </div>
                                        </div>

                                        {/* Mini Cards */}
                                        <div className="grid grid-cols-3 gap-3">
                                            {allCars.slice(0, 3).map((car, i) => (
                                                <div key={i} className="bg-gray-50 rounded-lg p-2">
                                                    <div className="aspect-video bg-gray-200 rounded mb-2 overflow-hidden relative">
                                                        {car.images.hero && (
                                                            <Image
                                                                src={car.images.hero}
                                                                alt={car.model}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-medium truncate">{car.model}</p>
                                                    <p className="text-xs text-gray-900 font-semibold">₹{((car.pricing.exShowroom.min ?? 0) / 100000).toFixed(1)}L</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-gray-900" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">This Week</p>
                                            <p className="text-lg font-bold text-gray-900">+247 Leads</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Rating</p>
                                            <p className="text-lg font-bold text-gray-900">4.9/5</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse Our Inventory Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-gray-900 font-semibold text-sm uppercase tracking-wider">Our Inventory</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                            Browse All Available Cars
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explore our complete collection of vehicles. Click on any car to see detailed specifications, pricing, and features.
                        </p>
                    </div>

                    {/* Car Grid */}
                    <CarGrid
                        cars={allCars}
                        variant="compact"
                        showEMI={true}
                        onViewDetails={(carId) => router.push(`/cars/${carId}`)}
                        className="mb-8"
                    />

                    {/* View All Button */}
                    <div className="text-center mt-12">
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => router.push('/cars')}
                            className="text-lg px-10 py-6 h-auto border-gray-300 group"
                        >
                            View All Cars with Filters
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {STATS.map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-4xl font-bold text-gray-900 mb-2">
                                    {stat.value}
                                </p>
                                <p className="text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-gray-900 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Get all the tools you need to build your online presence and grow your dealership
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURES.map((feature, index) => (
                            <Card
                                key={index}
                                className="p-6 hover:shadow-xl transition-all duration-300 group border-0 bg-gray-50 hover:bg-white"
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 bg-gray-100">
                                    <feature.icon className="w-7 h-7 text-gray-900" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-gray-900 font-semibold text-sm uppercase tracking-wider">How It Works</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                            5 Simple Steps to Launch
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Get your professional dealership website up and running in minutes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {STEPS.map((step, index) => (
                            <div key={index} className="relative text-center group">
                                {/* Connector Line */}
                                {index < STEPS.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200" />
                                )}

                                {/* Step Card */}
                                <div className="relative z-10 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {step.num}
                                    </div>
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                        <step.icon className="w-7 h-7 text-gray-600 group-hover:text-gray-900 transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-500">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button
                            size="lg"
                            onClick={handleStart}
                            className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-10 py-6 h-auto shadow-xl group"
                        >
                            Start Now - It's Free
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                        <h2 className="text-4xl font-bold mt-2 mb-4">
                            Trusted by Thousands of Dealers
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            See what our customers have to say about their experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <Card key={index} className="bg-gray-800 border-gray-700 p-6">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-gray-400 fill-gray-400" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                    }} />
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Grow Your Dealership?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of dealers who are already using DealerSite Pro to attract more customers and boost sales.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={handleStart}
                            className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 py-6 h-auto shadow-2xl group"
                        >
                            Get Started FREE
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10 text-lg px-10 py-6 h-auto"
                        >
                            <MessageSquare className="mr-2 w-5 h-5" />
                            Talk to Sales
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <BrandLogo />

                        <div className="flex gap-8">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                        </div>

                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} DealerSite Pro. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
