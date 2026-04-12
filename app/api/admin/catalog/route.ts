/**
 * GET /api/admin/catalog
 *
 * Returns all models in the system catalog, grouped by category (4w / 2w / 3w).
 * Reads from static JSON files — no auth required, no dealer-specific data.
 *
 * Response: { models: CatalogModel[] }
 */
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

// ── helpers ───────────────────────────────────────────────────────────────────

function modelToSlug(s: string): string {
    return s.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const SUPABASE_IMG =
    'https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/vehicle-images'

// ── 4W ───────────────────────────────────────────────────────────────────────

const FOUR_W_BRANDS: Array<{ make: string; jsonKey: string; brandId: string }> = [
    { make: 'Tata Motors',    jsonKey: 'tata',              brandId: 'tata'          },
    { make: 'Maruti Suzuki',  jsonKey: 'maruti_suzuki',     brandId: 'maruti-suzuki' },
    { make: 'Hyundai',        jsonKey: 'hyundai',           brandId: 'hyundai'       },
    { make: 'Honda',          jsonKey: 'honda',             brandId: 'honda'         },
    { make: 'Mahindra',       jsonKey: 'mahindra',          brandId: 'mahindra'      },
    { make: 'Kia',            jsonKey: 'kia',               brandId: 'kia'           },
    { make: 'Toyota',         jsonKey: 'toyota',            brandId: 'toyota'        },
    { make: 'Volkswagen',     jsonKey: 'volkswagen',        brandId: 'volkswagen'    },
    { make: 'Skoda',          jsonKey: 'skoda',             brandId: 'skoda'         },
    { make: 'MG',             jsonKey: 'mg',                brandId: 'mg'            },
    { make: 'Renault',        jsonKey: 'renault',           brandId: 'renault'       },
    { make: 'Nissan',         jsonKey: 'nissan',            brandId: 'nissan'        },
    { make: 'Jeep',           jsonKey: 'jeep',              brandId: 'jeep'          },
    { make: 'Citroen',        jsonKey: 'citroen',           brandId: 'citroen'       },
    { make: 'BYD',            jsonKey: 'byd',               brandId: 'byd'           },
    { make: 'Force Motors',   jsonKey: 'force',             brandId: 'force-motors'  },
    { make: 'Isuzu',          jsonKey: 'isuzu',             brandId: 'isuzu'         },
    { make: 'VinFast',        jsonKey: 'vinfast',           brandId: 'vinfast'       },
    { make: 'BMW',            jsonKey: 'bmw',               brandId: 'bmw'           },
    { make: 'Audi',           jsonKey: 'audi',              brandId: 'audi'          },
    { make: 'Mercedes-Benz',  jsonKey: 'mercedes',          brandId: 'mercedes-benz' },
    { make: 'Porsche',        jsonKey: 'porsche',           brandId: 'porsche'       },
    { make: 'Lamborghini',    jsonKey: 'lamborghini',       brandId: 'lamborghini'   },
    { make: 'Ferrari',        jsonKey: 'ferrari',           brandId: 'ferrari'       },
    { make: 'Land Rover',     jsonKey: 'land_rover',        brandId: 'land-rover'    },
    { make: 'Jaguar',         jsonKey: 'jaguar',            brandId: 'jaguar'        },
    { make: 'Lexus',          jsonKey: 'lexus',             brandId: 'lexus'         },
    { make: 'Volvo',          jsonKey: 'volvo',             brandId: 'volvo'         },
    { make: 'Mini',           jsonKey: 'mini',              brandId: 'mini'          },
    { make: 'Aston Martin',   jsonKey: 'aston_martin',      brandId: 'aston-martin'  },
    { make: 'Bentley',        jsonKey: 'bentley',           brandId: 'bentley'       },
    { make: 'Maserati',       jsonKey: 'maserati',          brandId: 'maserati'      },
    { make: 'Rolls-Royce',    jsonKey: 'rolls_royce',       brandId: 'rolls-royce'   },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getImg(imgUrls: unknown): string | null {
    if (!Array.isArray(imgUrls)) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = (imgUrls as any[]).find(
        (x) => typeof x?.value === 'string' && x.value.startsWith('http')
    )
    return u?.value ?? null
}

function load4WModels(): CatalogModel[] {
    const result: CatalogModel[] = []
    const dataDir = path.join(process.cwd(), 'public', 'data')

    for (const { make, jsonKey, brandId } of FOUR_W_BRANDS) {
        const filePath = path.join(dataDir, `${jsonKey}.json`)
        if (!fs.existsSync(filePath)) continue

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const raw: any = JSON.parse(fs.readFileSync(filePath, 'utf8'))
            const seen = new Set<string>()

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function walk(node: any, ctxModel?: string, ctxPrice?: string, ctxFuel?: string): void {
                if (!node || typeof node !== 'object') return
                if (Array.isArray(node)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    node.forEach((n: any) => walk(n, ctxModel, ctxPrice, ctxFuel))
                    return
                }
                const model: string | undefined = node.model || node.model_name || ctxModel
                const imgUrl = getImg(node.image_urls)
                const price: string | undefined =
                    node.ex_showroom_price ||
                    node.ex_showroom_price_min_inr ||
                    ctxPrice
                const fuel: string | undefined = node.fuel_type || ctxFuel

                if (model && imgUrl && !seen.has(model.toLowerCase())) {
                    seen.add(model.toLowerCase())
                    result.push({
                        id: `4w-${brandId}-${modelToSlug(model)}`,
                        brand: make,
                        brandId,
                        model,
                        imageUrl: imgUrl,
                        price: price ? String(price) : null,
                        fuelType: fuel ?? null,
                        category: '4w',
                    })
                }
                for (const [k, v] of Object.entries(node)) {
                    if (k === 'image_urls') continue
                    if (v && typeof v === 'object')
                        walk(v, model ?? ctxModel, price ?? ctxPrice, fuel ?? ctxFuel)
                }
            }

            walk(raw)

            // Fallback for Maruti-style flat arrays — extract model name from image URL path
            if (!result.some((m) => m.brand === make)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                function collectFromUrl(node: any): void {
                    if (!node || typeof node !== 'object') return
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (Array.isArray(node)) { node.forEach((n: any) => collectFromUrl(n)); return }
                    const imgUrl = getImg(node.image_urls)
                    if (imgUrl) {
                        const m = imgUrl.match(/\/([A-Z][^/]+)\/\d{4,}\//)
                        if (m) {
                            const model = m[1].replace(/-/g, ' ')
                            const key = model.toLowerCase()
                            if (!seen.has(key)) {
                                seen.add(key)
                                result.push({
                                    id: `4w-${brandId}-${modelToSlug(model)}`,
                                    brand: make,
                                    brandId,
                                    model,
                                    imageUrl: imgUrl,
                                    price: (node.ex_showroom_price as string | null) ?? null,
                                    fuelType: (node.fuel_type as string | null) ?? null,
                                    category: '4w',
                                })
                            }
                        }
                    }
                    for (const [k, v] of Object.entries(node)) {
                        if (k === 'image_urls') continue
                        if (v && typeof v === 'object') collectFromUrl(v)
                    }
                }
                collectFromUrl(raw)
            }
        } catch {
            // skip bad files
        }
    }

    return result
}

// ── 2W ───────────────────────────────────────────────────────────────────────

function load2WModels(): CatalogModel[] {
    const result: CatalogModel[] = []
    const dir = path.join(process.cwd(), 'public', 'data', '2w')
    if (!fs.existsSync(dir)) return result

    for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.json')) continue
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const d: any = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
            const brand: string = d.brand ?? ''
            const brandId: string = d.brandId ?? file.replace('.json', '')
            const vehicles: unknown[] = d.vehicles ?? []

            for (const v of vehicles) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const veh = v as any
                const model: string = veh.model ?? ''
                if (!model) continue
                const slug = modelToSlug(model)
                result.push({
                    id: `2w-${brandId}-${slug}`,
                    brand,
                    brandId,
                    model,
                    imageUrl: `${SUPABASE_IMG}/2w/${brandId}/${slug}.jpg`,
                    price: veh.price ?? null,
                    fuelType: veh.fuel_type ?? null,
                    category: '2w',
                })
            }
        } catch {
            // skip bad file
        }
    }

    return result
}

