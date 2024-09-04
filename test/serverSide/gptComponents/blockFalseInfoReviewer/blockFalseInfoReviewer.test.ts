import * as getTaskPrompt from '@/serverSide/gptComponents/blockFalseInfoReviewer/taskPrompt'
import {
  request_schema,
  response_schema
} from '@/serverSide/gptComponents/blockFalseInfoReviewer/schema'

import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import * as request from '@/serverSide/utils/validation/request'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { BadRequest } from '@/lib/errors/BadRequest'
import { when } from 'jest-when'
import OpenAI from 'openai'
import { z } from 'zod'
import { blockFalseInfoReviewer } from '@/serverSide/gptComponents/blockFalseInfoReviewer/blockFalseInfoReviewer'

jest.mock('@/serverSide/gptComponents/blockFalseInfoReviewer/taskPrompt')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const taskPrompt = 'Example task prompt'

const reqBody = {
  chatMessages: [
    {
      role: 'user',
      content: 'hello'
    } as OpenAI.ChatCompletionMessageParam
  ],
  generatedBotMessage: 'Hello. How are you?'
}

const gptResponseBody: z.infer<typeof response_schema> = {
  approved: true,
  suggestions: 'None'
}

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)
  when(mockGetTaskPrompt).calledWith('Hello. How are you?').mockReturnValue(taskPrompt)
  when(mockGetGptResponse)
    .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true)
    .mockResolvedValue(gptResponseBody)
})

describe('blockFalseInfoReviewer()', () => {
  it(`returns the review object as expected`, async () => {
    const response = await blockFalseInfoReviewer(reqBody)
    expect(response).toEqual(gptResponseBody)
  })

  it(`throws BadRequest when validateJson throws a BadRequest`, async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockRejectedValueOnce(new BadRequest())
    expect(async () => {
      await blockFalseInfoReviewer(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it(`throws ServiceUnavailable when getGptResponse throws ServiceUnavailable`, async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true)
      .mockRejectedValueOnce(new ServiceUnavailable())
    expect(async () => {
      await blockFalseInfoReviewer(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })
})
