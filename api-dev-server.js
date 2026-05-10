import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Cargar variables de entorno desde .env
dotenv.config({ debug: process.env.DEBUG === 'true' }) // Activa el modo debug si la variable DEBUG está en true
console.log('Estado de carga de variables de entorno:');
console.log(`  - GROQ_API_KEY: ${process.env.GROQ_API_KEY ? 'Cargada (valor oculto por seguridad)' : 'NO cargada'}`);
console.log(`  - DEBUG: ${process.env.DEBUG ? 'Activo' : 'Inactivo'}`);

const app = express()
app.use(cors()) // Express maneja CORS, eliminaremos los manuales para evitar duplicados
app.use(express.json({ limit: '10mb' }))

// Import API handlers
import chatHandler from './api/chat.js'
import generateHandler from './api/generate.js'
import contactHandler from './api/contact.js'

// Manejador de errores global para evitar que el server muera
process.on('uncaughtException', (err) => {
  console.error('💥 Error no capturado (server muriendo):', err.stack || err)
})

// Middleware para loguear peticiones de chat
app.use('/api/chat', (req, res, next) => {
  if (req.method === 'POST') console.log(`[${new Date().toLocaleTimeString()}] 💬 Nueva consulta al chat...`);
  next();
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

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.url}` })
})

const PORT = process.env.API_PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 API dev server running at http://localhost:${PORT}`)
  console.log('   Endpoints: /api/chat, /api/generate, /api/contact')

  // Verificación de carga de variables de entorno
  if (process.env.GROQ_API_KEY) {
    console.log(`   ✅ Groq API Key cargada correctamente (${process.env.GROQ_API_KEY.slice(0, 7)}...)`);
  } else {
    console.log('   ⚠️ ERROR: No se encontró GROQ_API_KEY en el archivo .env');
  }
})
