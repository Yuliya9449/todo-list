import type { RootState } from '@/app/model/store'
import type { Todolist } from '@/app/App'

export const selectTodolists = (state: RootState): Todolist[] => state.todolists
