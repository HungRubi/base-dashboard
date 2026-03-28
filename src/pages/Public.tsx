import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import Navigation from '../components/navigation/Navigation';
import { BreadcrumbProvider } from '../context/BreadcrumbContext';
import { useNav } from '../context/useNav';

export default function PublicLayout() {
	const nav = useNav();
	const sidebarWidth = nav?.navOpen === false ? '0px' : '250px';

	return (
		<BreadcrumbProvider>
		<div
			className='grid h-dvh max-h-dvh w-full overflow-hidden bg-ui-bg-subtle transition-[grid-template-columns] duration-200'
			style={{ gridTemplateColumns: `${sidebarWidth} 1fr` }}
		>
			<aside className='min-h-0 overflow-hidden border-r border-ui-border-base'>
				<Navigation />
			</aside>

			<div className='flex min-h-0 min-w-0 flex-col overflow-hidden'>
				<Header />
				<main className='min-h-0 flex-1 overflow-y-auto overscroll-contain p-6'>
					<Outlet />
				</main>
			</div>
		</div>
		</BreadcrumbProvider>
	);
}
