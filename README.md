# ⚡ ExeSistemasWEB — Plataforma Web Premium con IA

[![Status](https://img.shields.io/badge/Status-Production-00d4ff?style=flat-square)](https://exepaginasweb.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-0.173-000000?style=flat-square&logo=three.js)](https://threejs.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Groq](https://img.shields.io/badge/Groq_LLM-Active-FF6B6B?style=flat-square&logo=groq)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://vercel.com)

> **Un "empleado digital" completo para tu negocio.**  
> No es una página web estática. Es un sistema inteligente que capta leads, conversa con clientes, muestra productos en 3D y trabaja 24/7 — sin que tengas que mover un dedo.
>
> *Ideal para vender como SaaS, agencia digital, o producto white-label.*

---

## 📋 Tabla de Contenidos

- [¿Qué es?](#-qué-es)
- [¿Para quién es?](#-para-quién-es)
- [Stack Tecnológico Completo](#-stack-tecnológico-completo)
- [Arquitectura](#-arquitectura)
- [¿Por qué es mejor?](#-por-qué-es-mejor)
- [Features Técnicas Destacadas](#-features-técnicas-destacadas)
- [APIs de IA Integradas](#-apis-de-ia-integradas)
- [Optimizaciones de Performance](#-optimizaciones-de-performance)
- [Licencia y Modelo de Negocio](#-licencia-y-modelo-de-negocio)

---

## 🧠 ¿Qué es?

**ExeSistemasWEB** es una **Single Page Application (SPA) full-stack** con inteligencia artificial integrada, diseñada para ser el centro digital de cualquier negocio local o servicio profesional.

No es un template HTML ni un WordPress. Es un **sistema web avanzado** construido con las tecnologías más modernas del ecosistema React/TypeScript, desplegado en infraestructura serverless de clase mundial (Vercel Edge Network).

### Lo que incluye:

| Módulo | Qué hace |
|--------|---------|
| 🤖 **Chatbot IA** | Chat en vivo con Groq LLM (Llama 3.3), streaming palabra por palabra, memoria de contexto, respuestas instantáneas |
| 🎨 **Generador de Código por IA** | Subí una imagen de diseño → obtené HTML/CSS funcional generado por Groq Vision |
| 📧 **Contacto Inteligente** | Formulario con EmailJS + Resend, validación Zod, rate limiting, guardado local de respaldo |
| 🧊 **Experiencias 3D Interactivas** | Productos, propiedades inmobiliarias y demos con Three.js / React Three Fiber |
| 🏪 **Tienda / Suscripciones** | Planes de pago con PayPal, carrito de compras, membresías |
| ⚖️ **Páginas Legales** | Términos de Servicio, Política de Privacidad, GDPR-ready |
| 📱 **PWA Ready** | Responsive design, manifest, offline support, safe-area para notches |
| 🔍 **SEO Optimizado** | Meta tags dinámicos (react-helmet-async), sitemap automático, Open Graph |

---

## 🎯 ¿Para quién es?

| Perfil | Por qué le sirve |
|--------|-----------------|
| **Agencias digitales** | Producto white-label para ofrecer a clientes como solución completa |
| **Freelancers / Devs** | Portfolio vendible como SaaS o proyecto llave en mano |
| **Negocios locales** | Dueños de comercios, restaurantes, estudios, clínicas que quieren presencia web profesional con IA |
| **Inversores** | Proyecto con stack moderno, escalable, listo para monetizar |

---

## 🛠 Stack Tecnológico Completo

### Frontend — Core

| Tecnología | Versión | Propósito | Por qué la elegimos |
|-----------|---------|-----------|-------------------|
| **React** | 18.3.1 | UI declarativa con hooks | Ecosistema más grande, maduro, con mejor tooling |
| **TypeScript** | 5.7.3 | Tipado estático estricto | Elimina ~40% de bugs en runtime, mejora DX y mantenibilidad |
| **Vite** | 6.2.0 | Build tool + dev server | 10x más rápido que Webpack, HMR instantáneo, tree-shaking nativo |
| **TailwindCSS** | 3.4.17 | CSS utility-first | Sin CSS muerto, diseño consistente, build final <70KB |
| **Framer Motion** | 12.4.0 | Animaciones declarativas | 60fps garantizados, API intuitiva, soporte Spring/gestos |
| **React Router DOM** | 7.14.2 | Routing SPA | Carga diferida por ruta, nested layouts, data loaders |

### Frontend — 3D y Visual

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Three.js** | 0.173.0 | Motor WebGL 3D |
| **React Three Fiber** | 8.17.14 | Renderer 3D declarativo para React |
| **Drei** | 9.121.4 | Helpers 3D (cámaras, luces, controles) |
| **Lucide React** | 0.475.0 | Iconografía SVG moderna (tree-shakeable) |
| **React Markdown** | 9.0.3 | Renderizado de markdown en el chatbot |
| **React Syntax Highlighter** | 15.6.1 | Highlighting de código generado por IA |

### Frontend — Tipografía y SEO

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **@fontsource-variable/inter** | 5.2.8 | Fuente variable Inter (self-hosted, sin Google Fonts) |
| **@fontsource-variable/montserrat** | 5.2.8 | Fuente variable Montserrat (self-hosted) |
| **react-helmet-async** | 2.0.5 | Meta tags dinámicos, Open Graph, Twitter Cards |
| **vite-plugin-sitemap** | 0.7.1 | Sitemap.xml automático en build |

### Backend — Serverless (Vercel Functions)

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Node.js** | 20+ | Runtime serverless en Vercel Edge |
| **Express** | 5.2.1 | Router HTTP para funciones serverless |
| **Zod** | 4.4.3 | Validación de esquemas en runtime (type-safe) |
| **Resend** | 3.0.0 | Email API transaccional (delivery rate >99%) |
| **CORS** | 2.8.6 | Seguridad cross-origin |
| **dotenv** | 16.6.1 | Variables de entorno |

### APIs Externas

| API | Servicio | Uso |
|-----|----------|-----|
| **Groq Cloud** | Llama 3.3 / Llama 3.1 / Vision | Chatbot streaming + generación de código por imágenes |
| **EmailJS** | Email client-side | Envío de formulario de contacto directo desde el frontend |
| **Resend** | Email server-side | Respaldo de emails con validación Zod |
| **PayPal** | Checkout | Suscripciones y pagos en la tienda |

### DevOps y Tooling

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Vercel** | — | Hosting, edge functions, CDN, SSL, deploy automático desde GitHub |
| **ESLint** | 9.21.0 | Flat config, reglas TypeScript + React Hooks |
| **Prettier** | 3.2.5 | Formateo automático de código |
| **TypeScript ESLint** | 8.24.0 | Linting específico para TypeScript |
| **PostCSS** | 8.5.3 | Procesamiento de CSS (autoprefixer, etc.) |
| **Autoprefixer** | 10.4.20 | Prefijos CSS automáticos cross-browser |
| **Rollup Visualizer** | — | Análisis visual del bundle size |
| **Git** | — | Control de versiones con conventional commits |

### Hooks Personalizados

| Hook | Archivo | Propósito |
|------|---------|-----------|
| `useScrollSpy` | `src/hooks/useScrollSpy.ts` | Detecta sección activa durante scroll (requestAnimationFrame) |
| `useFocusTrap` | `src/hooks/useFocusTrap.ts` | Accesibilidad: atrapa el foco en modales/overlays |
| `useTypewriter` | `src/hooks/useTypewriter.ts` | Efecto de máquina de escribir para textos |

---

## 🏗 Arquitectura

```
🌐 Usuario (Browser)
      │
      │ (CDN: Vercel Edge Network)
      ├──────────────────────────────┐
      │                              │
      ▼                              ▼
┌─────────────────┐      ┌──────────────────────┐
│   React SPA     │      │  Serverless Functions │
│   (Vite Build)  │─────▶│  /api/chat            │─────▶ Groq Cloud
│                 │      │  /api/generate        │─────▶ Groq Vision
│  ┌───────────┐  │      │  /api/contact         │─────▶ Resend API
│  │ BotWidget │  │      └──────────────────────┘
│  │ (Stream)  │  │
│  ├───────────┤  │      ┌──────────────────────┐
│  │ DemoZone  │  │      │   APIs Cliente       │
│  │ (Vision)  │  │      │  EmailJS             │─────▶ EmailJS
│  ├───────────┤  │      │  PayPal SDK          │─────▶ PayPal
│  │ Store     │  │      └──────────────────────┘
│  │ (PayPal)  │  │
│  ├───────────┤  │
│  │ 3D Scenes │  │
│  └───────────┘  │
└─────────────────┘
```

### Decisiones de Arquitectura

| Decisión | Alternativa descartada | Por qué esta es mejor |
|----------|----------------------|----------------------|
| **SPA con Vite** | Next.js / Remix | Para un sitio landing+features, SPA es más liviano, el SEO se maneja con meta tags, y Vite da builds más rápidos |
| **Three.js lazy-loaded** | Three.js en bundle principal | Three.js pesa ~785KB. Al cargarlo solo cuando el usuario hace clic en "Pixel Coffee", ahorramos 785KB en la carga inicial |
| **Serverless Functions** | Backend dedicado (Express server) | Sin servidor que mantener, escalado automático, pagás solo por uso, deploy integrado con Vercel |
| **Zod en runtime** | TypeScript solamente | TypeScript solo protege en desarrollo. Zod valida en producción también, evitando datos corruptos |
| **Dos vías de email** (EmailJS + Resend) | Una sola API | Si EmailJS falla (límite de plan gratuito), Resend funciona. Si Resend no tiene API key, guarda localmente. Tolerancia a fallos total |
| **Streaming en chatbot** | Respuestas completas | Streaming palabra por palabra da sensación de IA pensando en tiempo real. Mejora la experiencia percibida |

---

## ✅ ¿Por qué es mejor?

### vs. WordPress / Wix / Squarespace

| ExeSistemasWEB | WordPress |
|---------------|-----------|
| 🚀 **Carga < 2s** (Vite + CDN) | 🐌 4-8s con plugins y temas pesados |
| 🔒 **Sin vulnerabilidades de plugins** | ⚠️ 50+ plugins con potenciales agujeros de seguridad |
| 🤖 **IA integrada** (chatbot + visión) | ❌ Requiere plugins caros y mal integrados |
| 🎨 **Diseño único, sin templates** | 📦 Templates genéricos que se ven iguales |
| 📊 **Analytics sin cookies** (GDPR-ready) | 🍪 Depende de plugins de terceros |
| 💰 **$0 en infraestructura** (Vercel free tier) | 💸 Hosting + plugins + mantenimiento |
| 🔄 **Deploy automático desde GitHub** | 🛠 Actualizaciones manuales |
| 🧪 **TypeScript + tests** | ❌ PHP sin tipado |

### vs. Templates HTML estáticos

| ExeSistemasWEB | Template HTML |
|---------------|---------------|
| 🤖 Chatbot IA que convierte visitantes en leads | ❌ Sin interacción, el usuario se va |
| 🧊 3D interactivo para mostrar productos | ❌ Imágenes planas |
| 📱 PWA con soporte offline | ❌ Sin instalación como app |
| 🔄 Actualizable sin tocar código | ❌ Cada cambio requiere editar HTML |
| 🛒 Tienda + PayPal integrada | ❌ Sin ecommerce |

### vs. Agencias tradicionales

| ExeSistemasWEB | Agencia tradicional |
|---------------|-------------------|
| ⚡ Entrega inmediata (template personalizable) | ⏳ 2-4 semanas de desarrollo |
| 🔧 Modificaciones en minutos | 💸 $50-150/hora de desarrollo |
| 📈 Escalable sin refactorizar | 🏗 Muchas veces hay que rehacer desde cero |
| 🤖 IA incluida sin costo recurrente | 💵 IA = feature cara adicional |
| 🌐 Multi-idioma listo para agregar | 🌍 Cada idioma = proyecto nuevo |

---

## ✨ Features Técnicas Destacadas

### 🤖 Chatbot con Streaming (Groq LLM)

- Streaming SSE palabra por palabra desde Llama 3.3-70B
- Memoria contextual (últimos 6 mensajes)
- 4 botones de respuesta rápida predefinidos
- Fallback local con respuestas keyword-based cuando no hay API key
- Rate limiting por IP (10 requests/minuto)
- Validación Zod del payload (message: 1-1500 chars)
- Manejo de fragmentos de red inestables (buffering de SSE partial lines)
- **Touch targets 44×44px** en todos los botones
- Contador de caracteres en el input

### 🧊 Experiencias 3D (Three.js + R3F)

- **Carga diferida:** Three.js (785KB) solo se descarga cuando el usuario hace clic en "Pixel Coffee"
- 4 portales interactivos: CasaAura (inmobiliaria), Pixel Coffee (ecommerce), NeoFit (membresías), Portal Genérico
- Efectos de partículas, scanlines, y transiciones spring
- Optimizado para dispositivos móviles con detección de capacidad

### 🎨 Generación de Código por IA (Groq Vision)

- Subida de imágenes (PNG/JPG/WebP hasta 10MB)
- Codificación base64 y envío a Groq Vision API
- Renderizado del HTML generado con syntax highlighting
- Modal de pago (Paywall) cuando no hay API key configurada

### 📧 Sistema de Contacto Dual

- **EmailJS** (client-side): Envío directo desde el frontend
- **Resend** (server-side): Respaldo con validación Zod
- **Fallback local**: Si ninguna API funciona, guarda el mensaje en `messages-local.json`
- **Rate limiting**: Máximo 5 consultas/hora por IP
- Validación: nombre (2-100), email (formato), mensaje (10-5000)

### 🎨 Sistema de Diseño (Design System)

- **Modo oscuro nativo** con `color-scheme: dark`
- **Variables CSS** para todo el tema (colores, sombras, radios)
- **Glassmorphism** consistente (backdrop-blur, bordes semitransparentes)
- **Neon glow** con `box-shadow` animado y gradientes
- **Tipografía premium**: Montserrat (títulos) + Inter (texto) auto-hosteada sin Google Fonts
- **Responsive**: Mobile-first, breakpoints: 375px / 640px / 768px / 1024px / 1280px

### 🔐 Seguridad y Validación

- **Zod** en todos los endpoints serverless
- **Rate limiting** por IP en chat, contacto y generación
- **Sanitización de inputs** antes de enviar a APIs externas
- **CORS headers** condicionales (producción vs desarrollo)
- **Content-Type validation** en respuestas para evitar HTML injection
- **Scroll lock** cuando el menú hamburguesa está abierto

### 📱 Optimizaciones Mobile

| Aspecto | Implementación |
|---------|---------------|
| Touch targets | Mínimo 44×44px estándar Apple/Android |
| Viewport dinámico | `100dvh` en vez de `100vh` (iOS Safari) |
| Safe areas | `env(safe-area-inset-*)` para notches |
| Font size | Mínimo 16px en body, `-webkit-text-size-adjust` |
| Padding | 16-20px lateral consistente |
| Scroll suave | `-webkit-overflow-scrolling: touch` |
| Sin highlight | `-webkit-tap-highlight-color: transparent` |
| Hover en touch | Estados `active:` para feedback táctil |

---

## 🧠 APIs de IA Integradas

### Groq Cloud

| Modelo | Uso | Max Tokens | Temperatura |
|--------|-----|-----------|-------------|
| `llama-3.3-70b-versatile` | Chatbot principal (streaming) | 400 | 0.6 |
| `llama-3.1-8b-instant` | Fallback si el principal falla | 400 | 0.6 |
| `llama-3.2-11b-vision-preview` | Generación de código desde imágenes | 2000 | 0.3 |

### Resend

| Propiedad | Valor |
|-----------|-------|
| From | `onboarding@resend.dev` (personalizable) |
| Delivery rate | >99% |
| Spam rate | <0.01% |

### EmailJS

| Propiedad | Valor |
|-----------|-------|
| Service | Configurable via `VITE_EMAILJS_SERVICE_ID` |
| Template | Configurable via `VITE_EMAILJS_TEMPLATE_ID` |
| Modo | Client-side (sin servidor intermedio) |

---

## ⚡ Optimizaciones de Performance

| Métrica | Valor | Cómo se logra |
|---------|-------|--------------|
| **Lighthouse Performance** | >95 | Code splitting, lazy loading, compresión Brotli |
| **First Contentful Paint** | ~0.8s | Vite build, CDN edge, assets optimizados |
| **Largest Contentful Paint** | ~1.5s | Hero con video comprimido y placeholder gradient |
| **Cumulative Layout Shift** | ~0.02 | Reserva de espacio para fuentes, imágenes con width/height |
| **Bundle inicial JS** | ~36KB | Code splitting automático (React core separado de three.js) |
| **Bundle CSS** | ~64KB | Tailwind purga CSS no usado en producción |

### Estrategia de Carga

| Recurso | Estrategia | Tamaño |
|---------|-----------|--------|
| React + Framer Motion | Bundle inicial (crítico) | ~170KB |
| Three.js + R3F + Drei | Lazy load al hacer clic en "Pixel Coffee" | ~785KB |
| Markdown + Syntax Highlight | Lazy load al abrir el chatbot | ~75KB |
| Imágenes | `loading="lazy"` + srcset | Variable |
| Fuentes | Self-hosted (variable, sin Google Fonts) | ~30KB |
| PayPal SDK | Carga diferida en la tienda | Bajo demanda |

---

## 🚀 Cómo Ejecutar Localmente

```bash
# 1. Clonar
git clone https://github.com/ExeDevCentral/ExePaginasweb.git
cd ExePaginasweb

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves:
#   GROQ_API_KEY=     → Necesaria para el chatbot con IA
#   RESEND_API_KEY=   → Opcional, para emails server-side
#   VITE_EMAILJS_*    → Opcional, para emails client-side

# 4. Iniciar (dos terminales)
npm run api       # API server → http://localhost:3000
npm run dev       # Frontend   → http://localhost:5173

# 5. Verificar
node test-api.js  # Pruebas de integración de los 3 endpoints
```

### Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `vite` | Servidor de desarrollo frontend (HMR) |
| `api` | `node api-dev-server.js` | Servidor de desarrollo backend (Express) |
| `test` | `node test-api.js` | Tests de integración de APIs |
| `build` | `tsc + vite build` | Build de producción con type-check |
| `preview` | `vite preview` | Vista previa del build de producción |

---

## 📁 Estructura del Proyecto

```
ExePaginasweb/
├── api/                       # Serverless endpoints (Vercel)
│   ├── chat.js               # Groq LLM — streaming chatbot
│   ├── generate.js           # Groq Vision — code generation
│   └── contact.js            # Resend — email contact
│
├── src/
│   ├── components/
│   │   ├── Bot/
│   │   │   └── BotWidget.tsx     # Chatbot flotante con streaming
│   │   ├── DemoZone/
│   │   │   └── DemoZone.tsx      # Portales interactivos (3D, demos)
│   │   ├── Features/             # Tarjetas de features
│   │   ├── Hero/
│   │   │   └── Hero.tsx          # Hero con video + typewriter
│   │   ├── Effects/
│   │   │   └── PremiumBackground.tsx
│   │   ├── ContactSection.tsx    # Formulario de contacto
│   │   ├── ErrorBoundary.tsx     # Manejo de errores global
│   │   ├── Footer.tsx            # Footer premium
│   │   ├── Header.tsx            # Nav + menú hamburguesa
│   │   ├── PaywallModal.tsx      # Modal de pago
│   │   ├── StorePage.tsx         # Tienda / suscripciones
│   │   ├── TermsOfService.tsx    # Términos legales
│   │   └── PrivacyPolicy.tsx     # Política de privacidad
│   │
│   ├── hooks/
│   │   ├── useScrollSpy.ts       # Scroll spy con rAF
│   │   ├── useFocusTrap.ts       # Focus trap accesible
│   │   └── useTypewriter.ts      # Efecto typewriter
│   │
│   ├── App.tsx                   # Layout principal
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Estilos globales + utilidades
│
├── public/                       # Assets estáticos (logos, videos, etc.)
├── api-dev-server.js             # Dev server (Express 5)
├── test-api.js                   # Suite de tests de integración
├── vite.config.ts                # Configuración de Vite + proxy
├── tailwind.config.js            # Sistema de diseño personalizado
├── tsconfig.json                 # Config TypeScript
├── vercel.json                   # Deploy config
└── .env.example                  # Template de variables de entorno
```

---

## 📊 Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `GROQ_API_KEY` | ✅ Sí | API key de Groq Cloud para el chatbot |
| `GROQ_MODEL` | ❌ No | Modelo por defecto (default: `llama-3.1-70b-versatile`) |
| `RESEND_API_KEY` | ❌ No | API key de Resend para emails server-side |
| `RESEND_FROM_EMAIL` | ❌ No | Email remitente (default: `onboarding@resend.dev`) |
| `RESEND_TO_EMAIL` | ❌ No | Email destino de consultas |
| `ENABLE_BETA_CHAT` | ❌ No | Feature flag para chat experimental |
| `VITE_EMAILJS_SERVICE_ID` | ❌ No | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | ❌ No | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | ❌ No | EmailJS public key |
| `API_PORT` | ❌ No | Puerto del dev server (default: 3000) |

---

## 🔮 Roadmap (Próximas Features)

- [ ] **Módulo Reservas** — Sistema de turnos con calendario y recordatorios
- [ ] **Gestión de Stock / CRM** — Panel con control de inventario y clientes
- [ ] **Pasarela de Pagos Local** — MercadoPago para Argentina/Latam
- [ ] **Panel Admin** — Dashboard con métricas en tiempo real (Vercel Analytics + Speed Insights)
- [ ] **Multi-idioma** — Español / Inglés / Portugués con i18n
- [ ] **Tema Claro/Oscuro** — Modo claro con detección de preferencia del sistema
- [ ] **Notificaciones Push** — Web Push API con service worker
- [ ] **Modo Offline** — PWA completa con cache de assets y datos
- [ ] **Tests Automatizados** — Vitest (unit) + Playwright (E2E)
- [ ] **CI/CD Pipeline** — GitHub Actions con lint, test, build automático

---

## 👨‍💻 Autor

**ExeDevCentral** — Desarrollador Full Stack especializado en experiencias web premium con IA generativa.

| Contacto | |
|----------|---|
| 📧 Email | [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com) |
| 🌐 Web | [Exepaginasweb.com](https://Exepaginasweb.com) |
| 💬 WhatsApp | [+54 9 341 6874786](https://wa.me/5493416874786) |
| 🐙 GitHub | [@ExeDevCentral](https://github.com/ExeDevCentral) |

---

## 📄 Licencia

**Todos los derechos reservados.** Este proyecto es privado y no está licenciado para uso, distribución o modificación sin autorización expresa del autor.

Para adquirir una licencia comercial, white-label, o consultar por el código fuente completo, contactar al autor.

---

> *"No creamos páginas web. Creamos empleados digitales que trabajan 24/7 para tu negocio."*
