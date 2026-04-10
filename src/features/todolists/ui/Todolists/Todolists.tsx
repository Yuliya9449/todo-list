import { TodolistItem } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { fetchTodolistsTC, selectTodolists } from '@/features/todolists/model/todolists-slice'
import { useEffect } from 'react'

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, [dispatch])

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
