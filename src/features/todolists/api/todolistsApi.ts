import { instance } from '@/common/instance/instance'
import type { Todolist } from '@/features/todolists/api/todolistsApi.types'
import type { DomainTodolist } from '@/features/todolists/model/todolists-slice'
import type { BaseResponse } from '@/common/types'

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>('/todo-lists')
  },
  createTodolist(title: Todolist['title']) {
    return instance.post<BaseResponse<{ item: Todolist }>>('/todo-lists', { title })
  },
  deleteTodolist(id: DomainTodolist['title']) {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
    // return instance.delete<BaseResponse>(`/todo-lists/${todolistId}`)
  },
  changeTodolistTitle(payload: { id: DomainTodolist['id']; title: DomainTodolist['title'] }) {
    const { title, id } = payload
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
  },
}
