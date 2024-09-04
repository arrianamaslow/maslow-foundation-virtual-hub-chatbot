import OpenAI, { ClientOptions } from 'openai'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'

export const getOpenAIClient = (): OpenAI => {
  const configuration: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY
  }
  if (!configuration.apiKey) {
    throw new Error('OpenAI API key is not defined.')
  }

  return new OpenAI(configuration)
}

export const createCompletion = async (
  openaiClient: OpenAI,
  messages: OpenAI.ChatCompletionMessageParam[],
  overrides?: { temperatureOverride?: number; frequencyPenaltyOverride?: number }
) => {
  const options: OpenAI.RequestOptions = {
    maxRetries: 3
  }

  try {
    const completionResponse = await openaiClient.chat.completions.create(
      {
        messages: messages,
        model: 'gpt-4o-mini',
        stream: false,
        response_format: {
          type: 'json_object'
        },
        temperature: overrides?.temperatureOverride ?? 0,
        frequency_penalty: overrides?.frequencyPenaltyOverride ?? 0.01
      },
      options
    )

    if (!completionResponse) {
      throw new Error('OpenAI completion response is undefined.')
    }

    return completionResponse
  } catch (error) {
    console.error('Error with OpenAI completion:', error)
    throw new ServiceUnavailable()
  }
}
