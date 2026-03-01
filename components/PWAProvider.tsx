/**
 * PWAProvider
 * Registers the service worker on mount.
 * Renders nothing — purely a side-effect component.
 */

'use client';

import { useEffect } from 'react';

export function PWAProvider() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js', { scope: '/' })
                .then(reg => {
                    console.log('[SW] Registered:', reg.scope);
                })
                .catch(err => {
                    console.warn('[SW] Registration failed:', err);
                });
        }
    }, []);

    return null;
}
