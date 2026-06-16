import { useState } from 'react'

type CreatePayPalOrderResult = {
  order_id: string
  approval_url: string
  status: string
}

export function usePayment() {
  const [buying, setBuying] = useState<'paypal' | null>(null)
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createPayPalOrder = async (params: {
    planId: string
    planTitle: string
    price: number
    email: string
    tipoProyecto?: string
  }): Promise<CreatePayPalOrderResult | null> => {
    setBuying('paypal')
    setError(null)

    try {
      const resp = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: params.planId,
          planTitle: params.planTitle,
          price: params.price,
          email: params.email,
          tipoProyecto: params.tipoProyecto || 'mantenimiento',
        }),
      })

      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Error creating PayPal order')

      if (data.approval_url) {
        window.location.href = data.approval_url
        return null
      }

      setPaypalOrderId(data.order_id)
      return data
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating PayPal order')
      setBuying(null)
      return null
    }
  }

  const reset = () => {
    setBuying(null)
    setPaypalOrderId(null)
    setError(null)
  }

  return {
    buying,
    paypalOrderId,
    error,
    createPayPalOrder,
    reset,
  }
}
