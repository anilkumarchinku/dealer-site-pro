/**
 * PWAProvider
 * Registers the service worker on mount.
 * Renders nothing — purely a side-effect component.
 */

'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

export function PWAProvider() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        if (process.env.NODE_ENV !== 'production') {
            navigator.serviceWorker.getRegistrations()
                .then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
                .catch(err => {
                    logger.warn('[SW] Development cleanup failed:', err);
                });

            if ('caches' in window) {
                caches.keys()
                    .then(keys => Promise.all(keys.map(key => caches.delete(key))))
                    .catch(err => {
                        logger.warn('[SW] Cache cleanup failed:', err);
                    });
            }

            return;
        }

        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then(reg => {
                logger.log('[SW] Registered:', reg.scope);
            })
            .catch(err => {
                logger.warn('[SW] Registration failed:', err);
            });
    }, []);

    return null;
}
