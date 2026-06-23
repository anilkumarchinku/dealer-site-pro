import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
    "relative flex w-full gap-3 rounded-lg border p-4 text-sm",
    {
        variants: {
            variant: {
                default: "border-border bg-background text-foreground",
                error: "border-destructive/30 bg-destructive/10 text-destructive",
                success:
                    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
                warning:
                    "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
                info: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface AlertProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
    /** Optional leading icon (e.g. a lucide icon element). */
    icon?: React.ReactNode
    /** Optional title rendered above the message. */
    title?: React.ReactNode
}

/**
 * Token-driven inline alert. Status colors work in both light and dark mode.
 * Pass message content as children; use `title` and `icon` for the optional slots.
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, icon, title, children, ...props }, ref) => (
        <div
            ref={ref}
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        >
            {icon && (
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                    {icon}
                </span>
            )}
            <div className="min-w-0 flex-1">
                {title && <AlertTitle>{title}</AlertTitle>}
                {children && <AlertDescription>{children}</AlertDescription>}
            </div>
        </div>
    )
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("mb-0.5 font-medium leading-none tracking-tight", className)}
        {...props}
    />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, alertVariants }
