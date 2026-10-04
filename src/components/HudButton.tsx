/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * HudButton — Botón HUD Chaflanado con efecto Descifrado (Matrix Scramble)
 */
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import './HudButton.css'

export interface HudButtonProps {
  /** Texto del botón que se descifra en hover (opcional si se provee children) */
  label?: string | undefined
  /** Contenido hijo (puede ser texto o elementos) */
  children?: React.ReactNode | undefined
  /** Enlace opcional: si se provee, renderiza un <a> / <Link>; si no, un <button> */
  href?: string | undefined
  /** Variante visual: primary (con glow cyan) o secondary (más translúcido) */
  variant?: 'primary' | 'secondary' | undefined
  /** Tamaño del botón */
  size?: 'sm' | 'md' | 'lg' | undefined
  /** Si debe mostrar el punto cian parpadeante (default: true en primary, false en secondary) */
  showDot?: boolean | undefined
  /** Ícono opcional a la derecha o izquierda */
  icon?: React.ReactNode | undefined
  /** Posición del ícono */
  iconPosition?: 'left' | 'right' | undefined
  /** Función de click */
  onClick?: ((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void) | undefined
  /** Callback en mouse enter */
  onMouseEnter?: ((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void) | undefined
  /** Callback en mouse leave */
  onMouseLeave?: ((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void) | undefined
  /** Deshabilitado */
  disabled?: boolean | undefined
  /** Clase CSS adicional */
  className?: string | undefined
  /** Target para links */
  target?: string | undefined
  /** Rel para links */
  rel?: string | undefined
  /** Tipo de botón HTML */
  type?: 'button' | 'submit' | 'reset' | undefined
  /** Estilos en línea */
  style?: React.CSSProperties | undefined
  /** Atributo title */
  title?: string | undefined
  /** Atributos de accesibilidad */
  'aria-label'?: string | undefined
}

const GLYPHS = '0123456789ABCDEF!<>-_/[]{}—=+*^?#~'

function getSizeClass(size: 'sm' | 'md' | 'lg' | undefined): string {
  if (size === 'sm') return 'hud--sm'
  if (size === 'lg') return 'hud--lg'
  return ''
}

function scrambleCharacters(originalText: string, revealedCount: number): string {
  let result = ''
  for (let i = 0; i < originalText.length; i++) {
    const char = originalText[i]
    if (char === ' ' || char === '\n') {
      result += char
    } else if (i < revealedCount) {
      result += char
    } else {
      const glyphIndex = Math.floor(Math.random() * GLYPHS.length)
      result += GLYPHS[glyphIndex]
    }
  }
  return result
}

export default function HudButton({
  label,
  children,
  href,
  variant = 'primary',
  size = 'md',
  showDot,
  icon,
  iconPosition = 'right',
  onClick,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp,
  disabled = false,
  className = '',
  target,
  rel,
  type = 'button',
  style,
  title,
  'aria-label': ariaLabel,
}: Readonly<HudButtonProps>) {
  const effectiveLabel = label ?? (typeof children === 'string' ? children : '')
  const [displayText, setDisplayText] = useState(effectiveLabel)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    setDisplayText(effectiveLabel)
  }, [effectiveLabel])

  const shouldShowDot = showDot ?? variant === 'primary'

  const triggerScramble = useCallback(() => {
    if (!effectiveLabel) return
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayText(effectiveLabel)
      return
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }

    const originalText = effectiveLabel
    const totalChars = originalText.length
    const duration = Math.min(450, Math.max(250, totalChars * 25))
    const startTime = performance.now()

    const updateFrame = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      const revealedCount = Math.floor(progress * totalChars)

      setDisplayText(scrambleCharacters(originalText, revealedCount))

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(updateFrame)
      } else {
        setDisplayText(originalText)
      }
    }

    animFrameRef.current = requestAnimationFrame(updateFrame)
  }, [effectiveLabel])

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    triggerScramble()
    onMouseEnterProp?.(e)
  }
  const handleFocus = () => triggerScramble()
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }
    setDisplayText(effectiveLabel)
    onMouseLeaveProp?.(e)
  }

  const variantClass = variant === 'secondary' ? 'hud--secondary' : ''
  const sizeClass = getSizeClass(size)
  const combinedClasses = `hud ${variantClass} ${sizeClass} ${className}`.trim()
  const safeRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel

  const innerContent = (
    <>
      <span className="hud__sr">{effectiveLabel}</span>
      <span aria-hidden="true" className="hud__t">
        {shouldShowDot && <span className="hud__dot" />}
        {icon && iconPosition === 'left' && (
          <span className="shrink-0 inline-flex items-center">{icon}</span>
        )}
        <span>{children && typeof children !== 'string' ? children : displayText}</span>
        {icon && iconPosition === 'right' && (
          <span className="shrink-0 inline-flex items-center">{icon}</span>
        )}
      </span>
    </>
  )

  const commonProps = {
    className: combinedClasses,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    style,
    title,
    'aria-label': ariaLabel ?? (effectiveLabel || undefined),
  }

  if (href && !disabled) {
    const isAnchorOrExternal =
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')

    if (isAnchorOrExternal) {
      return (
        <a
          href={href}
          {...commonProps}
          {...(onClick ? { onClick: onClick as React.MouseEventHandler<HTMLAnchorElement> } : {})}
          {...(target ? { target } : {})}
          {...(safeRel ? { rel: safeRel } : {})}
        >
          {innerContent}
        </a>
      )
    }

    return (
      <Link
        href={href}
        {...commonProps}
        {...(onClick ? { onClick: onClick as React.MouseEventHandler<HTMLAnchorElement> } : {})}
        {...(target ? { target } : {})}
        {...(safeRel ? { rel: safeRel } : {})}
      >
        {innerContent}
      </Link>
    )
  }

  return (
    <button
      type={type}
      {...commonProps}
      {...(onClick ? { onClick: onClick as React.MouseEventHandler<HTMLButtonElement> } : {})}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {innerContent}
    </button>
  )
}
