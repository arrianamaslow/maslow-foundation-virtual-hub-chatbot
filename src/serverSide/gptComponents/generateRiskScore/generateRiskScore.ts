import { validateJson } from '@/serverSide/utils/validation/request'
import { getGptResponse } from '@/lib/functions/getGptResponse'
import {
  request_schema,
  response_schema
} from '@/serverSide/gptComponents/generateRiskScore/schema'
import { getTaskPrompt } from './taskPrompt'
import { z } from 'zod'

export async function generateRiskScore(reqBody: any): Promise<z.infer<typeof response_schema>> {
  const { chatMessages }: z.infer<typeof request_schema> = await validateJson(
    reqBody,
    request_schema
  )
  const taskPrompt = getTaskPrompt()
  const { riskScore, explanation } = await getGptResponse(
    chatMessages,
    taskPrompt,
    response_schema,
    false
  )
  return { riskScore, explanation }
}
