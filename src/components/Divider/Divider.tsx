import React from 'react'

type DividerProps = {
  dividerText?: string
}

const Divider: React.FC<DividerProps> = ({ dividerText }) => {
  return (
    <div className='relative flex py-5 items-center' data-testid='divider-container'>
      <div className='flex-grow border-t-2 border-[#B3B6B0] rounded-full' />
      {dividerText && (
        <>
          <span className=' font-baskervald flex-shrink text-xl mx-4 text-black'>
            {dividerText}
          </span>
          <div className='flex-grow border-t-2 border-[#B3B6B0] rounded-full' />
        </>
      )}
    </div>
  )
}

export default Divider
