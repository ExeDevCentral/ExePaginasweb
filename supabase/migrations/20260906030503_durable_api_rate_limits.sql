-- 028_durable_api_rate_limits.sql
-- Atomic, server-only rate limiting for horizontally scaled deployments.

CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  key TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_updated_at
  ON public.api_rate_limits(updated_at);

CREATE OR REPLACE FUNCTION public.check_api_rate_limit(
  p_key TEXT,
  p_window_seconds INTEGER,
  p_max_requests INTEGER
)
RETURNS TABLE(allowed BOOLEAN, retry_after_seconds INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_started_at TIMESTAMPTZ;
  v_count INTEGER;
BEGIN
  IF p_key IS NULL OR length(p_key) = 0 OR length(p_key) > 512 THEN
    RAISE EXCEPTION 'Invalid rate limit key';
  END IF;

  IF p_window_seconds < 1 OR p_max_requests < 1 THEN
    RAISE EXCEPTION 'Invalid rate limit configuration';
  END IF;

  INSERT INTO public.api_rate_limits (key, window_started_at, request_count, updated_at)
  VALUES (p_key, now(), 1, now())
  ON CONFLICT (key) DO UPDATE SET
    window_started_at = CASE
      WHEN public.api_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
        THEN now()
      ELSE public.api_rate_limits.window_started_at
    END,
    request_count = CASE
      WHEN public.api_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
        THEN 1
      ELSE public.api_rate_limits.request_count + 1
    END,
    updated_at = now()
  RETURNING api_rate_limits.window_started_at, api_rate_limits.request_count
  INTO v_started_at, v_count;

  allowed := v_count <= p_max_requests;
  retry_after_seconds := GREATEST(
    1,
    CEIL(EXTRACT(EPOCH FROM ((v_started_at + make_interval(secs => p_window_seconds)) - now())))::INTEGER
  );
  RETURN NEXT;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_api_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_api_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;
