-- 009_orders_api.sql: Add mp_order_id for Orders API compatibility

ALTER TABLE public.pagos
  ADD COLUMN IF NOT EXISTS mp_order_id TEXT;

CREATE INDEX IF NOT EXISTS idx_pagos_mp_order_id ON public.pagos(mp_order_id);
