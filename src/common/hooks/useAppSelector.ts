import { useSelector } from 'react-redux'
import type { RootState } from '@/app/model/store'

export const useAppSelector = useSelector.withTypes<RootState>()
