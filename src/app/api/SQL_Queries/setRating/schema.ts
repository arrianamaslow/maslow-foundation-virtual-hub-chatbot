import { z } from 'zod'

export const request_schema = z.object(
  {
    rating: z.number({ message: 'rating is not a number' }),
    userId: z.number({ message: 'userId is not a number' })
  },
  { message: 'reqBody is not an object in the correct format' }
)
