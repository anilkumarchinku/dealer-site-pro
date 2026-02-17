import { Car } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background relative">
            {/* Theme toggle — top right corner */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Car className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-foreground">DealerSite Pro</span>
                </Link>

                {/* Card */}
                <div className="w-full max-w-md">
                    {children}
                </div>

                <p className="mt-8 text-xs text-muted-foreground text-center">
                    By continuing you agree to our{" "}
                    <Link href="#" className="underline hover:text-foreground">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}
