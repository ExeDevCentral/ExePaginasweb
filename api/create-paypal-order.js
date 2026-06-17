function setCorsHeaders(res) {
  const origin = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://exepaginasweb.com'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET no configurados')
  }

  const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const resp = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`PayPal auth error: ${resp.status} ${err}`)
  }

  const data = await resp.json()
  return data.access_token
}

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { planId, planTitle, price, email, tipoProyecto } = req.body || {}
  if (!planId || !planTitle || !price || !email) {
    return res.status(400).json({ error: 'Faltan campos: planId, planTitle, price, email' })
  }

  const siteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://exepaginasweb.com'

  try {
    const token = await getPayPalAccessToken()

    const orderResp = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: planId,
            description: planTitle,
            amount: {
              currency_code: 'USD',
              value: String(price),
            },
            custom_id: `${planId}|${email}|${tipoProyecto || 'mantenimiento'}`,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              landing_page: 'LOGIN',
              user_action: 'PAY_NOW',
              return_url: `${siteUrl}/dashboard?payment=paypal_ok`,
              cancel_url: `${siteUrl}/tienda?payment=paypal_cancel`,
            },
          },
        },
      }),
    })

    if (!orderResp.ok) {
      const errText = await orderResp.text()
      console.error('[create-paypal-order] error:', orderResp.status, errText)
      return res.status(502).json({ error: 'Error al crear orden en PayPal' })
    }

    const order = await orderResp.json()
    const approvalLink = order.links?.find((l) => l.rel === 'payer-action')?.href

    return res.status(200).json({
      order_id: order.id,
      approval_url: approvalLink,
      status: order.status,
    })
  } catch (err) {
    console.error('[create-paypal-order] Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
