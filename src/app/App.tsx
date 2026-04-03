import styles from './App.module.css'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { createTodolistAC } from '@/features/model/todolists-reducer'
import { useAppDispatch } from '@/common/hooks'
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { Header } from '@/common/components/Header/Header'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'

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

export type ThemeMode = 'dark' | 'light'

export const App = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
  const dispatch = useAppDispatch()

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#087EA4',
      },
    },
  })

  const changeThemeMode = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
  }

  const createTodolistHandler = (title: Todolist['title']) => dispatch(createTodolistAC(title))

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={styles.app}>
        <Header changeThemeMode={changeThemeMode} />
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
