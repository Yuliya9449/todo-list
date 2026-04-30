import * as z from 'zod'
import { createResponseSchema } from '@/common/types'

export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.iso.datetime({ local: true }),
  order: z.int(),
})

export const responseWithItemTodolistSchema = createResponseSchema(z.object({ item: todolistSchema }))

export type Todolist = z.infer<typeof todolistSchema>
export type ResponseWithItemTodolist = z.infer<typeof responseWithItemTodolistSchema>
