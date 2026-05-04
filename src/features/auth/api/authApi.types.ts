import * as z from 'zod'
import { loginResponseSchema } from '@/features/auth/model/schemas'

export type LoginResponse = z.infer<typeof loginResponseSchema>
