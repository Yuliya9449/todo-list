import Grid from '@mui/material/Grid'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { changeTodolistAC, deleteTodolistAC } from '@/features/todolists/model/todolists-slice'
import { useAppDispatch } from '@/common/hooks'
import { DeleteButton } from '@/common/components/DeleteButton/DeleteButton'
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types'

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title } = todolist
  const dispatch = useAppDispatch()

  const deleteTodolist = () => {
    dispatch(deleteTodolistAC({ todolistId: id }))
  }

  const changeTodolistTitle = (title: DomainTodolist['title']) => {
    dispatch(changeTodolistAC({ todolistId: id, title }))
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
