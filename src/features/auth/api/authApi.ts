import { type LoginInputs, loginResponseSchema, meResponseSchema } from '@/features/auth/model/schemas'
import { type ResponseWithEmptyObject, responseWithEmptyObjectSchema } from '@/common/types'
import { baseApi } from '@/app/api/baseApi'
import { AUTH_TOKEN } from '@/common/constants'
import { ResultCode } from '@/common/enums'
import { withZodValidator } from '@/common/utils'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query({
      query: () => '/auth/me',
      ...withZodValidator(meResponseSchema),
      providesTags: ['Auth'],
    }),
    login: build.mutation({
      query: (body: LoginInputs) => ({
        method: 'post',
        url: '/auth/login',
        body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        if (data.resultCode === ResultCode.Success) {
          localStorage.setItem(AUTH_TOKEN, data.data.token)
          dispatch(authApi.util.invalidateTags(['Auth']))
        }
      },
      ...withZodValidator(loginResponseSchema),
    }),
    logout: build.mutation<ResponseWithEmptyObject, void>({
      query: () => ({
        method: 'delete',
        url: '/auth/login',
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        if (data.resultCode === ResultCode.Success) {
          localStorage.removeItem(AUTH_TOKEN)
          dispatch(authApi.util.invalidateTags(['Auth']))
          dispatch(baseApi.util.resetApiState())
        }
      },
      ...withZodValidator(responseWithEmptyObjectSchema),
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi
