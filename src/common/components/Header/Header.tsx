import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { NavButton } from '@/common/components/NavButton/NavButton'
import Switch from '@mui/material/Switch'
import LinearProgress from '@mui/material/LinearProgress'
import { changeThemeModeAC, selectRequestStatus } from '@/app/model/app-slice'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { selectThemeMode } from '@/app/model/app-slice'
import { getTheme } from '@/common/theme/theme'

export const Header = () => {
  const requestStatus = useAppSelector(selectRequestStatus)

  const dispatch = useAppDispatch()

  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  const changeModeHandler = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === 'light' ? 'dark' : 'light' }))
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Container sx={{ maxWidth: 'lg', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            <NavButton>Sign in</NavButton>
            <NavButton>Sign up</NavButton>
            <NavButton background={theme.palette.primary.dark}>Faq</NavButton>
            <Switch
              color={'default'}
              onChange={changeModeHandler}
            />
          </div>
        </Container>
      </Toolbar>
      {requestStatus === 'loading' ? <LinearProgress /> : <div style={{ height: '4px' }} />}
    </AppBar>
  )
}
