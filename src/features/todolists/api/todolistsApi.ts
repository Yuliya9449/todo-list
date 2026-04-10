import { instance } from '@/common/instance/instance'
import type { BaseResponse, Todolist } from '@/features/todolists/api/todolistsApi.types'

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>('/todo-lists')
  },
  createTodolist(title: Todolist['title']) {
    return instance.post<BaseResponse<Todolist>>('/todo-lists', { title })
  },
}
