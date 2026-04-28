import { TaskPriority, TaskStatus } from '@/common/enums'
import * as z from 'zod'
import { domainTaskSchema } from '@/features/todolists/model/schemas'

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
}

export type UpdateTaskModel = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}

export type DomainTask = z.infer<typeof domainTaskSchema>
