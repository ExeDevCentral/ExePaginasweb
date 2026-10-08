function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
/**
 * Generador de micro-sonidos sintetizados en tiempo real mediante Web Audio API.
 * No requiere archivos de audio externos y es ultra liviano.
 */

class StoreAudioManager {
  __init() {
    this.ctx = null
  }
  __init2() {
    this.enabled = true
  }

  constructor() {
    StoreAudioManager.prototype.__init.call(this)
    StoreAudioManager.prototype.__init2.call(this)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('exe_sound_fx')
        this.enabled = stored !== 'false'
      } catch (e) {
        this.enabled = true
      }
    }
  }

  getContext() {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (
      _optionalChain([this, 'access', (_) => _.ctx, 'optionalAccess', (_2) => _2.state]) ===
      'suspended'
    ) {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  isEnabled() {
    return this.enabled
  }

  setEnabled(val) {
    this.enabled = val
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('exe_sound_fx', String(val))
      } catch (e2) {
        // safe fallback
      }
    }
  }

  toggle() {
    this.setEnabled(!this.enabled)
    return this.enabled
  }

  playHover() {
    if (!this.enabled) return
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime) // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.05) // E6

      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.06)
    } catch (e3) {
      // Ignorar si el navegador bloquea autoplay
    }
  }

  playSelect() {
    if (!this.enabled) return
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'triangle'
      osc2.type = 'sine'

      // Acorde armónico ascendente
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.14) // C6

      osc2.frequency.setValueAtTime(659.25, ctx.currentTime) // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.5, ctx.currentTime + 0.14) // E6

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start()
      osc2.start()
      osc1.stop(ctx.currentTime + 0.22)
      osc2.stop(ctx.currentTime + 0.22)
    } catch (e4) {
      // Ignorar si el navegador bloquea autoplay
    }
  }

  playToggle() {
    if (!this.enabled) return
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.025, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.09)
    } catch (e5) {
      // Ignorar si el navegador bloquea autoplay
    }
  }
}

export const storeAudio = new StoreAudioManager()
