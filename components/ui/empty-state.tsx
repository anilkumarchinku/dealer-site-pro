import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon
    title: string
    description?: string
    action?: React.ReactNode
}

/**
 * Token-driven empty-state primitive.
 * Centered layout with a muted icon circle, foreground title, muted description
 * and an optional action below. Renders correctly in light and dark mode.
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    ({ className, icon: Icon, title, description, action, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center",
                className
            )}
            {...props}
        >
            {Icon && (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-sm">
                    <Icon className="h-7 w-7" />
                </div>
            )}
            <p className="text-base font-semibold text-foreground">{title}</p>
            {description && (
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            {action && <div className="mt-5">{action}</div>}
        </div>
    )
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
