import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

/** Chỉ render khu vực app khi đã có user; không thì chuyển tới /login kèm `from` để quay lại sau đăng nhập. */
export default function ProtectedRoute() {
  const user = useAppSelector((s) => s.auth.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
