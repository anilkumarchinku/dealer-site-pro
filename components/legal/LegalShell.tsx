import Image from 'next/image'
import Link from 'next/link'

interface LegalShellProps {
    dealerName: string
    logoUrl?: string | null
    siteHref: string
    children: React.ReactNode
}

export function LegalShell({ dealerName, logoUrl, siteHref, children }: LegalShellProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href={siteHref} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        {logoUrl && (
                            <div className="relative w-8 h-8">
                                <Image src={logoUrl} alt={dealerName} fill className="object-contain" sizes="32px" />
                            </div>
                        )}
                        <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-none">{dealerName}</span>
                    </Link>
                    <Link
                        href={siteHref}
                        className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-400">
                <p>© {new Date().getFullYear()} {dealerName}. All rights reserved.</p>
            </footer>
        </div>
    )
}
