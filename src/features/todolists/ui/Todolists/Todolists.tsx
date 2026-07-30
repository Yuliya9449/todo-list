import { TodolistItem } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useGetTodolistsQuery, useReorderTodolistMutation } from '@/features/todolists/api/todolistsApi'
import { TodolistSkeleton } from '@/features/todolists/ui/Todolists/TodolistSkeleton/TodolistSkeleton'
import Box from '@mui/material/Box'
import { Sortable } from '@/common/components'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'

export const Todolists = () => {
  const { data: todolists, isLoading } = useGetTodolistsQuery()
  const [reorderTodolist] = useReorderTodolistMutation()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '32px' }}>
        {Array.from({ length: 4 }, (_, id) => (
          <TodolistSkeleton key={id} />
        ))}
      </Box>
    )
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

          if (todolists && initialIndex !== index) {
            const newOrder = [...todolists]
            const [movedItem] = newOrder.splice(initialIndex, 1)
            newOrder.splice(index, 0, movedItem)

            const putAfterItemId = newOrder[index - 1]?.id ?? null
            reorderTodolist({ id: movedItem.id, newOrder, body: { putAfterItemId } })
          }
        }
      }}
    >
      {todolists?.map((todolist, index) => {
        return (
          <Grid key={todolist.id}>
            <Sortable id={todolist.id} index={index} HTMLTag={Paper} elevation={3} sx={{ p: '20px' }}>
              <TodolistItem todolist={todolist} />
            </Sortable>
          </Grid>
        )
      })}
    </DragDropProvider>
  )
}
