/**
 * Sites Layout - Wraps all dealer websites
 * This layout is used when accessing via subdomain or custom domain
 */

export default function SitesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="dealer-site-surface min-h-screen bg-background text-foreground">
            {children}
        </div>
    )
}
