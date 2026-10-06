# Navegación de Alta Ingeniería, Scroll Fluido y Auditoría de Servicios — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar una experiencia de navegación de alta fidelidad inspirada en Linear y Vercel (scroll ingrávido, navbar arquitectónico libre de deformaciones elásticas, anclajes de precisión) y dotar al proyecto de una herramienta de auditoría automatizada para las credenciales de Supabase, Resend y Google AI.

**Architecture:** Se desacopla el `scroll-snap` CSS global para que el motor de inercia `Lenis` gestione la física del viewport a 60/120 FPS sin fricciones. Se estabilizan la geometría y los estilos del `LiquidIslandNavbar` eliminando deformaciones de velocidad (`skew`/`scaleY`), se unifica la navegación suave hacia secciones (`smoothScrollTo` a -88px), y se incorpora el script de salud `audit-apikeys.mjs` vinculado a `npm run audit:keys`.

**Tech Stack:** Next.js 16 (Turbopack), React 19, TypeScript 5, Tailwind CSS 4, Lenis, Framer Motion, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-06-linear-navigation-polish-design.md`

## Global Constraints
- Autoría oficial y copyright fundacional preservados: Exequiel Echevarría (2025).
- Cero regresiones en la suite de pruebas existente: 183 tests en Vitest deben mantenerse pasando en verde.
- Ausencia de errores de tipo: `npm run typecheck` (`tsc --noEmit`) con 0 advertencias y 0 errores.
- Respeto por preferencias de accesibilidad: `prefers-reduced-motion` y dispositivos táctiles (`pointer: coarse`) utilizan scroll nativo directo.
- Cero exposición de claves secretas: scripts de auditoría nunca imprimen valores en texto plano.

## Review Focus
- Dispositivos móviles táctiles: no deben activar Lenis ni sufrir comportamientos anómalos.
- Clic central del mouse: debe conservar la apertura de pestañas en enlaces `<a>` sin activar autoscroll indeseado en el lienzo.
- Saltos ancla a `#contact`: deben aterrizar exactamente compensando el navbar flotante sin recortar el encabezado de contacto.
- Entornos sin variables de entorno configuradas: los endpoints de backend (`/api/chat`, `/api/contact`) deben responder con fallbacks elegantes sin arrojar 500.

---

### Task 1: Desacople de Scroll-Snap y Calibración Fina de Lenis

**Files:**
- Modify: `src/index.css:509-530`
- Modify: `src/components/shared/ScrollProvider.tsx:23-32`
- Test: `tests/shared/scroll-clean.test.ts`

**Interfaces:**
- Consumes: `getGlobalLenis()`, `setGlobalLenis()` de `src/components/shared/scrollUtils.ts`.
- Produces: CSS sin directivas de `scroll-snap` y configuración de física de Lenis calibrada a `duration: 0.9` con amortiguación orgánica.

- [ ] **Step 1: Escribir el test que valida la eliminación de scroll-snap y la configuración de Lenis**

Crear `tests/shared/scroll-clean.test.ts` comprobando que `src/index.css` no incluye `scroll-snap-type: y proximity` y que `ScrollProvider` inicializa con la física calibrada.

- [ ] **Step 2: Ejecutar test para verificar que falla si existen las directivas residuales**

Run: `npx vitest run tests/shared/scroll-clean.test.ts`
Expected: FAIL si la regla antigua persiste.

- [ ] **Step 3: Modificar `src/index.css` y `ScrollProvider.tsx`**

En `src/index.css`, remover `scroll-snap-type: y proximity`, `scroll-snap-align: start`, y `scroll-snap-stop`.
En `ScrollProvider.tsx`, afinar `duration: 0.9` y `wheelMultiplier: 1.0`.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `npx vitest run tests/shared/scroll-clean.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/components/shared/ScrollProvider.tsx tests/shared/scroll-clean.test.ts
git commit -m "feat(scroll): eliminar scroll-snap conflictivo y calibrar inercia de Lenis a fisica lineal"
```

---

### Task 2: Estabilidad Geométrica y Anti-Jelly del LiquidIslandNavbar

**Files:**
- Modify: `src/components/layout/LiquidIsland/useNavScroll.ts:58-75`
- Modify: `src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx:90-120`
- Test: `tests/components/navbar-stability.test.tsx`

**Interfaces:**
- Consumes: `useScroll()`, `useMotionValue()` de Framer Motion.
- Produces: `skewX: 0`, `scaleY: 1`, y ancho estable del navbar en desktop sin deformaciones de sesgo físico.

- [ ] **Step 1: Escribir el test de estabilidad geométrica del hook y componentes**

Crear `tests/components/navbar-stability.test.tsx` verificando que `useNavScroll` retorna valores neutros para transformaciones físicas y que la barra no colapsa sus links principales en desktop.

- [ ] **Step 2: Ejecutar el test para comprobar el comportamiento**

Run: `npx vitest run tests/components/navbar-stability.test.tsx`
Expected: FAIL / comprobación de firmas.

- [ ] **Step 3: Modificar `useNavScroll.ts` y `LiquidIslandNavbar.tsx`**

