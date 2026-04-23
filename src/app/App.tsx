import styles from './App.module.css'
import { useAppSelector } from '@/common/hooks'
import { ErrorSnackbar, Header } from '@/common/components'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { selectThemeMode } from '@/app/model/app-slice'
import { getTheme } from '@/common/theme/theme'
import { useMemo } from 'react'
import { Routing } from '@/common/components'

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = useMemo(() => getTheme(themeMode), [themeMode])

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
