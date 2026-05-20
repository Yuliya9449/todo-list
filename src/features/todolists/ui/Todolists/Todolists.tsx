import { TodolistItem } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useGetTodolistsQuery } from '@/features/todolists/api/todolistsApi'
import { TodolistSkeleton } from '@/features/todolists/ui/Todolists/TodolistSkeleton/TodolistSkeleton'
import Box from '@mui/material/Box'

export const Todolists = () => {
  const { data: todolists, isLoading } = useGetTodolistsQuery()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} style={{ gap: '32px' }}>
        {Array.from({ length: 4 }, (_, id) => (
          <TodolistSkeleton key={id} />
        ))}
      </Box>
    )
  }

  return (
    <>
      {todolists?.map((todolist) => {
        return (
          <Grid key={todolist.id}>
            <Paper elevation={3} sx={{ p: '20px' }}>
              <TodolistItem todolist={todolist} />
            </Paper>
          </Grid>
        )
      })}
    </>
  )
}
