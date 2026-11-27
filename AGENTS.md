# AGENTS

## Agent skills

### Naming conventions

Follow [`docs/engineering/naming-conventions.md`](docs/engineering/naming-conventions.md)
for JavaScript/TypeScript and PostgreSQL identifiers. Preserve persisted schema
names unless the change includes a compatibility migration.

### Issue tracker

Issues tracked on GitHub (`ExeDevCentral/ExePaginasweb`). See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles mapped to GitHub labels. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo (one `CONTEXT.md` + `GLOSSARY.md` + `docs/adr/` at the root). See `docs/agents/domain.md`.

### 4 Principios de Ingeniería Real (Matt Pocock)

1. **Identidad & Alineación**: Autoría directa de Exequiel Echevarría (Software & Web Architect). Sin agencias intermediarias ni código adivinado. **ExePaginasWeb nace en 2025**; su año de origen, fundación y copyright oficial es estrictamente 2025.
2. **Vocabulario Ubicuo**: Adherencia estricta a `GLOSSARY.md` y `CONTEXT.md`.
3. **Calidad & Robustez**: TDD, BigInt monetario, cero errores de tipo y tests pasando.
4. **Módulos Profundos**: Interfaces compactas y simples hacia afuera con alta potencia interna (Deep Modules).

### Arquitectura Dune & Flujo Multi-Agente Diario (Activación Automática)

**Camino más corto = Camino correcto** (`TAREA -> REGLAS -> IMPORTS -> CHECK CI -> ACEPTAR / BLOQUEAR`):

- **Auto-activación obligatoria según tipo de tarea** (leer la `SKILL.md` correspondiente en `.agents/skills/` automáticamente sin que el usuario lo pida):
  - **UI / Estilos / Heroes / Navbars / Landing / Animaciones**: `frontend-design`, `ui-ux-pro-max`, `taste-design`, `better-layout`, `better-ui`, `shadcn-ui`, `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-view-transitions`, `web-design-guidelines`, `accessibility-engineering`.
  - **Features complejas / Refactors / Auditorías multi-agente**: `autonomous-agent-loop`, `constraint-driven-development`, `codebase-design`, `domain-modeling`, `code-review-and-quality`.
  - **Bugs / Errores / Regresiones**: `diagnose` / `systematic-debugging` + `tdd`.
  - **Seguridad / APIs / Auth / Pagos**: `security-and-hardening` + `supabase-migration-checker` / `supabase-postgres-best-practices`.
  - **Performance / Core Web Vitals**: `performance-optimization` + `vercel-react-best-practices`.
  - **Contenido Orgánico / Reels / Copywriting Minimalista**: `instagram-studio` + `.agents/instagram/voice.md` (cero datos inventados, cero slop IA, voz directa ES-AR).
  - **Evals & Mejora de Skills**: `promptfoo-evals`, `skill-creator`, `.agents/evals/lessons.md`.
- **Feedback Loop obligatorio (económico y automático antes de cerrar cualquier tarea con código)**:
  1. Elegir **Tier mínimo** (1 agente por defecto; máx. 2–3 workers en `/teamwork`) e iterar primero con tests puntuales y checks `--changed`.
  2. Correr `npm run verify:loop` (`typecheck` + `eslint` + `audit:guardrails --changed` + `audit:imports --changed` + `vitest`) y auto-corregir en bucle hasta `PASS | Score: 100/100` (**Circuit Breaker**: máx. 3–5 reintentos; si el mismo error repite 3 veces, frenar y usar `diagnose`).
  3. Si el cambio afecta UI/visual, verificar **una sola vez al final** con el subagente `browser` (modelo `flash`, 0 errores de consola + responsive).
  4. Si es un cambio crítico o release, correr `npm run verify:full` y `npm run evals:agents` una sola vez al cierre.
- **Fronteras de Imports (`audit:imports`)**: `src/core/domain/` es TypeScript puro (sin React, Next, Supabase ni `infra`); `src/components/` no importa repositorios DB ni `app/api/`; `src/shared/` es capa hoja.
- **Agent Evals (`npm run evals:agents`)**: valida que las barreras físicas bloqueen regresiones. Toda falla recurrente se registra en `.agents/evals/lessons.md` y se promueve a regla física.

<!-- markdownlint-disable MD025 -->
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
