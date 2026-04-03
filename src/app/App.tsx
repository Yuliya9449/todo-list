import styles from './App.module.css'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { createTodolistAC } from '@/features/model/todolists-reducer'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { Header } from '@/common/components/Header/Header'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { selectThemeMode } from '@/app/model/app-selectors'
import { getTheme } from '@/common/theme/theme'

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

  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  const createTodolistHandler = (title: Todolist['title']) => dispatch(createTodolistAC(title))

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={styles.app}>
        <Header />
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
    </ThemeProvider>
  )
}
