"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { signOut } from "@/lib/db/auth";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/dashboard/leads", icon: Users },
    { name: "Inventory", href: "/dashboard/inventory", icon: Car },
    { name: "Add Vehicle", href: "/dashboard/inventory/add", icon: Plus },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Reviews", href: "/dashboard/reviews", icon: Star },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router   = useRouter();
    const { data } = useOnboardingStore();

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
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Dealer Info */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
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
                            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
                                <Bell className="w-4 h-4 text-muted-foreground" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {/* Divider */}
                            <div className="w-px h-5 bg-border" />

                            <Link
                                href="/preview"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted"
                            >
                                <Globe className="w-4 h-4" />
                                View Website
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
