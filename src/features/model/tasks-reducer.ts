import type { Task, TasksState, Todolist } from '@/app/App'
import { type CreateTodolistAction, type DeleteTodolistAction } from '@/features/model/todolists-reducer'
import { v1 } from 'uuid'

export const deleteTaskAC = (payload: { todolistId: Todolist['id']; taskId: Task['id'] }) =>
  ({
    type: 'tasks/deleteTask',
    payload,
  }) as const

export const createTaskAC = (payload: { todolistId: Todolist['id']; title: Task['title'] }) => {
  const newTask = { id: v1(), title: payload.title, isDone: false }
  return {
    type: 'tasks/createTask',
    payload: { todolistId: payload.todolistId, newTask },
  } as const
}

export const changeTaskAC = (payload: {
  todolistId: Todolist['id']
  taskId: Task['id']
  title?: Task['title']
  isDone?: Task['isDone']
}) => {
  return {
    type: 'tasks/changeTask',
    payload,
  } as const
}

export const tasksReducer = (state: TasksState = {}, action: Actions) => {
  switch (action.type) {
    case 'todolists/createTodolist': {
      return { ...state, [action.payload.id]: [] }
    }
    case 'todolists/deleteTodolist': {
      const { [action.payload.todolistId]: _, ...newState } = state
      return newState
    }
    case 'tasks/deleteTask': {
      if (!state[action.payload.todolistId]) {
        return state
      }
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter((t) => t.id !== action.payload.taskId),
      }
    }
    case 'tasks/createTask': {
      if (!state[action.payload.todolistId]) {
        return state
      }
      return { ...state, [action.payload.todolistId]: [action.payload.newTask, ...state[action.payload.todolistId]] }
    }
    case 'tasks/changeTask': {
      const { todolistId, taskId, ...changes } = action.payload
      if (!state[todolistId]) {
        return state
      }
      return { ...state, [todolistId]: state[todolistId].map((t) => (t.id === taskId ? { ...t, ...changes } : t)) }
    }
    default: {
      return state
    }
  }
}

type Actions = CreateTodolistAction | DeleteTodolistAction | DeleteTaskAction | CreateTaskAction | ChangeTaskAction

type DeleteTaskAction = ReturnType<typeof deleteTaskAC>
type CreateTaskAction = ReturnType<typeof createTaskAC>
type ChangeTaskAction = ReturnType<typeof changeTaskAC>
