import { createResponseSchema } from '@/common/types'
import * as z from 'zod'

export const loginResponseSchema = createResponseSchema(z.object({ userId: z.number(), token: z.string() }))
