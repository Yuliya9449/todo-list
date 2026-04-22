import { setAppErrorAC, setRequestStatusAC } from '@/app/model/app-slice'
import type { BaseResponse } from '@/common/types'
import type { Dispatch } from '@reduxjs/toolkit'

export const handleStatusCodeError = <T>({ data, dispatch }: { data: BaseResponse<T>; dispatch: Dispatch }) => {
  dispatch(setAppErrorAC({ errorMessage: data.messages[0] || 'Some error occurred' }))
  dispatch(setRequestStatusAC({ requestStatus: 'failed' }))
}
