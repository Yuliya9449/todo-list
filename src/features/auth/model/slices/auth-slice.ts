import { createAppSlice, handleCatchError, handleStatusCodeError } from '@/common/utils'
import { type LoginInputs, loginResponseSchema, meResponseSchema } from '@/features/auth/model/schemas'
import { authApi } from '@/features/auth/api/authApi'
import { setRequestStatusAC } from '@/app/model/app-slice'
import { ResultCode } from '@/common/enums'
import { AUTH_TOKEN } from '@/common/constants'
import { clearDataAC } from '@/common/actions'

export const authSlice = createAppSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    loginName: null,
  } as {
    isLoggedIn: boolean
    loginName: string | null
  },
  selectors: {
    selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn,
    selectLoginName: (sliceState) => sliceState.loginName,
  },
  reducers: (create) => {
    return {
      loginTC: create.asyncThunk(
        async (arg: LoginInputs, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
            const { data } = await authApi.login(arg)
            if (data.resultCode === ResultCode.Success) {
              const validatedData = loginResponseSchema.parse(data) // 💎 zod
              dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
              localStorage.setItem(AUTH_TOKEN, validatedData.data.token)
              // ! в validatedData ещё userId
              return {
                isLoggedIn: true,
              }
            } else {
              handleStatusCodeError({ data, dispatch })
              return rejectWithValue(null)
            }
          } catch (error) {
            handleCatchError({ error, dispatch })
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          },
        },
      ),
      logoutTC: create.asyncThunk(
        async (_arg, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
            const { data } = await authApi.logout()

            if (data.resultCode === ResultCode.Success) {
              dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
              localStorage.removeItem(AUTH_TOKEN)
              dispatch(clearDataAC())
              return {
                isLoggedIn: false,
                loginName: null,
              }
            } else {
              handleStatusCodeError({ data, dispatch })
              return rejectWithValue(null)
            }
          } catch (error) {
            handleCatchError({ error, dispatch })
            dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.loginName = action.payload.loginName
          },
        },
      ),
      meTC: create.asyncThunk(
        async (_, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setRequestStatusAC({ requestStatus: 'loading' }))
            const { data } = await authApi.me()
            if (data.resultCode === ResultCode.Success) {
              dispatch(setRequestStatusAC({ requestStatus: 'succeeded' }))
              const validateDate = meResponseSchema.parse(data)
              return { isLoggedIn: true, loginName: validateDate.data.login }
            } else {
              handleStatusCodeError({ data: data, dispatch })
              return rejectWithValue(null)
            }
          } catch (error) {
            handleCatchError({ error, dispatch })
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.loginName = action.payload.loginName
          },
        },
      ),
    }
  },
})

export const { loginTC, logoutTC, meTC } = authSlice.actions
export const { selectIsLoggedIn, selectLoginName } = authSlice.selectors
export const authReducer = authSlice.reducer
