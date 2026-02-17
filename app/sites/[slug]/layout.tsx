/**
 * Sites Layout - Wraps all dealer websites
 * This layout is used when accessing via subdomain or custom domain
 */

interface SitesLayoutProps {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}

export default async function SitesLayout({ children, params }: SitesLayoutProps) {
    // In Next.js 15, params is a Promise that needs to be awaited
    const { slug } = await params

    // The slug is provided by the middleware rewrite
    // Layout is kept minimal - all logic in page.tsx

    return <>{children}</>
}
