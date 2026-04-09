import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { tasksReducer, tasksSlice } from '@/features/todolists/model/tasks-slice'
import { todolistsReducer, todolistsSlice } from '@/features/todolists/model/todolists-slice'
import { appReducer, appSlice } from '@/app/model/app-slice'

const rootReducer = combineReducers({
  [tasksSlice.name]: tasksReducer,
  [todolistsSlice.name]: todolistsReducer,
  [appSlice.name]: appReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
