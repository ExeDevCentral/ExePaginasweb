import { useTheme } from '../../core/theme/ThemeContext'
import { MorphIcon } from 'morphicons/react'
import { Sun, Moon } from 'lucide'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all cursor-pointer"
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
    >
      <MorphIcon icon={theme === 'dark' ? Sun : Moon} size={16} strokeWidth={2} spring="snappy" />
    </button>
  )
}
