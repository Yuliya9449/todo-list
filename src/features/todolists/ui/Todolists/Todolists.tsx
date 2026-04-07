import { TodolistItem } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem'
import { useAppSelector } from '@/common/hooks'
import { selectTodolists } from '@/features/todolists/model/todolists-selectors'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)

  return (
    <>
      {todolists?.map((todolist) => {
        return (
          <Grid key={todolist.id}>
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
