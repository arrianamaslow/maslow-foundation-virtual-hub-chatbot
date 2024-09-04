import OpenAI from 'openai'
import * as request from '@/serverSide/utils/validation/request'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import * as getTaskPrompt from '@/serverSide/gptComponents/getMainBotResponse/taskPrompt'
import { z } from 'zod'
import { when } from 'jest-when'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import { BadRequest } from '@/lib/errors/BadRequest'
import {
  request_schema,
  response_schema
} from '@/serverSide/gptComponents/getMainBotResponse/schema'
import { getMainBotResponse } from '@/serverSide/gptComponents/getMainBotResponse/getMainBotResponse'

jest.mock('@/serverSide/gptComponents/getMainBotResponse/taskPrompt')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const taskPrompt = 'Example task prompt'

const gptClientOverrideParams = { temperatureOverride: 0.5, frequencyPenaltyOverride: 0.9 }

const reqBody = {
  chatMessages: [
    {
      role: 'user',
      content: 'hello'
    } as OpenAI.ChatCompletionMessageParam
  ],
  suggestions: ''
}

const gptResponseBody: z.infer<typeof response_schema> = {
  message: 'hi',
  thought: 'hello'
}

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)
  when(mockGetTaskPrompt).calledWith(reqBody.suggestions).mockReturnValue(taskPrompt)
  when(mockGetGptResponse)
    .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true, gptClientOverrideParams)
    .mockResolvedValue(gptResponseBody)
})

describe('getMainBotResponse()', () => {
  it(`returns the response object as expected`, async () => {
    const response = await getMainBotResponse(reqBody)
    expect(response).toEqual(gptResponseBody)
  })

  it(`throws BadRequest when validateJson throws a BadRequest`, async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockRejectedValueOnce(new BadRequest())
    expect(async () => {
      await getMainBotResponse(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it(`throws ServiceUnavailable when getGptResponse throws ServiceUnavailable`, async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true, gptClientOverrideParams)
      .mockRejectedValueOnce(new ServiceUnavailable())
    expect(async () => {
      await getMainBotResponse(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })
})
