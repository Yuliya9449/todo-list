import { type ChangeEvent, type KeyboardEvent, memo, useCallback, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import AddBoxIcon from '@mui/icons-material/AddBox'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

type Props = {
  onCreateItem: (title: string) => void
}

export const CreateItemForm = memo(({ onCreateItem }: Props) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createItemHandler = useCallback(
    (title: string) => {
      const trimmedTitle = title.trim()
      if (trimmedTitle) {
        onCreateItem(trimmedTitle)
        setTitle('')
      } else {
        setError('Title is required')
      }
    },
    [onCreateItem],
  )

  const createItemOnEnterHandler = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        createItemHandler(title)
      }
    },
    [createItemHandler, title],
  )

  const changeItemTitleHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
    setError(null)
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        mb: 2,
        width: '100%',
        maxWidth: 400,
      }}
    >
      <TextField
        label={'Enter a title'}
        variant={'outlined'}
        size={'small'}
        error={!!error}
        helperText={error}
        value={title}
        onChange={changeItemTitleHandler}
        onKeyDown={createItemOnEnterHandler}
      />
      <IconButton
        color={'primary'}
        onClick={() => createItemHandler(title)}
      >
        <AddBoxIcon />
      </IconButton>
    </Box>
  )
})
