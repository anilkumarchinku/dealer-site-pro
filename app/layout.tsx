import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PWAProvider } from "@/components/PWAProvider";
import '@/lib/env' // Validate required env vars at startup (throws in production if missing)

export const metadata: Metadata = {
    title: "DealerSite Pro - Professional Dealership Websites",
    description: "Get a professional dealership website in 10 minutes. Free subdomain included. Custom domain available on upgrade.",
    icons: {
        icon: "/favicon.svg",
        apple: "/favicon.svg",
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "DealerSite Pro",
    },
    other: {
        "mobile-web-app-capable": "yes",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans antialiased">
                <PWAProvider />
                <ThemeProvider>
                    <div className="min-h-screen gradient-bg">
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
