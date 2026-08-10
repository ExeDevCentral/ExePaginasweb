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

CREATE POLICY "Admins can read all leads"
  ON public.leads
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'email' IN ('exemetal@hotmail.com', 'echevarria270@gmail.com'));

CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);
