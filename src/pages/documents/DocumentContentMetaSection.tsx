import { Label, Select, Input, Switch } from '@medusajs/ui'
import type { Control, FieldValues, UseFormGetValues, UseFormRegister } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { ContentMetaFormDefaults } from './documentContentMeta'

type Props<T extends FieldValues & ContentMetaFormDefaults> = {
	idPrefix: string
	register: UseFormRegister<T>
	control: Control<T>
	getValues: UseFormGetValues<T>
}

export function DocumentContentMetaSection<T extends FieldValues & ContentMetaFormDefaults>({
	idPrefix,
	register,
	control,
}: Props<T>) {
	const base = idPrefix

	return (
		<div className="col-span-2 mt-2 space-y-4 rounded-lg border border-ui-border-base border-dashed p-4">
			<Label className="text-ui-fg-base">Meta nội dung (kỹ thuật)</Label>
			<div>
				<Label htmlFor={`${base}-meta-kind`}>Loại nội dung</Label>
				<Controller
					name={'content_meta_kind' as never}
					control={control}
					render={({ field }) => (
						<Select value={field.value} onValueChange={field.onChange}>
							<Select.Trigger id={`${base}-meta-kind`} className="mt-2">
								<Select.Value placeholder="Chọn loại" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="none">Không khai báo</Select.Item>
								<Select.Item value="pdf">PDF / tài liệu dạng trang</Select.Item>
								<Select.Item value="slides">Slide / bài giảng</Select.Item>
								<Select.Item value="code">Mã nguồn / repo</Select.Item>
							</Select.Content>
						</Select>
					)}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Label htmlFor={`${base}-page-count`}>Số trang / slide</Label>
					<Input
						id={`${base}-page-count`}
						type="number"
						min={0}
						className="mt-2"
						{...register('content_meta_page_count' as never)}
					/>
				</div>
				<div>
					<Label htmlFor={`${base}-item-count`}>Số mục (file, thư mục...)</Label>
					<Input
						id={`${base}-item-count`}
						type="number"
						min={0}
						className="mt-2"
						{...register('content_meta_item_count' as never)}
					/>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Controller
					name={'content_meta_has_readme' as never}
					control={control}
					render={({ field }) => (
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					)}
				/>
				<Label>Có README / hướng dẫn</Label>
			</div>
			<div>
				<Label htmlFor={`${base}-top`}>Cấu trúc thư mục (mô tả ngắn)</Label>
				<Input
					id={`${base}-top`}
					className="mt-2"
					placeholder="vd: src/, docs/"
					{...register('content_meta_top_level' as never)}
				/>
			</div>
		</div>
	)
}
