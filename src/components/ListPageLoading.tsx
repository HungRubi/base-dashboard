import { Text } from '@medusajs/ui'

/** Spinner + chữ cho trạng thái đang tải danh sách (Medusa tokens). */
export function ListPageLoading() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-20">
			<div
				className="h-8 w-8 animate-spin rounded-full border-2 border-ui-border-strong border-t-transparent"
				aria-hidden
			/>
			<Text size="small" className="text-ui-fg-muted">
				Đang tải…
			</Text>
		</div>
	)
}
