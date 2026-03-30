import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

type Props = {
  onClick: () => void
}

export const DeleteButton = ({ onClick }: Props) => {
  return (
    <IconButton onClick={onClick}>
      <DeleteIcon />
    </IconButton>
  )
}
