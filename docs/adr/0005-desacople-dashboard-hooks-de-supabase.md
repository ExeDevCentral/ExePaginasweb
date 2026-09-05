# ADR 0005: Desacople del Dashboard y los Hooks de Datos de Supabase

**Fecha:** 5 de Septiembre de 2026
**Estado:** Aceptado

## Contexto

El `Dashboard.tsx` (804 líneas) y el `Login.tsx` (795 líneas) son **God modules** — su interfaz (flags de modo, dependencias de datos, estados de vista) es casi tan compleja como su implementación. Falla el deletion test: no se puede añadir o quitar un tab sin tocar el archivo.

Además, la infraestructura de Supabase se filtra a la capa UI:

- `Dashboard.tsx` instancia 6 repositorios Supabase directamente para prefetching (líneas 41-44, 194-223).
- `useDashboard.ts` crea singletons de repos a nivel de módulo y usa `supabase.from('clientes'/'pagos')` crudo.
- `useAdminDashboard.ts` hace 4 queries crudas a `supabase.from(...)` y calcula estadísticas inline en el queryFn.

Las interfaces de dominio existen (`ITenantRepository`, `ISLAContractRepository`, etc.) pero no están conectadas — la arquitectura ports & adapters (ADR-0003) quedó hipotética. La regla de seam "*one adapter = hypothetical seam*" impone prudencia: hoy hay un solo adapter de producción (Supabase).

## Decisiones

Esta tanda de refactor **solo** cubre los dos hooks de datos y el split del Dashboard. `OnboardingWizard` y `SettingsPanel` (que también tienen infra crudo) quedan como trabajo separado.

1. **Inyección por parámetro, no Context global.** Definir las interfaces de dominio que faltan y pasarlas opcionalmente a los hooks (default = Supabase). El primer adapter de test (InMemory fake) justifica el seam real. **No** se monta un `RepositoryProvider` Context global todavía — hay un solo adapter de producción.

2. **`useDashboardNavigation` hook propio.** Aísla tabs, modo admin/client, `visitedTabs` (keep-alive de paneles) y sincronización con la URL. Testeable sin renderizar el shell.

3. **Eliminar el prefetching centralizado.** El Dashboard usa keep-alive (`visitedTabs` mantiene paneles montados en memoria); cada panel ya auto-carga su query de React Query. El prefetch paralelo de 6 repos es redundante — pasa el deletion test.

4. **`useDemoData` hook.** Encapsula la selección entre data mock (preview/demo) y data real en value objects `effective*`.

5. **`DashboardSidebar` + `DashboardViewport` componentes separados.** El shell final queda como composición fina (~100 líneas): layout + sidebar + viewport.

6. **`useDashboard` desacoplado.** Nuevas interfaces `IClienteRepository` (con `getByAuthId` + `ensureByAuthId` para el upsert fallback), `ISubscriptionRepository`, `IClientePagoRepository` (nuevo) + adapter `SupabaseClientePagoRepository`.

7. **`useAdminDashboard` desacoplado.** Nueva interfaz `IAdminDashboardRepository.getAdminOverview()` que encapsula las 4 queries; las estadísticas se extraen a la **función pura** `computeAdminStats(clientes, suscripciones, pagos, tickets): AdminStats` — testeable sin base de datos.

## Consecuencias

### Positivas:

1. **Testabilidad (leverage):** los hooks se testean a través de su interfaz de repositorio (test surface) con InMemory fakes; `computeAdminStats` es una función pura unit-testable.
2. **Locality:** el acceso a datos queda encapsulado en repositorios; cada módulo extraído concentra su complejidad.
3. **Seam real:** dos adapters (Supabase + InMemory test) justifican las interfaces; permite futuro offline (PGlite) o swap (Prisma) sin tocar la UI.
4. **Deletion test superado:** quitar un tab requiere tocar solo el registry del Viewport, no el shell.

### Riesgos:

- Añade archivos de interfaz y adapters, pero el beneficio en testabilidad supera el costo.
- No se crea un `RepositoryProvider` Context; si más adelante surge un segundo adapter de producción, se revisará (nuevo ADR).

## Referencias

- ADR-0003 (Patrón Repositorio) — marco de esta decisión.
- Detalle de candidatos en la revisión de arquitectura (`architecture-review-20260905-090057.html`).
