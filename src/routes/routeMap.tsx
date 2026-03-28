import type { ReactNode } from 'react';
import {
	ChartBar,
	CircleStack,
	CogSixTooth,
	CubeSolid,
	House,
	ShoppingBag,
	Sparkles,
	Tag,
	User,
	Users,
} from '@medusajs/icons';
import { TableDemo } from '../components/DataTable/TableDemo';
import { SectionPage } from '../pages/SectionPage';

export type RouteItem = {
	path: string;
	label: string;
	icon: ReactNode;
	element: ReactNode;
};

// Map route trung tâm để menu và router dùng chung 1 nguồn dữ liệu.
export const routeMap: RouteItem[] = [
	{
		path: '/dashboard',
		label: 'Tổng quan',
		icon: <House />,
		element: (
			<SectionPage
				title='Tổng quan'
				description='Tổng quan vận hành theo phong cách Medusa Admin, ưu tiên thông tin ngắn gọn và dễ quét.'
			/>
		),
	},
	{
		path: '/orders',
		label: 'Đơn hàng',
		icon: <ShoppingBag />,
		element: <TableDemo />,
	},
	{
		path: '/products',
		label: 'Sản phẩm',
		icon: <CubeSolid />,
		element: (
			<SectionPage title='Sản phẩm' description='Quản lý danh sách sản phẩm, biến thể và trạng thái publish.' />
		),
	},
	{
		path: '/customers',
		label: 'Khách hàng',
		icon: <Users />,
		element: (
			<SectionPage title='Khách hàng' description='Theo dõi hồ sơ khách hàng, phân nhóm và lịch sử mua hàng.' />
		),
	},
	{
		path: '/inventory',
		label: 'Tồn kho',
		icon: <CircleStack />,
		element: <SectionPage title='Tồn kho' description='Theo dõi tồn kho theo kho hàng và cảnh báo ngưỡng thấp.' />,
	},
	{
		path: '/discounts',
		label: 'Khuyến mãi',
		icon: <Tag />,
		element: <SectionPage title='Khuyến mãi' description='Cấu hình voucher, mã giảm giá và điều kiện áp dụng.' />,
	},
	{
		path: '/analytics',
		label: 'Phân tích',
		icon: <ChartBar />,
		element: (
			<SectionPage
				title='Phân tích'
				description='Theo dõi doanh thu, tỷ lệ chuyển đổi và xu hướng tăng trưởng.'
			/>
		),
	},
	{
		path: '/marketing',
		label: 'Tiếp thị',
		icon: <Sparkles />,
		element: (
			<SectionPage title='Tiếp thị' description='Quản lý chiến dịch, tệp người dùng và thông điệp quảng bá.' />
		),
	},
	{
		path: '/settings',
		label: 'Cài đặt',
		icon: <CogSixTooth />,
		element: (
			<SectionPage title='Cài đặt' description='Thiết lập thông số hệ thống, phân quyền và cấu hình chung.' />
		),
	},
	{
		path: '/profile',
		label: 'Hồ sơ',
		icon: <User />,
		element: <SectionPage title='Hồ sơ' description='Thông tin cá nhân, bảo mật tài khoản và tuỳ chọn hiển thị.' />,
	},
];
