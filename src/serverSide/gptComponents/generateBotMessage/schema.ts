import { z } from 'zod'

import { question_to_ask_schema, chat_messages_schema } from '@/app/schemas/global'

export const request_schema = z.object({
  chatMessages: chat_messages_schema,
  questionToAsk: question_to_ask_schema
})

export const response_schema = z.object({
  message: z
    .string({ message: 'The generated message was not a string' })
    .min(1, { message: 'The generated message string was empty' })
})
