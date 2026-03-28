import { EllipsisHorizontal } from '@medusajs/icons'
import { DropdownMenu, IconButton } from '@medusajs/ui'
import { Fragment, type ReactNode } from 'react'

const triggerResetClass =
	'mr-0 cursor-pointer rounded-md border-none bg-transparent shadow-none outline-none ring-0 ' +
	'hover:bg-ui-bg-component active:bg-ui-bg-component-hover ' +
	'focus:bg-transparent focus:outline-none focus:shadow-none focus:ring-0 ' +
	'focus-visible:bg-transparent focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0 ' +
	'data-[state=open]:bg-ui-bg-component data-[state=open]:outline-none data-[state=open]:ring-0 data-[state=open]:shadow-none'

export type DropdownMenuDemoItem = {
	label: string
	icon?: ReactNode
	onClick: () => void
}

type DropdownMenuDemoProps = {
	data: DropdownMenuDemoItem[]
	align?: 'start' | 'center' | 'end'
	/** Giữ prop để tương thích API cũ; avatar không dùng trong bản Medusa này. */
	isAvatar?: boolean
	triggerClassName?: string
	contentClassName?: string
}

/** Menu ⋯ tái dùng (header card, v.v.) — cùng họ trigger với Navigation / bảng. */
export default function DropdownMenuDemo({
	data,
	align = 'end',
	isAvatar: _isAvatar,
	triggerClassName,
	contentClassName,
}: DropdownMenuDemoProps) {
	return (
		<DropdownMenu>
			<DropdownMenu.Trigger asChild>
				<IconButton
					variant="transparent"
					size="small"
					type="button"
					aria-label="Mở menu"
					className={[triggerResetClass, triggerClassName].filter(Boolean).join(' ')}
				>
					<EllipsisHorizontal />
				</IconButton>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align={align} sideOffset={6} className={['min-w-36! p-1', contentClassName].filter(Boolean).join(' ')}>
				{data.map((item, index) => (
					<Fragment key={item.label}>
						{index > 0 ? <DropdownMenu.Separator className="my-0.5 opacity-60" /> : null}
						<DropdownMenu.Item
							className="gap-x-2 py-1! px-2! text-ui-fg-subtle"
							onSelect={() => item.onClick()}
						>
							{item.icon}
							<span className="truncate">{item.label}</span>
						</DropdownMenu.Item>
					</Fragment>
				))}
			</DropdownMenu.Content>
		</DropdownMenu>
	)
}
