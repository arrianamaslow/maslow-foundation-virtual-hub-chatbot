import { z } from 'zod'

import {
  category_schema,
  chat_messages_schema,
  data_point_fulfilment_status_schema
} from '@/app/schemas/global'

export const request_schema = z.object({
  chatMessages: chat_messages_schema,
  mandatoryData: z.array(z.string().min(1)).min(1),
  category: category_schema
})

export const response_schema = z.object({
  message: z
    .record(z.string(), data_point_fulfilment_status_schema)
    .refine((record) => Object.keys(record).length > 0)
})
