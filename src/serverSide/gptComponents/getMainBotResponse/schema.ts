import { z } from 'zod'

import { chat_messages_schema } from '@/app/schemas/global'

export const request_schema = z.object(
  {
    chatMessages: chat_messages_schema,
    suggestions: z.string()
  },
  { message: 'The request was not an object in the correct format' }
)

export const response_schema = z.object(
  {
    message: z.string(),
    thought: z.string()
  },
  { message: 'The response was not an object in the correct format' }
)
