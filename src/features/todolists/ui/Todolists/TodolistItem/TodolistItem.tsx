import { memo } from 'react'
import { CreateItemForm } from '@/common/components'
import { useAppDispatch } from '@/common/hooks'
import { createTaskTC } from '@/features/todolists/model/tasks-slice'
import { TodolistTitle } from './TodolistTitle/TodolistTitle'
import { FilterButtons } from './FilterButtons/FilterButtons'
import { Tasks } from './Tasks/Tasks'
import type { DomainTodolist } from '@/features/todolists/model/todolists-slice'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = memo(({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  const createTask = (title: DomainTask['title']) => {
    dispatch(createTaskTC({ todolistId: todolist.id, title }))
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm
        onCreateItem={createTask}
        disabled={todolist.isDisabled}
      />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
})
