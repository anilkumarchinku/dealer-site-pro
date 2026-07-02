import { brandToUrlSlug } from '@/lib/utils/domain'

export interface DashboardSiteCard {
    /** Source dealer row when dashboard cards are built from multiple dealers */
    dealerId?: string
    /** Display dealer name when the card belongs to a non-active dealer */
    dealerName?: string
    /** Full URL slug, e.g. "abhi-motors-tata" or "abhi-motors/two-wheelers/used" */
    slug: string
    /** Brand name for brand-specific pages, or null for stock-type pages */
    brand: string | null
    /** Display label shown on the card */
    label: string
    /** True for pre-owned / used stock pages */
    isUsed?: boolean
    /** Override preview iframe path */
    previewPath?: string
    /** Show the label in the title even when there is only one card */
    showLabel?: boolean
}

export interface DashboardSiteCardInput {
    slug: string
    dealerName: string
    carBrands: string[]
    twoWheelerBrands: string[]
    threeWheelerBrands: string[]
    isNew: boolean
    isUsed: boolean
    vehicleType: string
    has2W: boolean
    has3W: boolean
    has4W: boolean
}

function pathCard(slug: string, label: string, isUsed = false): DashboardSiteCard {
    return {
        slug,
        brand: null,
        label,
        isUsed,
        previewPath: `/sites/${slug}`,
        showLabel: true,
    }
}

function buildNewSegmentCards(
    slug: string,
    brands: string[],
    segmentPath: 'two-wheelers' | 'three-wheelers',
    segmentLabel: '2W' | '3W'
): DashboardSiteCard[] {
    if (brands.length === 0) {
        return [pathCard(`${slug}/${segmentPath}/new`, `New ${segmentLabel}`)]
    }

    return brands.map(brand => {
        const brandSiteSlug = `${slug}-${brandToUrlSlug(brand)}/${segmentPath}/new`
        return {
            slug: brandSiteSlug,
            brand,
            label: `${brand} ${segmentLabel}`,
            previewPath: `/sites/${brandSiteSlug}`,
            showLabel: true,
        }
    })
}

function build2WCards(slug: string, brands: string[], isNew: boolean, isUsed: boolean): DashboardSiteCard[] {
    const cards: DashboardSiteCard[] = []
    if (isNew) cards.push(...buildNewSegmentCards(slug, brands, 'two-wheelers', '2W'))
    if (isUsed) cards.push(pathCard(`${slug}/two-wheelers/used`, 'Used 2W', true))
    if (cards.length === 0) cards.push(pathCard(`${slug}/two-wheelers`, '2W Webpage'))
    return cards
}

function build3WCards(slug: string, brands: string[], isNew: boolean, isUsed: boolean): DashboardSiteCard[] {
    const cards: DashboardSiteCard[] = []
    if (isNew) cards.push(...buildNewSegmentCards(slug, brands, 'three-wheelers', '3W'))
    if (isUsed) cards.push(pathCard(`${slug}/three-wheelers/used`, 'Used 3W', true))
    if (cards.length === 0) cards.push(pathCard(`${slug}/three-wheelers`, '3W Webpage'))
    return cards
}

function buildCarCards(slug: string, brands: string[], isNew: boolean, isUsed: boolean, name: string): DashboardSiteCard[] {
    const isHybrid = isNew && isUsed
    if (isUsed && !isNew) {
        return [{ slug, brand: null, label: 'Pre-Owned Cars', isUsed: true, showLabel: true }]
    }
    if (brands.length === 0 && !isHybrid) {
        return [{ slug, brand: null, label: name || 'My Site' }]
    }
    if (isHybrid) {
        const brandCards: DashboardSiteCard[] = brands.length > 0
            ? brands.map(brand => ({ slug: `${slug}-${brandToUrlSlug(brand)}`, brand, label: brand, showLabel: true }))
            : [{ slug, brand: null, label: name || 'New Cars', showLabel: true }]
        return [...brandCards, { slug: `${slug}-used`, brand: null, label: 'Pre-Owned Cars', isUsed: true, showLabel: true }]
    }
    return brands.map(brand => ({ slug: `${slug}-${brandToUrlSlug(brand)}`, brand, label: brand, showLabel: true }))
}

export function buildDashboardSiteCards(input: DashboardSiteCardInput): DashboardSiteCard[] {
    const {
        slug,
        dealerName,
        carBrands,
        twoWheelerBrands,
        threeWheelerBrands,
        isNew,
        isUsed,
        vehicleType,
        has2W,
        has3W,
        has4W,
    } = input

    const effectiveHasCars = vehicleType === 'car' || has4W
    const effectiveHas2W = vehicleType === 'two-wheeler' || has2W
    const effectiveHas3W = vehicleType === 'three-wheeler' || has3W

    const cards: DashboardSiteCard[] = []
    if (effectiveHas2W) cards.push(...build2WCards(slug, twoWheelerBrands, isNew, isUsed))
    if (effectiveHas3W) cards.push(...build3WCards(slug, threeWheelerBrands, isNew, isUsed))
    if (effectiveHasCars) cards.push(...buildCarCards(slug, carBrands, isNew, isUsed, dealerName))

    if (cards.length > 0) return cards
    return buildCarCards(slug, carBrands, isNew, isUsed, dealerName)
}
