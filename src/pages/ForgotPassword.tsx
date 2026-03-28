import { Link } from 'react-router-dom'
import { Text } from '@medusajs/ui'

/** Placeholder — nối flow đặt lại mật khẩu khi có API. */
export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ui-bg-subtle px-4">
      <div className="w-full max-w-md rounded-xl border border-ui-border-base bg-ui-bg-base p-8 shadow-sm">
        <Text className="mb-2 text-ui-fg-base" size="large" weight="plus">
          Quên mật khẩu
        </Text>
        <Text className="mb-6 text-ui-fg-subtle" size="small">
          Tính năng đang được hoàn thiện. Liên hệ quản trị nếu cần hỗ trợ gấp.
        </Text>
        <Link
          to="/login"
          className="text-sm font-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover hover:underline"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  )
}
