import { memo } from 'react'
import { CreateItemForm } from '@/common/components'
import { TodolistTitle } from './TodolistTitle/TodolistTitle'
import { FilterButtons } from './FilterButtons/FilterButtons'
import { Tasks } from './Tasks/Tasks'
import type { DomainTodolist } from '@/features/todolists/model/slices/todolists-slice'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { useCreateTaskMutation } from '@/features/todolists/api/tasksApi'

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = memo(({ todolist }: Props) => {
  const [createTask] = useCreateTaskMutation()

  const createTaskHandler = (title: DomainTask['title']) => {
    createTask({ todolistId: todolist.id, title })
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTaskHandler} disabled={todolist.isDisabled} />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
})
