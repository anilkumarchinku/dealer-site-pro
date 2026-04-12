/**
 * /dashboard/catalog — Server component.
 * Reads brand JSON files at build/request time (no client fetch needed).
 * Passes all models to CatalogClient which handles tabs + search.
 */
import fs from 'fs'
import path from 'path'
import { CatalogClient } from './CatalogClient'
import type { CatalogModel } from '@/lib/types/catalog'

// ── helpers ────────────────────────────────────────────────────────────────

function slug(s: string) {
    return s.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getImg(imgUrls: unknown): string | null {
    if (!Array.isArray(imgUrls)) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = (imgUrls as any[]).find((x) => typeof x?.value === 'string' && x.value.startsWith('http'))
    return u?.value ?? null
}

// ── 4W ────────────────────────────────────────────────────────────────────

const FOUR_W = [
    { make: 'Tata Motors',   json: 'tata',          id: 'tata'          },
    { make: 'Maruti Suzuki', json: 'maruti_suzuki',  id: 'maruti-suzuki' },
    { make: 'Hyundai',       json: 'hyundai',        id: 'hyundai'       },
    { make: 'Honda',         json: 'honda',          id: 'honda'         },
    { make: 'Mahindra',      json: 'mahindra',       id: 'mahindra'      },
    { make: 'Kia',           json: 'kia',            id: 'kia'           },
    { make: 'Toyota',        json: 'toyota',         id: 'toyota'        },
    { make: 'Volkswagen',    json: 'volkswagen',     id: 'volkswagen'    },
    { make: 'Skoda',         json: 'skoda',          id: 'skoda'         },
    { make: 'MG',            json: 'mg',             id: 'mg'            },
    { make: 'Renault',       json: 'renault',        id: 'renault'       },
    { make: 'Nissan',        json: 'nissan',         id: 'nissan'        },
    { make: 'Jeep',          json: 'jeep',           id: 'jeep'          },
    { make: 'Citroen',       json: 'citroen',        id: 'citroen'       },
    { make: 'BYD',           json: 'byd',            id: 'byd'           },
    { make: 'Force Motors',  json: 'force',          id: 'force-motors'  },
    { make: 'Isuzu',         json: 'isuzu',          id: 'isuzu'         },
    { make: 'VinFast',       json: 'vinfast',        id: 'vinfast'       },
    { make: 'BMW',           json: 'bmw',            id: 'bmw'           },
    { make: 'Audi',          json: 'audi',           id: 'audi'          },
    { make: 'Mercedes-Benz', json: 'mercedes',       id: 'mercedes-benz' },
    { make: 'Porsche',       json: 'porsche',        id: 'porsche'       },
    { make: 'Lamborghini',   json: 'lamborghini',    id: 'lamborghini'   },
    { make: 'Ferrari',       json: 'ferrari',        id: 'ferrari'       },
    { make: 'Land Rover',    json: 'land_rover',     id: 'land-rover'    },
    { make: 'Jaguar',        json: 'jaguar',         id: 'jaguar'        },
    { make: 'Lexus',         json: 'lexus',          id: 'lexus'         },
    { make: 'Volvo',         json: 'volvo',          id: 'volvo'         },
    { make: 'Mini',          json: 'mini',           id: 'mini'          },
    { make: 'Aston Martin',  json: 'aston_martin',   id: 'aston-martin'  },
    { make: 'Bentley',       json: 'bentley',        id: 'bentley'       },
    { make: 'Maserati',      json: 'maserati',       id: 'maserati'      },
    { make: 'Rolls-Royce',   json: 'rolls_royce',    id: 'rolls-royce'   },
]

function load4W(dataDir: string): CatalogModel[] {
    const result: CatalogModel[] = []
    for (const { make, json, id } of FOUR_W) {
        const file = path.join(dataDir, `${json}.json`)
        if (!fs.existsSync(file)) continue
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const raw: any = JSON.parse(fs.readFileSync(file, 'utf8'))
            const seen = new Set<string>()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function walk(node: any, ctxModel?: string, ctxPrice?: string, ctxFuel?: string): void {
                if (!node || typeof node !== 'object') return
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (Array.isArray(node)) { node.forEach((n: any) => walk(n, ctxModel, ctxPrice, ctxFuel)); return }
                const model: string | undefined = node.model || node.model_name || ctxModel
                const imgUrl = getImg(node.image_urls)
                const price  = node.ex_showroom_price || node.ex_showroom_price_min_inr || ctxPrice
                const fuel   = node.fuel_type || ctxFuel
                if (model && imgUrl && !seen.has(model.toLowerCase())) {
                    seen.add(model.toLowerCase())
                    result.push({ id: `4w-${id}-${slug(model)}`, brand: make, brandId: id, model, imageUrl: imgUrl, price: price ? String(price) : null, fuelType: fuel ?? null, category: '4w' })
                }
                for (const [k, v] of Object.entries(node)) {
                    if (k === 'image_urls') continue
                    if (v && typeof v === 'object') walk(v, model ?? ctxModel, price ?? ctxPrice, fuel ?? ctxFuel)
                }
            }
            walk(raw)
            // Maruti-style: extract model from image URL path
            if (!result.some((m) => m.brand === make)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                function urlWalk(node: any): void {
                    if (!node || typeof node !== 'object') return
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (Array.isArray(node)) { node.forEach((n: any) => urlWalk(n)); return }
                    const imgUrl = getImg(node.image_urls)
                    if (imgUrl) {
                        const m = imgUrl.match(/\/([A-Z][^/]+)\/\d{4,}\//)
                        if (m) {
                            const model = m[1].replace(/-/g, ' ')
                            if (!seen.has(model.toLowerCase())) {
                                seen.add(model.toLowerCase())
                                result.push({ id: `4w-${id}-${slug(model)}`, brand: make, brandId: id, model, imageUrl: imgUrl, price: node.ex_showroom_price ?? null, fuelType: node.fuel_type ?? null, category: '4w' })
                            }
                        }
                    }
                    for (const [k, v] of Object.entries(node)) { if (k === 'image_urls') continue; if (v && typeof v === 'object') urlWalk(v) }
                }
                urlWalk(raw)
            }
        } catch { /* skip */ }
    }
    return result
}

/** Resolves a local downloaded image for 2W or 3W, returns null if not found */
function localImg(category: '2w' | '3w', brandId: string, modelSlug: string): string | null {
    const base = path.join(process.cwd(), 'public', 'data', 'brand-model-images', category, brandId, modelSlug)
    for (const ext of ['.jpg', '.png']) {
        if (fs.existsSync(base + ext)) return `/data/brand-model-images/${category}/${brandId}/${modelSlug}${ext}`
    }
    return null
}

function load2W(dir: string): CatalogModel[] {
    const result: CatalogModel[] = []
    if (!fs.existsSync(dir)) return result
    for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.json')) continue
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const d: any = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
            const brand = d.brand ?? ''; const brandId = d.brandId ?? file.replace('.json', '')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const v of (d.vehicles ?? []) as any[]) {
                const model: string = v.model ?? ''; if (!model) continue
                const s = slug(model)
                // Use local downloaded image — same source as CardDekho/BikeWale (already downloaded)
                const imageUrl = localImg('2w', brandId, s)
                result.push({ id: `2w-${brandId}-${s}`, brand, brandId, model, imageUrl, price: v.price ?? null, fuelType: v.fuel_type ?? null, category: '2w' })
            }
        } catch { /* skip */ }
    }
    return result
}

function load3W(dir: string): CatalogModel[] {
    const result: CatalogModel[] = []
    if (!fs.existsSync(dir)) return result
    for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.json')) continue
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const d: any = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
            const brand = d.brand ?? ''; const brandId = d.brandId ?? file.replace('.json', '')
            const seen = new Set<string>()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const v of (d.vehicles ?? []) as any[]) {
                const model = (v.variant_name ?? v.model ?? '').split('/')[0].trim()
                if (!model || seen.has(model.toLowerCase())) continue
                seen.add(model.toLowerCase())
                const s = slug(model)
                const imageUrl = localImg('3w', brandId, s)
                result.push({ id: `3w-${brandId}-${s}`, brand, brandId, model, imageUrl, price: v.ex_showroom_price ?? null, fuelType: null, category: '3w' })
            }
        } catch { /* skip */ }
    }
    return result
}

// ── Page (Server Component) ────────────────────────────────────────────────

export default function CatalogPage() {
    const dataDir = path.join(process.cwd(), 'public', 'data')
    const models: CatalogModel[] = [
        ...load4W(dataDir),
        ...load2W(path.join(dataDir, '2w')),
        ...load3W(path.join(dataDir, '3w')),
    ]
    return <CatalogClient models={models} />
}
