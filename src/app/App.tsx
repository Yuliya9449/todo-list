import styles from './App.module.css'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { ErrorSnackbar, Header, Routing } from '@/common/components'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { selectThemeMode, setIsLoggedInAC, setLoginNameAC } from '@/app/model/app-slice'
import { getTheme } from '@/common/theme/theme'
import { useEffect, useMemo } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { useMeQuery } from '@/features/auth/api/authApi'
import { ResultCode } from '@/common/enums'

export const App = () => {
  const { data, isLoading } = useMeQuery()

  const themeMode = useAppSelector(selectThemeMode)
  const theme = useMemo(() => getTheme(themeMode), [themeMode])

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isLoading) return
    if (data?.resultCode === ResultCode.Success) {
      dispatch(setIsLoggedInAC({ isLoggedIn: true }))
      dispatch(setLoginNameAC({ loginName: data.data.login }))
    } else {
      dispatch(setIsLoggedInAC({ isLoggedIn: false }))
      dispatch(setLoginNameAC({ loginName: null }))
    }
    // ! одна и та же логика в App.tsx, Login.tsx, Header.tsx
  }, [data?.data.login, data?.resultCode, dispatch, isLoading])

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
