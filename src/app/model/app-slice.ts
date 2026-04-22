import type { RequestStatus } from '@/common/types'
import { createAppSlice } from '@/common/utils'

export const appSlice = createAppSlice({
  name: 'app',
  initialState: {
    themeMode: 'dark' as ThemeMode,
    requestStatus: 'idle' as RequestStatus,
    error: null as ErrorMessage,
  },
  selectors: {
    selectThemeMode: (sliceState) => sliceState.themeMode,
    selectRequestStatus: (sliceState) => sliceState.requestStatus,
    selectAppError: (sliceState) => sliceState.error,
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
  }),
})

export const { changeThemeModeAC, setRequestStatusAC, setAppErrorAC } = appSlice.actions
export const { selectThemeMode, selectRequestStatus, selectAppError } = appSlice.selectors
export const appReducer = appSlice.reducer

export type ThemeMode = 'dark' | 'light'
export type ErrorMessage = string | null
