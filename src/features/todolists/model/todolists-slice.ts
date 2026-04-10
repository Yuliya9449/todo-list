import type { FilterValues } from '@/app/App'
import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { DomainTodolist, Todolist } from '@/features/todolists/api/todolistsApi.types'

export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (sliceState): Todolist[] => sliceState,
  },
  reducers: (create) => ({
    setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((_, action) => {
      return action.payload.todolists.map((t) => ({ ...t, filter: 'all' }))
    }),
    deleteTodolistAC: create.reducer<{ todolistId: Todolist['id'] }>((state, action) => {
      const index = state.findIndex((t) => t.id === action.payload.todolistId)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: Todolist['title']) => {
        const newTodolist: Todolist = { id: nanoid(), title, filter: 'all' }
        return {
          payload: newTodolist,
        }
      },
      (state, action) => {
        state.unshift(action.payload)
      },
    ),
    changeTodolistAC: create.reducer<{
      todolistId: Todolist['id']
      title?: Todolist['title']
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

export const { setTodolistsAC, deleteTodolistAC, createTodolistAC, changeTodolistAC, fetchTodolistsTC } =
  todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer
