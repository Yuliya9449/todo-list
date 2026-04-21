import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof IconButton> & {
  onClick: () => void
}

export const DeleteButton = ({ onClick, ...rest }: Props) => {
  return (
    <IconButton
      onClick={onClick}
      {...rest}
    >
      <DeleteIcon />
    </IconButton>
  )
}
