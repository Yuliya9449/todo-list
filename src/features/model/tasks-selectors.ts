import type { RootState } from '@/app/store'
import type { TasksState } from '@/app/App'

export const selectTasks = (state: RootState): TasksState => state.tasks
