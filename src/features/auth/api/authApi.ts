import type { LoginInputs } from '@/features/auth/model/schemas'
import type { LoginResponse, MeResponse } from '@/features/auth/api/authApi.types'
import type { ResponseWithEmptyObject } from '@/common/types'
import { baseApi } from '@/app/api/baseApi'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<MeResponse, void>({
      query: () => '/auth/me',
      // providesTags: ['Auth'],
    }),
    login: build.mutation<LoginResponse, LoginInputs>({
      query: (body) => ({
        method: 'post',
        url: '/auth/login',
        body,
      }),
      // invalidatesTags: ['Auth'],
    }),
    logout: build.mutation<ResponseWithEmptyObject, void>({
      query: () => ({
        method: 'delete',
        url: '/auth/login',
      }),
    }),
  }),
})

export const { useMeQuery, useLazyMeQuery, useLoginMutation, useLogoutMutation } = authApi
