'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    toggleTheme: () => {},
    setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light')

    // On mount: read from localStorage, fall back to system preference
    useEffect(() => {
        const stored = localStorage.getItem('dealer-theme') as Theme | null
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light')
        applyTheme(initial)
        setThemeState(initial)
    }, [])

    function applyTheme(next: Theme) {
        const root = document.documentElement
        if (next === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('dealer-theme', next)
    }

    function setTheme(next: Theme) {
        applyTheme(next)
        setThemeState(next)
    }

    function toggleTheme() {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
