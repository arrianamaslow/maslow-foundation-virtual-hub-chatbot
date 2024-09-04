import { getTaskPrompt } from './taskPrompt'
import { request_schema } from '@/serverSide/gptComponents/determineIfConversationShouldEnd/schema'
import { response_schema } from '@/serverSide/gptComponents/determineIfConversationShouldEnd/schema'
import { validateJson } from '@/serverSide/utils/validation/request'
import { z } from 'zod'
import { getGptResponse } from '@/lib/functions/getGptResponse'

export async function determineIfConversationShouldEnd(
  req: any
): Promise<z.infer<typeof response_schema>> {
  const {
    chatMessages,
    numberOfCategoriesResolved,
    totalNumberOfCategories,
    numberOfCategoriesRequiringAttention,
    numberOfMessages
  }: z.infer<typeof request_schema> = await validateJson(req, request_schema)
  const taskPrompt = getTaskPrompt(
    numberOfCategoriesResolved,
    numberOfCategoriesRequiringAttention,
    numberOfMessages,
    totalNumberOfCategories
  )
  const { shouldEndConversation, justification } = await getGptResponse(
    chatMessages,
    taskPrompt,
    response_schema,
    true
  )
  return { shouldEndConversation: shouldEndConversation, justification: justification }
}
