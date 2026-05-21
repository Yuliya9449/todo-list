import { ResultCode } from '@/common/enums'
import * as z from 'zod'

export const fieldErrorSchema = z.object({
  error: z.string(),
  field: z.string(),
})

export const createResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    resultCode: z.enum(ResultCode),
    messages: z.string().array(),
    fieldsErrors: fieldErrorSchema.array(),
  })

export type ApiResponse<T extends z.ZodType> = z.infer<ReturnType<typeof createResponseSchema<T>>>

export const responseWithAnyObjectSchema = createResponseSchema(z.looseObject({}))

export type ResponseWithAnyObject = z.infer<typeof responseWithAnyObjectSchema>

export const responseWithEmptyObjectSchema = createResponseSchema(z.strictObject({}))

export type ResponseWithEmptyObject = z.infer<typeof responseWithEmptyObjectSchema>

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
