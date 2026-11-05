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

- [`bug_report.yml`](.github/ISSUE_TEMPLATE/bug_report.yml) — para problemas replicables
- [`feature_request.yml`](.github/ISSUE_TEMPLATE/feature_request.yml) — para mejoras y novedades
- [`refactor.yml`](.github/ISSUE_TEMPLATE/refactor.yml) — para restructuraciones con alcance definido

Los labels de triage indican el estado: `needs-triage` → `ready-for-agent` /
`ready-for-human` → cerrado.

### 2. Creá tu rama

```bash
git switch main
git pull --ff-only origin main
git switch -c feat/mi-mejora
```

Usá una rama por cambio y no trabajes directamente sobre `main`. Convención de
ramas: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/` o `test/`, seguida de un
nombre corto en kebab-case, por ejemplo `fix/mobile-nav-focus`.

### 3. Escribí código con los estándares del repo

- Seguí las [convenciones de nombres](docs/engineering/naming-conventions.md)
  para TypeScript, JavaScript y SQL; respetá el glosario y no renombres schema
  publicado sin un plan de compatibilidad.
- **TypeScript estricto** — `npm run typecheck` debe pasar.
- **Lint** — `npm run lint`; no agregues warnings nuevos.
- **Tests** — `npm test`; los módulos de lógica llevan unit tests (Vitest).
- Antes de abrir el PR, ejecutá `npm run typecheck`, `npm run lint` y `npm test`.
  Para cambios que afecten el build, ejecutá también `npm run build`.
- Cada commit debe representar un cambio coherente y usar **Conventional Commits**:

  ```text
  feat(dashboard): añadir métricas de SLA
  fix(auth): resolver expiración de sesión
  docs: aclarar el flujo de pull requests
  ```

  Usá presente e imperativo, descripción breve y, si aporta contexto, un scope.
  Evitá commits `WIP`, mensajes genéricos y mezclar cambios sin relación.

### 4. Ajustes de formato

El repo usa Prettier + lint-staged. Pre-commit se encarga del formato
automáticamente.

### 5. Abrí el Pull Request

Usá el [template de PR](.github/PULL_REQUEST_TEMPLATE.md), apuntá a `main`,
vinculá el issue relacionado y adjuntá capturas cuando el cambio sea visual.
El título del PR también debe seguir **Conventional Commits**, porque GitHub lo
usa como base del commit creado por squash; verificá el título final antes de
fusionar.
El workflow **Verify Build** ejecuta `npm audit --audit-level=high`, además de
lint, tipos, tests, build, Playwright y el CLI. El umbral bloquea vulnerabilidades
altas y críticas; revisá también los advisories moderados y registrá los que
queden pendientes. No fusiones mientras algún check requerido esté fallando.

Integrá el PR con **squash merge** y eliminá la rama después de fusionar. Así
`main` conserva un commit claro por cambio. No reescribas ni fuerces el historial
de `main`; para corregir algo ya publicado, usá un nuevo commit o un PR de
reversión.

La exigencia de PR y checks se configura en GitHub, no en este archivo. En
**Settings → Rules → Rulesets**, aplicá una regla a `main` que requiera PR y
los checks `build`, `playwright` y `cli` del workflow **Verify Build**, y que
bloquee force-push y borrado de la rama. Verificá esos nombres contra los checks
que muestre GitHub al guardar la regla.

## Entorno local

Ver [`README.md`](README.md) — sección _Stack y Arquitectura_. Variables
requeridas en `.env.example`. Nunca commiteés `.env*` reales.

## Preguntas

Abrí un issue con label `question` o escribí por el canal de contacto del
sitio ([exepaginasweb.com](https://exepaginasweb.com)).
