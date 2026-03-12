import styles from './Button.module.css'

type Props = {
  title: string
  onClick?: () => void
  isActive?: boolean
}

export const Button = ({ title, onClick, isActive }: Props) => {
  return (
    <button
      className={isActive ? styles.activeFilter : ''}
      onClick={onClick}
    >
      {title}
    </button>
  )
}
