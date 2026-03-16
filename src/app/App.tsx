import { v1 } from 'uuid'
import styles from './App.module.css'
import { TodolistItem } from '@/features/TodolistItem'
import { useCallback, useState } from 'react'

const todolistId1 = v1()
const todolistId2 = v1()

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<Todolist['id'], Task[]>

export type FilterValues = 'all' | 'active' | 'completed'

const getFilteredTasks = (tasks: Task[], filter: FilterValues): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter((task) => !task.isDone)
    case 'completed':
      return tasks.filter((task) => task.isDone)
    default:
      return tasks
  }
}

export const App = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ])

  const [tasks, setTasks] = useState<TasksState>({
    [todolistId1]: [
      { id: v1(), title: 'HTML&CSS', isDone: true },
      { id: v1(), title: 'JS', isDone: true },
      { id: v1(), title: 'ReactJS', isDone: false },
    ],
    [todolistId2]: [
      { id: v1(), title: 'Rest API', isDone: true },
      { id: v1(), title: 'GraphQL', isDone: false },
    ],
  })

  const deleteTask = useCallback(
    (payload: { todolistId: Todolist['id']; taskId: Task['id'] }) => {
      const { todolistId, taskId } = payload
      setTasks({
        ...tasks,
        [todolistId]: tasks[todolistId].filter((t) => t.id !== taskId),
      })
    },
    [tasks],
  )

  const changeFilter = useCallback(
    (payload: { todolistId: Todolist['id']; filter: FilterValues }) => {
      const { todolistId, filter } = payload
      setTodolists(todolists.map((t) => (t.id === todolistId ? { ...t, filter } : t)))
    },
    [todolists],
  )

  const createTask = useCallback(
    (payload: { todolistId: Todolist['id']; title: Task['title'] }) => {
      const { todolistId, title } = payload
      const newTask = { id: v1(), title, isDone: false }
      setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] })
    },
    [tasks],
  )

  const changeTaskStatus = useCallback(
    (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) => {
      const { todolistId, taskId, isDone } = payload
      setTasks({ ...tasks, [todolistId]: tasks[todolistId].map((t) => (t.id === taskId ? { ...t, isDone } : t)) })
    },
    [tasks],
  )

  const deleteTodolist = useCallback(
    (todolistId: Todolist['id']) => {
      setTodolists(todolists.filter((todolist) => todolist.id !== todolistId))
      const { [todolistId]: _, ...rest } = tasks
      setTasks(rest)
    },
    [todolists, tasks],
  )

  return (
    <div className={styles.app}>
      {todolists.map((todolist) => {
        const todolistTasks = tasks[todolist.id]

        const filteredTasks = getFilteredTasks(todolistTasks, todolist.filter)

        return (
          <TodolistItem
            key={todolist.id}
            todolist={todolist}
            tasks={filteredTasks}
            deleteTask={deleteTask}
            changeFilter={changeFilter}
            createTask={createTask}
            changeTaskStatus={changeTaskStatus}
            deleteTodolist={deleteTodolist}
          />
        )
      })}
    </div>
  )
}
