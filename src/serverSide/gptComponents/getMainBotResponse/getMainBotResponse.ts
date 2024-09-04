import { getTaskPrompt } from './taskPrompt'
import { request_schema } from '@/serverSide/gptComponents/getMainBotResponse/schema'
import { response_schema } from '@/serverSide/gptComponents/getMainBotResponse/schema'
import { validateJson } from '@/serverSide/utils/validation/request'
import { z } from 'zod'
import { getGptResponse } from '@/lib/functions/getGptResponse'

export async function getMainBotResponse(reqBody: any): Promise<z.infer<typeof response_schema>> {
  const { chatMessages, suggestions }: z.infer<typeof request_schema> = await validateJson(
    reqBody,
    request_schema
  )

  const taskPrompt = getTaskPrompt(suggestions)
  const { message, thought } = await getGptResponse(
    chatMessages,
    taskPrompt,
    response_schema,
    true,
    { temperatureOverride: 0.5, frequencyPenaltyOverride: 0.9 }
  )
  return { message, thought }
}
