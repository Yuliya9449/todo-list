import Grid from '@mui/material/Grid'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists'
import Container from '@mui/material/Container'
import { createTodolistAC } from '@/features/todolists/model/todolists-reducer'
import type { Todolist } from '@/app/App'
import { useAppDispatch } from '@/common/hooks'

export const Main = () => {
  const dispatch = useAppDispatch()

  const createTodolistHandler = (title: Todolist['title']) => dispatch(createTodolistAC(title))

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
