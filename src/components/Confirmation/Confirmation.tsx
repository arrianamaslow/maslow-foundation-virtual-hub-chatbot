import Image from 'next/image'

type ConfirmationProps = {
  date: string
  time: string
}

const Confirmation: React.FC<ConfirmationProps> = ({ date, time }) => {
  return (
    <div className='flex text-center text-[1.75rem] flex-col items-center '>
      <p className='gap-3 p-3'>
        {date && time ? (
          <>
            Booking confirmed! See you on {date}, at {time} (UK time)
          </>
        ) : (
          <>Booking confirmed!</>
        )}
      </p>
      <div>
        <Image src='/img/confirmation-tick.svg' alt='my image' width={190} height={190} />
      </div>
    </div>
  )
}

export default Confirmation
