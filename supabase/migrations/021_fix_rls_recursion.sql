-- 021_fix_rls_recursion.sql: Fix infinite recursion in work_members RLS
-- The "Work members read own tenant" policy queried work_members inside its
-- USING clause, creating infinite recursion. This broke ALL operations that
-- indirectly read work_members (including INSERT INTO tenants with RETURNING).

-- Fix: create a SECURITY DEFINER helper that bypasses RLS to check membership.

CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(p_tenant_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.work_members
    WHERE tenant_id = p_tenant_id
      AND user_id = auth.uid()
      AND activo = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

DROP POLICY IF EXISTS "Work members read own tenant" ON public.work_members;
CREATE POLICY "Work members read own tenant"
  ON public.work_members FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_tenant(tenant_id));
