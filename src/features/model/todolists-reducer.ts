import type { FilterValues, Todolist } from '@/app/App'
import { v1 } from 'uuid'

export const deleteTodolistAC = (payload: { todolistId: Todolist['id'] }) =>
  ({
    type: 'todolists/deleteTodolist',
    payload,
  }) as const

export const createTodolistAC = (title: Todolist['title']) => {
  const newTodolist: Todolist = { id: v1(), title, filter: 'all' }
  return {
    type: 'todolists/createTodolist',
    payload: newTodolist,
  } as const
}

export const changeTodolistAC = (payload: { id: Todolist['id']; title?: Todolist['title']; filter?: FilterValues }) =>
  ({
    type: 'todolists/changeTodolist',
    payload,
  }) as const

export const todolistsReducer = (state: Todolist[] = [], action: Actions): Todolist[] => {
  switch (action.type) {
    case 'todolists/deleteTodolist': {
      return state.filter((t) => t.id !== action.payload.todolistId)
    }
    case 'todolists/createTodolist': {
      return [action.payload, ...state]
    }
    case 'todolists/changeTodolist': {
      const { id, ...changes } = action.payload
      return state.map((t) => (t.id === id ? { ...t, ...changes } : t))
    }
    default: {
      return state
    }
  }
}

type Actions = DeleteTodolistAction | CreateTodolistAction | ChangeTodolistAction

export type DeleteTodolistAction = ReturnType<typeof deleteTodolistAC>
export type CreateTodolistAction = ReturnType<typeof createTodolistAC>
type ChangeTodolistAction = ReturnType<typeof changeTodolistAC>
