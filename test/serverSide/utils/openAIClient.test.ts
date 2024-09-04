import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import { createCompletion, getOpenAIClient } from '../../../src/serverSide/utils/openAIClient'
import OpenAI, { ClientOptions } from 'openai'
import { when } from 'jest-when'
jest.mock('openai')
const currentApiKey = process.env.OPENAI_API_KEY

afterEach(() => {
  process.env.OPENAI_API_KEY = currentApiKey
})

describe('getOpenAIClient', () => {
  it('returns an OpenAI client if the OpenAI API key is a non-empty string', () => {
    expect(getOpenAIClient()).toBeInstanceOf(OpenAI)
  })

  it('calls the OpenAI constructor with the correct configuration', () => {
    getOpenAIClient()
    const configuration: ClientOptions = {
      apiKey: process.env.OPENAI_API_KEY
    }
    expect(OpenAI).toHaveBeenCalledWith(configuration)
  })

  it('throws an error if the OpenAI API key is the empty string', () => {
    process.env.OPENAI_API_KEY = ''
    expect(getOpenAIClient).toThrow('OpenAI API key is not defined.')
  })
})

describe('createCompletion', () => {
  let openAiInstance: any
  let mockChatCompletionsCreate: jest.Mock

  const configuration: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY
  }
  const messageArrayForGpt: OpenAI.ChatCompletionMessageParam[] = [
    {
      content: '',
      role: 'system'
    }
  ]

  it('calls the method to create a chat completion on the Open AI client with the correct arguments', async () => {
    openAiInstance = new OpenAI(configuration)
    mockChatCompletionsCreate = jest.fn((_arg1, _arg2) => {
      return 'Success'
    })
    openAiInstance.chat = {
      completions: { create: mockChatCompletionsCreate }
    }

    await createCompletion(openAiInstance, messageArrayForGpt)

    expect(mockChatCompletionsCreate).toHaveBeenCalledWith(
      {
        messages: messageArrayForGpt,
        model: 'gpt-4o-mini',
        stream: false,
        response_format: {
          type: 'json_object'
        },
        temperature: 0,
        frequency_penalty: 0.01
      },
      {
        maxRetries: 3
      }
    )
  })

  it('returns a completion response from the OpenAI client', async () => {
    openAiInstance = new OpenAI(configuration)
    const arg1: any = {
      messages: messageArrayForGpt,
      model: 'gpt-4o-mini',
      stream: false,
      response_format: {
        type: 'json_object'
      },
      temperature: 0,
      frequency_penalty: 0.01
    }
    const options: OpenAI.RequestOptions = {
      maxRetries: 3
    }
    when(mockChatCompletionsCreate).calledWith(arg1, options).mockReturnValue('Success')
    openAiInstance.chat = {
      completions: {
        create: mockChatCompletionsCreate
      }
    }

    const returnedValue: any = await createCompletion(openAiInstance, messageArrayForGpt)

    expect(returnedValue).toBe('Success')
  })

  it('throws a ServiceUnavailable when the Open AI client does not return a chat completion', async () => {
    openAiInstance = new OpenAI(configuration)
    mockChatCompletionsCreate = jest.fn((_arg1, _arg2) => {
      return undefined
    })
    openAiInstance.chat = {
      completions: {
        create: mockChatCompletionsCreate
      }
    }

    expect(async () => {
      await createCompletion(openAiInstance, messageArrayForGpt)
    }).rejects.toThrow(ServiceUnavailable)
  })
})
