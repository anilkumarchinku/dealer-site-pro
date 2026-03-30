/**
 * POST /api/ai/generate-description
 * Generates a compelling car listing description using Claude claude-haiku-4-5-20251001.
 * Requires ANTHROPIC_API_KEY in env.
 *
 * Body: {
 *   make: string
 *   model: string
 *   variant?: string
 *   year?: number
 *   fuel_type?: string
 *   transmission?: string
 *   color?: string
 *   mileage_km?: number
 *   condition?: string
 *   features?: string[]
 *   price_lakhs?: number
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    // Auth: only authenticated dealers can generate descriptions
    const { errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
        return NextResponse.json({ error: 'AI description generation not configured (ANTHROPIC_API_KEY missing)' }, { status: 503 })
    }

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const { make, model, variant, year, fuel_type, transmission, color, mileage_km, condition, features, price_lakhs } = body

    if (!make || !model) {
        return NextResponse.json({ error: 'make and model are required' }, { status: 400 })
    }

    const carLabel = [year, make, model, variant].filter(Boolean).join(' ')
    const conditionText = condition === 'new' ? 'brand new' : condition === 'certified_pre_owned' ? 'certified pre-owned' : 'used'
    const featuresText = features?.length ? `Key features: ${features.join(', ')}.` : ''
    const priceText = price_lakhs ? `Priced at ₹${price_lakhs} lakhs.` : ''
    const mileageText = mileage_km && condition !== 'new' ? `${mileage_km.toLocaleString()} km driven.` : ''

    const prompt = `You are a professional automotive copywriter for an Indian car dealership. Write a compelling, enthusiastic 2-3 sentence car listing description in English for the following vehicle. Be specific, highlight benefits to the buyer, and end with a light call-to-action. Do NOT use asterisks, markdown, or bullet points — plain prose only.

Car details:
- Name: ${carLabel}
- Condition: ${conditionText}
${fuel_type ? `- Fuel: ${fuel_type}` : ''}
${transmission ? `- Transmission: ${transmission}` : ''}
${color ? `- Color: ${color}` : ''}
${mileageText}
${priceText}
${featuresText}

Write the description now:`

    try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type':      'application/json',
                'x-api-key':         apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model:      'claude-haiku-4-5-20251001',
                max_tokens: 256,
                messages: [{ role: 'user', content: prompt }],
            }),
        })

        if (!res.ok) {
            const err = await res.text()
            console.error('Anthropic API error:', res.status, err)
            return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
        }

        const data = await res.json()
        const description = data.content?.[0]?.text?.trim() ?? ''
        return NextResponse.json({ description })
    } catch (err) {
        console.error('AI generate description error:', err)
        return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
    }
}
