import { type ChangeEvent, type KeyboardEvent, useState } from 'react'
import TextField from '@mui/material/TextField'

type Props = {
  value: string
  onChangeValue: (title: string) => void
}

export const EditableSpan = ({ value, onChangeValue }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [title, setTitle] = useState('')

  const activateEditMode = () => {
    setIsEditMode(true)
    setTitle(value)
  }

  const deactivateEditMode = () => {
    setIsEditMode(false)

    const trimmedTitle = title.trim()

    if (trimmedTitle && trimmedTitle !== value) {
      onChangeValue(trimmedTitle)
    } else {
      setTitle(value)
    }
  }

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  const deactivateEditModeOnEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      deactivateEditMode()
    }
  }

  return (
    <>
      {isEditMode ? (
        <TextField
          variant={'outlined'}
          size={'small'}
          autoFocus
          value={title}
          onChange={onChangeHandler}
          onBlur={deactivateEditMode}
          onKeyDown={deactivateEditModeOnEnter}
        />
      ) : (
        <span
          style={{ cursor: 'pointer' }}
          onDoubleClick={activateEditMode}
        >
          {value}
        </span>
      )}
    </>
  )
}
