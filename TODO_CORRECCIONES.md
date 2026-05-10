# TODO Correcciones y Optimización

## Fase 1: Corregir dependencias
- [x] package.json - Versiones reales de dependencias
- [x] Mover @types a devDependencies
- [ ] Reinstalar node_modules

## Fase 2: Configurar proxy para APIs
- [x] vite.config.ts - Agregar proxy /api/*

## Fase 3: Mejorar APIs serverless
- [x] api/chat.js - CORS, fallback modelo, mejor errores, API key configurada
- [x] api/generate.js - CORS, mejor manejo de errores, API key configurada
- [x] api/contact.js - CORS, eliminado Resend

## Fase 3.5: Eliminar Resend
- [x] Quitar resend de package.json
- [x] Simplificar api/contact.js (sin envío de email)
- [x] Verificar que no queden referencias a Resend

## Fase 3.6: Variables de entorno y seguridad
- [x] Crear .env.example con todas las variables documentadas
- [x] Crear .env (ignorado por git)
- [x] Quitar API key hardcodeada de api/chat.js
- [x] Quitar API key hardcodeada de api/generate.js
- [x] Implementar envío real de emails con Resend en api/contact.js
- [x] Añadir dotenv para cargar variables en api-dev-server.js
- [x] Añadir resend y dotenv a package.json

## Fase 4: Corregir errores JSX
- [x] DemoZone.tsx - Corregir ternarios anidados

## Fase 5: Optimizar frontend
- [x] App.tsx - Lazy loading con Suspense
- [x] BotWidget.tsx - Mejor manejo de errores de API

## Fase 6: Verificación
- [x] npm run build exitoso
- [x] APIs funcionando correctamente

