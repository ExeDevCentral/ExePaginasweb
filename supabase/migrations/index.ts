import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { MercadoPagoConfig, Payment } from 'https://esm.sh/mercadopago@2.0.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejo de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Configurar clientes de Supabase (Admin) y Mercado Pago
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Requiere service_role para ignorar RLS en este proceso
    )

    const mpClient = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '' 
    });
    
    const payment = new Payment(mpClient);

    // 2. Parsear el cuerpo de la notificación
    const body = await req.json()
    console.log('Webhook recibido:', JSON.stringify(body, null, 2))

    // Solo procesamos si es una notificación de pago
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id;

      // 3. Obtener detalles reales del pago desde Mercado Pago
      // Esto evita que alguien simule un pago enviando un JSON falso al webhook
      const mpPayment = await payment.get({ id: paymentId });
      
      const email = mpPayment.payer?.email;
      const status = mpPayment.status;
      const amount = mpPayment.transaction_amount;
      // Asumimos que al crear la preferencia enviaste el slug en 'external_reference'
      const planSlug = mpPayment.external_reference; 
      const mpPreferenceId = mpPayment.preference_id;

      if (!email) throw new Error('No se encontró el email del pagador en la info de Mercado Pago');

      // 4. Buscar al cliente en tu tabla pública por el email
      const { data: client, error: clientError } = await supabaseClient
        .from('clientes')
        .select('id')
        .eq('email', email)
        .single();

      if (clientError || !client) {
        console.error('Cliente no encontrado para el email:', email);
        return new Response(JSON.stringify({ error: 'Cliente no registrado en el sistema' }), { status: 404 });
      }

      // 5. Registrar el intento de pago (Upsert por ID de MP)
      const { error: paymentError } = await supabaseClient
        .from('pagos')
        .upsert({
          cliente_id: client.id,
          monto: amount,
          estado: status,
          mp_payment_id: String(paymentId),
          mp_preference_id: mpPreferenceId,
          plan_slug: planSlug
        }, { onConflict: 'mp_payment_id' });

      if (paymentError) throw paymentError;

      // 6. Lógica de suscripción si el pago fue aprobado (Atómica vía RPC)
      if (status === 'approved' && planSlug) {
        const { error: rpcError } = await supabaseClient.rpc('handle_subscription_update', {
          p_cliente_id: client.id,
          p_plan_slug: planSlug
        });

        if (rpcError) throw rpcError;
        console.log(`Suscripción activada de forma atómica para ${email}: ${planSlug}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error procesando el webhook:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})