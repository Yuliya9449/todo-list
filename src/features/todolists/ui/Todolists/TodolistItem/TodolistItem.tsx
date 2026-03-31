import styles from './TodolistItem.module.css'
import type { FilterValues, Task, Todolist } from '@/app/App'
import { type ChangeEvent, memo, useCallback } from 'react'
import { Button } from '@/common/components/Button/Button'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { selectTasks } from '@/features/model/tasks-selectors'
import { changeTaskAC, createTaskAC, deleteTaskAC } from '@/features/model/tasks-reducer'
import { TodolistTitle } from '@/features/todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle'
import { FilterButtons } from '@/features/todolists/ui/Todolists/TodolistItem/FilterButtons/FilterButtons'

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

type Props = {
  todolist: Todolist
}

export const TodolistItem = memo(({ todolist }: Props) => {
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  const todolistTasks = tasks[todolist.id]

  const filteredTasks = getFilteredTasks(todolistTasks, todolist.filter)

  const deleteTask = (payload: { todolistId: Todolist['id']; taskId: Task['id'] }) => dispatch(deleteTaskAC(payload))

  const createTask = (payload: { todolistId: Todolist['id']; title: Task['title'] }) => dispatch(createTaskAC(payload))

  const changeTaskStatus = (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) =>
    dispatch(changeTaskAC(payload))

  const changeTaskTitle = (payload: { todolistId: Todolist['id']; taskId: Task['id']; title: Task['title'] }) =>
    dispatch(changeTaskAC(payload))

  const createTaskHandler = useCallback(
    (title: Task['title']) => {
      createTask({ todolistId: todolist.id, title })
    },
    [createTask, todolist.id],
  )

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTaskHandler} />
      {filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => {
            const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
              const newStatusValue = e.currentTarget.checked
              changeTaskStatus({ todolistId: todolist.id, taskId: task.id, isDone: newStatusValue })
            }

            const changeTaskTitleHandler = (title: Task['title']) => {
              changeTaskTitle({ todolistId: todolist.id, taskId: task.id, title })
            }

            return (
              <li
                key={task.id}
                className={task.isDone ? styles.isDone : ''}
              >
                <input
                  type="checkbox"
                  onChange={changeTaskStatusHandler}
                  checked={task.isDone}
                />
                <EditableSpan
                  value={task.title}
                  onChangeValue={changeTaskTitleHandler}
                />
                <Button
                  title={'X'}
                  onClick={() => deleteTask({ todolistId: todolist.id, taskId: task.id })}
                />
              </li>
            )
          })}
        </ul>
      )}
      <FilterButtons todolist={todolist} />
    </div>
  )
})
