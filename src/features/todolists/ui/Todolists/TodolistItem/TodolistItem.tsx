import type { Task } from '@/app/App'
import { memo } from 'react'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { useAppDispatch } from '@/common/hooks'
import { createTaskAC } from '@/features/todolists/model/tasks-slice'
import { TodolistTitle } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle'
import { FilterButtons } from '@/features/todolists/ui/Todolists/TodolistItem/FilterButtons/FilterButtons'
import { Tasks } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Tasks'
import type { DomainTodolist } from '@/features/todolists/model/todolists-slice'

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = memo(({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  const createTask = (title: Task['title']) => {
    dispatch(createTaskAC({ todolistId: todolist.id, title }))
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTask} />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
})
