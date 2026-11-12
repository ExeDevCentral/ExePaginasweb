// @ts-nocheck
'use client'
/*!
ReactDrops Component License 1.0

Copyright (c) 2026 ReactDrops

1. Scope and definitions

This license applies to ReactDrops software and associated documentation that
expressly carry this license or are distributed under a LICENSE file containing
it (the "Software"). "Licensor" means the copyright holder granting rights in
the Software, and only to the extent that holder has authority to grant them.
"You" means the individual or entity exercising these rights.

An "End Product" is a website, application, service, or other finished project
whose primary purpose is something other than providing reusable components,
source code, templates, or development assets to others.

2. Permitted uses

Subject to this license, Licensor grants You a worldwide, non-exclusive,
royalty-free license to use, copy, modify, and incorporate the Software into
unlimited personal, internal, and commercial End Products. You may charge for
End Products, subscriptions, development services, and work for clients.

You may distribute the Software as an integrated part of an End Product,
including in browser-delivered JavaScript. You may provide End Product source
code to a client, and share the Software with employees and contractors who
need it to develop or maintain End Products. Those recipients may use the
Software for those purposes subject to this license. This permission does not
authorize them to redistribute the Software as a reusable development asset.

3. Restricted redistribution

Unless You obtain separate written permission from Licensor, You may not sell,
sublicense, publish, share, or otherwise redistribute the Software, or a
substantial portion of it, whether unchanged or modified:

(a) as a standalone component, component library, UI kit, source-code bundle,
    registry, or other collection of reusable development assets;
(b) as part of a theme, template, starter project, or similar product offered
    to multiple recipients for reuse in their own projects; or
(c) through a builder or generation service that offers the Software as
    reusable blocks or source-code exports for others' projects.

These restrictions apply to paid and free redistribution. Renaming, restyling,
repackaging, translating, or modifying the Software does not remove them.
Building separate finished websites or applications for multiple clients is
permitted; offering a reusable template or kit containing the Software is not.

Public source-code hosting by Licensor is not permission to republish the
Software under another license. This license does not override any separate
rights granted directly by Licensor or applicable code-hosting terms.

4. Notices and ownership

Retain this license and applicable copyright and third-party notices in source
copies of the Software and permitted source distributions. No visible credit
or ReactDrops logo is required in an End Product's user interface.

Licensor retains ownership of its Software. You retain rights in Your own
contributions, subject to the license for any incorporated Software. No rights
to trademarks, trade names, or logos are granted by this license.

5. Third-party materials and separate grants

Dependencies, fonts, images, videos, and other third-party materials remain
subject to their respective licenses. Separately identified third-party code
is licensed under its stated terms, and these restrictions do not limit rights
granted by its copyright holders. Retain all required third-party notices.
Demo media are not licensed by this document; obtain Your own permission or
replace them with media You are entitled to use.

This license does not revoke rights granted under other valid licenses. It does
not assert ownership of third-party work or grant rights Licensor lacks.

6. Termination

The permissions granted here continue unless terminated for a material breach.
If You fail to cure a material breach within 30 days after receiving written
notice from Licensor, Your permissions terminate. On termination, cease uses
and distributions requiring this license. Rights under independently granted
licenses and rights that applicable law does not allow to be restricted remain
unaffected. Sections 3 through 7 survive termination.

7. Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. TO THE MAXIMUM EXTENT
PERMITTED BY APPLICABLE LAW, LICENSOR AND CONTRIBUTORS SHALL NOT BE LIABLE FOR
ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT, OR OTHERWISE,
ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR ITS USE.

This license does not limit rights or exceptions that applicable law makes
non-waivable. No other permissions are granted by implication.
*/

'use client'

import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import {
  createLiquidGlassLogoRenderer,
  liquidGlassLogoDefaults,
  liquidGlassLogoThemes,
  normalizeLiquidGlassLogo,
  type LiquidGlassLogoTuning,
} from './liquid-glass-logo-renderer'
import './liquid-glass-logo.css'

