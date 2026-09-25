/**
 * Script para notificar a IndexNow (Bing, Yandex, y buscadores asociados)
 * sobre todas las páginas de https://exepaginasweb.com
 */
const KEY = 'e8f49a1c97c14041b3e896422b4097f2'
const HOST = 'exepaginasweb.com'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

const URLS = [
  `https://${HOST}`,
  `https://${HOST}/soluciones`,
  `https://${HOST}/portafolio`,
  `https://${HOST}/demos`,
  `https://${HOST}/precios`,
  `https://${HOST}/tienda`,
  `https://${HOST}/cotizador`,
  `https://${HOST}/privacidad`,
  `https://${HOST}/terminos`,
]

async function submitIndexNow() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  }

  console.log('Enviando URLs a IndexNow...')
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    console.log(`Respuesta IndexNow status: ${res.status} ${res.statusText}`)
    if (res.status === 200 || res.status === 202) {
      console.log('✅ URLs enviadas correctamente a IndexNow.')
    } else {
      const text = await res.text()
      console.log(`Detalles: ${text}`)
    }
  } catch (err) {
    console.error('Error al enviar a IndexNow:', err)
  }
}

submitIndexNow()
