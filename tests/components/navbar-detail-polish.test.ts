import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const read = (rel: string) => fs.readFileSync(path.resolve(process.cwd(), rel), 'utf-8')

const MEGA_PANEL = 'src/components/layout/LiquidIsland/MegaPanel.tsx'
const NAVBAR = 'src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx'
const NAV_LINK = 'src/components/layout/LiquidIsland/NavLink.tsx'

describe('MegaPanel: geometría y scroll', () => {
  const content = read(MEGA_PANEL)

  it('limita la altura con dvh para no salirse del viewport móvil', () => {
    expect(content).toMatch(/max-h-\[calc\(100dvh-88px\)\]/)
  })

  it('el área de tarjetas puede encogerse dentro del flex (min-h-0)', () => {
    expect(content).toMatch(/overflow-y-auto[^`"]*min-h-0/)
  })

  it('el panel se apila por encima del widget flotante de chat', () => {
    expect(content).toContain('z-[60]')
    expect(content).toContain('z-[55]')
  })

  it('no deja índices absolutos montados sobre el pie de cada card', () => {
    expect(content).not.toContain('ESTIMATE // 06')
    expect(content).not.toContain('PLANS // 07')
  })

  it('la barra de atajos se oculta en mobile para no cortarse', () => {
    expect(content).toMatch(/hidden sm:flex[^`"]*font-mono/)
  })
})

describe('MegaPanel: accesibilidad del diálogo', () => {
  const content = read(MEGA_PANEL)

  it('expone el panel como diálogo modal', () => {
    expect(content).toContain('role="dialog"')
    expect(content).toContain('aria-modal="true"')
  })

  it('atrapa el foco con Tab dentro del panel', () => {
    expect(content).toMatch(/event\.key === 'Tab'/)
    expect(content).toMatch(/focusables/)
  })

  it('devuelve el foco al trigger al cerrar', () => {
    expect(content).toMatch(/previouslyFocused/)
  })
})

describe('Navbar: detalles de layout y estado activo', () => {
  const content = read(NAVBAR)

  it('el logo no se sale de la píldora por márgenes negativos', () => {
    expect(content).not.toMatch(/min-w-11 min-h-11[^`"]*-m-1/)
  })

  it('marca Contacto como sección actual con scroll-spy', () => {
    expect(content).toContain('IntersectionObserver')
    expect(content).toMatch(/ariaCurrent="location"/)
  })

  it('el badge de disponibilidad no compite con el CTA', () => {
    expect(content).toMatch(/text-\[9px\]/)
  })

  it('el botón de menú mobile tiene un área táctil de 40px', () => {
    expect(content).toMatch(/w-10 h-10/)
  })
})

describe('NavLink: semántica de estado activo', () => {
  const content = read(NAV_LINK)

  it('publica aria-current cuando está activo', () => {
    expect(content).toMatch(/aria-current/)
    expect(content).toMatch(/ariaCurrent/)
  })
})
