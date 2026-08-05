import {
  type DomainTask,
  type GetTasksResponse,
  getTasksResponseSchema,
  responseWithItemTaskSchema,
  type UpdateTaskModel,
} from '@/features/todolists/api/tasksApi.types'
import { responseWithEmptyObjectSchema } from '@/common/types'
import { baseApi } from '@/app/api/baseApi'
import { type DomainTodolist } from '@/features/todolists/lib/types'
import { PAGE_SIZE } from '@/common/constants'
import { withZodValidator } from '@/common/utils'

const applyOptimisticUpdate = async (
  todolistId: string,
  { getState, dispatch, queryFulfilled }: any, // MutationLifecycleApi, RTK Query не экспортирует type MutationLifecycleApi
  callback: (draft: GetTasksResponse) => void,
) => {
  const cachedArgs = tasksApi.util.selectCachedArgsForQuery(getState(), 'getTasks')
  const relevantArgs = cachedArgs.filter((arg) => arg.todolistId === todolistId)
  const createPatchResult = (arg: {
    todolistId: DomainTodolist['id']
    params: {
      page: number
    }
  }) => dispatch(tasksApi.util.updateQueryData('getTasks', arg, callback))

  const patchResults = relevantArgs.map((arg) => createPatchResult(arg))

  try {
    await queryFulfilled
    // todo any
  } catch (error: any) {
    if (error?.error?.status === 'CUSTOM_ERROR') {
      console.warn('Zod validation failed, but server succeeded. Skipping undo.')
      return // НЕ делаем откат, так как сервер всё удалил/создал успешно
    }
    patchResults.forEach((p) => p.undo())
  }
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query({
      query: ({ todolistId, params }: { todolistId: DomainTodolist['id']; params: { page: number } }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        params: { ...params, count: PAGE_SIZE },
      }),
      ...withZodValidator(getTasksResponseSchema),
      providesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id: todolistId }, 'Task'],
      keepUnusedDataFor: 30,
    }),
    createTask: build.mutation({
      query: ({ todolistId, title }: { todolistId: DomainTodolist['id']; title: DomainTask['title'] }) => ({
        method: 'post',
        url: `/todo-lists/${todolistId}/tasks`,
        body: { title },
      }),
      ...withZodValidator(responseWithItemTaskSchema),
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id: todolistId }],
    }),
    deleteTask: build.mutation({
      query: ({ todolistId, taskId }: { todolistId: DomainTodolist['id']; taskId: DomainTask['id'] }) => {
        return {
          method: 'delete',
          url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        }
      },
      onQueryStarted: ({ todolistId, taskId }, mutationLifeCycleApi) => {
        return applyOptimisticUpdate(todolistId, mutationLifeCycleApi, (draft) => {
          const index = draft.items.findIndex((task) => task.id === taskId)
          if (index !== -1) {
            draft.items.splice(index, 1)
          }
        })
      },
      ...withZodValidator(responseWithEmptyObjectSchema),
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id: todolistId }],
    }),
    updateTask: build.mutation({
      query: (updatedTask: DomainTask) => {
        const model: UpdateTaskModel = {
          description: updatedTask.description,
          status: updatedTask.status,
          title: updatedTask.title,
          priority: updatedTask.priority,
          startDate: updatedTask.startDate,
          deadline: updatedTask.deadline,
        }
        return {
          method: 'put',
          url: `/todo-lists/${updatedTask.todoListId}/tasks/${updatedTask.id}`,
          body: model,
        }
      },
      onQueryStarted: (updatedTask, mutationLifeCycleApi) => {
        const { todoListId, id } = updatedTask
        return applyOptimisticUpdate(todoListId, mutationLifeCycleApi, (draft) => {
          const index = draft.items.findIndex((task) => task.id === id)
          if (index !== -1) {
            Object.assign(draft.items[index], updatedTask)
            // draft.items[index] = { ...updatedTask }
          }
        })
      },
      ...withZodValidator(responseWithItemTaskSchema),
      invalidatesTags: (_res, _err, { todoListId }) => [{ type: 'Task', id: todoListId }],
    }),
    reorderTask: build.mutation({
      query: ({
        todolistId,
        taskId,
        body,
      }: {
        todolistId: DomainTodolist['id']
        taskId: DomainTask['id']
        newOrder: DomainTask[]
        body: { putAfterItemId: string | null }
      }) => {
        return {
          method: 'put',
          url: `/todo-lists/${todolistId}/tasks/${taskId}/reorder`,
          body,
        }
      },
      onQueryStarted: ({ todolistId, newOrder }, mutationLifeCycleApi) => {
        return applyOptimisticUpdate(todolistId, mutationLifeCycleApi, (draftTasks) => {
          draftTasks.items = newOrder
        })
      },
      ...withZodValidator(responseWithEmptyObjectSchema),
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id: todolistId }],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useReorderTaskMutation,
} = tasksApi
