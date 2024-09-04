import { z } from 'zod'

import { chat_messages_schema } from '@/app/schemas/global'

export const request_schema = z.object({
  chatMessages: chat_messages_schema
})

export const response_schema = z.object({
  riskScore: z
    .string({ message: 'The risk score was not string' })
    .length(2, { message: 'The risk score was not two characters long' }),
  explanation: z
    .string({ message: 'The explanation was not a string' })
    .min(1, { message: 'The explanation string was empty' })
})
