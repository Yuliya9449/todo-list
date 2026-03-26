import type { FilterValues, Todolist } from '@/app/App'
import { createAction, createReducer, nanoid } from '@reduxjs/toolkit'

export const deleteTodolistAC = createAction<{ todolistId: Todolist['id'] }>('todolists/deleteTodolist')

export const createTodolistAC = createAction('todolists/createTodolist', (title: Todolist['title']) => {
  const newTodolist: Todolist = { id: nanoid(), title, filter: 'all' }
  return {
    payload: newTodolist,
  }
})

export const changeTodolistAC = createAction<{
  todolistId: Todolist['id']
  title?: Todolist['title']
  filter?: FilterValues
}>('todolists/changeTodolist')

export const todolistsReducer = createReducer([] as Todolist[], (builder) => {
  builder
    .addCase(deleteTodolistAC, (state, action) => {
      const index = state.findIndex((t) => t.id === action.payload.todolistId)
      if (index !== -1) {
        state.splice(index, 1)
      }
    })
    .addCase(createTodolistAC, (state, action) => {
      state.unshift(action.payload)
    })
    .addCase(changeTodolistAC, (state, action) => {
      const { todolistId, ...changes } = action.payload
      const todolist = state.find((t) => t.id === todolistId)
      if (todolist) {
        Object.assign(todolist, changes)
      }
    })
})
