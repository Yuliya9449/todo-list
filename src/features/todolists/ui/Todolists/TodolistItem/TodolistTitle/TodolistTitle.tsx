import Grid from '@mui/material/Grid'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { DeleteButton } from '@/common/components/DeleteButton/DeleteButton'
import { useChangeTodolistTitleMutation, useDeleteTodolistMutation } from '@/features/todolists/api/todolistsApi'
import type { DomainTodolist } from '@/features/todolists/lib/types'

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, isDisabled } = todolist

  const [deleteTodolist] = useDeleteTodolistMutation()
  const [changeTodolistTitle] = useChangeTodolistTitleMutation()

  const deleteTodolistHandler = () => {
    deleteTodolist(id)
  }

  const changeTodolistTitleHandler = (title: DomainTodolist['title']) => {
    changeTodolistTitle({ id, title })
  }

  return (
    <Grid container sx={{ alignItems: 'center' }}>
      <EditableSpan disabled={isDisabled} value={title} onChangeValue={changeTodolistTitleHandler} />
      <DeleteButton disabled={isDisabled} onClick={deleteTodolistHandler} />
    </Grid>
  )
}
