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
import { useNavigate } from 'react-router'
import { RoutePath } from '@/common/constants'
import { useLogoutMutation, useMeQuery } from '@/features/auth/api/authApi'
import { ResultCode } from '@/common/enums'

export const Header = () => {
  const { data, isLoading } = useMeQuery()

  const isLoggedIn = data?.resultCode === ResultCode.Success && !isLoading

  const [logout] = useLogoutMutation()

  const requestStatus = useAppSelector(selectRequestStatus)
  const themeMode = useAppSelector(selectThemeMode)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const theme = getTheme(themeMode)

  const changeModeHandler = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === 'light' ? 'dark' : 'light' }))
  }

  const logoutHandler = () => {
    logout()
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Container sx={{ maxWidth: 'lg', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            <span style={{ marginRight: '16px' }}>{data?.data.login || 'User'}</span>
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
