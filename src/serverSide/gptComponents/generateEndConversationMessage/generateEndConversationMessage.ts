import { z } from 'zod'
import { validateJson } from '@/serverSide/utils/validation/request'
import { getGptResponse } from '@/lib/functions/getGptResponse'
import { request_schema, response_schema } from './schema'
import { getTaskPrompt } from './taskPrompt'

export async function generateEndConversationMessage(
  reqBody: any
): Promise<z.infer<typeof response_schema>> {
  const { chatMessages }: z.infer<typeof request_schema> = await validateJson(
    reqBody,
    request_schema
  )

  const taskPrompt = getTaskPrompt()
  const { message } = await getGptResponse(chatMessages, taskPrompt, response_schema, true, {
    temperatureOverride: 0.5
  })
  return { message }
}
