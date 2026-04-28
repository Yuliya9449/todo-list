import type { Dispatch } from '@reduxjs/toolkit'
import { setAppErrorAC, setRequestStatusAC } from '@/app/model/app-slice'
import { isAxiosError } from 'axios'
import { ZodError } from 'zod'

export const handleCatchError = ({ error, dispatch }: { error: unknown; dispatch: Dispatch }) => {
  let errorMessage: string

  switch (true) {
    case isAxiosError(error): {
      errorMessage = error.response?.data?.message || error.message
      break
    }
    case error instanceof ZodError: {
      console.error(error.issues)
      errorMessage = 'Zod error. Look to the console'
      break
    }
    case error instanceof Error: {
      errorMessage = error.message
      break
    }
    default: {
      errorMessage = 'Unknown error. Try later.'
      console.error('Unexpected error format:', error)
      break
    }
  }

  dispatch(setAppErrorAC({ errorMessage }))
  dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
}
