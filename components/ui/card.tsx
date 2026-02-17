import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

/**
 * shadcn/ui inspired Card component
 * Supports multiple variants for different use cases
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "outline";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const variants = {
            // shadcn/ui style - Clean, professional with subtle shadow
            default: "bg-card border border-border shadow-sm",
            // Glassmorphism - For dark template selector
            glass: "glass",
            // Outline only
            outline: "border-2 border-border bg-transparent",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-lg p-6 transition-all duration-200",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col space-y-1.5 mb-6", className)} {...props} />
    )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight text-foreground", className)} {...props} />
    )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
    )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("mt-6 flex items-center pt-6 border-t border-border", className)} {...props} />
    )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
