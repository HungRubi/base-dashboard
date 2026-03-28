import { BarsArrowDown } from '@medusajs/icons'
import { Button, Container, DropdownMenu, Heading, Input, toast, usePrompt } from '@medusajs/ui'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { getDocumentColumns } from '../../components/DocumentTable/documentColumns'
import { DocumentTable } from '../../components/DocumentTable/DocumentTable'
import { NoResults } from '../../components/Empty'
import { ListPageLoading } from '../../components/ListPageLoading'
import { useToastOnListError } from '../../hooks/useToastOnListError'
import type { Document, GetDocumentsParams } from '../../store/slices/documentSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
	clearDocumentListError,
	deleteDocument,
	getDocuments,
} from '../../store/slices/documentSlice'

type SortByOption = GetDocumentsParams['sortBy']
type SortOrderOption = GetDocumentsParams['sort']

const PAGE_SIZE = 15

export default function DocumentList() {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const prompt = usePrompt()
	const { list, listLoading, listError } = useAppSelector((state) => state.document)
	const [searchInput, setSearchInput] = useState('')
	const [debouncedSearch] = useDebounce(searchInput, 300)
	const [sortBy, setSortBy] = useState<SortByOption>('created_at')
	const [sortOrder, setSortOrder] = useState<SortOrderOption>('desc')
	const currentSortKey = `${sortBy}-${sortOrder}` as const

	const handleDelete = useCallback(
		async (row: Document) => {
			const confirmed = await prompt({
				title: 'Xóa tài liệu',
				description: `Bạn có chắc muốn xóa tài liệu "${row.title}"? Hành động này không thể hoàn tác.`,
				confirmText: 'Xóa',
				cancelText: 'Hủy',
				variant: 'danger',
			})
			if (!confirmed) return
			dispatch(deleteDocument(row.id))
				.unwrap()
				.then(({ message }) => {
					toast.success(message ?? 'Xóa tài liệu thành công.')
				})
				.catch(() => {
					toast.error('Xóa tài liệu thất bại.')
				})
		},
		[prompt, dispatch],
	)

	const fetchList = useCallback(
		(q?: string, sortByVal?: SortByOption, sortVal?: SortOrderOption) => {
			const params: GetDocumentsParams = {
				include_all: 1,
				sortBy: sortByVal ?? 'created_at',
				sort: sortVal ?? 'desc',
			}
			if (q?.trim()) params.q = q.trim()
			dispatch(getDocuments(params))
		},
		[dispatch],
	)

	useEffect(() => {
		fetchList(debouncedSearch, sortBy, sortOrder)
	}, [debouncedSearch, sortBy, sortOrder, fetchList])

	useToastOnListError(listError, dispatch, clearDocumentListError)

	const sortItemCls = (active: boolean) =>
		`gap-x-2 px-3 py-1.5 ${active ? 'text-ui-fg-base' : 'text-ui-fg-subtle'}`

	return (
		<Container className="p-0!">
			<Heading className="flex items-center justify-between border-b border-ui-border-base p-5" level="h2">
				<span className="text-sm font-medium text-ui-fg-base">Tài liệu</span>
				<div className="flex gap-x-5">
					<Button variant="secondary" size="small" onClick={() => navigate('/document/add')}>
						Thêm tài liệu
					</Button>
				</div>
			</Heading>
			<Heading className="flex items-center justify-between p-5" level="h2">
				<Button variant="secondary" size="small" type="button">
					Thêm bộ lọc
				</Button>
				<div className="flex items-center gap-x-3">
					<Input
						placeholder="Tìm theo tiêu đề, mô tả, slug..."
						id="search-input"
						type="search"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<DropdownMenu>
						<DropdownMenu.Trigger asChild>
							<Button variant="secondary" size="small" className="p-2" type="button" aria-label="Sắp xếp">
								<BarsArrowDown className="h-4 w-4 text-ui-fg-subtle" />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" sideOffset={6}>
							<div className="border-b border-ui-border-base px-3 py-1.5 text-xs font-medium text-ui-fg-subtle">
								Sắp xếp
							</div>
							<DropdownMenu.Item
								className={sortItemCls(currentSortKey === 'title-desc')}
								onClick={() => {
									setSortBy('title')
									setSortOrder('desc')
								}}
							>
								{currentSortKey === 'title-desc' ? (
									<span className="text-ui-fg-base">•</span>
								) : (
									<span className="w-[1ch]" />
								)}
								Tiêu đề - Giảm dần
							</DropdownMenu.Item>
							<DropdownMenu.Item
								className={sortItemCls(currentSortKey === 'title-asc')}
								onClick={() => {
									setSortBy('title')
									setSortOrder('asc')
								}}
							>
								{currentSortKey === 'title-asc' ? (
									<span className="text-ui-fg-base">•</span>
								) : (
									<span className="w-[1ch]" />
								)}
								Tiêu đề - Tăng dần
							</DropdownMenu.Item>
							<DropdownMenu.Item
								className={sortItemCls(currentSortKey === 'created_at-desc')}
								onClick={() => {
									setSortBy('created_at')
									setSortOrder('desc')
								}}
							>
								{currentSortKey === 'created_at-desc' ? (
									<span className="text-ui-fg-base">•</span>
								) : (
									<span className="w-[1ch]" />
								)}
								Ngày tạo - Mới nhất trước
							</DropdownMenu.Item>
							<DropdownMenu.Item
								className={sortItemCls(currentSortKey === 'created_at-asc')}
								onClick={() => {
									setSortBy('created_at')
									setSortOrder('asc')
								}}
							>
								{currentSortKey === 'created_at-asc' ? (
									<span className="text-ui-fg-base">•</span>
								) : (
									<span className="w-[1ch]" />
								)}
								Ngày tạo - Cũ nhất trước
							</DropdownMenu.Item>
							<DropdownMenu.Item
								className={sortItemCls(currentSortKey === 'view_count-desc')}
								onClick={() => {
									setSortBy('view_count')
									setSortOrder('desc')
								}}
							>
								{currentSortKey === 'view_count-desc' ? (
									<span className="text-ui-fg-base">•</span>
								) : (
									<span className="w-[1ch]" />
								)}
								Lượt xem - Cao nhất
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu>
				</div>
			</Heading>

			<div className="flex flex-col gap-2">
				{listLoading ? (
					<ListPageLoading />
				) : list.length === 0 ? (
					<NoResults
						title="Không có kết quả"
						message="Không có tài liệu nào khớp với tiêu chí lọc hoặc sắp xếp hiện tại."
					/>
				) : (
					<DocumentTable<Document>
						key={debouncedSearch}
						data={list}
						columns={getDocumentColumns(navigate, handleDelete)}
						getRowKey={(row) => row.id}
						pageSize={PAGE_SIZE}
						size="base"
						emptyTitle="Không có kết quả"
						emptyMessage="Không có tài liệu nào khớp với tiêu chí lọc hiện tại"
						className="flex flex-col gap-2"
						onRowClick={(row) => navigate(`/document/detail/${row.id}`)}
					/>
				)}
			</div>
		</Container>
	)
}
