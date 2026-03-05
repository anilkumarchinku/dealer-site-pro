"use client"

import { useEffect, useState } from "react"

/**
 * Returns the correct path prefix for dealer site links.
 *
 * On the main domain (indrav.in / localhost / vercel.app):
 *   returns "/sites/{slug}"  → links become "/sites/bhai-bhaii/two-wheelers/..."
 *
 * On a subdomain (bhai-bhaii.indrav.in) or custom domain:
 *   returns ""               → links become "/two-wheelers/..."
 *   (the middleware already injects the slug when rewriting the path)
 */
export function useSitePrefix(slug: string): string {
    const [prefix, setPrefix] = useState(`/sites/${slug}`)

    useEffect(() => {
        const base = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "indrav.in"
        const h    = window.location.hostname
        const isMain =
            h === base ||
            h === `www.${base}` ||
            h.startsWith("localhost") ||
            h.endsWith(".vercel.app")
        if (!isMain) setPrefix("")
    }, [slug])

    return prefix
}
