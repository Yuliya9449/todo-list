import List from '@mui/material/List'
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem'
import type { DomainTodolist, FilterValues } from '@/features/todolists/model/slices/todolists-slice'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { TaskStatus } from '@/common/enums'
import { useGetTasksQuery } from '@/features/todolists/api/tasksApi'

type Props = {
  todolist: DomainTodolist
}

const getFilteredTasks = (tasks: DomainTask[] | undefined, filter: FilterValues) => {
  if (!tasks) return

  switch (filter) {
    case 'active':
      return tasks.filter((task) => task.status === TaskStatus.New)
    case 'completed':
      return tasks.filter((task) => task.status === TaskStatus.Completed)
    default:
      return tasks
  }
}

export const Tasks = ({ todolist }: Props) => {
  const { data } = useGetTasksQuery(todolist.id)

  const filteredTasks = getFilteredTasks(data?.items, todolist.filter)

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Tasks are absent</p>
      ) : (
        <List>
          {filteredTasks?.map((task) => {
            return <TaskItem key={task.id} todolist={todolist} task={task} />
          })}
        </List>
      )}
    </>
  )
}
