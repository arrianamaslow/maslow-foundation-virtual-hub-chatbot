import OpenAI from 'openai'
import { getOverallPrompt } from './overallPrompt'

export function generateMessageArrayForGpt(
  taskPrompt: string,
  chatMessages: OpenAI.ChatCompletionMessageParam[],
  requiresContext: boolean
): OpenAI.ChatCompletionMessageParam[] {
  const overallPrompt = getOverallPrompt()
  let messageArrayForGpt: OpenAI.ChatCompletionMessageParam[] = []
  if (requiresContext) {
    messageArrayForGpt = [
      {
        role: 'system',
        content: overallPrompt
      }
    ]
  }

  messageArrayForGpt.push(
    {
      role: 'system',
      content: taskPrompt
    },
    ...chatMessages
  )

  return messageArrayForGpt
}
