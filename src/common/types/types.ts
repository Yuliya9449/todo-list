export type FieldError = {
  error: string
  field: string
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type BaseResponse<T = {}> = {
  data: T
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
}
