function setCorsHeaders(res) {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    return res.status(500).json({ error: 'MERCADOPAGO_ACCESS_TOKEN no configurado' })
  }

  const { title, price, email, planId, tipoProyecto } = req.body || {}
  if (!title || !price || !email) {
    return res.status(400).json({ error: 'Faltan campos: title, price, email' })
  }

  const siteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://exepaginasweb.com'

  try {
    const mpResp = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title,
            quantity: 1,
            unit_price: Number(price),
            currency_id: 'ARS',
          },
        ],
        payer: { email },
        back_urls: {
          success: `${siteUrl}/dashboard?pago=ok`,
          failure: `${siteUrl}/tienda?pago=error`,
          pending: `${siteUrl}/tienda?pago=pending`,
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/mercadopago-webhook`,
        external_reference: `${planId || 'plan'}|${email}|${tipoProyecto || 'mantenimiento'}`,
        metadata: {
          plan_id: planId || '',
          plan_slug: planId || '',
          email,
          tipo_proyecto: tipoProyecto || 'mantenimiento',
          provider: 'mercadopago',
        },
      }),
    })

    if (!mpResp.ok) {
      const errText = await mpResp.text()
      console.error('[create-preference] MP error:', mpResp.status, errText)
      return res.status(502).json({ error: 'Error al crear preferencia en MercadoPago' })
    }

    const pref = await mpResp.json()
    return res.status(200).json({
      init_point: pref.init_point,
      preference_id: pref.id,
    })
  } catch (err) {
    console.error('[create-preference] Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
