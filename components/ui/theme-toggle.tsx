'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative w-9 h-9 flex items-center justify-center rounded-lg",
                "hover:bg-muted transition-colors duration-200",
                "border border-border",
                className
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {/* Sun icon — shown in dark mode to switch to light */}
            <Sun
                className={cn(
                    "absolute w-4 h-4 text-amber-400 transition-all duration-300",
                    isDark
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-90 scale-50"
                )}
            />
            {/* Moon icon — shown in light mode to switch to dark */}
            <Moon
                className={cn(
                    "absolute w-4 h-4 text-slate-600 dark:text-slate-400 transition-all duration-300",
                    isDark
                        ? "opacity-0 -rotate-90 scale-50"
                        : "opacity-100 rotate-0 scale-100"
                )}
            />
        </button>
    )
}
