import type { Todolist } from '@/features/todolists/api/todolistsApi.types'
import { createAppSlice, handleCatchError, handleStatusCodeError } from '@/common/utils'
import { todolistsApi } from '@/features/todolists/api/todolistsApi'
import { setRequestStatusAC } from '@/app/model/app-slice'
import { ResultCode } from '@/common/enums'

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
          const { data } = await todolistsApi.getTodolists()
          dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
          return data
        } catch (error) {
          handleCatchError({ error, dispatch })
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (_, action) => {
          return action.payload.map((t) => ({ ...t, filter: 'all', isDisabled: false }))
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: DomainTodolist['title'], { dispatch, rejectWithValue }) => {
        try {
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          const { data } = await todolistsApi.createTodolist(title)

          if (data.resultCode === ResultCode.Success) {
            dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
            return { todolist: data.data.item }
          } else {
            handleStatusCodeError({ data, dispatch })
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError({ error, dispatch })
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: 'all', isDisabled: false })
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (arg: { id: DomainTodolist['id'] }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setTodolistIsDisabledAC({ id: arg.id, isDisabled: true }))
          dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
          const { data } = await todolistsApi.deleteTodolist(arg.id)

          if (data.resultCode === ResultCode.Success) {
            dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
            return arg
          } else {
            dispatch(setTodolistIsDisabledAC({ id: arg.id, isDisabled: false }))
            handleStatusCodeError({ data, dispatch })
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError({ error, dispatch })
          dispatch(setTodolistIsDisabledAC({ id: arg.id, isDisabled: false }))
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
          const { data } = await todolistsApi.changeTodolistTitle(arg)

          if (data.resultCode === ResultCode.Success) {
            dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
            return arg
          } else {
            handleStatusCodeError({ data, dispatch })
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError({ error, dispatch })
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
    setTodolistIsDisabledAC: create.reducer<{ id: string; isDisabled: boolean }>((state, action) => {
      const { id, isDisabled } = action.payload
      const todolist = state.find((t) => t.id === id)
      if (todolist) {
        todolist.isDisabled = isDisabled
      }
    }),
  }),
})

export const {
  fetchTodolistsTC,
  createTodolistTC,
  deleteTodolistTC,
  changeTodolistTitleTC,
  changeTodolistFilterAC,
  setTodolistIsDisabledAC,
} = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
  isDisabled: boolean
}

export type FilterValues = 'all' | 'active' | 'completed'
