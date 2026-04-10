import { TodolistItem } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistItem'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { selectTodolists, setTodolistsAC } from '@/features/todolists/model/todolists-slice'
import { useEffect } from 'react'
import { todolistsApi } from '@/features/todolists/api/todolistsApi'
import type { Todolist } from '@/features/todolists/api/todolistsApi.types'

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)
  const dispatch = useAppDispatch()

  useEffect(() => {
    todolistsApi.getTodolists().then((res) => {
      const todolists: Todolist[] = res.data
      dispatch(setTodolistsAC({ todolists }))
    })
  }, [])

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
