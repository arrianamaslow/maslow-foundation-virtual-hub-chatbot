import OpenAI from 'openai'
import * as getTaskPrompt from '@/serverSide/gptComponents/categorizeUserMessage/taskPrompt'
import * as request from '@/serverSide/utils/validation/request'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { z } from 'zod'
import { when } from 'jest-when'
import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import {
  request_schema,
  response_schema
} from '@/serverSide/gptComponents/categorizeUserMessage/schema'
import { MaslowWheelCategory } from '@/lib/types/MaslowWheelCategory'
import { categorizeUserMessage } from '@/serverSide/gptComponents/categorizeUserMessage/categorizeUserMessage'

jest.mock('@/serverSide/gptComponents/categorizeUserMessage/taskPrompt')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const taskPrompt = 'Example task prompt'
const determinedCategories: MaslowWheelCategory[] = ['Accommodation']

const reqBody = {
  chatMessages: [
    {
      role: 'user',
      content: 'hello'
    } as OpenAI.ChatCompletionMessageParam
  ]
}

const gptResponseBody: z.infer<typeof response_schema> = {
  categories: determinedCategories
}

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)
  when(mockGetTaskPrompt).calledWith().mockReturnValue(taskPrompt)
  when(mockGetGptResponse)
    .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
    .mockResolvedValue(gptResponseBody)
})

describe('categorizeUserMessage', () => {
  it(`returns the 'categories' as expected`, async () => {
    const response = await categorizeUserMessage(reqBody)
    expect(response).toEqual(gptResponseBody)
  })

  it(`throws BadRequest when validateJson throws a BadRequest`, async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockRejectedValueOnce(new BadRequest())
    expect(async () => {
      await categorizeUserMessage(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it(`throws ServiceUnavailable when getGptResponse throws ServiceUnavailable`, async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
      .mockRejectedValueOnce(new ServiceUnavailable())
    expect(async () => {
      await categorizeUserMessage(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })
})
