# Modelo de Dominio y Arquitectura Multi-Tenant

## Visión General (/zoom-out)
El sistema central de ExeSistemasWEB operará como un **SaaS B2B Multi-Tenant**. Cada cliente (Negocio/Business) tendrá su propio entorno aislado dentro de la misma infraestructura, garantizado mediante Supabase Row Level Security (RLS) a nivel de base de datos.

---

## 1. Entidades Principales (Core Domain)

### `Business` (Tenant)
- Representa al cliente de la agencia (ej. "Cancha de Pádel El Saque").
- Es la raíz del aislamiento de datos (`tenant_id`).
- Atributos clave: `id`, `name`, `slug` (para su URL única), `timezone`, `config_settings`.

### `User` (Global & Auth)
- Usuarios autenticados mediante Supabase Auth.
- La relación entre `User` y `Business` se maneja a través de una tabla pivot `User_Business_Roles`.

### `Employee` (Resource)
- Personal o recurso que presta un servicio dentro de un `Business`. (En una cancha, el "empleado" puede ser la cancha física).
- Tiene sus propios horarios (`Schedule`) y `Availability`.

### `Service`
- Lo que el `Business` ofrece (ej. "Corte de pelo", "Turno 60 min").
- Atributos clave: `duration_minutes`, `price`, `requires_employee`, `capacity`.

### `Schedule` & `Availability`
- Reglas de negocio sobre cuándo un `Business` o `Employee` está disponible.
- Estructura compleja: Días laborales regulares + Excepciones (feriados, vacaciones, bloqueos manuales).

### `Reservation` (Booking)
- La transacción core. El corazón del sistema.
- Atributos: `business_id`, `customer_info`, `service_id`, `start_time`, `end_time`, `status`.

---

## 2. Máquina de Estados de Reservas (State Machine)
Una reserva no es solo una fila en una base de datos, es una entidad con ciclo de vida estricto:

`pending` ➔ (pago/aprobación) ➔ `confirmed`
`confirmed` ➔ (pasa el tiempo) ➔ `completed`
`confirmed` ➔ (cliente no va) ➔ `no_show`
`[any]` ➔ (acción manual/usuario) ➔ `cancelled`

**Validación Crítica (Conflict Detector):**
Antes de insertar cualquier reserva, el sistema debe garantizar matemáticamente que el bloque `[start_time, end_time]` no se superpone (overlap) con otra reserva confirmada para el mismo `Employee`/Recurso, respetando el `timezone` del `Business`.

---

## 3. Arquitectura de Permisos (RBAC)
- **SuperAdmin:** Nosotros (ExeSistemasWEB) - Acceso maestro a todos los tenants.
- **Owner/Admin:** El dueño del `Business` - Configura la lógica de su negocio (servicios, horarios, empleados).
- **Staff:** Ve su propia agenda, puede marcar `completed` o `no_show`.
- **Customer:** El cliente final (Guest o Logged In) que agenda el turno desde la web pública del `Business`.
