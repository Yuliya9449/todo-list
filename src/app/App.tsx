import styles from './App.module.css'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { ErrorSnackbar, Header, Routing } from '@/common/components'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { selectThemeMode } from '@/app/model/app-slice'
import { getTheme } from '@/common/theme/theme'
import { useEffect, useMemo, useState } from 'react'
import { meTC } from '@/features/auth/model/slices/auth-slice'
import CircularProgress from '@mui/material/CircularProgress'

export const App = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const themeMode = useAppSelector(selectThemeMode)
  const theme = useMemo(() => getTheme(themeMode), [themeMode])

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(meTC())
      .unwrap()
      .finally(() => {
        setIsAppInitialized(true)
      })
  }, [dispatch])

  if (!isAppInitialized) {
    return (
      <div className={styles.circularProgressContainer}>
        <CircularProgress
          size={150}
          thickness={3}
        />
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
