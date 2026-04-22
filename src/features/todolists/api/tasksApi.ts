import { instance } from '@/common/instance/instance'
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from '@/features/todolists/api/tasksApi.types'
import type { DomainTodolist } from '@/features/todolists/model/todolists-slice'
import type { s } from '@/common/types'

export const tasksApi = {
  getTasks(todolistId: DomainTodolist['id']) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { todolistId: DomainTodolist['id']; title: DomainTask['title'] }) {
    const { todolistId, title } = payload
    return instance.post<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(payload: { todolistId: DomainTodolist['id']; taskId: DomainTask['id'] }) {
    const { todolistId, taskId } = payload
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
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

    return instance.put<
      BaseResponse<{
        item: DomainTask
      }>
    >(`/todo-lists/${updatedTask.todoListId}/tasks/${updatedTask.id}`, model)
  },
}
