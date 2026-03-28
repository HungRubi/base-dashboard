import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { CreateDocumentPayload } from '../../api/documentPayloadTypes'
import { parseCreateDocumentFormData, parseUpdateDocumentFormData } from '../../api/documentFormParse'

export type Document = {
	id: string
	title: string
	description: string
	slug: string
	price: number
	view_count: number
	created_at: string
	updated_at: string
	/** Các field sau dùng cho trang chi tiết / API sau này */
	status?: string
	is_free?: boolean
	download_count?: number
	file_url?: string | null
	preview_url?: string | null
	meta_title?: string | null
	meta_description?: string | null
	meta_keywords?: string | null
	thumbnail?: string | null
	content_meta?: Record<string, unknown> | null
	Category?: { name?: string }
	Subject?: { name?: string }
	Technologies?: { name: string }[]
	User?: { full_name?: string; email?: string; username?: string }
}

export type GetDocumentsParams = {
	include_all?: number
	sortBy: 'created_at' | 'updated_at' | 'title' | 'price' | 'view_count'
	sort: 'asc' | 'desc'
	q?: string
}

export type DocumentState = {
	list: Document[]
	listLoading: boolean
	listError: string | null
	deletedMockIds: string[]
	localDocuments: Document[]
	mockEdits: Record<string, Document>
}

