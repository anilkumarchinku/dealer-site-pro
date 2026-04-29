import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/utils/admin-session";
import { brandNameToId, getScrapedImageUrls, modelToSlug } from "@/lib/utils/brand-model-images";

type BrandModelsPayload = {
    twoWheelers?: Record<string, Array<{ brand?: string; brandId?: string; models?: Record<string, string[]> | string[] }>>
    threeWheelers?: Array<{ brand?: string; brandId?: string; models?: Record<string, string[]> | string[] }>
}

type BrandGroup = {
    brand?: string
    brandId?: string
    models?: Record<string, string[]> | string[]
}

async function fetchJson<T>(origin: string, pathname: string): Promise<T | null> {
    try {
        const response = await fetch(`${origin}${pathname}`, { cache: 'no-store' })
        if (!response.ok) return null
        return await response.json() as T
    } catch {
        return null
    }
}

async function resolveLiveImage(origin: string, urls: string[]): Promise<string | null> {
    for (const rawUrl of urls) {
        const absoluteUrl = rawUrl.startsWith('http') ? rawUrl : `${origin}${rawUrl}`

        try {
            const response = await fetch(absoluteUrl, {
                method: 'HEAD',
                cache: 'no-store',
            })

            if (response.ok) return rawUrl
        } catch {
            continue
        }
    }

    return null
}

async function auditBrandGroup(
    vehicleType: "2w" | "3w",
    brandGroup: BrandGroup,
    checkModel: (vehicleType: "2w" | "3w", brandId: string, model: string, originalBrand: string) => Promise<void>,
) {
    const originalBrand = brandGroup.brand ?? ''
    const brandId = brandNameToId(brandGroup.brandId || originalBrand, vehicleType)
    const modelsObj = brandGroup.models

    if (Array.isArray(modelsObj)) {
        for (const model of modelsObj) {
            await checkModel(vehicleType, brandId, model, originalBrand)
        }
        return
    }

    if (modelsObj && typeof modelsObj === 'object') {
        for (const models of Object.values(modelsObj)) {
            if (!Array.isArray(models)) continue
            for (const model of models) {
                await checkModel(vehicleType, brandId, model, originalBrand)
            }
        }
    }
}

export async function GET(request: Request) {
    const { errorResponse } = await requireAdminSession()
    if (errorResponse) return errorResponse

    try {
        const origin = new URL(request.url).origin
        const data = await fetchJson<BrandModelsPayload>(origin, '/data/brand-models.json')

        if (!data) {
            return NextResponse.json({ error: "brand-models.json not found" }, { status: 404 })
        }

        let total = 0
        let missing = 0
        const auditList: Array<{
            type: string
            brandId: string
            originalBrand: string
            model: string
            slug: string
            isMissing: boolean
            imageUrl: string | null
        }> = []

        async function checkModel(vehicleType: "2w" | "3w", brandId: string, model: string, originalBrand: string) {
            total++
            const slug = modelToSlug(model)
            const imageUrl = await resolveLiveImage(origin, getScrapedImageUrls(vehicleType, brandId, model))
            const isMissing = !imageUrl

            if (isMissing) missing++

            auditList.push({
                type: vehicleType,
                brandId,
                originalBrand,
                model,
                slug,
                isMissing,
                imageUrl,
            })
        }

        if (data.twoWheelers) {
            for (const brands of Object.values(data.twoWheelers)) {
                for (const brandGroup of brands) {
                    await auditBrandGroup("2w", brandGroup, checkModel)
                }
            }
        }

        if (Array.isArray(data.threeWheelers)) {
            for (const brandGroup of data.threeWheelers) {
                await auditBrandGroup("3w", brandGroup, checkModel)
            }
        }

        return NextResponse.json({
            stats: { total, missing, present: total - missing },
            models: auditList,
        })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }
}
