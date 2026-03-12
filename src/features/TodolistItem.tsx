import styles from './TodolistItem.module.css'
import type { FilterValues, Task, Todolist } from '@/app/App'
import { type ChangeEvent, type KeyboardEvent, useState } from 'react'
import { Button } from '@/common/components/Button/Button'

type Props = {
  todolist: Todolist
  tasks: Task[]
  deleteTask: (taskId: Task['id']) => void
  changeFilter: (todolistId: string, filter: FilterValues) => void
  createTask: (title: Task['title']) => void
  changeTaskStatus: (taskId: Task['id'], isDone: Task['isDone']) => void
}

export const TodolistItem = ({ todolist, tasks, deleteTask, changeFilter, createTask, changeTaskStatus }: Props) => {
  const [taskTitle, setTaskTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createTaskHandler = (taskTitle: Task['title']) => {
    const trimmedTitle = taskTitle.trim()
    if (trimmedTitle) {
      createTask(trimmedTitle)
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
    changeFilter(todolist.id, filter)
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
              changeTaskStatus(task.id, newStatusValue)
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
                  onClick={() => deleteTask(task.id)}
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
}
