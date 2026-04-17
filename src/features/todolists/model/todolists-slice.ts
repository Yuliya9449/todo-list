import type { Todolist } from '@/features/todolists/api/todolistsApi.types'
import { createAppSlice } from '@/common/utils'
import { todolistsApi } from '@/features/todolists/api/todolistsApi'
import { setRequestStatusAC } from '@/app/model/app-slice'

export const todolistsSlice = createAppSlice({
  name: 'todolists',
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (sliceState): DomainTodolist[] => sliceState,
  },
  reducers: (create) => ({
    // thunks
    fetchTodolistsTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          const res = await todolistsApi.getTodolists()
          dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
          return res.data
        } catch {
          dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (_, action) => {
          return action.payload.map((t) => ({ ...t, filter: 'all' }))
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: DomainTodolist['title'], { dispatch, rejectWithValue }) => {
        try {
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          const res = await todolistsApi.createTodolist(title)
          dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
          return { todolist: res.data.data.item }
        } catch {
          dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: 'all' })
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (arg: { id: DomainTodolist['id'] }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          await todolistsApi.deleteTodolist(arg.id)
          dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
          return arg
        } catch {
          dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((t) => t.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (arg: { id: DomainTodolist['id']; title: DomainTodolist['title'] }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          await todolistsApi.changeTodolistTitle(arg)
          dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
          return arg
        } catch {
          dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const { id, title } = action.payload
          const todolist = state.find((t) => t.id === id)
          if (todolist) {
            todolist.title = title
          }
        },
      },
    ),

    // actions
    changeTodolistFilterAC: create.reducer<{
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

export const { changeTodolistFilterAC, fetchTodolistsTC, createTodolistTC, deleteTodolistTC, changeTodolistTitleTC } =
  todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = 'all' | 'active' | 'completed'