export type LiquidGlassLogoHandle = {
  replay: () => void
  /** Shows the moment `seconds` after the start, with speed and delay applied. */
  seek: (seconds: number) => void
  pause: () => void
  play: () => void
}
export type LiquidGlassLogoProps = Partial<LiquidGlassLogoTuning> & {
  height?: number | string
  /** Image URL drawn behind the animation, covering the container. The plate turns see-through. */
  backgroundImage?: string
  /**
   * Video URL played muted and looping behind the animation, covering the container.
   * It replaces backgroundImage, which then serves as the poster until the video plays.
   * The video follows paused, replay(), seek(), pause() and play(), and stays still
   * when the visitor prefers reduced motion.
   */
  backgroundVideo?: string
  /**
   * Part of the background video that plays, in seconds. Animation time 0 shows
   * backgroundVideoStart, and the video loops back to it after backgroundVideoEnd
   * (the end of the file by default).
   */
  backgroundVideoStart?: number
  backgroundVideoEnd?: number
  /** Horizontal and vertical offsets as percentages of the frame; 0 centers the background. */
  backgroundX?: number
  backgroundY?: number
  /** Scale of the cover image or video, from 1 to 3. */
  backgroundScale?: number
  /** Color and opacity (0–1) of the overlay between the background and the logo. */
  backgroundTint?: string
  backgroundTintOpacity?: number
  className?: string
  style?: CSSProperties
  /** Accessible name; defaults to "Logo" or the visible wordmark text. */
  'aria-label'?: string
}

/** The section of a video of `duration` seconds that plays, clamped to the file. */
function videoSection(duration: number, start = 0, end?: number) {
  const length = Number.isFinite(duration) && duration > 0 ? duration : Infinity
  const from = Number.isFinite(start) && start > 0 && start < length ? start : 0
  const to =
    end !== undefined && Number.isFinite(end) && end > from ? Math.min(end, length) : length
  return { from, to }
}

/**
 * Where a background video is at animation time `seconds`: its section starts
 * at time 0 and loops back to its start after its end.
 */
export function liquidGlassLogoVideoTime(
  seconds: number,
  duration: number,
  start?: number,
  end?: number
) {
  const { from, to } = videoSection(duration, start, end)
  const time = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  return Number.isFinite(to) ? from + (time % (to - from)) : from + time
}

