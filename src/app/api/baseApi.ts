import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTH_TOKEN } from '@/common/constants'
import { handleFetchBaseQueryError } from '@/common/utils'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Todolist', 'Task'],
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        'API-KEY': import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        const token = localStorage.getItem(AUTH_TOKEN)
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
      },
    })(args, api, extraOptions)

    handleFetchBaseQueryError({ result, dispatch: api.dispatch })

    return result
  },
  keepUnusedDataFor: 60,
  refetchOnReconnect: true,
  endpoints: () => ({}),
})
