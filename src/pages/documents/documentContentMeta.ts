import type { Document } from '../../store/slices/documentSlice'

export type ContentMetaView = { variant: 'empty' } | { variant: 'json'; raw: string }

export type ContentMetaFormDefaults = {
	content_meta_kind: string
	content_meta_page_count: string
	content_meta_item_count: string
	content_meta_has_readme: boolean
	content_meta_top_level: string
}

export const CONTENT_META_FORM_DEFAULTS: ContentMetaFormDefaults = {
	content_meta_kind: 'none',
	content_meta_page_count: '',
	content_meta_item_count: '',
	content_meta_has_readme: false,
	content_meta_top_level: '',
}

export function parseDocumentContentMetaView(doc: Document): ContentMetaView {
	const meta = doc.content_meta
	if (meta == null || (typeof meta === 'object' && Object.keys(meta as object).length === 0)) {
		return { variant: 'empty' }
	}
	try {
		return { variant: 'json', raw: JSON.stringify(meta, null, 2) }
	} catch {
		return { variant: 'empty' }
	}
}

type ResolveMode = 'create' | 'update'

export function resolveContentMetaForSubmit(
	slice: ContentMetaFormDefaults,
	_mode: ResolveMode,
):
	| { ok: true; value: Record<string, unknown> | null }
	| { ok: false; message: string } {
	const kind = slice.content_meta_kind?.trim() || 'none'
	if (kind === 'none' || kind === '') {
		return { ok: true, value: null }
	}

	const pages = slice.content_meta_page_count.trim()
	const items = slice.content_meta_item_count.trim()
	const top = slice.content_meta_top_level.trim()

	if (kind === 'pdf' || kind === 'slides') {
		const n = Number(pages)
		if (!pages || Number.isNaN(n) || n < 1) {
			return { ok: false, message: 'Vui lòng nhập số trang / slide hợp lệ (≥ 1).' }
		}
	}

	if (kind === 'code') {
		const n = Number(items)
		if (items && (Number.isNaN(n) || n < 0)) {
			return { ok: false, message: 'Số mục (file/thư mục) không hợp lệ.' }
		}
	}

	const value: Record<string, unknown> = {
		kind,
		page_count: pages ? Number(pages) : undefined,
		item_count: items ? Number(items) : undefined,
		has_readme: slice.content_meta_has_readme,
		top_level: top || undefined,
	}
	Object.keys(value).forEach((k) => value[k] === undefined && delete value[k])

	return { ok: true, value }
}
