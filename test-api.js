// Suite de pruebas de integración para la API

async function testChat() {
  console.log('🧪 Probando /api/chat...')
  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hola, cuanto cuesta una landing page?' })
    })
    const data = await res.json()
    console.log('✅ Chat response:', data)
    return data.reply ? 'OK' : 'FAIL'
  } catch (err) {
    console.error('❌ Chat error:', err.message)
    return 'FAIL'
  }
}

async function testContact() {
  console.log('\n🧪 Probando /api/contact...')
  try {
    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', message: 'Hola, estoy interesado en una web' })
    })
    const data = await res.json()
    console.log('✅ Contact response:', data)
    return data.ok ? 'OK' : 'FAIL'
  } catch (err) {
    console.error('❌ Contact error:', err.message)
    return 'FAIL'
  }
}

async function testGenerate() {
  console.log('\n🧪 Probando /api/generate...')
  try {
    // Imagen mínima de 1x1 transparente para la prueba
    const dummyImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: dummyImage, mimeType: 'image/png' })
    })
    
    if (res.status === 429) {
      console.log('⚠️ Rate limit alcanzado (resultado esperado en pruebas repetitivas)')
      return 'OK'
    }

    console.log('✅ Generate response status:', res.status)
    return res.ok ? 'OK' : 'FAIL'
  } catch (err) {
    console.error('❌ Generate error:', err.message)
    return 'FAIL'
  }
}

async function main() {
  console.log('🔍 Verificando conexión con el servidor...')
  try {
    const res = await fetch('http://localhost:3000/')
    if (!res.ok) throw new Error()
  } catch (err) {
    console.error('❌ Error: El servidor local no está activo en http://localhost:3000')
    console.log('👉 Ejecuta "node api-dev-server.js" en otra terminal antes de probar.')
    process.exit(1)
  }

  console.log('🚀 Servidor detectado. Iniciando pruebas...\n')
  const chatResult = await testChat()
  const contactResult = await testContact()
  const generateResult = await testGenerate()

  console.log('\n📊 Resultados:')
  console.log('   Chat:', chatResult)
  console.log('   Contact:', contactResult)
  console.log('   Generate:', generateResult)

  if ([chatResult, contactResult, generateResult].includes('FAIL')) {
    console.error('\n❌ Algunas pruebas fallaron.')
    process.exit(1)
  }
  console.log('\n✨ Todas las pruebas pasaron exitosamente.')
}

main()
