import type { Task, TasksState, Todolist } from '@/app/App'
import { createTodolistAC, deleteTodolistAC } from '@/features/todolists/model/todolists-reducer'
import { createAction, createReducer, nanoid } from '@reduxjs/toolkit'

export const deleteTaskAC = createAction<{ todolistId: Todolist['id']; taskId: Task['id'] }>('tasks/deleteTask')

export const createTaskAC = createAction(
  'tasks/createTask',
  (payload: { todolistId: Todolist['id']; title: Task['title'] }) => {
    const { todolistId } = payload
    const newTask: Task = { id: nanoid(), title: payload.title, isDone: false }
    return {
      payload: { todolistId, newTask },
    }
  },
)

export const changeTaskAC = createAction<{
  todolistId: Todolist['id']
  taskId: Task['id']
  title?: Task['title']
  isDone?: Task['isDone']
}>('tasks/changeTask')

export const tasksReducer = createReducer(
  {
    todolistId1: [
      { id: '1', title: 'CSS', isDone: false },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
    ],
    todolistId2: [
      { id: '1', title: 'bread', isDone: false },
      { id: '2', title: 'milk', isDone: true },
      { id: '3', title: 'tea', isDone: false },
    ],
  } as TasksState,
  (builder) => {
    builder
      .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(createTodolistAC, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTaskAC, (state, action) => {
        const { todolistId, taskId } = action.payload
        const todolist = state[todolistId]
        if (!todolist) {
          return
        }

        const index = todolist.findIndex((t) => t.id === taskId)
        if (index !== -1) {
          state[todolistId].splice(index, 1)
        }
      })
      .addCase(createTaskAC, (state, action) => {
        const todolist = state[action.payload.todolistId]
        if (todolist) {
          todolist.unshift(action.payload.newTask)
        }
      })
      .addCase(changeTaskAC, (state, action) => {
        const { todolistId, taskId, ...changes } = action.payload
        const todolist = state[todolistId]
        if (!todolist) {
          return
        }
        const task = todolist.find((t) => t.id === taskId)
        if (task) {
          Object.assign(task, changes)
        }
      })
  },
)
