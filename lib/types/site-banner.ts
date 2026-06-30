export interface SiteBanner {
    id: string
    title: string | null
    site_slug: string | null
    desktop_image_url: string
    mobile_image_url: string | null
    sort_order: number
    created_at: string
}
