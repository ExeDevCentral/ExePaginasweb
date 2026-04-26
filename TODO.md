# TODO - Hacer funcionar Chat y Contacto

## Plan Aprobado

1. [x] `api/chat.js` - Agregar fallback de desarrollo cuando no hay GROQ_API_KEY
2. [x] `api/contact.js` - Capturar error 403 de Resend y guardar mensajes en archivo local
3. [x] `src/components/ContactSection.tsx` - Mejorar feedback de éxito/error
4. [x] Reiniciar servidor API para aplicar cambios
5. [x] Verificar que ambos funcionan

## Estado Final

- **Chatbot**: ✅ Funcionando con respuestas de fallback locales
- **Formulario de contacto**: ✅ Funcionando, guarda mensajes localmente cuando Resend falla

