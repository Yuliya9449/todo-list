import type { ResponseWithItemTodolist, Todolist } from '@/features/todolists/api/todolistsApi.types'
import type { ResponseWithEmptyObject } from '@/common/types'
import { baseApi } from '@/app/api/baseApi'
import type { DomainTodolist } from '@/features/todolists/lib/types'

const applyOptimisticUpdate = async (
  { dispatch, queryFulfilled }: any,
  callback: (draftTodolists: DomainTodolist[]) => void,
) => {
  const patchResult = dispatch(todolistsApi.util.updateQueryData('getTodolists', undefined, callback))
  try {
    await queryFulfilled
  } catch {
    patchResult.undo()
  }
}

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => '/todo-lists',
      transformResponse: (todolists: Todolist[]) => {
        return todolists.map((t) => ({ ...t, filter: 'all', isDisabled: false }))
      },
      providesTags: (result) => {
        return result ? [...result.map((t) => ({ type: 'Todolist' as const, id: t.id })), 'Todolist'] : ['Todolist']
      },
    }),
    addTodolist: build.mutation<ResponseWithItemTodolist, Todolist['title']>({
      query: (title) => ({
        method: 'post',
        url: '/todo-lists',
        body: { title },
      }),
      invalidatesTags: ['Todolist'],
    }),
    deleteTodolist: build.mutation<ResponseWithEmptyObject, DomainTodolist['id']>({
      query: (id) => ({
        method: 'delete',
        url: `/todo-lists/${id}`,
      }),
      onQueryStarted: (id, mutationLifeCycleApi) => {
        return applyOptimisticUpdate(mutationLifeCycleApi, (draftTodolists) => {
          const todolistIndex = draftTodolists.findIndex((todolist) => todolist.id === id)
          if (todolistIndex !== -1) {
            draftTodolists.splice(todolistIndex, 1)
          }
        })
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Todolist', id }],
    }),
    changeTodolistTitle: build.mutation<
      ResponseWithEmptyObject,
      { id: DomainTodolist['id']; title: DomainTodolist['title'] }
    >({
      query: ({ id, title }) => ({
        method: 'put',
        url: `/todo-lists/${id}`,
        body: { title },
      }),
      onQueryStarted: ({ id, title }, mutationLifeCycleApi) => {
        return applyOptimisticUpdate(mutationLifeCycleApi, (draftTodolists) => {
          const todolist = draftTodolists.find((t) => t.id === id)
          if (todolist) {
            todolist.title = title
          }
        })
      },
      // invalidatesTags: ['Todolist'],
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Todolist' as const, id }],
    }),
    reorderTodolist: build.mutation<
      ResponseWithEmptyObject,
      {
        id: DomainTodolist['id']
        newOrder: DomainTodolist[]
        body: { putAfterItemId: string | null }
      }
    >({
      query: ({ id, body }) => ({
        method: 'put',
        url: `/todo-lists/${id}/reorder`,
        body,
      }),
      onQueryStarted: ({ newOrder }, mutationLifeCycleApi) => {
        return applyOptimisticUpdate(mutationLifeCycleApi, (_draftTodolists) => {
          return newOrder
        })
      },
      invalidatesTags: ['Todolist'],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
  useReorderTodolistMutation,
} = todolistsApi
