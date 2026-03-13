import styles from './TodolistItem.module.css'
import type { FilterValues, Task, Todolist } from '@/app/App'
import { type ChangeEvent, type KeyboardEvent, memo, useState } from 'react'
import { Button } from '@/common/components/Button/Button'

type Props = {
  todolist: Todolist
  tasks: Task[]
  deleteTask: (payload: { todolistId: Todolist['id']; taskId: Task['id'] }) => void
  changeFilter: (payload: { todolistId: Todolist['id']; filter: FilterValues }) => void
  createTask: (payload: { todolistId: Todolist['id']; title: Task['title'] }) => void
  changeTaskStatus: (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) => void
}

export const TodolistItem = memo(
  ({ todolist, tasks, deleteTask, changeFilter, createTask, changeTaskStatus }: Props) => {
    const [taskTitle, setTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const createTaskHandler = (taskTitle: string) => {
      const trimmedTitle = taskTitle.trim()
      if (trimmedTitle) {
        createTask({ todolistId: todolist.id, title: trimmedTitle })
        setTaskTitle('')
      } else {
        setError('Title is required')
      }
    }

    const createTaskOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        createTaskHandler(taskTitle)
      }
    }

    const changeTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setTaskTitle(e.currentTarget.value)
      setError(null)
    }

    const changeFilterHandler = (filter: FilterValues) => {
      changeFilter({ todolistId: todolist.id, filter })
    }

    return (
      <div>
        <h3>{todolist.title}</h3>
        <div>
          <input
            className={error ? styles.error : ''}
            value={taskTitle}
            onChange={changeTaskTitleHandler}
            onKeyDown={createTaskOnEnterHandler}
          />

          <Button
            title={'+'}
            onClick={() => createTaskHandler(taskTitle)}
          />
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
        {tasks.length === 0 ? (
          <p>Тасок нет</p>
        ) : (
          <ul>
            {tasks.map((task) => {
              const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                const newStatusValue = e.currentTarget.checked
                changeTaskStatus({ todolistId: todolist.id, taskId: task.id, isDone: newStatusValue })
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
                  <span>{task.title}</span>
                  <Button
                    title={'X'}
                    onClick={() => deleteTask({ todolistId: todolist.id, taskId: task.id })}
                  />
                </li>
              )
            })}
          </ul>
        )}
        <div>
          <Button
            isActive={todolist.filter === 'all'}
            title={'All'}
            onClick={() => changeFilterHandler('all')}
          />
          <Button
            isActive={todolist.filter === 'active'}
            title={'Active'}
            onClick={() => changeFilterHandler('active')}
          />
          <Button
            isActive={todolist.filter === 'completed'}
            title={'Completed'}
            onClick={() => changeFilterHandler('completed')}
          />
        </div>
      </div>
    )
  },
)
