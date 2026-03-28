import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { NavContext } from './nav-context'

type NavProviderProps = {
  children: ReactNode
}

export function NavProvider({ children }: NavProviderProps) {
  const [navOpen, setNavOpen] = useState(true)
  const [isLg, setIsLg] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => setIsLg(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const value = useMemo(
    () => ({
      navOpen,
      setNavOpen,
      toggleNav: () => setNavOpen((prev) => !prev),
      isLg,
    }),
    [isLg, navOpen],
  )

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}