const MOCK_DOCUMENTS: Document[] = [
	{
		id: 'doc_1',
		title: 'Hướng dẫn onboarding đối tác',
		description: 'Quy trình kích hoạt tài khoản và cấu hình ban đầu.',
		slug: 'huong-dan-onboarding-doi-tac',
		price: 0,
		view_count: 1280,
		created_at: '2025-11-02T10:00:00.000Z',
		updated_at: '2026-01-15T08:30:00.000Z',
	},
	{
		id: 'doc_2',
		title: 'Chính sách học phí 2026',
		description: 'Bảng giá và điều kiện áp dụng.',
		slug: 'chinh-sach-hoc-phi-2026',
		price: 150000,
		view_count: 542,
		created_at: '2025-12-01T09:00:00.000Z',
		updated_at: '2025-12-20T14:00:00.000Z',
	},
	{
		id: 'doc_3',
		title: 'Template báo cáo tuần',
		description: 'Mẫu CSV/Excel cho báo cáo hoạt động.',
		slug: 'template-bao-cao-tuan',
		price: 0,
		view_count: 89,
		created_at: '2026-01-05T11:20:00.000Z',
		updated_at: '2026-01-05T11:20:00.000Z',
	},
	{
		id: 'doc_4',
		title: 'FAQ — Thanh toán & hoàn tiền',
		description: 'Câu hỏi thường gặp về billing.',
		slug: 'faq-thanh-toan-hoan-tien',
		price: 0,
		view_count: 2103,
		created_at: '2025-08-10T07:00:00.000Z',
		updated_at: '2026-02-01T16:45:00.000Z',
	},
	{
		id: 'doc_5',
		title: 'Khóa học STEM — brochure',
		description: 'Tài liệu marketing PDF.',
		slug: 'khoa-hoc-stem-brochure',
		price: 99000,
		view_count: 412,
		created_at: '2026-02-10T13:00:00.000Z',
		updated_at: '2026-02-10T13:00:00.000Z',
	},
	{
		id: 'doc_6',
		title: 'API StudyHub — bản nháp',
		description: 'Endpoint public cho đối tác tích hợp.',
		slug: 'api-studyhub-ban-nhap',
		price: 0,
		view_count: 76,
		created_at: '2026-01-22T09:15:00.000Z',
		updated_at: '2026-03-01T10:00:00.000Z',
	},
	{
		id: 'doc_7',
		title: 'Checklist kiểm duyệt nội dung',
		description: 'Quy tắc đăng bài và media.',
		slug: 'checklist-kiem-duyet-noi-dung',
		price: 0,
		view_count: 334,
		created_at: '2025-10-18T12:00:00.000Z',
		updated_at: '2025-12-05T09:00:00.000Z',
	},
	{
		id: 'doc_8',
		title: 'Hợp đồng mẫu (NDA)',
		description: 'File tham khảo pháp lý.',
		slug: 'hop-dong-mau-nda',
		price: 0,
		view_count: 56,
		created_at: '2025-09-01T08:00:00.000Z',
		updated_at: '2025-09-01T08:00:00.000Z',
	},
	{
		id: 'doc_9',
		title: 'Lịch sự kiện Q1',
		description: 'Webinar và offline events.',
		slug: 'lich-su-kien-q1',
		price: 0,
		view_count: 1205,
		created_at: '2025-12-28T00:00:00.000Z',
		updated_at: '2026-01-10T12:00:00.000Z',
	},
	{
		id: 'doc_10',
		title: 'Brand guideline StudyHub',
		description: 'Logo, màu, typography.',
		slug: 'brand-guideline-studyhub',
		price: 0,
		view_count: 445,
		created_at: '2025-07-01T10:00:00.000Z',
		updated_at: '2026-02-20T15:30:00.000Z',
	},
	{
		id: 'doc_11',
		title: 'Release notes dashboard',
		description: 'Thay đổi theo phiên bản.',
		slug: 'release-notes-dashboard',
		price: 0,
		view_count: 198,
		created_at: '2026-03-01T08:00:00.000Z',
		updated_at: '2026-03-10T09:00:00.000Z',
	},
	{
		id: 'doc_12',
		title: 'Video hướng dẫn đăng khóa học',
		description: 'Link embed và transcript.',
		slug: 'video-huong-dan-dang-khoa-hoc',
		price: 0,
		view_count: 672,
		created_at: '2026-02-14T14:00:00.000Z',
		updated_at: '2026-02-14T14:00:00.000Z',
	},
	{
		id: 'doc_13',
		title: 'Bảng KPI đối tác',
		description: 'Định nghĩa chỉ số theo tháng.',
		slug: 'bang-kpi-doi-tac',
		price: 0,
		view_count: 301,
		created_at: '2025-11-20T11:00:00.000Z',
		updated_at: '2026-01-30T10:00:00.000Z',
	},
	{
		id: 'doc_14',
		title: 'Mẫu email thông báo học viên',
		description: 'HTML snippets.',
		slug: 'mau-email-thong-bao-hoc-vien',
		price: 0,
		view_count: 88,
		created_at: '2026-01-08T16:00:00.000Z',
		updated_at: '2026-01-08T16:00:00.000Z',
	},
	{
		id: 'doc_15',
		title: 'Quy trình xử lý khiếu nại',
		description: 'SLA và escalation.',
		slug: 'quy-trinh-xu-ly-khieu-nai',
		price: 0,
		view_count: 921,
		created_at: '2025-06-15T09:00:00.000Z',
		updated_at: '2025-11-01T12:00:00.000Z',
	},
	{
		id: 'doc_16',
		title: 'Tích hợp SSO (mock)',
		description: 'SAML/OIDC roadmap.',
		slug: 'tich-hop-sso-mock',
		price: 0,
		view_count: 44,
		created_at: '2026-02-28T10:00:00.000Z',
		updated_at: '2026-02-28T10:00:00.000Z',
	},
]

export function enrichMockDocumentDetail(base: Document): Document {
	if (base.status && base.file_url && base.Category?.name) {
		return base
	}

	const isDraft = base.id === 'doc_6'
	const isArchived = base.id === 'doc_8'
	let status = 'published'
	if (isDraft) status = 'draft'
	if (isArchived) status = 'archived'

	return {
		...base,
		status,
		is_free: base.price === 0,
		download_count: Math.max(0, Math.floor(base.view_count / 8)),
		file_url: `https://example.com/files/${base.slug}.pdf`,
		preview_url:
			base.id === 'doc_2'
				? 'https://example.com/preview/a.png,\nhttps://example.com/preview/b.png'
				: null,
		meta_title: `${base.title} | StudyHub`,
		meta_description: base.description.slice(0, 160),
		meta_keywords: 'studyhub, đối tác, tài liệu',
		thumbnail:
			base.id === 'doc_5' || base.id === 'doc_1'
				? `https://picsum.photos/seed/${encodeURIComponent(base.id)}/200/200`
				: null,
		content_meta:
			base.id === 'doc_1'
				? { pages: 12, format: 'PDF', language: 'vi' }
				: base.id === 'doc_6'
					? { note: 'Bản nháp chưa xuất bản' }
					: null,
		Category: { name: 'Tài nguyên đối tác' },
		Subject: { name: 'Vận hành' },
		Technologies: [{ name: 'TypeScript' }, { name: 'React' }],
		User: { full_name: 'Admin StudyHub', email: 'admin@studyhub.vn', username: 'admin' },
	}
}

