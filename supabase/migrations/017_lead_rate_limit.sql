-- Ensure leads table exists (safe re-run with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  lead_type TEXT NOT NULL,
  name TEXT,
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read all leads" ON public.leads;
CREATE POLICY "Admins can read all leads"
  ON public.leads
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'email' IN ('exemetal@hotmail.com', 'echevarria270@gmail.com'));

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Rate limiting: max 5 leads per email per hour
CREATE OR REPLACE FUNCTION public.check_lead_rate_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.leads
      WHERE email = NEW.email
        AND created_at > NOW() - INTERVAL '1 hour') >= 5 THEN
    RAISE EXCEPTION 'Demasiados intentos. Intentá de nuevo más tarde.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS lead_rate_limit ON public.leads;
CREATE TRIGGER lead_rate_limit
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.check_lead_rate_limit();
