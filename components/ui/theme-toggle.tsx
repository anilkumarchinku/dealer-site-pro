'use client'

import { Moon, Sun } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme()
    const [pageRipple, setPageRipple] = useState<{ key: number; x: number; y: number; color: string } | null>(null)
    const isDark = theme === 'dark'

    const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setPageRipple({
            key: Date.now(),
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            color: isDark ? 'rgba(251, 191, 36, 0.24)' : 'rgba(37, 99, 235, 0.22)',
        })
        toggleTheme()
    }

    return (
        <>
            <button
                onClick={handleToggle}
                className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-lg',
                    'border border-border transition-colors duration-200 hover:bg-muted',
                    className
                )}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                <Sun
                    className={cn(
                        'absolute h-4 w-4 text-amber-400 transition-all duration-300',
                        isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'
                    )}
                />
                <Moon
                    className={cn(
                        'absolute h-4 w-4 text-slate-600 transition-all duration-300 dark:text-slate-400',
                        isDark ? 'scale-50 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
                    )}
                />
            </button>
            {pageRipple && (
                <span
                    key={pageRipple.key}
                    className="theme-page-ripple pointer-events-none fixed z-[9999] aspect-square w-[220vmax] rounded-full"
                    style={{ left: pageRipple.x, top: pageRipple.y, backgroundColor: pageRipple.color }}
                />
            )}
        </>
    )
}
