/**
 * Sites Layout - Wraps all dealer websites
 * This layout is used when accessing via subdomain or custom domain
 *
 * NOTE: Injects a script that immediately removes the `.dark` class so the
 * public dealer website always renders in light mode, regardless of the
 * visitor's stored dashboard theme preference.
 */

interface SitesLayoutProps {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}

export default async function SitesLayout({ children, params }: SitesLayoutProps) {
    // In Next.js 15, params is a Promise that needs to be awaited
    const { slug } = await params

    // Suppress unused warning
    void slug

    return (
        <>
            {/* Immediately remove .dark before any paint so dealer sites are always light */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `document.documentElement.classList.remove('dark');`,
                }}
            />
            {children}
        </>
    )
}
