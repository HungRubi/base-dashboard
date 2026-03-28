import { ChevronDownMini } from '@medusajs/icons'
import { Checkbox, Popover, Text } from '@medusajs/ui'
import { useCallback, useMemo, useState } from 'react'

export type TechnologyOption = { id: string; name: string }

type Props = {
	id?: string
	options: TechnologyOption[]
	selectedIds: string[]
	onChange: (ids: string[]) => void
	placeholder?: string
}

export function TechnologyMultiSelect({
	id,
	options,
	selectedIds,
	onChange,
	placeholder = 'Chọn...',
}: Props) {
	const [open, setOpen] = useState(false)

	const label = useMemo(() => {
		if (!selectedIds.length) return placeholder
		const names = selectedIds
			.map((sid) => options.find((o) => o.id === sid)?.name)
			.filter(Boolean)
		return names.length ? names.join(', ') : placeholder
	}, [selectedIds, options, placeholder])

	const toggle = useCallback(
		(oid: string) => {
			if (selectedIds.includes(oid)) {
				onChange(selectedIds.filter((x) => x !== oid))
			} else {
				onChange([...selectedIds, oid])
			}
		},
		[selectedIds, onChange],
	)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild id={id}>
				<button
					type="button"
					className="bg-ui-bg-field text-ui-fg-base shadow-buttons-neutral hover:bg-ui-bg-field-hover txt-compact-small flex h-8 w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 outline-none transition-colors focus-visible:shadow-borders-interactive-with-active"
				>
					<span className="truncate text-left">{label}</span>
					<ChevronDownMini className="text-ui-fg-muted h-4 w-4 shrink-0" />
				</button>
			</Popover.Trigger>
			<Popover.Content className="max-h-64 min-w-[var(--radix-popper-anchor-width)] overflow-y-auto p-2" align="start">
				{options.length === 0 ? (
					<Text size="small" className="text-ui-fg-muted px-2 py-1">
						Chưa có dữ liệu công nghệ
					</Text>
				) : (
					<ul className="flex flex-col gap-0.5">
						{options.map((opt) => (
							<li key={opt.id}>
								<label className="hover:bg-ui-bg-base-hover flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5">
									<Checkbox
										checked={selectedIds.includes(opt.id)}
										onCheckedChange={() => {
											toggle(opt.id)
										}}
									/>
									<span className="txt-compact-small text-ui-fg-base">{opt.name}</span>
								</label>
							</li>
						))}
					</ul>
				)}
			</Popover.Content>
		</Popover>
	)
}
