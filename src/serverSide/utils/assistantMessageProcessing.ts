import OpenAI from 'openai'
import { createCompletion } from '@/serverSide/utils/openAIClient'

export const getAndParseChatCompletion = async (
  openaiClient: OpenAI,
  messages: OpenAI.ChatCompletionMessageParam[],
  overrides?: { temperatureOverride?: number; frequencyPenaltyOverride?: number }
): Promise<string> => {
  const chatCompletion = await createCompletion(openaiClient, messages, overrides)

  if (chatCompletion.choices.length === 0) {
    throw Error('No chat completions received from the OpenAI API.')
  }

  const response = chatCompletion.choices[0]?.message?.content

  if (!response) {
    throw Error('No generation received from the OpenAI API.')
  }

  return response
}
