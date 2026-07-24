import type { LoginInputs } from '@/features/auth/model/schemas'
import type { LoginResponse, MeResponse } from '@/features/auth/api/authApi.types'
import type { ResponseWithEmptyObject } from '@/common/types'
import { baseApi } from '@/app/api/baseApi'
import { AUTH_TOKEN } from '@/common/constants'
import { ResultCode } from '@/common/enums'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<MeResponse, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    login: build.mutation<LoginResponse, LoginInputs>({
      query: (body) => ({
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
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi
