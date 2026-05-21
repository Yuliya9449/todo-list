import { instance } from '@/common/instance'
import type { ResponseWithItemTodolist, Todolist } from '@/features/todolists/api/todolistsApi.types'
import type { ResponseWithEmptyObject } from '@/common/types'
import { baseApi } from '@/app/api/baseApi'
import type { DomainTodolist } from '@/features/todolists/lib/types'

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => '/todo-lists',
      transformResponse: (todolists: Todolist[]) => {
        return todolists.map((t) => ({ ...t, filter: 'all', isDisabled: false }))
      },
      providesTags: ['Todolist'],
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
      invalidatesTags: ['Todolist'],
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
      invalidatesTags: ['Todolist'],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
} = todolistsApi

export const _todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>('/todo-lists')
  },
  createTodolist(title: Todolist['title']) {
    return instance.post<ResponseWithItemTodolist>('/todo-lists', { title })
  },
  deleteTodolist(id: DomainTodolist['id']) {
    return instance.delete<ResponseWithEmptyObject>(`/todo-lists/${id}`)
  },
  changeTodolistTitle(payload: { id: DomainTodolist['id']; title: DomainTodolist['title'] }) {
    const { title, id } = payload
    return instance.put<ResponseWithEmptyObject>(`/todo-lists/${id}`, { title })
  },
}
