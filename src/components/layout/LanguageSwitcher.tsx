import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'pt-BR', label: 'PT-BR' },
  { code: 'ar', label: 'AR' },
  { code: 'zh-CN', label: '中文' },
] as const

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language

  const change = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
  }

  return (
    <div className="relative group">
      <button
        className="min-w-[44px] min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-primary-secondary hover:text-primary-text hover:bg-muted transition-colors text-xs font-bold tracking-wider"
        aria-label="Switch language"
      >
        <Globe size={14} />
        <span className="hidden sm:inline">
          {LANGUAGES.find((l) => l.code === current)?.label ?? 'ES'}
        </span>
      </button>
      <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[120px] py-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => change(lang.code)}
            className={`w-full px-4 py-2 text-left text-xs font-bold tracking-wider transition-colors hover:bg-muted ${
              current === lang.code
                ? 'text-primary-text'
                : 'text-primary-secondary'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
