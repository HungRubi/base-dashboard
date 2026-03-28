import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type AuthUser = {
  email: string
  Role?: {
    name?: string
  }
}

type AuthState = {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

const AUTH_EMAIL_KEY = 'auth_email'

function loadPersistedUser(): AuthUser | null {
  if (typeof localStorage === 'undefined') return null
  const token = localStorage.getItem('access_token')
  if (!token) return null
  const email = localStorage.getItem(AUTH_EMAIL_KEY) ?? 'admin@studyhub.vn'
  return {
    email,
    Role: { name: 'admin' },
  }
}

const initialState: AuthState = {
  user: loadPersistedUser(),
  loading: false,
  error: null,
}

export const login = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  await new Promise((r) => setTimeout(r, 450))
  // Stub đăng nhập — thay bằng gọi API thật khi backend sẵn sàng.
  if (!payload.email?.trim() || payload.password.length < 6) {
    return rejectWithValue('Thông tin đăng nhập không hợp lệ')
  }
  localStorage.setItem('access_token', 'stub-token')
  localStorage.setItem(AUTH_EMAIL_KEY, payload.email.trim())
  return {
    email: payload.email.trim(),
    Role: { name: 'admin' },
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem(AUTH_EMAIL_KEY)
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Đăng nhập thất bại'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
