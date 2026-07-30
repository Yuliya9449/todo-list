import { useSortable } from '@dnd-kit/react/sortable'
import type { ComponentPropsWithRef, ElementType } from 'react'

type Props<T extends ElementType> = {
  id: string
  index: number
  HTMLTag?: T
} & Omit<ComponentPropsWithRef<T>, 'id' | 'ref'>

export const Sortable = <T extends ElementType = 'div'>({ id, index, HTMLTag, children, ...props }: Props<T>) => {
  const { ref } = useSortable({ id, index })

  const Component = HTMLTag ?? 'div'

  return (
    <Component {...props} ref={ref}>
      {children}
    </Component>
  )
}
