import { z } from 'zod'

import { chat_messages_schema } from '@/app/schemas/global'

export const request_schema = z.object({
  chatMessages: chat_messages_schema,
  generatedBotMessage: z.string()
})

export const response_schema = z.object({
  approved: z.boolean(),
  suggestions: z.string()
})
