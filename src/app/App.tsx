import styles from './App.module.css'
import { TodolistItem } from '@/features/TodolistItem'
import { useCallback } from 'react'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { changeTodolistAC, createTodolistAC, deleteTodolistAC } from '@/features/model/todolists-reducer'
import { changeTaskAC, createTaskAC, deleteTaskAC } from '@/features/model/tasks-reducer'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { selectTodolists } from '@/features/model/todolists-selectors'
import { selectTasks } from '@/features/model/tasks-selectors'

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
  const todolists = useAppSelector(selectTodolists)
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  const deleteTask = useCallback((payload: { todolistId: Todolist['id']; taskId: Task['id'] }) => {
    dispatch(deleteTaskAC(payload))
  }, [])

  const changeFilter = useCallback((payload: { todolistId: Todolist['id']; filter: FilterValues }) => {
    dispatch(changeTodolistAC(payload))
  }, [])

  const createTask = useCallback((payload: { todolistId: Todolist['id']; title: Task['title'] }) => {
    dispatch(createTaskAC(payload))
  }, [])

  const changeTaskStatus = useCallback(
    (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) => {
      dispatch(changeTaskAC(payload))
    },
    [],
  )

  const deleteTodolist = useCallback((todolistId: Todolist['id']) => {
    dispatch(deleteTodolistAC({ todolistId }))
  }, [])

  const createTodolistHandler = useCallback((title: Todolist['title']) => {
    dispatch(createTodolistAC(title))
  }, [])

  const changeTodolistTitle = useCallback((payload: { todolistId: Todolist['id']; title: Todolist['title'] }) => {
    dispatch(changeTodolistAC(payload))
  }, [])

  const changeTaskTitle = useCallback(
    (payload: { todolistId: Todolist['id']; taskId: Task['id']; title: Task['title'] }) => {
      dispatch(changeTaskAC(payload))
    },
    [],
  )

  return (
    <div className={styles.app}>
      <CreateItemForm onCreateItem={createTodolistHandler} />
      {todolists?.map((todolist) => {
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
            changeTodolistTitle={changeTodolistTitle}
            changeTaskTitle={changeTaskTitle}
          />
        )
      })}
    </div>
  )
}
