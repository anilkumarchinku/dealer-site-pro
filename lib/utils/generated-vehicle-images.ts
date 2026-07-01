import { brandNameToId, getVehicleImageUrls } from '@/lib/utils/brand-model-images'

export type GeneratedVehicleCategory = '2w' | '3w'

export function resolveGeneratedVehicleImage(
    category: GeneratedVehicleCategory,
    brand: string,
    model: string,
    images: readonly (string | null | undefined)[] = [],
): string | null {
    const primaryImage = images.find(Boolean) ?? null
    return getVehicleImageUrls(
        category,
        brandNameToId(brand, category),
        model,
        primaryImage,
    )[0] ?? null
}
