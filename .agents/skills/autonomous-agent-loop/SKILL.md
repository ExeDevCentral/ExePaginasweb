---
name: autonomous-agent-loop
description: Multi-agent autonomous engineering system combining Feedback Loops, Agent Evals, and Physical Guardrails. Use when executing complex features, refactors, audits, or bugfixes that require parallel Builder, Auditor, Tester/Browser, and Evaluator agents retrying until all verification gates pass.
---

# Autonomous Multi-Agent Loop (SpaceX 3-Pillar Architecture)

Sistema operativo multi-agente para `ExePaginasweb` diseñado para iterar de forma autónoma hasta obtener el resultado deseado sin microgestión manual.

## Arquitectura de 4 Roles (Swarm / Subagents)

Cuando se ejecuta una tarea compleja con `/teamwork`, `/goal` o `swarm`:

1. **`builder` (Implementador — `workspace: "share"`)**
   - Implementa la solución siguiendo `AGENTS.md`, `GLOSSARY.md`, `CONTEXT.md` y TDD.
   - Ejecuta `npm run verify:loop` después de cada cambio.
   - Si algún gate falla, lee el reporte estructurado y se auto-corrige en bucle (máx. 5 iteraciones) hasta lograr `Score: 100/100`.
2. **`auditor` (Auditor de Arquitectura y Seguridad — `workspace: "inherit"`, solo lectura)**
   - Revisa `git diff` contra:
     - Vocabulario ubicuo (`GLOSSARY.md`) y dominio (`CONTEXT.md`).
     - Invariantes de `AGENTS.md` (autoría directa, año 2025, BigInt monetario, Deep Modules).
     - Seguridad (RLS, validación Zod, secretos, endpoints API).
     - Calidad de código (sin sobre-ingeniería, sin `useEffect` injustificados, sin `@ts-ignore`).
   - Devuelve veredicto `APPROVE` o `CHANGES_REQUESTED` con lista puntual de archivo:línea.
3. **`verifier` (Tester & Verificador Visual — `browser` subagent + Playwright)**
   - Ejecuta pruebas de integración/E2E (`npm run verify:full` si corresponde).
   - Si el cambio afecta UI, levanta/usa `localhost:3000` y delega al subagente `browser` para:
     - Navegar las rutas afectadas.
     - Probar flujos reales (clicks, formularios, navegación).
     - Verificar 0 errores en consola y layout desktop/mobile.
4. **`evaluator` (Agent Evals — Mejora Continua)**
   - Puntúa la ejecución (0–100) en 4 ejes:
     - **Correctitud funcional** (0–35)
     - **Guardrails & Seguridad** (0–25)
     - **Tests & Cobertura** (0–25)
     - **Alineación arquitectónica** (0–15)
   - Si hubo algún fallo o reintento durante la corrida, registra una entrada en `.agents/evals/lessons.md`.
   - **Regla de promoción (Error -> Guardrail/Skill)**: si un mismo tipo de error ocurre 2 veces, el `evaluator` lo promueve a una regla física en `scripts/audit-guardrails.mjs`, `eslint.config.js` o en una skill de `.agents/skills/`.

## Protocolo del Bucle de Reintento (Feedback Loop)

```text
1. Leer `.agents/evals/lessons.md` para no repetir errores pasados.
2. Builder implementa + corre `npm run verify:loop` hasta PASS (100/100).
3. En paralelo:
   - Auditor revisa el diff (arquitectura, seguridad, dominio).
   - Verifier valida tests E2E y UI real con `browser` subagent.
4. Si Auditor o Verifier rechazan:
   - Volver al paso 2 con el feedback exacto (máx. 3 rondas de revisión).
5. Cuando Builder + Auditor + Verifier aprueban:
   - Evaluator puntúa el run y actualiza `.agents/evals/lessons.md` si hubo aprendizajes.
```

## Comandos de Verificación

- `npm run verify:loop` — Loop rápido (`typecheck` + `lint` + `guardrails --changed` + `vitest`).
- `npm run verify:full` — Loop completo (+ `next build` + `playwright test`).
- `npm run audit:guardrails` — Escaneo completo de barreras físicas en `src/` y `app/`.
- `node scripts/audit-guardrails.mjs --changed --json` — Salida JSON estricta sobre archivos modificados.
