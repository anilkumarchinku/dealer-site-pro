/** Shared type for admin catalog page + API route */
export interface CatalogModel {
    id: string
    brand: string
    brandId: string
    model: string
    imageUrl: string | null
    price: string | null
    fuelType: string | null
    category: '4w' | '2w' | '3w'
}
