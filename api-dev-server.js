import 'dotenv/config'
import express from 'express'
import cors from 'cors'

// Estado de carga de variables de entorno (ya cargadas por el primer import)
console.log('Estado de carga de variables de entorno:')
console.log(
  `  - GROQ_API_KEY: ${process.env.GROQ_API_KEY ? 'Cargada (valor oculto por seguridad)' : 'NO cargada'}`
)
console.log(
  `  - RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'Cargada (valor oculto por seguridad)' : 'NO cargada'}`
)
console.log(`  - DEBUG: ${process.env.DEBUG ? 'Activo' : 'Inactivo'}`)

const app = express()
app.use(cors()) // Express maneja CORS, eliminaremos los manuales para evitar duplicados
app.use(express.json({ limit: '10mb' }))

// Import API handlers
import chatHandler from './api/chat.js'
import generateHandler from './api/generate.js'
import contactHandler from './api/contact.js'
import createPayPalOrderHandler from './api/create-paypal-order.js'
import paypalWebhookHandler from './api/paypal-webhook.js'

// Manejador de errores global para evitar que el server muera
process.on('uncaughtException', (err) => {
  console.error('💥 Error no capturado (server muriendo):', err.stack || err)
})

// Middleware para loguear peticiones de chat
app.use('/api/chat', (req, res, next) => {
  if (req.method === 'POST')
    console.log(`[${new Date().toLocaleTimeString()}] 💬 Nueva consulta al chat...`)
  next()
})

process.on('unhandledRejection', (reason) => {
  console.error('💥 Promesa no manejada:', reason)
})

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Backend de ExepaginasW activo en puerto 3000',
  })
})

// Mount routes
app.all('/api/chat', async (req, res) => {
  try {
    const USE_BETA_CHAT = process.env.ENABLE_BETA_CHAT === 'true'

    if (USE_BETA_CHAT) {
      console.log('\x1b[35m%s\x1b[0m', '[Feature Flag] 🚀 Ejecutando lógica BETA para /api/chat')
      // Podrías llamar a un chatHandlerBeta(req, res) aquí
    }
    await chatHandler(req, res)
  } catch (error) {
    console.error('[Dev Server] Chat Error:', error)
    if (!res.headersSent) res.status(500).json({ error: error.message })
  }
})

app.all('/api/generate', async (req, res) => {
  try {
    await generateHandler(req, res)
  } catch (error) {
    console.error('[Dev Server] Generate Error:', error)
    res.status(500).json({ error: 'Error interno en el handler de generación.' })
  }
})

app.all('/api/contact', async (req, res) => {
  try {
    await contactHandler(req, res)
  } catch (error) {
    console.error('[Dev Server] Contact Error:', error)
    res.status(500).json({ error: 'Error interno en el handler de contacto.' })
  }
})

app.all('/api/create-paypal-order', async (req, res) => {
  try {
    await createPayPalOrderHandler(req, res)
  } catch (error) {
    console.error('[Dev Server] Create PayPal Order Error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.all('/api/paypal-webhook', async (req, res) => {
  try {
    await paypalWebhookHandler(req, res)
  } catch (error) {
    console.error('[Dev Server] PayPal Webhook Error:', error)
    res.status(200).json({ error: error.message })
  }
})

app.all('/api/send-email', async (req, res) => {
  try {
    const { sendEmailHandler } = await import('./api/send-email.js')
    await sendEmailHandler(req, res)
  } catch (error) {
    console.error('[Dev Server] Send Email Error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.url}` })
})

const PORT = process.env.API_PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 API dev server running at http://localhost:${PORT}`)
  console.log('   Endpoints: /api/chat, /api/generate, /api/contact')

  // Verificación de carga de variables de entorno
  if (process.env.GROQ_API_KEY) {
    console.log(
      `   ✅ Groq API Key cargada correctamente (${process.env.GROQ_API_KEY.slice(0, 7)}...)`
    )
  } else {
    console.log('   ⚠️ ERROR: No se encontró GROQ_API_KEY en el archivo .env')
  }

  if (process.env.RESEND_API_KEY) {
    console.log(
      `   ✅ Resend API Key cargada correctamente (${process.env.RESEND_API_KEY.slice(0, 7)}...)`
    )
  } else {
    console.log('   ⚠️ ADVERTENCIA: No se encontró RESEND_API_KEY en el archivo .env')
  }
})
