import type { Todolist } from '@/features/todolists/api/todolistsApi.types'

export type DomainTodolist = Todolist & {
  filter: FilterValues
  isDisabled: boolean
}

export type FilterValues = 'all' | 'active' | 'completed'
