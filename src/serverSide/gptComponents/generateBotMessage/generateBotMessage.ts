import { validateJson } from '@/serverSide/utils/validation/request'
import { getGptResponse } from '@/lib/functions/getGptResponse'
import { request_schema, response_schema } from './schema'
import { getTaskPrompt } from './taskPrompt'
import { z } from 'zod'

export async function generateBotMessage(reqBody: any): Promise<z.infer<typeof response_schema>> {
  const { chatMessages, questionToAsk }: z.infer<typeof request_schema> = await validateJson(
    reqBody,
    request_schema
  )

  const taskPrompt = getTaskPrompt(questionToAsk)
  const { message } = await getGptResponse(chatMessages, taskPrompt, response_schema, true)
  return { message }
}
