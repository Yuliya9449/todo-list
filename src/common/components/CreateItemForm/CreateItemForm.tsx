import styles from './CreateItemForm.module.css'
import { Button } from '@/common/components/Button/Button'
import { type ChangeEvent, type KeyboardEvent, memo, useCallback, useState } from 'react'

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
    <div>
      <input
        className={error ? styles.error : ''}
        value={title}
        onChange={changeItemTitleHandler}
        onKeyDown={createItemOnEnterHandler}
      />

      <Button
        title={'+'}
        onClick={() => createItemHandler(title)}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  )
})
