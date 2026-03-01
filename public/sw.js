/**
 * DealerSite Pro — Service Worker
 * Provides offline support for the dealer dashboard.
 *
 * Strategy:
 *   - App Shell (dashboard routes, fonts, icons): Cache-First
 *   - API calls (/api/*): Network-First with offline fallback
 *   - Dealer site pages (/sites/*): Network-First
 */

const CACHE_NAME = 'dsp-v1';
const OFFLINE_URL = '/dashboard';

// App shell assets to pre-cache on install
const PRECACHE_ASSETS = [
    '/',
    '/dashboard',
    '/favicon.svg',
    '/manifest.json',
];

// ── Install: pre-cache shell ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
    );
    self.skipWaiting();
});

// ── Activate: clean old caches ────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// ── Fetch: routing strategy ───────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET, cross-origin, and chrome-extension requests
    if (request.method !== 'GET') return;
    if (url.origin !== location.origin) return;

    // API calls — Network-First (critical data, no stale responses)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request).catch(() => new Response(
                JSON.stringify({ error: 'You are offline' }),
                { status: 503, headers: { 'Content-Type': 'application/json' } }
            ))
        );
        return;
    }

    // Next.js static assets (_next/*) — Cache-First
    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(
            caches.match(request).then(cached => cached || fetch(request).then(res => {
                const clone = res.clone();
                caches.open(CACHE_NAME).then(c => c.put(request, clone));
                return res;
            }))
        );
        return;
    }

    // Dashboard pages — Network-First with cache fallback
    if (url.pathname.startsWith('/dashboard')) {
        event.respondWith(
            fetch(request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(request, clone));
                    return res;
                })
                .catch(() => caches.match(request).then(cached => cached || caches.match(OFFLINE_URL)))
        );
        return;
    }
});

// ── Push Notifications (future) ───────────────────────────────────────────────
self.addEventListener('push', (event) => {
    if (!event.data) return;
    const { title, body, icon } = event.data.json();
    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            icon: icon || '/favicon.svg',
            badge: '/favicon.svg',
        })
    );
});
