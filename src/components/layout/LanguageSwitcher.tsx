'use client'

import { useTranslation } from 'react-i18next'
import { Globe, Check } from 'lucide-react'

const LANGUAGES = [
  { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Español' },
  { code: 'en', label: 'EN', flag: '🇺🇸', name: 'English' },
  { code: 'pt-BR', label: 'PT', flag: '🇧🇷', name: 'Português' },
  { code: 'fr', label: 'FR', flag: '🇫🇷', name: 'Français' },
  { code: 'de', label: 'DE', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳', name: '简体中文' },
  { code: 'ar', label: 'AR', flag: '🇸🇦', name: 'العربية' },
] as const

interface LanguageSwitcherProps {
  className?: string
}

export default function LanguageSwitcher({ className = '' }: Readonly<LanguageSwitcherProps>) {
  const { i18n } = useTranslation()
  const current = i18n.language || 'es'

  const change = (code: string) => {
    i18n.changeLanguage(code)
    try {
      localStorage.setItem('lang', code)
    } catch {
      // safe fallback
    }
  }

  const currentLang =
    LANGUAGES.find((l) => l.code === current || current.startsWith(l.code)) ?? LANGUAGES[0]

  return (
    <div className={`relative group ${className}`}>
      <button
        type="button"
        className="h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all text-xs font-semibold cursor-pointer select-none"
        aria-label="Switch language"
      >
        <Globe size={14} className="text-accent-cyan shrink-0" />
        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-foreground">
          {currentLang.label}
        </span>
      </button>

      <div className="absolute right-0 top-full mt-2 bg-card/95 border border-border rounded-xl shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[155px] p-1.5 backdrop-blur-2xl">
        <div className="px-2.5 py-1 mb-1 border-b border-border text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">
          Idioma / Language
        </div>
        {LANGUAGES.map((lang) => {
          const isSelected =
            current === lang.code || (lang.code !== 'pt-BR' && current.startsWith(lang.code))
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => change(lang.code)}
              className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium tracking-wide transition-all flex items-center justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-accent-cyan/15 text-accent-cyan font-semibold border border-accent-cyan/30'
                  : 'text-foreground hover:bg-muted/80 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {isSelected && <Check size={13} className="text-accent-cyan shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
