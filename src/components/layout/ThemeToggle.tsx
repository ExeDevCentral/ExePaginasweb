/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { useTheme } from '../../core/theme/ThemeContext'
import { useTranslation } from 'react-i18next'
import { MorphIcon } from 'morphicons/react'
import { Sun, Moon } from 'lucide'

export default function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const label = theme === 'dark' ? t('theme.to_light') : t('theme.to_dark')
  const title = theme === 'dark' ? t('theme.light_mode') : t('theme.dark_mode')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all cursor-pointer"
      aria-label={label}
      title={title}
    >
      <MorphIcon icon={theme === 'dark' ? Sun : Moon} size={16} strokeWidth={2} spring="snappy" />
    </button>
  )
}
