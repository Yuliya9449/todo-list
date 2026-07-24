import { Route, Routes } from 'react-router'
import { Main } from '@/app/Main'
import { Login } from '@/features/auth/ui/Login/Login'
import { Faq, PageNotFound, ProtectedRoute } from '@/common/components'
import { RoutePath } from '@/common/constants'
import { useMeQuery } from '@/features/auth/api/authApi'
import { ResultCode } from '@/common/enums'

export const Routing = () => {
  const { data, isLoading } = useMeQuery()

  const isAllowed = data?.resultCode === ResultCode.Success

  if (isLoading) {
    return <div>checking auth</div>
  }

  return (
    <Routes>
      {/* Защищенные маршруты - только для авторизованных */}
      <Route element={<ProtectedRoute isAllowed={isAllowed} redirectPath={RoutePath.Login} />}>
        <Route path={RoutePath.Main} element={<Main />} />
        <Route path={RoutePath.Faq} element={<Faq />} />
      </Route>

      {/* Публичные маршруты - только для не авторизованных */}
      <Route element={<ProtectedRoute isAllowed={!isAllowed} redirectPath={RoutePath.Main} />}>
        <Route path={RoutePath.Login} element={<Login />} />
      </Route>

      {/* 404 - для всех */}
      <Route path={RoutePath.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
