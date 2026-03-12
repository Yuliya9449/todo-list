import { v1 } from 'uuid'
import styles from './App.module.css'
import { TodolistItem } from '@/features/TodolistItem'
import { useCallback, useState } from 'react'

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
    { id: v1(), title: 'What to learn', filter: 'all' },
    { id: v1(), title: 'What to buy', filter: 'all' },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: v1(), title: 'HTML&CSS', isDone: true },
    { id: v1(), title: 'JS', isDone: true },
    { id: v1(), title: 'ReactJS', isDone: false },
    { id: v1(), title: 'Redux', isDone: false },
    { id: v1(), title: 'Typescript', isDone: false },
    { id: v1(), title: 'RTK query', isDone: false },
  ])

  // const filteredTasks = useMemo(() => getFilteredTasks(tasks, filter), [tasks, filter])

  const deleteTask = useCallback(
    (taskId: Task['id']) => {
      setTasks(tasks.filter((task) => task.id !== taskId))
    },
    [tasks],
  )

  const changeFilter = useCallback(
    (todolistId: string, filter: FilterValues) => {
      setTodolists(todolists.map((t) => (t.id === todolistId ? { ...t, filter } : t)))
    },
    [todolists],
  )

  const createTask = useCallback(
    (title: Task['title']) => {
      const newTask = { id: v1(), title, isDone: false }
      const updatedTasks = [newTask, ...tasks]
      setTasks(updatedTasks)
    },
    [tasks],
  )

  const changeTaskStatus = useCallback(
    (taskId: Task['id'], isDone: Task['isDone']) => {
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, isDone } : t)))
    },
    [tasks],
  )

  return (
    <div className={styles.app}>
      {todolists.map((todolist) => {
        const filteredTasks = getFilteredTasks(tasks, todolist.filter)

        return (
          <TodolistItem
            key={todolist.id}
            todolist={todolist}
            tasks={filteredTasks}
            deleteTask={deleteTask}
            changeFilter={changeFilter}
            createTask={createTask}
            changeTaskStatus={changeTaskStatus}
          />
        )
      })}
    </div>
  )
}
