"use client"
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    HelpCircle, Book, MessageCircle, Mail, ChevronDown,
    CheckCircle, Car, Users, BarChart3, Globe, Settings,
    Zap, Shield, Star, Phone, ArrowRight, Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const QUICK_LINKS = [
    { icon: Car,      label: "Add a Vehicle",    href: "/dashboard/inventory/add", color: "bg-blue-50 text-blue-600"   },
    { icon: Users,    label: "View Leads",        href: "/dashboard/leads",          color: "bg-green-50 text-green-600"  },
    { icon: Globe,    label: "My Website",        href: "/dashboard/webpage",        color: "bg-violet-50 text-violet-600"},
    { icon: BarChart3,label: "Analytics",         href: "/dashboard/analytics",      color: "bg-amber-50 text-amber-600"  },
    { icon: Settings, label: "Settings",          href: "/dashboard/settings",       color: "bg-gray-100 text-gray-600"   },
];

const GETTING_STARTED = [
    {
        step: 1,
        title: "Your website is live",
        desc: "Your dealership site is deployed and accessible via your unique URL. Share it with customers!",
        done: true,
        href: "/dashboard/webpage",
        cta: "View Website",
    },
    {
        step: 2,
        title: "Upload your logo & hero image",
        desc: "Go to Settings → Branding to upload your dealership logo and a hero background photo.",
        done: false,
        href: "/dashboard/settings",
        cta: "Go to Settings",
    },
    {
        step: 3,
        title: "Add your inventory",
        desc: "List the vehicles you sell — prices, features, photos. The more you add, the more enquiries you get.",
        done: false,
        href: "/dashboard/inventory/add",
        cta: "Add Vehicle",
    },
    {
        step: 4,
        title: "Share your site link",
        desc: "Copy your site URL from My Webpage and share on WhatsApp, Google Business, and social media.",
        done: false,
        href: "/dashboard/webpage",
        cta: "Get Your Link",
    },
    {
        step: 5,
        title: "Respond to leads fast",
        desc: "When customers enquire, you'll see them in Leads. Hot leads are time-sensitive — respond within the hour!",
        done: false,
        href: "/dashboard/leads",
        cta: "View Leads",
    },
    {
        step: 6,
        title: "Connect a custom domain",
        desc: "Give your site a professional address like www.yourshowroom.com from the Domains section.",
        done: false,
        href: "/dashboard/domains",
        cta: "Connect Domain",
    },
];

const FAQS: { q: string; a: string }[] = [
    {
        q: "How do I add or edit my vehicle inventory?",
        a: "Go to Inventory in the sidebar. For used-car and hybrid dealers, click 'Add Vehicle' to add cars manually. New-car dealers get their inventory automatically via the Cyepro API or OEM feed — no manual entry needed.",
    },
    {
        q: "How do I change my website template or colors?",
        a: "Go to Settings and scroll down to 'Website Style'. You can switch between Family, Luxury, Sporty, and Modern templates. Your brand color is applied automatically based on the car brands you sell.",
    },
    {
        q: "How are leads scored Hot / Warm / Cold?",
        a: "Leads are scored based on enquiry type. Test drive requests and purchase enquiries are Hot (respond within the hour!). General enquiries are Warm. Informational requests are Cold. All leads are valuable — follow up with every one.",
    },
    {
        q: "How do I connect a custom domain like www.myshowroom.com?",
        a: "Go to Domains in the sidebar. Enter your domain name, then add a CNAME record pointing to our servers in your domain registrar (GoDaddy, Namecheap, etc.). SSL is provisioned automatically within 24 hours.",
    },
    {
        q: "Can I upload my own logo and hero image?",
        a: "Yes! Go to Settings → scroll to the Branding section. You can upload your dealership logo (shown in the nav bar and footer) and a hero background image for your homepage. Recommended logo size: 200×200px PNG with transparent background.",
    },
    {
        q: "How do I share my website link with customers?",
        a: "Go to My Webpage to see your site URL. Click 'View Website' to preview it live. Share the link on WhatsApp, add it to your Google Business profile, put it on your visiting card, and post it on Instagram/Facebook.",
    },
    {
        q: "Why don't I see any leads yet?",
        a: "Leads come from customers who fill out the enquiry form on your website. To get leads, share your site link widely — WhatsApp groups, Google Business, social media. The more traffic your site gets, the more leads you'll receive.",
    },
    {
        q: "What is the Cyepro API key used for?",
        a: "If you are a new-car dealer, the Cyepro API key connects your DealerSite Pro account to the Cyepro inventory system, automatically showing the latest vehicles, prices, and availability on your website.",
    },
    {
        q: "How do I add multiple branches to my website?",
        a: "Go to Settings → scroll to Branches. Add each branch address and phone number. All branches will appear in a dedicated section on your public website so customers know where to visit you.",
    },
    {
        q: "Is there a mobile app?",
        a: "The dashboard is fully mobile-responsive — it works great on your phone's browser. A dedicated Android/iOS app is on our product roadmap.",
    },
    {
        q: "What happens to my data if I stop using DealerSite Pro?",
        a: "Your data belongs to you. Email us at support@cyepro.com and we'll export all your leads, inventory, and settings as a spreadsheet within 48 hours.",
    },
];

