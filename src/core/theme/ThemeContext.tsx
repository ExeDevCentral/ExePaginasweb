'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved)
        document.documentElement.classList.toggle('dark', saved === 'dark')
      } else {
        setTheme('dark')
        document.documentElement.classList.add('dark')
      }
    } catch {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const applyTheme = useCallback((t: Theme) => {
    setTheme(t)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', t === 'dark')
      localStorage.setItem('theme', t)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, applyTheme])

  const contextValue = useMemo(
    () => ({ theme, setTheme: applyTheme, toggleTheme }),
    [theme, applyTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
