export default function SiteLoading() {
    return (
        <div className="min-h-screen bg-background animate-pulse">
            {/* Nav skeleton */}
            <div className="h-16 bg-muted border-b border-border flex items-center px-6 gap-4">
                <div className="h-8 w-32 rounded-xl bg-muted-foreground/10" />
                <div className="flex-1" />
                <div className="h-8 w-20 rounded-xl bg-muted-foreground/10" />
                <div className="h-8 w-24 rounded-xl bg-muted-foreground/10" />
            </div>
            {/* Hero skeleton */}
            <div className="h-96 bg-muted-foreground/5 flex flex-col items-center justify-center gap-4 px-6">
                <div className="h-8 w-64 rounded-xl bg-muted-foreground/10" />
                <div className="h-5 w-96 max-w-full rounded-xl bg-muted-foreground/10" />
                <div className="h-5 w-80 max-w-full rounded-xl bg-muted-foreground/10" />
                <div className="flex gap-3 mt-4">
                    <div className="h-10 w-36 rounded-xl bg-muted-foreground/10" />
                    <div className="h-10 w-36 rounded-xl bg-muted-foreground/10" />
                </div>
            </div>
            {/* Inventory grid skeleton */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="h-7 w-48 rounded-xl bg-muted-foreground/10 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border overflow-hidden">
                            <div className="h-48 bg-muted-foreground/10" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 w-3/4 rounded-xl bg-muted-foreground/10" />
                                <div className="h-4 w-1/2 rounded-xl bg-muted-foreground/10" />
                                <div className="h-6 w-1/3 rounded-xl bg-muted-foreground/10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
