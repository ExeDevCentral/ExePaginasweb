# Especificación de Diseño: Navegación de Alta Ingeniería, Scroll Fluido y Auditoría de Servicios (Estilo Linear / Vercel)

- **Fecha**: 2026-10-06
- **Autor**: Exequiel Echevarría (Software & Web Architect) — ExePaginasWeb (Fundado en 2025)
- **Estado**: Aprobado por el usuario
- **Clasificación**: Architectural

---

## 1. Resumen Ejecutivo y Objetivos

El objetivo de esta intervención es elevar la experiencia de navegación e interacción del sitio `ExePaginasWeb` al nivel de los productos de software de mayor prestigio internacional (**Linear, Vercel, Stripe, Raycast**).

Se detectaron cuatro áreas de fricción fundamentales:
1. **Conflicto de Scroll**: Competencia destructiva entre `CSS scroll-snap` y el motor de inercia `Lenis`, generando tirones, resistencia al avance y saltos forzados.
2. **Inestabilidad del Navbar**: Deformaciones elásticas (`skewX`, `scaleY`) y cambios continuos de ancho en la barra flotante que restaban solidez arquitectónica.
3. **Navegación Ancla Imprecisa**: Saltos no compensados a los identificadores de sección (`#contact`, etc.) respecto a la barra fija superior.
4. **Saturación Visual**: Animaciones infinitas continuas y auras difusas sobredimensionadas que generaban fatiga visual y sobrecarga de GPU.
5. **Robustez de Servicios Externos**: Requerimiento de certificar la integridad de las claves y conexiones de Supabase, Resend y Google AI (Gemini).

---

## 2. Arquitectura de Navegación y Mecánica de Scroll

### 2.1. Desacople y Eliminación de Scroll-Snap Global
- **Archivo afectado**: `src/index.css`
- **Acción**:
  - Eliminar la propiedad `scroll-snap-type: y proximity` de `html`.
  - Eliminar `scroll-snap-align: start` y `scroll-snap-stop` de `section[id]`, `main > section`, `[data-scroll-section]`, `#hero` y `#hero-mobile`.
- **Resultado**: El viewport queda 100% liberado de amarres forzados. El contenido fluye de manera continua y natural.

### 2.2. Calibración del Motor de Inercia Lenis
- **Archivo afectado**: `src/components/shared/ScrollProvider.tsx`
- **Configuración de física**:
  - Duración: `0.9s`
  - Easing: Curva de desaceleración exponencial orgánica `(t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`
  - Multiplicador de rueda: `1.0` (relación 1:1 directa con la rueda del ratón y trackpad)
  - Soporte de accesibilidad: Se mantiene desactivado en dispositivos con `pointer: coarse` (móviles táctiles) y `prefers-reduced-motion: reduce`, donde rige el scroll nativo de 120Hz del sistema operativo.
  - Se mantiene la prevención de autoscroll en botón central del mouse (botón 1) sin interferir con la apertura de pestañas en enlaces.

### 2.3. Interceptor Universal de Anclajes y Desplazamiento Suave
- **Archivo afectado**: `src/components/shared/scrollUtils.ts` y enlaces en componentes de landing.
- **Mecanismo**:
  - Función centralizada `smoothScrollTo(targetSelectorOrY: string | number, offset = -88)`:
    - Si `Lenis` está disponible: invoca `lenis.scrollTo(target, { offset, duration: 0.85 })`.
    - Fallback: invoca `window.scrollTo({ top: targetTop + offset, behavior: 'smooth' })`.
  - El offset fijo de `-88px` compensa milimétricamente el navbar flotante (`top-3` + altura de barra + margen de respiro), garantizando que los encabezados queden perfectamente encuadrados.

---

## 3. Estabilidad y Cristal Arquitectónico del Navbar

### 3.1. Eliminación de Deformaciones Físicas (Anti-Jelly)
- **Archivo afectado**: `src/components/layout/LiquidIsland/useNavScroll.ts`
- **Acción**:
  - Eliminar los cálculos de `skewX` y `scaleY` vinculados a `scrollVelocity`.
  - La barra permanece rígida, horizontal y con geometría estricta sin importar la velocidad con la que el usuario scrollee.

