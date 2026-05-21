import Grid from '@mui/material/Grid'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists'
import Container from '@mui/material/Container'
import { useAddTodolistMutation } from '@/features/todolists/api/todolistsApi'
import type { DomainTodolist } from '@/features/todolists/lib/types'

export const Main = () => {
  const [addTodolist] = useAddTodolistMutation()

  const createTodolistHandler = (title: DomainTodolist['title']) => {
    addTodolist(title)
  }

  return (
    <Container maxWidth={'lg'}>
      <Grid container sx={{ p: '30px 0' }}>
        <CreateItemForm onCreateItem={createTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
