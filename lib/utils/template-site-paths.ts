export type TemplateVehicleType = '2w' | '3w' | '4w' | undefined

export function templateVehiclePathSuffix(vehicleType?: TemplateVehicleType) {
    if (vehicleType === '2w') return '/two-wheelers'
    if (vehicleType === '3w') return '/three-wheelers'
    return ''
}

export function buildTemplateSiteBase(pathname: string, vehicleType?: TemplateVehicleType) {
    const suffix = templateVehiclePathSuffix(vehicleType)

    if (pathname.startsWith('/sites/')) {
        const slugPart = pathname.split('/')[2] ?? ''
        return `/sites/${slugPart}${suffix}`
    }

    // Preview/demo/generic catalog pages are not served through the dealer-domain
    // middleware, so their generic 4W detail fallback remains /cars/:id.
    if (
        pathname.startsWith('/preview') ||
        pathname.startsWith('/demo') ||
        pathname.startsWith('/cars') ||
        pathname.startsWith('/brands')
    ) {
        return suffix || '/cars'
    }

    // Live subdomain/custom-domain dealer sites are internally rewritten to
    // /sites/:slug. Public links should stay root-relative, e.g. /:id.
    return suffix
}

export function buildTemplateDetailBasePath({
    pathname,
    vehicleType,
    sellsNewCars,
    sellsUsedCars,
}: {
    pathname: string
    vehicleType?: TemplateVehicleType
    sellsNewCars: boolean
    sellsUsedCars: boolean
}) {
    const siteBase = buildTemplateSiteBase(pathname, vehicleType)
    const isUsedVehiclePage = (vehicleType === '2w' || vehicleType === '3w') &&
        sellsUsedCars &&
        !sellsNewCars &&
        pathname.includes('/used')

    return isUsedVehiclePage ? `${siteBase}/used` : siteBase
}
