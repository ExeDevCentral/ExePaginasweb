# Convenciones de nombres

Estas reglas aplican a JavaScript, TypeScript y PostgreSQL. El objetivo es que
el nombre explique la intención y el contrato, no solo el tipo de dato.

## Vocabulario

- Usá los conceptos canónicos de `GLOSSARY.md` y `CONTEXT.md` (`Tenant`,
  `WorkGroup`, `Invoice`, `SLAContract`). No inventes sinónimos para la misma
  entidad.
- En TypeScript, usá identificadores técnicos en inglés y camelCase/PascalCase.
  El texto visible para el usuario sigue el idioma de la interfaz.
- En PostgreSQL, respetá los nombres persistidos existentes, incluidos los
  nombres de dominio en español como `dueno_id`, `estado` y `fecha_emision`.
  Mapealos en repositorios a nombres de dominio claros; no traduzcas una columna
  existente en una consulta aislada.
- No cambies el nombre de una tabla o columna publicada directamente. Usá una
  migración compatible y una transición de lectura/escritura antes de retirar
  el identificador anterior.

## JavaScript y TypeScript

- Variables, propiedades y funciones: `camelCase`. Tipos, clases, enums y
  componentes React: `PascalCase`. Archivos de componentes: `PascalCase.tsx`;
  módulos utilitarios: `camelCase.ts` o el patrón ya establecido en su carpeta.
- Nombrá funciones con verbo + dominio: `listInvoicesByTenantId`,
  `resolveTenantContext`, `calculateRenewalDate`. Evitá `getData`, `processItem`,
  `doAction` y abreviaturas que no estén en el glosario.
- Booleans: prefijos `is`, `has`, `can` o `should`, por ejemplo `isActive` y
  `canManageTenant`.
- Componentes reciben callbacks como `onSave`/`onClose`; handlers internos usan
  `handleSave`/`handleClose`. Hooks comienzan con `use`.
- Clases nombran el rol singular que modelan (`InvoiceRepository`). Interfaces
  nombran el contrato sin prefijo `I` en código nuevo (`InvoiceRepository`);
  los prefijos existentes se retiran solo en refactors acotados con referencias
  actualizadas y pruebas.
- Evitá nombres genéricos (`data`, `item`, `value`, `result`) cuando el tipo de
  dato sea relevante. Preferí `invoice`, `tenantId`, `createdInvoice` o
  `invoiceResult`.
- No cambies un nombre público/exportado sin revisar todas sus referencias,
  serialización, tests y consumidores externos.

## PostgreSQL y Supabase

- Tablas y columnas: `snake_case`; mantené el plural de las tablas existentes.
  Funciones y RPCs: verbo + entidad, como `create_workspace` o
  `check_api_rate_limit`; parámetros `p_` y variables locales `v_`.
- Calificá las tablas con `public.` en migraciones. Usá nombres explícitos para
  índices (`idx_<tabla>_<columnas>`), restricciones (`fk_`, `uq_`, `ck_`) y
  políticas (`policy_<tabla>_<acción>`).
- Un índice debe corresponder a una consulta real y no duplicar otro índice por
  prefijo/columnas. Confirmá columnas en las migraciones fuente y usa
  `EXPLAIN (ANALYZE, BUFFERS)` en local/preview sobre datos representativos.
  `ANALYZE` ejecuta la consulta; en producción usa `EXPLAIN` sin `ANALYZE`, salvo
  una ventana controlada y una consulta de solo lectura.
- Las migraciones deben poder ejecutarse en una base vacía y tener efectos
  explícitos. Para operaciones repetibles, usá `IF EXISTS`/`IF NOT EXISTS` cuando
  sean semánticamente correctos; no los uses para esconder una deriva de schema.
- No ejecutes `db push` contra producción durante una refactorización de nombres.
  Validá primero en una base local y en el preview de un PR.

## Renombres y compatibilidad

1. Identificá el nombre canónico en el glosario y sus consumidores.
2. Para código privado, renombrá con soporte del lenguaje, actualizá referencias
   y agrega o ajusta una prueba de comportamiento.
3. Para schema/API persistente, agregá el nombre nuevo, migra/backfillea datos y
   soportá ambos nombres durante la transición.
4. Retirá el nombre anterior en una migración posterior, cuando no queden
   consumidores.

Cada PR debe explicar el motivo del renombre y los consumidores afectados. No
hagas una renombrada masiva de identificadores sin un inventario y un plan de
compatibilidad.
