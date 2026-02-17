"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPage() {
    const router = useRouter();

    useEffect(() => {
        // Clear all localStorage
        localStorage.clear();

        // Redirect to onboarding
        setTimeout(() => {
            router.push("/onboarding/step-1");
        }, 1000);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-900">Clearing old data...</p>
                <p className="text-gray-600 mt-2">Redirecting to fresh start...</p>
            </div>
        </div>
    );
}
