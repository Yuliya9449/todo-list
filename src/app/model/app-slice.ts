import { createSlice } from '@reduxjs/toolkit'
import type { RequestStatus } from '@/common/types'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    themeMode: 'dark' as ThemeMode,
    requestStatus: 'idle' as RequestStatus,
  },
  selectors: {
    selectThemeMode: (sliceState) => sliceState.themeMode,
    selectRequestStatus: (sliceState) => sliceState.requestStatus,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setRequestStatusAC: create.reducer<{ requestStatus: RequestStatus }>((state, action) => {
      state.requestStatus = action.payload.requestStatus
    }),
  }),
})

export const { changeThemeModeAC, setRequestStatusAC } = appSlice.actions
export const { selectThemeMode, selectRequestStatus } = appSlice.selectors
export const appReducer = appSlice.reducer

export type ThemeMode = 'dark' | 'light'
