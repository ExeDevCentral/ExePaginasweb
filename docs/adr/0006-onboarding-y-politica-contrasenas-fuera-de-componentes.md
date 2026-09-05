# ADR 0006: Onboarding y Política de Contraseñas fuera de los Componentes

**Fecha:** 5 de Septiembre de 2026
**Estado:** Aceptado

## Contexto

Tras el desacople del Dashboard (ADR-0005), quedaron dos componentes con infraestructura Supabase cruda y lógica de dominio embebida:

- **`OnboardingWizard.tsx`**: llamaba `supabase.rpc('create_workspace', ...)` directamente e intercalaba validación de formulario, cálculo de trial y construcción de grupos por defecto dentro del componente.
- **`SettingsPanel.tsx`** y **`Login.tsx`**: repetían la política de contraseñas con reglas **inconsistentes** (SettingsPanel exigía 6 caracteres, Login 8+) y escribían a Supabase directamente (`supabase.from('clientes')`, `supabase.auth.updateUser`).

Estos se identificaron como **candidatos 6 (Onboarding) y 7 (auth duplicada)** en la revisión de arquitectura (`architecture-review-20260905-090057.html`), alcance diferido del grilling original.

## Decisiones

1. **`WorkspaceOnboardingService` con repositorio inyectado.** La lógica de la creación de workspace (validar paso 1, derivar `trialEndsAt`, construir grupos por defecto, armar `CreateWorkspaceParams`) vive en un servicio con `ITenantRepository` inyectado en el constructor. `OnboardingWizard` queda como UI pura de 3 estados (`step`, `formData`, `submitting`) sin importar `supabase`.

2. **Política de contraseñas en un solo lugar: `passwordPolicy.ts`.** `PASSWORD_MIN_LENGTH` (8), `PASSWORD_RULES` (4 reglas), `validatePassword`, `isPasswordValid` y `firstPasswordRuleFailed` (para mensajería por regla). Se aplica en register y actualización de contraseña; **el modo `login` conserva solo el chequeo de longitud** para no bloquear cuentas existentes que no cumplen la política completa.

3. **`IAuthRepository` para perfil de cliente y contraseña.** `updateProfile({ clienteId, fullName })` (tabla `clientes` + `auth.updateUser`) y `updatePassword`. `SettingsPanel` recibe `authRepo?: IAuthRepository` (default `SupabaseAuthRepository`), eliminando el import de `supabase`.

4. **La interfaz `ITenantRepository` se extiende con `createWorkspace`** (no se crea un repositorio separado): el workspace es la entidad raíz del tenant. `SupabaseTenantRepository` mapea `CreateWorkspaceParams` al RPC `create_workspace` (`p_*`).

5. **Recuperación de un overwrite accidental.** El `SupabaseTenantRepository`, su test y su interfaz preexistían (con `getById`, `getBySlug`, `getByOwnerId`, `create`, `update`, `getTenantStats`). La implementación inicial los sobrescribió; se restauraron desde git y se mergeó `createWorkspace` manteniendo intactos los métodos originales y su cobertura de tests.

## Consecuencias

### Positivas:

1. **Una sola verdad para la contraseña**: SettingsPanel y Login comparten `PASSWORD_RULES`; un cambio futuro se hace en `passwordPolicy.ts`, no en dos componentes.
2. **Testabilidad (leverage):** `passwordPolicy`, `workspaceOnboarding` y `WorkspaceOnboardingService` se testean sin UI ni base de datos (fakes InMemory de tenant y auth); el adapter Supabase se testea con el client mockeado.
3. **Locality:** el componente de onboarding solo orquesta; la decisión de modelo (trial, grupos, slug) está en el dominio.
4. **Onboarding sin UI acoplada a Supabase:** `createWorkspace` mapea a un RPC existente que crea tenant + cliente + grupos en una transacción.

### Riesgos:

- El RPC `create_workspace` y los campos `p_*` son un contrato con la base de datos; si el RPC cambia, solo cambia `SupabaseTenantRepository` (un `return` derive descarta campos desconocidos).
- El overwrite accidental muestra que falta un guard: cualquier reescritura de archivos existentes debe verificar `git status` antes de escribir.
- Queda infra cruda pendiente fuera de alcance (p. ej. `AdminDashboardView.tsx` usa `supabase.from`), a migrar en un ADR futuro si se decide.

## Referencias

- ADR-0003 (Patrón Repositorio) y ADR-0005 (desacople del Dashboard) — marco de estas decisiones.
- Detalle de candidatos en la revisión de arquitectura (`architecture-review-20260905-090057.html`).