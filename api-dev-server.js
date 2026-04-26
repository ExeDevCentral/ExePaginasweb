import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Cargar variables de entorno desde .env
dotenv.config()

const app = express()
app.use(cors()) // Express maneja CORS, eliminaremos los manuales para evitar duplicados
app.use(express.json({ limit: '10mb' }))

// Import API handlers
import chatHandler from './api/chat.js'
import generateHandler from './api/generate.js'
import contactHandler from './api/contact.js'

// Manejador de errores global para evitar que el server muera
process.on('uncaughtException', (err) => {
  console.error('💥 Error no capturado (server mueriendo):', err)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promesa no manejada:', reason)
})

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'Backend de ExepaginasW activo en puerto 3000' 
  })
})

// Mount routes
app.all('/api/chat', async (req, res) => {
  try {
    // Simulamos entorno Vercel: si Express ya parseó el body, lo pasamos
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

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.url}` })
})

const PORT = process.env.API_PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 API dev server running at http://localhost:${PORT}`)
  console.log('   Endpoints: /api/chat, /api/generate, /api/contact')
})
