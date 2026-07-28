import ListItem from '@mui/material/ListItem'
import Checkbox from '@mui/material/Checkbox'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { type ChangeEvent, useCallback } from 'react'
import { DeleteButton } from '@/common/components/DeleteButton/DeleteButton'
import { getListItemSx } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.styles'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { TaskStatus } from '@/common/enums'
import { useUpdateTaskMutation } from '@/features/todolists/api/tasksApi'
import type { DomainTodolist } from '@/features/todolists/lib/types'

type Props = {
  todolist: DomainTodolist
  task: DomainTask
  deleteTask: (taskId: string) => void
}

export const TaskItem = ({ todolist, task, deleteTask }: Props) => {
  const [updateTask] = useUpdateTaskMutation()

  const changeTaskStatus = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newStatusValue: TaskStatus = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
      const updatedTask: DomainTask = { ...task, status: newStatusValue }
      updateTask(updatedTask)
    },
    [task, updateTask],
  )

  const changeTaskTitle = useCallback(
    (title: DomainTask['title']) => {
      const updatedTask: DomainTask = { ...task, title }
      updateTask(updatedTask)
    },
    [task, updateTask],
  )

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox onChange={changeTaskStatus} checked={isTaskCompleted} disabled={todolist.isDisabled} />
        <EditableSpan value={task.title} onChangeValue={changeTaskTitle} disabled={todolist.isDisabled} />
      </div>
      <DeleteButton onClick={() => deleteTask(task.id)} disabled={todolist.isDisabled} />
    </ListItem>
  )
}
