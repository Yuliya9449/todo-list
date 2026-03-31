import type { Task, Todolist } from '@/app/App'
import { memo } from 'react'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { useAppDispatch } from '@/common/hooks'
import { createTaskAC } from '@/features/model/tasks-reducer'
import { TodolistTitle } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle'
import { FilterButtons } from '@/features/todolists/ui/Todolists/TodolistItem/FilterButtons/FilterButtons'
import { Tasks } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/Tasks'

type Props = {
  todolist: Todolist
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
