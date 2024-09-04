import React, { Suspense } from 'react'

import style from './InputErrorWrapper.module.css'
import Image from 'next/image'

export type InputErrorWrapperProps = {
  children: string | JSX.Element | JSX.Element[]
  errorMessage?: string
}

const InputErrorWrapper: React.FC<InputErrorWrapperProps> = ({ errorMessage, children }) => {
  return (
    <Suspense>
      <div data-testid='outerBox' className={`${style.wrapper} ${errorMessage && style.redBorder}`}>
        {children}
        {errorMessage && (
          <div className='absolute top-0 right-0 h-full flex items-center justify-center px-[16px]'>
            <div>
              <Image
                width={32}
                height={32}
                alt='Exclamation mark'
                src='/img/exclamation-mark.svg'
              />
            </div>
          </div>
        )}
      </div>
      <div className={style.errorMessageText}>{errorMessage}</div>
    </Suspense>
  )
}

export default InputErrorWrapper
