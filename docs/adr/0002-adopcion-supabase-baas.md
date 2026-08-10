# ADR 0002: Adopción de Supabase como BaaS (Backend as a Service)

**Fecha:** 17 de Mayo de 2026
**Estado:** Aceptado

## Contexto

Para ejecutar la Etapa 2 de nuestro Roadmap de Ingeniería (Infraestructura), requerimos un motor de base de datos y autenticación capaz de soportar una arquitectura Multi-Tenant compleja (Negocios, Usuarios, Reservas, Horarios), que además tenga un encaje perfecto con nuestro stack Frontend (React + Vite + Vercel). Construir un backend custom en Node.js desde cero nos expone a riesgos de seguridad y retrasaría meses el go-to-market.

## Decisión

Adoptamos **Supabase** como plataforma Backend-as-a-Service principal.

## Consecuencias

### Positivas:

1. **PostgreSQL Puro:** Nos brinda el poder relacional necesario para evitar superposición de horarios (overlapping), manejar transacciones de pagos y garantizar integridad referencial.
2. **Row Level Security (RLS) Nativo:** Resuelve el problema Multi-Tenant. Podemos programar políticas a nivel de base de datos asegurando que el Dueño A jamás pueda ver las reservas del Dueño B.
3. **Autenticación (Auth) y Roles:** Manejo seguro de contraseñas, sesiones, JWTs y Magic Links out-of-the-box.
4. **Velocidad para Etapa 3 (Core Engine):** Al tener el backend resuelto, nuestro esfuerzo de ingeniería se concentra netamente en el TDD de las lógicas de negocio en el frontend/edge, sin perder tiempo configurando ORMs pesados o infraestructura de servidores.

### Riesgos Gestionados:

- Existe un ligero lock-in con Supabase Auth y RLS. Lo mitigaremos aislando el acceso a la base de datos detrás de servicios / repositorios en nuestro frontend en lugar de acoplar componentes UI directamente al cliente de Supabase.
