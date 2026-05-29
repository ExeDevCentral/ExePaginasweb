-- 001_pagos.sql: Tabla de registros de cobros e integración con pasarela de pagos

-- 1. Creación de la tabla pagos
CREATE TABLE IF NOT EXISTS public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL, -- Conservamos auditoría contable
  monto NUMERIC NOT NULL,
  moneda TEXT DEFAULT 'ARS',
  estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'approved', 'rejected', 'failed'
  mp_payment_id TEXT, -- ID de Mercado Pago
  mp_preference_id TEXT, -- ID de preferencia de Mercado Pago
  plan_nombre TEXT, -- Nombre legible del plan comprado
  plan_slug TEXT, -- Se relacionará con la tabla planes en la migración de planes
  metodo_pago TEXT, -- 'credit_card', 'ticket', 'account_money', etc.
  fecha_aprobacion TIMESTAMPTZ, -- Fecha real en la que se aprobó
  detalles JSONB, -- Registro completo de respuesta del webhook
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_pagos_cliente_id ON public.pagos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pagos_mp_payment_id ON public.pagos(mp_payment_id);

-- 3. Habilitar RLS
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad RLS
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios pagos" ON public.pagos;
CREATE POLICY "Usuarios pueden ver sus propios pagos"
  ON public.pagos FOR SELECT
  TO authenticated
  USING (cliente_id = auth.uid());
