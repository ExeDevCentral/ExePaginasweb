import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isLocalDashboardPreview, sanitizeInternalPath } from '@/core/auth/siteUrl'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function copyResponseCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie))
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  if (isLocalDashboardPreview(request.nextUrl.searchParams)) return response

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Authentication is not configured' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
    )
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
      },
    },
  })

  const { data, error } = await supabase.auth.getClaims()
  if (!error && data?.claims) return response

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  loginUrl.search = ''
  loginUrl.searchParams.set(
    'redirectTo',
    sanitizeInternalPath(`${request.nextUrl.pathname}${request.nextUrl.search}`)
  )

  const redirect = NextResponse.redirect(loginUrl)
  redirect.headers.set('Cache-Control', 'private, no-store')
  copyResponseCookies(response, redirect)
  return redirect
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
