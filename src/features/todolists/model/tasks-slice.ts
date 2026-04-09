import type { Task, TasksState, Todolist } from '@/app/App'
import { createTodolistAC, deleteTodolistAC } from '@/features/todolists/model/todolists-slice'
import { createSlice, nanoid } from '@reduxjs/toolkit'

export const tasksSlice = createSlice({
  name: 'tasksReducer',
  initialState: {
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
  selectors: {
    selectTasks: (sliceState) => sliceState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(createTodolistAC, (state, action) => {
        state[action.payload.id] = []
      })
  },
  reducers: (create) => ({
    deleteTaskAC: create.reducer<{ todolistId: Todolist['id']; taskId: Task['id'] }>((state, action) => {
      const { todolistId, taskId } = action.payload
      const todolist = state[todolistId]
      if (!todolist) {
        return
      }

      const index = todolist.findIndex((t) => t.id === taskId)
      if (index !== -1) {
        state[todolistId].splice(index, 1)
      }
    }),
    createTaskAC: create.preparedReducer(
      (args: { todolistId: Todolist['id']; title: Task['title'] }) => {
        const newTask: Task = { id: nanoid(), title: args.title, isDone: false }
        return {
          payload: { todolistId: args.todolistId, newTask },
        }
      },
      (state, action) => {
        const todolist = state[action.payload.todolistId]
        if (todolist) {
          todolist.unshift(action.payload.newTask)
        }
      },
    ),
    changeTaskAC: create.reducer<{
      todolistId: Todolist['id']
      taskId: Task['id']
      title?: Task['title']
      isDone?: Task['isDone']
    }>((state, action) => {
      const { todolistId, taskId, ...changes } = action.payload
      const todolist = state[todolistId]
      if (!todolist) {
        return
      }
      const task = todolist.find((t) => t.id === taskId)
      if (task) {
        Object.assign(task, changes)
      }
    }),
  }),
})

export const { deleteTaskAC, createTaskAC, changeTaskAC } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer
