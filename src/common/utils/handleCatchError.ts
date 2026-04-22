import type { Dispatch } from '@reduxjs/toolkit'
import { setAppErrorAC, setRequestStatusAC } from '@/app/model/app-slice'
import { isAxiosError } from 'axios'

export const handleCatchError = ({ error, dispatch }: { error: unknown; dispatch: Dispatch }) => {
  let errorMessage: string
  if (isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error.message
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = 'Unknown error. Try later.'
    console.error('Unexpected error format:', error)
  }

  dispatch(setAppErrorAC({ errorMessage }))
  dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
}
