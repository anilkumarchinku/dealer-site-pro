import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, requireAuth } from '@/lib/supabase-server'

function getServiceSupabase() {
  return createAdminClient()
}

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, maxLength)
}

function cleanSiteSlug(value: unknown): string | null {
  const slug = cleanText(value, 160)
  if (!slug) return null
  return /^[a-z0-9][a-z0-9/-]*(?:-[a-z0-9]+)?$/i.test(slug) ? slug : null
}

/** Resolve the dealer_id that belongs to the authenticated user. */
async function getDealerIdForUser(userId: string): Promise<string | null> {
  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from('dealers')
    .select('id')
    .eq('user_id', userId)
    .single()
  return data?.id ?? null
}

export async function GET(request: NextRequest) {
  const dealerId = request.nextUrl.searchParams.get('dealer_id')
  if (!dealerId) return NextResponse.json({ error: 'dealer_id required' }, { status: 400 })
  const siteSlug = cleanSiteSlug(request.nextUrl.searchParams.get('site_slug'))

  const supabase = getServiceSupabase()
  const today = new Date().toISOString().split('T')[0]  // YYYY-MM-DD

  let query = supabase
    .from('dealer_offers')
    .select('id, title, description, tag, valid_until, site_slug, image_url, show_popup, created_at')
    .eq('dealer_id', dealerId)
    .eq('is_active', true)
    .or(`valid_until.is.null,valid_until.gte.${today}`)

  if (siteSlug) {
    query = query.or(`site_slug.is.null,site_slug.eq.${siteSlug}`)
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ offers: [] })
  return NextResponse.json({ offers: data ?? [] })
}

export async function POST(request: NextRequest) {
  const { user, errorResponse } = await requireAuth()
  if (errorResponse) return errorResponse

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { title, description, tag, valid_until, site_slug, image_url, show_popup } = body
  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })
  if (title.length > 120) return NextResponse.json({ error: 'Title too long' }, { status: 400 })

  // Resolve dealer from session — never trust dealer_id from the client
  const dealerId = await getDealerIdForUser(user.id)
  if (!dealerId) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('dealer_offers')
    .insert({
      dealer_id: dealerId,
      title: title.trim(),
      description: cleanText(description, 1000),
      tag: cleanText(tag, 40),
      valid_until: valid_until || null,
      site_slug: cleanSiteSlug(site_slug),
      image_url: cleanText(image_url, 1000),
      show_popup: Boolean(show_popup),
    })
    .select('id, title, description, tag, valid_until, site_slug, image_url, show_popup, created_at')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to save offer' }, { status: 500 })
  return NextResponse.json({ success: true, offer: data })
}

export async function DELETE(request: NextRequest) {
  const { user, errorResponse } = await requireAuth()
  if (errorResponse) return errorResponse

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Resolve dealer from session and verify offer ownership
  const dealerId = await getDealerIdForUser(user.id)
  if (!dealerId) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

  const supabase = getServiceSupabase()

  // Ownership check: only soft-delete offers belonging to this dealer
  const { error } = await supabase
    .from('dealer_offers')
    .update({ is_active: false })
    .eq('id', id)
    .eq('dealer_id', dealerId)   // scoped to this dealer — prevents cross-dealer deletion

  if (error) return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 })
  return NextResponse.json({ success: true })
}
