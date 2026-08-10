import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const uploadedLogoPath = path.join(rootDir, 'public', 'logo-source.jpg')
const publicDir = path.join(rootDir, 'public')

const possibleBrowserPaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe',
]

const executablePath = possibleBrowserPaths.find((p) => p && fs.existsSync(p))

if (!executablePath) {
  console.error('No browser executable found!')
  process.exit(1)
}

async function createDualLogos() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  const imgBase64 = fs.readFileSync(uploadedLogoPath).toString('base64')
  const imgDataUri = `data:image/jpeg;base64,${imgBase64}`

  // Mode: 'dark-bg' (white logo for dark background) or 'light-bg' (black logo for light background)
  const renderLogoVariant = async (outWidth, outHeight, mode = 'dark-bg') => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; }
          body { width: ${outWidth}px; height: ${outHeight}px; overflow: hidden; background: transparent; }
          canvas { width: 100%; height: 100%; object-fit: contain; }
        </style>
      </head>
      <body>
        <canvas id="c" width="${outWidth}" height="${outHeight}"></canvas>
        <script>
          const img = new Image();
          img.onload = () => {
            const canvas = document.getElementById('c');
            const ctx = canvas.getContext('2d');
            
            const scale = Math.min(${outWidth} / img.width, ${outHeight} / img.height) * 0.95;
            const x = (${outWidth} - img.width * scale) / 2;
            const y = (${outHeight} - img.height * scale) / 2;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i+1];
              const b = data[i+2];

              // 1. Remove white background (r > 220, g > 220, b > 220)
              if (r > 220 && g > 220 && b > 220) {
                data[i+3] = 0; // transparent
                continue;
              }

              // 2. Identify Yellow accent (high red, high green, low blue: e.g., r > 180, g > 180, b < 100)
              const isYellow = (r > 160 && g > 160 && b < 110);

              if (isYellow) {
                // Keep yellow vibrant
                data[i] = 250;   // R
                data[i+1] = 204; // G
                data[i+2] = 21;  // B (amber/yellow #FACC15)
                data[i+3] = 255;
              } else {
                // Black parts of original logo
                if ('${mode}' === 'dark-bg') {
                  // On dark background: turn black shapes to crisp WHITE
                  data[i] = 255;
                  data[i+1] = 255;
                  data[i+2] = 255;
                  data[i+3] = 255;
                } else {
                  // On light background: keep black shapes crisp BLACK
                  data[i] = 15;
                  data[i+1] = 23;
                  data[i+2] = 42;
                  data[i+3] = 255;
                }
              }
            }

            ctx.putImageData(imgData, 0, 0);
            window.done = true;
          };
          img.src = "${imgDataUri}";
        </script>
      </body>
      </html>
    `

    await page.setViewport({ width: outWidth, height: outHeight, deviceScaleFactor: 2 })
    await page.setContent(html)
    await page.waitForFunction(() => window.done === true)
    return await page.screenshot({ type: 'png', omitBackground: true })
  }

  console.log('Generating logo-dark.png (for dark backgrounds)...')
  const darkLogo = await renderLogoVariant(600, 600, 'dark-bg')
  fs.writeFileSync(path.join(publicDir, 'logo-dark.png'), darkLogo)
  fs.writeFileSync(path.join(publicDir, 'logo-dark.webp'), darkLogo)
  fs.writeFileSync(path.join(publicDir, 'logo-40.webp'), darkLogo)
  fs.writeFileSync(path.join(publicDir, 'logo.webp'), darkLogo)
  fs.writeFileSync(path.join(publicDir, 'logo.png'), darkLogo)

  console.log('Generating logo-light.png (for light backgrounds)...')
  const lightLogo = await renderLogoVariant(600, 600, 'light-bg')
  fs.writeFileSync(path.join(publicDir, 'logo-light.png'), lightLogo)
  fs.writeFileSync(path.join(publicDir, 'logo-light.webp'), lightLogo)

  await browser.close()
  console.log('Dual theme logo assets generated successfully!')
}

createDualLogos().catch((err) => {
  console.error(err)
  process.exit(1)
})
