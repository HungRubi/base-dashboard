import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type SubjectRow = {
	id: number
	name: string
}

type State = { list: SubjectRow[]; loading: boolean }

const MOCK: SubjectRow[] = [
	{ id: 1, name: 'Toán học' },
	{ id: 2, name: 'Vận hành hệ thống' },
	{ id: 3, name: 'Ngoại ngữ' },
]

const initialState: State = { list: [], loading: false }

export const getSubjects = createAsyncThunk<SubjectRow[]>('subject/getSubjects', async () => {
	await new Promise((r) => setTimeout(r, 180))
	return MOCK
})

const subjectSlice = createSlice({
	name: 'subject',
	initialState,
	reducers: {},
	extraReducers: (b) => {
		b.addCase(getSubjects.pending, (s) => {
			s.loading = true
		})
			.addCase(getSubjects.fulfilled, (s, a) => {
				s.loading = false
				s.list = a.payload
			})
			.addCase(getSubjects.rejected, (s) => {
				s.loading = false
			})
	},
})

export default subjectSlice.reducer
