import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PWAProvider } from "@/components/PWAProvider";
import '@/lib/env' // Validate required env vars at startup (throws in production if missing)

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "DealerSite Pro - Free Dealership Websites",
    description: "Get a professional dealership website in 10 minutes. 100% FREE. No tech skills needed.",
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
            <body className={`${inter.variable} font-sans antialiased`}>
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
