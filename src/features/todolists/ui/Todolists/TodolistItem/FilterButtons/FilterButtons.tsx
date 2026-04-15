import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import type { FilterValues } from '@/app/App'
import { changeTodolistFilterAC } from '@/features/todolists/model/todolists-slice'
import { useAppDispatch } from '@/common/hooks'
import type { DomainTodolist } from '@/features/todolists/model/todolists-slice'

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    dispatch(changeTodolistFilterAC({ todolistId: id, filter }))
  }

  return (
    <Grid
      container
      spacing={2}
    >
      <Button
        variant={filter === 'all' ? 'outlined' : 'text'}
        color={'inherit'}
        onClick={() => changeFilter('all')}
      >
        All
      </Button>
      <Button
        variant={filter === 'active' ? 'outlined' : 'text'}
        color={'primary'}
        onClick={() => changeFilter('active')}
      >
        Active
      </Button>
      <Button
        variant={filter === 'completed' ? 'outlined' : 'text'}
        color={'secondary'}
        onClick={() => changeFilter('completed')}
      >
        Completed
      </Button>
    </Grid>
  )
}
