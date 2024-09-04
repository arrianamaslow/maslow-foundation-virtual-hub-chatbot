import OpenAI from 'openai'
import * as getTaskPrompt from '@/serverSide/gptComponents/generateToneEmpathyReview/taskPrompt'
import * as request from '@/serverSide/utils/validation/request'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { z } from 'zod'
import { when } from 'jest-when'
import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import {
  request_schema,
  response_schema
} from '@/serverSide/gptComponents/generateToneEmpathyReview/schema'
import { generateToneEmpathyReview } from '@/serverSide/gptComponents/generateToneEmpathyReview/generateToneEmpathyReview'

jest.mock('@/serverSide/gptComponents/generateToneEmpathyReview/taskPrompt')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const reqBody = {
  chatMessages: [
    {
      content: 'hello?',
      role: 'user'
    } as OpenAI.ChatCompletionMessageParam
  ],
  generatedBotMessage: 'question here'
}

const taskPrompt = 'Example task prompt'

const responseBody: z.infer<typeof response_schema> = {
  approved: true,
  suggestions: 'None'
}

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)

  when(mockGetTaskPrompt).calledWith(reqBody.generatedBotMessage).mockReturnValue(taskPrompt)

  when(mockGetGptResponse)
    .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
    .mockResolvedValue(responseBody)
})

describe('generateToneEmpathyReview()', () => {
  it(`returns the expected response when generateToneEmpathyReview is successful`, async () => {
    const response = await generateToneEmpathyReview(reqBody)
    expect(response).toEqual(responseBody)
  })

  it('throws a BadRequest when validateJson throws a BadRequest', async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockImplementation(() => {
        throw new BadRequest()
      })

    expect(async () => {
      await generateToneEmpathyReview(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it('throws an error when an unhandled error is thrown', async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
      .mockImplementation(() => {
        throw Error('Unknown error.')
      })

    expect(async () => {
      await generateToneEmpathyReview(reqBody)
    }).rejects.toThrow('Unknown error.')
  })

  it('throws a ServiceUnavailableError when GetGPTResponse throws a ServiceUnavailableError', async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
      .mockImplementation(() => {
        throw new ServiceUnavailable()
      })

    expect(async () => {
      await generateToneEmpathyReview(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })
})
