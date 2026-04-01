import ListItem from '@mui/material/ListItem'
import Checkbox from '@mui/material/Checkbox'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { type ChangeEvent, useCallback } from 'react'
import type { Task, Todolist } from '@/app/App'
import { changeTaskAC, deleteTaskAC } from '@/features/model/tasks-reducer'
import { useAppDispatch } from '@/common/hooks'
import { DeleteButton } from '@/common/components/DeleteButton/DeleteButton'
import { getListItemSx } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.styles'

type Props = {
  todolistId: Todolist['id']
  task: Task
}

export const TaskItem = ({ todolistId, task }: Props) => {
  const { id, title, isDone } = task
  const dispatch = useAppDispatch()

  const deleteTask = useCallback(() => {
    dispatch(deleteTaskAC({ todolistId, taskId: id }))
  }, [dispatch, id, todolistId])

  const changeTaskStatus = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newStatusValue = e.currentTarget.checked
      dispatch(changeTaskAC({ todolistId, taskId: id, isDone: newStatusValue }))
    },
    [dispatch, id, todolistId],
  )

  const changeTaskTitle = useCallback(
    (title: Task['title']) => {
      dispatch(changeTaskAC({ todolistId, taskId: id, title }))
    },
    [dispatch, id, todolistId],
  )

  return (
    <ListItem sx={getListItemSx(isDone)}>
      <div>
        <Checkbox
          onChange={changeTaskStatus}
          checked={isDone}
        />
        <EditableSpan
          value={title}
          onChangeValue={changeTaskTitle}
        />
      </div>
      <DeleteButton onClick={deleteTask} />
    </ListItem>
  )
}
