import { z } from 'zod'

import { chat_messages_schema } from '@/app/schemas/global'

export const request_schema = z.object({
  chatMessages: chat_messages_schema,
  numberOfCategoriesResolved: z.number(),
  totalNumberOfCategories: z.number(),
  numberOfCategoriesRequiringAttention: z.number(),
  numberOfMessages: z.number()
})

export const response_schema = z.object({
  shouldEndConversation: z.boolean(),
  justification: z.string()
})
