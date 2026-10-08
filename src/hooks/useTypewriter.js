/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { useState, useEffect, useCallback } from 'react'

/**
 * Hook personalizado para efecto de máquina de escribir
 * @param text - El texto completo a mostrar
 * @param options - Opciones de configuración
 * @returns Objeto con el texto tipeado, estado de completitud y función de reinicio
 *
 * @example
 * ```tsx
 * const { typedText, isComplete, restart } = useTypewriter(
 *   'Hola mundo',
 *   { typingSpeed: 50, loop: true }
 * )
 * ```
 */
export function useTypewriter(text, options = {}) {
  const { typingSpeed = 35, endDelay = 1000, loop = false } = options

  const [typedText, setTypedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [key, setKey] = useState(0) // Para forzar reinicio

  const restart = useCallback(() => {
    setKey((prev) => prev + 1)
    setIsComplete(false)
  }, [])

  useEffect(() => {
    let index = 0
    let interval
    let timeout

    const animate = () => {
      interval = setInterval(() => {
        if (index <= text.length) {
          setTypedText(text.slice(0, index))
          index++
        } else {
          clearInterval(interval)
          setIsComplete(true)

          if (loop) {
            timeout = setTimeout(() => {
              index = 0
              setTypedText('')
              setIsComplete(false)
              animate()
            }, endDelay)
          }
        }
      }, typingSpeed)
    }

    animate()

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [text, typingSpeed, endDelay, loop, key])

  return { typedText, isComplete, restart }
}
