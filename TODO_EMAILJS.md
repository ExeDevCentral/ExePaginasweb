# TODO - Implementar EmailJS para formulario de contacto

## Plan Aprobado

1. [x] Agregar `@emailjs/browser` a `package.json`
2. [x] Actualizar `src/components/ContactSection.tsx` para usar EmailJS
3. [x] Actualizar `.env` con variables de EmailJS
4. [x] Instalar dependencias (`npm install`)
5. [ ] Probar funcionamiento

## Estado

- ✅ EmailJS agregado a dependencias
- ✅ `ContactSection.tsx` reescrito para usar EmailJS directamente desde frontend
- ✅ Eliminada dependencia de backend `/api/contact` y Resend
- ⏳ Falta configurar variables de entorno en `.env` (manual)
- ✅ Dependencias instaladas
- ✅ Build exitoso

## Instrucciones para configurar EmailJS

### 1. Crear cuenta en EmailJS
- Ir a https://www.emailjs.com
- Registrarse (gratis, 200 emails/mes)

### 2. Agregar un servicio de email
- En el dashboard, ir a "Email Services" → "Add New Service"
- Elegir Gmail, Outlook, o el que uses
- Seguir los pasos de autorización
- Copiar el **Service ID** (ej: `service_abc123`)

### 3. Crear una plantilla (template)
- Ir a "Email Templates" → "Create New Template"
- En el contenido del email, usar estas variables:
  ```
  De: {{from_name}} <{{from_email}}>
  
  Mensaje:
  {{message}}
  ```
- En "To Email" poner: `Exemetal@hotmail.com` (tu email)
- Guardar y copiar el **Template ID** (ej: `template_xyz789`)

### 4. Obtener la Public Key
- Ir a "Account" → "General"
- Copiar la **Public Key** (ej: `AbCdEfGhIjKlMnOp`)

### 5. Configurar el archivo `.env`
Agregar estas líneas a tu archivo `.env` existente:

```
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
```

Reemplazar los valores con los IDs reales obtenidos en los pasos anteriores.

### 6. Instalar dependencias
```bash
npm install
```

### 7. Probar
- Ejecutar `npm run dev`
- Ir a la sección de contacto
- Enviar un mensaje de prueba
- Verificar que llega a tu email

