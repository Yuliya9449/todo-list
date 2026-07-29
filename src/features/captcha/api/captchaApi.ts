import { baseApi } from '@/app/api/baseApi'

// https://social-network.samuraijs.com/api/1.1/security/get-captcha-url

export const captchaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCaptcha: build.query<{ url: string }, void>({
      query: () => ({
        url: '/security/get-captcha-url',
      }),
      keepUnusedDataFor: 0,
    }),
  }),
})

export const { useLazyGetCaptchaQuery } = captchaApi
