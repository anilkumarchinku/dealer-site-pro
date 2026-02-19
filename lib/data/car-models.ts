/**
 * lib/data/car-models.ts
 * Legacy CarModel type used by LeadCaptureModal.
 */

export interface CarModel {
    id: string
    brand: string
    name: string
    price: string
    imageUrl?: string
    features?: string[]
    seating?: number
    mileage?: string
    transmission?: string[]
    specs?: {
        engine?: string
        power?: string
        torque?: string
        fuel?: string
        [key: string]: string | undefined
    }
}
