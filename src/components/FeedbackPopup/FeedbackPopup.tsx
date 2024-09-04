import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react'
import Button from '../Button/Button'
import StarRating from '../StarRating/StarRating'
import { useState } from 'react'
import { postRequest } from '@/lib/functions/postRequest'
import { z } from 'zod'

export type PopupProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  userId: Number
}

const FeedbackPopup: React.FC<PopupProps> = ({ isOpen, setIsOpen, userId }) => {
  const [rating, setRating] = useState<number>(3)
  const [hasBeenRated, setHasBeenRated] = useState<boolean>(false)

  function handleClick(rating: number) {
    postRequest('/api/SQL_Queries/setRating', { rating, userId }, z.any())
    setIsOpen(false)
  }

  function changeRating(newRating: number) {
    setHasBeenRated(true)
    setRating(newRating)
  }

  return (
    <Dialog open={isOpen} onClose={() => {}} className='relative z-10 w-screen'>
      <DialogBackdrop
        className='fixed inset-0 bg-black opacity-30 duration-300 ease-out data-[closed]:opacity-0'
        transition
      />
      <div
        className={
          'fixed inset-0 flex flex-col items-end justify-end  md:items-center md:justify-center'
        }
      >
        <div className='flex w-full content-center justify-items-end md:bottom-auto h-fit md:min-h-[50vh] md:w-1/2'>
          <DialogPanel
            className='w-full h-full p-[32px] md:p-[24px] justify-items-center content-between justify-around bg-white flex flex-col max-md:data-[closed]:translate-y-full rounded-b-none rounded-3xl duration-300 md:data-[closed]:opacity-0 gap-y-[36px] md:rounded-b-3xl'
            transition
          >
            <p className='subtitle font-baskervald text-left leading-tight'>
              We would appreciate some feedback on your experience today.
            </p>
            <p className='text-center'>How was your experience overall?</p>
            <StarRating setRating={changeRating} rating={rating} />
            <Button
              buttonType='primary'
              text='Submit'
              onClick={() => handleClick(rating)}
              isDisabled={!hasBeenRated}
            ></Button>
            <Button
              buttonType='tertiary'
              text='Close'
              onClick={() => setIsOpen(false)}
              isDisabled={false}
            ></Button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default FeedbackPopup
