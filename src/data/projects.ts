export interface Project {
  id: string
  title: string
  category: 'saas' | 'ecommerce' | 'turnos' | 'web'
  categoryLabel: string
  client: string
  description: string
  image: string
  tags: string[]
  metrics: { label: string; value: string }[]
  highlights: string[]
  link?: string | undefined
  status?: 'live' | 'demo' | 'building' | undefined
  statusLabel?: string | undefined
}

// Proyectos reales desplegados en producción Vercel
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'chispa32',
    title: 'Chispa32 — Taller ESP32',
    category: 'web',
    categoryLabel: 'Landing & Web',
    client: 'Chispa32 · Rosario, Argentina',
    description:
      'Landing de alta conversión para taller especializado en reparación y reflasheo de placas ESP32. Diseño técnico premium con propuesta de valor clara, servicios y contacto directo.',
    image: '/portfolio/chispa32.png',
    tags: ['Next.js', 'Tailwind', 'SEO', 'Landing'],
    metrics: [
      { label: 'Stack', value: 'Next.js' },
      { label: 'Tipo', value: 'Landing' },
    ],
    highlights: [
      'Diseño orientado a nicho técnico (ESP32 / IoT)',
      'Sección de servicios y consultas a medida',
      'Despliegue automático en producción Vercel',
      'Optimización de carga y SEO técnico',
    ],
    link: 'https://chispa32.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'gam',
    title: 'Taller Artesanal GAM',
    category: 'web',
    categoryLabel: 'Landing & Web',
    client: 'GAM · Restauración de Máquinas de Escribir',
    description:
      'Web dedicada a la restauración artesanal de máquinas de escribir. Estética vintage-premium que posiciona el oficio, muestra el taller y facilita el contacto para trabajos de restauración.',
    image: '/portfolio/gam.png',
    tags: ['Vite', 'Tailwind', 'Vintage', 'Landing'],
    metrics: [
      { label: 'Stack', value: 'Vite' },
      { label: 'Tipo', value: 'Landing' },
    ],
    highlights: [
      'Identidad visual artesanal y premium',
      'Refleja el oficio de restauración',
      'Carga ultrarrápida (Vite)',
      'Desplegada en producción',
    ],
    link: 'https://restauracion-maquinas-gam.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },

  {
    id: 'noema',
    title: 'Noema — Investigación de Mercado',
    category: 'web',
    categoryLabel: 'Landing & Web',
    client: 'Noema Consultora · Asunción, Paraguay',
    description:
      'Sitio corporativo ejecutivo para consultora de investigación de mercado cualitativa y cuantitativa. Calculadora interactiva de diagnóstico metodológico, dashboard de Data Insights con Chart.js, formulario de contacto vía serverless y diseño glassmorphism con tema oscuro.',
    image: '/portfolio/noema.png',
    tags: ['React', 'TypeScript', 'Vite', 'Chart.js', 'SEO'],
    metrics: [
      { label: 'Stack', value: 'React + Vite' },
      { label: 'Features', value: 'Calculadora + Charts' },
    ],
    highlights: [
      'Calculadora interactiva de diagnóstico metodológico',
      'Dashboard de Data Insights (Chart.js)',
      'Diseño glassmorphism con tema oscuro (#11171D)',
      'SEO con JSON-LD Schema.org y Open Graph',
      'Formulario con Vercel Serverless Functions',
      'Alineación ESOMAR & ISO 20252',
    ],
    link: 'https://noema-ivory.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'celstore',
    title: 'CelStore — E-Commerce Premium de Smartphones',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce',
    client: 'CelStore · Tienda Online de Celulares',
    description:
      'Tienda online premium de smartphones con visor 3D interactivo (Three.js), catálogo multi-boutique, pasarela de pago MercadoPago, panel de administración y estética europea profesional. Next.js 14 App Router, Supabase multi-tenant con RLS, control de stock atómico.',
    image: '/portfolio/celstore.svg',
    tags: ['Next.js', 'Three.js', 'Supabase', 'MercadoPago', '3D'],
    metrics: [
      { label: 'Stack', value: 'Next.js 14' },
      { label: 'Pagos', value: 'MercadoPago' },
    ],
    highlights: [
      'Visor 3D interactivo con Three.js y Depth Maps en GPU',
      'E-commerce multi-boutique con aislamiento de stock',
      'Pagos integrados con MercadoPago SDK v2',
      'Panel de administración con gestión de productos y órdenes',
      'Estética europea profesional con Tailwind CSS v4',
      'Desplegado en Vercel con CI/CD automático',
    ],
    link: 'https://multi-tiendas-celphone.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'coleccion-patrimonial',
    title: 'Colección Patrimonial & Archivo Histórico',
    category: 'web',
    categoryLabel: 'Landing & Web',
    client: 'Colección Patrimonial · Chile',
    description:
      'Museo digital de un fondo histórico chileno con vocación de donación museográfica: catálogo curatorial de libros antiguos, cerámica colonial con pan de oro, manuscritos republicanos, obras de arte y máquinas de escribir de época, con protocolo formal de donación a instituciones.',
    image: '/portfolio/coleccion-patrimonial.svg',
    tags: ['React', 'Vite', 'Tailwind', 'Museo Digital'],
    metrics: [
      { label: 'Stack', value: 'Vite' },
      { label: 'Tipo', value: 'Museo Digital' },
    ],
    highlights: [
      'Vitrina interactiva con lupa curatorial y piezas en 3D',
      'Catálogo de piezas con estado de conservación y procedencia',
      'Línea de tiempo histórica y filosofía curatorial',
      'Protocolo de donación museográfica a museos de Chile',
    ],
    link: 'https://coleccion-patrimonial-chile.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'bilex',
    title: 'Bilex — Traductor de PDFs e Imágenes',
    category: 'web',
    categoryLabel: 'Herramienta Web',
    client: 'Bilex · Herramienta de Traducción Bilingüe',
    description:
      'Aplicación web para traducir documentos completos (PDFs e imágenes) con vista dual bilingüe sincronizada. OCR con Tesseract.js, múltiples motores de traducción (Gemini, Groq, DeepL, OpenAI, Claude), exportación a PDF, TXT, Markdown y sesiones JSON.',
    image: '/portfolio/bilex.svg',
    tags: ['React', 'TypeScript', 'Vite', 'OCR', 'PDF', 'Traducción'],
    metrics: [
      { label: 'Stack', value: 'React + Vite' },
      { label: 'Tipo', value: 'Herramienta OCR/IA' },
    ],
    highlights: [
      'Extracción de texto de PDFs digitales y escaneados (OCR WASM)',
      'Lector bilingüe dual sincronizado párrafo a párrafo',
      '7 motores de traducción modulares con modo demo offline',
      'Exportación multi-formato: PDF bilingüe, TXT, Markdown, JSON',
      'Detección automática de idioma con franc-min',
      'Tema oscuro/claro y diseño responsive',
    ],
    link: 'https://bilex-tau.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'owleye',
    title: 'OwlEyeEngine — Ciberseguridad & Defensa Activa',
    category: 'saas',
    categoryLabel: 'SaaS & Cloud',
    client: 'OwlEyeEngine · Motor de Seguridad',
    description:
      'Plataforma de ciberseguridad de monitoreo en tiempo real: inspección de procesos y red de bajo nivel (psutil), motor heurístico de puntuación de amenazas (0-100), mitigación activa (auto-kill de procesos y bloqueo de IPs en firewall) y dashboard web glassmorphic con stream en vivo vía WebSocket.',
    image: '/portfolio/owleye.png',
    tags: ['Python', 'FastAPI', 'WebSocket', 'psutil', 'Active Defense'],
    metrics: [
      { label: 'Stack', value: 'Python + FastAPI' },
      { label: 'Tipo', value: 'Seguridad / EDR' },
    ],
    highlights: [
      'Detección heurística con scoring de amenazas (LOW→CRITICAL)',
      'Defensa activa: auto-kill de procesos y bloqueo de IPs en firewall',
      'Monitoreo de procesos y red de bajo nivel (psutil)',
      'Dashboard glassmorphic en tiempo real con WebSocket',
      'Modo demo con datos simulados para despliegue serverless',
      'Alertas por Telegram y registro sigiloso persistente',
    ],
    link: 'https://owl-eye-engine.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'fixi',
    title: 'FIXI — Marketplace de Servicios Locales',
    category: 'ecommerce',
    categoryLabel: 'Marketplace',
    client: 'FIXI · Rosario y Región',
    description:
      'Plataforma inteligente que conecta profesionales de oficio (jardinería, electricidad, fletes, plomería, pintura y más) con clientes de Rosario y la región. Contacto directo por WhatsApp, sistema de alertas con geolocalización en tiempo real, tablero de trabajos solicitados, perfiles con valoraciones y experiencia inmersiva con 3D.',
    image: '/portfolio/fixi.jpg',
    tags: ['React', 'Vite', 'Three.js', 'Supabase', 'Marketplace'],
    metrics: [
      { label: 'Stack', value: 'React + Vite' },
      { label: 'Servicios', value: 'Marketplace + GPS' },
    ],
    highlights: [
      'Hero inmersivo con visual 3D (Three.js + React Three Fiber)',
      'Contacto directo profesional ↔ cliente por WhatsApp',
      'Alertas de solicitudes y trabajos con geolocalización',
      'Tablero de trabajos solicitados y perfiles con valoraciones',
      'Backend con Supabase (auth + datos) y modo demo offline',
      'Zonas de cobertura: Rosario, Funes, Roldán, Baigorria',
    ],
    link: 'https://fixi-phi.vercel.app/',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'sportmanager',
    title: 'SportManager / PlayHub — Gestión Deportiva SaaS',
    category: 'turnos',
    categoryLabel: 'Turnos & Reservas',
    client: 'SportManager · Centros Deportivos',
    description:
      'Plataforma SaaS completa de gestión para complejos deportivos: reservas multi-espacio con calendario visual, pagos por webhook Mercado Pago, CRM de clientes, importación masiva desde Excel, notificaciones email/WhatsApp y analítica en tiempo real. Arquitectura multi-tenant con Supabase, anti doble-reserva con EXCLUDE GiST y roles por complejo.',
    image: '/portfolio/sportmanager.jpg',
    tags: ['Next.js 16', 'Supabase', 'Mercado Pago', 'SaaS', 'Multi-Tenant'],
    metrics: [
      { label: 'Stack', value: 'Next.js + Supabase' },
      { label: 'Tipo', value: 'SaaS Multi-Tenant' },
    ],
    highlights: [
      'Calendario visual multi-espacio con anti doble-reserva (GiST EXCLUDE)',
      'Pagos confirmados solo por webhook Mercado Pago (idempotentes)',
      'CRM completo: ficha de cliente, historial, gasto total y preferencias',
      'Importación masiva desde Excel con staging, deduplicación y auditoría',
      'Notificaciones email/WhatsApp según canal preferido del cliente',
      'Roles por complejo (Owner/Admin/Operador/Plataforma) con RLS',
      'Dashboard con KPIs, ocupación, ingresos y analítica en tiempo real',
      'Multi-deporte por diseño: pádel, tenis, fútbol, natación, yoga y más',
    ],
    link: 'https://sportmanager-playhub.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
]