const TIPS = [
    { icon: Star,      tip: "Respond to hot leads within 1 hour — conversion rates drop 10× after that." },
    { icon: ImageIcon, tip: "Vehicles with 3+ photos get 4× more enquiries than listings without photos." },
    { icon: Phone,     tip: "Add your WhatsApp number to settings so customers can contact you instantly." },
    { icon: Globe,     tip: "Share your site on Google Business Profile to rank in local car searches." },
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Help Center</h1>
                    <p className="text-muted-foreground">Everything you need to get the most out of DealerSite Pro</p>
                </div>
                <a href="mailto:support@cyepro.com">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Email Support
                    </Button>
                </a>
            </div>

            {/* Quick Nav */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {QUICK_LINKS.map((link, i) => (
                    <Link key={i} href={link.href}>
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/30 transition-all hover:shadow-sm text-center cursor-pointer group">
                            <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", link.color)}>
                                <link.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium leading-tight">{link.label}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Getting Started Checklist */}
            <Card variant="glass">
                <CardContent className="py-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 rounded-lg bg-violet-500/10">
                            <Zap className="w-5 h-5 text-violet-500" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Getting Started Checklist</h2>
                            <p className="text-sm text-muted-foreground">Complete these steps to get leads rolling in</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {GETTING_STARTED.map((item) => (
                            <div
                                key={item.step}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl border transition-colors",
                                    item.done
                                        ? "border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800"
                                        : "border-border bg-muted/10 hover:bg-muted/30"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                    item.done ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                                )}>
                                    {item.done ? <CheckCircle className="w-4 h-4" /> : item.step}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn("font-semibold text-sm", item.done && "line-through text-muted-foreground")}>
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                                </div>
                                {!item.done && (
                                    <Link href={item.href}>
                                        <Button variant="outline" size="sm" className="shrink-0 gap-1 text-xs h-7">
                                            {item.cta}
                                            <ArrowRight className="w-3 h-3" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Pro Tips */}
            <div>
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Pro Tips
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TIPS.map((t, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 dark:bg-amber-900/10 dark:border-amber-800/30">
                            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 shrink-0">
                                <t.icon className="w-4 h-4 text-amber-600" />
                            </div>
                            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">{t.tip}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="mailto:support@cyepro.com">
                    <Card variant="glass" className="h-full hover:bg-muted/30 transition-all hover:shadow-md cursor-pointer group">
                        <CardContent className="py-6 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-1">Email Support</h3>
                            <p className="text-sm text-muted-foreground mb-2">Response within 24 hours</p>
                            <p className="text-xs font-medium text-blue-600">support@cyepro.com</p>
                        </CardContent>
                    </Card>
                </a>
                {process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP && (
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP}`} target="_blank" rel="noopener noreferrer">
                    <Card variant="glass" className="h-full hover:bg-muted/30 transition-all hover:shadow-md cursor-pointer group">
                        <CardContent className="py-6 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-1">WhatsApp Support</h3>
                            <p className="text-sm text-muted-foreground mb-2">Mon–Sat, 9 AM–7 PM IST</p>
                            <p className="text-xs font-medium text-green-600">Quick responses</p>
                        </CardContent>
                    </Card>
                </a>
                )}
                <Card variant="glass" className="h-full bg-gradient-to-br from-violet-500/5 to-blue-500/5 border-violet-200/40">
                    <CardContent className="py-6 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-violet-600" />
                        </div>
                        <h3 className="font-semibold mb-1">System Status</h3>
                        <p className="text-sm text-muted-foreground mb-2">Live infrastructure status</p>
                        <div className="flex items-center justify-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <p className="text-xs font-medium text-green-600">All Systems Operational</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FAQ Accordion */}
            <Card variant="glass">
                <CardContent className="py-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <HelpCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Frequently Asked Questions</h2>
                            <p className="text-sm text-muted-foreground">Common questions from dealers like you</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {FAQS.map((faq, index) => (
                            <div key={index} className="border border-border rounded-xl overflow-hidden">
                                <button
                                    className="w-full text-left px-4 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors gap-4"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <span className="font-medium text-sm">{faq.q}</span>
                                    <ChevronDown className={cn(
                                        "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                                        openFaq === index && "rotate-180"
                                    )} />
                                </button>
                                {openFaq === index && (
                                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3 bg-muted/10">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Still need help CTA */}
            <Card variant="glass" className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-blue-200/40">
                <CardContent className="py-8 text-center">
                    <Book className="w-10 h-10 mx-auto mb-3 text-blue-500 opacity-80" />
                    <h2 className="text-xl font-bold mb-2">Still need help?</h2>
                    <p className="text-muted-foreground mb-5 max-w-md mx-auto text-sm">
                        Our support team is available Mon–Sat, 9 AM–7 PM IST.
                        We're here to make sure your dealership site is perfect.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a href="mailto:support@cyepro.com">
                            <Button className="gap-2">
                                <Mail className="w-4 h-4" />
                                Email Us
                            </Button>
                        </a>
                        {process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP && (
                        <a href={`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="gap-2">
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp Us
                            </Button>
                        </a>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
