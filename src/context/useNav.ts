import { useContext } from 'react'
import { NavContext } from './nav-context'

export function useNav() {
  return useContext(NavContext)
}
