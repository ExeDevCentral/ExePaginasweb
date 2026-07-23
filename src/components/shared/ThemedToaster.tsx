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
