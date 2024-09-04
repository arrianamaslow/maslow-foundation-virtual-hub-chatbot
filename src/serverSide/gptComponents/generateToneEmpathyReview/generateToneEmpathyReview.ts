import { z } from 'zod'
import { validateJson } from '@/serverSide/utils/validation/request'
import { getTaskPrompt } from './taskPrompt'
import { getGptResponse } from '@/lib/functions/getGptResponse'
import { request_schema } from '@/serverSide/gptComponents/generateToneEmpathyReview/schema'
import { response_schema } from '@/serverSide/gptComponents/generateToneEmpathyReview/schema'

export async function generateToneEmpathyReview(
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
    false
  )
  return { approved, suggestions }
}
