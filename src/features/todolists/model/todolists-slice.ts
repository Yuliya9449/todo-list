import type { FilterValues, Todolist } from '@/app/App'
import { createSlice, nanoid } from '@reduxjs/toolkit'

export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [
    { id: 'todolistId1', title: 'What to learn', filter: 'all' },
    { id: 'todolistId2', title: 'What to buy', filter: 'all' },
  ] as Todolist[],
  selectors: {
    selectTodolists: (sliceState): Todolist[] => sliceState,
  },
  reducers: (create) => ({
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

export const { deleteTodolistAC, createTodolistAC, changeTodolistAC } = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer
