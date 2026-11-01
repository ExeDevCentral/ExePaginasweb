# Navbar & MegaPanel — Plan de Pulido de Detalles

> **Estado:** propuesto
> **Fecha:** 2026-11-01
> **Alcance:** `LiquidIslandNavbar`, `NavLink`, `MagneticCTA`, `MegaPanel`, `LanguageSwitcher`, `ThemeToggle`
> **Base:** `main` @ `81af44c`

## Objetivo

Llevar la navegación de "funciona" a "se siente terminada": que no se corte nada, que nada se superponga, que los espaciados sean consistentes y que el panel se comporte bien en mobile, tablet y desktop. El foco son los **detalles**: bordes, alineaciones, tamaños de icono, estados de foco, truncados y comportamiento del panel.

## Estado de implementación

Actualizado el 2026-11-01.

| Tarea | Estado | Detalle |
|-------|--------|---------|
| 1. MegaPanel: altura y scroll | Hecho | `max-h` con `100dvh`, `min-h-0`, `overscroll-contain`, z-index por encima del chat flotante |
| 2. Índice vs. tags | Hecho | Se eliminó el índice absoluto `ESTIMATE // 06` / `PLANS // 07` (redundante con el `kbd`) |
| 3. Navbar mobile | Hecho | Logo sin márgenes negativos, CTA con 12 px de aire, burger 40×40, ES 40 px |
| 4. Footer del MegaPanel | Hecho | `flex-wrap` en autor y badge, botones `whitespace-nowrap` + `truncate`, atajos ocultos en mobile |
| 5. Aire interno y alineación | Parcial | Badge reducido y CTA alineado a 17 px en desktop; faltan iconos de utilidades |
| 6. Estado activo y scroll-spy | Parcial | Contacto con `IntersectionObserver` y `aria-current="location"`; falta `/portafolio/[slug]` |
| 7. Jerarquía de la barra | Hecho | Badge a `text-[9px]` y menor contraste |
| 8. Búsqueda y teclado | Ya existía | Esc, ↑↓, ↵, 1–7, click fuera y ⌘K global |
| 9. Accesibilidad | Parcial | Focus trap, retorno de foco y `aria-modal`; falta revisar reduced-motion del clip-path |
| 10. Micro-consistencia | Parcial | Truncados y hover/focus revisados; radios y sombras sin auditar |


## Evidencia relevada

Capturas a 390, 768, 1024 y 1440 con el panel abierto:

| # | Dónde | Qué se ve |
|---|-------|-----------|
| 1 | Navbar 390px | El logo queda recortado por el borde redondeado de la píldora. |
| 2 | Navbar 390px | El CTA "COTIZÁ TU WEB" toca el borde derecho; el bloque ES + burger + CTA queda sin aire. |
| 3 | Navbar 1024px | El CTA chaflanado llega al borde de la píldora (padding insuficiente). |
| 4 | MegaPanel 390px | El panel arranca debajo del navbar pero el contenido superior queda tapado; la 4ª card se corta. |
| 5 | MegaPanel 768px | La última fila de "Herramientas directas" queda cortada por el footer del panel. |
| 6 | MegaPanel 1440px | Los índices `ESTIMATE // 06` y `PLANS // 07` se superponen con los tags del pie de cada card. |
| 7 | MegaPanel 390/768px | El footer aprieta: "Exequiel Echevarría" y "Full-Stack · React / TypeScript" se parten en 2 líneas; "Hablar por WhatsApp" también. |
| 8 | MegaPanel 390px | Los atajos de teclado (`1–7 acceso directo`) se cortan. |
| 9 | Navbar desktop | "Contacto" nunca queda activo; no hay scroll-spy de `#contact`. |
| 10 | Navbar desktop | Theme toggle (luna) queda chico y desalineado entre ES y el CTA. |

## Restricciones

- No romper la suite: hoy **225 tests** en verde (`npx vitest run`).
- `npx tsc --noEmit` sin errores.
- Paridad claro/oscuro y `prefers-reduced-motion`.
- i18n: no hardcodear textos nuevos; usar `t()` con fallback.
- Sin cambios de ruteo ni de lógica de negocio.
- Touch targets ≥ 44×44 px en mobile.

## Orden de trabajo

### P0 — Nada se corta ni se superpone

#### Task 1: MegaPanel con altura y scroll correctos

**Archivos:** `src/components/layout/LiquidIsland/MegaPanel.tsx:414-500`

- [ ] Cambiar el contenedor del panel a `max-h-[min(85vh,calc(100dvh-88px))]` y `top` consistente con la altura real del navbar (hoy `top-16 sm:top-20`).
- [ ] Asegurar que el área de cards (`overflow-y-auto flex-1`) tenga `min-h-0` para que el scroll funcione dentro de flex.
- [ ] Verificar que el footer y la barra de atajos queden siempre visibles y que la última card se pueda scrollear completa.
- [ ] En mobile, el panel no debe tapar el navbar ni salirse del viewport con `100dvh`.
- **Aceptación:** a 390 y 768, la última card se ve completa al scrollear y el footer no la tapa.

#### Task 2: Índice de card vs. tags

**Archivos:** `src/components/layout/LiquidIsland/MegaPanel.tsx:638-643` y bloque de tags de la card

- [ ] Sacar el índice absoluto del `bottom-3 right-3` o reservarle espacio al pie de la card (`pr-14`).
- [ ] Unificar el formato: `ESTIMATE // 06` y `PLANS // 07` deberían ser el mismo patrón que el resto (`ENGINE // READY`).
- [ ] Truncar tags largos con `truncate` o `line-clamp-1`.
- **Aceptación:** ningún índice se monta sobre texto a 1024, 1200 ni 1440.

