import { z } from 'zod'
export const request_schema = z.object(
  {
    dateStringInStartMonth: z.string().transform((arg) => new Date(arg))
  },
  { message: 'reqBody is not an object in the correct format' }
)
