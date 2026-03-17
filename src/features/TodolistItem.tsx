import styles from './TodolistItem.module.css'
import type { FilterValues, Task, Todolist } from '@/app/App'
import { type ChangeEvent, memo, useCallback } from 'react'
import { Button } from '@/common/components/Button/Button'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'

type Props = {
  todolist: Todolist
  tasks: Task[]
  deleteTask: (payload: { todolistId: Todolist['id']; taskId: Task['id'] }) => void
  changeFilter: (payload: { todolistId: Todolist['id']; filter: FilterValues }) => void
  createTask: (payload: { todolistId: Todolist['id']; title: Task['title'] }) => void
  changeTaskStatus: (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) => void
  deleteTodolist: (id: Todolist['id']) => void
}

export const TodolistItem = memo(
  ({ todolist, tasks, deleteTask, changeFilter, createTask, changeTaskStatus, deleteTodolist }: Props) => {
    const changeFilterHandler = useCallback(
      (filter: FilterValues) => {
        changeFilter({ todolistId: todolist.id, filter })
      },
      [changeFilter, todolist.id],
    )

    const deleteTodolistHandler = useCallback(() => {
      deleteTodolist(todolist.id)
    }, [deleteTodolist, todolist.id])

    const createTaskHandler = useCallback(
      (title: Task['title']) => {
        createTask({ todolistId: todolist.id, title })
      },
      [createTask, todolist.id],
    )

    return (
      <div>
        <div className={styles.container}>
          <h3>{todolist.title}</h3>{' '}
          <Button
            title={'x'}
            onClick={deleteTodolistHandler}
          />
        </div>
        <CreateItemForm onCreateItem={createTaskHandler} />
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
