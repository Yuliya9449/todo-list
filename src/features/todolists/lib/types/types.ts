import * as z from 'zod'
import { todolistSchema } from '@/features/todolists/api/todolistsApi.types'

export const filterValuesSchema = z.literal(['all', 'active', 'completed'])
export type FilterValues = z.infer<typeof filterValuesSchema>

export const domainTodolistSchema = todolistSchema.extend({
  filter: filterValuesSchema,
  isDisabled: z.boolean(),
})

export type DomainTodolist = z.infer<typeof domainTodolistSchema>
