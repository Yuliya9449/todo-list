import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { tasksReducer, tasksSlice } from '@/features/todolists/model/slices/tasks-slice'
import { todolistsReducer, todolistsSlice } from '@/features/todolists/model/slices/todolists-slice'
import { appReducer, appSlice } from '@/app/model/app-slice'
import { baseApi } from '@/app/api/baseApi'

export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  // devTools: process.env.NODE_ENV !== 'production' чтобы скрыть REDUX devTools
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
