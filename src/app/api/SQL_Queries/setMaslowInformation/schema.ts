import { z } from 'zod'

import { chat_bot_state_schema } from '@/app/schemas/global'

export const request_schema = z.object(
  {
    state: chat_bot_state_schema,
    userId: z.number({ message: 'userId is not a number' })
  },
  { message: 'reqBody is not an object in the correct format' }
)
