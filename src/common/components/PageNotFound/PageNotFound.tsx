import styles from './PageNotFound.module.css'
import Button from '@mui/material/Button'
import { Link } from 'react-router'
import { Path } from '@/common/components'
import Container from '@mui/material/Container'

export const PageNotFound = () => {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>page not found</h2>
      <Button
        component={Link}
        to={Path.Main}
        variant={'contained'}
        sx={{ mt: '20px' }}
      >
        On Main Page
      </Button>
    </Container>
  )
}
