-- Tabla de pagos
CREATE TABLE IF NOT EXISTS public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id),
  monto NUMERIC NOT NULL,
  moneda TEXT DEFAULT 'ARS',
  estado TEXT DEFAULT 'pendiente',
  mp_payment_id TEXT,
  mp_preference_id TEXT,
  plan_nombre TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agregar estado y fecha_fin a suscripciones
ALTER TABLE public.suscripciones ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'activa';
ALTER TABLE public.suscripciones ADD COLUMN IF NOT EXISTS fecha_fin TIMESTAMPTZ;

-- RLS (opcional, por ahora todo abierto con service_role)
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propios pagos"
  ON public.pagos FOR SELECT
  USING (cliente_id IN (
    SELECT id FROM public.clientes WHERE email = auth.jwt() ->> 'email'
  ));
