import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { NavButton } from '@/common/components/NavButton/NavButton'

export const Header = () => {
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
            <NavButton background={'dodgerblue'}>Faq</NavButton>
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  )
}
