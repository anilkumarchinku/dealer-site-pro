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
    appearance?: "default" | "light";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, helperText, error, type = "text", appearance = "default", ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    type={type}
                    ref={ref}
                    className={cn(
                        "flex h-10 w-full px-3 py-2 text-sm transition-colors",
                        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        appearance === "light"
                            ? "rounded-xl border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-500 caret-gray-900 [color-scheme:light] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 focus-visible:border-gray-400"
                            : "rounded-md border border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus-visible:ring-red-500",
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
                    <p className="text-[0.8rem] font-medium text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
