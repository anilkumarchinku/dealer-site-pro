/**
 * LanguageToggle
 * EN / हिंदी switcher for dealer site navbars.
 * Persists selection to localStorage.
 */

'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/translations';

const LS_KEY = 'dsp-locale';

interface LanguageToggleProps {
    locale: Locale;
    onChange: (locale: Locale) => void;
    /** 'light' = dark text buttons (for light navbars), 'dark' = white text (for dark navbars) */
    variant?: 'light' | 'dark';
}

export function LanguageToggle({ locale, onChange, variant = 'light' }: LanguageToggleProps) {
    const containerClass = variant === 'dark'
        ? 'bg-white/15 backdrop-blur-sm'
        : 'bg-gray-100 border border-gray-200';
    const activeClass = variant === 'dark'
        ? 'bg-white text-gray-900 shadow-sm'
        : 'bg-white text-gray-900 shadow-sm border border-gray-200';
    const inactiveClass = variant === 'dark'
        ? 'text-white/70 hover:text-white'
        : 'text-gray-500 hover:text-gray-800';

    return (
        <div className={`flex items-center gap-0.5 rounded-lg p-0.5 text-xs font-semibold ${containerClass}`}>
            <button
                onClick={() => onChange('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${locale === 'en' ? activeClass : inactiveClass}`}
            >
                EN
            </button>
            <button
                onClick={() => onChange('hi')}
                className={`px-2.5 py-1 rounded-md transition-all ${locale === 'hi' ? activeClass : inactiveClass}`}
            >
                हिंदी
            </button>
        </div>
    );
}

/** Hook that initialises locale from localStorage and persists changes */
export function useLocale(): [Locale, (l: Locale) => void] {
    const [locale, setLocaleState] = useState<Locale>('en');

    useEffect(() => {
        const saved = localStorage.getItem(LS_KEY) as Locale | null;
        if (saved === 'hi') setLocaleState('hi');
    }, []);

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        localStorage.setItem(LS_KEY, l);
    };

    return [locale, setLocale];
}
