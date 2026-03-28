import { EllipsisHorizontal, EyeMini, PencilSquare, Trash } from '@medusajs/icons'
import { DropdownMenu, IconButton, Text } from '@medusajs/ui'

/** Giống menu tài khoản: không ring/focus box; hover/open tách khỏi nền row (table dùng bg-ui-bg-base-hover). */
const tableRowActionTriggerClass =
	'mr-0 cursor-pointer rounded-md border-none bg-transparent shadow-none outline-none ring-0 ' +
	'hover:bg-ui-bg-component active:bg-ui-bg-component-hover ' +
	'focus:bg-transparent focus:outline-none focus:shadow-none focus:ring-0 ' +
	'focus-visible:bg-transparent focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0 ' +
	'data-[state=open]:bg-ui-bg-component data-[state=open]:outline-none data-[state=open]:ring-0 data-[state=open]:shadow-none'
import type { NavigateFunction } from 'react-router-dom'
import type { Document } from '../../store/slices/documentSlice'
import type { DocumentTableColumn } from './DocumentTable'

function formatDate(iso: string) {
	try {
		return new Intl.DateTimeFormat('vi-VN', {
			dateStyle: 'medium',
			timeStyle: 'short',
		}).format(new Date(iso))
	} catch {
		return iso
	}
}

function formatPrice(vnd: number) {
	if (vnd === 0) return 'Miễn phí'
	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vnd)
}

export function getDocumentColumns(
	navigate: NavigateFunction,
	onDelete: (row: Document) => void,
): DocumentTableColumn<Document>[] {
	return [
		{
			id: 'title',
			header: 'Tiêu đề',
			render: (row) => (
				<div className="max-w-[240px] min-w-0 sm:max-w-xs">
					<Text size="small" className="truncate text-ui-fg-base" title={row.title}>
						{row.title}
					</Text>
					<Text size="xsmall" className="truncate text-ui-fg-muted" title={row.description}>
						{row.description}
					</Text>
				</div>
			),
		},
		{
			id: 'slug',
			header: 'Slug',
			render: (row) => (
				<span className="font-mono text-sm text-ui-fg-muted truncate block max-w-[160px]" title={row.slug}>
					{row.slug}
				</span>
			),
		},
		{
			id: 'price',
			header: 'Giá',
			align: 'right',
			render: (row) => (
				<Text size="small" className="text-ui-fg-subtle">
					{formatPrice(row.price)}
				</Text>
			),
		},
		{
			id: 'views',
			header: 'Lượt xem',
			align: 'right',
			cellClassName: 'text-ui-fg-muted',
			render: (row) => (
				<span className="text-sm tabular-nums">{row.view_count.toLocaleString('vi-VN')}</span>
			),
		},
		{
			id: 'created',
			header: 'Ngày tạo',
			render: (row) => (
				<Text size="small" className="text-ui-fg-muted whitespace-nowrap">
					{formatDate(row.created_at)}
				</Text>
			),
		},
		{
			id: 'actions',
			header: '',
			cellClassName: 'text-right',
			render: (row) => (
				<div
					className="flex justify-end"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					role="presentation"
				>
					<DropdownMenu>
						<DropdownMenu.Trigger asChild>
							<IconButton
								variant="transparent"
								size="small"
								type="button"
								aria-label="Thao tác"
								className={tableRowActionTriggerClass}
							>
								<EllipsisHorizontal />
							</IconButton>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							align="end"
							sideOffset={6}
							className="min-w-38! max-w-48 p-1"
						>
							<DropdownMenu.Item
								className="gap-x-2 py-1! px-2! text-ui-fg-subtle"
								onClick={() => navigate(`/document/detail/${row.id}`)}
							>
								<EyeMini className="h-3.5 w-3.5 shrink-0 text-ui-fg-muted" />
								<span className="truncate">Xem chi tiết</span>
							</DropdownMenu.Item>
							<DropdownMenu.Separator className="my-0.5 opacity-60" />
							<DropdownMenu.Item
								className="gap-x-2 py-1! px-2! text-ui-fg-subtle"
								onClick={() => navigate(`/document/edit/${row.id}`)}
							>
								<PencilSquare className="h-3.5 w-3.5 shrink-0 text-ui-fg-muted" />
								<span className="truncate">Chỉnh sửa</span>
							</DropdownMenu.Item>
							<DropdownMenu.Separator className="my-0.5 opacity-60" />
							<DropdownMenu.Item
								className="gap-x-2 py-1! px-2! text-ui-fg-error"
								onClick={() => onDelete(row)}
							>
								<Trash className="h-3.5 w-3.5 shrink-0 text-ui-fg-error" />
								<span className="truncate">Xóa</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu>
				</div>
			),
		},
	]
}
