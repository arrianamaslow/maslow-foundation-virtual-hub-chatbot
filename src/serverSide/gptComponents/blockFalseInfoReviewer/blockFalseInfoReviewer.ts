import { getTaskPrompt } from './taskPrompt'
import { request_schema } from '@/serverSide/gptComponents/blockFalseInfoReviewer/schema'
import { response_schema } from '@/serverSide/gptComponents/blockFalseInfoReviewer/schema'
import { validateJson } from '@/serverSide/utils/validation/request'
import { z } from 'zod'
import { getGptResponse } from '@/lib/functions/getGptResponse'

export async function blockFalseInfoReviewer(
  reqBody: any
): Promise<z.infer<typeof response_schema>> {
  const { chatMessages, generatedBotMessage }: z.infer<typeof request_schema> = await validateJson(
    reqBody,
    request_schema
  )
  const taskPrompt = getTaskPrompt(generatedBotMessage)
  const { approved, suggestions } = await getGptResponse(
    chatMessages,
    taskPrompt,
    response_schema,
    true
  )
  return { approved, suggestions }
}
