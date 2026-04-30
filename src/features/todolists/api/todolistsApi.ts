import { instance } from '@/common/instance/instance'
import type { ResponseWithItemTodolist, Todolist } from '@/features/todolists/api/todolistsApi.types'
import type { DomainTodolist } from '@/features/todolists/model/slices/todolists-slice'
import type { ResponseWithEmptyObject } from '@/common/types'

export const todolistsApi = {
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
