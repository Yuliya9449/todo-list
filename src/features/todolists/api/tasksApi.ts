import type {
  DomainTask,
  GetTasksResponse,
  ResponseWithItemTask,
  UpdateTaskModel,
} from '@/features/todolists/api/tasksApi.types'
import type { ResponseWithEmptyObject } from '@/common/types'
import { baseApi } from '@/app/api/baseApi'
import type { DomainTodolist } from '@/features/todolists/lib/types'

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, DomainTodolist['id']>({
      query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
      providesTags: (_res, _err, todolistId) => [{ type: 'Task', id: todolistId }],
    }),
    createTask: build.mutation<ResponseWithItemTask, { todolistId: DomainTodolist['id']; title: DomainTask['title'] }>({
      query: ({ todolistId, title }) => {
        return {
          method: 'post',
          url: `/todo-lists/${todolistId}/tasks`,
          body: { title },
        }
      },
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id: todolistId }],
    }),
    deleteTask: build.mutation<
      ResponseWithEmptyObject,
      {
        todolistId: DomainTodolist['id']
        taskId: DomainTask['id']
      }
    >({
      query: ({ todolistId, taskId }) => {
        return {
          method: 'delete',
          url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        }
      },
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id: todolistId }],
    }),
    updateTask: build.mutation<ResponseWithItemTask, DomainTask>({
      query: (updatedTask) => {
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
      invalidatesTags: (_res, _err, { todoListId }) => [{ type: 'Task', id: todoListId }],
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi
