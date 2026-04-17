import type { DomainTodolist } from '@/features/todolists/model/todolists-slice'
import { createTodolistTC, deleteTodolistTC } from '@/features/todolists/model/todolists-slice'
import { tasksApi } from '@/features/todolists/api/tasksApi'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { createAppSlice } from '@/common/utils'
import { setRequestStatusAC } from '@/app/model/app-slice'

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
      async (todolistId: DomainTodolist['id'], { dispatch, rejectWithValue }) => {
        try {
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          const res = await tasksApi.getTasks(todolistId)
          dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
          return { todolistId, tasks: res.data.items }
        } catch {
          dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
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
        { dispatch, rejectWithValue },
      ) => {
        try {
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          const res = await tasksApi.createTask(arg)
          dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
          return res.data.data.item
        } catch {
          dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
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
        { dispatch, rejectWithValue },
      ) => {
        try {
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          await tasksApi.deleteTask(arg)
          dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
          return arg
        } catch {
          dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
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
      async (updatedTask: DomainTask, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          const res = await tasksApi.updateTask(updatedTask)
          dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
          return res.data.data.item
        } catch {
          dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
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

export type TasksState = Record<DomainTodolist['id'], DomainTask[]>
