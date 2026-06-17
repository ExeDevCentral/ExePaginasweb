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
  return (
    <PayPalScriptProvider options={{ clientId: CLIENT_ID, currency: 'USD', intent: 'capture' }}>
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
        onApprove={async () => {
          onSuccess()
        }}
      />
    </PayPalScriptProvider>
  )
}
