import React from 'react'

import style from './EnterButton.module.css'

type EnterButtonProps = {
  isDisabled: boolean
  onClick: () => void
}

const EnterButton: React.FC<EnterButtonProps> = ({ isDisabled, onClick }) => {
  return (
    <button className={style.enterButton} disabled={isDisabled} onClick={onClick}>
      <svg
        width='32'
        height='32'
        viewBox='0 0 32 32'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g id='Group'>
          <path
            id='Vector'
            d='M24 1.14307H7.99997C4.21287 1.14307 1.14282 4.21311 1.14282 8.00021V24.0002C1.14282 27.7873 4.21287 30.8574 7.99997 30.8574H24C27.7871 30.8574 30.8571 27.7873 30.8571 24.0002V8.00021C30.8571 4.21311 27.7871 1.14307 24 1.14307Z'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            id='Vector_2'
            d='M9.14282 16L16 8L22.8571 16'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            id='Vector_3'
            d='M16 8V24'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </svg>
    </button>
  )
}

export default EnterButton
