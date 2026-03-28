import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { clearError, login } from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

type LoginFormData = z.infer<typeof loginSchema>

function safeRedirectPath(path: string | undefined): string {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return '/'
  return path
}

export default function Login() {
  const dispatch = useAppDispatch()
  const { loading, error, user } = useAppSelector((s) => s.auth)
  const navigate = useNavigate()
  const location = useLocation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const [logoMissing, setLogoMissing] = useState(false)

  const from = safeRedirectPath(
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname,
  )

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, from, navigate])

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    dispatch(clearError())
    const result = await dispatch(login({ email: data.email.trim(), password: data.password }))
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-ui-bg-subtle">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-screen w-full items-center justify-center p-4"
      >
        <div className="flex w-[90%] max-w-md min-[450px]:w-full flex-col items-center justify-center gap-y-5">
          <div className="mb-2 flex w-full flex-col items-center justify-center">
            <div className="relative mb-4 flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
              {!logoMissing && (
                <img
                  src="/img/logo.png"
                  alt="StudyHub"
                  className="h-full w-full object-contain drop-shadow-[0_1px_8px_rgba(249,115,22,0.35)] dark:drop-shadow-[0_1px_10px_rgba(251,146,60,0.25)]"
                  onError={() => setLogoMissing(true)}
                />
              )}
              {logoMissing && (
                <div
                  className="flex h-full w-full items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-amber-600 text-3xl font-bold text-white shadow-lg shadow-orange-500/25"
                  aria-hidden
                >
                  HH
                </div>
              )}
            </div>
            <h1 className="mb-1! text-center text-lg font-medium text-ui-fg-base">
              Chào mừng đến với Huy Hùng Đối tác
            </h1>
            <Text size="small" className="text-center text-ui-fg-subtle">
              Đăng nhập để truy cập khu vực tài khoản
            </Text>
          </div>

          <div className="flex w-full max-w-xs flex-col gap-y-4 sm:max-w-sm">
            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                  />
                )}
              />
              {errors.email && (
                <p className="mt-1 text-left text-xs text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Mật khẩu"
                  />
                )}
              />
              {errors.password && (
                <p className="mt-1 text-left text-xs text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && (
              <p className="mb-2! text-xs text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading} isLoading={loading}>
              Tiếp tục với Email
            </Button>
            <div className="mt-5! text-center text-sm text-ui-fg-subtle">
              Quên mật khẩu? —{' '}
              <Link
                to="/forgot-password"
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover hover:underline"
              >
                Đặt lại
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
