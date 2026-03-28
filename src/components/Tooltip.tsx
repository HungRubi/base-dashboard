import { InformationCircleSolid } from '@medusajs/icons'
import { Tooltip } from '@medusajs/ui'

export function TooltipComponent({ content }: { content: string }) {
	return (
		<Tooltip content={content}>
			<button
				type="button"
				className="inline-flex shrink-0 text-ui-fg-muted hover:text-ui-fg-subtle"
				aria-label="Thông tin thêm"
			>
				<InformationCircleSolid className="h-4 w-4" />
			</button>
		</Tooltip>
	)
}