#### Task 3: Navbar mobile sin recortes

**Archivos:** `src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx:99-131, 244-271`, `NavLogo.tsx`

- [ ] Dar al logo `shrink-0` y un `min-w` real; revisar que el SVG no exceda la píldora a 360–390 px.
- [ ] Bajar el CTA a `size="sm"` en `< sm` o reducir padding horizontal para dejar 12 px de aire contra el borde.
- [ ] Asegurar 44×44 px en burger y language switcher.
- [ ] Ocultar el label "ES" en `< 380 px` si hace falta (solo bandera).
- **Aceptación:** a 360 y 390 no hay recorte ni scroll horizontal.

#### Task 4: Footer del MegaPanel responsive

**Archivos:** `src/components/layout/LiquidIsland/MegaPanel.tsx:763-828`

- [ ] Autor: `truncate` en nombre y badge; en mobile, badge en línea propia con `w-full`.
- [ ] Botones: en mobile, `grid grid-cols-1` a ancho completo; en `sm`, fila.
- [ ] `Hablar por WhatsApp` con `whitespace-nowrap` y texto que no se parta.
- [ ] Barra de atajos: `hidden sm:flex` o `flex-wrap` para que no se corte a 390.
- **Aceptación:** footer de 2 filas legible a 390 px, sin textos partidos.

### P1 — Jerarquía y consistencia del navbar

#### Task 5: Aire interno y alineación

**Archivos:** `LiquidIslandNavbar.tsx:99-105`, `MagneticCTA.tsx`, `HudButton.tsx`

- [ ] Igualar el inset derecho del CTA al izquierdo del logo (hoy el chaflán toca el borde).
- [ ] Revisar `gap` entre bloques: logo · links · utilidades · CTA.
- [ ] Alinear verticalmente iconos y texto (theme toggle vs. ES vs. CTA).
- [ ] Unificar tamaño de iconos de utilidades (17–18 px) y `strokeWidth`.
- **Aceptación:** a 1024, 1200 y 1440 los cuatro bloques respiran con el mismo ritmo.

#### Task 6: Estado activo y scroll-spy

**Archivos:** `LiquidIslandNavbar.tsx:206-221`, `NavLink.tsx`

- [ ] "Contacto" activo cuando `pathname === '/'` y `#contact` está en viewport (IntersectionObserver o `useScroll`).
- [ ] "Casos de Éxito" activo también en `/portafolio/[slug]` si aplica.
- [ ] Estado activo con `aria-current="page"`.
- **Aceptación:** el link correspondiente se marca al navegar y al scrollear a contacto.

#### Task 7: Jerarquía de la barra

**Archivos:** `LiquidIslandNavbar.tsx:226-271`

- [ ] El badge "DISPONIBLE // 2026" compite con el CTA: bajarlo a `text-[9px]`, menos contraste o moverlo al MegaPanel.
- [ ] Theme toggle: botón de 36–40 px con hover consistente.
- [ ] Language switcher: mismo alto que theme toggle; chevron alineado.
- **Aceptación:** el CTA es el único elemento dominante de la barra.

### P2 — Detalles finos

#### Task 8: Búsqueda y teclado del MegaPanel

**Archivos:** `MegaPanel.tsx:460-500, 830-860`

- [ ] Botón "limpiar" visible cuando hay query.
- [ ] `Ctrl/Cmd + K` abre el panel desde cualquier página (si no está ya).
- [ ] Flechas/Enter/Esc con foco visible y sin robar scroll.
- [ ] Anillo de foco en el input consistente con el resto.

#### Task 9: Accesibilidad

- [ ] `role="dialog"` + `aria-modal` en el panel.
- [ ] Focus trap mientras está abierto y retorno del foco al trigger al cerrar.
- [ ] Cerrar con click fuera y con `Esc`.
- [ ] `prefers-reduced-motion`: sin spring en blobs ni clip-path animado.

#### Task 10: Micro-consistencia visual

- [ ] Radios: píldora navbar `rounded-full`, panel `rounded-2xl`, cards `rounded-xl`.
- [ ] Bordes y sombras iguales en claro/oscuro.
- [ ] Hover y focus con la misma duración (`200ms`) en links, cards y botones.
- [ ] Truncados: títulos de card a 2 líneas, descripciones a 2, tags a 1.

## Verificación

- [ ] `npx tsc --noEmit`
- [ ] `npx vitest run` → 225+ en verde
- [ ] `npx eslint . --max-warnings 50`
- [ ] Capturas Playwright a **360, 390, 768, 1024, 1200, 1440, 1920** con panel cerrado y abierto
- [ ] Chequeo manual: teclado (Tab/Shift+Tab/Esc/Enter), claro y oscuro, reduced motion
- [ ] Sin scroll horizontal en ningún breakpoint

## Tests sugeridos

- `tests/components/navbar-structure.test.tsx`: links presentes, `aria-current`, 44 px touch targets.
- `tests/components/megapanel-a11y.test.tsx`: `role="dialog"`, `aria-modal`, foco inicial y cierre con Esc.
- `tests/components/megapanel-search.test.ts`: filtrado, estado vacío y limpiar búsqueda.

## Fuera de alcance

- Rediseño visual completo del navbar.
- Cambios de contenido o de rutas.
- Migración de Framer Motion a CSS.
