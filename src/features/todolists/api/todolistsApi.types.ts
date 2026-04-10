import type { FilterValues } from '@/app/App'

export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
}

export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<T> = {
  data: T
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
}

export type DomainTodolist = Todolist & {
  filter: FilterValues
}
