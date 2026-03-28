import { ExclamationCircle, MagnifyingGlass, PlusMini } from '@medusajs/icons';
import { Button, Text, clx } from '@medusajs/ui';
import React from 'react';
import { Link } from 'react-router-dom';

export type NoResultsProps = {
	title?: string;
	message?: string;
	className?: string;
};

export const NoResults = ({ title, message, className }: NoResultsProps) => {
	return (
		<div className={clx('flex h-[400px] w-full items-center justify-center', className)}>
			<div className='flex flex-col items-center gap-y-2'>
				<MagnifyingGlass />
				<Text size='small' leading='compact' weight='plus'>
					{title ?? 'No Results Title'}
				</Text>
				<Text size='small' className='text-ui-fg-subtle'>
					{message ?? 'No Results Message'}
				</Text>
			</div>
		</div>
	);
};

type ActionProps = {
	action?: {
		to: string;
		label: string;
	};
};

type NoRecordsProps = {
	title?: string;
	message?: string;
	className?: string;
	buttonVariant?: string;
	icon?: React.ReactNode;
} & ActionProps;

const DefaultButton = ({ action }: ActionProps) =>
	action && (
		<Link to={action.to}>
			<Button variant='secondary' size='small'>
				{action.label}
			</Button>
		</Link>
	);

const TransparentIconLeftButton = ({ action }: ActionProps) =>
	action && (
		<Link to={action.to}>
			<Button variant='transparent' className='text-ui-fg-interactive'>
				<PlusMini /> {action.label}
			</Button>
		</Link>
	);

export const NoRecords = ({
	title,
	message,
	action,
	className,
	buttonVariant = 'default',
	icon = <ExclamationCircle className='text-ui-fg-subtle' />,
}: NoRecordsProps) => {
	return (
		<div className={clx('flex h-[150px] w-full flex-col items-center justify-center gap-y-4', className)}>
			<div className='flex flex-col items-center gap-y-3'>
				{icon}

				<div className='flex flex-col items-center gap-y-1'>
					<Text size='small' leading='compact' weight='plus'>
						{title ?? 'No Records Title'}
					</Text>

					<Text size='small' className='text-ui-fg-muted'>
						{message ?? 'No Records Message'}
					</Text>
				</div>
			</div>

			{buttonVariant === 'default' && <DefaultButton action={action} />}
			{buttonVariant === 'transparentIconLeft' && <TransparentIconLeftButton action={action} />}
		</div>
	);
};
