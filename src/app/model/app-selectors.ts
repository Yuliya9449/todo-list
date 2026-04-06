import type { RootState } from '@/app/model/store'
import type { ThemeMode } from '@/app/model/app-reducer'

export const selectThemeMode = (state: RootState): ThemeMode => state.app.themeMode
