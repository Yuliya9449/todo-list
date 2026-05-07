import type { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router'
import { RoutePath } from '@/common/constants'

type Props = PropsWithChildren<{
  isAllowed: boolean
  redirectPath?: (typeof RoutePath)[keyof typeof RoutePath]
}>

export const ProtectedRoute = ({ isAllowed, redirectPath = RoutePath.Login, children }: Props) => {
  return isAllowed ? children || <Outlet /> : <Navigate to={redirectPath} replace />
}
