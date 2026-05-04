import { configureStore } from '@reduxjs/toolkit'
import { tasksReducer, tasksSlice } from '@/features/todolists/model/slices/tasks-slice'
import { todolistsReducer, todolistsSlice } from '@/features/todolists/model/slices/todolists-slice'
import { appReducer, appSlice } from '@/app/model/app-slice'
import { authReducer, authSlice } from '@/features/auth/model/slices/auth-slice'

export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
    [authSlice.name]: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
