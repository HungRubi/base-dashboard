import { useEffect, useState } from 'react'
import { Avatar, DropdownMenu, IconButton } from '@medusajs/ui'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CircleHalfSolid, EllipsisHorizontal, MagnifyingGlassMini } from '@medusajs/icons'
import { useNav } from '../../context/useNav'
import {
  THEME_KEY,
  applyTheme,
  getInitialTheme,
  type ThemeValue,
} from '../../lib/dashboard-theme'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'
import { DROPDOWN_MENU_ACCOUNT, NAVIGATION_MENU } from './Menu'

export type { ThemeValue }

const linkBase =
  'group mb-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out'
const active =
  linkBase +
  ' border border-ui-border-base bg-ui-bg-component text-ui-fg-subtle shadow-[0_1px_1px_rgba(0,0,0,0.03)] hover:bg-ui-bg-component-hover hover:shadow-[0_2px_4px_rgba(0,0,0,0.04)] active:scale-[0.99]'
const notActive =
  linkBase + ' text-ui-fg-subtle hover:bg-ui-bg-base-hover hover:text-ui-fg-base active:scale-[0.99]'

const THEME_OPTIONS: { value: ThemeValue; label: string }[] = [
  { value: 'system', label: 'Hệ thống' },
  { value: 'sáng', label: 'Sáng' },
  { value: 'tối', label: 'Tối' },
]

const Navigation = () => {
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const nav = useNav()
  const user = useAppSelector((state) => state.auth.user)
  const isAdmin = (user?.Role?.name ?? '').toLowerCase() === 'admin'
  const menuItems = NAVIGATION_MENU.filter((item) => !item.adminOnly || isAdmin)
  const [theme, setTheme] = useState<ThemeValue>(getInitialTheme)
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  const closeNavIfMobile = () => {
    if (nav && !nav.isLg) nav.setNavOpen(false)
  }

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // Theo dõi system theme khi user chọn "Hệ thống".
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return (
    <nav className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-ui-bg-base">
      {/* Header của sidebar, giữ cố định trên cùng. */}
      <div className="flex h-[52px] w-full shrink-0 items-center px-5">
        <div className="flex h-full w-full items-center justify-between border-b border-dotted border-ui-border-base">
          <div className="flex min-w-0 items-center justify-center gap-2">
            <Avatar fallback="H" variant="squared" className="shrink-0" />
            <span className="truncate text-sm font-medium text-ui-fg-base transition-colors duration-200 ease-out">
                Kho tổng hợp
            </span>
          </div>
        </div>
      </div>

      {/* Danh sách menu có thể cuộn dọc khi danh mục dài. */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
        <button
          type="button"
          className="mb-1.5 flex w-full cursor-default items-center justify-between gap-3 rounded-lg px-3 py-2 text-left font-medium text-ui-fg-subtle"
        >
          <div className="flex items-center gap-3">
            <MagnifyingGlassMini className="h-4.5 w-4.5 shrink-0 transition-transform duration-200 ease-out" />
            <span className="min-w-0 truncate text-[13px] font-medium text-ui-fg-base transition-colors duration-200 ease-out">
              Tìm kiếm
            </span>
          </div>
        </button>

        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            className={isActive(item.path) ? active : notActive}
            onClick={closeNavIfMobile}
          >
            <span className="shrink-0 transition-colors duration-200 ease-out [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out group-hover:[&_svg]:translate-x-0.5">
              {item.icon}
            </span>
            <span className="min-w-0 truncate text-[13px] font-medium text-ui-fg-base transition-colors duration-200 ease-out">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Cụm tài khoản cố định dưới cùng để thao tác nhanh. */}
      <div className="flex shrink-0 items-center justify-between border-t border-dotted border-ui-border-base px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar fallback="A" className="shrink-0" />
          <span className="truncate text-sm font-medium text-ui-fg-base transition-colors duration-200 ease-out">
            Admin
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton className="mr-0 cursor-pointer border-none bg-transparent shadow-none outline-none ring-0 hover:bg-transparent focus:bg-transparent focus:outline-none focus:shadow-none focus:ring-0 focus-visible:bg-transparent focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0 data-[state=open]:bg-transparent data-[state=open]:outline-none data-[state=open]:ring-0 data-[state=open]:shadow-none">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" sideOffset={10}>
            <div className="flex w-full items-center gap-x-2 border-b border-ui-border-base p-3">
              <Avatar fallback="A" />
              <span className="line-clamp-1 cursor-pointer text-sm font-medium text-ui-fg-base">
                admin@studyhub.vn
              </span>
            </div>
            {DROPDOWN_MENU_ACCOUNT.map((item) => {
              if (item.label === 'Chủ đề') {
                return (
                  <DropdownMenu.SubMenu key={item.label}>
                    <DropdownMenu.SubMenuTrigger className="gap-x-2 px-3 py-1.5">
                      <CircleHalfSolid className="h-4 w-4" />
                      Chủ đề
                    </DropdownMenu.SubMenuTrigger>
                    <DropdownMenu.SubMenuContent>
                      {THEME_OPTIONS.map((opt) => (
                        <DropdownMenu.Item
                          key={opt.value}
                          className="gap-x-2 px-3 py-1.5"
                          onClick={() => setTheme(opt.value)}
                        >
                          {theme === opt.value ? (
                            <span className="text-ui-fg-base">•</span>
                          ) : (
                            <span className="w-[1ch]" />
                          )}
                          {opt.label}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.SubMenuContent>
                  </DropdownMenu.SubMenu>
                )
              }
              return (
                <DropdownMenu.Item
                  key={item.label}
                  className="gap-x-2 px-3 py-1.5"
                  onClick={() => {
                    if (item.path === '/logout') {
                      void dispatch(logout())
                      navigate('/login')
                    } else if (item.path) {
                      navigate(item.path)
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </DropdownMenu.Item>
              )
            })}
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>

    </nav>
  )
}

export default Navigation
