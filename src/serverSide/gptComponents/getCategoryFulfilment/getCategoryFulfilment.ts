import { getTaskPrompt } from './taskPrompt'
import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from './schema'
import { z } from 'zod'
import { getGptResponse } from '@/lib/functions/getGptResponse'
import { response_schema } from './schema'

export async function getCategoryFulfilment(
  reqBody: any
): Promise<z.infer<typeof response_schema>> {
  const { chatMessages, mandatoryData, category }: z.infer<typeof request_schema> =
    await validateJson(reqBody, request_schema)
  const taskPrompt = getTaskPrompt(mandatoryData, category)
  const { message } = await getGptResponse(chatMessages, taskPrompt, response_schema, false)
  return { message }
}
