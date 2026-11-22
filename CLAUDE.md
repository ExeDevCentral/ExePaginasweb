# CLAUDE.md — ExePaginasweb

## 🤖 Agent Skills & Disciplina de Ingeniería

### 1. Issue Tracker

Issues tracked on GitHub (`ExeDevCentral/ExePaginasweb`). See `docs/agents/issue-tracker.md`.

### 2. Triage Labels

Five canonical roles mapped to GitHub labels. See `docs/agents/triage-labels.md`.

### 3. Domain Docs & Vocabulario Ubicuo

Single-context repo:

- `CONTEXT.md` (Contexto arquitectónico y SaaS multi-tenant)
- `GLOSSARY.md` (Vocabulario ubicuo no negociable)
- `docs/adr/` (Decisiones de arquitectura)

See `docs/agents/domain.md`.

### 4. Los 4 Principios de Matt Pocock (Ingeniería Real vs Vibe Coding)

1. **Identidad & Alineación**: Autoría directa de **Exequiel Echevarría — Software & Web Architect**. Sin agencias ficticias ni componentes corporativos inflados.
2. **Vocabulario Ubicuo**: Adherencia estricta a `GLOSSARY.md`. Casos de prueba reales en producción (ej. `RESTOia Engine`).
3. **Calidad & Robustez**: TDD, BigInt en finanzas, cero errores de tipo y 100% de tests pasando.
4. **Módulos Profundos**: Interfaces públicas compactas y limpias hacia afuera con gran potencia interna (Deep Modules).

## 🚀 Comandos Principales & Auto-Verificación (Arquitectura Dune)

- `npm run dev`: Servidor de desarrollo Next.js.
- `npm run verify:loop`: Feedback loop automático obligatorio (`typecheck` + `eslint` + `audit:guardrails --changed` + `audit:imports --changed` + `vitest`).
- `npm run verify:full`: Pipeline completo (+ `next build` + `playwright test`).
- `npm run evals:agents`: Auto-test de guardrails y fronteras de imports.
- `npm test` / `npm run typecheck` / `npm run lint`: Checks individuales.

Ver `AGENTS.md` para la tabla de auto-activación automática de skills (`.agents/skills/`) según el tipo de tarea.
