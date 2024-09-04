'use client'

import Image from 'next/image'

export type StarRatingProps = {
  rating: number
  setRating: (newRating: number) => void
}
const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const descriptions = [
    "It wasn't helpful at all.",
    "I didn't find it that useful.",
    'It was kind of helpful.',
    'I found it very helpful.',
    'It was exactly what I needed.'
  ]

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex gap-5'>
        {descriptions.map((description, i) =>
          i + 1 <= rating ? (
            <Image
              key={i + 1}
              src='/img/star-filled-in.svg'
              onClick={() => {
                setRating(i + 1)
              }}
              alt={description}
              width={40}
              height={40}
            />
          ) : (
            <Image
              key={i + 1}
              src='/img/star-empty.svg'
              onClick={() => {
                setRating(i + 1)
              }}
              alt={description}
              width={40}
              height={40}
            />
          )
        )}
      </div>
    </div>
  )
}

export default StarRating
