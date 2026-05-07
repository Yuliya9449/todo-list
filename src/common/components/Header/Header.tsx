import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { NavButton } from '@/common/components/NavButton/NavButton'
import Switch from '@mui/material/Switch'
import LinearProgress from '@mui/material/LinearProgress'
import { changeThemeModeAC, selectRequestStatus, selectThemeMode } from '@/app/model/app-slice'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { getTheme } from '@/common/theme/theme'
import { logoutTC, selectIsLoggedIn, selectLoginName } from '@/features/auth/model/slices/auth-slice'
import { useNavigate } from 'react-router'
import { RoutePath } from '@/common/constants'

export const Header = () => {
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
    dispatch(logoutTC())
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
