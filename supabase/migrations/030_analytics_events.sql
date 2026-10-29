-- ============================================================================
-- Migration: 030_analytics_events.sql
-- Description: Almacena eventos clave de conversión (Contactar, Precios, Chat, etc.)
--              directamente en Supabase sin depender de planes pagos de analítica.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  page_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Índices de consulta rápida para agregados y embudos
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created 
  ON public.analytics_events(event_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created 
  ON public.analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session 
  ON public.analytics_events(session_id) 
  WHERE session_id IS NOT NULL;

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Permitir inserción anónima y autenticada (para telemetría client-side segura)
CREATE POLICY "Allow public insert to analytics_events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sólo administradores y service_role pueden leer los eventos
CREATE POLICY "Allow admin read analytics_events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

