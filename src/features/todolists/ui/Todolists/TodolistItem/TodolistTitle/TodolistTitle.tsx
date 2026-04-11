import Grid from '@mui/material/Grid'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { changeTodolistTitleTC, deleteTodolistTC } from '@/features/todolists/model/todolists-slice'
import { useAppDispatch } from '@/common/hooks'
import { DeleteButton } from '@/common/components/DeleteButton/DeleteButton'
import type { DomainTodolist } from '@/features/todolists/model/todolists-slice'

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title } = todolist
  const dispatch = useAppDispatch()

  const deleteTodolist = () => {
    dispatch(deleteTodolistTC({ id }))
  }

  const changeTodolistTitle = (title: DomainTodolist['title']) => {
    dispatch(changeTodolistTitleTC({ id, title }))
  }

  return (
    <Grid
      container
      sx={{ alignItems: 'center' }}
    >
      <EditableSpan
        value={title}
        onChangeValue={changeTodolistTitle}
      />
      <DeleteButton onClick={deleteTodolist} />
    </Grid>
  )
}
