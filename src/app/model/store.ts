import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { tasksReducer, tasksSlice } from '@/features/todolists/model/slices/tasks-slice'
import { todolistsReducer, todolistsSlice } from '@/features/todolists/model/slices/todolists-slice'
import { appReducer, appSlice } from '@/app/model/app-slice'
import { authReducer, authSlice } from '@/features/auth/model/slices/auth-slice'
import { todolistsApi } from '@/features/todolists/api/todolistsApi'

export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    [authSlice.name]: authReducer,
    [todolistsApi.reducerPath]: todolistsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todolistsApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
