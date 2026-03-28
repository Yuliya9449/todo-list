import { TodolistItem } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem'
import { useAppSelector } from '@/common/hooks'
import { selectTodolists } from '@/features/model/todolists-selectors'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)

  return (
    <>
      {todolists?.map((todolist) => {
        return (
          <Grid
            key={todolist.id}
            size={{ xs: 12, sm: 6, md: 4 }}
          >
            <Paper
              elevation={3}
              sx={{ p: '20px' }}
            >
              <TodolistItem todolist={todolist} />
            </Paper>
          </Grid>
        )
      })}
    </>
  )
}
