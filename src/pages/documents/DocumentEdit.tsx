import { Trash } from '@medusajs/icons'
import { Button, FocusModal, Heading, Input, Label, Select, Switch, Text, Textarea, toast } from '@medusajs/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
	documentApi,
	parseDocumentPreviewUrls,
	updateDocumentFormData,
	type CreateDocumentPayload,
} from '../../api/documentApi'
import { FileUpload, type FileType } from '../../components/FileUpLoad'
import { TechnologyMultiSelect } from '../../components/TechnologyMultiSelect'
import { TooltipComponent } from '../../components/Tooltip'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateDocument } from '../../store/slices/documentSlice'
import { getCategories } from '../../store/slices/categorySlice'
import { getSubjects } from '../../store/slices/subjectSlice'
import { getTechnologies } from '../../store/slices/technologySlice'
import type { Document } from '../../store/slices/documentSlice'
import { createSlug } from '../../util/slug'
import {
	CONTENT_META_FORM_DEFAULTS,
	resolveContentMetaForSubmit,
	type ContentMetaFormDefaults,
} from './documentContentMeta'
import { DocumentContentMetaSection } from './DocumentContentMetaSection'

const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const IMAGE_UPLOAD_HINT = 'Ảnh JPG, PNG, WEBP, GIF. Tối đa 5MB'

interface DocumentFormValues extends ContentMetaFormDefaults {
	title: string
	category_id: string
	description: string
	status: string
	file_url: string
	preview_url: string
	price: string
	is_free: boolean
	subject_id: string
	meta_title: string
	meta_description: string
	meta_keywords: string
}

function parsePreviewUrlsInput(raw: string): string[] | null {
	const trimmed = raw.trim()
	if (!trimmed) return null
	const byLine = trimmed
		.split(/\r?\n/)
		.map((x) => x.trim())
		.filter(Boolean)
	if (byLine.length > 1) return byLine
	const normalized = parseDocumentPreviewUrls(trimmed)
	return normalized.length ? normalized : null
}

function mapDocToContentMetaDefaults(doc: Document): ContentMetaFormDefaults {
	const m = doc.content_meta ?? {}
	const kind = typeof m.kind === 'string' ? m.kind : CONTENT_META_FORM_DEFAULTS.content_meta_kind
	return {
		content_meta_kind: kind || 'none',
		content_meta_page_count:
			m.page_count != null ? String(m.page_count) : CONTENT_META_FORM_DEFAULTS.content_meta_page_count,
		content_meta_item_count:
			m.item_count != null ? String(m.item_count) : CONTENT_META_FORM_DEFAULTS.content_meta_item_count,
		content_meta_has_readme:
			typeof m.has_readme === 'boolean' ? m.has_readme : CONTENT_META_FORM_DEFAULTS.content_meta_has_readme,
		content_meta_top_level:
			typeof m.top_level === 'string' ? m.top_level : CONTENT_META_FORM_DEFAULTS.content_meta_top_level,
	}
}

