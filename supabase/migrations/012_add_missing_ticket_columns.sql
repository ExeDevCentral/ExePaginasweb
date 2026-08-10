-- 012_add_missing_ticket_columns.sql
-- Agrega columnas faltantes a la tabla tickets que no se crearon en producción debido a que la tabla ya existía.

ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS asignado_a UUID,
  ADD COLUMN IF NOT EXISTS respuesta_resolucion TEXT,
  ADD COLUMN IF NOT EXISTS fecha_cierre TIMESTAMPTZ;
