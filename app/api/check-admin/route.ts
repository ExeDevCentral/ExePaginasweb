import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
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

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  const isAdmin = role?.role === 'admin'
  return NextResponse.json({ admin: isAdmin })
}
