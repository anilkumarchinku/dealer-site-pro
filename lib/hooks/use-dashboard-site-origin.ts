"use client"

import { useEffect, useState } from "react"
import type { DashboardSiteOrigin } from "@/lib/utils/dashboard-site-links"

export function useDashboardSiteOrigin(): DashboardSiteOrigin | null {
    const [siteOrigin, setSiteOrigin] = useState<DashboardSiteOrigin | null>(null)

    useEffect(() => {
        setSiteOrigin({
            origin: window.location.origin,
            host:   window.location.host,
        })
    }, [])

    return siteOrigin
}
