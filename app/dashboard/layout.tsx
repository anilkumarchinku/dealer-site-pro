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
    BarChart3,
    MessageSquare,
    Settings,
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
    ShieldCheck,
    Menu,
    X,
} from "lucide-react";
import type { StyleTemplate } from "@/lib/types";

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
            { name: "Sell Requests", href: "/dashboard/sell-requests", icon: RefreshCw },
            { name: "Service",     href: "/dashboard/service",       icon: Settings     },
            { name: "Insurance",   href: "/dashboard/insurance",     icon: ShieldCheck  },
            { name: "Push",        href: "/dashboard/push-notifications", icon: Bell    },
            { name: "Inventory",   href: "/dashboard/inventory",     icon: Car          },
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
    const { data, updateData, setDealerId, setDealerSlug, dealerSlug, setSellsTwoWheelers, setSellsThreeWheelers, setSellsFourWheelers, reset } = useOnboardingStore();
    const isFirstHand = data.sellsNewCars && !data.sellsUsedCars;
    const [unreadCount,        setUnreadCount]         = useState(0);
    const [onboardingComplete, setOnboardingComplete]  = useState(true);
    const [vehicleType,        setVehicleType]         = useState<string | null>(null);
    const [sellsTwoWheelers,   setSellsTwoWheelersL]   = useState(false);
    const [sellsThreeWheelers, setSellsThreeWheelersL] = useState(false);
    const [sellsFourWheelers,  setSellsFourWheelersL]  = useState(false);
    const [mobileNavOpen,      setMobileNavOpen]       = useState(false);

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

                // Account-switch guard: if a different dealer is cached locally
                // (e.g. a previous user signed in on this browser), clear the stale
                // store before repopulating so we never show another account's data.
                const cachedDealerId = useOnboardingStore.getState().dealerId;
                if (cachedDealerId && cachedDealerId !== dealer.id) {
                    reset();
                }

                setDealerId(dealer.id);
                if (dealer.slug) setDealerSlug(dealer.slug);
                setOnboardingComplete(dealer.onboarding_complete ?? false);

                const vType   = dealer.vehicle_type         as string | null;
                const sells2w = dealer.sells_two_wheelers   ?? false;
                const sells3w = dealer.sells_three_wheelers ?? false;
                const sells4w = dealer.sells_four_wheelers  ?? false;
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

                // Always reconcile the displayed profile to the authenticated dealer
                // (closure `data` is stale here, so we cannot safely early-return on it).
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
                    styleTemplate:  (dealer.style_template as StyleTemplate | null) ?? 'family',
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
        <div className="min-h-screen bg-[#F6F9FD] text-foreground dark:bg-[#07111F]">
            {/* Sidebar */}
            {mobileNavOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
                    onClick={() => setMobileNavOpen(false)}
                />
            )}
            <aside className={cn(
                "fixed bottom-0 left-0 top-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#071A3D] text-white shadow-[18px_0_50px_rgba(7,20,47,0.12)] transition-transform duration-200 lg:translate-x-0",
                mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="relative flex items-center justify-between border-b border-white/10 p-5">
                    <BrandLogo className="[&>span]:text-white" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
                        onClick={() => setMobileNavOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-5 overflow-y-auto p-4">
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
                            <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                                {group.label}
                            </p>
                            <div className="space-y-1">
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
                                                className="flex pointer-events-none cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 opacity-50"
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
                                            onClick={() => setMobileNavOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                                                isActive
                                                    ? "border border-white/10 bg-white/10 text-white shadow-sm"
                                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
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
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">
                            {data.dealershipName?.charAt(0) || "D"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-black text-white">
                                {data.dealershipName || "Your Dealership"}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                {data.location || "Location"}
                            </p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 border-b border-border/70 bg-white/85 backdrop-blur-xl dark:bg-[#0B182B]/85">
                    <div className="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0 lg:hidden"
                                onClick={() => setMobileNavOpen(true)}
                                aria-label="Open navigation"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                            <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
                                Dealer Dashboard
                            </p>
                            <h1 className="mt-0.5 truncate text-lg font-black tracking-tight">
                                {navigation.find(n => pathname === n.href ||
                                    (n.href !== "/dashboard" && pathname.startsWith(n.href)))?.name || "Dashboard"}
                            </h1>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            {/* Theme toggle */}
                            <ThemeToggle />

                            {/* Notifications */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="relative h-9 w-9"
                                title={unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : "No new notifications"}
                                aria-label={unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : "No new notifications"}
                            >
                                <Bell className="w-4 h-4 text-muted-foreground" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="w-px h-5 bg-border" />

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                aria-label="Sign out"
                                className="gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign Out</span>
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
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
