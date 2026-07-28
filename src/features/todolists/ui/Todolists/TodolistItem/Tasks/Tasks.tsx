import List from '@mui/material/List'
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem'
import { useDeleteTaskMutation, useGetTasksQuery } from '@/features/todolists/api/tasksApi'
import { TasksSkeleton } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton'
import type { DomainTodolist } from '@/features/todolists/lib/types'
import { TasksPagination } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination'
import { useState } from 'react'
import { PAGE_SIZE } from '@/common/constants'
import styles from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.module.css'
import Typography from '@mui/material/Typography'

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const [page, setPage] = useState(1)
  const [deleteTask] = useDeleteTaskMutation()

  const { data: tasksData, isLoading } = useGetTasksQuery(
    {
      todolistId: todolist.id,
      params: { page },
    },
    {
      refetchOnFocus: true,
    },
  )

  const tasks = tasksData?.items || []
  const totalCount = tasksData?.totalCount || 0

  const deleteTaskHandler = async (taskId: string) => {
    try {
      await deleteTask({ todolistId: todolist.id, taskId }).unwrap()

      if (page > 1 && tasks.length === 1) {
        setPage((prev) => prev - 1)
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const hasNextPage = totalCount > PAGE_SIZE

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {tasks.length === 0 ? (
        <p>Tasks are absent</p>
      ) : (
        <List>
          {tasks.map((task) => {
            return <TaskItem key={task.id} todolist={todolist} task={task} deleteTask={deleteTaskHandler} />
          })}
        </List>
      )}

      {hasNextPage && <TasksPagination page={page} setPage={setPage} totalCount={totalCount} />}

      <div className={styles.totalCount}>
        <Typography variant="caption">Total: {totalCount}</Typography>
      </div>
    </>
  )
}
