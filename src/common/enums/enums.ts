export const TaskStatus = {
  New: 0,
  InProgress: 1,
  Completed: 2,
  Draft: 3,
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export const TaskPriority = {
  Low: 0,
  Middle: 1,
  Hi: 2,
  Urgently: 3,
  Later: 4,
} as const

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority]
