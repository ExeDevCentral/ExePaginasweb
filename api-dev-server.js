import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Import API handlers
import chatHandler from './api/chat.js'
import generateHandler from './api/generate.js'
import contactHandler from './api/contact.js'

// Mount routes
app.all('/api/chat', async (req, res) => {
  // Convert Express req/res to Vercel-like handler signature
  await chatHandler(req, res)
})

app.all('/api/generate', async (req, res) => {
  await generateHandler(req, res)
})

app.all('/api/contact', async (req, res) => {
  await contactHandler(req, res)
})

const PORT = process.env.API_PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 API dev server running at http://localhost:${PORT}`)
  console.log('   Endpoints: /api/chat, /api/generate, /api/contact')
})

