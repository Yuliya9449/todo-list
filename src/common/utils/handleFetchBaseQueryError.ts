import type { FetchBaseQueryError, QueryReturnValue } from '@reduxjs/toolkit/query/react'
import type { FetchBaseQueryMeta } from '@reduxjs/toolkit/query'
import type { Dispatch } from '@reduxjs/toolkit/react'
import { setAppErrorAC } from '@/app/model/app-slice'
import type { ResponseWithAnyObject } from '@/common/types'
import { ResultCode } from '@/common/enums'
import { isErrorWithMessage } from './isErrorWithMessage'

export const handleFetchBaseQueryError = ({
  result,
  dispatch,
}: {
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
  dispatch: Dispatch
}) => {
  let errorMessage = 'Unknown error. Try later.'

  if (result.error) {
    const { error } = result
    switch (error.status) {
      case 'FETCH_ERROR':
      case 'PARSING_ERROR':
      case 'TIMEOUT_ERROR':
      case 'CUSTOM_ERROR': {
        errorMessage = error.error
        break
      }

      case 400: {
        if (isErrorWithMessage(error)) {
          errorMessage = error.message
        } else {
          errorMessage = 'Unknown error. Try later.'
          console.error('Unexpected error format:', error.data)
        }
        break
      }

      case 401: {
        errorMessage = 'Authorization has been denied for this request.'
        break
      }

      case 403: {
        errorMessage = '403 Forbidden Error. Check API-KEY'
        break
      }

      case 404: {
        errorMessage = 'Resource not found.'
        break
      }

      default: {
        if (error.status >= 500 && error.status < 600) {
          errorMessage = 'Server error occurred. Please try again later.'
        } else {
          errorMessage = JSON.stringify(error)
          console.error('Unexpected error format:', error)
        }
      }
    }

    dispatch(setAppErrorAC({ errorMessage }))
  } else if ((result.data as ResponseWithAnyObject).resultCode === ResultCode.Error) {
    const messages = (result.data as ResponseWithAnyObject).messages
    errorMessage = messages?.[0] || errorMessage
    dispatch(setAppErrorAC({ errorMessage }))
  }
}
