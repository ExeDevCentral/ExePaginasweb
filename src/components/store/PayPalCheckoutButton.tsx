import { useState } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { supabase } from '../../core/infra/supabase/client'

interface Props {
  planId: string
  planTitle: string
  price: number
  tipoProyecto: string
  onSuccess: () => void
}

const CLIENT_ID =
  import.meta.env.VITE_PAYPAL_CLIENT_ID ||
  'BAAAvwRKJ9kv0-cQu3OgJ4dpcjVTVzozUEkt00PIg2UxxQpwJk-RMIAMct0xwjTBNbMXTVeqhvVH6jkAAQ'

export default function PayPalCheckoutButton({
  planId,
  planTitle,
  price,
  tipoProyecto,
  onSuccess,
}: Props) {
  const [error, setError] = useState<string | null>(null)

  return (
    <PayPalScriptProvider options={{ clientId: CLIENT_ID, currency: 'USD', intent: 'capture' }}>
      {error && <p className="text-sm text-red-400 mb-2 bg-red-400/10 rounded-xl p-3">{error}</p>}
      <PayPalButtons
        style={{ color: 'gold', shape: 'rect', label: 'paypal', height: 45 }}
        createOrder={async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          const email = user?.email || ''
          const resp = await fetch('/api/create-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId, planTitle, price, email, tipoProyecto }),
          })
          const data = await resp.json()
          if (!resp.ok) throw new Error(data.error || 'Error creating order')
          return data.order_id
        }}
        onApprove={async (data) => {
          setError(null)
          const resp = await fetch('/api/capture-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID }),
          })
          const result = await resp.json()
          if (!resp.ok) {
            setError(result.error || 'Error al capturar el pago')
            return
          }
          onSuccess()
        }}
      />
    </PayPalScriptProvider>
  )
}
