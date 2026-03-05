/**
 * Sites Layout - Wraps all dealer websites
 * This layout is used when accessing via subdomain or custom domain
 */

interface SitesLayoutProps {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}

export default async function SitesLayout({ children, params }: SitesLayoutProps) {
    void params
    return <>{children}</>
}
