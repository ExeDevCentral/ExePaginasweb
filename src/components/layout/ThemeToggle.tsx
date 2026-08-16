import { useTheme } from '../../core/theme/ThemeContext'
import { MorphIcon } from 'morphicons/react'
import { Sun, Moon } from 'lucide'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-primary-secondary hover:text-primary-text hover:bg-muted transition-colors"
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <MorphIcon icon={theme === 'dark' ? Sun : Moon} size={20} strokeWidth={2} spring="snappy" />
    </button>
  )
}
