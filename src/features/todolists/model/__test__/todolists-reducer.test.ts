import { beforeEach, expect, test } from 'vitest'
import {
  changeTodolistAC,
  createTodolistAC,
  deleteTodolistAC,
  todolistsReducer,
} from '@/features/todolists/model/todolists-reducer'
import type { Todolist } from '@/app/App'
import { nanoid } from '@reduxjs/toolkit'

let startState: Todolist[]

const todolistId1 = nanoid()
const todolistId2 = nanoid()

beforeEach(() => {
  startState = [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ]
})

// delete Todolist

test('correct todolist should be deleted', () => {
  const endState = todolistsReducer(startState, deleteTodolistAC({ todolistId: todolistId1 }))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('should not affect other todolists when one is deleted', () => {
  const endState = todolistsReducer(startState, deleteTodolistAC({ todolistId: todolistId1 }))

  expect(endState).toEqual([{ id: todolistId2, title: 'What to buy', filter: 'all' }])
})

test('should return same state if todolist not found', () => {
  const nonExistentId = 'non-existent-id'
  const endState = todolistsReducer(startState, deleteTodolistAC({ todolistId: nonExistentId }))

  expect(endState).toEqual(startState)
})

// create todolist

test('correct todolist should be created', () => {
  const title = 'New todolist'
  const endState = todolistsReducer(startState, createTodolistAC(title))

  expect(endState.length).toBe(3)
})

test('should add new todolist at the beginning', () => {
  const title = 'New todolist'
  const endState = todolistsReducer(startState, createTodolistAC(title))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(title)
  expect(endState[0].filter).toBe('all')
  expect(endState[1]).toEqual(startState[0])
})

// change title

test('correct todolist should change its title', () => {
  const title = 'New title'
  const endState = todolistsReducer(startState, changeTodolistAC({ todolistId: todolistId2, title }))

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(title)
})

test('should not change title if todolist not found', () => {
  const nonExistentId = 'non-existent-id'
  const endState = todolistsReducer(startState, changeTodolistAC({ todolistId: nonExistentId, title: 'New' }))

  expect(endState).toEqual(startState)
})

// change filter

test('correct todolist should change its filter', () => {
  const filter = 'completed'
  const endState = todolistsReducer(startState, changeTodolistAC({ todolistId: todolistId2, filter }))

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(filter)
})

test('should not change filter if todolist not found', () => {
  const nonExistentId = 'non-existent-id'
  const endState = todolistsReducer(startState, changeTodolistAC({ todolistId: nonExistentId, filter: 'active' }))

  expect(endState).toEqual(startState)
})
