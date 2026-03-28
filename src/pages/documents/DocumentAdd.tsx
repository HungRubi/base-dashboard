import { Trash } from '@medusajs/icons'
import { Button, FocusModal, Heading, Input, Label, Select, Switch, Text, Textarea, toast } from '@medusajs/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	createDocumentFormData,
	parseDocumentPreviewUrls,
	type CreateDocumentPayload,
} from '../../api/documentApi'
import { FileUpload, type FileType } from '../../components/FileUpLoad'
import { TechnologyMultiSelect } from '../../components/TechnologyMultiSelect'
import { TooltipComponent } from '../../components/Tooltip'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createDocument } from '../../store/slices/documentSlice'
import { getCategories } from '../../store/slices/categorySlice'
import { getSubjects } from '../../store/slices/subjectSlice'
import { getTechnologies } from '../../store/slices/technologySlice'
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

export default function DocumentAdd() {
	const dispatch = useAppDispatch()
	const location = useLocation()
	const navigate = useNavigate()
	const isAddPage = location.pathname === '/document/add'
	const [open, setOpen] = useState(false)
	const modalOpen = isAddPage ? true : open
	const handleOpenChange = useCallback(
		(v: boolean) => {
			if (isAddPage && !v) navigate('/document')
			else setOpen(v)
		},
		[isAddPage, navigate],
	)

	const { list: categories } = useAppSelector((state) => state.category)
	const { list: subjects } = useAppSelector((state) => state.subject)
	const { list: technologies } = useAppSelector((state) => state.technology)
	const [thumbnail, setThumbnail] = useState<FileType | null>(null)
	const [selectedTechnologyIds, setSelectedTechnologyIds] = useState<string[]>([])
	const lastPriceBeforeFreeRef = useRef<string>('0')

	useEffect(() => {
		if (modalOpen) {
			dispatch(getCategories())
			dispatch(getSubjects())
			dispatch(getTechnologies())
		}
	}, [modalOpen, dispatch])

	const {
		control,
		register,
		handleSubmit,
		reset,
		setValue,
		getValues,
		watch,
		formState: { errors },
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

	const titleWatch = watch('title')
	const slug = createSlug(titleWatch ?? '')
	const isFree = watch('is_free')

	const onSubmit = useCallback(
		async (data: DocumentFormValues) => {
			if (!data.category_id) {
				toast.error('Vui lòng chọn danh mục.')
				return
			}
			const fileUrl = data.file_url.trim()
			if (!fileUrl) {
				toast.error('Vui lòng nhập link file (URL đầy đủ trên cloud).')
				return
			}

			const metaSlice: ContentMetaFormDefaults = {
				content_meta_kind: data.content_meta_kind,
				content_meta_page_count: data.content_meta_page_count,
				content_meta_item_count: data.content_meta_item_count,
				content_meta_has_readme: data.content_meta_has_readme,
				content_meta_top_level: data.content_meta_top_level,
			}
			const resolved = resolveContentMetaForSubmit(metaSlice, 'create')
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
				thumbnail: thumbnail?.file ?? thumbnail?.serverPath ?? null,
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
			const form = createDocumentFormData(payload)
			dispatch(createDocument(form))
				.unwrap()
				.then(() => {
					toast.success('Thêm tài liệu thành công.')
					reset()
					setThumbnail(null)
					setSelectedTechnologyIds([])
					setOpen(false)
					if (isAddPage) navigate('/document')
				})
				.catch((err: unknown) => {
					const msg =
						err && typeof err === 'object' && 'message' in err
							? String((err as { message?: string }).message)
							: typeof err === 'string'
								? err
								: 'Thêm tài liệu thất bại.'
					toast.error(msg)
				})
		},
		[dispatch, slug, thumbnail, selectedTechnologyIds, reset, isAddPage, navigate],
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

	return (
		<FocusModal open={modalOpen} onOpenChange={handleOpenChange}>
			{!isAddPage && (
				<FocusModal.Trigger asChild>
					<Button variant="secondary" size="small" type="button">
						Thêm tài liệu
					</Button>
				</FocusModal.Trigger>
			)}
			<FocusModal.Content aria-describedby={undefined}>
				<form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
					<FocusModal.Header />
					<FocusModal.Body className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain py-8 md:py-16">
						<div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-4">
							<div>
								<Heading>Thêm tài liệu</Heading>
								<Text size="small" className="text-ui-fg-subtle">
									Tiêu đề, slug, danh mục và link file (URL cloud) bắt buộc. File lưu trên cloud,
									không upload lên server (mock UI).
								</Text>
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="mt-2">
									<Label htmlFor="doc-title">Tiêu đề *</Label>
									<Input
										id="doc-title"
										placeholder="Nhập tiêu đề"
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
									<Label htmlFor="doc-slug">Slug</Label>
									<Input
										id="doc-slug"
										className="mt-2"
										value={slug}
										disabled
										readOnly
										placeholder="Tự động từ tiêu đề"
									/>
								</div>
								<div className="mt-2">
									<Label htmlFor="doc-category">Danh mục *</Label>
									<Controller
										name="category_id"
										control={control}
										rules={{ required: 'Danh mục là bắt buộc' }}
										render={({ field }) => (
											<Select value={field.value} onValueChange={field.onChange}>
												<Select.Trigger id="doc-category" className="mt-2">
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
									<Label htmlFor="doc-status">Trạng thái</Label>
									<Controller
										name="status"
										control={control}
										render={({ field }) => (
											<Select value={field.value} onValueChange={field.onChange}>
												<Select.Trigger id="doc-status" className="mt-2">
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
									<Label htmlFor="doc-desc">Mô tả</Label>
									<Textarea
										id="doc-desc"
										placeholder="Mô tả tài liệu"
										className="mt-2"
										rows={8}
										{...register('description')}
									/>
								</div>
								<div className="col-span-2 mt-2">
									<div className="flex items-center gap-1.5">
										<Label htmlFor="doc-file-url">Link file</Label>
										<TooltipComponent content="URL đầy đủ tới file trên cloud (S3, Drive, CDN...). Server không lưu file (mock)." />
									</div>
									<Input
										id="doc-file-url"
										type="url"
										className="mt-2"
										placeholder="https://storage.../file.pdf"
										{...register('file_url', { required: 'Link file là bắt buộc' })}
									/>
									{errors.file_url && (
										<p className="mt-1 text-left text-xs text-red-600 dark:text-red-400">
											{errors.file_url.message}
										</p>
									)}
								</div>
								<div className="col-span-2 mt-2">
									<div className="flex items-center gap-1.5">
										<Label htmlFor="doc-preview-url">Link preview (tùy chọn)</Label>
										<TooltipComponent content="Mỗi dòng một URL, hoặc nhiều URL phân tách bằng dấu phẩy." />
									</div>
									<Textarea
										id="doc-preview-url"
										className="mt-2"
										rows={3}
										placeholder={`Mỗi dòng 1 URL, ví dụ:\nhttps://cdn.example.com/p1.jpg\nhttps://cdn.example.com/p2.jpg`}
										{...register('preview_url')}
									/>
								</div>

								<div className="col-span-2 mt-2">
									<Label htmlFor="doc-subject">Môn học</Label>
									<Controller
										name="subject_id"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value || '__none__'}
												onValueChange={(v) => field.onChange(v === '__none__' ? '' : v)}
											>
												<Select.Trigger id="doc-subject" className="mt-2">
													<Select.Value placeholder="Chọn môn học (tùy chọn)" />
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
									<Label htmlFor="doc-tech-select">Công nghệ</Label>
									<div className="mt-2">
										<TechnologyMultiSelect
											id="doc-tech-select"
											options={technologies.map((t) => ({ id: t.id, name: t.name }))}
											selectedIds={selectedTechnologyIds}
											onChange={setSelectedTechnologyIds}
											placeholder="Chọn công nghệ..."
										/>
									</div>
								</div>
								<div className="col-span-2 mt-2 flex items-end gap-5">
									<div className="w-full flex-1">
										<Label htmlFor="doc-price">Giá</Label>
										<Input
											id="doc-price"
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
									<Label htmlFor="doc-thumbnail">Thumbnail</Label>
									{thumbnail ? (
										<div className="shadow-elevation-card-rest bg-ui-bg-component transition-fg mt-2 flex items-start justify-between gap-2 rounded-md px-3 py-2">
											<img
												className="h-20 w-20 rounded object-cover"
												src={thumbnail.url}
												alt="Thumbnail"
											/>
											<Button
												size="small"
												className="h-fit text-xs"
												variant="secondary"
												type="button"
												onClick={() => setThumbnail(null)}
											>
												<Trash className="text-ui-fg-error h-4 w-4" />
											</Button>
										</div>
									) : (
										<FileUpload
											id="doc-thumbnail"
											label="Kéo thả ảnh vào đây hoặc click để chọn"
											className="mt-2"
											hint={IMAGE_UPLOAD_HINT}
											multiple={false}
											formats={SUPPORTED_IMAGE_FORMATS}
											onUploaded={(files) => files[0] && validateAndSetThumbnail(files[0])}
										/>
									)}
								</div>

								<DocumentContentMetaSection<DocumentFormValues>
									idPrefix="doc-add"
									register={register}
									control={control}
									getValues={getValues}
								/>

								<div className="mt-2">
									<Label htmlFor="doc-meta-title">Meta title</Label>
									<Input id="doc-meta-title" className="mt-2" {...register('meta_title')} />
								</div>
								<div className="mt-2">
									<Label htmlFor="doc-meta-kw">Meta keywords</Label>
									<Input id="doc-meta-kw" className="mt-2" {...register('meta_keywords')} />
								</div>
								<div className="col-span-2 mt-2">
									<Label htmlFor="doc-meta-desc">Meta description</Label>
									<Textarea
										id="doc-meta-desc"
										className="mt-2"
										rows={3}
										{...register('meta_description')}
									/>
								</div>
							</div>
						</div>
					</FocusModal.Body>
					<FocusModal.Footer className="border-t border-ui-border-base bg-ui-bg-base shrink-0">
						<Button
							type="button"
							variant="secondary"
							onClick={() => handleOpenChange(false)}
						>
							Hủy
						</Button>
						<Button type="submit">Lưu</Button>
					</FocusModal.Footer>
				</form>
			</FocusModal.Content>
		</FocusModal>
	)
}
