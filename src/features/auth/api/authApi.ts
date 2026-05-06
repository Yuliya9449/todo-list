import { instance } from '@/common/instance'
import type { LoginInputs } from '@/features/auth/model/schemas'
import type { LoginResponse, MeResponse } from '@/features/auth/api/authApi.types'
import type { ResponseWithEmptyObject } from '@/common/types'

export const authApi = {
  login(payload: LoginInputs) {
    return instance.post<LoginResponse>('/auth/login', payload)
  },
  logout() {
    return instance.delete<ResponseWithEmptyObject>('/auth/login')
  },
  me() {
    return instance.get<MeResponse>('/auth/me')
  },
}
