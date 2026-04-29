import { TaskPriority, TaskStatus } from '@/common/enums'
import * as z from 'zod'
import { domainTaskSchema } from '@/features/todolists/model/schemas'
import { createResponseSchema } from '@/common/types'

export const getTasksResponseSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.int().nonnegative(),
  items: domainTaskSchema.array(),
})

export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>

export const responseWithItemTaskSchema = createResponseSchema(z.object({ item: domainTaskSchema }))

export type ResponseWithItemTask = z.infer<typeof responseWithItemTaskSchema>

export type UpdateTaskModel = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}

export type DomainTask = z.infer<typeof domainTaskSchema>
