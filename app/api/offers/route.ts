import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/supabase-server'

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
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

  const supabase = getServiceSupabase()
  const today = new Date().toISOString().split('T')[0]  // YYYY-MM-DD

  const { data, error } = await supabase
    .from('dealer_offers')
    .select('id, title, description, tag, valid_until, created_at')
    .eq('dealer_id', dealerId)
    .eq('is_active', true)
    .or(`valid_until.is.null,valid_until.gte.${today}`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ offers: [] })
  return NextResponse.json({ offers: data ?? [] })
}

export async function POST(request: NextRequest) {
  const { user, errorResponse } = await requireAuth()
  if (errorResponse) return errorResponse

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { title, description, tag, valid_until } = body
  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })
  if (title.length > 120) return NextResponse.json({ error: 'Title too long' }, { status: 400 })

  // Resolve dealer from session — never trust dealer_id from the client
  const dealerId = await getDealerIdForUser(user.id)
  if (!dealerId) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('dealer_offers')
    .insert({ dealer_id: dealerId, title: title.trim(), description: description?.trim() ?? null, tag: tag?.trim() ?? null, valid_until: valid_until ?? null })
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
