export type CreateDocumentPayload = {
	title: string
	slug: string
	category_id: number
	file_url: string
	description: string | null
	preview_url: string[] | null
	thumbnail: File | string | null
	price: number
	is_free: boolean
	subject_id: number | string | null
	technology_ids: string[] | null
	status: 'draft' | 'published' | 'archived'
	meta_title: string | null
	meta_description: string | null
	meta_keywords: string | null
	content_meta?: Record<string, unknown> | null
}
