import React from 'react'
import style from '../Message/style.module.css'
import Image from 'next/image'

const TypingIndicator = () => {
  return (
    <div className={style.assistantDiv}>
      <Image src='/img/maslow-logo-colour.svg' alt='assistant' width={26} height={54} />
      <div className={style.assistantMessageBox}>
        <div className='flex justify-center items-end h-10'>
          <div
            className='w-[8px] h-[8px] mx-[4px] bg-gray-400 rounded-full animate-scalePulse'
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className='w-[8px] h-[8px] mx-[4px] bg-gray-400 rounded-full animate-scalePulse'
            style={{ animationDelay: '0.4s' }}
          ></div>
          <div
            className='w-[8px] h-[8px] mx-[4px] bg-gray-400 rounded-full animate-scalePulse'
            style={{ animationDelay: '0.8s' }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
