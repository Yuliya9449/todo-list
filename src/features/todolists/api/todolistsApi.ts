import { instance } from '@/common/instance/instance'
import type { Todolist } from '@/features/todolists/api/todolistsApi.types'

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>('/todo-lists')
  },
}
