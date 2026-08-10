-- Fix RLS circular recursion between tenants, work_members, and work_groups
-- All cross-table subqueries replaced with SECURITY DEFINER user_belongs_to_tenant()

-- Tenants: use user_belongs_to_tenant() instead of subquery to work_members
DROP POLICY IF EXISTS "Tenant members read" ON public.tenants;
CREATE POLICY "Tenant members read"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_tenant(id));

-- Work members: use user_belongs_to_tenant() + direct owner check on tenants
-- The direct owner check uses tenants.dueno_id = auth.uid() which matches
-- the "Tenant owner full access" policy WITHOUT triggering recursion
DROP POLICY IF EXISTS "Work members owner manage" ON public.work_members;
CREATE POLICY "Work members owner manage"
  ON public.work_members FOR ALL
  TO authenticated
  USING (
    public.user_belongs_to_tenant(tenant_id)
    AND EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id AND dueno_id = auth.uid())
  )
  WITH CHECK (
    public.user_belongs_to_tenant(tenant_id)
    AND EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id AND dueno_id = auth.uid())
  );

-- Work groups: same pattern as work_members
DROP POLICY IF EXISTS "Work groups members read" ON public.work_groups;
CREATE POLICY "Work groups members read"
  ON public.work_groups FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_tenant(tenant_id));

DROP POLICY IF EXISTS "Work groups owner manage" ON public.work_groups;
CREATE POLICY "Work groups owner manage"
  ON public.work_groups FOR ALL
  TO authenticated
  USING (
    public.user_belongs_to_tenant(tenant_id)
    AND EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id AND dueno_id = auth.uid())
  )
  WITH CHECK (
    public.user_belongs_to_tenant(tenant_id)
    AND EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id AND dueno_id = auth.uid())
  );
