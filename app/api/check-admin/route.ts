import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseAdminConfigured, supabaseAdmin as supabase } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: 'Admin authentication is not configured' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
    )
  }

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim()
  if (!token) {
    return NextResponse.json({ admin: false }, { status: 401 })
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)
  if (error || !user) {
    return NextResponse.json({ admin: false }, { status: 401 })
  }

  const { data: role, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (roleError) {
    return NextResponse.json({ error: 'Unable to verify role' }, { status: 503 })
  }

  const isAdmin = role?.role === 'admin'
  return NextResponse.json(
    { admin: isAdmin },
    { headers: { 'Cache-Control': 'private, no-store' } }
  )
}
