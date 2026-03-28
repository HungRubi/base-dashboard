import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type CategoryRow = {
	id: number
	name: string
}

type State = { list: CategoryRow[]; loading: boolean }

const MOCK: CategoryRow[] = [
	{ id: 1, name: 'Tài nguyên đối tác' },
	{ id: 2, name: 'Marketing & sales' },
	{ id: 3, name: 'Pháp lý & hợp đồng' },
	{ id: 4, name: 'Kỹ thuật & API' },
]

const initialState: State = { list: [], loading: false }

export const getCategories = createAsyncThunk<CategoryRow[]>('category/getCategories', async () => {
	await new Promise((r) => setTimeout(r, 200))
	return MOCK
})

const categorySlice = createSlice({
	name: 'category',
	initialState,
	reducers: {},
	extraReducers: (b) => {
		b.addCase(getCategories.pending, (s) => {
			s.loading = true
		})
			.addCase(getCategories.fulfilled, (s, a) => {
				s.loading = false
				s.list = a.payload
			})
			.addCase(getCategories.rejected, (s) => {
				s.loading = false
			})
	},
})

export default categorySlice.reducer
