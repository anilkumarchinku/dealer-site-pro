export default function SiteLoading() {
    return (
        <div className="min-h-screen bg-gray-900 animate-pulse">
            {/* Nav skeleton */}
            <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-6 gap-4">
                <div className="h-8 w-32 rounded-xl bg-gray-700" />
                <div className="flex-1" />
                <div className="h-8 w-20 rounded-xl bg-gray-700" />
                <div className="h-8 w-24 rounded-xl bg-gray-700" />
            </div>
            {/* Hero skeleton */}
            <div className="h-96 bg-gray-800/50 flex flex-col items-center justify-center gap-4 px-6">
                <div className="h-8 w-64 rounded-xl bg-gray-700" />
                <div className="h-5 w-96 max-w-full rounded-xl bg-gray-700" />
                <div className="h-5 w-80 max-w-full rounded-xl bg-gray-700" />
                <div className="flex gap-3 mt-4">
                    <div className="h-10 w-36 rounded-xl bg-gray-700" />
                    <div className="h-10 w-36 rounded-xl bg-gray-700" />
                </div>
            </div>
            {/* Inventory grid skeleton */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="h-7 w-48 rounded-xl bg-gray-700 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-700 overflow-hidden">
                            <div className="h-48 bg-gray-700" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 w-3/4 rounded-xl bg-gray-700" />
                                <div className="h-4 w-1/2 rounded-xl bg-gray-700" />
                                <div className="h-6 w-1/3 rounded-xl bg-gray-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
