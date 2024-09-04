import OpenAI from 'openai'
import { MaslowWheelCategory } from '@/lib/types/MaslowWheelCategory'
import { MaslowCategoryFulfilment } from '@/lib/types/MaslowCategoryFulfilment'

export type ChatBotState = {
  chatMessages: OpenAI.ChatCompletionMessageParam[]
  lastBotMessageCategory: MaslowWheelCategory
  categoryFulfilment: MaslowCategoryFulfilment
  ended: Boolean
}
