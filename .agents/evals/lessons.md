# Agent Evals & Lessons Learned Ledger

Registro vivo de errores detectados por agentes (`builder`, `auditor`, `verifier`, `evaluator`).
**Regla de oro:** Si un patrón de error ocurre 2 veces, se promueve automáticamente a un guardrail físico en `scripts/audit-guardrails.mjs` o `eslint.config.js`.

## Invariantes Base Promovidos a Guardrails Físicos

| Regla | Mecanismo | Estado |
| :--- | :--- | :--- |
| Prohibido `@ts-ignore` / `@ts-nocheck` | `scripts/audit-guardrails.mjs` (`no-ts-suppression`) | Activo (Error) |
| Prohibido `debugger` en código | `scripts/audit-guardrails.mjs` (`no-debugger`) | Activo (Error) |
| Prohibido secretos hardcodeados | `scripts/audit-guardrails.mjs` (`no-hardcoded-secrets`) + `audit:keys` | Activo (Error) |
| Prohibido `useEffect` injustificado en archivos nuevos/editados | `scripts/audit-guardrails.mjs --changed` (`no-unjustified-use-effect`) | Activo (Error en diff / Warn en legacy) |
| Prohibido `console.log` en producción en archivos nuevos/editados | `scripts/audit-guardrails.mjs --changed` (`no-prod-console-log`) | Activo (Error en diff / Warn en legacy) |
| Año oficial de origen/copyright estrictamente `2025` | `AGENTS.md` + `tests/components/honest-ownership-audit.test.ts` | Activo (Test) |
| Precisión monetaria con `BigInt` | `AGENTS.md` + `src/core/domain/financial/financialEngine.test.ts` | Activo (Test) |

## Historial de Evaluaciones (Runs)

| Fecha | Tarea | Iteraciones | Score | Falla detectada | Acción / Promoción |
| :--- | :--- | :---: | :---: | :--- | :--- |
| 2026-11-21 | Bootstrap sistema multi-agente (3 pilares) | 1 | 100/100 | Ninguna | Creados `verify-loop.mjs`, `audit-guardrails.mjs` y skill `autonomous-agent-loop` |
