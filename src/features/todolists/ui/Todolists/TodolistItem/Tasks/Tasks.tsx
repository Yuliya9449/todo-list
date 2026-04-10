import List from '@mui/material/List'

import type { FilterValues, Task } from '@/app/App'
import { useAppSelector } from '@/common/hooks'
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem'
import { selectTasks } from '@/features/todolists/model/tasks-slice'
import type { DomainTodolist } from '@/features/todolists/api/todolistsApi.types'

type Props = {
  todolist: DomainTodolist
}

const getFilteredTasks = (tasks: Task[], filter: FilterValues): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter((task) => !task.isDone)
    case 'completed':
      return tasks.filter((task) => task.isDone)
    default:
      return tasks
  }
}

export const Tasks = ({ todolist }: Props) => {
  const tasks = useAppSelector(selectTasks)

  const todolistTasks = tasks[todolist.id]
  const filteredTasks = getFilteredTasks(todolistTasks, todolist.filter)

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Tasks are absent</p>
      ) : (
        <List>
          {filteredTasks?.map((task) => {
            return (
              <TaskItem
                key={task.id}
                todolistId={todolist.id}
                task={task}
              />
            )
          })}
        </List>
      )}
    </>
  )
}
