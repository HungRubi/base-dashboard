import { Table, Text } from '@medusajs/ui'
import { useEffect, useMemo, useState, type ReactNode } from 'react'

export type DocumentTableColumn<T> = {
	id: string
	header: ReactNode
	render: (row: T) => ReactNode
	headerClassName?: string
	cellClassName?: string
	align?: 'left' | 'right'
}

type DocumentTableProps<T> = {
	data: T[]
	columns: DocumentTableColumn<T>[]
	getRowKey: (row: T) => string
	pageSize: number
	size?: 'base' | 'small'
	emptyTitle?: string
	emptyMessage?: string
	className?: string
	onRowClick?: (row: T) => void
}

export function DocumentTable<T>({
	data,
	columns,
	getRowKey,
	pageSize,
	size = 'base',
	emptyTitle = 'Không có kết quả',
	emptyMessage = 'Không có dữ liệu hiển thị.',
	className,
	onRowClick,
}: DocumentTableProps<T>) {
	const [pageIndex, setPageIndex] = useState(0)

	useEffect(() => {
		setPageIndex(0)
	}, [data])

	const pageCount = Math.max(1, Math.ceil(data.length / pageSize))
	const safePage = Math.min(pageIndex, pageCount - 1)

	const pageRows = useMemo(() => {
		const start = safePage * pageSize
		return data.slice(start, start + pageSize)
	}, [data, pageSize, safePage])

	const canPreviousPage = safePage > 0
	const canNextPage = safePage < pageCount - 1

	const nextPage = () => {
		if (canNextPage) setPageIndex((p) => p + 1)
	}
	const previousPage = () => {
		if (canPreviousPage) setPageIndex((p) => p - 1)
	}

	if (data.length === 0) {
		return (
			<div className={className}>
				<div className="flex flex-col items-center justify-center gap-2 py-16">
					<Text size="small" weight="plus" className="text-ui-fg-base">
						{emptyTitle}
					</Text>
					<Text size="small" className="text-ui-fg-subtle">
						{emptyMessage}
					</Text>
				</div>
			</div>
		)
	}

	const tableTxt = size === 'small' ? 'txt-compact-xsmall' : undefined

	return (
		<div className={className}>
			<Table className={tableTxt}>
				<Table.Header>
					<Table.Row>
						{columns.map((col) => (
							<Table.HeaderCell
								key={col.id}
								className={
									col.align === 'right'
										? `text-right ${col.headerClassName ?? ''}`
										: col.headerClassName
								}
							>
								{col.header}
							</Table.HeaderCell>
						))}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{pageRows.map((row) => (
						<Table.Row
							key={getRowKey(row)}
							className={
								onRowClick
									? 'cursor-pointer [&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap'
									: '[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap'
							}
							onClick={() => onRowClick?.(row)}
						>
							{columns.map((col) => (
								<Table.Cell
									key={col.id}
									className={
										col.align === 'right'
											? `text-right ${col.cellClassName ?? ''}`
											: col.cellClassName
									}
								>
									{col.render(row)}
								</Table.Cell>
							))}
						</Table.Row>
					))}
				</Table.Body>
			</Table>
			<Table.Pagination
				count={data.length}
				pageSize={pageSize}
				pageIndex={safePage}
				pageCount={pageCount}
				canPreviousPage={canPreviousPage}
				canNextPage={canNextPage}
				previousPage={previousPage}
				nextPage={nextPage}
				translations={{
					of: 'trên',
					results: 'mục',
					pages: 'trang',
					prev: 'Trước',
					next: 'Sau',
				}}
			/>
		</div>
	)
}
