/**
 * © 2025 Exequiel Echevarría — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('HeroProductShowcase - Controles de video auto-hide', () => {
  const showcasePath = path.resolve(process.cwd(), 'src/components/Hero/HeroProductShowcase.tsx')
  const content = fs.readFileSync(showcasePath, 'utf-8')

  it('debe tener el estado showControls y un temporizador de 4 segundos (4000ms)', () => {
    expect(content).toContain('const [showControls, setShowControls] = useState(true)')
    expect(content).toContain('const resetControlsTimer = useCallback(')
    expect(content).toContain('4000')
  })

  it('debe vincular eventos de interacción del usuario para reactivar los controles', () => {
    expect(content).toContain('onMouseMove={resetControlsTimer}')
    expect(content).toContain('onMouseEnter={resetControlsTimer}')
    expect(content).toContain('onTouchStart={resetControlsTimer}')
  })

  it('debe permitir pausar o reproducir al hacer click sobre el video directamente', () => {
    expect(content).toContain('onClick={togglePlay}')
  })

  it('debe aplicar clases de transición suave y ocultamiento condicional a la barra de controles', () => {
    expect(content).toContain('showControls')
    expect(content).toContain('opacity-100 translate-y-0 pointer-events-auto')
    expect(content).toContain('opacity-0 translate-y-3 pointer-events-none')
    expect(content).toContain('transition-all duration-500 ease-out')
  })
})
