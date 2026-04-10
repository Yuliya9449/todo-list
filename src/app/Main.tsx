import Grid from '@mui/material/Grid'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists'
import Container from '@mui/material/Container'
import { createTodolistAC } from '@/features/todolists/model/todolists-slice'
import { useAppDispatch } from '@/common/hooks'
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types'

export const Main = () => {
  const dispatch = useAppDispatch()

  const createTodolistHandler = (title: DomainTodolist['title']) => dispatch(createTodolistAC(title))

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
