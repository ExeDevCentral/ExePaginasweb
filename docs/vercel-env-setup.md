# Variables de entorno — Vercel Setup (Next.js)

Ve a **Vercel → Tu proyecto → Settings → Environment Variables** y agrega estas variables.
Actívalas para los entornos: ✅ Production ✅ Preview ✅ Development

---

## 🔑 Supabase (OBLIGATORIAS para que la app funcione)

| Variable                        | Valor                                      | Usado en                     |
| ------------------------------- | ------------------------------------------ | ---------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://bksonxnxshxinqffswqc.supabase.co` | Frontend (Next.js Browser)   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (anon key de Supabase)       | Frontend (Next.js Browser)   |
| `SUPABASE_URL`                  | `https://bksonxnxshxinqffswqc.supabase.co` | Servidor / Route Handlers    |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJhbGci...` (service role key)           | Servidor — NUNCA en frontend |

---

## 🌐 URL del sitio (OBLIGATORIA para OAuth/Google Login & Metadatos)

| Variable               | Valor                       | Usado en                               |
| ---------------------- | --------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://exepaginasweb.com` | Redirects de Auth, Canonical URLs, SEO |
| `SITE_URL`             | `https://exepaginasweb.com` | Route Handlers y Webhooks              |

> ⚠️ En local usa `http://localhost:3000`. En Vercel debe ser la URL de producción `https://exepaginasweb.com`.

---

## 📧 Resend (formulario de contacto y webhooks)

| Variable                        | Valor                                       |
| ------------------------------- | ------------------------------------------- |
| `RESEND_API_KEY`                | `re_...` (tu API key de resend.com)         |
| `RESEND_FROM_EMAIL`             | `Contacto@exepaginasweb.com`                |
| `RESEND_WEBHOOK_SIGNING_SECRET` | `whsec_...` (Svix webhook secret de Resend) |
| `ADMIN_EMAIL`                   | `Exemetal@hotmail.com`                      |

---

## 🤖 Motores de Inteligencia Artificial (Chatbot)

| Variable         | Valor                                           |
| ---------------- | ----------------------------------------------- |
| `GEMINI_API_KEY` | tu API key de Google AI Studio (Recomendado)    |
| `GROQ_API_KEY`   | tu API key de console.groq.com (Fallback Llama) |

---

## 💳 PayPal (Pagos y Checkout)

| Variable                       | Valor                                            |
| ------------------------------ | ------------------------------------------------ |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | tu client ID público de PayPal para botones SDK  |
| `PAYPAL_CLIENT_ID`             | tu client ID de PayPal (Backend)                 |
| `PAYPAL_CLIENT_SECRET`         | tu client secret (Backend)                       |
| `PAYPAL_WEBHOOK_ID`            | tu webhook ID (Backend)                          |
| `PAYPAL_API_BASE`              | `https://api-m.paypal.com` (o sandbox para test) |

---

## 🎨 UI & Feature Flags

| Variable                   | Valor                 |
| -------------------------- | --------------------- |
| `NEXT_PUBLIC_DASHBOARD_UI` | `v2` (predeterminado) |

---

## ✅ Checklist después de agregar variables en Vercel

1. [ ] Agregar todas las variables en **Vercel → Settings → Environment Variables**
2. [ ] En **Supabase → Authentication → URL Configuration** agregar:
   - **Site URL**: `https://exepaginasweb.com`
   - **Redirect URLs**: `https://exepaginasweb.com/auth/callback`
3. [ ] Hacer Redeploy: **Vercel → Deployments → último deploy → Redeploy** (para que tome las nuevas variables)
