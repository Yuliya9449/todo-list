import * as z from 'zod'
import { domainTaskSchema } from '@/features/todolists/lib/schemas'
import { createResponseSchema } from '@/common/types'

export const getTasksResponseSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.int().nonnegative(),
  items: domainTaskSchema.array(),
})

export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>

export const responseWithItemTaskSchema = createResponseSchema(z.object({ item: domainTaskSchema }))

export type ResponseWithItemTask = z.infer<typeof responseWithItemTaskSchema>

export const updateTaskModelSchema = domainTaskSchema.pick({
  description: true,
  title: true,
  status: true,
  priority: true,
  startDate: true,
  deadline: true,
})

export type UpdateTaskModel = z.infer<typeof updateTaskModelSchema>

export type DomainTask = z.infer<typeof domainTaskSchema>
