import { LayoutLeft, PlayMiniSolid } from '@medusajs/icons';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_MENU } from '../navigation/Menu';
import { NotificationsBell } from './NotificationsBell';
import { useNav } from '../../context/useNav';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';

function getDefaultLabel(pathname: string): string {
	const item = NAVIGATION_MENU.find(
		menu => menu.path === pathname || (menu.path !== '/' && pathname.startsWith(menu.path + '/')),
	);
	return item?.label ?? '';
}

const Header = () => {
	const { pathname } = useLocation();
	const breadcrumb = useBreadcrumb();
	const nav = useNav();
	const segments = breadcrumb?.segments ?? [];
	const showBreadcrumb = segments.length > 1;
	const defaultLabel = !showBreadcrumb ? getDefaultLabel(pathname) : '';

	return (
		<header className='flex h-[70px] w-full shrink-0 items-center justify-between border-b border-dotted border-ui-border-base bg-ui-bg-base px-5 text-ui-fg-subtle'>
			<div className='flex items-center justify-center gap-3'>
				<button
					type='button'
					onClick={() => nav?.toggleNav()}
					aria-label={nav?.navOpen ? 'Đóng menu' : 'Mở menu'}
					className='-m-1 rounded p-1 cursor-pointer text-ui-fg-subtle transition-colors duration-150 hover:text-ui-fg-base'
				>
					<LayoutLeft className='h-4.5 w-4.5 shrink-0' />
				</button>

				{showBreadcrumb ? (
					<div className='flex flex-wrap items-center gap-2'>
						{segments.map((seg, index) => (
							<span key={`${seg.label}-${index}`} className='flex items-center gap-2'>
								{index > 0 && <PlayMiniSolid className='h-2 w-2 shrink-0 text-ui-fg-muted' />}
								{seg.path ? (
									<Link
										to={seg.path}
										className='text-sm font-medium text-ui-fg-muted hover:text-ui-fg-subtle'
									>
										{seg.label}
									</Link>
								) : (
									<span className='text-sm font-medium text-ui-fg-base'>{seg.label}</span>
								)}
							</span>
						))}
					</div>
				) : (
					<span className='text-sm font-medium text-ui-fg-base'>{defaultLabel}</span>
				)}
			</div>

			<NotificationsBell />
		</header>
	);
};

export default Header;
