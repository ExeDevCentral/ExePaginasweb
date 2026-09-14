/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
/**
 * Componente de Imagen Optimizada
 *
 * Automáticamente:
 * - Carga WebP/AVIF (según browser)
 * - Blur placeholder
 * - Lazy loading
 * - Responsive sizes
 */

'use client'

import Image, { ImageProps } from 'next/image'
import { CSSProperties } from 'react'

export interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  containerClassName?: string
  blurColor?: string
  aspectRatio?: number // ej: 16/9
}

/**
 * Blur placeholder LQIP base64
 */
const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=='

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 80,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw',
  className = '',
  containerClassName = '',
  blurColor: _blurColor = '#e5e7eb',
  aspectRatio,
  ...props
}: OptimizedImageProps) {
  const containerStyle: CSSProperties = aspectRatio
    ? { aspectRatio: `${aspectRatio}`, width: '100%', height: 'auto' }
    : {}

  return (
    <div className={containerClassName} style={containerStyle}>
      <Image
        src={src}
        alt={alt}
        {...(width !== undefined ? { width } : {})}
        {...(height !== undefined ? { height } : {})}
        priority={priority}
        quality={quality}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        className={className}
        {...props}
      />
    </div>
  )
}

/**
 * Variantes preconfiguradas
 */

export function HeroImage(props: Omit<OptimizedImageProps, 'priority'>) {
  return (
    <OptimizedImage {...props} priority quality={85} sizes="(max-width: 1200px) 100vw, 1200px" />
  )
}

export function CardImage(props: Omit<OptimizedImageProps, 'priority'>) {
  return (
    <OptimizedImage
      {...props}
      quality={75}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  )
}

export function ThumbnailImage(props: Omit<OptimizedImageProps, 'priority'>) {
  return <OptimizedImage {...props} quality={70} sizes="(max-width: 640px) 50vw, 25vw" />
}
