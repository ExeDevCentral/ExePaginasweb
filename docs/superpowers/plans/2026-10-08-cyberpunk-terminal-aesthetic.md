# Cyber-Terminal HUD & Dark Cyber-Engineering Futurista Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the visual aesthetics of ExePaginasWeb into a bespoke Cyber-Terminal HUD / Dark Cyber-Engineering console with tactical chassis cards, PCB circuit overlays, telemetry headers, and perspective cyber-grids.

**Architecture:** Create modular, deeply-encapsulated design components (`CyberTerminalCard`, `CyberCircuitOverlay`, `CyberGridBackground`) and integrate them into the Hero, Capabilities, HowWeWork, Pricing, and Navbar layers while preserving 120 FPS performance and flawless Lenis smooth scrolling.

**Tech Stack:** Next.js 16, React 19, Framer Motion 12, Tailwind CSS, Lucide icons, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-08-cyberpunk-terminal-aesthetic-design.md`

## Global Constraints

- ExePaginasWeb copyright 2025 Exequiel Echevarria
- Cero regresiones en scroll ni bloqueo del botón central del mouse (e.button === 1)
- 100% tests pasando (`npm run test`)
- Cero errores de TypeScript (`npm run typecheck`)
- Tareas de compositor ultraligeras sin caídas de framerate

## Review Focus

1. Respaldo de accesibilidad: Si el usuario tiene `prefers-reduced-motion`, las animaciones intensas y partículas fotónicas deben pausarse o simplificarse.
2. Contraste WCAG: Los textos técnicos monospacio deben mantener un contraste legible sobre los fondos obsidiana.
3. Compatibilidad táctil: En dispositivos móviles, los efectos de hover tácticos deben responder limpiamente al tap sin atascar el toque.
4. Jerarquía de capas (`z-index`): Las líneas de circuito y fondos no deben interceptar clics sobre botones o enlaces.
5. Estabilidad de layout: El biselado y bordes no deben provocar saltos de diseño (layout shifts) durante el montaje o renderizado.

---

### Task 1: Componente Base `CyberTerminalCard` con Chasis Biselado y Telemetría

**Files:**
- Create: `src/components/shared/CyberTerminalCard.tsx`
- Test: `tests/components/cyber-terminal-card.test.tsx`

**Interfaces:**
- Produces: `CyberTerminalCard` con props `{ id?: string; code?: string; title: string; desc: string; badge?: string; tech?: string[]; cta?: string; href?: string; color?: 'cyan' | 'fuchsia' | 'amber' | 'emerald'; icon?: React.ComponentType<{ className?: string }>; className?: string }`

- [ ] **Step 1: Escribir el test que falla**
Crear `tests/components/cyber-terminal-card.test.tsx` verificando renderizado de telemetría de código, biselado táctico, led de estado y atributos accesibles.

- [ ] **Step 2: Ejecutar test para verificar fallo**
Run: `npm run test tests/components/cyber-terminal-card.test.tsx`
Expected: FAIL (módulo no existe).

- [ ] **Step 3: Implementar `CyberTerminalCard`**
Crear el componente con esquinas chamfered, cabecera de consola `[CORE // STATUS]`, indicador LED de pulso y haz reactivo al cursor.

- [ ] **Step 4: Ejecutar test para verificar pase**
Run: `npm run test tests/components/cyber-terminal-card.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
`git add src/components/shared/CyberTerminalCard.tsx tests/components/cyber-terminal-card.test.tsx`
`git commit -m "feat(ui): crear componente CyberTerminalCard con chasis biselado y telemetria"`

---

### Task 2: Integración de `CyberTerminalCard` en el Hero y Capacidades

**Files:**
- Modify: `src/components/Hero/OptimusScaleHero.tsx`
- Test: `tests/components/optimus-hero-cyber.test.ts`

**Interfaces:**
- Consumes: `CyberTerminalCard` de Task 1

- [ ] **Step 1: Escribir el test que falla**
Crear `tests/components/optimus-hero-cyber.test.ts` verificando que el Hero usa los terminales cibernéticos en su cuadrícula de capacidades.

- [ ] **Step 2: Ejecutar test para verificar fallo**
Run: `npm run test tests/components/optimus-hero-cyber.test.ts`
Expected: FAIL.

- [ ] **Step 3: Actualizar `OptimusScaleHero.tsx`**
Reemplazar las tarjetas de capacidades estándar con `CyberTerminalCard`, agregando pistas de telemetría por ranura.

- [ ] **Step 4: Ejecutar test para verificar pase**
Run: `npm run test tests/components/optimus-hero-cyber.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
`git add src/components/Hero/OptimusScaleHero.tsx tests/components/optimus-hero-cyber.test.ts`
`git commit -m "feat(hero): integrar terminales ciberneticos en cuadricula de capacidades"`

---

### Task 3: Retícula de Perspectiva Cibernética en `PremiumBackground`

**Files:**
- Modify: `src/components/Effects/PremiumBackground.tsx`
- Test: `tests/components/cyber-background.test.ts`

**Interfaces:**
- Produces: Cyber-grid acelerado por GPU con horizonte con gradiente de profundidad y partículas fotónicas calibradas.

- [ ] **Step 1: Escribir el test de estructura de fondo**
Crear `tests/components/cyber-background.test.ts` verificando la presencia de las capas tácticas de retícula y partículas.

- [ ] **Step 2: Ejecutar test para verificar fallo**
Run: `npm run test tests/components/cyber-background.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar Cyber-Grid en `PremiumBackground.tsx`**
Añadir la perspectiva 3D con degradado hacia el horizonte y partículas fotónicas discretas en modo oscuro.

- [ ] **Step 4: Ejecutar test para verificar pase**
Run: `npm run test tests/components/cyber-background.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
`git add src/components/Effects/PremiumBackground.tsx tests/components/cyber-background.test.ts`
`git commit -m "feat(effects): agregar reticula de perspectiva cibernetica a PremiumBackground"`

---

### Task 4: Verificación Integral del Sistema y Cero Errores

**Files:**
- Verify: Todas las suites de pruebas y TypeScript

- [ ] **Step 1: Ejecutar la suite completa de tests**
Run: `npm run test`
Expected: PASS (todos los tests pasando).

- [ ] **Step 2: Ejecutar typecheck de TypeScript**
Run: `npm run typecheck`
Expected: PASS (cero errores de tipo).

- [ ] **Step 3: Commit final de consolidación**
`git commit --allow-empty -m "chore: consolidar rediseño estetico cyber-terminal verificado"`
