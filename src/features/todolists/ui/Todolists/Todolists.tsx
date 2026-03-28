import { TodolistItem } from '@/features/TodolistItem'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { selectTodolists } from '@/features/model/todolists-selectors'
import { selectTasks } from '@/features/model/tasks-selectors'
import { changeTaskAC, createTaskAC, deleteTaskAC } from '@/features/model/tasks-reducer'
import { changeTodolistAC, deleteTodolistAC } from '@/features/model/todolists-reducer'
import type { FilterValues, Task, Todolist } from '@/app/App'

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

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  const deleteTask = (payload: { todolistId: Todolist['id']; taskId: Task['id'] }) => dispatch(deleteTaskAC(payload))

  const changeFilter = (payload: { todolistId: Todolist['id']; filter: FilterValues }) =>
    dispatch(changeTodolistAC(payload))

  const createTask = (payload: { todolistId: Todolist['id']; title: Task['title'] }) => dispatch(createTaskAC(payload))

  const changeTaskStatus = (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) =>
    dispatch(changeTaskAC(payload))

  const deleteTodolist = (todolistId: Todolist['id']) => dispatch(deleteTodolistAC({ todolistId }))

  const changeTodolistTitle = (payload: { todolistId: Todolist['id']; title: Todolist['title'] }) =>
    dispatch(changeTodolistAC(payload))

  const changeTaskTitle = (payload: { todolistId: Todolist['id']; taskId: Task['id']; title: Task['title'] }) =>
    dispatch(changeTaskAC(payload))
  return (
    <>
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
    </>
  )
}
