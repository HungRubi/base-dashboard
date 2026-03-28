import { configureStore } from '@reduxjs/toolkit'
import { injectDocumentApiStore } from '../api/documentApi'
import appReducer from './slices/appSlice'
import authReducer from './slices/authSlice'
import categoryReducer from './slices/categorySlice'
import documentReducer from './slices/documentSlice'
import subjectReducer from './slices/subjectSlice'
import technologyReducer from './slices/technologySlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    category: categoryReducer,
    subject: subjectReducer,
    technology: technologyReducer,
    document: documentReducer,
  },
})

injectDocumentApiStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
