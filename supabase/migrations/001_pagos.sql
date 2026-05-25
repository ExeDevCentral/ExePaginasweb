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

-- Índices para mejorar la velocidad de búsqueda del Webhook y Dashboard
CREATE INDEX IF NOT EXISTS idx_pagos_cliente_id ON public.pagos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pagos_mp_payment_id ON public.pagos(mp_payment_id);

-- Nota: las columnas de suscripciones (estado/fecha_fin) se gestionan en la migración de suscripciones.


-- RLS (opcional, por ahora todo abierto con service_role)
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propios pagos"
  ON public.pagos FOR SELECT
  USING (cliente_id IN (
    SELECT id FROM public.clientes WHERE id = auth.uid()
  ));
