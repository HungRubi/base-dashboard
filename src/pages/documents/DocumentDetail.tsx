import { Photo, PencilSquare } from '@medusajs/icons'
import { Container, Heading, StatusBadge, Text, toast } from '@medusajs/ui'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { documentApi } from '../../api/documentApi'
import DropdownMenuDemo from '../../components/DropDown'
import { getDocumentFileUrl, parseDocumentPreviewUrls } from '../../lib/documentFileUtils'
import { useAppSelector } from '../../store/hooks'
import type { Document } from '../../store/slices/documentSlice'
import { useBreadcrumb } from '../../hooks/useBreadcrumb'
import { formatVnd } from '../../util/formatVnd'
import { parseDocumentContentMetaView } from './documentContentMeta'
import { DocumentContentMetaPanel } from './DocumentContentMetaPanel'

type StatusBadgeColor = 'green' | 'red' | 'orange' | 'blue' | 'purple' | 'grey'

function formatDate(value: string | undefined | null): string {
	if (!value) return '—'
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return value
	return d.toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

function getStatusDisplay(status: string): { color: StatusBadgeColor; label: string } {
	const s = status?.toLowerCase() ?? ''
	if (s === 'published') return { color: 'green', label: 'Đã xuất bản' }
	if (s === 'draft') return { color: 'grey', label: 'Nháp' }
	if (s === 'archived') return { color: 'purple', label: 'Lưu trữ' }
	return { color: 'grey', label: status || '—' }
}

function displayValue(value: string | undefined | null): string {
	return value?.trim() || '—'
}

export default function DocumentDetail() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const breadcrumb = useBreadcrumb()
	const user = useAppSelector((state) => state.auth.user)
	const isAdmin = (user?.Role?.name ?? '').toLowerCase() === 'admin'

	const [doc, setDoc] = useState<Document | null>(null)
	const [loading, setLoading] = useState(true)

	const setSegments = breadcrumb.setSegments

	useEffect(() => {
		return () => setSegments(null)
	}, [setSegments])

	useEffect(() => {
		if (!id) return
		let cancelled = false
		documentApi
			.getById(id, isAdmin)
			.then(({ data }) => {
				if (!cancelled) setDoc(data.data)
			})
			.catch((err: unknown) => {
				if (cancelled) return
				const msg =
					(err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
					'Không tải được thông tin tài liệu.'
				toast.error(msg)
				navigate('/document')
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})
		return () => {
			cancelled = true
		}
	}, [id, isAdmin, navigate])

	useEffect(() => {
		if (!doc) return
		setSegments([
			{ label: 'Tài liệu', path: '/document' },
			{ label: displayValue(doc.title) !== '—' ? doc.title : `#${doc.id}` },
		])
	}, [doc, setSegments])

	if (loading) {
		return (
			<Container className="p-0!">
				<div className="p-8 text-center text-ui-fg-muted">Đang tải...</div>
			</Container>
		)
	}

	if (!doc) return null

	const contentMetaView = parseDocumentContentMetaView(doc)
	const statusRaw = doc.status ?? 'published'
	const { color: statusColor, label: statusLabel } = getStatusDisplay(statusRaw)
	const previewUrls = parseDocumentPreviewUrls(doc.preview_url ?? null)
	const rowCls =
		'flex flex-col gap-1 border-b border-ui-border-base p-4 transition-colors duration-150 hover:bg-ui-bg-base-subtle/50 sm:flex-row sm:items-center sm:justify-between sm:p-5'

	const menuItems = [
		{
			label: 'Chỉnh sửa',
			icon: <PencilSquare className="h-4 w-4 shrink-0 text-ui-fg-muted" />,
			onClick: () => navigate(`/document/edit/${doc.id}`),
		},
	]

	return (
		<div className="grid animate-in fade-in grid-cols-1 gap-4 duration-200 lg:grid-cols-4 lg:gap-6">
			<div className="min-w-0 lg:col-span-3">
				<Container className="p-0! transition-shadow duration-200">
					<Heading
						className="flex flex-col gap-3 border-b border-ui-border-base p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
						level="h2"
					>
						<span className="min-w-0 truncate text-sm font-medium text-ui-fg-base">
							{displayValue(doc.title) || `#${doc.id}`}
						</span>
						<div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4">
							<StatusBadge color={statusColor}>{statusLabel}</StatusBadge>
							<DropdownMenuDemo
								data={menuItems}
								align="end"
								isAvatar={false}
								triggerClassName="hover:bg-ui-bg-component data-[state=open]:bg-ui-bg-component"
								contentClassName="min-w-0 w-36!"
							/>
						</div>
					</Heading>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Slug</span>
						<Text className="min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{displayValue(doc.slug)}
						</Text>
					</div>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Danh mục</span>
						<Text className="min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{doc.Category?.name ?? '—'}
						</Text>
					</div>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Môn học</span>
						<Text className="min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{doc.Subject?.name ?? '—'}
						</Text>
					</div>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Công nghệ</span>
						<Text className="min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{doc.Technologies?.length ? doc.Technologies.map((t) => t.name).join(', ') : '—'}
						</Text>
					</div>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Giá</span>
						<Text className="min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{doc.is_free ? 'Miễn phí' : doc.price != null ? formatVnd(doc.price) : '—'}
						</Text>
					</div>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Lượt xem</span>
						<Text className="min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{doc.view_count != null ? String(doc.view_count) : '—'}
						</Text>
					</div>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Lượt tải</span>
						<Text className="min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{doc.download_count != null ? String(doc.download_count) : '—'}
						</Text>
					</div>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">File</span>
						<div className="min-w-0 sm:w-1/2 sm:text-right">
							{doc.file_url ? (
								<a
									href={doc.file_url}
									target="_blank"
									rel="noopener noreferrer"
									className="block truncate text-sm text-ui-fg-interactive hover:underline"
								>
									{doc.file_url}
								</a>
							) : (
								<Text className="text-sm text-ui-fg-base">—</Text>
							)}
						</div>
					</div>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Preview</span>
						<div className="min-w-0 sm:w-1/2 sm:text-right">
							{previewUrls.length ? (
								<div className="flex flex-col gap-1">
									{previewUrls.map((url, idx) => (
										<a
											key={`${url}-${idx}`}
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											className="block truncate text-sm text-ui-fg-interactive hover:underline"
										>
											{url}
										</a>
									))}
								</div>
							) : (
								<Text className="text-sm text-ui-fg-base">—</Text>
							)}
						</div>
					</div>
				</Container>

				<Container className="mt-4 p-0! transition-shadow duration-200 sm:mt-5">
					<Heading className="border-b border-ui-border-base p-4 sm:p-5" level="h2">
						<span className="text-sm font-medium text-ui-fg-base">Mô tả</span>
					</Heading>
					<div className="p-4 sm:p-5">
						<Text className="whitespace-pre-wrap text-sm text-ui-fg-base">
							{displayValue(doc.description)}
						</Text>
					</div>
				</Container>

				<Container className="mt-4 p-0! transition-shadow duration-200 sm:mt-5">
					<Heading className="border-b border-ui-border-base p-4 sm:p-5" level="h2">
						<span className="text-sm font-medium text-ui-fg-base">Meta</span>
					</Heading>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Meta title</span>
						<Text className="min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{displayValue(doc.meta_title)}
						</Text>
					</div>
					<div className={rowCls}>
						<span className="text-sm text-ui-fg-muted">Meta description</span>
						<Text className="line-clamp-2 min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{displayValue(doc.meta_description)}
						</Text>
					</div>
					<div className={`${rowCls} border-b-0`}>
						<span className="text-sm text-ui-fg-muted">Meta keywords</span>
						<Text className="min-w-0 text-left text-sm text-ui-fg-base sm:w-1/2 sm:text-right">
							{displayValue(doc.meta_keywords)}
						</Text>
					</div>
				</Container>
			</div>

			<div className="flex flex-col gap-4 lg:col-span-1">
				<Container className="p-0! transition-shadow duration-200">
					<Heading className="border-b border-ui-border-base p-4 sm:p-5" level="h2">
						<span className="text-sm font-medium text-ui-fg-base">Thông tin</span>
					</Heading>
					<div className="space-y-3 p-4 sm:p-5">
						<div className="flex justify-between gap-2">
							<span className="text-sm text-ui-fg-muted">Ngày tạo</span>
							<Text size="small" className="text-ui-fg-base">
								{formatDate(doc.created_at)}
							</Text>
						</div>
						<div className="flex justify-between gap-2">
							<span className="text-sm text-ui-fg-muted">Cập nhật</span>
							<Text size="small" className="text-ui-fg-base">
								{formatDate(doc.updated_at)}
							</Text>
						</div>
						{doc.User && (
							<div className="flex justify-between gap-2 border-t border-ui-border-base pt-3">
								<span className="text-sm text-ui-fg-muted">Người tạo</span>
								<Text size="small" className="truncate text-ui-fg-base">
									{doc.User.full_name || doc.User.email || doc.User.username || '—'}
								</Text>
							</div>
						)}
					</div>
				</Container>
				<Container className="p-0! transition-shadow duration-200">
					<Heading className="border-b border-ui-border-base p-4 sm:p-5" level="h2">
						<span className="text-sm font-medium text-ui-fg-base">Thumbnail</span>
					</Heading>
					<div className="flex flex-col items-center justify-center gap-2 p-5">
						{getDocumentFileUrl(doc.thumbnail) ? (
							<img
								src={getDocumentFileUrl(doc.thumbnail)!}
								alt={doc.title}
								className="h-32 w-full max-w-[200px] rounded-lg bg-ui-bg-component object-cover"
							/>
						) : (
							<>
								<div className="flex h-32 w-full max-w-[200px] items-center justify-center rounded-lg bg-ui-bg-component">
									<Photo className="h-10 w-10 text-ui-fg-muted" />
								</div>
								<Text size="small" className="text-ui-fg-muted">
									Chưa có thumbnail
								</Text>
							</>
						)}
					</div>
				</Container>
				{contentMetaView.variant !== 'empty' && (
					<Container className="p-0! transition-shadow duration-200">
						<Heading className="border-b border-ui-border-base p-4 sm:p-5" level="h2">
							<span className="text-sm font-medium text-ui-fg-base">Mô tả nội dung (kỹ thuật)</span>
						</Heading>
						<div className="p-4 sm:p-5">
							<DocumentContentMetaPanel view={contentMetaView} />
						</div>
					</Container>
				)}
			</div>
		</div>
	)
}
