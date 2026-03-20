import { beforeEach, expect, test } from 'vitest'
import type { TasksState } from '@/app/App'
import { changeTaskAC, createTaskAC, deleteTaskAC, tasksReducer } from '@/features/model/tasks-reducer'
import { createTodolistAC, deleteTodolistAC } from '@/features/model/todolists-reducer'

let startState: TasksState

beforeEach(() => {
  startState = {
    todolistId1: [
      { id: '1', title: 'CSS', isDone: false },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
    ],
    todolistId2: [
      { id: '1', title: 'bread', isDone: false },
      { id: '2', title: 'milk', isDone: true },
      { id: '3', title: 'tea', isDone: false },
    ],
  }
})

test('array should be created for new todolist', () => {
  const endState = tasksReducer(startState, createTodolistAC('New todolist'))

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== 'todolistId1' && k !== 'todolistId2')
  if (!newKey) {
    throw Error('New key should be added')
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
  const endState = tasksReducer(startState, deleteTodolistAC({ todolistId: 'todolistId2' }))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId2']).toBeUndefined()
})

// delete task

test('correct task should be deleted', () => {
  const endState = tasksReducer(startState, deleteTaskAC({ todolistId: 'todolistId2', taskId: '2' }))

  expect(endState).toEqual({
    todolistId1: [
      { id: '1', title: 'CSS', isDone: false },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
    ],
    todolistId2: [
      { id: '1', title: 'bread', isDone: false },
      { id: '3', title: 'tea', isDone: false },
    ],
  })
})

test('should not crash when deleting task from non-existent todolist', () => {
  const endState = tasksReducer(
    startState,
    deleteTaskAC({
      todolistId: 'non-existent',
      taskId: '1',
    }),
  )

  expect(() => {
    tasksReducer(
      startState,
      deleteTaskAC({
        todolistId: 'non-existent',
        taskId: '1',
      }),
    )
  }).not.toThrow()
  expect(endState).toEqual(startState)
})

test('should not affect state when deleting non-existent task', () => {
  const endState = tasksReducer(
    startState,
    deleteTaskAC({
      todolistId: 'todolistId1',
      taskId: 'non-existent',
    }),
  )

  expect(endState).toEqual(startState)
})

test('should not affect other todolists when task is deleted', () => {
  const endState = tasksReducer(
    startState,
    deleteTaskAC({
      todolistId: 'todolistId2',
      taskId: '2',
    }),
  )

  expect(endState.todolistId1).toEqual(startState.todolistId1)
})

// create task

test('correct task should be created at correct array', () => {
  const endState = tasksReducer(
    startState,
    createTaskAC({
      todolistId: 'todolistId2',
      title: 'juice',
    }),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeTruthy()
  expect(endState.todolistId2[0].title).toBe('juice')
  expect(endState.todolistId2[0].isDone).toBe(false)
})

test('should not crash when create task for non-existent todolist', () => {
  expect(() => {
    tasksReducer(
      startState,
      createTaskAC({
        todolistId: 'non-existent',
        title: 'title',
      }),
    )
  }).not.toThrow()
})

// change task

test('correct task should change its status', () => {
  const endState = tasksReducer(startState, changeTaskAC({ todolistId: 'todolistId2', taskId: '2', isDone: false }))

  expect(endState.todolistId2[1].isDone).toBe(!startState.todolistId2[1].isDone)
})

test('correct task should change its title', () => {
  const endState = tasksReducer(startState, changeTaskAC({ todolistId: 'todolistId2', taskId: '2', title: 'sugar' }))

  expect(endState.todolistId2[1].title).toBe('sugar')
  expect(endState.todolistId2[1].isDone).toBe(true)
})

test('should not affect state when changing non-existent task', () => {
  const endState = tasksReducer(
    startState,
    changeTaskAC({
      todolistId: 'todolistId1',
      taskId: 'non-existent',
      title: 'New',
    }),
  )

  expect(endState).toEqual(startState)
})

test('should not crash when changing task from non-existent todolist', () => {
  expect(() => {
    tasksReducer(
      startState,
      changeTaskAC({
        todolistId: 'non-existent',
        taskId: '1',
      }),
    )
  }).not.toThrow()
})
