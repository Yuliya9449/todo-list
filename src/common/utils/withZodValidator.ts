import type { NamedSchemaError, SchemaFailureInfo } from '@reduxjs/toolkit/query'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { ZodType } from 'zod'

export const withZodValidator = <T extends ZodType>(responseSchema: T) => ({
  responseSchema,
  catchSchemaFailure: (error: NamedSchemaError, info: SchemaFailureInfo): FetchBaseQueryError => {
    console.error({ error, info })
    return {
      status: 'CUSTOM_ERROR',
      error: error.schemaName + ' failed validation',
    }
  },
})
