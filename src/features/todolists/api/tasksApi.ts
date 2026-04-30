import { instance } from '@/common/instance/instance'
import type {
  DomainTask,
  GetTasksResponse,
  ResponseWithItemTask,
  UpdateTaskModel,
} from '@/features/todolists/api/tasksApi.types'
import type { DomainTodolist } from '@/features/todolists/model/slices/todolists-slice'
import type { ResponseWithEmptyObject } from '@/common/types'

export const tasksApi = {
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
