import { getAndParseChatCompletion } from '@/serverSide/utils/assistantMessageProcessing'
import { generateMessageArrayForGpt } from '@/serverSide/utils/generateMessageArrayForGpt'
import { getOpenAIClient } from '@/serverSide/utils/openAIClient'
import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import OpenAI from 'openai'
import { ZodSchema } from 'zod'

export async function getGptResponse<S extends ZodSchema>(
  chatMessages: OpenAI.ChatCompletionMessageParam[],
  taskPrompt: string,
  response_schema: S,
  requiresContext: boolean,
  gptClientOverrideParams?: { temperatureOverride?: number; frequencyPenaltyOverride?: number }
) {
  const openAIClient = getOpenAIClient()
  const messageArrayForGpt = generateMessageArrayForGpt(
    taskPrompt,
    chatMessages as OpenAI.ChatCompletionMessageParam[],
    requiresContext
  )
  const response = await getAndParseChatCompletion(
    openAIClient,
    messageArrayForGpt,
    gptClientOverrideParams
  )
  const parsedResponse = parseAndValidateResponse(response, response_schema)
  return parsedResponse
}
