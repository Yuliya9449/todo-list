import * as z from 'zod'
import { TaskPriority, TaskStatus } from '@/common/enums'

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.iso.datetime({ local: true }).nullable(),
  deadline: z.iso.datetime({ local: true }).nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.int(),
  addedDate: z.string(),
})
