/**
 * Generador de micro-sonidos sintetizados en tiempo real mediante Web Audio API.
 * No requiere archivos de audio externos y es ultra liviano.
 */

class StoreAudioManager {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('exe_sound_fx')
      this.enabled = stored !== 'false'
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public setEnabled(val: boolean) {
    this.enabled = val
    if (typeof window !== 'undefined') {
      localStorage.setItem('exe_sound_fx', String(val))
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled)
    return this.enabled
  }

  public playHover() {
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
    } catch {
      // Ignorar si el navegador bloquea autoplay
    }
  }

  public playSelect() {
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
    } catch {
      // Ignorar si el navegador bloquea autoplay
    }
  }

  public playToggle() {
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
    } catch {
      // Ignorar si el navegador bloquea autoplay
    }
  }
}

export const storeAudio = new StoreAudioManager()
