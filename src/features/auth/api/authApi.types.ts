import * as z from 'zod'
import { loginResponseSchema, meResponseSchema } from '@/features/auth/model/schemas'

export type LoginResponse = z.infer<typeof loginResponseSchema>
export type MeResponse = z.infer<typeof meResponseSchema>
