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
        className="h-9 px-3 flex items-center justify-center gap-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900/80 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-white/15 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-all text-xs font-mono font-bold tracking-wider shadow-sm"
        aria-label="Switch language"
      >
        <Globe size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
        <span className="inline-flex items-center gap-1">
          <span className="text-[11px]">{currentLang.flag}</span>
          <span className="font-mono text-xs">{currentLang.label}</span>
        </span>
      </button>

      <div className="absolute right-0 top-full mt-1.5 bg-white/95 dark:bg-[#090a12]/95 border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[150px] p-1.5 backdrop-blur-2xl">
        <div className="px-2.5 py-1 mb-1 border-b border-slate-100 dark:border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
              className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {isSelected && (
                <Check size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
