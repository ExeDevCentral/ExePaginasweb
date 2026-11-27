/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * Suite TDD — Motor de Instagram & Humanizer Bilingüe (ES-AR + EN)
 */
import { describe, it, expect } from 'vitest'
import {
  HOOK_FORMULAS,
  scoreReelHook,
  buildBeatSheet,
  lintInstagramCaption,
  humanizeDraft,
  detectMachineSignals,
} from './index'

describe('Instagram Studio Domain Engine (Pure TS Deep Module)', () => {
  describe('1. scoreReelHook — Panel de 5 propiedades + 26 fórmulas', () => {
    it('incluye las 26 fórmulas canónicas con ejemplos localizados', () => {
      expect(HOOK_FORMULAS).toHaveLength(26)
      expect(HOOK_FORMULAS[0]?.name).toBe('Cost Confession')
      expect(HOOK_FORMULAS[2]?.name).toBe('Nobody Tells You')
    })

    it('califica como STRONG un hook concreto en español rioplatense y detecta su fórmula', () => {
      const report = scoreReelHook(
        'Nadie te dice que anotar 40 turnos por WhatsApp te cuesta clientes.'
      )
      expect(report.verdict).toBe('STRONG')
      expect(report.overall).toBeGreaterThanOrEqual(70)
      expect(report.dealbreakers).toHaveLength(0)
      expect(report.matchedFormula?.name).toBe('Nobody Tells You')
    })

    it('reconoce números hablados en español ("tres", "cero") en SPECIFICITY', () => {
      const report = scoreReelHook('Dejá de perder tres horas cobrando señas a mano.')
      expect(report.checks.SPECIFICITY.score).toBeGreaterThanOrEqual(75)
      expect(report.checks.ADDRESS.score).toBeGreaterThanOrEqual(90)
      expect(report.verdict).toBe('STRONG')
    })

    it('penaliza como WEAK un saludo con preámbulo, emoji y hashtag (dealbreakers)', () => {
      const report = scoreReelHook(
        'Hola amigos, en el video de hoy te voy a mostrar diseño web 🔥 #viral'
      )
      expect(report.verdict).toBe('WEAK')
      expect(report.overall).toBeLessThan(50)
      expect(report.dealbreakers.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('2. buildBeatSheet — Cronometraje de guion de Reel', () => {
    it('calcula códigos de tiempo, detecta loop con el hook y marca beats estáticos (>4s)', () => {
      const script = [
        'Perdí $180,000 por gestionar turnos de pádel en una planilla.',
        'Durante seis meses cada lluvia del viernes significaba responder cuarenta mensajes uno por uno mientras se caían las reservas de la noche sin seña confirmada.',
        'Pasamos todo a reserva online con seña automática en RESTOia.',
        'Ese cambio de sistema me ahorró $180,000 este trimestre.',
      ].join('\n')

      const sheet = buildBeatSheet(script, { wpm: 155, targetSeconds: 25 })
      expect(sheet).not.toBeNull()
      if (!sheet) return

      expect(sheet.beats[0]?.label).toBe('HOOK')
      expect(sheet.beats[sheet.beats.length - 1]?.label).toBe('CTA')
      expect(sheet.hasLoop).toBe(true)
      expect(sheet.loopWords).toContain('$180000')
      expect(sheet.beats.some((b) => b.dur > 4)).toBe(true)
    })
  })

  describe('3. lintInstagramCaption — Ventana visible de 125 chars y límite de 5 hashtags', () => {
    it('recorta exactamente a 125 caracteres, valida 1 solo CTA y <= 5 hashtags específicos', () => {
      const caption = [
        'Pasamos una clínica de 42 mensajes diarios por WhatsApp a turnos automáticos en 14 días.',
        '',
        'El cuello de botella nunca era la secretaria: era confirmar horarios a mano sin recordatorio automático.',
        '',
        'Comentá TURNOS y te mando la arquitectura exacta por DM.',
        '',
        '#sistemasweb #automatizacion #turnosmedicos',
      ].join('\n')

      const lint = lintInstagramCaption(caption, {
        keywords: ['turnos', 'whatsapp'],
      })

      expect(lint.truncated).toBe(true)
      expect(lint.visible.length).toBe(125)
      expect(lint.hashtags).toHaveLength(3)
      expect(lint.verdict).toBe('READY')
      expect(lint.checks.find((c) => c.check === 'HASHTAGS')?.status).toBe('PASS')
      expect(lint.checks.find((c) => c.check === 'ONE ASK')?.status).toBe('PASS')
    })

    it('marca FAIL cuando supera el tope actual de 5 hashtags y WARN con links muertos', () => {
      const badCaption =
        'Mirá https://exepaginasweb.com #viral #fyp #parati #web #saas #tech #reels'
      const lint = lintInstagramCaption(badCaption)

      expect(lint.verdict).toBe('FIX')
      expect(lint.checks.find((c) => c.check === 'HASHTAGS')?.status).toBe('FAIL')
      expect(lint.checks.find((c) => c.check === 'LINKS')?.status).toBe('WARN')
    })
  })

  describe('4. humanizeDraft & detectMachineSignals — Limpieza de huella IA y preservación', () => {
    it('elimina caracteres invisibles, rayas largas (—), slop ES/EN y preserva URLs y {{tu_numero}}', () => {
      const dirty =
        '¡Dejá de scrollear!\u200B\uFEFF En el vertiginoso mundo actual — tu negocio necesita una solución integral para llevar tu negocio al siguiente nivel. No es solo una web, es un ecosistema que ahorra {{tu_numero}} horas en https://exepaginasweb.com/v2.'

      const beforeDetect = detectMachineSignals(dirty)
      const cleaned = humanizeDraft(dirty)
      const afterDetect = detectMachineSignals(cleaned.text)

      expect(cleaned.text).not.toContain('\u200B')
      expect(cleaned.text).not.toContain('\uFEFF')
      expect(cleaned.text).not.toContain('—')
      expect(cleaned.text.toLowerCase()).not.toContain('dejá de scrollear')
      expect(cleaned.text.toLowerCase()).not.toContain('vertiginoso mundo actual')
      expect(cleaned.text).toContain('{{tu_numero}}')
      expect(cleaned.text).toContain('https://exepaginasweb.com/v2')
      expect(cleaned.unverifiedPlaceholders).toContain('{{tu_numero}}')
      expect(cleaned.report.structures.length).toBeGreaterThanOrEqual(1)
      expect(afterDetect.humanScore).toBeGreaterThan(beforeDetect.humanScore)
    })
  })
})