### 3.2. Geometría Predecible y Transición de Estados
- **Archivos afectados**: `src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx`, `useNavScroll.ts`
- **Comportamiento**:
  - En desktop (`lg` en adelante), la barra mantiene un ancho armónico y consistente (sin colapsar los links a `width: 0` al scrollear 80px).
  - Estado en reposo (`scrollY <= 20`): Cristal traslúcido de integración sutil con el fondo.
  - Estado en scroll (`scrollY > 20`): Activación de cristal frosted arquitectónico (`backdrop-blur-xl`, fondo con opacidad balanceada al 85%, borde nítido de 1px y sombra de elevación mínima).
  - El aura gigante difusa (`blur-2xl` y opacidad del 95%) se atenúa a un micro-halo perimetral elegante que no mancha el contenido subyacente.

### 3.3. MegaPanel y Enlaces
- El MegaPanel mantiene su posición anclada bajo el botón "Soluciones", cerrándose limpiamente con la tecla `ESC`, clic externo o selección de opción.
- El enlace de "Contacto" navega hacia `#contact` mediante `smoothScrollTo` con aterrizaje exacto.

---

## 4. Sobriedad Visual y Micro-interacciones de Alta Ingeniería

### 4.1. Diseño Silencioso y Preciso
- Las animaciones en bucle perpetuo que distraen la atención se transforman en respuestas cinéticas interactivas: reaccionan exclusivamente al paso del cursor (hover) o al foco de teclado.
- Delimitación de módulos mediante micro-bordes de 1px:
  - Modo Oscuro: `border-slate-800` o `rgba(16, 185, 129, 0.2)`
  - Modo Claro: `border-[#DFD7CA]` con contraste cálido marfil.
- Duración de micro-interacciones: 150ms a 200ms con curva `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 5. Auditoría y Robustez de Claves y Servicios Externos

### 5.1. Matriz de Integraciones y Fallbacks Defensivos
1. **Google AI Studio (Gemini)**:
   - Variable: `GEMINI_API_KEY`.
   - Estado: Comprobada y operativa (acceso a modelos de Google AI Studio v1beta).
   - Resiliencia: Fallback al motor local heurístico en `/api/chat` en caso de latencia o falta de cuota.
2. **Supabase**:
   - Variables: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
   - Estado: Proyecto `bksonxnxshxinqffswqc.supabase.co`.
   - Resiliencia: Patrón `isSupabaseAdminConfigured()` con conmutación en memoria local si no hay credenciales en desarrollo local.
3. **Resend**:
   - Variables: `RESEND_API_KEY`, `RESEND_WEBHOOK_SIGNING_SECRET`, `RESEND_FROM_EMAIL`.
   - Estado: Enrutamiento en `/api/contact` y `/api/webhooks/resend`.
   - Resiliencia: Generación garantizada de Ticket `EXE-CNT` con log estructurado y respuesta 200 OK incluso si la conexión a la API externa de correo experimenta fallos de red.
4. **PayPal & n8n**:
   - Aislamiento estricto de llamadas SDK y verificación de webhook payloads.

### 5.2. Herramienta Automatizada de Verificación
- Creación de un script oficial en `scripts/audit-apikeys.mjs` vinculado al comando `npm run audit:keys`.
- Verifica la disponibilidad y conectividad real de Supabase, Resend y Gemini sin exponer ningún secreto en consola.
- Integración en la suite de pruebas: mantenimiento de **183 tests en Vitest** pasando al 100%.

---

## 6. Plan de Verificación y Criterios de Aceptación
1. **Scroll & Navegación**:
   - Desplazamiento fluido en Chrome/Edge/Firefox sin tirones, bloqueos ni saltos inesperados.
   - Los saltos de anclaje (`#contact`, etc.) posicionan el encabezado exactamente bajo el navbar sin quedar tapados.
2. **Navbar**:
   - El navbar no se deforma ni se sacude en movimientos bruscos de rueda.
   - Los botones de navegación permanecen accesibles y estables en desktop.
3. **Calidad de Código y Tipos**:
   - `npm run typecheck` sin errores (0 diagnósticos).
   - `npm run test` con 183/183 tests en verde.
   - `npm run build` genera la compilación de producción de Turbopack limpiamente.
4. **Auditoría de Servicios**:
   - `npm run audit:keys` reporta el estado de salud de los servicios configurados.
