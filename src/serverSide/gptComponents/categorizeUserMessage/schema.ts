import { z } from 'zod'

import { chat_messages_schema } from '@/app/schemas/global'
import { category_schema } from '@/app/schemas/global'

export const request_schema = z.object(
  {
    chatMessages: chat_messages_schema
  },
  { message: 'The request was not an object' }
)

export const response_schema = z.object({
  categories: z
    .array(category_schema, { message: 'The categories were not passed as an array' })
    .min(1, { message: 'There were no categories returned' })
})
