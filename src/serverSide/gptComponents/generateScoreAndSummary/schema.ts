import { z } from 'zod'

import { chat_messages_schema } from '@/app/schemas/global'
import { category_schema } from '@/app/schemas/global'

export const request_schema = z.object({
  chatMessages: chat_messages_schema,
  category: category_schema
})

export const response_schema = z.object({
  score: z
    .number({ message: 'The score was not a number' })
    .int({ message: 'The score was not an integer' })
    .min(0, { message: 'The score was < 0' })
    .max(10, { message: 'The score was > 10' }),
  summary: z
    .string({ message: 'The summary was not a string' })
    .min(1, { message: 'The summary was empty' })
})
