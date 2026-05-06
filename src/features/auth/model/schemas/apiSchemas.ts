import { createResponseSchema } from '@/common/types'
import * as z from 'zod'

export const loginResponseSchema = createResponseSchema(z.object({ userId: z.number(), token: z.string() }))
export const meResponseSchema = createResponseSchema(
  z.object({
    id: z.number(),
    email: z.email(),
    login: z.string(),
  }),
)
