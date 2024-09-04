import OpenAI from 'openai'
import * as openAIClient from '@/serverSide/utils/openAIClient'
import * as generateMessageArrayForGpt from '@/serverSide/utils/generateMessageArrayForGpt'
import * as assistantMessageProcessing from '@/serverSide/utils/assistantMessageProcessing'
import * as response from '@/serverSide/utils/validation/response'
import { when } from 'jest-when'
import { getGptResponse } from '@/lib/functions/getGptResponse'
import { z } from 'zod'
import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import { InternalServerError } from '@/lib/errors/InternalServerError'

jest.mock('openai')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/serverSide/utils/openAIClient')
jest.mock('@/serverSide/utils/generateMessageArrayForGpt')
jest.mock('@/serverSide/utils/assistantMessageProcessing')
jest.mock('@/serverSide/utils/validation/response')

const mockGetOpenAIClient = jest.spyOn(openAIClient, 'getOpenAIClient')
const mockGenerateMessageArrayForGpt = jest.spyOn(
  generateMessageArrayForGpt,
  'generateMessageArrayForGpt'
)
const mockGetAndParseChatCompletion = jest.spyOn(
  assistantMessageProcessing,
  'getAndParseChatCompletion'
)
const mockParseAndValidateResponse = jest.spyOn(response, 'parseAndValidateResponse')

const taskPrompt = 'Example task prompt'

const messageArrayForGpt = [
  {
    role: 'user',
    content: 'Hello'
  },
  {
    role: 'assistant',
    content: 'Hey'
  },
  {
    role: 'user',
    content: 'Good day'
  }
] as OpenAI.ChatCompletionMessageParam[]

const exampleResponse = {
  message: 'gpt response',
  thoughts: 'no thoughts'
}

const exampleResponseSchema = z.object({
  message: z.string(),
  thoughts: z.string()
})

const gptClientOverrideParams = { temperatureOverride: 0.5, frequencyPenaltyOverride: 0.9 }

const mockOpenAIClient = new OpenAI()

beforeEach(() => {
  when(mockGetOpenAIClient).calledWith().mockReturnValue(mockOpenAIClient)

  when(mockGenerateMessageArrayForGpt)
    .calledWith(taskPrompt, messageArrayForGpt, expect.any(Boolean))
    .mockReturnValue(messageArrayForGpt)

  when(mockGetAndParseChatCompletion)
    .calledWith(mockOpenAIClient, messageArrayForGpt, gptClientOverrideParams)
    .mockResolvedValue(JSON.stringify(exampleResponse))

  when(mockParseAndValidateResponse)
    .calledWith(JSON.stringify(exampleResponse), exampleResponseSchema)
    .mockReturnValue(exampleResponse)
})

describe(`getGptResponse helper function`, () => {
  it(`returns response as expected`, async () => {
    const response = await getGptResponse(
      messageArrayForGpt,
      taskPrompt,
      exampleResponseSchema,
      false,
      gptClientOverrideParams
    )
    expect(response).toBe(exampleResponse)
  })

  it(`throws a BadRequest when parseAndValidateResponse throws a BadRequest`, async () => {
    when(mockParseAndValidateResponse)
      .calledWith(JSON.stringify(exampleResponse), exampleResponseSchema)
      .mockImplementationOnce(() => {
        throw new BadRequest()
      })

    expect(async () => {
      await getGptResponse(
        messageArrayForGpt,
        taskPrompt,
        exampleResponseSchema,
        false,
        gptClientOverrideParams
      )
    }).rejects.toThrow(BadRequest)
  })

  it(`throws a ServiceUnavailable Error when getOpenAIClient throws a ServiceUnavailable Error`, async () => {
    when(mockGetOpenAIClient)
      .calledWith()
      .mockImplementationOnce(() => {
        throw new ServiceUnavailable()
      })

    expect(async () => {
      await getGptResponse(
        messageArrayForGpt,
        taskPrompt,
        exampleResponseSchema,
        false,
        gptClientOverrideParams
      )
    }).rejects.toThrow(ServiceUnavailable)
  })

  it(`throws a Error when getAndParseChatCompletion throws Error`, async () => {
    when(mockGetAndParseChatCompletion)
      .calledWith(mockOpenAIClient, messageArrayForGpt, gptClientOverrideParams)
      .mockImplementationOnce(() => {
        throw new Error('No chat completions received from the OpenAI API.')
      })

    expect(async () => {
      await getGptResponse(
        messageArrayForGpt,
        taskPrompt,
        exampleResponseSchema,
        false,
        gptClientOverrideParams
      )
    }).rejects.toThrow('No chat completions received from the OpenAI API.')
  })

  it(`throws a InternalServerError when parseAndValidateResponse throws InternalServerError`, async () => {
    when(mockParseAndValidateResponse)
      .calledWith(JSON.stringify(exampleResponse), exampleResponseSchema)
      .mockImplementationOnce(() => {
        throw new InternalServerError()
      })

    expect(async () => {
      await getGptResponse(
        messageArrayForGpt,
        taskPrompt,
        exampleResponseSchema,
        false,
        gptClientOverrideParams
      )
    }).rejects.toThrow(InternalServerError)
  })
})
