import { z } from 'zod'
import { isMaslowWheelCategory } from '@/lib/types/MaslowWheelCategory'
import { isDataPointFulfilmentStatus } from '@/lib/types/DataPointFulfilmentStatus'

export const user_or_bot_message_schema = z.object({
  content: z
    .string({ message: 'The value content was not a string' })
    .min(1, { message: 'The content of the message was undefined' }),
  role: z.enum(['user', 'system', 'assistant'], { message: 'The provided role was invalid' })
})

export const category_schema = z.string().refine(isMaslowWheelCategory, {
  message: 'The category string was invalid'
})
export const data_points_schema = z.array(z.string())
export const data_point_fulfilment_status_schema = z.string().refine(isDataPointFulfilmentStatus, {
  message: 'The dataPointFulfilmentStatus string was invalid'
})

export const category_fulfilment_sub_category_record_schema = z.record(
  z.string().min(1, { message: 'subcategory key is empty' }),
  data_point_fulfilment_status_schema
)
export const datapoint_fulfilment_schema = z.record(z.string(), data_point_fulfilment_status_schema)
export const category_fulfilment_schema = z
  .record(category_schema, category_fulfilment_sub_category_record_schema)
  .refine(
    (data) => Object.keys(data).length === 11,
    'the correct number of categories were not defined'
  )

export const question_to_ask_schema = z
  .string({ message: 'The question_to_ask was not a string' })
  .min(1, { message: 'The question string was empty' })
  .endsWith('?', { message: 'The string was not phrased as a question' })

export const chat_messages_schema = z
  .array(user_or_bot_message_schema, {
    message: 'The chatMessages were not received in correct array format'
  })
  .min(1, { message: 'The chat message array was empty' })

export const maslow_category_fulfilment_schema = z.object({
  'Drugs & Alcohol usage': category_fulfilment_sub_category_record_schema,
  Offending: category_fulfilment_sub_category_record_schema,
  Safety: category_fulfilment_sub_category_record_schema,
  'Physical Wellbeing': category_fulfilment_sub_category_record_schema,
  'Emotional & Mental Wellbeing': category_fulfilment_sub_category_record_schema,
  'Personal Growth': category_fulfilment_sub_category_record_schema,
  Finances: category_fulfilment_sub_category_record_schema,
  'Social Connection & Impact': category_fulfilment_sub_category_record_schema,
  'Significant Relationships': category_fulfilment_sub_category_record_schema,
  Accommodation: category_fulfilment_sub_category_record_schema,
  'Skills & Vocation': category_fulfilment_sub_category_record_schema,
  Other: category_fulfilment_sub_category_record_schema
})

export const chat_bot_state_schema = z.object({
  chatMessages: chat_messages_schema,
  lastBotMessageCategory: category_schema,
  categoryFulfilment: maslow_category_fulfilment_schema,
  ended: z.boolean()
})
