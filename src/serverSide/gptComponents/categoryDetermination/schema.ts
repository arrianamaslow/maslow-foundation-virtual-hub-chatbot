import { z } from 'zod'

import { chat_messages_schema, data_points_schema } from '@/app/schemas/global'
import { category_schema, category_fulfilment_schema } from '@/app/schemas/global'

export const request_schema = z.object({
  chatMessages: chat_messages_schema,
  previousUserMessageCategories: z.array(category_schema, {
    message: 'The categories were not passed as an array'
  }),
  categoryFulfilment: category_fulfilment_schema,
  lastBotMessageCategory: category_schema
})

export const response_schema = z.object({
  category: category_schema,
  dataPoints: data_points_schema
})
