import { z } from 'zod'

import {
  category_schema,
  chat_messages_schema,
  data_points_schema,
  question_to_ask_schema
} from '@/app/schemas/global'

export const request_schema = z.object(
  {
    chatMessages: chat_messages_schema,
    category: category_schema,
    dataPoints: data_points_schema
  },
  { message: 'The request was not an object' }
)

export const response_schema = z.object(
  {
    questionToAsk: question_to_ask_schema
  },
  { message: 'The response was not an object' }
)
