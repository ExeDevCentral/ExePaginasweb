# ⚡ ExePaginasWeb — AI-Powered Landing Platform

![CI Status](https://github.com/ExeDevCentral/ExePaginasweb/actions/workflows/verify.yml/badge.svg)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://prueba-hiper-web-full-ai-video-super-b0fps6ubv.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-0.173-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Groq](https://img.shields.io/badge/Groq-AI%20Inference-F55036?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com)

> **Landing page premium con inteligencia artificial integrada.** Chatbot con LLMs, generación de código desde imágenes, formulario de contacto con email automatizado y experiencias 3D interactivas — todo desplegado en serverless.

---

## 🚀 Demo en Vivo

🔗 **[https://prueba-hiper-web-full-ai-video-super-b0fps6ubv.vercel.app](https://prueba-hiper-web-full-ai-video-super-b0fps6ubv.vercel.app)**

---

## ✨ Features Destacadas

| Feature | Tecnología | Descripción |
|---------|-----------|-------------|
| 🤖 **AI Chat Assistant** | Groq API (Llama 3.3/3.1) | Chatbot con **Streaming palabra por palabra**, botones de respuesta rápida, memoria contextual y manejo robusto de fragmentos de red. |
| 🎨 **Generación de Código** | Groq Vision API | Convierte diseños en imágenes a HTML/CSS funcional vía IA |
| 📧 **Contacto Inteligente** | Resend API | Envío de emails transaccionales con validación de datos |
| 🧊 **Experiencias 3D** | React Three Fiber + Drei | Elementos 3D interactivos en la interfaz |
| ⚡ **Animaciones Fluidas** | Framer Motion | Transiciones y micro-interacciones de 60fps |
| 🎭 **UI Premium** | TailwindCSS + CSS Variables | Diseño oscuro con gradientes neón y glassmorphism |
| 📱 **PWA Ready** | Vite PWA | Configuración lista para instalación como app nativa |
| 🔍 **SEO Optimizado** | vite-plugin-sitemap | Sitemap automático y meta tags dinámicos |

---

## 🛠 Stack Tecnológico Completo

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.3.1 | UI declarativa con hooks y context |
| **TypeScript** | 5.7.3 | Tipado estático estricto |
| **Vite** | 6.2.0 | Build tool ultrarrápido con HMR |
| **TailwindCSS** | 3.4.17 | Utility-first CSS framework |
| **Framer Motion** | 12.4.0 | Animaciones declarativas |
| **React Three Fiber** | 8.17.14 | Renderer 3D para React |
| **Drei** | 9.121.4 | Helpers y abstracciones 3D |
| **Three.js** | 0.173.0 | Motor 3D WebGL |
| **Lucide React** | 0.475.0 | Iconografía moderna |
| **Lottie React** | 2.4.1 | Animaciones JSON vectoriales |
| **React Markdown** | 9.0.3 | Renderizado de markdown |
| **React Syntax Highlighter** | 15.6.1 | Syntax highlighting de código |
| **React Helmet Async** | 2.0.5 | Meta tags dinámicos para SEO |

### Backend (Serverless)
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 20+ | Runtime serverless |
| **Express** | 5.2.1 | Router para funciones serverless |
| **CORS** | 2.8.6 | Cross-origin requests |
| **Resend** | 3.0.0 | Email API transaccional |
| **dotenv** | 16.4.5 | Variables de entorno |

### DevOps & Tooling
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vercel** | Latest | Edge deployment & serverless functions |
| **ESLint** | 9.21.0 | Linting con flat config |
| **TypeScript ESLint** | 8.24.0 | Reglas específicas para TS |
| **PostCSS** | 8.5.3 | Procesamiento CSS |
| **Autoprefixer** | 10.4.20 | Prefijos CSS automáticos |
| **vite-plugin-sitemap** | 0.7.1 | Generación automática de sitemap |

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel Edge                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  /api/chat  │  │ /api/generate│  │   /api/contact      │ │
│  │  (Groq LLM) │  │ (Groq Vision)│  │   (Resend Email)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      React + Vite SPA                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Hero   │ │ Features │ │ DemoZone │ │   Contact    │  │
│  │  (3D)    │ │(Motion)  │ │  (AI)    │ │  (Form)      │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              BotWidget (AI Assistant)               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```bash
ExePaginasWeb/
├── api/                    # Serverless functions (Vercel)
│   ├── chat.js            # Groq LLM chat endpoint
│   ├── generate.js        # Groq Vision code generation
│   └── contact.js         # Resend email handler
├── src/
│   ├── components/
│   │   ├── Bot/           # AI Chat widget
│   │   ├── DemoZone/      # Interactive demo section
│   │   ├── Features/      # Feature cards
│   │   ├── Hero/          # Hero with 3D elements
│   │   ├── ContactSection.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GiftPromo.tsx
│   │   └── Header.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/                # Static assets
├── web-automation-cli/    # CLI tool for web automation
├── vercel.json           # Vercel routing config
├── vite.config.ts        # Vite + proxy + sitemap
└── tailwind.config.js    # Custom design system
```

---

## 🧠 APIs de IA Integradas

### Groq Chat Completions
- **Modelos:** `llama-3.3-70b-specdec`, `llama-3.1-70b-versatile`, `mixtral-8x7b-32768`
- **Features:** Streaming palabra por palabra, historial de contexto (6 mensajes), botones de respuesta rápida, rate limiting y manejo de fragmentos de red inestables.
- **Temperatura:** 0.6 (balance entre creatividad y coherencia)

### Groq Vision (Code Generation)
- **Modelo:** `llama-3.2-11b-vision-preview`
- **Input:** Imagen base64 (PNG/JPG/WebP hasta 10MB)
- **Output:** Código HTML/CSS generado por IA

### Resend Email
- **From:** `onboarding@resend.dev`
- **To:** `Exemetal@hotmail.com`
- **Validación:** Sanitización de inputs y manejo de errores

---

## ⚡ Performance & Optimizaciones

- **Build time:** ~3.8s (Vite + TypeScript)
- **Bundle splitting:** Code splitting automático por ruta
- **Lazy loading:** Imágenes y componentes pesados cargados bajo demanda
- **Tree shaking:** Eliminación automática de código muerto
- **Compression:** Gzip/Brotli en Vercel Edge
- **Cache:** Headers de cache optimizados para assets estáticos

---

## 🚀 Cómo Ejecutar Localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/ExeDevCentral/ExePaginasweb.git
cd ExePaginasweb

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys:
# - GROQ_API_KEY (Requerida para Streaming)
# - RESEND_API_KEY (opcional para contacto)

# 4. Iniciar servidor de desarrollo
npm run dev        # Frontend en http://localhost:5173
npm run api        # API server en http://localhost:3000
```

---

## 🔮 Roadmap Futuro

- [ ] **Dark/Light Mode Toggle** — Temas dinámicos con TailwindCSS
- [ ] **Calendly Integration** — Agendamiento de reuniones directo
- [ ] **Notion CMS** — Portfolio dinámico vía Notion API
- [ ] **Mapbox Maps** — Mapas interactivos personalizados
- [ ] **Vitest + Playwright** — Testing unitario y E2E
- [ ] **GitHub Actions CI/CD** — Pipeline de calidad automática
- [ ] **i18n (react-i18next)** — Soporte multi-idioma
- [ ] **PWA Full Offline** — Service worker con cache estratégico

---

## 👨‍💻 Autor

**ExeDevCentral** — Desarrollador Full Stack especializado en experiencias web premium con IA.

📧 [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com)
🌐 [Exepaginasweb.com](https://Exepaginasweb.com)
💬 [WhatsApp](https://wa.me/5493416874786)

---

> *"El futuro del desarrollo web no es solo mostrar información, es crear experiencias que piensen por sí mismas."*
