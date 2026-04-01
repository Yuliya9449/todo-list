import styles from './TaskItem.module.css'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { Button } from '@/common/components/Button/Button'
import type { ChangeEvent } from 'react'
import type { Task, Todolist } from '@/app/App'
import { changeTaskAC, deleteTaskAC } from '@/features/model/tasks-reducer'
import { useAppDispatch } from '@/common/hooks'

type Props = {
  todolistId: Todolist['id']
  task: Task
}

export const TaskItem = ({ todolistId, task }: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = (payload: { todolistId: Todolist['id']; taskId: Task['id'] }) => dispatch(deleteTaskAC(payload))

  const changeTaskStatus = (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) =>
    dispatch(changeTaskAC(payload))

  const changeTaskTitle = (payload: { todolistId: Todolist['id']; taskId: Task['id']; title: Task['title'] }) =>
    dispatch(changeTaskAC(payload))

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked
    changeTaskStatus({ todolistId, taskId: task.id, isDone: newStatusValue })
  }

  const changeTaskTitleHandler = (title: Task['title']) => {
    changeTaskTitle({ todolistId, taskId: task.id, title })
  }

  return (
    <li className={task.isDone ? styles.isDone : ''}>
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
        onClick={() => deleteTask({ todolistId, taskId: task.id })}
      />
    </li>
  )
}
