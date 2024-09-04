import { validateJson } from '@/serverSide/utils/validation/request'
import { getGptResponse } from '@/lib/functions/getGptResponse'
import { request_schema, response_schema } from './schema'
import { getTaskPrompt } from './taskPrompt'
import { z } from 'zod'

export async function categorizeUserMessage(
  reqBody: any
): Promise<z.infer<typeof response_schema>> {
  const { chatMessages }: z.infer<typeof request_schema> = await validateJson(
    reqBody,
    request_schema
  )

  const taskPrompt = getTaskPrompt()
  const { categories } = await getGptResponse(chatMessages, taskPrompt, response_schema, false)
  return { categories }
}
