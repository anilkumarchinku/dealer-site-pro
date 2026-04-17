"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { signOut } from "@/lib/db/auth";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseReady } from "@/lib/supabase";
import {
    LayoutDashboard,
    Users,
    Car,
    Plus,
    BarChart3,
    MessageSquare,
    Settings,
    Globe,
    HelpCircle,
    Bell,
    LogOut,
    ChevronDown,
    Star,
    Layout,
    Store,
    Bike,
    Truck,
    RefreshCw,
    BookOpen,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import { dealerSiteHref } from "@/lib/utils/domain";

const navGroups = [
    {
        label: "Main",
        items: [
            { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        label: "Manage",
        items: [
            { name: "Leads",       href: "/dashboard/leads",         icon: Users        },
            { name: "Inventory",   href: "/dashboard/inventory",     icon: Car          },
            { name: "Add Vehicle", href: "/dashboard/inventory/add", icon: Plus         },
            { name: "Messages",    href: "/dashboard/messages",      icon: MessageSquare },
        ],
    },
    {
        label: "Insights",
        items: [
            { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3  },
            { name: "Reviews",   href: "/dashboard/reviews",   icon: Star       },
            { name: "Catalog",   href: "/dashboard/catalog",   icon: BookOpen   },
        ],
    },
    {
        label: "2-Wheeler",
        items: [
            { name: "2W Overview",  href: "/dashboard/two-wheelers",          icon: Bike      },
            { name: "2W Used",      href: "/dashboard/two-wheelers/used",      icon: Bike      },
            { name: "2W Leads",     href: "/dashboard/two-wheelers/leads",     icon: Users     },
            { name: "2W Service",   href: "/dashboard/two-wheelers/service",   icon: Settings  },
            { name: "2W Bookings",  href: "/dashboard/two-wheelers/bookings",  icon: BarChart3 },
        ],
    },
    {
        label: "3-Wheeler",
        items: [
            { name: "3W Overview",  href: "/dashboard/three-wheelers",          icon: Truck     },
            { name: "3W Used",      href: "/dashboard/three-wheelers/used",      icon: Truck     },
            { name: "3W Leads",     href: "/dashboard/three-wheelers/leads",     icon: Users     },
            { name: "3W Service",   href: "/dashboard/three-wheelers/service",   icon: Settings  },
            { name: "3W Bookings",  href: "/dashboard/three-wheelers/bookings",  icon: BarChart3 },
        ],
    },
    {
        label: "2nd Hand",
        items: [
            { name: "Used Overview", href: "/dashboard/used-vehicles",           icon: RefreshCw },
            { name: "Used 2W",       href: "/dashboard/two-wheelers/used",       icon: Bike      },
            { name: "Used 3W",       href: "/dashboard/three-wheelers/used",     icon: Truck     },
        ],
    },
    {
        label: "My Website",
        items: [
            { name: "My Webpage", href: "/dashboard/webpage",  icon: Layout },
            { name: "Domains",   href: "/dashboard/domains",  icon: Store  },
        ],
    },
    {
        label: "Configure",
        items: [
            { name: "Settings", href: "/dashboard/settings", icon: Settings   },
            { name: "Help",     href: "/dashboard/help",     icon: HelpCircle },
        ],
    },
];

// Flat list used for active-page title lookup
const navigation = navGroups.flatMap(g => g.items);

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router   = useRouter();
    const { data, updateData, setDealerId, setDealerSlug, dealerSlug, setSellsTwoWheelers, setSellsThreeWheelers, setSellsFourWheelers } = useOnboardingStore();
    const isFirstHand = data.sellsNewCars && !data.sellsUsedCars;
    const [unreadCount,        setUnreadCount]         = useState(0);
    const [onboardingComplete, setOnboardingComplete]  = useState(true);
    const [vehicleType,        setVehicleType]         = useState<string | null>(null);
    const [sellsTwoWheelers,   setSellsTwoWheelersL]   = useState(false);
    const [sellsThreeWheelers, setSellsThreeWheelersL] = useState(false);
    const [sellsFourWheelers,  setSellsFourWheelersL]  = useState(false);

    // On every mount: verify the user has completed onboarding.
    // The early-exit on data.dealershipName was intentionally removed —
    // we must always hit the DB to check onboarding_complete because the
    // Zustand store can be pre-populated (e.g. after register) even though
    // the user never finished onboarding.
    useEffect(() => {
        if (!isSupabaseReady()) return;

        async function syncFromDB() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Retry up to 3 times with a short delay — guards against the race
                // where the user just finished onboarding and the session/DB write
                // hasn't fully propagated when the dashboard first mounts.
                let dealer = null;
                let dealerError = null;
                for (let attempt = 0; attempt < 3; attempt++) {
                    if (attempt > 0) await new Promise(r => setTimeout(r, 800));
                    const result = await supabase
                        .from('dealers')
                        .select('id, dealership_name, tagline, location, full_address, phone, whatsapp, email, gstin, sells_new_cars, sells_used_cars, style_template, slug, onboarding_complete, vehicle_type, sells_two_wheelers, sells_three_wheelers, sells_four_wheelers')
                        .eq('user_id', user.id)
                        .maybeSingle();
                    dealerError = result.error;
                    dealer = result.data;
                    // If query succeeded and dealer exists, stop retrying
                    if (!dealerError && dealer) break;
                    // If query errored, stop retrying (network issue — don't redirect)
                    if (dealerError) break;
                }

                // Query errored (network, rate-limit, etc.) — do NOT redirect.
                // Stay on dashboard and silently fail.
                if (dealerError) return;

                // No dealer record at all → brand new user, send to onboarding.
                // Do NOT check onboarding_complete here — it can be false for
                // existing users if the DB save failed mid-way (missing column etc).
                if (!dealer) {
                    router.replace('/onboarding');
                    return;
                }

                setDealerId(dealer.id);
                if (dealer.slug) setDealerSlug(dealer.slug);
                setOnboardingComplete(dealer.onboarding_complete ?? false);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const d = dealer as any;
                const vType   = d.vehicle_type         as string | null;
                const sells2w = d.sells_two_wheelers   ?? false;
                const sells3w = d.sells_three_wheelers ?? false;
                const sells4w = d.sells_four_wheelers  ?? false;
                setVehicleType(vType);
                setSellsTwoWheelersL(sells2w);
                setSellsThreeWheelersL(sells3w);
                setSellsFourWheelersL(sells4w);
                // Sync to Zustand store for use in other pages
                setSellsTwoWheelers(sells2w);
                setSellsThreeWheelers(sells3w);
                setSellsFourWheelers(sells4w);
                // Compute effective segment flags
                const hasCars = vType === 'car'           || sells4w;
                const has2W   = vType === 'two-wheeler'   || sells2w;
                const has3W   = vType === 'three-wheeler' || sells3w;
                if (pathname === '/dashboard' || pathname === '/dashboard/') {
                    // Only auto-redirect pure single-type dealers
                    if (has2W && !hasCars && !has3W) { router.replace('/dashboard/two-wheelers');   return; }
                    if (has3W && !hasCars && !has2W) { router.replace('/dashboard/three-wheelers'); return; }
                }

                // Fetch unread message count for notification bell
                const { count } = await supabase
                    .from('messages')
                    .select('id', { count: 'exact', head: true })
                    .eq('dealer_id', dealer.id)
                    .eq('is_read', false)
                    .eq('is_archived', false);
                setUnreadCount(count ?? 0);

                // Store already populated — skip the extra brands query
                if (data.dealershipName) return;

                const { data: brands } = await supabase
                    .from('dealer_brands')
                    .select('brand_name')
                    .eq('dealer_id', dealer.id)
                    .order('is_primary', { ascending: false });

                updateData({
                    dealershipName: dealer.dealership_name,
                    tagline:        dealer.tagline        ?? '',
                    location:       dealer.location       ?? '',
                    fullAddress:    dealer.full_address   ?? '',
                    phone:          dealer.phone          ?? '',
                    whatsapp:       dealer.whatsapp       ?? '',
                    email:          dealer.email          ?? '',
                    gstin:          dealer.gstin          ?? '',
                    sellsNewCars:   dealer.sells_new_cars,
                    sellsUsedCars:  dealer.sells_used_cars,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    styleTemplate:  (dealer.style_template as any) ?? 'family',
                    brands:         (brands?.map((b: { brand_name: string }) => b.brand_name) ?? []) as import('@/lib/types').Brand[],
                });
            } catch {
                // Silently fail — dashboard still works without DB data
            }
        }

        syncFromDB();
        return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push("/auth/login");
    };

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card/50 backdrop-blur-xl border-r border-border flex flex-col z-50">
                {/* Logo with Hover Transition */}
                <div className="p-6 border-b border-border relative">
                    <BrandLogo />
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto space-y-4">
                    {navGroups.filter(group => {
                        const hasCars = vehicleType === 'car'           || sellsFourWheelers;
                        const has2W   = vehicleType === 'two-wheeler'   || sellsTwoWheelers;
                        const has3W   = vehicleType === 'three-wheeler' || sellsThreeWheelers;
                        if (group.label === 'Manage')     return hasCars;
                        if (group.label === '2-Wheeler')  return has2W;
                        if (group.label === '3-Wheeler')  return has3W;
                        if (group.label === '2nd Hand')   return has2W || has3W;
                        return true; // Main, Insights, My Website, Configure always visible
                    }).map((group) => (
                        <div key={group.label}>
                            <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                                {group.label}
                            </p>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href ||
                                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                    const isLocked = isFirstHand && item.href === "/dashboard/inventory/add";
                                    if (isLocked) {
                                        return (
                                            <Link
                                                key={item.name}
                                                href="/dashboard/inventory/add"
                                                title="Only hybrid & used-car dealers can add vehicles"
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium opacity-40 cursor-not-allowed text-muted-foreground pointer-events-none"
                                            >
                                                <item.icon className="w-5 h-5 shrink-0" />
                                                {item.name}
                                            </Link>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-primary/10 text-primary border border-primary/20"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5 shrink-0" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Dealer Info */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                            {data.dealershipName?.charAt(0) || "D"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                                {data.dealershipName || "Your Dealership"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {data.location || "Location"}
                            </p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="pl-64">
                {/* Top Bar */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
                    <div className="h-full px-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold">
                                {navigation.find(n => pathname === n.href ||
                                    (n.href !== "/dashboard" && pathname.startsWith(n.href)))?.name || "Dashboard"}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Theme toggle */}
                            <ThemeToggle />

                            {/* Notifications */}
                            <Button variant="outline" size="icon" className="relative w-9 h-9" title={unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : "No new notifications"}>
                                <Bell className="w-4 h-4 text-muted-foreground" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="w-px h-5 bg-border" />

                            <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
                                <a href={dealerSlug ? dealerSiteHref(dealerSlug) : '#'} target="_blank" rel="noopener noreferrer">
                                    <Globe className="w-4 h-4" />
                                    View Website
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                className="gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Onboarding incomplete banner */}
                {!onboardingComplete && (
                    <div className="flex items-center justify-between gap-4 px-6 py-3 bg-amber-500/10 border-b border-amber-500/20">
                        <div className="flex items-center gap-3 min-w-0">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Setup incomplete</p>
                                <p className="text-xs text-amber-700 dark:text-amber-400/80 truncate">
                                    Complete your dealership profile to go live and start receiving leads.
                                </p>
                            </div>
                        </div>
                        <Link href="/onboarding">
                            <Button size="sm" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white gap-1.5">
                                Complete Setup
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
