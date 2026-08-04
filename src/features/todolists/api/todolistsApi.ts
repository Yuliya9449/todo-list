import {
  responseWithItemTodolistSchema,
  type Todolist,
  todolistSchema,
} from '@/features/todolists/api/todolistsApi.types'
import { responseWithEmptyObjectSchema } from '@/common/types'
import { baseApi } from '@/app/api/baseApi'
import { type DomainTodolist, domainTodolistSchema } from '@/features/todolists/lib/types'
import { withZodValidator } from '@/common/utils'
import * as z from 'zod'

const applyOptimisticUpdate = async (
  { dispatch, queryFulfilled }: any,
  callback: (draftTodolists: DomainTodolist[]) => void,
) => {
  const patchResult = dispatch(todolistsApi.util.updateQueryData('getTodolists', undefined, callback))
  try {
    await queryFulfilled
    // todo any
  } catch (error: any) {
    if (error?.error?.status === 'CUSTOM_ERROR') {
      console.warn('Zod validation failed, but server succeeded. Skipping undo.')
      return // НЕ делаем откат, так как сервер всё удалил/создал успешно
    }
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
      rawResponseSchema: z.array(todolistSchema),
      ...withZodValidator(z.array(domainTodolistSchema)),
      providesTags: (result) => {
        return result ? [...result.map((t) => ({ type: 'Todolist' as const, id: t.id })), 'Todolist'] : ['Todolist']
      },
    }),
    addTodolist: build.mutation({
      query: (title: Todolist['title']) => ({
        method: 'post',
        url: '/todo-lists',
        body: { title },
      }),
      ...withZodValidator(responseWithItemTodolistSchema),
      invalidatesTags: ['Todolist'],
    }),
    deleteTodolist: build.mutation({
      query: (id: DomainTodolist['id']) => ({
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
      ...withZodValidator(responseWithEmptyObjectSchema),
      invalidatesTags: (_result, _error, id) => [{ type: 'Todolist', id }],
    }),
    changeTodolistTitle: build.mutation({
      query: ({ id, title }: { id: DomainTodolist['id']; title: DomainTodolist['title'] }) => ({
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
      ...withZodValidator(responseWithEmptyObjectSchema),
      // invalidatesTags: ['Todolist'],
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Todolist' as const, id }],
    }),
    reorderTodolist: build.mutation({
      query: ({
        id,
        body,
      }: {
        id: DomainTodolist['id']
        newOrder: DomainTodolist[]
        body: { putAfterItemId: string | null }
      }) => ({
        method: 'put',
        url: `/todo-lists/${id}/reorder`,
        body,
      }),
      onQueryStarted: ({ newOrder }, mutationLifeCycleApi) => {
        return applyOptimisticUpdate(mutationLifeCycleApi, (_draftTodolists) => {
          return newOrder
        })
      },
      ...withZodValidator(responseWithEmptyObjectSchema),
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
