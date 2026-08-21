import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const errorParam = searchParams.get('error_description') || searchParams.get('error')
  const next = searchParams.get('next') ?? '/dashboard'
  const isRecovery = type === 'recovery'

  const targetUrl = isRecovery ? `${origin}/login?mode=update-password` : `${origin}${next}`

  if (errorParam) {
    const errorHtml = `<!DOCTYPE html>
<html>
<head><title>Autenticación</title></head>
<body>
<script>
  if (window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: ${JSON.stringify(errorParam)} }, window.location.origin);
      window.close();
    } catch(e) {
      window.location.href = ${JSON.stringify(`${origin}/login?error=${encodeURIComponent(errorParam)}`)};
    }
  } else {
    window.location.href = ${JSON.stringify(`${origin}/login?error=${encodeURIComponent(errorParam)}`)};
  }
</script>
</body>
</html>`
    return new NextResponse(errorHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const successHtml = `<!DOCTYPE html>
<html>
<head><title>Autenticación Exitosa</title></head>
<body>
<script>
  if (window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, window.location.origin);
      window.close();
    } catch(e) {
      window.location.href = ${JSON.stringify(targetUrl)};
    }
  } else {
    window.location.href = ${JSON.stringify(targetUrl)};
  }
</script>
<p style="font-family:sans-serif;text-align:center;margin-top:40px;color:#64748b;">Iniciando sesión y redirigiendo a tu panel...</p>
</body>
</html>`
      return new NextResponse(successHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    } else {
      const errMsg = error.message || 'Error al autenticar código'
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errMsg)}`)
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
      return NextResponse.redirect(targetUrl)
    } else {
      const errMsg = error.message || 'Error al confirmar correo'
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errMsg)}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
