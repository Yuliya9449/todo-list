import List from '@mui/material/List'

import type { FilterValues, Task, Todolist } from '@/app/App'
import { useAppSelector } from '@/common/hooks'
import { selectTasks } from '@/features/todolists/model/tasks-selectors'
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem'

type Props = {
  todolist: Todolist
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
      {filteredTasks.length === 0 ? (
        <p>Tasks are absent</p>
      ) : (
        <List>
          {filteredTasks.map((task) => {
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
