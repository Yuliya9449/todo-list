import styles from './TodolistItem.module.css'
import type { FilterValues, Task, Todolist } from '@/app/App'
import { type ChangeEvent, memo, useCallback } from 'react'
import { Button } from '@/common/components/Button/Button'
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm'
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan'
import { useAppDispatch, useAppSelector } from '@/common/hooks'
import { selectTasks } from '@/features/model/tasks-selectors'
import { changeTaskAC, createTaskAC, deleteTaskAC } from '@/features/model/tasks-reducer'
import { changeTodolistAC, deleteTodolistAC } from '@/features/model/todolists-reducer'

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

  const changeFilter = (payload: { todolistId: Todolist['id']; filter: FilterValues }) =>
    dispatch(changeTodolistAC(payload))

  const createTask = (payload: { todolistId: Todolist['id']; title: Task['title'] }) => dispatch(createTaskAC(payload))

  const changeTaskStatus = (payload: { todolistId: Todolist['id']; taskId: Task['id']; isDone: Task['isDone'] }) =>
    dispatch(changeTaskAC(payload))

  const deleteTodolist = (todolistId: Todolist['id']) => dispatch(deleteTodolistAC({ todolistId }))

  const changeTodolistTitle = (payload: { todolistId: Todolist['id']; title: Todolist['title'] }) =>
    dispatch(changeTodolistAC(payload))

  const changeTaskTitle = (payload: { todolistId: Todolist['id']; taskId: Task['id']; title: Task['title'] }) =>
    dispatch(changeTaskAC(payload))

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

  const changeTodolistTitleHandler = useCallback(
    (title: Todolist['title']) => {
      changeTodolistTitle({ todolistId: todolist.id, title })
    },
    [changeTodolistTitle, todolist.id],
  )

  return (
    <div>
      <div className={styles.container}>
        <h3>
          <EditableSpan
            value={todolist.title}
            onChangeValue={changeTodolistTitleHandler}
          />
        </h3>
        <Button
          title={'x'}
          onClick={deleteTodolistHandler}
        />
      </div>
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
})
