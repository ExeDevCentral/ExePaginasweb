# Contributing

¡Gracias por tu interés en contribuir a **ExePaginasWeb**! Este repositorio es
un proyecto SaaS real en producción, así que seguimos un proceso simple y
riguroso.

## Código de conducta

Sé respetuoso y constructivo. Toda contribución — issue, PR o comentario —
debe sumar valor al proyecto.

## Cómo contribuir

### 1. Reportá un bug o pedí una feature

Abrí un issue usando los templates:

- [`bug_report.yml`](ISSUE_TEMPLATE/bug_report.yml) — para problemas replicables
- [`feature_request.yml`](ISSUE_TEMPLATE/feature_request.yml) — para mejoras y novedades
- [`refactor.yml`](ISSUE_TEMPLATE/refactor.yml) — para restructuraciones con alcance definido

Los labels de triage indican el estado: `needs-triage` → `ready-for-agent` /
`ready-for-human` → cerrado.

### 2. Creá tu rama

```bash
git checkout main
git pull
git checkout -b feat/mi-mejora
```

Convención de ramas: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`.

### 3. Escribí código con los estándares del repo

- **TypeScript estricto** — `npm run typecheck` debe pasar.
- **Lint limpio** — `npm run lint` sin warnings.
- **Tests** — `npm test`; los módulos de lógica llevan unit tests (Vitest).
- Commits con **Conventional Commits**:

  ```
  feat(dashboard): añadir métricas de SLA al panel
  fix(auth): resolver fuga de sesión en middleware
  ```

### 4. Ajustes de formato

El repo usa Prettier + lint-staged. Pre-commit se encarga del formato
automáticamente.

### 5. Abrí el Pull Request

Usá el [template de PR](PULL_REQUEST_TEMPLATE.md). La branch protection de
`main` exige que pase el workflow **Verify Build** (lint, typecheck, tests,
audit y build) antes de mergear. Se mergea con **squash** y la rama se elimina
automáticamente al mergear.

## Entorno local

Ver [`README.md`](../README.md) — sección *Stack y Arquitectura*. Variables
requeridas en `.env.example`. Nunca commiteés `.env*` reales.

## Preguntas

Abrí un issue con label `question` o escribí por el canal de contacto del
sitio ([exepaginasweb.com](https://exepaginasweb.com)).