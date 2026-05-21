import { instance } from '@/common/instance'
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
      providesTags: ['Task'],
    }),
    createTask: build.mutation<ResponseWithItemTask, { todolistId: DomainTodolist['id']; title: DomainTask['title'] }>({
      query: ({ todolistId, title }) => {
        return {
          method: 'post',
          url: `/todo-lists/${todolistId}/tasks`,
          body: { title },
        }
      },
      invalidatesTags: ['Task'],
    }),
    deleteTask: build.mutation<
      ResponseWithEmptyObject,
      {
        todolistId: DomainTodolist['id']
        taskId: DomainTask['id']
      }
    >({
      query: (payload) => {
        const { todolistId, taskId } = payload
        return {
          method: 'delete',
          url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        }
      },
      invalidatesTags: ['Task'],
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
      invalidatesTags: ['Task'],
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi

export const _tasksApi = {
  getTasks(todolistId: DomainTodolist['id']) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { todolistId: DomainTodolist['id']; title: DomainTask['title'] }) {
    const { todolistId, title } = payload
    return instance.post<ResponseWithItemTask>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(payload: { todolistId: DomainTodolist['id']; taskId: DomainTask['id'] }) {
    const { todolistId, taskId } = payload
    return instance.delete<ResponseWithEmptyObject>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask(updatedTask: DomainTask) {
    const model: UpdateTaskModel = {
      description: updatedTask.description,
      status: updatedTask.status,
      title: updatedTask.title,
      priority: updatedTask.priority,
      startDate: updatedTask.startDate,
      deadline: updatedTask.deadline,
    }

    return instance.put<ResponseWithItemTask>(`/todo-lists/${updatedTask.todoListId}/tasks/${updatedTask.id}`, model)
  },
}
