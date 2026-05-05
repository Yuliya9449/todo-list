import Grid from '@mui/material/Grid'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists'
import Container from '@mui/material/Container'
import type { DomainTodolist } from '@/features/todolists/model/slices/todolists-slice'
import { createTodolistTC } from '@/features/todolists/model/slices/todolists-slice'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { selectIsLoggedIn } from '@/features/auth/model/slices/auth-slice'
import { Navigate } from 'react-router'
import { Path } from '@/common/components'

export const Main = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const createTodolistHandler = (title: DomainTodolist['title']) => dispatch(createTodolistTC(title))

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  return (
    <Container maxWidth={'lg'}>
      <Grid
        container
        sx={{ p: '30px 0' }}
      >
        <CreateItemForm onCreateItem={createTodolistHandler} />
      </Grid>
      <Grid
        container
        spacing={4}
      >
        <Todolists />
      </Grid>
    </Container>
  )
}
