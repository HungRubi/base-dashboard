import { ArrowDownTray, Photo } from '@medusajs/icons';
import { Button, Prompt, Text, clx } from '@medusajs/ui';
import type { ChangeEvent, DragEvent } from 'react';
import { useCallback, useRef, useState } from 'react';

export interface FileType {
	id: string;
	url: string;
	/** Có khi chọn từ thiết bị */
	file?: File;
	/** Có khi chọn ảnh có sẵn trên server — gửi API dạng path `/upload/...` */
	serverPath?: string;
}

export interface FileUploadProps {
	id?: string;
	label: string;
	className?: string;
	multiple?: boolean;
	hint?: string;
	hasError?: boolean;
	formats: string[];
	onUploaded: (files: FileType[]) => void;
	/**
	 * Cho phép chọn ảnh từ thư viện server (GET /admin/files). Chỉ hiện khi user là admin.
	 * @default true
	 */
	enableServerLibrary?: boolean;
}

const promptContentClass = clx(
	'flex max-h-[min(88vh,820px)] flex-col overflow-hidden gap-0 border border-ui-border-base bg-ui-bg-base !p-0 !max-w-none',
	'w-[90vw] sm:w-[60vw] sm:max-w-3xl',
	'shadow-elevation-modal-rest',
	'origin-center animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none',
);

export const FileUpload = ({
	id,
	label,
	className,
	hint,
	multiple = true,
	hasError,
	formats,
	onUploaded,
	enableServerLibrary = true,
}: FileUploadProps) => {
	const [isDragOver, setIsDragOver] = useState<boolean>(false);
	const [pickerOpen, setPickerOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropZoneRef = useRef<HTMLButtonElement>(null);

	const resetPicker = useCallback(() => {
		return;
	}, []);

	const handleOpenPickerChange = useCallback(
		(open: boolean) => {
			setPickerOpen(open);
			if (!open) resetPicker();
		},
		[resetPicker],
	);

	const emitUploaded = useCallback(
		(fileList: FileList | null) => {
			if (!fileList) return;
			const fileObj = Array.from(fileList).map(file => {
				const idRand = Math.random().toString(36).substring(7);
				return {
					id: idRand,
					url: URL.createObjectURL(file),
					file,
				} satisfies FileType;
			});
			onUploaded(fileObj);
		},
		[onUploaded],
	);

	const handleOpenFileSelector = () => {
		// Tạm thời chỉ hỗ trợ chọn từ thiết bị cho đến khi module thư viện server được tích hợp.
		inputRef.current?.click();
	};

	const pickFromDevice = useCallback(() => {
		handleOpenPickerChange(false);
		queueMicrotask(() => inputRef.current?.click());
	}, [handleOpenPickerChange]);

	const handleDragEnter = (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();

		const files = event.dataTransfer?.files;
		if (!files) {
			return;
		}

		setIsDragOver(true);
	};

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();

		if (!dropZoneRef.current || dropZoneRef.current.contains(event.relatedTarget as Node)) {
			return;
		}

		setIsDragOver(false);
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();

		setIsDragOver(false);

		emitUploaded(event.dataTransfer?.files);
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		emitUploaded(event.target.files);
		event.target.value = '';
	};

	const devicePanel = (
		<div className='rounded-xl border border-ui-border-base bg-ui-bg-component/60 px-5 py-8 text-center'>
			<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ui-bg-subtle text-ui-fg-subtle'>
				<Photo className='h-6 w-6' />
			</div>
			<Text size='small' className='text-ui-fg-muted mb-5 max-w-sm mx-auto leading-relaxed'>
				{hint || 'Chọn ảnh từ máy. Định dạng phải khớp bộ lọc đã cấu hình; kích thước tối đa theo từng form.'}
			</Text>
			<Button type='button' size='small' className='min-w-[200px]' onClick={pickFromDevice}>
				Mở trình chọn file
			</Button>
		</div>
	);

	return (
		<div className={className}>
			<button
				ref={dropZoneRef}
				type='button'
				onClick={handleOpenFileSelector}
				onDrop={handleDrop}
				onDragOver={e => e.preventDefault()}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				className={clx(
					'bg-ui-bg-component border-ui-border-strong transition-fg group flex w-full flex-col items-center gap-y-2 rounded-lg border border-dashed p-8',
					'hover:border-ui-border-interactive focus:border-ui-border-interactive',
					'focus:shadow-borders-focus outline-none focus:border-solid',
					{
						'border-ui-border-error!': hasError,
						'border-ui-border-interactive!': isDragOver,
					},
				)}
			>
				<div className='text-ui-fg-subtle group-disabled:text-ui-fg-disabled flex items-center gap-x-2'>
					<ArrowDownTray />
					<Text>{label}</Text>
				</div>
				{!!hint && (
					<Text
						size='small'
						leading='compact'
						className='text-ui-fg-muted group-disabled:text-ui-fg-disabled'
					>
						{hint}
					</Text>
				)}
				{enableServerLibrary && (
					<Text size='small' className='text-ui-fg-subtle'>
						Chọn file từ thiết bị. Chức năng thư viện server sẽ được bật sau khi tích hợp API.
					</Text>
				)}
			</button>
			<input
				id={id}
				hidden
				ref={inputRef}
				onChange={handleFileChange}
				type='file'
				accept={formats.join(',')}
				multiple={multiple}
			/>

			{/* Cùng họ Alert Dialog với usePrompt (Medusa UI); hook usePrompt chỉ hỗ trợ xác nhận đơn giản, không chứa tab. */}
			<Prompt variant='confirmation' open={pickerOpen} onOpenChange={handleOpenPickerChange}>
				<Prompt.Content className={promptContentClass}>
					<Prompt.Header className='shrink-0 space-y-1 border-b border-ui-border-base px-6 py-4'>
						<Prompt.Title className='text-ui-fg-base text-base font-semibold tracking-tight'>
							Chọn nguồn ảnh
						</Prompt.Title>
						<Prompt.Description className='text-ui-fg-muted text-sm leading-normal'>
							Tải từ thiết bị hoặc chọn file ảnh đã có trong{' '}
							<code className='rounded bg-ui-bg-component px-1.5 py-0.5 font-mono text-xs'>upload/</code>{' '}
							trên server (yêu cầu quyền admin).
						</Prompt.Description>
					</Prompt.Header>

					<div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4'>
						{devicePanel}
					</div>

					<Prompt.Footer className='shrink-0 border-t border-ui-border-base bg-ui-bg-subtle/40 px-6 py-3'>
						<Prompt.Cancel>Đóng</Prompt.Cancel>
					</Prompt.Footer>
				</Prompt.Content>
			</Prompt>
		</div>
	);
};
