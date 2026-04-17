/**
 * Sites Layout - Wraps all dealer websites
 * This layout is used when accessing via subdomain or custom domain
 */

import { WhatsAppFAB } from "@/components/shared/WhatsAppFAB"

export default function SitesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="dealer-site-surface min-h-screen bg-background text-foreground">
            {children}
            <WhatsAppFAB />
        </div>
    )
}
