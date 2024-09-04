import { getTaskPrompt } from './taskPrompt'
import { request_schema } from './schema'
import { response_schema } from './schema'
import { validateJson } from '@/serverSide/utils/validation/request'
import { z } from 'zod'
import { getGptResponse } from '@/lib/functions/getGptResponse'

export async function generateQuestionToAsk(req: any): Promise<z.infer<typeof response_schema>> {
  const { chatMessages, category, dataPoints }: z.infer<typeof request_schema> = await validateJson(
    req,
    request_schema
  )

  const taskPrompt = getTaskPrompt(category, dataPoints)
  const { questionToAsk } = await getGptResponse(chatMessages, taskPrompt, response_schema, true)

  return { questionToAsk }
}
