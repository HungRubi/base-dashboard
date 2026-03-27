import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AppState = {
  appName: string
}

const initialState: AppState = {
  appName: 'Base Dashboard',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppName: (state, action: PayloadAction<string>) => {
      state.appName = action.payload
    },
  },
})

export const { setAppName } = appSlice.actions
export default appSlice.reducer
