import type { FilterValues } from '@/app/App'
import { nanoid } from '@reduxjs/toolkit'
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types'
import { createAppSlice } from '@/common/utils'
import { todolistsApi } from '@/features/todolists/api/todolistsApi'

export const todolistsSlice = createAppSlice({
  name: 'todolists',
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (sliceState): DomainTodolist[] => sliceState,
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const res = await todolistsApi.getTodolists()
          return res.data
        } catch {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (_, action) => {
          return action.payload.map((t) => ({ ...t, filter: 'all' }))
        },
      },
    ),
    deleteTodolistAC: create.reducer<{ todolistId: DomainTodolist['id'] }>((state, action) => {
      const index = state.findIndex((t) => t.id === action.payload.todolistId)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: DomainTodolist['title']) => {
        const newTodolist: DomainTodolist = { id: nanoid(), title, filter: 'all' }
        return {
          payload: newTodolist,
        }
      },
      (state, action) => {
        state.unshift(action.payload)
      },
    ),
    changeTodolistAC: create.reducer<{
      todolistId: DomainTodolist['id']
      title?: DomainTodolist['title']
      filter?: FilterValues
    }>((state, action) => {
      const { todolistId, ...changes } = action.payload
      const todolist = state.find((t) => t.id === todolistId)
      if (todolist) {
        Object.assign(todolist, changes)
      }
    }),
  }),
})

export const { deleteTodolistAC, createTodolistAC, changeTodolistAC, fetchTodolistsTC } = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer
