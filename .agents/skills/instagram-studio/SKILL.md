---
name: instagram-studio
description: Motor editorial minimalista para Instagram (13 flujos unificados + 5 herramientas locales de medición y humanización, bilingüe ES-AR + EN). Usar cuando el usuario pida armar Reels (/ig-reel), captions (/ig-caption), carruseles (/ig-carousel), limpiar textos IA (/ig-human), auditar perfil (/ig-profile), analizar hooks virales (/ig-viral), plan semanal (/ig-plan), historias (/ig-story), DMs (/ig-dm) o reutilizar contenido (/ig-repurpose).
---

# Instagram Studio — ExePaginasWeb (Bilingüe ES-AR + EN)

Skill consolidada a partir de `Jakeschincariol/instagram-agent-skill` (MIT) y adaptada a la voz real, minimalista y anti-genérica de **Exequiel Echevarría (`ExePaginasWeb`, Est. 2025)**.

## 1. Paso Cero Obligatorio: Leer la Voz de Marca

Antes de redactar cualquier pieza, leé siempre:
- `.agents/instagram/voice.md`

Reglas inquebrantables:
1. **Nada genérico, cero hype de agencia, cero emojis decorativos.**
2. **Cero invención de datos:** Si un hook, caso o prueba necesita un número que el usuario no dio ni figura en `voice.md`, dejá literalmente `{{tu_numero}}` o `{{tu_metrica}}` y avisalo.
3. **Puerta de aprobación humana:** Esta skill produce bloques limpios listos para copiar/grabar. Nunca automatiza posteos, likes ni logins.
4. **Tope vigente de hashtags:** Máximo **5 hashtags** específicos al pie (actualización oficial de Instagram del 18 dic. 2025). Prohibido `#viral`, `#fyp`, `#parati`.

## 2. Los 13 Modos Operativos

| Comando / Modo | Entregable exacto |
| :--- | :--- |
| `/ig-reel` | 1 idea → 3 hooks de las 26 fórmulas (`hooks.json` / `src/core/domain/instagram/hookFormulas.ts`) puntuados, texto en pantalla (≤6 palabras), guion oral (155 ppm) y Beat Sheet cronometrado. |
| `/ig-caption` | Caption auditado mostrando en caja exacta los **125 caracteres visibles** antes del `... más`, 1 solo llamado a la acción y ≤5 hashtags de nicho. |
| `/ig-human` | Pasada triple (caracteres Unicode invisibles + tipografía mecánica `—` + lexicón slop ES/EN) y score de 5 señales antes de entregar. |
| `/ig-carousel` | Secuencia de 5–8 láminas `1080x1350`: portada que gana el deslizamiento, una idea por lámina, cierre accionable. |
| `/ig-viral` | Clasificación de referentes por **múltiplo sobre la mediana de cada cuenta** (`swipe.py`), nunca por vistas brutas. |
| `/ig-profile` | Auditoría sobre 100 puntos (`rubric.json`) y reescritura en orden de mayor impacto. |
| `/ig-plan` | Grilla semanal minimalista: qué grabar, formato, objetivo (alcance / autoridad / conversión) y cuentas reales para interactuar. |
| `/ig-story` | Secuencia diaria breve (3–4 historias) con interacción real que abre conversación por DM. |
| `/ig-comment` | Comentarios con sustancia técnica en posts de colegas/clientes potenciales. Prohibido "🔥🔥🔥". |
| `/ig-reply` | Respuestas ordenadas por prioridad: `keyword / lead -> pregunta técnica -> aporte -> soporte`. |
| `/ig-dm` | Entrega limpia de recurso por palabra clave (`SISTEMA` / `TURNOS`), primer mensaje sin presión y máximo 2 seguimientos. |
| `/ig-repurpose` | 1 demo, artículo o caso técnico → piezas autónomas (Reels + Carrusel). |
| `/ig-audit` | Post-mortem de piezas ya publicadas midiendo envíos/alcance y retención de los primeros 3 segundos. |

## 3. Herramientas Locales Ejecutables

Disponibles en **TypeScript puro** (`src/core/domain/instagram/`, integrado también en vivo en `/dashboard?tab=instagram`) y en **Python offline** (`.agents/skills/instagram-studio/scripts/`):

```bash
# Puntuar hooks y cronometrar guion (155 ppm para español rioplatense)
python3 .agents/skills/instagram-studio/scripts/hookscore.py --hook "Nadie te dice que anotar 40 turnos por WhatsApp te cuesta clientes."
python3 .agents/skills/instagram-studio/scripts/beats.py guion.txt --wpm 155 --target 30

# Ver recorte exacto a 125 caracteres y auditar caption
python3 .agents/skills/instagram-studio/scripts/caption.py caption.txt --keywords "turnos,sistemas web"

# Limpiar huella de IA y medir score humano
python3 .agents/skills/instagram-studio/scripts/humanize.py borrador.txt --report
python3 .agents/skills/instagram-studio/scripts/detect.py borrador.txt
```
