/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CyberGlobeIcon, CyberCheckMark, CyberCountryFlag } from '@/components/ui/MagnificentIcons'

const LANGUAGES = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pt-BR', label: 'PT', name: 'Português' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'zh-CN', label: '中文', name: '简体中文' },
  { code: 'ar', label: 'AR', name: 'العربية' },
] as const

interface LanguageSwitcherProps {
  className?: string
  direction?: 'down' | 'up'
}

export default function LanguageSwitcher({
  className = '',
  direction = 'down',
}: Readonly<LanguageSwitcherProps>) {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const current = i18n.language || 'es'

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [])

  const change = (code: string) => {
    void i18n.changeLanguage(code)
    setIsOpen(false)
    try {
      localStorage.setItem('lang', code)
    } catch {
      // safe fallback
    }
  }

  const currentLang =
    LANGUAGES.find((l) => l.code === current || current.startsWith(l.code)) ?? LANGUAGES[0]

  const hiddenTransform = direction === 'up' ? 'translate-y-1' : '-translate-y-1'
  const visibilityClass = isOpen
    ? 'opacity-100 visible translate-y-0 pointer-events-auto'
    : `opacity-0 invisible ${hiddenTransform} pointer-events-none`

  return (
    <div ref={containerRef} className={`relative z-50 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all text-xs font-semibold cursor-pointer select-none border border-transparent hover:border-cyan-500/20"
        aria-label="Switch language"
        aria-expanded={isOpen}
      >
        <CyberCountryFlag code={currentLang.code} size={18} />
        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          {currentLang.label}
        </span>
      </button>

      {/* 100% Solid Opaque Dropdown Container (Zero Transparency / Zero Bleed-through) */}
      <div
        className={`absolute right-0 ${
          direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
        } bg-[#FFFDF9] dark:bg-[#060b13] border border-[#DFD7CA] dark:border-emerald-500/40 rounded-xl shadow-2xl dark:shadow-[0_0_25px_rgba(16,185,129,0.18)] transition-all duration-200 z-100 min-w-44 p-1.5 overflow-hidden ${visibilityClass}`}
      >
        {/* Borde verde neón fino y alargado superior */}
        <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none" />

        <div className="px-2.5 py-1 mb-1 border-b border-[#DFD7CA] dark:border-emerald-500/20 text-[10px] font-sans font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <span>Idioma / Language</span>
          <CyberGlobeIcon size={12} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        {LANGUAGES.map((lang) => {
          const isSelected =
            current === lang.code || (lang.code !== 'pt-BR' && current.startsWith(lang.code))
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => change(lang.code)}
              className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-semibold tracking-wide transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/35'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-[#F3ECE1] dark:hover:bg-emerald-950/20 hover:text-slate-950 dark:hover:text-emerald-300 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CyberCountryFlag code={lang.code} size={20} />
                <span>{lang.name}</span>
              </span>
              {isSelected && (
                <CyberCheckMark
                  size={14}
                  className="text-emerald-600 dark:text-emerald-400 shrink-0"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
