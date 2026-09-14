/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { Toaster } from 'sonner'
import { useTheme } from '../../core/theme/ThemeContext'

export default function ThemedToaster() {
  const { theme } = useTheme()
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme === 'dark' ? 'dark' : 'light'}
    />
  )
}
