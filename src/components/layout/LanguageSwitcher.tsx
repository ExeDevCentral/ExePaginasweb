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
        className="h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all text-xs font-semibold cursor-pointer select-none"
        aria-label="Switch language"
      >
        <Globe size={14} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          {currentLang.label}
        </span>
      </button>

      {/* 100% Solid Opaque Dropdown Container (Zero Transparency / Zero Bleed-through) */}
      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#0c0d14] border border-slate-200 dark:border-white/15 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[170px] p-1.5">
        <div className="px-2.5 py-1 mb-1 border-b border-slate-100 dark:border-white/10 text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
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
              className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-semibold tracking-wide transition-all flex items-center justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {isSelected && (
                <Check
                  size={14}
                  className="text-cyan-600 dark:text-cyan-400 shrink-0 stroke-[2.5]"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
