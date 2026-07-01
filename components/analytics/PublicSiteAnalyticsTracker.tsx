'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface PublicSiteAnalyticsTrackerProps {
    dealerId?: string | null
}

function track(dealerId: string, eventType: 'page_view' | 'call' | 'whatsapp') {
    const payload = {
        dealerId,
        eventType,
        page: `${window.location.pathname}${window.location.search}`,
        source: document.referrer || 'direct',
    }

    const body = JSON.stringify(payload)
    if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }))
        return
    }

    fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
    }).catch(() => undefined)
}

export function PublicSiteAnalyticsTracker({ dealerId }: PublicSiteAnalyticsTrackerProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!dealerId) return
        track(dealerId, 'page_view')
    }, [dealerId, pathname, searchParams])

    useEffect(() => {
        if (!dealerId) return undefined
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null
            const anchor = target?.closest('a[href]') as HTMLAnchorElement | null
            if (!anchor) return
            const href = anchor.href.toLowerCase()
            if (href.startsWith('tel:')) track(dealerId, 'call')
            if (href.includes('wa.me') || href.includes('whatsapp')) track(dealerId, 'whatsapp')
        }

        document.addEventListener('click', handleClick, { passive: true })
        return () => document.removeEventListener('click', handleClick)
    }, [dealerId])

    return null
}
