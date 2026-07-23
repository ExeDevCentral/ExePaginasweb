<div align="center">

# 🎓 GUÍA ACADÉMICA

### **ExeSistemasWEB — Arquitectura, Decisiones y Patrones**

![Badge](https://img.shields.io/badge/NIVEL-Avanazado-ff00ff?style=for-the-badge&labelColor=1a1a2e)
![Badge](https://img.shimg.io/badge/ESTADO-Production-00ff88?style=for-the-badge&labelColor=1a1a2e)
![Badge](https://img.shields.io/badge/STACK-React_+_Supabase_+_PayPal-0ea5e9?style=for-the-badge&labelColor=1a1a2e)

---

> **📌 Este documento es para ti, estudiante.**
> Explica **qué construimos**, **cómo lo hicimos**, **por qué elegimos ese camino** y **qué aprenderías si lo replicaras**.

</div>

---

## 🧬 1. ¿QUÉ ES ESTE PROYECTO?

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXEPAGINASWEB.COM                            │
│                                                                 │
│   🌐 Landing Page  →  🛒 Tienda  →  💳 Pagos  →  📊 Dashboard │
│        ↓                  ↓            ↓             ↓          │
│   Hero + Demo         Productos    PayPal        Panel Cliente  │
│   3D + Animación      Carrito     Webhook        + Tickets     │
│   Chat con IA         Checkout    Supabase       + Notif.      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

No es una landing page estática. Es un **sistema full-stack** con:

| Módulo           | Tecnología                   | ¿Qué hace?                               |
| ---------------- | ---------------------------- | ---------------------------------------- |
| 🔐 **Auth**      | Supabase + Google OAuth      | Login con PKCE flow, sesiones seguras    |
| 💳 **Pagos**     | PayPal Hosted Buttons        | Cobro en USD, webhooks server-side       |
| 🤖 **Chat IA**   | Groq + Llama 3.3             | Streaming palabra por palabra            |
| 📊 **Dashboard** | React + Supabase             | Panel segmentado por plan de suscripción |
| 🎫 **Tickets**   | PostgreSQL Triggers          | Soporte automatizado con notificaciones  |
| 🎨 **3D**        | Three.js + React Three Fiber | Demo interactiva "Pixel Coffee"          |

---

## 🏗️ 2. POR QUÉ ESTE STACK (Y NO OTRO)

### ⚡ React + TypeScript + Vite

```
  ❌ Alternativas descartadas:
  ├── Vue.js      → Menor ecosistema de tipado estricto
  ├── Angular     → Overkill para una SPA de este tamaño
  └── vanilla JS  → Sin componentización, mantenimiento imposible

  ✅ React ganó porque:
  ├── Componentes reutilizables (Hero, Pricing, FAQ = piezas independientes)
  ├── TypeScript previene bugs en integraciones (PayPal, Supabase, Groq)
  └── Vite = HMR instantáneo + code-splitting automático
```

**Patrón aplicado:** `Component Composition` + `Lazy Loading`

```tsx
// Solo carga cuando el usuario hace clic en "Pixel Coffee"
const CoffeePortal3D = lazy(() => import('./Effects/CoffeePortal3D'))
// ↑ Three.js (~288KB) NUNCA se descarga si el usuario no lo necesita
```

---

### 🗄️ Supabase (PostgreSQL)

```
  ┌─────────────────────────────────────────────────┐
  │           SUPABASE = PostgreSQL + Auth           │
  │                                                   │
  │  ✅ Base de datos relacional (JOINs, integridad)  │
  │  ✅ RLS = seguridad a nivel de fila               │
  │  ✅ Triggers = lógica server-side en SQL           │
  │  ✅ Auth = Google OAuth nativo                     │
  │                                                   │
  │  ❌ MongoDB descartado:                           │
  │  └── Clientes ↔ Suscripciones ↔ Pagos = relacional│
  │      Usar NoSQL requeriría denormalización         │
  └─────────────────────────────────────────────────┘
```

**¿Por qué no MongoDB?** La relación `clientes → suscripciones → pagos → tickets` es **inherentemente relacional**. Un JOIN en PostgreSQL es más eficiente que 5 queries en MongoDB.

---

### 🚀 Vercel Serverless Functions

```
  Browser → /api/chat → Groq LLM (streaming)
            /api/contact → Resend (email)
            /api/paypal-webhook → Supabase DB

  ✅ Sin servidor 24/7 — se paga por invocaciones
  ✅ Deploy automático desde Git
  ⚠️ Cold start ~200-500ms (aceptable para este caso)
```

---

### 💳 PayPal Hosted Buttons

```
  ┌──────────────────────────────────────────────────────┐
  │              FLUJO DE PAGO                            │
  │                                                       │
  │  1. Usuario clickea "Suscribirme"                     │
  │  2. SDK de PayPal carga botón en iframe               │
  │  3. Usuario paga DENTRO del iframe                    │
  │  4. PayPal redirige a /dashboard?payment=paypal_ok    │
  │  5. PayPal envía webhook → /api/paypal-webhook        │
  │  6. Webhook verifica firma + captura orden            │
  │  7. Se inserta pago + suscripción en Supabase         │
  │  8. Se envía email de confirmación (Resend)           │
  │                                                       │
  │  🔒 SEGURIDAD: Webhook firma verificada con           │
  │     PAYPAL_WEBHOOK_ID → previene pagos falsos         │
  └──────────────────────────────────────────────────────┘
```

**¿Por qué no Stripe?** PayPal tiene mayor penetración en LATAM para consumidores finales. Los Hosted Buttons eliminan la necesidad de backend propio para procesar pagos.

---

## 🗃️ 3. ARQUITECTURA DE DATOS

### Schema Relacional

```
                    ┌──────────────┐
                    │   clientes   │
                    │──────────────│
                    │ id (uuid)    │
                    │ email        │
                    │ nombre       │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │ suscripciones│ │    pagos     │ │   tickets    │
   │──────────────│ │──────────────│ │──────────────│
   │ plan_slug    │ │ monto        │ │ asunto       │
   │ estado       │ │ moneda       │ │ estado       │
   │ fecha_inicio │ │ provider     │ │ created_at   │
   └──────────────┘ │ paypal_id    │ └──────┬───────┘
                    └──────────────┘        │
                                            ▼
                                   ┌──────────────┐
                                   │notificaciones │
                                   │──────────────│
                                   │ mensaje      │
                                   │ tipo         │
                                   │ read_at      │
                                   └──────────────┘
```

### 🔒 Row Level Security (RLS)

RLS es un mecanismo de **seguridad a nivel de fila** en PostgreSQL. Sin RLS, cualquier usuario autenticado podría leer TODOS los datos.

```sql
-- ❌ SIN RLS: Cualquier usuario ve todos los tickets
SELECT * FROM tickets;

-- ✅ CON RLS: Solo ves tus propios tickets
CREATE POLICY "clientes ven sus tickets"
  ON tickets FOR SELECT
  USING (cliente_id = auth.uid());
```

> **💡 Lección:** RLS protege en **todo el stack** (API, frontend, acceso directo a DB). Un middleware de Express solo protege un endpoint.

---

### ⚡ Triggers en PostgreSQL

Los triggers ejecutan lógica **server-side** cuando ocurre un evento en la DB.

```sql
-- Cuando se inserta un ticket → crear notificación automática
CREATE OR REPLACE FUNCTION notify_admin_on_ticket()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notificaciones (cliente_id, mensaje, tipo)
  VALUES (NEW.cliente_id, 'Nuevo ticket: ' || NEW.asunto, 'info');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Asociar trigger a la tabla tickets
CREATE TRIGGER trg_notify_admin
  AFTER INSERT ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_on_ticket();
```

> **💡 Lección:** La lógica vive en la **base de datos**, no en el backend. Garantiza consistencia sin importar qué endpoint inserte el ticket.

---

## 📦 4. LAZY LOADING & CODE SPLITTING

```
  ┌─────────────────────────────────────────────────────────┐
  │                    BUNDLE INITIAL                        │
  │                                                          │
  │  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
  │  └── Core (React, Router, Header) ~180KB                 │
  │                                                          │
  │  ─── Carga bajo demanda ───                              │
  │                                                          │
  │  ░░░░░░░░░░████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
  │           └── DemoZone + CoffeePortal3D ~288KB           │
  │                                                          │
  │  ░░░░░░░░░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░░░░░░░░░  │
  │                       └── Dashboard ~95KB                │
  │                                                          │
  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░  │
  │                                └── Store ~120KB          │
  └─────────────────────────────────────────────────────────┘
```

```tsx
// App.tsx — lazy loading por sección
const Products = lazy(() => import('./components/Products/Products'))
const DemoZone = lazy(() => import('./components/DemoZone/DemoZone'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Three.js se carga SOLO cuando el usuario hace clic en "Pixel Coffee"
import('../Effects/CoffeePortal3D').then((m) => setCoffeePortalComponent(() => m.CoffeePortal3D))
// ↑ 288KB que NUNCA se descargan si el usuario no interactúa con esa demo
```

> **💡 Lección:** Sin lazy loading, el bundle inicial superaba **1MB**. Con code splitting, el initial chunk se redujo a **~180KB**.

---

## 🔐 5. SEGURIDAD

### Content Security Policy (CSP)

```json
{
  "Content-Security-Policy": "default-src 'self'; connect-src 'self' https://*.supabase.co https://api.groq.com https://www.paypal.com"
}
```

| Ataque             | ¿Qué hace?                         | ¿Cómo CSP lo previene?                        |
| ------------------ | ---------------------------------- | --------------------------------------------- |
| **XSS**            | Inyecta `<script>` malicioso       | `script-src 'self'` bloquea scripts externos  |
| **Data injection** | Carga recursos de dominios falsos  | `connect-src` solo permite dominios whitelist |
| **Clickjacking**   | Iframe transparente sobre tu botón | `frame-ancestors 'self'`                      |

---

### OAuth con PKCE

```
  ┌──────────┐                              ┌──────────┐
  │ Frontend │                              │  Google   │
  └────┬─────┘                              └─────┬────┘
       │                                          │
       │  1. Genera code_verifier (random)        │
       │  2. Calcula code_challenge (SHA256)      │
       │─────────────────────────────────────────▶│
       │                                          │
       │  3. Usuario autentica con Google          │
       │◀─────────────────────────────────────────│
       │                                          │
       │  4. Google redirige con ?code=abc123     │
       │◀─────────────────────────────────────────│
       │                                          │
       │  5. Intercambia code + code_verifier     │
       │─────────────────────────────────────────▶│
       │                                          │
       │  6. Access token + refresh token         │
       │◀─────────────────────────────────────────│
       │                                          │
```

> **💡 ¿Por qué PKCE?** En una SPA, no puedes guardar un `client_secret` en el frontend (es visible en el DOM). PKCE reemplaza el secret con un **challenge criptográfico**.

---

## 🎨 6. PERFORMANCE & UX

### Skeleton Loading

```
  ❌ Mal UX:                    ✅ Buen UX:
  ┌──────────────────┐         ┌──────────────────┐
  │                  │         │ ═══════════════  │ ← skeleton shimmer
  │   (blanco)       │         │ ═══════════════  │
  │                  │         │   ███  ███  ███  │
  │   ...cargando... │         │   ███  ███  ███  │
  │                  │         │ ═══════════════  │
  └──────────────────┘         └──────────────────┘
  Perceived latency: ALTA      Perceived latency: BAJA
```

```tsx
const SectionSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl bg-muted/60">
    <div
      className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite]
                    bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
    />
  </div>
)
```

> **💡 Psicología UX:** Los skeletons comunican **estructura** al usuario. Reducen la "perceived latency" aunque el tiempo real sea igual.

---

### Parallax en Background

```tsx
const { scrollYProgress } = useScroll()
const orbParallaxY = useTransform(scrollYProgress, [0, 1], [0, -150])

// Los orbs se mueven a DISTINTA velocidad que el contenido
<motion.div style={{ y: orbParallaxY }} ... />
```

```
  Scroll del usuario: ↓↓↓↓↓

  Capa 1 (fondo):     ─────→  (lento, -150px)
  Capa 2 (contenido): ─────→  (normal, 0px)
  Capa 3 (foreground): ─────→  (rápido, +50px)

  = Efecto de PROFUNDIDAD (parallax scrolling)
```

---

## 🧪 7. TESTING

```
  ┌─────────────────────────────────────────────────┐
  │           TEST PYRAMID (en este proyecto)        │
  │                                                   │
  │                  ╱╲                                │
  │                 ╱  ╲     ❌ E2E tests             │
  │                ╱    ╲    (no implementados)        │
  │               ╱──────╲                             │
  │              ╱        ╲   ❌ Integration tests     │
  │             ╱          ╲  ( pendientes )           │
  │            ╱────────────╲                          │
  │           ╱              ╲  ✅ Unit tests          │
  │          ╱   4 suites     ╲ ( availabilityEngine, │
  │         ╱   100% coverage  ╲  slotGenerator,      │
  │        ╱                    ╲ conflictDetector,    │
  │       ╱──────────────────────╲ reservationService) │
  └─────────────────────────────────────────────────┘
```

**¿Por qué solo logica de dominio?**

| Tipo de test           | Esfuerzo | ROI                           |
| ---------------------- | -------- | ----------------------------- |
| Unit (lógica pura)     | Bajo     | **Alto** — bugs criticos aquí |
| Integration (API + DB) | Medio    | Medio                         |
| E2E (browser)          | Alto     | Bajo para este proyecto       |

> **💡 Lección:** Testear `availabilityEngine.test.ts` previene bugs en la lógica de reservas. Testear un componente React tiene menor ROI porque la UI es más volatile.

---

## 🚀 8. DESPLIEGUE

```
  Developer → git push main → Vercel Build Pipeline → Production
                                │
                                ├── 1. TypeScript typecheck
                                ├── 2. ESLint
                                ├── 3. Vite build
                                └── 4. Deploy a Edge Network

  ┌─────────────────────────────────────────────────┐
  │  exepaginasweb.com                               │
  │                                                   │
  │  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
  │  │ Edge:AR │  │ Edge:US │  │ Edge:EU │  ← CDN   │
  │  └─────────┘  └─────────┘  └─────────┘          │
  │       │            │            │                  │
  │       └────────────┼────────────┘                  │
  │                    ▼                               │
  │          Serverless Functions                     │
  │          (Node.js, auto-scaling)                  │
  └─────────────────────────────────────────────────┘
```

---

## 📐 9. DECISIONES DE DISEÑO

### CSS Variables para Theming

```css
/* Light mode (default) */
:root {
  --background: #fdf8f3; /* Crema premium */
  --foreground: #2d2b2a;
  --accent-cyan: #0ea5e9;
}

/* Dark mode — solo cambia la clase .dark en <html> */
.dark {
  --background: #0a0a0c;
  --foreground: #f0f0f5;
}
```

```tsx
// Tailwind consume las variables — sin lógica condicional
<div className="bg-background text-foreground border-border">
  {/* Se adapta automáticamente a light/dark */}
</div>
```

> **💡 Lección:** Un solo componente se adapta a **ambos temas** sin `if/else`. Las CSS variables son el mecanismo más limpio para theming en React.

---

### Framer Motion — Animaciones Declarativas

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}      {/* Estado inicial */}
  whileInView={{ opacity: 1, y: 0 }}   {/* Cuando entra al viewport */}
  viewport={{ once: true }}             {/* Solo una vez */}
  transition={{ duration: 0.8 }}        {/* Duración */}
>
```

| Prop            | Qué hace                             |
| --------------- | ------------------------------------ |
| `initial`       | Estado antes de la animación         |
| `whileInView`   | Estado cuando el elemento es visible |
| `viewport.once` | Ejecutar solo la primera vez         |
| `whileHover`    | Estado al pasar el mouse             |
| `whileTap`      | Estado al hacer clic                 |

---

## 🧠 10. LECCIONES APRENDIDAS

```
  ┌─────────────────────────────────────────────────────────────┐
  │                                                              │
  │  1. NO PREMATUREAR LA ABSTRACCIÓN                           │
  │     Empezamos con MercadoPago → migramos a PayPal            │
  │     Si hubiéramos abstraído el proveedor de pagos,           │
  │     la migración hubiera sido 10x más costosa.               │
  │                                                              │
  │  2. RLS ES MÁS PODEROSO QUE CUALQUIER MIDDLEWARE            │
  │     3 líneas de SQL protegen contra accesos no               │
  │     autorizados en TODO el stack (API, client, DB).          │
  │                                                              │
  │  3. LAZY LOADING NO ES OPCIONAL                             │
  │     Sin code splitting: 1MB+ bundle initial                  │
  │     Con code splitting: ~180KB initial                       │
  │                                                              │
  │  4. WEBHOOKS > REDIRECTS PARA PAGOS                         │
  │     PayPal redirige al usuario, pero el webhook              │
  │     confirma el pago server-side. NUNCA confíes              │
  │     solo en el redirect del cliente.                         │
  │                                                              │
  │  5. TYPESCRIPT PREVIENE BUGS QUE ESLINT NO ALCANZA          │
  │     En integraciones con APIs externas, el tipado            │
  │     de respuestas evita `undefined` runtime errors.          │
  │                                                              │
  └─────────────────────────────────────────────────────────────┘
```

---

<div align="center">

### 🎯 RESUMEN FINAL

```
  TEORÍA (universidad)          PRÁCTICA (este proyecto)
  ─────────────────            ─────────────────────────
  Patrones de diseño     →     Component Composition
  Seguridad web         →     CSP + RLS + PKCE + Webhooks
  Bases de datos        →     PostgreSQL + Triggers + RLS
  Arquitectura          →     SPA + Serverless + CDN
  Testing               →     Unit tests en lógica de dominio
  UX                    →     Skeletons + Parallax + Animaciones
```

> **_"Un proyecto académico demuestra que sabes la teoría.
> Un proyecto desplegado demuestra que sabes ejecutar."_**

![Footer](https://img.shields.io/badge/ExeSistemasWEB-Académico-ff00ff?style=for-the-badge&labelColor=1a1a2e)

</div>