export const LiquidGlassLogo = forwardRef<LiquidGlassLogoHandle, LiquidGlassLogoProps>(
  function LiquidGlassLogo(
    {
      height,
      backgroundImage,
      backgroundVideo,
      backgroundVideoStart = 0,
      backgroundVideoEnd,
      backgroundX = 0,
      backgroundY = 0,
      backgroundScale = 1,
      backgroundTint = '#000000',
      backgroundTintOpacity = 0,
      className = '',
      style,
      'aria-label': label,
      ...overrides
    },
    ref
  ) {
    const canvas = useRef<HTMLCanvasElement>(null)
    const video = useRef<HTMLVideoElement>(null)
    const engine = useRef<ReturnType<typeof createLiquidGlassLogoRenderer>>(null)
    const [ready, setReady] = useState(false)
    const [fallback, setFallback] = useState(false)
    // A theme supplies the colors; any color passed explicitly still wins.
    const theme = liquidGlassLogoThemes[overrides.theme === 'light' ? 'light' : 'dark']
    // Over a background image or video the plate is see-through: the glass keeps
    // its optics, but its own color would hide the picture behind it.
    const hasBackground = Boolean(backgroundImage || backgroundVideo)
    const tuning = normalizeLiquidGlassLogo({
      ...liquidGlassLogoDefaults,
      ...theme,
      ...overrides,
      ...(hasBackground ? { tile: false } : {}),
    })
    const key = JSON.stringify(tuning)
    const latest = useRef(tuning)
    latest.current = tuning
    // The background video shares the animation's clock: it pauses, restarts and
    // seeks with it, and stays still when the visitor prefers reduced motion.
    const section = useRef({ start: backgroundVideoStart, end: backgroundVideoEnd })
    section.current = { start: backgroundVideoStart, end: backgroundVideoEnd }
    // A full-length video loops by itself; a section is looped by the watcher below.
    const sectioned = backgroundVideoStart > 0 || backgroundVideoEnd !== undefined
    const playVideo = () => {
      const media = video.current
      if (!media || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
      void media.play().catch(() => {})
    }
    const seekVideo = (seconds: number) => {
      const media = video.current
      if (!media) return
      const { start, end } = section.current
      const target = liquidGlassLogoVideoTime(seconds, media.duration, start, end)
      if (Math.abs(media.currentTime - target) > 0.001) media.currentTime = target
    }
    useImperativeHandle(
      ref,
      () => ({
        replay: () => {
          engine.current?.replay()
          seekVideo(0)
        },
        seek: (seconds) => {
          // Seconds as the animation plays them: its speed and delay apply, so a
          // seek lands where the playing animation and its video would be.
          engine.current?.seek(seconds * latest.current.speed)
          seekVideo(Number.isFinite(seconds) ? Math.max(0, seconds) : 0)
        },
        pause: () => {
          engine.current?.pause()
          video.current?.pause()
        },
        play: () => {
          engine.current?.play()
          playVideo()
        },
      }),
      []
    )
    useEffect(() => {
      const media = video.current
      if (!media) return
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')
      const sync = () => (tuning.paused || reduced?.matches ? media.pause() : playVideo())
      sync()
      reduced?.addEventListener?.('change', sync)
      return () => reduced?.removeEventListener?.('change', sync)
      // playVideo only reads refs.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tuning.paused, backgroundVideo])
    // Keeps a playing section inside its bounds, checked every frame so the
    // jump back to the start lands on time.
    useEffect(() => {
      const media = video.current
      if (!media || !sectioned) return
      let frame = 0
      const keep = () => {
        const { from, to } = videoSection(media.duration, backgroundVideoStart, backgroundVideoEnd)
        if (media.ended || media.currentTime >= to || media.currentTime < from - 0.05) {
          media.currentTime = from
          if (media.paused && !latest.current.paused) playVideo()
        }
      }
      const watch = () => {
        keep()
        frame = requestAnimationFrame(watch)
      }
      const start = () => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(watch)
      }
      const stop = () => cancelAnimationFrame(frame)
      media.addEventListener('loadedmetadata', keep)
      media.addEventListener('ended', keep)
      media.addEventListener('play', start)
      media.addEventListener('pause', stop)
      if (media.readyState >= 1) keep()
      if (!media.paused) start()
      return () => {
        stop()
        media.removeEventListener('loadedmetadata', keep)
        media.removeEventListener('ended', keep)
        media.removeEventListener('play', start)
        media.removeEventListener('pause', stop)
      }
      // playVideo only reads refs.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backgroundVideo, sectioned, backgroundVideoStart, backgroundVideoEnd])
    useEffect(() => {
      if (!canvas.current) return
      let renderer: ReturnType<typeof createLiquidGlassLogoRenderer> = null
      try {
        renderer = createLiquidGlassLogoRenderer(canvas.current, latest.current, () =>
          setReady(true)
        )
      } catch {
        renderer = null
      }
      if (!renderer) setFallback(true)
      engine.current = renderer
      return () => {
        renderer?.dispose()
        engine.current = null
      }
    }, [])
    // Apply size and DPR changes before the resized canvas can be painted.
    useLayoutEffect(() => engine.current?.update(latest.current), [key])
    const markSource = tuning.mark === 'logo' ? tuning.logo : tuning.mark
    const backgroundTransform = `translate(${Math.max(-100, Math.min(100, backgroundX))}%, ${Math.max(-100, Math.min(100, backgroundY))}%) scale(${Math.max(1, Math.min(3, backgroundScale))})`
    return (
      <div
        className={`liquid-glass-logo ${className}`.trim()}
        style={{
          height,
          background: tuning.background,
          ...style,
        }}
        role="img"
        aria-label={label ?? (tuning.ending === 'logo' ? 'Logo' : tuning.text)}
        data-liquid-glass-ready={ready || undefined}
      >
        {backgroundVideo ? (
          <video
            ref={video}
            className="liquid-glass-logo-background"
            aria-hidden="true"
            tabIndex={-1}
            src={backgroundVideo}
            poster={backgroundImage}
            muted
            loop={!sectioned}
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            style={{ transform: backgroundTransform }}
          />
        ) : (
          backgroundImage && (
            <div
              className="liquid-glass-logo-background"
              aria-hidden="true"
              style={{
                background: `url(${JSON.stringify(backgroundImage)}) center / cover no-repeat`,
                transform: backgroundTransform,
              }}
            />
          )
        )}
        {hasBackground && (
          <div
            className="liquid-glass-logo-background"
            aria-hidden="true"
            style={{
              backgroundColor: backgroundTint,
              opacity: Math.max(0, Math.min(1, backgroundTintOpacity)),
            }}
          />
        )}
        <canvas ref={canvas} aria-hidden="true" />
        {fallback && (
          <span
            className="liquid-glass-logo-fallback"
            aria-hidden="true"
            style={{
              color: tuning.textColor,
              fontFamily: tuning.fontFamily,
              fontWeight: tuning.fontWeight,
              fontSize: tuning.fontSize,
              letterSpacing: `${tuning.letterSpacing}em`,
              gap: `${tuning.markGap}em`,
            }}
          >
            {tuning.ending === 'logo' ? (
              <img
                src={tuning.logo}
                alt=""
                style={{
                  width: tuning.logoSize * tuning.logoScale * tuning.finalLogoScale,
                  height: tuning.logoSize * tuning.logoScale * tuning.finalLogoScale,
                  maxWidth: '80%',
                  maxHeight: '80%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <>
                {markSource && <img src={markSource} alt="" />}
                {tuning.text}
              </>
            )}
          </span>
        )}
      </div>
    )
  }
)
