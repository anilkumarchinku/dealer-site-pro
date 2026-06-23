import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Token-driven heading primitive encoding the documented app heading style
 * (`font-black tracking-tight text-foreground`). Size defaults follow the
 * heading level but can be overridden via the `size` prop.
 */
const headingVariants = cva("font-black tracking-tight text-foreground", {
    variants: {
        size: {
            h1: "text-3xl sm:text-4xl",
            h2: "text-2xl",
            h3: "text-xl",
            h4: "text-lg",
        },
    },
    defaultVariants: {
        size: "h2",
    },
})

type HeadingTag = "h1" | "h2" | "h3" | "h4"

export interface HeadingProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
    /** Semantic heading level rendered. Defaults to "h2". */
    as?: HeadingTag
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ as = "h2", size, className, ...props }, ref) => {
        const Comp = as
        // Default the visual size to match the semantic level when not overridden.
        const resolvedSize = size ?? as
        return (
            <Comp
                ref={ref}
                className={cn(headingVariants({ size: resolvedSize }), className)}
                {...props}
            />
        )
    }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }
