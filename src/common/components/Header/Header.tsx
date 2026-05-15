import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { NavButton } from '@/common/components/NavButton/NavButton'
import Switch from '@mui/material/Switch'
import LinearProgress from '@mui/material/LinearProgress'
import {
  changeThemeModeAC,
  selectIsLoggedIn,
  selectLoginName,
  selectRequestStatus,
  selectThemeMode,
  setIsLoggedInAC,
  setLoginNameAC,
} from '@/app/model/app-slice'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { getTheme } from '@/common/theme/theme'
import { useNavigate } from 'react-router'
import { AUTH_TOKEN, RoutePath } from '@/common/constants'
import { useLogoutMutation } from '@/features/auth/api/authApi'
import { ResultCode } from '@/common/enums'

export const Header = () => {
  const [logout] = useLogoutMutation()
  // const [meQueryTrigger] = useLazyMeQuery()

  const requestStatus = useAppSelector(selectRequestStatus)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const loginName = useAppSelector(selectLoginName)
  const themeMode = useAppSelector(selectThemeMode)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const theme = getTheme(themeMode)

  const changeModeHandler = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === 'light' ? 'dark' : 'light' }))
  }

  const logoutHandler = () => {
    logout()
      .unwrap()
      .then((response) => {
        if (response.resultCode === ResultCode.Success) {
          localStorage.removeItem(AUTH_TOKEN)
          dispatch(setIsLoggedInAC({ isLoggedIn: false }))
          dispatch(setLoginNameAC({ loginName: null }))
        }
      })
    // .then(() => {
    //   return meQueryTrigger().unwrap()
    // })
    // .then((data) => {
    //   if (data?.resultCode === ResultCode.Success) {
    //     dispatch(setIsLoggedInAC({ isLoggedIn: true }))
    //     dispatch(setLoginNameAC({ loginName: data.data.login }))
    //   } else {
    //     dispatch(setIsLoggedInAC({ isLoggedIn: false }))
    //     dispatch(setLoginNameAC({ loginName: null }))
    //   }
    //   // ! одна и та же логика в App.tsx, Login.tsx, Header.tsx
    // })
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Container sx={{ maxWidth: 'lg', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            <span style={{ marginRight: '16px' }}>{loginName || 'User'}</span>
            <NavButton onClick={() => navigate(RoutePath.Main)}>Todolists</NavButton>
            <NavButton onClick={() => navigate(RoutePath.Faq)} background={theme.palette.primary.dark}>
              Faq
            </NavButton>
            {isLoggedIn && <NavButton onClick={logoutHandler}>Logout</NavButton>}
            <Switch color={'default'} onChange={changeModeHandler} />
          </div>
        </Container>
      </Toolbar>
      {requestStatus === 'loading' ? <LinearProgress /> : <div style={{ height: '4px' }} />}
    </AppBar>
  )
}
