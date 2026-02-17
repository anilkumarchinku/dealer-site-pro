import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "DealerSite Pro - Free Dealership Websites",
    description: "Get a professional dealership website in 10 minutes. 100% FREE. No tech skills needed.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <ThemeProvider>
                    <div className="min-h-screen gradient-bg">
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
