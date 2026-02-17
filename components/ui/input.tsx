import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

/**
 * shadcn/ui inspired Input component
 * Clean, professional form input design
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, helperText, error, type = "text", ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                        {props.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                <input
                    type={type}
                    ref={ref}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                        "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        "placeholder:text-muted-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "transition-colors",
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    {...props}
                />
                {helperText && !error && (
                    <p className="text-[0.8rem] text-muted-foreground">
                        {helperText}
                    </p>
                )}
                {error && (
                    <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
