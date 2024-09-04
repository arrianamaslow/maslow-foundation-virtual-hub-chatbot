import style from './style.module.css'
export type ButtonProps = {
  text: string
  isDisabled?: boolean
  onClick: () => void
  buttonType: 'primary' | 'secondary' | 'tertiary'
}
const Button: React.FC<ButtonProps> = ({ text, isDisabled, onClick, buttonType }) => {
  return (
    <button
      className={`inline-flex w-full justify-center px-[24px] py-[10px] flex-shrink-0 rounded-lg border-solid border-[1px] text-[16px] ${style[buttonType]}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  )
}
export default Button
