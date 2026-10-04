# AGENTS

## Agent skills

### Issue tracker

Issues tracked on GitHub (`ExeDevCentral/ExePaginasweb`). See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles mapped to GitHub labels. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo (one `CONTEXT.md` + `GLOSSARY.md` + `docs/adr/` at the root). See `docs/agents/domain.md`.

### 4 Principios de Ingeniería Real (Matt Pocock)

1. **Identidad & Alineación**: Autoría directa de Exequiel Echevarría (Software & Web Architect). Sin agencias intermediarias ni código adivinado.
2. **Vocabulario Ubicuo**: Adherencia estricta a `GLOSSARY.md` y `CONTEXT.md`.
3. **Calidad & Robustez**: TDD, BigInt monetario, cero errores de tipo y tests pasando.
4. **Módulos Profundos**: Interfaces compactas y simples hacia afuera con alta potencia interna (Deep Modules).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
