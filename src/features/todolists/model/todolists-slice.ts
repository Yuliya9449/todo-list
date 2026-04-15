import type { FilterValues } from '@/app/App'
import type { Todolist } from '@/features/todolists/api/todolistsApi.types'
import { createAppSlice } from '@/common/utils'
import { todolistsApi } from '@/features/todolists/api/todolistsApi'

export const todolistsSlice = createAppSlice({
  name: 'todolists',
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (sliceState): DomainTodolist[] => sliceState,
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const res = await todolistsApi.getTodolists()
          return res.data
        } catch {
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
      async (title: DomainTodolist['title'], { rejectWithValue }) => {
        try {
          const res = await todolistsApi.createTodolist(title)
          return { todolist: res.data.data.item }
        } catch {
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
      async (arg: { id: DomainTodolist['id'] }, { rejectWithValue }) => {
        try {
          await todolistsApi.deleteTodolist(arg.id)
          return arg
        } catch {
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
      async (arg: { id: DomainTodolist['id']; title: DomainTodolist['title'] }, { rejectWithValue }) => {
        try {
          await todolistsApi.changeTodolistTitle(arg)
          return arg
        } catch {
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

    // TODO: этот для changeTodolistFilter, нужно будет переименовать

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
