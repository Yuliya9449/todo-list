import type { TasksState } from '@/app/App'
import type { DomainTodolist } from '@/features/todolists/model/todolists-slice'
import { createTodolistTC, deleteTodolistTC } from '@/features/todolists/model/todolists-slice'
import { tasksApi } from '@/features/todolists/api/tasksApi'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { createAppSlice } from '@/common/utils'

export const tasksSlice = createAppSlice({
  name: 'tasksReducer',
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (sliceState) => sliceState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (todolistId: DomainTodolist['id'], { rejectWithValue }) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const { todolistId, tasks } = action.payload
          state[todolistId] = tasks
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (
        arg: {
          todolistId: DomainTodolist['id']
          title: DomainTask['title']
        },
        { rejectWithValue },
      ) => {
        try {
          const res = await tasksApi.createTask(arg)
          return res.data.data.item
        } catch {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTask = action.payload
          const todolist = state[newTask.todoListId]
          if (todolist) {
            todolist.unshift(newTask)
          }
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (
        arg: {
          todolistId: DomainTodolist['id']
          taskId: DomainTask['id']
        },
        { rejectWithValue },
      ) => {
        try {
          await tasksApi.deleteTask(arg)
          return arg
        } catch {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const { todolistId, taskId } = action.payload
          const todolist = state[todolistId]
          if (!todolist) {
            return
          }

          const index = todolist.findIndex((t) => t.id === taskId)
          if (index !== -1) {
            state[todolistId].splice(index, 1)
          }
        },
      },
    ),
    changeTaskTC: create.asyncThunk(
      async (updatedTask: DomainTask, { rejectWithValue }) => {
        try {
          const res = await tasksApi.updateTask(updatedTask)
          return res.data.data.item
        } catch {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const updatedTask = action.payload
          const todolist = state[updatedTask.todoListId]
          if (!todolist) {
            return
          }
          const taskIndex = todolist.findIndex((task) => task.id === updatedTask.id)
          if (taskIndex !== -1) {
            todolist[taskIndex] = updatedTask
          }
        },
      },
    ),
  }),
})

export const { fetchTodolistsTC, createTaskTC, deleteTaskTC, changeTaskTC } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer
