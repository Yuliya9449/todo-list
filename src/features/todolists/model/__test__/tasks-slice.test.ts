import { beforeEach, expect, test } from 'vitest'
import type { TasksState } from '@/app/App'
import { changeTaskTC, createTaskTC, deleteTaskTC, tasksReducer } from '@/features/todolists/model/tasks-slice'
import { createTodolistTC, deleteTodolistTC } from '@/features/todolists/model/todolists-slice'
import { TaskPriority, TaskStatus } from '@/common/enums'
import type { DomainTask } from '@/features/todolists/api/tasksApi.types'
import { nanoid } from '@reduxjs/toolkit'

const taskDefaultValues = {
  description: '',
  deadline: '',
  addedDate: '',
  startDate: '',
  priority: TaskPriority.Low,
  order: 0,
}

let startState: TasksState

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatus.New,
        todoListId: 'todolistId1',
        ...taskDefaultValues,
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatus.Completed,
        todoListId: 'todolistId1',
        ...taskDefaultValues,
      },
      {
        id: '3',
        title: 'React',
        status: TaskStatus.New,
        todoListId: 'todolistId1',
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatus.New,
        todoListId: 'todolistId2',
        ...taskDefaultValues,
      },
      {
        id: '2',
        title: 'milk',
        status: TaskStatus.Completed,
        todoListId: 'todolistId2',
        ...taskDefaultValues,
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatus.New,
        todoListId: 'todolistId2',
        ...taskDefaultValues,
      },
    ],
  }
})

test('array should be created for new todolist', () => {
  const title = 'New todolist'
  const todolist = { id: 'todolistId3', title, addedDate: '', order: 0 }

  const endState = tasksReducer(startState, createTodolistTC.fulfilled({ todolist }, 'requestId', 'New todolist'))

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== 'todolistId1' && k !== 'todolistId2')
  if (!newKey) {
    throw Error('New key should be added')
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
  const endState = tasksReducer(
    startState,
    deleteTodolistTC.fulfilled({ id: 'todolistId2' }, 'requestId', { id: 'todolistId2' }),
  )

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId2']).toBeUndefined()
})

// delete task

test('correct task should be deleted', () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled(
      {
        todolistId: 'todolistId2',
        taskId: '2',
      },
      'requestId',
      { todolistId: 'todolistId2', taskId: '2' },
    ),
  )

  expect(endState).toEqual({
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatus.New,
        todoListId: 'todolistId1',
        ...taskDefaultValues,
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatus.Completed,
        todoListId: 'todolistId1',
        ...taskDefaultValues,
      },
      {
        id: '3',
        title: 'React',
        status: TaskStatus.New,
        todoListId: 'todolistId1',
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatus.New,
        todoListId: 'todolistId2',
        ...taskDefaultValues,
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatus.New,
        todoListId: 'todolistId2',
        ...taskDefaultValues,
      },
    ],
  })
})

test('should not crash when deleting task from non-existent todolist', () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled(
      {
        todolistId: 'non-existent',
        taskId: '1',
      },
      'requestId',
      {
        todolistId: 'non-existent',
        taskId: '1',
      },
    ),
  )

  expect(() => {
    tasksReducer(
      startState,
      deleteTaskTC.fulfilled(
        {
          todolistId: 'non-existent',
          taskId: '1',
        },
        'requestId',
        {
          todolistId: 'non-existent',
          taskId: '1',
        },
      ),
    )
  }).not.toThrow()
  expect(endState).toEqual(startState)
})

test('should not affect state when deleting non-existent task', () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled(
      {
        todolistId: 'todolistId1',
        taskId: 'non-existent',
      },
      'requestId',
      {
        todolistId: 'todolistId1',
        taskId: 'non-existent',
      },
    ),
  )

  expect(endState).toEqual(startState)
})

test('should not affect other todolists when task is deleted', () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled(
      {
        todolistId: 'todolistId2',
        taskId: '2',
      },
      'requestId',
      {
        todolistId: 'todolistId2',
        taskId: '2',
      },
    ),
  )

  expect(endState.todolistId1).toEqual(startState.todolistId1)
})

// create task

test('correct task should be created at correct array', () => {
  const payload = { todolistId: 'todolistId2', title: 'juice' }
  const newTask: DomainTask = {
    todoListId: 'todolistId2',
    title: 'juice',
    id: nanoid(),
    status: 0,
    ...taskDefaultValues,
  }
  const endState = tasksReducer(startState, createTaskTC.fulfilled(newTask, 'requestId', payload))

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeTruthy()
  expect(endState.todolistId2[0].title).toBe('juice')
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test('should not crash when create task for non-existent todolist', () => {
  const payload = { todolistId: 'non-existent', title: 'title' }
  const newTask: DomainTask = {
    todoListId: 'non-existent',
    title: 'title',
    id: nanoid(),
    status: 0,
    ...taskDefaultValues,
  }
  expect(() => {
    tasksReducer(startState, createTaskTC.fulfilled(newTask, 'requestId', payload))
  }).not.toThrow()
})

// change task

test('correct task should change its status', () => {
  const task = {
    id: '2',
    title: 'milk',
    status: TaskStatus.New,
    description: '',
    deadline: '',
    addedDate: '',
    startDate: '',
    priority: TaskPriority.Low,
    order: 0,
    todoListId: 'todolistId2',
  }

  const endState = tasksReducer(startState, changeTaskTC.fulfilled(task, 'requestId', task))

  expect(endState.todolistId2[1].status).toBe(TaskStatus.New)
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed)
})

test('correct task should change its title', () => {
  const task = {
    id: '2',
    title: 'sugar',
    status: TaskStatus.Completed,
    description: '',
    deadline: '',
    addedDate: '',
    startDate: '',
    priority: TaskPriority.Low,
    order: 0,
    todoListId: 'todolistId2',
  }
  const endState = tasksReducer(startState, changeTaskTC.fulfilled(task, 'requestId', task))

  expect(endState.todolistId2[1].title).toBe('sugar')
  expect(endState.todolistId2[1].status).toBe(TaskStatus.Completed)
})

test('should not affect state when changing non-existent task', () => {
  const task = {
    id: 'non-existent',
    title: 'New',
    status: TaskStatus.Completed,
    description: '',
    deadline: '',
    addedDate: '',
    startDate: '',
    priority: TaskPriority.Low,
    order: 0,
    todoListId: 'todolistId1',
  }
  const endState = tasksReducer(startState, changeTaskTC.fulfilled(task, 'requestId', task))

  expect(endState).toEqual(startState)
})

test('should not crash when changing task from non-existent todolist', () => {
  const task = {
    id: '1',
    title: 'New',
    status: TaskStatus.Completed,
    description: '',
    deadline: '',
    addedDate: '',
    startDate: '',
    priority: TaskPriority.Low,
    order: 0,
    todoListId: 'non-existent',
  }
  expect(() => {
    tasksReducer(startState, changeTaskTC.fulfilled(task, 'requestId', task))
  }).not.toThrow()
})
