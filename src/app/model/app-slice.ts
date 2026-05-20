import type { RequestStatus } from '@/common/types'
import { createAppSlice } from '@/common/utils'
import { isFulfilled, isPending, isRejected } from '@reduxjs/toolkit/react'
import { todolistsApi } from '@/features/todolists/api/todolistsApi'
import { tasksApi } from '@/features/todolists/api/tasksApi'

export const appSlice = createAppSlice({
  name: 'app',
  initialState: {
    themeMode: 'dark' as ThemeMode,
    requestStatus: 'idle' as RequestStatus,
    error: null as ErrorMessage,
    auth: {
      isLoggedIn: false,
      loginName: null,
    } as {
      isLoggedIn: boolean
      loginName: string | null
    },
  },
  selectors: {
    selectThemeMode: (sliceState) => sliceState.themeMode,
    selectRequestStatus: (sliceState) => sliceState.requestStatus,
    selectAppError: (sliceState) => sliceState.error,
    selectIsLoggedIn: (sliceState) => sliceState.auth.isLoggedIn,
    selectLoginName: (sliceState) => sliceState.auth.loginName,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setRequestStatusAC: create.reducer<{ requestStatus: RequestStatus }>((state, action) => {
      state.requestStatus = action.payload.requestStatus
    }),
    setAppErrorAC: create.reducer<{ errorMessage: ErrorMessage }>((state, action) => {
      state.error = action.payload.errorMessage
    }),
    setIsLoggedInAC: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.auth.isLoggedIn = action.payload.isLoggedIn
    }),
    setLoginNameAC: create.reducer<{ loginName: string | null }>((state, action) => {
      state.auth.loginName = action.payload.loginName
    }),
  }),
  extraReducers: (builder) =>
    builder
      .addMatcher(isPending, (state, action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
        ) {
          return
        }
        state.requestStatus = 'loading'
      })
      .addMatcher(isFulfilled, (state) => {
        state.requestStatus = 'succeeded'
      })
      .addMatcher(isRejected, (state) => {
        state.requestStatus = 'failed'
      }),
})

export const { changeThemeModeAC, setRequestStatusAC, setAppErrorAC, setIsLoggedInAC, setLoginNameAC } =
  appSlice.actions
export const { selectThemeMode, selectRequestStatus, selectAppError, selectIsLoggedIn, selectLoginName } =
  appSlice.selectors
export const appReducer = appSlice.reducer

export type ThemeMode = 'dark' | 'light'
export type ErrorMessage = string | null
