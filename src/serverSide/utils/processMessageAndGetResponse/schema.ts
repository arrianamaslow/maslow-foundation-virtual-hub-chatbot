import { z } from 'zod'

import { chat_bot_state_schema } from '@/app/schemas/global'

export const request_schema = z.object(
  {
    currentState: chat_bot_state_schema
  },
  { message: 'The request was not an object or did not contain expected values' }
)

export const response_schema = z.object(
  {
    currentState: chat_bot_state_schema
  },
  { message: 'The response was not an object or did not contain expected values' }
)