export function buildFullDocumentsSource(s: DocumentState): Document[] {
	const fromMock = MOCK_DOCUMENTS.filter((d) => !s.deletedMockIds.includes(d.id)).map(
		(d) => s.mockEdits[d.id] ?? d,
	)
	return [...fromMock, ...s.localDocuments]
}

type RootSliceGetState = {
	document: DocumentState
	category: { list: { id: number; name: string }[] }
	subject: { list: { id: number; name: string }[] }
	technology: { list: { id: string; name: string }[] }
}

function buildDocumentFromPayload(
	p: CreateDocumentPayload,
	id: string,
	ctx: { categoryName: string; subjectName?: string | null; technologies: { name: string }[] },
	preserve?: Pick<Document, 'id' | 'created_at' | 'view_count' | 'download_count'>,
): Document {
	const now = new Date().toISOString()
	let thumb: string | null = null
	if (p.thumbnail instanceof File) thumb = URL.createObjectURL(p.thumbnail)
	else if (typeof p.thumbnail === 'string' && p.thumbnail) thumb = p.thumbnail

	const previewStr = p.preview_url?.length ? p.preview_url.join('\n') : null

	return {
		id: preserve?.id ?? id,
		title: p.title,
		slug: p.slug,
		description: p.description ?? '',
		price: p.price,
		view_count: preserve?.view_count ?? 0,
		download_count: preserve?.download_count ?? 0,
		created_at: preserve?.created_at ?? now,
		updated_at: now,
		status: p.status,
		is_free: p.is_free,
		file_url: p.file_url,
		preview_url: previewStr,
		meta_title: p.meta_title,
		meta_description: p.meta_description,
		meta_keywords: p.meta_keywords,
		thumbnail: thumb,
		content_meta: p.content_meta ?? null,
		Category: { name: ctx.categoryName },
		Subject: ctx.subjectName ? { name: ctx.subjectName } : undefined,
		Technologies: ctx.technologies.length ? ctx.technologies : undefined,
		User: { full_name: 'Admin StudyHub', email: 'admin@studyhub.vn' },
	}
}

function filterAndSort(source: Document[], params: GetDocumentsParams): Document[] {
	let items = [...source]
	const q = params.q?.trim().toLowerCase()
	if (q) {
		items = items.filter(
			(d) =>
				d.title.toLowerCase().includes(q) ||
				d.description.toLowerCase().includes(q) ||
				d.slug.toLowerCase().includes(q),
		)
	}
	const dir = params.sort === 'asc' ? 1 : -1
	const key = params.sortBy
	items.sort((a, b) => {
		let cmp = 0
		switch (key) {
			case 'title':
				cmp = a.title.localeCompare(b.title, 'vi')
				break
			case 'price':
				cmp = a.price - b.price
				break
			case 'view_count':
				cmp = a.view_count - b.view_count
				break
			case 'updated_at':
				cmp = Date.parse(a.updated_at) - Date.parse(b.updated_at)
				break
			case 'created_at':
			default:
				cmp = Date.parse(a.created_at) - Date.parse(b.created_at)
				break
		}
		return cmp * dir
	})
	return items
}

const initialState: DocumentState = {
	list: [],
	listLoading: false,
	listError: null,
	deletedMockIds: [],
	localDocuments: [],
	mockEdits: {},
}

export const getDocuments = createAsyncThunk<Document[], GetDocumentsParams>(
	'document/getDocuments',
	async (params, { getState }) => {
		await new Promise((r) => setTimeout(r, 380))
		const s = (getState() as RootSliceGetState).document
		return filterAndSort(buildFullDocumentsSource(s), params)
	},
)

export const deleteDocument = createAsyncThunk<{ id: string; message: string }, string>(
	'document/deleteDocument',
	async (id) => {
		await new Promise((r) => setTimeout(r, 280))
		return { id, message: 'Đã xóa tài liệu (mock UI).' }
	},
)

