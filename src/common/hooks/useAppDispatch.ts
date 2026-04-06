import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/app/model/store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
