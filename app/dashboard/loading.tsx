import { Skeleton } from "@/components/ui/skeleton";

/** Streaming loading skeleton for dashboard route segments. */
export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-border/70 bg-card/90 p-5">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="mt-5 h-4 w-24" />
                        <Skeleton className="mt-2 h-8 w-20" />
                    </div>
                ))}
            </div>

            {/* Content block */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card/90 p-5 space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2 pt-1">
                                <Skeleton className="h-3.5 w-1/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="rounded-2xl border border-border/70 bg-card/90 p-5 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
