import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { NAVIGATION_MENU } from '../components/navigation/Menu'

export type BreadcrumbSegment = {
	label: string
	path?: string
}

function getPathSegments(pathname: string): BreadcrumbSegment[] {
	const parts = pathname.split('/').filter(Boolean)
	if (parts.length === 0) return []

	return parts.map((part, index) => {
		const path = `/${parts.slice(0, index + 1).join('/')}`
		const menu = NAVIGATION_MENU.find((item) => item.path === path)
		const fallbackLabel = part.charAt(0).toUpperCase() + part.slice(1)

		return {
			label: menu?.label ?? fallbackLabel,
			path: index < parts.length - 1 ? path : undefined,
		}
	})
}

type Ctx = {
	override: BreadcrumbSegment[] | null
	setOverride: (segments: BreadcrumbSegment[] | null) => void
}

const BreadcrumbContext = createContext<Ctx | null>(null)

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
	const [override, setOverride] = useState<BreadcrumbSegment[] | null>(null)

	return (
		<BreadcrumbContext.Provider value={{ override, setOverride }}>{children}</BreadcrumbContext.Provider>
	)
}

/** Breadcrumb: ưu tiên `setSegments` từ trang (detail); không set thì theo URL + menu. */
export function useBreadcrumb() {
	const { pathname } = useLocation()
	const ctx = useContext(BreadcrumbContext)
	const pathSegments = useMemo(() => getPathSegments(pathname), [pathname])

	if (!ctx) {
		return {
			segments: pathSegments,
			setSegments: (_s: BreadcrumbSegment[] | null) => {},
		}
	}

	const segments = ctx.override ?? pathSegments

	return {
		segments,
		setSegments: ctx.setOverride,
	}
}
