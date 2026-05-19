import Grid from '@mui/material/Grid'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { type DomainTodolist } from '@/features/todolists/model/slices/todolists-slice'
import { DeleteButton } from '@/common/components/DeleteButton/DeleteButton'
import {
  todolistsApi,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation,
} from '@/features/todolists/api/todolistsApi'
import { useAppDispatch } from '@/common/hooks'
import { ResultCode } from '@/common/enums'

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, isDisabled } = todolist

  const [deleteTodolist] = useDeleteTodolistMutation()
  const [changeTodolistTitle] = useChangeTodolistTitleMutation()

  const dispatch = useAppDispatch()

  const setTodolistIsDisabled = (isDisabled: boolean) => {
    dispatch(
      todolistsApi.util.updateQueryData('getTodolists', undefined, (todolistsDraft) => {
        const todolist = todolistsDraft.find((td) => td.id === id)
        if (todolist) {
          todolist.isDisabled = isDisabled
        }
      }),
    )
  }

  const deleteTodolistHandler = () => {
    setTodolistIsDisabled(true)
    deleteTodolist(id)
      .unwrap()
      .then((data) => {
        if (data.resultCode !== ResultCode.Success) {
          setTodolistIsDisabled(false)
        }
      })
      .catch(() => setTodolistIsDisabled(false))
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
