import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type TechnologyRow = {
	id: string
	name: string
}

type State = { list: TechnologyRow[]; loading: boolean }

const MOCK: TechnologyRow[] = [
	{ id: 'tech_1', name: 'React' },
	{ id: 'tech_2', name: 'TypeScript' },
	{ id: 'tech_3', name: 'Node.js' },
	{ id: 'tech_4', name: 'PostgreSQL' },
]

const initialState: State = { list: [], loading: false }

export const getTechnologies = createAsyncThunk<TechnologyRow[]>('technology/getTechnologies', async () => {
	await new Promise((r) => setTimeout(r, 160))
	return MOCK
})

const technologySlice = createSlice({
	name: 'technology',
	initialState,
	reducers: {},
	extraReducers: (b) => {
		b.addCase(getTechnologies.pending, (s) => {
			s.loading = true
		})
			.addCase(getTechnologies.fulfilled, (s, a) => {
				s.loading = false
				s.list = a.payload
			})
			.addCase(getTechnologies.rejected, (s) => {
				s.loading = false
			})
	},
})

export default technologySlice.reducer
