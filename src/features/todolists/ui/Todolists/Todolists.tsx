import { TodolistItem } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useGetTodolistsQuery } from '@/features/todolists/api/todolistsApi'

export const Todolists = () => {
  const { data: todolists } = useGetTodolistsQuery()

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
