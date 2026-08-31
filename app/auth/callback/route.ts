import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error_description') || searchParams.get('error')
  const rawNext = searchParams.get('next') ?? '/dashboard'

  // Sanitizar el parámetro next para prevenir ataques de Open Redirect
  let next = rawNext.startsWith('/') ? rawNext : `/${rawNext}`
  if (next.startsWith('//') || next.startsWith('/\\') || next.includes('://')) {
    next = '/dashboard'
  }

  // Resolver el origen respetando proxies inversos y Vercel
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin

  const isRecovery = type === 'recovery'
  const targetUrl = isRecovery ? `${origin}/login?mode=update-password` : `${origin}${next}`

  if (errorParam) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorParam)}`)
  }

  // Creamos el objeto de respuesta de redirección para adjuntarle los Set-Cookie
  const response = NextResponse.redirect(targetUrl)

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    'https://bksonxnxshxinqffswqc.supabase.co'

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set({ name, value, ...options })
          response.cookies.set(name, value, options as CookieOptions)
        })
      },
    },
  })

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response
    }
    const errMsg = error.message || 'Error al autenticar código'
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errMsg)}`)
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
      return response
    }
    const errMsg = error.message || 'Error al confirmar correo'
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errMsg)}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
