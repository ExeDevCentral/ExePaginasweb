# ADR 0003: Uso del Patrón Repositorio para Desacoplar Supabase

**Fecha:** 17 de Mayo de 2026
**Estado:** Aceptado

## Contexto

Siguiendo las directrices de arquitectura limpia para el sistema de reservas, necesitamos integrar Supabase como mecanismo de persistencia. Sin embargo, acoplar directamente el SDK de Supabase a nuestra lógica de dominio o a los componentes de React haría que el sistema sea difícil de testear y altamente dependiente de un proveedor específico.

## Decisión

Adoptamos el **Patrón Repositorio**.

- Definiremos interfaces en la capa de dominio (ej. `IReservationRepository`).
- Crearemos implementaciones concretas en la capa de infraestructura (ej. `SupabaseReservationRepository`).

## Consecuencias

### Positivas:

1. **Testabilidad:** Podemos crear Mocks de los repositorios en memoria para testear servicios de aplicación sin necesidad de levantar una base de datos real ni usar mocks complejos de red.
2. **Flexibilidad:** Si en el futuro decidimos migrar a Prisma, un backend propio en Go, o Firebase, solo tendremos que crear una nueva implementación de la interfaz en `/infra` sin tocar una sola línea de lógica de negocio.
3. **Mantenimiento:** El dominio permanece puro y enfocado en las reglas de negocio (Stage 3).

### Riesgos:

- Añade un nivel de indirección y más archivos (interfaces), pero el beneficio en un sistema complejo de scheduling supera ampliamente este costo.
