export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<T = object> = {
  data: T
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
}
