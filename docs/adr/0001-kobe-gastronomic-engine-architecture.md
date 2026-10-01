# ADR 0001: KOBE Gastronomic Engine — Arquitectura del Sistema & Decisiones Fundacionales

## Estado
Aprobado (2026-09-29)

## Contexto
El sector gastronómico demanda un sistema de software integral que resuelva puntos ciegos críticos: robo hormiga, mermas sin control, pérdida de comandas en picos de salón, comisiones asfixiantes de intermediarios de delivery y caos administrativo/contable.

Los sistemas tradicionales fallan por dos extremos: o son juguetes visuales sin consistencia transaccional, o son sistemas legacy monolíticos acoplados que no escalan ni ofrecen experiencia en tiempo real ni inteligencia operativa.

Se requiere diseñar e implementar **KOBE Gastronomic Engine**: un motor transaccional multi-tenant, con contabilidad operacional inmutable, trazabilidad de stock FEFO y capa de herramientas de IA estrictamente gobernadas por dominio, acompañado de una experiencia visual cinematográfica (Chiaroscuro, OKLCH, R3F bajo demanda).

## Decisiones Arquitectónicas No Negociables

### 1. Monolito Modular sobre PostgreSQL (Sin Microservicios Prematuros)
- **Decisión:** Se implementa un Monolito Modular con PostgreSQL como única fuente de verdad transaccional.
- **Razón:** Evita la sobrecarga operativa, transacciones distribuidas complejas (2PC/Sagas prematuras) y latencias de red en operaciones concurrentes de salón y cocina.
- **Fronteras:** Cada módulo se organiza por contexto delimitado (Bounded Context):
  - `domain/` (Entidades, invariantes puras, tipos, reglas de negocio)
  - `application/` (Casos de uso, orquestación de servicios de dominio, transacciones)
  - `infrastructure/` (Repositorios, adaptadores de terceros, SQL)
  - `schemas/` (Contratos Zod para validación de entrada/salida)

### 2. Dual Ledger: Separación Estricta entre Stock Ledger y Accounting Ledger
- **Decisión:** El inventario y el dinero no se modelan como columnas escalares mutables (`stock = 10` o `cash = 50000`).
- **Operational Stock Ledger:** Inmutable, basado en movimientos (`StockMovement` con `from_location`, `to_location`, `lot_id`, `quantity`). El stock actual es `SUM(quantity)`.
- **Double-Entry Accounting Ledger:** Partida doble contable (`JournalEntry` y `JournalLine`) donde `SUM(debe) = SUM(haber)`.
- **Razón:** El stock mide cantidades físicas; la contabilidad mide flujos financieros y valorización monetaria. Nunca deben mezclarse en la misma entidad.

### 3. Máquinas de Estado Desacopladas (Order ≠ KitchenTicket ≠ Payment)
- **Decisión:** No existe un único campo `order_status` que mezcle preparación y pago.
- **Estados de Order:** `DRAFT` → `CONFIRMED` → `IN_PREPARATION` → `READY` → `DELIVERED` → `CLOSED` (o `CANCELLED`).
- **Estados de KitchenTicket:** `QUEUED` → `PREPARING` → `READY` → `CANCELLED`.
- **Estados de Payment:** `PENDING` → `AUTHORIZED` → `PAID` → `FAILED` → `REFUNDED` / `PARTIALLY_REFUNDED`.
- **Razón:** Permite cobros divididos (split-bill: efectivo + Mercado Pago + tarjeta), pedidos que agregan platos durante el servicio y anulaciones parciales en cocina sin corromper el estado general de la mesa.

### 4. Tenancy Jerárquico: Organization -> Location
- **Decisión:** La raíz de aislamiento no es un simple usuario, sino `Organization` (empresa o franquicia) que agrupa múltiples `Location` (sucursales físicas).
- **Razón:** Permite que un dueño o franquiciante gestione múltiples locales con inventarios, cartas de precios y cajas independientes, compartiendo o consolidando reportes.
- **Seguridad:** Aislamiento forzado en aplicación (`TenantContext`) y en base de datos mediante Supabase Row Level Security (`RLS`). Ningún `tenant_id` recibido del cliente es de confianza directa; se deriva del token de sesión autenticado.

### 5. Tipos de Datos y Precisión Numérica Absoluta
- **Moneda:** `bigint` expresado en centavos mínimos (evita errores de redondeo IEEE 754).
- **Pesos/Medidas:** `integer` en la unidad mínima base (gramos o mililitros).
- **Cantidades fraccionarias/conversiones:** `numeric(14,3)`.
- **Prohibición:** Prohibido el uso de `float` o `double precision` en dinero, stock o recetas.

### 6. Consumo FEFO Concurrente Seguro
- **Decisión:** El consumo de ingredientes sigue el principio **FEFO** (*First Expired, First Out*).
- **Concurrencia:** La reserva y deducción de lotes se ejecuta dentro de transacciones de base de datos utilizando `SELECT ... FOR UPDATE SKIP LOCKED` sobre `StockLot`.

### 7. Gobernanza de Inteligencia Artificial (Tool Layer con RBAC)
- **Decisión:** El agente de IA jamás ejecuta DDL ni SQL dinámico libre.
- **Mecanismo:** La IA solo interactúa mediante un **Tool Registry** tipado con Zod:
  - **Read Tools:** Consultas de estado optimizadas y cacheadas con permisos de lectura.
  - **Write Tools:** Invocan Domain Services transaccionales, exigen token de autorización, confirmación explícita del usuario y generan registro obligatorio en `AuditLog`.

### 8. Auditoría Inmutable con Hash Chaining
- **Decisión:** La tabla `AuditLog` es append-only.
- **Protección:** Se revoca `UPDATE` y `DELETE` para todos los roles a nivel PostgreSQL.
- **Trazabilidad:** Cada registro contiene `prev_hash` y calcula `hash = sha256(prev_hash || payload)`. Se vincula a `request_id` y `correlation_id` para reconstruir incidentes de punta a punta.

### 9. Frontend, Resiliencia Offline & Sistema Visual
- **Salón (Mozo POS):** PWA con cola local en IndexedDB y generación de UUIDs en cliente para operar ante cortes transitorios de red con sincronización idempotente.
- **Cocina (KDS):** Interfaz oscura de alta visibilidad conectada a Supabase Realtime, con reconexión automática y reconciliación contra la base de datos central.
- **Tokens Visuales:** Espacio de color OKLCH (`oklch(0.14 0.01 60)` carbón cálido, acento cobre `oklch(0.72 0.13 55)`), tipografía Fraunces variable, scroll storytelling y 3D en R3F con `frameloop="demand"` y carga diferida.

---

## Consecuencias
- **Positivas:** Consistencia matemática y financiera a prueba de auditorías legales y fiscales; capacidad de multi-sucursal; soporte de picos de concurrencia sin desincronización de stock ni doble cobro; comercialización ágil con demo basada en datos reales.
- **Compromisos:** Requiere mayor disciplina en migraciones SQL, tipado estricto de eventos de dominio y batería rigurosa de tests automáticos (unitarios, concurrencia y pgTAP de RLS) antes de liberar interfaces.
