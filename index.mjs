// Test script for AI SDK integration
// Verified: streamText + @ai-sdk/groq works with SSE passthrough
// Run: node index.mjs (requires GROQ_API_KEY in .env)
import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.log('Testing @ai-sdk/groq with streamText...')
  console.log('GROQ_API_KEY set:', !!process.env.GROQ_API_KEY)

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: 'Eres el asistente oficial de ExeSistemasWEB.',
    messages: [{ role: 'user', content: 'Hola!' }],
    temperature: 0.6,
    maxTokens: 200,
  })

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk)
  }
  console.log('\n\n--- Streaming OK ---')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
