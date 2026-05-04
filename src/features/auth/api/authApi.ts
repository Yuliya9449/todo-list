import { instance } from '@/common/instance/instance'
import type { LoginInputs } from '@/features/auth/model/schemas'
import type { LoginResponse } from '@/features/auth/api/authApi.types'

export const authApi = {
  login(payload: LoginInputs) {
    return instance.post<LoginResponse>('/auth/login', payload)
  },
  logout() {},
  me() {},
}
