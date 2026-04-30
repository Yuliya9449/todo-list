import { setAppErrorAC, setRequestStatusAC } from '@/app/model/app-slice'
import type { ApiResponse } from '@/common/types'
import type { Dispatch } from '@reduxjs/toolkit'
import * as z from 'zod'

export const handleStatusCodeError = <T extends z.ZodType>({
  data,
  dispatch,
}: {
  data: ApiResponse<T>
  dispatch: Dispatch
}) => {
  dispatch(setAppErrorAC({ errorMessage: data.messages[0] || 'Some error occurred' }))
  dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
}
