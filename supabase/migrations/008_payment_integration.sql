-- 008_payment_integration.sql: PayPal columns + tipo_proyecto for pagos

ALTER TABLE public.pagos
  ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS tipo_proyecto TEXT DEFAULT 'mantenimiento',
  ADD COLUMN IF NOT EXISTS provider TEXT;

CREATE INDEX IF NOT EXISTS idx_pagos_paypal_order_id ON public.pagos(paypal_order_id);
