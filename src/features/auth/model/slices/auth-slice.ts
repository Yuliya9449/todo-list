import { createAppSlice, handleCatchError, handleStatusCodeError } from '@/common/utils'
import { type LoginInputs, loginResponseSchema } from '@/features/auth/model/schemas'
import { authApi } from '@/features/auth/api/authApi'
import { setRequestStatusAC } from '@/app/model/app-slice'
import { ResultCode } from '@/common/enums'
import { AUTH_TOKEN } from '@/common/constants'

export const authSlice = createAppSlice({
  name: 'auth',
  initialState: { isLoggedIn: false },
  selectors: {
    selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn,
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
              return // ! пустой
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
          fulfilled: (state, _action) => {
            state.isLoggedIn = true
          },
        },
      ),
    }
  },
})

export const { loginTC } = authSlice.actions
export const { selectIsLoggedIn } = authSlice.selectors
export const authReducer = authSlice.reducer
