import { z } from 'zod'
import { chat_messages_schema } from '@/app/schemas/global'

export const request_schema = z.object(
  {
    chatMessages: chat_messages_schema
  },
  { message: 'The request was not an object' }
)

export const response_schema = z.object({
  message: z.string().min(1, { message: 'The message returned from GPT is empty' })
})
