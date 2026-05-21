import ListItem from '@mui/material/ListItem'
import Checkbox from '@mui/material/Checkbox'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { type ChangeEvent, useCallback } from 'react'
import { DeleteButton } from '@/common/components/DeleteButton/DeleteButton'
import { getListItemSx } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.styles'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { TaskStatus } from '@/common/enums'
import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/features/todolists/api/tasksApi'
import type { DomainTodolist } from '@/features/todolists/lib/types'

type Props = {
  todolist: DomainTodolist
  task: DomainTask
}

export const TaskItem = ({ todolist, task }: Props) => {
  const [deleteTask] = useDeleteTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const deleteTaskHandler = useCallback(() => {
    deleteTask({ todolistId: todolist.id, taskId: task.id })
  }, [deleteTask, task.id, todolist.id])

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
      <DeleteButton onClick={deleteTaskHandler} disabled={todolist.isDisabled} />
    </ListItem>
  )
}
