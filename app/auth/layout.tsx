import { Car } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DealerSite Pro</span>
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
    );
}
