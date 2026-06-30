import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, requireAuth } from '@/lib/supabase-server'

function getServiceSupabase() {
  return createAdminClient()
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

  const brandId = request.nextUrl.searchParams.get('brand_id')
  const supabase = getServiceSupabase()
  const today = new Date().toISOString().split('T')[0]  // YYYY-MM-DD

  let query = supabase
    .from('dealer_offers')
    .select('id, title, description, tag, valid_until, brand_id, branch_city, image_url, promotion_type, created_at')
    .eq('dealer_id', dealerId)
    .eq('is_active', true)
    .or(`valid_until.is.null,valid_until.gte.${today}`)
    .order('created_at', { ascending: false })

  if (brandId) query = query.eq('brand_id', brandId)

  const { data, error } = await query

  if (error) return NextResponse.json({ offers: [] })
  return NextResponse.json({ offers: data ?? [] })
}

export async function POST(request: NextRequest) {
  const { user, errorResponse } = await requireAuth()
  if (errorResponse) return errorResponse

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { title, description, tag, valid_until, brand_id, branch_city, image_url, promotion_type } = body
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
      description: description?.trim() ?? null,
      tag: tag?.trim() ?? null,
      valid_until: valid_until ?? null,
      brand_id: brand_id ?? null,
      branch_city: branch_city?.trim() ?? null,
      image_url: image_url?.trim() ?? null,
      promotion_type: promotion_type ?? 'offer',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to save offer' }, { status: 500 })
  return NextResponse.json({ success: true, id: data.id })
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