// ── 3W ───────────────────────────────────────────────────────────────────────

function load3WModels(): CatalogModel[] {
    const result: CatalogModel[] = []
    const dir = path.join(process.cwd(), 'public', 'data', '3w')
    if (!fs.existsSync(dir)) return result

    for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.json')) continue
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const d: any = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
            const brand: string = d.brand ?? ''
            const brandId: string = d.brandId ?? file.replace('.json', '')
            const vehicles: unknown[] = d.vehicles ?? []

            // Dedupe variants → unique model names (strip fuel suffix after "/")
            const seen = new Set<string>()
            for (const v of vehicles) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const veh = v as any
                const rawName: string = veh.variant_name ?? veh.model ?? ''
                if (!rawName) continue
                // "RE Compact 4S/Petrol" → model = "RE Compact 4S"
                const model = rawName.split('/')[0].trim()
                if (seen.has(model.toLowerCase())) continue
                seen.add(model.toLowerCase())
                const slug = modelToSlug(model)
                result.push({
                    id: `3w-${brandId}-${slug}`,
                    brand,
                    brandId,
                    model,
                    imageUrl: `${SUPABASE_IMG}/3w/${brandId}/${slug}.jpg`,
                    price: veh.ex_showroom_price ?? null,
                    fuelType: null,
                    category: '3w',
                })
            }
        } catch {
            // skip bad file
        }
    }

    return result
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET() {
    const models = [
        ...load4WModels(),
        ...load2WModels(),
        ...load3WModels(),
    ]
    return NextResponse.json({ models })
}
