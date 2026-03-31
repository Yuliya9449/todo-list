import type { FilterValues, Task, Todolist } from '@/app/App'
import { changeTaskAC, deleteTaskAC } from '@/features/model/tasks-reducer'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import type { ChangeEvent } from 'react'
import styles from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem.module.css'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { Button } from '@/common/components/Button/Button'
import { selectTasks } from '@/features/model/tasks-selectors'

type Props = {
  todolist: Todolist
}

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

export const Tasks = ({ todolist }: Props) => {
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  const todolistTasks = tasks[todolist.id]
  const filteredTasks = getFilteredTasks(todolistTasks, todolist.filter)

  const deleteTask = (payload: { todolistId: Todolist['id']; taskId: Task['id'] }) => dispatch(deleteTaskAC(payload))

  const changeTaskStatus = (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) =>
    dispatch(changeTaskAC(payload))

  const changeTaskTitle = (payload: { todolistId: Todolist['id']; taskId: Task['id']; title: Task['title'] }) =>
    dispatch(changeTaskAC(payload))

  return (
    <>
      {filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => {
            const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
              const newStatusValue = e.currentTarget.checked
              changeTaskStatus({ todolistId: todolist.id, taskId: task.id, isDone: newStatusValue })
            }

            const changeTaskTitleHandler = (title: Task['title']) => {
              changeTaskTitle({ todolistId: todolist.id, taskId: task.id, title })
            }

            return (
              <li
                key={task.id}
                className={task.isDone ? styles.isDone : ''}
              >
                <input
                  type="checkbox"
                  onChange={changeTaskStatusHandler}
                  checked={task.isDone}
                />
                <EditableSpan
                  value={task.title}
                  onChangeValue={changeTaskTitleHandler}
                />
                <Button
                  title={'X'}
                  onClick={() => deleteTask({ todolistId: todolist.id, taskId: task.id })}
                />
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
