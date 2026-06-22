/** Shared type for admin catalog page + API route */
export type CatalogCategory = '4w' | '2w' | '3w'

export interface CatalogBrand {
    brand: string
    brandId: string
    logoId?: string | null
    category: CatalogCategory
    modelCount: number
}

export interface CatalogModel {
    id: string
    brand: string
    brandId: string
    logoId?: string | null
    model: string
    imageUrl: string | null
    price: string | null
    fuelType: string | null
    category: CatalogCategory
}
