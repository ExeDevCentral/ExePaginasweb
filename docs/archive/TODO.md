# TODO - Fix Supabase connection + PayPal client onboarding

- [x] Editar `src/hooks/useDashboard.ts` para que muestre el error real de Supabase en consola y en UI (evitar loading eterno).

- [ ] Compilar (`npm run build`) para validar que no rompe TypeScript.
- [ ] Si el error indica placeholder env / config: revisar lectura de `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `src/core/infra/supabase/client.ts`.
- [ ] Si el error indica RLS/permissions: ajustar policies/migraciones para que `clientes` e inserciones/lecturas funcionen para el usuario autenticado.
- [ ] Confirmar PayPal (StorePage) -> /api/create-paypal-order -> return_url -> /dashboard?payment=paypal_ok.
