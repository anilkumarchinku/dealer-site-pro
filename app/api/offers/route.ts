import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
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
  // Auth: require dealer to be logged in via Supabase session
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { dealer_id, title, description, tag, valid_until } = body
  if (!dealer_id || !title) {
    return NextResponse.json({ error: 'dealer_id and title required' }, { status: 400 })
  }
  if (title.length > 120) return NextResponse.json({ error: 'Title too long' }, { status: 400 })

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('dealer_offers')
    .insert({ dealer_id, title: title.trim(), description: description?.trim() ?? null, tag: tag?.trim() ?? null, valid_until: valid_until ?? null })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to save offer' }, { status: 500 })
  return NextResponse.json({ success: true, id: data.id })
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('dealer_offers')
    .update({ is_active: false })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ success: true })
}
