import type { ReactNode } from 'react'
import {
  ArrowRightOnRectangle,
  BookOpen,
  ChartBar,
  CircleHalfSolid,
  CogSixTooth,
  CubeSolid,
  House,
  ShoppingBag,
  Sparkles,
  Tag,
  User,
  Users,
} from '@medusajs/icons'

export type NavMenuItem = {
  label: string
  icon: ReactNode
  path: string
  adminOnly?: boolean
}

export const NAVIGATION_MENU: NavMenuItem[] = [
  { label: 'Tổng quan', icon: <House className="h-4 w-4" />, path: '/dashboard' },
  { label: 'Đơn hàng', icon: <ShoppingBag className="h-4 w-4" />, path: '/orders' },
  { label: 'Sản phẩm', icon: <CubeSolid className="h-4 w-4" />, path: '/products' },
  { label: 'Khách hàng', icon: <Users className="h-4 w-4" />, path: '/customers' },
  { label: 'Tài liệu', icon: <BookOpen className="h-4 w-4" />, path: '/document' },
  { label: 'Tồn kho', icon: <ChartBar className="h-4 w-4" />, path: '/inventory' },
  { label: 'Khuyến mãi', icon: <Tag className="h-4 w-4" />, path: '/discounts' },
  { label: 'Phân tích', icon: <ChartBar className="h-4 w-4" />, path: '/analytics' },
  { label: 'Tiếp thị', icon: <Sparkles className="h-4 w-4" />, path: '/marketing' },
  {
    label: 'Cài đặt',
    icon: <CogSixTooth className="h-4 w-4" />,
    path: '/settings',
    adminOnly: true,
  },
  { label: 'Hồ sơ', icon: <User className="h-4 w-4" />, path: '/profile' },
]

export const DROPDOWN_MENU_ACCOUNT = [
  {
    label: 'Cài đặt hồ sơ',
    icon: <User className="h-4 w-4" />,
    path: '/profile',
  },
  {
    label: 'Chủ đề',
    icon: <CircleHalfSolid className="h-4 w-4" />,
  },
  {
    label: 'Đăng xuất',
    icon: <ArrowRightOnRectangle className="h-4 w-4" />,
    path: '/logout',
  },
]
