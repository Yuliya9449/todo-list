import { Route, Routes } from 'react-router'
import { Main } from '@/app/Main'
import { Login } from '@/features/auth/ui/Login/Login'
import { Faq, PageNotFound, ProtectedRoute } from '@/common/components'
import { useAppSelector } from '@/common/hooks'
import { RoutePath } from '@/common/constants'
import { selectIsLoggedIn } from '@/app/model/app-slice'

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      {/* Защищенные маршруты - только для авторизованных */}
      <Route element={<ProtectedRoute isAllowed={isLoggedIn} redirectPath={RoutePath.Login} />}>
        <Route path={RoutePath.Main} element={<Main />} />
        <Route path={RoutePath.Faq} element={<Faq />} />
      </Route>

      {/* Публичные маршруты - только для не авторизованных */}
      <Route element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath={RoutePath.Main} />}>
        <Route path={RoutePath.Login} element={<Login />} />
      </Route>

      {/* 404 - для всех */}
      <Route path={RoutePath.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