Eliminar transformaciones `rawSkew` y `rawScaleY`. Reemplazar por valores constantes neutros `0` y `1`.
En `LiquidIslandNavbar.tsx`, atenuar el halo difuso y asegurar que en pantallas `lg` la barra conserve su ancho armónico con cristal frosted al hacer scroll.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `npx vitest run tests/components/navbar-stability.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/LiquidIsland/useNavScroll.ts src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx tests/components/navbar-stability.test.tsx
git commit -m "fix(navbar): remover deformaciones elásticas skew/scale y estabilizar geometría en desktop"
```

---

### Task 3: Navegación de Anclajes de Precisión (`smoothScrollTo`)

**Files:**
- Modify: `src/components/shared/scrollUtils.ts:1-42`
- Modify: `src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx:238-248`
- Modify: `src/components/layout/LiquidIsland/NavLink.tsx:1-50`
- Test: `tests/shared/scroll-utils-navigation.test.ts`

**Interfaces:**
- Consumes: `getGlobalLenis()`.
- Produces: `smoothScrollTo(targetSelectorOrY: string | number, offset?: number)` exportado en `scrollUtils.ts`.

- [ ] **Step 1: Escribir el test para `smoothScrollTo`**

Crear `tests/shared/scroll-utils-navigation.test.ts` validando que `smoothScrollTo` delega a `lenis.scrollTo` con offset `-88px` cuando Lenis está activo y usa `window.scrollTo` como fallback.

- [ ] **Step 2: Ejecutar el test para verificar fallo inicial**

Run: `npx vitest run tests/shared/scroll-utils-navigation.test.ts`
Expected: FAIL con `smoothScrollTo is not a function`.

- [ ] **Step 3: Implementar `smoothScrollTo` y conectar en los enlaces internos**

En `scrollUtils.ts`, definir e implementar `smoothScrollTo(targetSelectorOrY, offset = -88)`.
Actualizar los manejadores de clic en enlaces internos (`/#contact`, etc.) para usar la navegación suave coordinada.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `npx vitest run tests/shared/scroll-utils-navigation.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/scrollUtils.ts src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx src/components/layout/LiquidIsland/NavLink.tsx tests/shared/scroll-utils-navigation.test.ts
git commit -m "feat(nav): incorporar smoothScrollTo universal con compensación de offset de -88px"
```

---

### Task 4: Herramienta de Auditoría y Verificación de Claves API

**Files:**
- Create: `scripts/audit-apikeys.mjs`
- Modify: `package.json:30-40`
- Test: `tests/api/audit/services-health-extended.test.ts`

**Interfaces:**
- Consumes: Variables de entorno desde `.env.local` y `.env`.
- Produces: Script CLI ejecutable `npm run audit:keys` con reporte de estado de salud para Supabase, Resend y Google AI.

- [ ] **Step 1: Escribir el test de salud de integraciones externas**

Crear `tests/api/audit/services-health-extended.test.ts` comprobando que las funciones de auditoría manejan con gracia la presencia o ausencia de claves sin exponer información sensible.

- [ ] **Step 2: Ejecutar el test para comprobar estado**

Run: `npx vitest run tests/api/audit/services-health-extended.test.ts`
Expected: FAIL o faltante de script.

- [ ] **Step 3: Implementar `scripts/audit-apikeys.mjs` y agregar el script a `package.json`**

Crear el script nativo de Node.js con reporte estructurado y seguro.
Agregar `"audit:keys": "node scripts/audit-apikeys.mjs"` en `package.json`.

- [ ] **Step 4: Ejecutar el script y los tests para verificar salida**

Run: `node scripts/audit-apikeys.mjs`
Expected: Reporte de salud en consola con código de salida 0.
Run: `npx vitest run tests/api/audit/services-health-extended.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/audit-apikeys.mjs package.json tests/api/audit/services-health-extended.test.ts
git commit -m "feat(dx): agregar script de auditoría de claves API npm run audit:keys y tests de resiliencia"
```

---

### Task 5: Verificación Integral del Sistema y Certificación Final

**Files:**
- All modified and tested files

**Interfaces:**
- Produces: Build de Turbopack limpio, 0 errores TypeScript y 100% de tests en verde.

- [ ] **Step 1: Ejecutar verificación de tipos TypeScript**

Run: `npm run typecheck`
Expected: Exit code 0 (0 errores).

- [ ] **Step 2: Ejecutar la suite completa de tests automatizados**

Run: `npm run test`
Expected: 183+ tests pasando (100% verde).

- [ ] **Step 3: Ejecutar auditoría de seguridad y claves**

Run: `npm run audit:sec` y `npm run audit:keys`
Expected: 0 vulnerabilidades y reporte de salud exitoso.

- [ ] **Step 4: Compilar bundle de producción de Next.js**

Run: `npm run build`
Expected: Build exitoso con Turbopack para las 23 rutas.

- [ ] **Step 5: Commit final y sincronización con GitHub**

```bash
git push origin main
```
Verificar que GitHub Actions (`Verify Build`) finalice en verde.
