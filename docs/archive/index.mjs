import { streamText } from 'ai'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const result = streamText({
    model: 'groq/llama-3.3-70b-versatile',
    system: 'Eres el asistente de ExeSistemasWEB.',
    messages: [{ role: 'user', content: 'Hola! Que ofrecen?' }],
    temperature: 0.6,
    maxTokens: 400,
  })

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk)
  }
  console.log('\n\n--- AI Gateway OK ---')
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
