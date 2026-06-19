# Variables de entorno — Vercel Setup

Ve a **Vercel → Tu proyecto → Settings → Environment Variables** y agrega estas variables.
Actívalas para los entornos: ✅ Production ✅ Preview ✅ Development

---

## 🔑 Supabase (OBLIGATORIAS para que la app funcione)

| Variable                    | Valor                                      | Usado en                           |
| --------------------------- | ------------------------------------------ | ---------------------------------- |
| `VITE_SUPABASE_URL`         | `https://bksonxnxshxinqffswqc.supabase.co` | Frontend (Vite)                    |
| `VITE_SUPABASE_ANON_KEY`    | `eyJhbGci...` (anon key de Supabase)       | Frontend (Vite)                    |
| `SUPABASE_URL`              | `https://bksonxnxshxinqffswqc.supabase.co` | API serverless (Node.js)           |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (service role key)           | API serverless — NUNCA en frontend |

> ⚠️ En las funciones serverless (`/api/*.js`) NO existe el prefijo `VITE_`.
> Por eso se necesita `SUPABASE_URL` (sin prefijo) además de `VITE_SUPABASE_URL`.

---

## 🌐 URL del sitio (OBLIGATORIA para OAuth/Google Login)

| Variable        | Valor                       |
| --------------- | --------------------------- |
| `VITE_SITE_URL` | `https://exepaginasweb.com` |

> ⚠️ En local usa `http://localhost:5173`. En Vercel debe ser la URL de producción.
> Esta variable controla a dónde redirige el login con Google.

---

## 📧 Resend (formulario de contacto)

| Variable            | Valor                                           |
| ------------------- | ----------------------------------------------- |
| `RESEND_API_KEY`    | tu API key de resend.com                        |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` o tu dominio verificado |

---

## 🤖 Groq (chat AI)

| Variable       | Valor                          |
| -------------- | ------------------------------ |
| `GROQ_API_KEY` | tu API key de console.groq.com |

---

## 💳 PayPal

| Variable               | Valor                  |
| ---------------------- | ---------------------- |
| `PAYPAL_CLIENT_ID`     | tu client ID de PayPal |
| `PAYPAL_CLIENT_SECRET` | tu client secret       |
| `PAYPAL_WEBHOOK_ID`    | tu webhook ID          |

---

## ✅ Checklist después de agregar variables

1. [ ] Agregar todas las variables en Vercel → Settings → Environment Variables
2. [ ] En Supabase → Authentication → URL Configuration agregar:
   - **Site URL**: `https://exepaginasweb.com`
   - **Redirect URLs**: `https://exepaginasweb.com/auth/callback`
3. [ ] Hacer Redeploy: Vercel → Deployments → último deploy → Redeploy
4. [ ] Verificar en los logs del build que aparezca:
       `🔌 Supabase Client Initialized with URL: https://bksonxnxshxinqffswqc.supabase.co`
       (si dice `undefined` las variables no están configuradas)