export default function DocumentEdit() {
	const { id } = useParams<{ id: string }>()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const user = useAppSelector((s) => s.auth.user)
	const isAdmin = (user?.Role?.name ?? '').toLowerCase() === 'admin'

	const handleOpenChange = useCallback(
		(v: boolean) => {
			if (!v) navigate('/document')
		},
		[navigate],
	)

	const { list: categories } = useAppSelector((state) => state.category)
	const { list: subjects } = useAppSelector((state) => state.subject)
	const { list: technologies } = useAppSelector((state) => state.technology)

	const [loading, setLoading] = useState(true)
	const [loadedDoc, setLoadedDoc] = useState<Document | null>(null)
	const [thumbnail, setThumbnail] = useState<FileType | null>(null)
	const [selectedTechnologyIds, setSelectedTechnologyIds] = useState<string[]>([])
	const lastPriceBeforeFreeRef = useRef<string>('0')

	useEffect(() => {
		dispatch(getCategories())
		dispatch(getSubjects())
		dispatch(getTechnologies())
	}, [dispatch])

	const {
		control,
		register,
		handleSubmit,
		reset,
		setValue,
		getValues,
		watch,
		formState: { errors },
		trigger,
	} = useForm<DocumentFormValues>({
		defaultValues: {
			...CONTENT_META_FORM_DEFAULTS,
			title: '',
			category_id: '',
			description: '',
			status: 'draft',
			file_url: '',
			preview_url: '',
			price: '0',
			is_free: true,
			subject_id: '',
			meta_title: '',
			meta_description: '',
			meta_keywords: '',
		},
	})

	useEffect(() => {
		if (!id) return
		let cancelled = false
		setLoading(true)
		documentApi
			.getById(id, isAdmin)
			.then(({ data }) => {
				if (cancelled) return
				const doc = data.data
				setLoadedDoc(doc)
				const cat = categories.find((c) => c.name === doc.Category?.name)
				const sub = subjects.find((s) => s.name === doc.Subject?.name)
				const techIds =
					doc.Technologies?.map(
						(nm) => technologies.find((t) => t.name === nm.name)?.id ?? '',
					).filter(Boolean) ?? []
				setSelectedTechnologyIds(techIds)
				const previewLines = doc.preview_url
					? parseDocumentPreviewUrls(doc.preview_url).join('\n')
					: ''
				reset({
					...mapDocToContentMetaDefaults(doc),
					title: doc.title,
					category_id: cat ? String(cat.id) : '',
					description: doc.description ?? '',
					status: doc.status ?? 'draft',
					file_url: doc.file_url ?? '',
					preview_url: previewLines,
					price: String(doc.price ?? 0),
					is_free: doc.is_free ?? doc.price === 0,
					subject_id: sub ? String(sub.id) : '',
					meta_title: doc.meta_title ?? '',
					meta_description: doc.meta_description ?? '',
					meta_keywords: doc.meta_keywords ?? '',
				})
				setThumbnail(null)
			})
			.catch(() => {
				toast.error('Không tải được tài liệu.')
				navigate('/document')
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})
		return () => {
			cancelled = true
		}
	}, [id, isAdmin, navigate, reset, categories, subjects, technologies])

	const titleWatch = watch('title')
	const slug = createSlug(titleWatch ?? '')
	const isFree = watch('is_free')

	const onSubmit = useCallback(
		async (data: DocumentFormValues) => {
			if (!id) return
			if (!data.category_id) {
				toast.error('Vui lòng chọn danh mục.')
				return
			}
			const fileUrl = data.file_url.trim()
			if (!fileUrl) {
				toast.error('Vui lòng nhập link file (URL đầy đủ trên cloud).')
				return
			}

			const metaOk = await trigger(['content_meta_page_count', 'content_meta_item_count'] as const)
			if (!metaOk) return

			const metaSlice: ContentMetaFormDefaults = {
				content_meta_kind: data.content_meta_kind,
				content_meta_page_count: data.content_meta_page_count,
				content_meta_item_count: data.content_meta_item_count,
				content_meta_has_readme: data.content_meta_has_readme,
				content_meta_top_level: data.content_meta_top_level,
			}
			const resolved = resolveContentMetaForSubmit(metaSlice, 'update')
			if (!resolved.ok) {
				toast.error(resolved.message)
				return
			}

			const payload: CreateDocumentPayload = {
				title: data.title.trim(),
				slug: slug.trim() || data.title.trim().toLowerCase().replace(/\s+/g, '-'),
				category_id: Number(data.category_id),
				file_url: fileUrl,
				description: data.description.trim() || null,
				preview_url: parsePreviewUrlsInput(data.preview_url),
				thumbnail: thumbnail?.file ?? thumbnail?.serverPath ?? loadedDoc?.thumbnail ?? null,
				price: data.is_free ? 0 : parseFloat(data.price) || 0,
				is_free: data.is_free,
				subject_id:
					data.subject_id && data.subject_id !== '__none__'
						? Number(data.subject_id) || data.subject_id
						: null,
				technology_ids: selectedTechnologyIds.length ? selectedTechnologyIds : null,
				status: data.status as CreateDocumentPayload['status'],
				meta_title: data.meta_title.trim() || null,
				meta_description: data.meta_description.trim() || null,
				meta_keywords: data.meta_keywords.trim() || null,
				...(resolved.value ? { content_meta: resolved.value } : {}),
			}
			const fd = updateDocumentFormData(id, payload)
			dispatch(updateDocument(fd))
				.unwrap()
				.then(() => {
					toast.success('Cập nhật tài liệu thành công.')
					navigate('/document')
				})
				.catch((err: unknown) => {
					const msg =
						typeof err === 'string'
							? err
							: err && typeof err === 'object' && 'message' in err
								? String((err as { message?: string }).message)
								: 'Cập nhật thất bại.'
					toast.error(msg)
				})
		},
		[id, slug, thumbnail, selectedTechnologyIds, loadedDoc?.thumbnail, navigate, dispatch, trigger],
	)

	const validateAndSetThumbnail = useCallback((file: FileType) => {
		if (file.serverPath) {
			setThumbnail(file)
			return
		}
		if (file.file && file.file.size <= MAX_IMAGE_SIZE) {
			setThumbnail(file)
		} else {
			toast.error('File vượt quá 5MB')
		}
	}, [])

	if (!id) {
		return <Navigate to="/document" replace />
	}

	if (loading) {
		return (
			<div className="text-ui-fg-muted py-12 text-center text-sm">Đang tải form...</div>
		)
	}

	return (
		<FocusModal open onOpenChange={handleOpenChange}>
			<FocusModal.Content aria-describedby={undefined}>
				<form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
					<FocusModal.Header />
					<FocusModal.Body className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain py-8 md:py-16">
						<div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-4">
							<div>
								<Heading>Sửa tài liệu</Heading>
								<Text size="small" className="text-ui-fg-subtle">
									Cập nhật thông tin tài liệu. Slug tự sinh từ tiêu đề (mock).
								</Text>
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="mt-2">
									<Label htmlFor="ed-title">Tiêu đề *</Label>
									<Input
										id="ed-title"
										className="mt-2"
										{...register('title', { required: 'Tiêu đề là bắt buộc' })}
									/>
									{errors.title && (
										<p className="mt-1 text-left text-xs text-red-600 dark:text-red-400">
											{errors.title.message}
										</p>
									)}
								</div>
								<div className="mt-2">
									<Label htmlFor="ed-slug">Slug</Label>
									<Input id="ed-slug" className="mt-2" value={slug} disabled readOnly />
								</div>
								<div className="mt-2">
									<Label htmlFor="ed-category">Danh mục *</Label>
									<Controller
										name="category_id"
										control={control}
										rules={{ required: 'Danh mục là bắt buộc' }}
										render={({ field }) => (
											<Select value={field.value} onValueChange={field.onChange}>
												<Select.Trigger id="ed-category" className="mt-2">
													<Select.Value placeholder="Chọn danh mục" />
												</Select.Trigger>
												<Select.Content>
													{categories.map((cat) => (
														<Select.Item key={cat.id} value={String(cat.id)}>
															{cat.name}
														</Select.Item>
													))}
												</Select.Content>
											</Select>
										)}
									/>
									{errors.category_id && (
										<p className="mt-1 text-left text-xs text-red-600 dark:text-red-400">
											{errors.category_id.message}
										</p>
									)}
								</div>
								<div className="mt-2">
									<Label htmlFor="ed-status">Trạng thái</Label>
									<Controller
										name="status"
										control={control}
										render={({ field }) => (
											<Select value={field.value} onValueChange={field.onChange}>
												<Select.Trigger id="ed-status" className="mt-2">
													<Select.Value placeholder="Trạng thái" />
												</Select.Trigger>
												<Select.Content>
													<Select.Item value="draft">Nháp</Select.Item>
													<Select.Item value="published">Đã xuất bản</Select.Item>
													<Select.Item value="archived">Lưu trữ</Select.Item>
												</Select.Content>
											</Select>
										)}
									/>
								</div>
								<div className="col-span-2 mt-2">
									<Label htmlFor="ed-desc">Mô tả</Label>
									<Textarea id="ed-desc" className="mt-2" rows={8} {...register('description')} />
								</div>
								<div className="col-span-2 mt-2">
									<div className="flex items-center gap-1.5">
										<Label htmlFor="ed-file">Link file</Label>
										<TooltipComponent content="URL đầy đủ tới file trên cloud." />
									</div>
									<Input
										id="ed-file"
										type="url"
										className="mt-2"
										{...register('file_url', { required: 'Bắt buộc' })}
									/>
									{errors.file_url && (
										<p className="mt-1 text-left text-xs text-red-600 dark:text-red-400">
											{errors.file_url.message}
										</p>
									)}
								</div>
								<div className="col-span-2 mt-2">
									<Label htmlFor="ed-preview">Link preview</Label>
									<Textarea id="ed-preview" className="mt-2" rows={3} {...register('preview_url')} />
								</div>
								<div className="col-span-2 mt-2">
									<Label htmlFor="ed-subject">Môn học</Label>
									<Controller
										name="subject_id"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value || '__none__'}
												onValueChange={(v) => field.onChange(v === '__none__' ? '' : v)}
											>
												<Select.Trigger id="ed-subject" className="mt-2">
													<Select.Value placeholder="Tùy chọn" />
												</Select.Trigger>
												<Select.Content>
													<Select.Item value="__none__">— Không chọn —</Select.Item>
													{subjects.map((s) => (
														<Select.Item key={s.id} value={String(s.id)}>
															{s.name}
														</Select.Item>
													))}
												</Select.Content>
											</Select>
										)}
									/>
								</div>
								<div className="col-span-2 mt-2">
									<Label>Công nghệ</Label>
									<div className="mt-2">
										<TechnologyMultiSelect
											id="doc-edit-tech"
											options={technologies.map((t) => ({ id: t.id, name: t.name }))}
											selectedIds={selectedTechnologyIds}
											onChange={setSelectedTechnologyIds}
											placeholder="Chọn công nghệ..."
										/>
									</div>
								</div>
								<div className="col-span-2 mt-2 flex items-end gap-5">
									<div className="w-full flex-1">
										<Label htmlFor="ed-price">Giá</Label>
										<Input
											id="ed-price"
											type="number"
											min={0}
											step={0.01}
											className="mt-2 w-full"
											disabled={isFree}
											{...register('price')}
										/>
									</div>
									<div className="mt-2 flex items-center gap-2">
										<Controller
											name="is_free"
											control={control}
											render={({ field }) => (
												<Switch
													checked={field.value}
													onCheckedChange={(checked) => {
														field.onChange(checked)
														if (checked) {
															lastPriceBeforeFreeRef.current = getValues('price') || '0'
															setValue('price', '0')
														} else {
															setValue('price', lastPriceBeforeFreeRef.current)
														}
													}}
												/>
											)}
										/>
										<Label>Miễn phí</Label>
									</div>
								</div>
								<div className="col-span-2 mt-2">
									<Label>Thumbnail</Label>
									{thumbnail ? (
										<div className="shadow-elevation-card-rest bg-ui-bg-component transition-fg mt-2 flex items-start justify-between gap-2 rounded-md px-3 py-2">
											<img className="h-20 w-20 rounded object-cover" src={thumbnail.url} alt="" />
											<Button
												size="small"
												className="h-fit text-xs"
												variant="secondary"
												type="button"
												onClick={() => setThumbnail(null)}
											>
												<Trash color="#c72031" />
											</Button>
										</div>
									) : loadedDoc?.thumbnail ? (
										<div className="mt-2 flex flex-col gap-2">
											<img
												src={loadedDoc.thumbnail}
												alt=""
												className="h-24 w-24 rounded object-cover"
											/>
											<FileUpload
												label="Thay ảnh mới"
												className="mt-1"
												hint={IMAGE_UPLOAD_HINT}
												multiple={false}
												formats={SUPPORTED_IMAGE_FORMATS}
												onUploaded={(files) => files[0] && validateAndSetThumbnail(files[0])}
											/>
										</div>
									) : (
										<FileUpload
											label="Kéo thả ảnh"
											className="mt-2"
											hint={IMAGE_UPLOAD_HINT}
											multiple={false}
											formats={SUPPORTED_IMAGE_FORMATS}
											onUploaded={(files) => files[0] && validateAndSetThumbnail(files[0])}
										/>
									)}
								</div>

								<DocumentContentMetaSection<DocumentFormValues>
									idPrefix="doc-edit"
									register={register}
									control={control}
									getValues={getValues}
								/>

								<div className="mt-2">
									<Label htmlFor="ed-mt">Meta title</Label>
									<Input id="ed-mt" className="mt-2" {...register('meta_title')} />
								</div>
								<div className="mt-2">
									<Label htmlFor="ed-mk">Meta keywords</Label>
									<Input id="ed-mk" className="mt-2" {...register('meta_keywords')} />
								</div>
								<div className="col-span-2 mt-2">
									<Label htmlFor="ed-md">Meta description</Label>
									<Textarea id="ed-md" className="mt-2" rows={3} {...register('meta_description')} />
								</div>
							</div>
						</div>
					</FocusModal.Body>
					<FocusModal.Footer className="border-t border-ui-border-base bg-ui-bg-base shrink-0">
						<Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
							Hủy
						</Button>
						<Button type="submit">Lưu</Button>
					</FocusModal.Footer>
				</form>
			</FocusModal.Content>
		</FocusModal>
	)
}
