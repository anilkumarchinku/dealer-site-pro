import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PWAProvider } from "@/components/PWAProvider";
import '@/lib/env' // Validate required env vars at startup (throws in production if missing)

export const metadata: Metadata = {
    title: "DealerSite Pro - Professional Dealership Websites",
    description: "Get a professional dealership website in 10 minutes. Free subdomain included. Custom domain available on upgrade.",
    icons: {
        icon: "/dealersite-pro-shield.png",
        apple: "/dealersite-pro-shield.png",
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

// Applied before first paint so dark-mode users never see a light flash (FOUC).
// Must mirror ThemeProvider: storage key `dealer-theme`, fall back to system.
const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('dealer-theme');
    if (t !== 'dark' && t !== 'light') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
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
