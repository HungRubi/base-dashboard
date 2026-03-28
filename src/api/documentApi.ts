import type { Store } from '@reduxjs/toolkit'
import { parseDocumentPreviewUrls } from '../lib/documentFileUtils'
import {
	buildFullDocumentsSource,
	enrichMockDocumentDetail,
	type Document,
	type DocumentState,
} from '../store/slices/documentSlice'
import type { CreateDocumentPayload } from './documentPayloadTypes'

export type { Document }
export type { CreateDocumentPayload }

/** Giữ tên hàm theo code StudyHub — logic preview dùng chung lib. */
export { parseDocumentPreviewUrls }

let storeRef: Store | null = null

export function injectDocumentApiStore(store: Store) {
	storeRef = store
}

function getDocumentState(): DocumentState {
	if (!storeRef) {
		throw new Error('injectDocumentApiStore chưa được gọi (store/index.ts).')
	}
	return (storeRef.getState() as { document: DocumentState }).document
}

export const documentApi = {
	getById(id: string, _isAdmin: boolean) {
		try {
			const st = getDocumentState()
			const base = buildFullDocumentsSource(st).find((d) => d.id === id)
			if (!base) {
				return Promise.reject({
					response: { data: { message: 'Không tìm thấy tài liệu.' } },
				})
			}
			const detail =
				base.file_url && base.status && base.Category?.name ? base : enrichMockDocumentDetail(base)
			return Promise.resolve({ data: { data: detail } })
		} catch {
			return Promise.reject({
				response: { data: { message: 'Không tải được thông tin tài liệu.' } },
			})
		}
	},
}

export function createDocumentFormData(p: CreateDocumentPayload): FormData {
	const fd = new FormData()
	fd.append('title', p.title)
	fd.append('slug', p.slug)
	fd.append('category_id', String(p.category_id))
	fd.append('description', p.description ?? '')
	fd.append('status', p.status)
	fd.append('file_url', p.file_url)
	fd.append('preview_url', p.preview_url == null ? '' : JSON.stringify(p.preview_url))
	fd.append('price', String(p.price))
	fd.append('is_free', p.is_free ? '1' : '0')
	fd.append(
		'subject_id',
		p.subject_id == null || p.subject_id === '' ? '' : String(p.subject_id),
	)
	fd.append('technology_ids', p.technology_ids?.length ? JSON.stringify(p.technology_ids) : '')
	fd.append('meta_title', p.meta_title ?? '')
	fd.append('meta_description', p.meta_description ?? '')
	fd.append('meta_keywords', p.meta_keywords ?? '')
	if (p.content_meta != null) fd.append('content_meta', JSON.stringify(p.content_meta))
	if (p.thumbnail instanceof File) fd.append('thumbnail', p.thumbnail)
	else if (typeof p.thumbnail === 'string' && p.thumbnail) fd.append('thumbnail_path', p.thumbnail)
	return fd
}

export function updateDocumentFormData(id: string, p: CreateDocumentPayload): FormData {
	const fd = createDocumentFormData(p)
	fd.append('document_id', id)
	return fd
}
