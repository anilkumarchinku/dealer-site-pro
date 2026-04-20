"use client"
import { useState, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface PasswordInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string
    helperText?: string
    error?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, label, helperText, error, ...props }, ref) => {
        const [visible, setVisible] = useState(false)

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-200">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type={visible ? "text" : "password"}
                        className={cn(
                            "flex h-10 w-full px-3 py-2 pr-10 text-sm rounded-md border transition-colors",
                            "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                            "ring-offset-white dark:ring-offset-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-red-500 focus-visible:ring-red-500",
                            className,
                        )}
                        {...props}
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setVisible(v => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={visible ? "Hide password" : "Show password"}
                    >
                        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {helperText && !error && (
                    <p className="text-[0.8rem] text-gray-500 dark:text-gray-400">{helperText}</p>
                )}
                {error && (
                    <p className="text-[0.8rem] font-medium text-red-500">{error}</p>
                )}
            </div>
        )
    },
)

PasswordInput.displayName = "PasswordInput"
export { PasswordInput }
