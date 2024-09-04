import { useRouter } from 'next/navigation'
import React from 'react'

export type BackButtonProps = {
  href: string
}

const BackButton: React.FC<BackButtonProps> = ({ href }) => {
  const router = useRouter()
  return (
    <button
      data-testid='back-button'
      onClick={() => {
        router.push(href)
      }}
      className='h-6 w-16'
    >
      <div className='flex flex-row'>
        <img
          className='border-[1.5px] border-black rounded-lg py-[6px] w-6 h-6'
          src='/img/back-arrow.svg'
        />
        <span className='flex justify-center text-base pl-[7px] font-baskervald'>Back</span>
      </div>
    </button>
  )
}
export default BackButton
