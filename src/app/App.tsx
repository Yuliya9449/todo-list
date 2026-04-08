import styles from './App.module.css'
import { useAppSelector } from '@/common/hooks'
import { Header } from '@/common/components/Header/Header'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { selectThemeMode } from '@/app/model/app-slice'
import { getTheme } from '@/common/theme/theme'
import { Main } from '@/app/Main'

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
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <CssBaseline />
        <Header />
        <Main />
      </div>
    </ThemeProvider>
  )
}
