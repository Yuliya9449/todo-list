import type { RootState } from '@/app/model/store'
import type { TasksState } from '@/app/App'

export const selectTasks = (state: RootState): TasksState => state.tasks
