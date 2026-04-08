import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { tasksReducer } from '@/features/todolists/model/tasks-reducer'
import { todolistsReducer } from '@/features/todolists/model/todolists-slice'
import { appReducer, appSlice } from '@/app/model/app-slice'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  [appSlice.name]: appReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
