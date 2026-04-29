import { ResultCode } from '@/common/enums'
import * as z from 'zod'

export const fieldErrorSchema = z.object({
  error: z.string(),
  field: z.string(),
})

export type FieldError = z.infer<typeof fieldErrorSchema>

export const createResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    resultCode: z.enum(ResultCode),
    messages: z.string().array(),
    fieldsErrors: fieldErrorSchema.array(),
  })

export const responseWithEmptyObjectSchema = createResponseSchema(z.object({}))

export type ResponseWithEmptyObject = z.infer<typeof responseWithEmptyObjectSchema>

export type BaseResponse<T = object> = {
  data: T
  resultCode: ResultCode
  messages: string[]
  fieldsErrors: FieldError[]
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
