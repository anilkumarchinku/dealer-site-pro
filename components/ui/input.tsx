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
                    <label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                            ? "rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 focus-visible:border-gray-300"
                            : "rounded-md border border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 ring-offset-white dark:ring-offset-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {helperText && !error && (
                    <p className="text-[0.8rem] text-gray-500 dark:text-gray-400">
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
