'use client'
import React from 'react'

type ExitButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const ExitButton: React.FC<ExitButtonProps> = ({ onClick }) => {
  return (
    <button
      className='w-6 h-6 border-[1.5px] border-black flex items-center justify-center rounded-lg'
      onClick={onClick}
    >
      <img className='h-[10px]' src='/img/exit-cross.svg' />
    </button>
  )
}

export default ExitButton
