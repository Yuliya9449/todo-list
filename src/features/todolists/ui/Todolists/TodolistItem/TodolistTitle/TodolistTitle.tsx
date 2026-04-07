import Grid from '@mui/material/Grid'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import type { Todolist } from '@/app/App'
import { changeTodolistAC, deleteTodolistAC } from '@/features/todolists/model/todolists-reducer'
import { useAppDispatch } from '@/common/hooks'
import { DeleteButton } from '@/common/components/DeleteButton/DeleteButton'

type Props = {
  todolist: Todolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title } = todolist
  const dispatch = useAppDispatch()

  const deleteTodolist = () => {
    dispatch(deleteTodolistAC({ todolistId: id }))
  }

  const changeTodolistTitle = (title: Todolist['title']) => {
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