export const createDocument = createAsyncThunk<Document, FormData>(
	'document/createDocument',
	async (formData, { getState, rejectWithValue }) => {
		await new Promise((r) => setTimeout(r, 400))
		const p = parseCreateDocumentFormData(formData)
		if (!p.category_id) return rejectWithValue('Danh mục không hợp lệ.')
		const root = getState() as RootSliceGetState
		const cat = root.category.list.find((c) => c.id === p.category_id)
		if (!cat) return rejectWithValue('Không tìm thấy danh mục.')
		const sub =
			p.subject_id != null && p.subject_id !== ''
				? root.subject.list.find((x) => String(x.id) === String(p.subject_id))
				: null
		const techs = (p.technology_ids ?? [])
			.map((tid) => root.technology.list.find((t) => t.id === tid))
			.filter(Boolean)
			.map((t) => ({ name: t!.name }))

		const id = `doc_${Date.now()}`
		return buildDocumentFromPayload(p, id, {
			categoryName: cat.name,
			subjectName: sub?.name ?? null,
			technologies: techs,
		})
	},
)

export const updateDocument = createAsyncThunk<Document, FormData>(
	'document/updateDocument',
	async (formData, { getState, rejectWithValue }) => {
		await new Promise((r) => setTimeout(r, 400))
		const { id, payload: p } = parseUpdateDocumentFormData(formData)
		if (!id) return rejectWithValue('Thiếu id tài liệu.')
		const root = getState() as RootSliceGetState
		const existing = buildFullDocumentsSource(root.document).find((d) => d.id === id)
		if (!existing) return rejectWithValue('Không tìm thấy tài liệu.')

		let pFinal = { ...p }
		if (!pFinal.thumbnail && existing.thumbnail) {
			pFinal = { ...pFinal, thumbnail: existing.thumbnail }
		}

		const cat = root.category.list.find((c) => c.id === p.category_id)
		if (!cat) return rejectWithValue('Không tìm thấy danh mục.')
		const sub =
			p.subject_id != null && p.subject_id !== ''
				? root.subject.list.find((x) => String(x.id) === String(p.subject_id))
				: null
		const techs = (p.technology_ids ?? [])
			.map((tid) => root.technology.list.find((t) => t.id === tid))
			.filter(Boolean)
			.map((t) => ({ name: t!.name }))

		return buildDocumentFromPayload(
			pFinal,
			id,
			{ categoryName: cat.name, subjectName: sub?.name ?? null, technologies: techs },
			{
				id,
				created_at: existing.created_at,
				view_count: existing.view_count,
				download_count: existing.download_count ?? 0,
			},
		)
	},
)

const documentSlice = createSlice({
	name: 'document',
	initialState,
	reducers: {
		clearDocumentListError: (state) => {
			state.listError = null
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getDocuments.pending, (state) => {
				state.listLoading = true
				state.listError = null
			})
			.addCase(getDocuments.fulfilled, (state, action) => {
				state.listLoading = false
				state.list = action.payload
			})
			.addCase(getDocuments.rejected, (state, action) => {
				state.listLoading = false
				state.listError = action.error.message ?? 'Không tải được danh sách tài liệu.'
			})
			.addCase(deleteDocument.fulfilled, (state, action) => {
				const id = action.payload.id
				state.localDocuments = state.localDocuments.filter((d) => d.id !== id)
				if (MOCK_DOCUMENTS.some((d) => d.id === id)) {
					if (!state.deletedMockIds.includes(id)) state.deletedMockIds.push(id)
				}
				delete state.mockEdits[id]
				state.list = state.list.filter((d) => d.id !== id)
			})
			.addCase(deleteDocument.rejected, (state, action) => {
				state.listError = action.error.message ?? 'Xóa tài liệu thất bại.'
			})
			.addCase(createDocument.fulfilled, (state, action) => {
				state.localDocuments.push(action.payload)
			})
			.addCase(updateDocument.fulfilled, (state, action) => {
				const doc = action.payload
				const li = state.localDocuments.findIndex((d) => d.id === doc.id)
				if (li >= 0) state.localDocuments[li] = doc
				else if (MOCK_DOCUMENTS.some((d) => d.id === doc.id)) state.mockEdits[doc.id] = doc
				else state.mockEdits[doc.id] = doc
			})
	},
})

export const { clearDocumentListError } = documentSlice.actions
export default documentSlice.reducer
