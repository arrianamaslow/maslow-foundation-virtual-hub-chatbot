import { getTaskPrompt } from './taskPrompt'
import { request_schema } from '@/serverSide/gptComponents/generateScoreAndSummary/schema'
import { response_schema } from '@/serverSide/gptComponents/generateScoreAndSummary/schema'
import { validateJson } from '@/serverSide/utils/validation/request'
import { z } from 'zod'
import { getGptResponse } from '@/lib/functions/getGptResponse'

export async function generateScoreAndSummary(
  reqBody: any
): Promise<z.infer<typeof response_schema>> {
  const { chatMessages, category }: z.infer<typeof request_schema> = await validateJson(
    reqBody,
    request_schema
  )
  if (category === 'Other') {
    return { score: 0, summary: 'Uncategorised' }
  }

  const taskPrompt = getTaskPrompt(category)
  const { score, summary } = await getGptResponse(chatMessages, taskPrompt, response_schema, true)

  return { score, summary }
}
