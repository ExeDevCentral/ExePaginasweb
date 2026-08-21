import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error_description') || searchParams.get('error')
  const next = searchParams.get('next') ?? '/dashboard'
  const type = searchParams.get('type')
  const isRecovery = type === 'recovery'

  const targetUrl = isRecovery ? `${origin}/login?mode=update-password` : `${origin}${next}`

  if (errorParam) {
    const errorHtml = `<!DOCTYPE html>
<html>
<head><title>Autenticación</title></head>
<body>
<script>
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: ${JSON.stringify(errorParam)} }, window.location.origin);
    window.close();
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

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const successHtml = `<!DOCTYPE html>
<html>
<head><title>Autenticación Exitosa</title></head>
<body>
<script>
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, window.location.origin);
    window.close();
  } else {
    window.location.href = ${JSON.stringify(targetUrl)};
  }
</script>
</body>
</html>`
      return new NextResponse(successHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    } else {
      const errMsg = error.message || 'Error al intercambiar código'
      const errorHtml = `<!DOCTYPE html>
<html>
<head><title>Error de Autenticación</title></head>
<body>
<script>
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: ${JSON.stringify(errMsg)} }, window.location.origin);
    window.close();
  } else {
    window.location.href = ${JSON.stringify(`${origin}/login?error=${encodeURIComponent(errMsg)}`)};
  }
</script>
</body>
</html>`
      return new NextResponse(errorHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
