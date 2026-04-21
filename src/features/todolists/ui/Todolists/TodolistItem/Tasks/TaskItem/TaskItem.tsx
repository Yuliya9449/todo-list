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
  todolist: DomainTodolist
  task: DomainTask
}

export const TaskItem = ({ todolist, task }: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = useCallback(() => {
    dispatch(deleteTaskTC({ todolistId: todolist.id, taskId: task.id }))
  }, [dispatch, task.id, todolist.id])

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
          disabled={todolist.isDisabled}
        />
        <EditableSpan
          value={task.title}
          onChangeValue={changeTaskTitle}
          disabled={todolist.isDisabled}
        />
      </div>
      <DeleteButton
        onClick={deleteTask}
        disabled={todolist.isDisabled}
      />
    </ListItem>
  )
}
