export const THEME_KEY = 'dashboard-theme'

/** Lưu localStorage: hệ thống / sáng / tối */
export type ThemeValue = 'system' | 'sáng' | 'tối'

export function getInitialTheme(): ThemeValue {
  if (typeof window === 'undefined') return 'sáng'
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'system' || stored === 'sáng' || stored === 'tối') return stored
  if (stored === 'light' || stored === 'sang') return 'sáng'
  if (stored === 'dark' || stored === 'toi') return 'tối'
  return 'sáng'
}

export function applyTheme(value: ThemeValue) {
  const root = document.documentElement
  if (value === 'tối') {
    root.classList.add('dark')
  } else if (value === 'sáng') {
    root.classList.remove('dark')
  } else {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', dark)
  }
}
