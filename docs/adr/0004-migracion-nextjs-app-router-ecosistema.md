# ADR 0004: Migración Arquitectónica a Next.js 15 App Router, Supabase SSR y Ecosistema Avanzado

## Estado

Aceptado / En ejecución

## Contexto

**ExeSistemasWEB** ha evolucionado de una landing page SPA en Vite a un sistema SaaS B2B Multi-Tenant con gestión de turnos, catálogo de servicios, contratos SLA, facturación automática por webhooks y paneles de administración y clientes.

La arquitectura anterior presentaba limitaciones críticas:

1. **Servidores duales fragmentados en desarrollo:** `api-dev-server.js` (Express en puerto 3000) y Vite en puerto 5173, generando problemas de CORS y discrepancias con las Serverless Functions de producción.
2. **Autenticación en cliente:** Manejo de tokens en `localStorage` con `@supabase/supabase-js`, sin soporte nativo para SSR ni verificación de sesión a nivel de Edge Middleware.
3. **SEO y Metadatos:** Inyección en cliente mediante `react-helmet-async`, subóptimo para indexación y tiempos de carga inicial (FCP).
4. **Seguridad de API Keys:** Riesgo de filtración accidental de credenciales del servidor si no se respetaban convenciones estrictas de bundling.

## Decisión

### 1. Migración a Next.js 15+ con App Router

- Unificar frontend, Server Components y Route Handlers (`app/api/**/route.ts`) bajo un solo proceso y un solo comando `npm run dev`.
- Migrar la autenticación a **`@supabase/ssr` con cookies HttpOnly** seguras y validación en `middleware.ts`.
- Segregar estrictamente las variables de entorno: `NEXT_PUBLIC_*` para variables del cliente y variables sin prefijo para secretos exclusivos del servidor (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `PAYPAL_CLIENT_SECRET`, etc.).
- Utilizar la Metadata API nativa de Next.js (`metadata`, `sitemap.ts`, `robots.ts`) y `next/font/google`.

### 2. Adopción del Ecosistema Tecnológico Avanzado (Next.js Ecosystem)

Para potenciar la plataforma hacia un software SaaS de nivel Enterprise, se adopta un catálogo de herramientas especializadas para integración progresiva:

| Categoría                          | Herramientas Seleccionadas                                     | Caso de Uso en ExeSistemasWEB                                                 |
| :--------------------------------- | :------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **URL State & Filtros**            | `nuqs`                                                         | Persistencia de filtros, pestañas, rangos de fecha y paginación en URL.       |
| **Búsqueda & Comandos**            | `cmdk`, `Orama`, `Fuse.js`                                     | Command Palette `Ctrl + K` y búsqueda difusa en tickets, clientes y catálogo. |
| **UI Móvil & Drawers**             | `Vaul`                                                         | Modales y drawers inferiores con gestos táctiles tipo app nativa.             |
| **Primitives & Accesibilidad**     | `React Aria`, `Base UI`, `Ark UI`                              | Componentes complejos accesibles y a medida.                                  |
| **Animación & Efectos**            | `Motion` (Framer Motion), `GSAP`, `Lenis`, `Rive`, `Lottie`    | Micro-interacciones, Spotlight y scroll suave.                                |
| **3D WebGL**                       | `React Three Fiber` (`@react-three/fiber`), `drei`, `Three.js` | Escenas 3D interactivas con carga diferida (`next/dynamic` ssr: false).       |
| **Organización & Drag & Drop**     | `dnd-kit`                                                      | Tableros Kanban para tickets de soporte y asignación de work members.         |
| **Workflows & Diagramas**          | `React Flow`                                                   | Constructor visual interactivo de automatizaciones y embudos para clientes.   |
| **Almacenamiento Local & Offline** | `PGlite`, `Dexie`, `idb`                                       | Motor PostgreSQL Wasm en el navegador para modo offline-first.                |
| **Tareas de Fondo & Cron Jobs**    | `Trigger.dev`, `Inngest`                                       | Automatización de revisiones SLA, alertas y renovaciones recurrentes.         |
| **Seguridad de Server Actions**    | `Better Auth`, `next-safe-action`                              | Tipado seguro con Zod en Server Actions y mutaciones.                         |
| **Archivos & Medios**              | `UploadThing`, `Sharp`                                         | Procesamiento y subida optimizada de adjuntos y comprobantes.                 |

## Consecuencias

- **Positivas:**
  - Experiencia de desarrollo unificada y robusta.
  - Mayor seguridad en la autenticación y secretos de API.
  - Indexación SEO y rendimiento Lighthouse 99+ garantizados.
  - Base sólida para transformar la web en un producto de software SaaS integral.
- **Mitigaciones:**
  - Las librerías del ecosistema avanzado se incorporarán de forma justificada y modular según las necesidades reales del roadmap, evitando sobrecarga innecesaria en el bundle.
