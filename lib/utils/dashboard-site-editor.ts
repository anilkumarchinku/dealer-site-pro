export type DashboardEditorVehicleLabel = '2W' | '3W' | '4W'
export type DashboardEditorStockLabel = 'New' | 'Used' | 'All'

export interface DashboardSiteEditorTarget {
    rootSlug: string
    brandSlug: string | null
    brandLabel: string | null
    vehicleLabel: DashboardEditorVehicleLabel
    stockLabel: DashboardEditorStockLabel
    pageLabel: string
}

function titleCaseSlug(slug: string): string {
    return slug
        .split('-')
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

export function parseDashboardSiteEditorTarget(siteSlug: string, dealerSlug?: string | null): DashboardSiteEditorTarget {
    const [rootSlug = '', ...pathParts] = siteSlug
        .trim()
        .replace(/^\/+|\/+$/g, '')
        .split('/')
        .filter(Boolean)

    const normalizedDealerSlug = dealerSlug?.trim() || ''
    const isDealerUsedSlug = normalizedDealerSlug
        ? rootSlug === `${normalizedDealerSlug}-used`
        : rootSlug.endsWith('-used')

    let brandSlug: string | null = null
    if (normalizedDealerSlug && rootSlug.startsWith(`${normalizedDealerSlug}-`) && !isDealerUsedSlug) {
        const suffix = rootSlug.slice(normalizedDealerSlug.length + 1)
        brandSlug = suffix || null
    }

    const vehicleLabel: DashboardEditorVehicleLabel = pathParts.includes('two-wheelers')
        ? '2W'
        : pathParts.includes('three-wheelers')
            ? '3W'
            : '4W'

    const stockLabel: DashboardEditorStockLabel = isDealerUsedSlug || pathParts.includes('used')
        ? 'Used'
        : pathParts.includes('new')
            ? 'New'
            : 'All'

    const brandLabel = brandSlug ? titleCaseSlug(brandSlug) : null
    const pageLabel = [
        brandLabel,
        stockLabel === 'All' ? vehicleLabel : `${stockLabel} ${vehicleLabel}`,
    ].filter(Boolean).join(' / ')

    return {
        rootSlug,
        brandSlug,
        brandLabel,
        vehicleLabel,
        stockLabel,
        pageLabel,
    }
}
