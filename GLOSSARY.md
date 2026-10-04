# GLOSSARY: Vocabulario Ubicuo & Dominio — ExePaginasweb

Este documento establece el lenguaje formal y no negociable de **ExePaginasweb**. Todas las decisiones de código, componentes, interfaces, tests y agentes deben adherir a estos términos sin derivar a sinónimos genéricos ni jerga de marketing vacía ("vibe coding").

---

## 1. Identidad de Autor & Filosofía de Ingeniería

| Término | Definición Canónica | Lo que NO es |
| :--- | :--- | :--- |
| **Exequiel Echevarría** | **Software & Web Architect** (Alcance Global: Europa, EE. UU., Sudamérica, China, Australia). Autor directo y ejecutor de todas las arquitecturas del repositorio. Sin intermediarios comerciales ni agencias pantalla. | No es una "agencia corporativa 360", ni un "equipo ficticio de marketing". |
| **Sistemas Web a Medida** | Software transaccional, dinámico y escalable construido desde cero con código propio, arquitectura modular limpia y contratos tipados (TypeScript estricto). | No son plantillas infladas de WordPress, temas comprados de Webflow ni landings desechables. |
| **Ingeniería Real** | Filosofía que rige el repositorio: Diseño de Módulos Profundos (John Ousterhout), TDD estricto, BigInt para valores financieros, 0 errores de tipo, aceleración por hardware GPU (60-120 FPS) y verificación reproducible antes de comitear. | No es "Vibe Coding", no es código adivinado por LLMs sin pruebas, no son componentes frágiles sin tests. |
| **Deep Module (Módulo Profundo)** | Principio de diseño de software: interfaz mínima, clara y simple hacia el consumidor, ocultando internamente una gran complejidad, robustez y potencia de conversión. | No son módulos superficiales ("shallow modules") que filtran estado interno ni fuerzan al consumidor a orquestar detalles secundarios. |

---

## 2. Componentes de Navegación & Conversión

| Término | Definición Canónica |
| :--- | :--- |
| **Liquid Island** | Barra de navegación flotante tipo *Dynamic Island* construida con Framer Motion, refracción SVG líquida, luz rasante superior (`inset 0 1px 1px rgba(255,255,255,0.2)`) y aura perimetral difusa (`filter: blur(14px)`). Actúa como Deep Module. |
| **Sub-Tagline Técnico** | Firma explícita de autoría integrada al header: `• Exequiel Echevarría — Software & Web Architect · Alcance Global (Europa · EE. UU. · Sudamérica · China · Australia)`. |
| **Disponibilidad en Tiempo Real** | Badge dinámico visible en la navegación (`ABRIL // DISPONIBLE` con pulso luminoso) que informa cupos de desarrollo activos. |
| **Action Sheet Móvil de Conversión** | Drawer emergente para smartphones con desenfoque de fondo profundo (`backdrop-blur-2xl`), avatar de autor EXE, botón de cotización ergonómico y enlace directo a WhatsApp en vivo. |
| **Iconografía Vectorial Limpia** | Sistema de iconos SVG vectoriales de trazo fino (1.8px - 2px) estilo Linear/Vercel (Sparkles geométricos, flechas cinéticas, WhatsApp SVG). Cero emojis básicos de sistema operativo. |

---

## 3. Motores de Producción & Casos Reales

| Término | Definición Canónica |
| :--- | :--- |
| **RESTOia Engine** | Motor gastronómico y transaccional desarrollado por Exequiel Echevarría, actualmente **en producción**. Cuenta con facturación fiscal ARCA/AFIP, terminal KDS en vivo, soporte offline-first y servidor de protocolo MCP. Es el caso de prueba insignia exhibido en el portafolio. |
| **KOBE Gastronomic Engine** | Arquitectura backend monolítica modular basada en PostgreSQL con doble libro contable (*Operational Stock Ledger* + *Accounting Ledger* inmutable) documentada en [ADR 0001](file:///docs/adr/0001-kobe-gastronomic-engine-architecture.md). |
| **Protocolo MCP (Model Context Protocol)** | Protocolo estándar abierto que conecta de forma segura a modelos y agentes de IA con bases de datos transaccionales, APIs de facturación y repositorios de datos del negocio. |

---

## 4. Arquitectura SaaS B2B Multi-Tenant & Datos

| Término | Definición Canónica |
| :--- | :--- |
| **Tenant** | Organización o empresa cliente. Raíz de aislamiento lógico absoluto garantizado a nivel base de datos mediante Supabase Row Level Security (RLS). |
| **Location** | Sucursal o local físico dependiente de un `Tenant`. |
| **BigInt Monetario** | Todo importe, precio o saldo monetario se almacena y procesa exclusivamente como enteros de 64 bits (`BigInt`) en la unidad mínima indivisible (centavos). Prohibido el uso de flotantes (`float` o `double precision`) para dinero. |
| **Audit Ledger** | Registro de auditoría criptográfica *append-only* con encadenamiento de hashes SHA-256 (`prev_hash` y `hash`) para garantizar inmutabilidad transaccional. |
| **SLA Contract** | Contrato de nivel de servicio asociado a un Tenant, con umbrales de resolución y escalamiento automatizado de incidencias. |
