/**
 * GET /api/bikes/colors?brand=tvs-motor&model=apache-rr-310
 * Returns color images for a 2W model from local 2w-colors gallery.
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
    const sp = req.nextUrl.searchParams
    const brandId = sp.get('brand')
    const modelSlug = sp.get('model')

    if (!brandId || !modelSlug) {
        return NextResponse.json({ success: false, error: 'brand and model params required' }, { status: 400 })
    }

    const metaPath = path.join(process.cwd(), 'public', 'data', 'brand-model-images', '2w-colors', brandId, modelSlug, 'metadata.json')

    try {
        if (!fs.existsSync(metaPath)) {
            return NextResponse.json({ success: true, colors: [] })
        }

        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
        const colors = (meta.colors ?? []).map((c: { name: string; image: string }) => ({
            name: c.name,
            image: c.image,
        }))

        return NextResponse.json({
            success: true,
            hero: meta.hero ?? null,
            colors,
        })
    } catch {
        return NextResponse.json({ success: true, colors: [] })
    }
}
