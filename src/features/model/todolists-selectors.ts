import type { RootState } from '@/app/store'
import type { Todolist } from '@/app/App'

export const selectTodolists = (state: RootState): Todolist[] => state.todolists
