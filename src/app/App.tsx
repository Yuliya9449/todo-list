import styles from './App.module.css'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { createTodolistAC } from '@/features/model/todolists-reducer'
import { useAppDispatch } from '@/common/hooks'
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<Todolist['id'], Task[]>

export type FilterValues = 'all' | 'active' | 'completed'

export const App = () => {
  const dispatch = useAppDispatch()

  const createTodolistHandler = (title: Todolist['title']) => dispatch(createTodolistAC(title))

  return (
    <div className={styles.app}>
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
    </div>
  )
}
