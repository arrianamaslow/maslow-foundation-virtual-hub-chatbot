import { z } from 'zod'

export const request_schema = z.object(
  {
    date: z.string().transform((arg) => new Date(arg)),
    userId: z.number({ message: 'userId is not a number' })
  },
  { message: 'reqBody is not an object in the correct format' }
)
