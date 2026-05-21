import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { useAppDispatch } from '@/common/hooks'
import { todolistsApi } from '@/features/todolists/api/todolistsApi'
import type { DomainTodolist, FilterValues } from '@/features/todolists/lib/types'

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const dispatch = useAppDispatch()

  const changeTodolistFilter = (filter: FilterValues) => {
    dispatch(
      todolistsApi.util.updateQueryData('getTodolists', undefined, (draftTodolists) => {
        const todolist = draftTodolists.find((t) => t.id === id)
        if (todolist) {
          todolist.filter = filter
        }
      }),
    )
  }

  return (
    <Grid container spacing={2}>
      <Button
        variant={filter === 'all' ? 'outlined' : 'text'}
        color={'inherit'}
        onClick={() => changeTodolistFilter('all')}
      >
        All
      </Button>
      <Button
        variant={filter === 'active' ? 'outlined' : 'text'}
        color={'primary'}
        onClick={() => changeTodolistFilter('active')}
      >
        Active
      </Button>
      <Button
        variant={filter === 'completed' ? 'outlined' : 'text'}
        color={'secondary'}
        onClick={() => changeTodolistFilter('completed')}
      >
        Completed
      </Button>
    </Grid>
  )
}
