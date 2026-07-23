const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com'

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET son requeridos')
  }

  const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const resp = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await resp.json()

  if (!resp.ok) {
    throw new Error(`Error obteniendo token: ${JSON.stringify(data)}`)
  }

  return data.access_token
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Solo GET permitido' })
  }

  try {
    console.log('[test-paypal] Probando conexión con PayPal sandbox...')
    console.log(`[test-paypal] API Base: ${PAYPAL_API_BASE}`)

    const token = await getPayPalAccessToken()
    console.log('[test-paypal] Token obtenido correctamente')

    res.status(200).json({
      ok: true,
      message: 'Conexión con PayPal sandbox exitosa',
      apiBase: PAYPAL_API_BASE,
      tokenPrefix: token.substring(0, 20) + '...',
    })
  } catch (error) {
    console.error('[test-paypal] Error:', error.message)
    res.status(500).json({
      ok: false,
      error: error.message,
      apiBase: PAYPAL_API_BASE,
    })
  }
}
