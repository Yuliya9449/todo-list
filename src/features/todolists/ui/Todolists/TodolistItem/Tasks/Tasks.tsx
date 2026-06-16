import List from '@mui/material/List'
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { TaskStatus } from '@/common/enums'
import { useGetTasksQuery } from '@/features/todolists/api/tasksApi'
import { TasksSkeleton } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton'
import type { DomainTodolist, FilterValues } from '@/features/todolists/lib/types'
import { TasksPagination } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination'
import { useState } from 'react'

type Props = {
  todolist: DomainTodolist
}

const getFilteredTasks = (tasks: DomainTask[] | undefined, filter: FilterValues) => {
  if (!tasks) return

  switch (filter) {
    case 'active':
      return tasks.filter((task) => task.status === TaskStatus.New)
    case 'completed':
      return tasks.filter((task) => task.status === TaskStatus.Completed)
    default:
      return tasks
  }
}

export const Tasks = ({ todolist }: Props) => {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetTasksQuery(
    {
      todolistId: todolist.id,
      params: { page },
    },
    {
      refetchOnFocus: true,
    },
  )

  const filteredTasks = getFilteredTasks(data?.items, todolist.filter)

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Tasks are absent</p>
      ) : (
        <List>
          {filteredTasks?.map((task) => {
            return <TaskItem key={task.id} todolist={todolist} task={task} />
          })}
        </List>
      )}
      <TasksPagination page={page} setPage={setPage} totalCount={data?.totalCount || 0} />
    </>
  )
}
