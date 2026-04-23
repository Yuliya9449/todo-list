import { Route, Routes } from 'react-router'
import { Main } from '@/app/Main'
import { Login } from '@/features/auth/ui/Login/Login'
import { PageNotFound } from '@/common/components'

// eslint-disable-next-line react-refresh/only-export-components
export const Path = {
  Main: '/',
  Login: '/login',
  NotFound: '*',
} as const

export const Routing = () => {
  return (
    <Routes>
      <Route
        path={Path.Main}
        element={<Main />}
      />
      <Route
        path={Path.Login}
        element={<Login />}
      />{' '}
      <Route
        path={Path.NotFound}
        element={<PageNotFound />}
      />
      {/*<Route path="about" element={<About />} />*/}
      {/*<Route element={<AuthLayout />}>*/}
      {/*  <Route path="login" element={<Login />} />*/}
      {/*  <Route path="register" element={<Register />} />*/}
      {/*</Route>*/}
      {/*<Route path="concerts">*/}
      {/*  <Route index element={<ConcertsHome />} />*/}
      {/*  <Route path=":city" element={<City />} />*/}
      {/*  <Route path="trending" element={<Trending />} />*/}
      {/*</Route>*/}
    </Routes>
  )
}
