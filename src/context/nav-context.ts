import { createContext } from 'react'

export type NavContextValue = {
  navOpen: boolean
  setNavOpen: (value: boolean) => void
  toggleNav: () => void
  isLg: boolean
}

export const NavContext = createContext<NavContextValue | null>(null)
