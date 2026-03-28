import { parseDocumentPreviewUrls } from '../lib/documentFileUtils'
import type { CreateDocumentPayload } from './documentPayloadTypes'

function getS(fd: FormData, k: string) {
	return fd.get(k)?.toString() ?? ''
}

export function parseCreateDocumentFormData(fd: FormData): CreateDocumentPayload {
	const previewRaw = getS(fd, 'preview_url')
	let preview_url: string[] | null = null
	if (previewRaw) {
		try {
			const parsed = JSON.parse(previewRaw) as unknown
			preview_url = Array.isArray(parsed) ? (parsed as string[]) : null
		} catch {
			const lines = parseDocumentPreviewUrls(previewRaw)
			preview_url = lines.length ? lines : null
		}
	}

	let technology_ids: string[] | null = null
	const techRaw = getS(fd, 'technology_ids')
	if (techRaw) {
		try {
			technology_ids = JSON.parse(techRaw) as string[]
		} catch {
			technology_ids = null
		}
	}

	const thumbFile = fd.get('thumbnail')
	let thumbnail: File | string | null = null
	if (thumbFile instanceof File) thumbnail = thumbFile
	else {
		const p = getS(fd, 'thumbnail_path')
		thumbnail = p || null
	}

	let content_meta: Record<string, unknown> | null = null
	const cm = getS(fd, 'content_meta')
	if (cm) {
		try {
			content_meta = JSON.parse(cm) as Record<string, unknown>
		} catch {
			content_meta = null
		}
	}

	const sub = getS(fd, 'subject_id')
	const isFree = getS(fd, 'is_free') === '1' || getS(fd, 'is_free') === 'true'

	return {
		title: getS(fd, 'title'),
		slug: getS(fd, 'slug'),
		category_id: Number(getS(fd, 'category_id')) || 0,
		description: getS(fd, 'description') || null,
		status: getS(fd, 'status') as CreateDocumentPayload['status'],
		file_url: getS(fd, 'file_url'),
		preview_url,
		price: parseFloat(getS(fd, 'price')) || 0,
		is_free: isFree,
		subject_id: sub === '' ? null : Number(sub) || sub,
		technology_ids,
		meta_title: getS(fd, 'meta_title') || null,
		meta_description: getS(fd, 'meta_description') || null,
		meta_keywords: getS(fd, 'meta_keywords') || null,
		thumbnail,
		content_meta,
	}
}

export function parseUpdateDocumentFormData(fd: FormData): { id: string; payload: CreateDocumentPayload } {
	return {
		id: fd.get('document_id')?.toString() ?? '',
		payload: parseCreateDocumentFormData(fd),
	}
}
