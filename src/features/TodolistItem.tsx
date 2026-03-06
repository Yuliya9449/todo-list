import type { FilterValues, Task } from '@/app/App'
import { Button } from '@/common/Button/Button'
import { useRef, type KeyboardEvent } from 'react'

type Props = {
  title: Task['title']
  tasks: Task[]
  deleteTask: (taskId: Task['id']) => void
  changeFilter: (filter: FilterValues) => void
  createTask: (title: Task['title']) => void
}

export const TodolistItem = ({ title, tasks, deleteTask, changeFilter, createTask }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const createTaskHandler = () => {
    if (inputRef.current) {
      createTask(inputRef.current.value)
      inputRef.current.value = ''
    }
  }

  const createTaskOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      createTaskHandler()
    }
  }

  return (
    <div>
      <h3>{title}</h3>
      <div>
        <input
          ref={inputRef}
          onKeyDown={createTaskOnEnterHandler}
        />
        <Button
          title={'+'}
          onClick={createTaskHandler}
        />
      </div>
      {tasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <ul>
          {tasks.map((task) => {
            return (
              <li key={task.id}>
                <input
                  type="checkbox"
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
          title={'All'}
          onClick={() => changeFilter('all')}
        />
        <Button
          title={'Active'}
          onClick={() => changeFilter('active')}
        />
        <Button
          title={'Completed'}
          onClick={() => changeFilter('completed')}
        />
      </div>
    </div>
  )
}
