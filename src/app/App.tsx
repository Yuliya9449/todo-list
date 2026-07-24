import styles from './App.module.css'
import { useAppSelector } from '@/common/hooks'
import { ErrorSnackbar, Header, Routing } from '@/common/components'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { selectThemeMode } from '@/app/model/app-slice'
import { getTheme } from '@/common/theme/theme'
import { useMemo } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { useMeQuery } from '@/features/auth/api/authApi'

export const App = () => {
  const { isLoading } = useMeQuery()

  const themeMode = useAppSelector(selectThemeMode)
  const theme = useMemo(() => getTheme(themeMode), [themeMode])

  if (isLoading) {
    return (
      <div className={styles.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
