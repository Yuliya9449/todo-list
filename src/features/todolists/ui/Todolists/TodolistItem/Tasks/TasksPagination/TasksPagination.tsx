import { PAGE_SIZE } from '@/common/constants'
import Pagination from '@mui/material/Pagination'
import type { ChangeEvent } from 'react'
import styles from './TasksPagination.module.css'

type Props = {
  page: number
  setPage: (page: number) => void
  totalCount: number
}

export const TasksPagination = ({ page, setPage, totalCount }: Props) => {
  const changePage = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }

  return (
    <>
      <Pagination
        count={Math.ceil(totalCount / PAGE_SIZE)}
        page={page}
        onChange={changePage}
        shape="rounded"
        color="primary"
        className={styles.pagination}
      />
    </>
  )
}
