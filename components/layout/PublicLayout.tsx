/**
 * PublicLayout — Wraps public-facing pages with shared header and footer
 * Use this in any page that should show the site-wide navigation
 */

import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SiteHeader />
            <main className="min-h-[calc(100vh-56px)]">
                {children}
            </main>
            <SiteFooter />
        </>
    );
}
