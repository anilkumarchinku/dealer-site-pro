"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const COUNTRY_CODES = [
    { code: "+91",  country: "IN", flag: "\u{1F1EE}\u{1F1F3}", label: "India",         digits: 10 },
    { code: "+1",   country: "US", flag: "\u{1F1FA}\u{1F1F8}", label: "USA",           digits: 10 },
    { code: "+44",  country: "GB", flag: "\u{1F1EC}\u{1F1E7}", label: "UK",            digits: 10 },
    { code: "+971", country: "AE", flag: "\u{1F1E6}\u{1F1EA}", label: "UAE",           digits: 9  },
    { code: "+966", country: "SA", flag: "\u{1F1F8}\u{1F1E6}", label: "Saudi Arabia",  digits: 9  },
    { code: "+65",  country: "SG", flag: "\u{1F1F8}\u{1F1EC}", label: "Singapore",     digits: 8  },
    { code: "+60",  country: "MY", flag: "\u{1F1F2}\u{1F1FE}", label: "Malaysia",      digits: 10 },
    { code: "+61",  country: "AU", flag: "\u{1F1E6}\u{1F1FA}", label: "Australia",     digits: 9  },
    { code: "+49",  country: "DE", flag: "\u{1F1E9}\u{1F1EA}", label: "Germany",       digits: 11 },
    { code: "+81",  country: "JP", flag: "\u{1F1EF}\u{1F1F5}", label: "Japan",         digits: 10 },
    { code: "+977", country: "NP", flag: "\u{1F1F3}\u{1F1F5}", label: "Nepal",         digits: 10 },
    { code: "+94",  country: "LK", flag: "\u{1F1F1}\u{1F1F0}", label: "Sri Lanka",     digits: 9  },
    { code: "+880", country: "BD", flag: "\u{1F1E7}\u{1F1E9}", label: "Bangladesh",    digits: 10 },
] as const

export type CountryCode = (typeof COUNTRY_CODES)[number]

export function getCountryByCode(code: string): CountryCode {
    return COUNTRY_CODES.find(c => c.code === code) ?? COUNTRY_CODES[0]
}

/** Validate a phone number based on the selected country's expected digit count. */
export function validatePhone(number: string, countryCode: string): { valid: boolean; error?: string } {
    const digits = number.replace(/\D/g, "")
    const country = getCountryByCode(countryCode)
    if (!digits) return { valid: false, error: "Phone number is required" }
    if (digits.length !== country.digits) {
        return { valid: false, error: `Enter a valid ${country.digits}-digit ${country.label} number` }
    }
    // India: must start with 6-9
    if (country.code === "+91" && !/^[6-9]/.test(digits)) {
        return { valid: false, error: "Indian numbers must start with 6, 7, 8, or 9" }
    }
    return { valid: true }
}

interface PhoneInputProps {
    value: string
    countryCode: string
    onValueChange: (number: string) => void
    onCountryCodeChange: (code: string) => void
    label?: string
    helperText?: string
    error?: string
    disabled?: boolean
    required?: boolean
    id?: string
}

export function PhoneInput({
    value, countryCode, onValueChange, onCountryCodeChange,
    label, helperText, error, disabled, required, id,
}: PhoneInputProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const selected = getCountryByCode(countryCode)

    const handleNumberChange = (raw: string) => {
        // Strip non-digits
        onValueChange(raw.replace(/\D/g, ""))
    }

    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-200">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="flex gap-0">
                {/* Country code selector */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(o => !o)}
                        disabled={disabled}
                        className={cn(
                            "flex items-center gap-1 h-10 px-2.5 text-sm rounded-l-md border border-r-0 bg-muted/50 transition-colors",
                            "border-gray-200 dark:border-gray-600 hover:bg-muted",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-red-500",
                        )}
                    >
                        <span className="text-base leading-none">{selected.flag}</span>
                        <span className="font-mono text-xs text-muted-foreground">{selected.code}</span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute top-full left-0 z-50 mt-1 w-56 max-h-60 overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
                            {COUNTRY_CODES.map(c => (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => { onCountryCodeChange(c.code); setDropdownOpen(false) }}
                                    className={cn(
                                        "flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-accent text-left",
                                        c.code === countryCode && "bg-accent font-medium",
                                    )}
                                >
                                    <span className="text-base">{c.flag}</span>
                                    <span className="flex-1">{c.label}</span>
                                    <span className="font-mono text-xs text-muted-foreground">{c.code}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {/* Number input */}
                <input
                    id={id}
                    type="tel"
                    inputMode="numeric"
                    value={value}
                    onChange={e => handleNumberChange(e.target.value)}
                    maxLength={selected.digits + 2}
                    placeholder={`${"0".repeat(selected.digits).replace(/(.{5})/, "$1 ")}`}
                    disabled={disabled}
                    className={cn(
                        "flex-1 h-10 px-3 py-2 text-sm rounded-r-md border transition-colors",
                        "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus-visible:ring-red-500",
                    )}
                />
            </div>
            {helperText && !error && (
                <p className="text-[0.8rem] text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
            {error && (
                <p className="text-[0.8rem] font-medium text-red-500">{error}</p>
            )}
        </div>
    )
}
