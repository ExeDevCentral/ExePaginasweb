# Plan de Implementación: Refactorización de Deuda Técnica Crítica & Alineación Nivel 1 (Validación de Mercado)

Este plan aborda de manera prioritaria la deuda técnica crítica identificada en la auditoría de arquitectura y la alineación estratégica con el **Nivel 1 — Validación (Meses 1-6)**.

---

## 1. Contexto y Objetivos Estratégicos

### El Problema Técnico Activo Resuelto

1. **God Component de 728 líneas (`AdminDashboardView.tsx`)**: Concentraba lógica de filtrado, modales interactivos de tickets, renderizado de 3 tablas complejas (clientes, tickets, pagos), tarjetas de KPIs y estados de carga.
2. **Cero Cobertura de Tests en Módulos Financieros**: Facturación (`InvoicesPanel`), cálculo de totales/MRR, resolución de pagos, suscripciones y modales de checkout (`CheckoutModal`, `PaywallModal`) carecían de tests unitarios.

### La Prioridad Estratégica (Nivel 1 - Validación)

- **Meta principal**: Pasar de 1 cliente (Noema) a **5-10 clientes pagando**.
- **Pregunta clave a responder**: ¿Los clientes prefieren el SaaS multi-tenant completo o solo el módulo de reservas autónomo? ¿Es viable el pricing a $20/mes vs $200/mes?
- **Enfoque de diseño**: Eliminar over-engineering o abstracciones prematuras para lograr alta **repetibilidad de onboarding sin escribir código custom cada vez**.

---

## 2. Los Niveles Reales de Escalabilidad

- **Nivel 1 — Validación (Donde estamos hoy, meses 1-6)**
  - 5-10 clientes pagando.
  - Validación de propuesta de valor ($20/mes solo reservas vs $200/mes SaaS completo).
- **Nivel 2 — Repetibilidad (Meses 6-18)**
  - Incorporar clientes sin modificar código.
  - Ingresos recurrentes estables (MRR).
- **Nivel 3 — Equipo (Año 2+)**
  - Contratación y delegación de soporte/ventas.
- **Nivel 4 — Plataforma & Escala**
  - Rondas de inversión y expansión masiva.

---

## 3. Cambios e Infraestructura Implementada

### Componente 1: Descomposición del God Component (`AdminDashboardView.tsx`)

- `AdminDashboardView.tsx`: Reducido de 728 a ~150 líneas orquestadoras.
- `useAdminDashboardFilters.ts`: Custom hook para filtrados por query, plan y estado de ticket.
- `AdminStatsCards.tsx`: Grilla modular de métricas KPI.
- `AdminClientesTable.tsx`: Tabla aislada de clientes y suscripciones.
- `AdminTicketsTable.tsx`: Tabla de tickets con acciones de soporte.
- `AdminPagosTable.tsx`: Tabla de historial de transacciones.
- `TicketResolutionModal.tsx`: Modal interactivo para responder y cerrar tickets.

### Componente 2: Dominio Financiero & Cobertura de Tests (100% Passed)

- `financialEngine.ts`: Funciones puras para facturación, MRR, descuentos y pasarelas de pago.
- `financialEngine.test.ts`: 10 unit tests de dominio financiero.
- `InvoicesPanel.test.tsx`: 2 tests de integración de facturación.
- `CheckoutModal.test.tsx`: 2 tests de modelo de tienda y checkout.

### Componente 3: Módulo de Configuración Ligera (`tenantConfigResolver.ts`)

- Configuración dinámica por tenant/plan para alternar entre "Módulo de Reservas Standalone" ($20/mo) y "SaaS Completo" ($200/mo) sin escribir código por cliente.
- `tenantConfigResolver.test.ts`: 4 unit tests de resolución de planes.

---

## 4. Resultados de Verificación

```powershell
npm run test -- --run   # 54/54 tests pasando (12/12 test files)
npm run build          # Compilación limpia Vite/TypeScript en 6.72s
```
