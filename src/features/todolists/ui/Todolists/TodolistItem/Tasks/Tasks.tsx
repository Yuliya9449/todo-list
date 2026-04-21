import List from '@mui/material/List'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { TaskItem } from '@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem'
import { fetchTodolistsTC, selectTasks } from '@/features/todolists/model/tasks-slice'
import type { DomainTodolist, FilterValues } from '@/features/todolists/model/todolists-slice'
import { useEffect } from 'react'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { TaskStatus } from '@/common/enums'

type Props = {
  todolist: DomainTodolist
}

const getFilteredTasks = (tasks: DomainTask[], filter: FilterValues): DomainTask[] => {
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
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  const todolistTasks = tasks[todolist.id]
  const filteredTasks = getFilteredTasks(todolistTasks, todolist.filter)

  useEffect(() => {
    dispatch(fetchTodolistsTC(todolist.id))
  }, [dispatch, todolist.id])

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
                todolist={todolist}
                task={task}
              />
            )
          })}
        </List>
      )}
    </>
  )
}
