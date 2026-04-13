import ListItem from '@mui/material/ListItem'
import Checkbox from '@mui/material/Checkbox'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { type ChangeEvent, useCallback } from 'react'
import { changeTaskTC, deleteTaskTC } from '@/features/todolists/model/tasks-slice'
import { useAppDispatch } from '@/common/hooks'
import { DeleteButton } from '@/common/components/DeleteButton/DeleteButton'
import { getListItemSx } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.styles'
import type { DomainTodolist } from '@/features/todolists/model/todolists-slice'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { TaskStatus } from '@/common/enums'

type Props = {
  todolistId: DomainTodolist['id']
  task: DomainTask
}

export const TaskItem = ({ todolistId, task }: Props) => {
  const { id, title } = task
  const dispatch = useAppDispatch()

  const deleteTask = useCallback(() => {
    dispatch(deleteTaskTC({ todolistId, taskId: id }))
  }, [dispatch, id, todolistId])

  const changeTaskStatus = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newStatusValue: TaskStatus = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
      const updatedTask: DomainTask = { ...task, status: newStatusValue }
      dispatch(changeTaskTC(updatedTask))
    },
    [dispatch, task],
  )

  const changeTaskTitle = useCallback(
    (title: DomainTask['title']) => {
      const updatedTask: DomainTask = { ...task, title }
      dispatch(changeTaskTC(updatedTask))
    },
    [dispatch, task],
  )

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox
          onChange={changeTaskStatus}
          checked={isTaskCompleted}
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
