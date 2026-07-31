import List from '@mui/material/List'
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem'
import { useDeleteTaskMutation, useGetTasksQuery, useReorderTaskMutation } from '@/features/todolists/api/tasksApi'
import { TasksSkeleton } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton'
import type { DomainTodolist } from '@/features/todolists/lib/types'
import { TasksPagination } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination'
import { useState } from 'react'
import { PAGE_SIZE } from '@/common/constants'
import styles from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.module.css'
import Typography from '@mui/material/Typography'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { Sortable } from '@/common/components'

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const [page, setPage] = useState(1)
  const [deleteTask] = useDeleteTaskMutation()
  const [reorderTask] = useReorderTaskMutation()

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
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) {
          return
        }

        const { source } = event.operation

        if (isSortable(source)) {
          const { initialIndex, index } = source

          if (initialIndex !== index) {
            const newOrder = [...tasks]
            const [movedItem] = newOrder.splice(initialIndex, 1)
            newOrder.splice(index, 0, movedItem)

            const putAfterItemId = newOrder[index - 1]?.id ?? null
            reorderTask({ todolistId: todolist.id, taskId: movedItem.id, newOrder, body: { putAfterItemId } })
          }
        }
      }}
    >
      {tasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          Tasks are absent
        </Typography>
      ) : (
        <List>
          {tasks.map((task, index) => {
            return (
              <Sortable
                key={task.id}
                id={task.id}
                index={index}
                HTMLTag={TaskItem}
                todolist={todolist}
                task={task}
                deleteTask={deleteTaskHandler}
              />
            )
            // return < TaskItem key={task.id} todolist={todolist} task={task} deleteTask={deleteTaskHandler} />
          })}
        </List>
      )}

      {hasNextPage && <TasksPagination page={page} setPage={setPage} totalCount={totalCount} />}

      <div className={styles.totalCount}>
        <Typography variant="caption">Total: {totalCount}</Typography>
      </div>
    </DragDropProvider>
  )
}
