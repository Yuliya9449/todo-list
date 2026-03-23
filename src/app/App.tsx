import styles from './App.module.css'
import { TodolistItem } from '@/features/TodolistItem'
import { useCallback, useReducer } from 'react'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import {
  changeTodolistAC,
  createTodolistAC,
  deleteTodolistAC,
  todolistsReducer,
} from '@/features/model/todolists-reducer'
import { changeTaskAC, createTaskAC, deleteTaskAC, tasksReducer } from '@/features/model/tasks-reducer'

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
  const [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [])

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {})

  const deleteTask = useCallback((payload: { todolistId: Todolist['id']; taskId: Task['id'] }) => {
    dispatchToTasks(deleteTaskAC(payload))
  }, [])

  const changeFilter = useCallback((payload: { todolistId: Todolist['id']; filter: FilterValues }) => {
    dispatchToTodolists(changeTodolistAC(payload))
  }, [])

  const createTask = useCallback((payload: { todolistId: Todolist['id']; title: Task['title'] }) => {
    dispatchToTasks(createTaskAC(payload))
  }, [])

  const changeTaskStatus = useCallback(
    (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) => {
      dispatchToTasks(changeTaskAC(payload))
    },
    [],
  )

  const deleteTodolist = useCallback((todolistId: Todolist['id']) => {
    const action = deleteTodolistAC({ todolistId })
    dispatchToTodolists(action)
    dispatchToTasks(action)
  }, [])

  const createTodolistHandler = useCallback((title: Todolist['title']) => {
    const action = createTodolistAC(title)
    dispatchToTodolists(action)
    dispatchToTasks(action)
  }, [])

  const changeTodolistTitle = useCallback((payload: { todolistId: Todolist['id']; title: Todolist['title'] }) => {
    dispatchToTodolists(changeTodolistAC(payload))
  }, [])

  const changeTaskTitle = useCallback(
    (payload: { todolistId: Todolist['id']; taskId: Task['id']; title: Task['title'] }) => {
      dispatchToTasks(changeTaskAC(payload))
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
