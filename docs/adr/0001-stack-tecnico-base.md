# ADR 0001: Adopción del Stack Técnico Base (Boutique)

**Fecha:** 17 de Mayo de 2026
**Estado:** Aceptado

## Contexto
El estudio está en transición de vender "páginas web básicas" a "sistemas de software integrales" para negocios locales (automatización de reservas, turnos, e-commerce). Para respaldar esta propuesta de valor de alto nivel (precios de setup + abonos de mantenimiento), necesitamos una base tecnológica que garantice un rendimiento extremo, una estética premium (animaciones fluidas) y mantenibilidad a largo plazo.

## Decisión
Adoptamos el siguiente stack tecnológico principal:
- **Frontend Core:** React 18+ con TypeScript.
- **Build Tool:** Vite.
- **Estilos:** Tailwind CSS.
- **Animaciones:** Framer Motion.
- **Hosting:** Vercel.

## Consecuencias
### Positivas:
1. **Tipado Estricto (TypeScript):** Evitará bugs en producción y facilitará la creación de sistemas complejos (como calendarios de turnos y carritos de compras).
2. **Estética y Percepción de Marca (Tailwind + Framer Motion):** Nos permite crear efectos premium ("Spotlights", glassmorphism, físicas de resorte) con un peso muy bajo y sin depender de plantillas pesadas.
3. **Performance (Vite + Vercel):** El Edge computing de Vercel asegura Tiempos de Respuesta (TTFB) de milisegundos, fundamental para la retención del cliente y el SEO técnico (Lighthouse 99+).

### Negativas/Riesgos:
1. **Curva de Aprendizaje:** Requiere disciplina para no ensuciar el código (TDD, arquitecturas limpias, componentes pequeños).
2. **Dependencia del Ecosistema:** Estamos fuertemente anclados a React y al ecosistema de Node/NPM.
