import { z } from 'zod'

export const request_schema = z.object(
  {
    fullName: z.string({ message: 'fullName is not a string' }),
    location: z.string({ message: 'location is not stored as a string' }),
    dateOfBirth: z.string({ message: 'dateOfBirth is not a string' }),
    email: z.string({ message: 'email is not a string' }),
    phoneNumber: z
      .string({ message: 'phoneNumber is not stored as a string' })
      .transform((arg) => Number(arg)),
    preferredContactMethod: z.enum(['Email', 'Phone'], {
      message: `Method of contact is not one of: 'Email', 'Phone'`
    })
  },
  { message: 'reqBody is not an object in the correct format' }
)
