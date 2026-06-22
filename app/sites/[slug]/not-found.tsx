import Link from "next/link"

export default function SiteNotFound() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div
                    className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-600"
                    aria-hidden="true"
                >
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
                    </svg>
                </div>
                <p className="text-5xl font-black tracking-tight text-gray-900">404</p>
                <h1 className="mt-3 text-xl font-bold text-gray-900">Vehicle not found</h1>
                <p className="mt-2 text-gray-600">
                    This listing is no longer available or may have been sold. Browse the rest of our inventory instead.
                </p>
                <Link
                    href="./"
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    Back to inventory
                </Link>
            </div>
        </main>
    )
}
