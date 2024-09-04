import OpenAI from 'openai'
import * as getTaskPrompt from '@/serverSide/gptComponents/generateQuestionToAsk/taskPrompt'
import * as request from '@/serverSide/utils/validation/request'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { when } from 'jest-when'
import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import {
  request_schema,
  response_schema
} from '@/serverSide/gptComponents/generateQuestionToAsk/schema'
import { generateQuestionToAsk } from '@/serverSide/gptComponents/generateQuestionToAsk/generateQuestionToAsk'

jest.mock('@/serverSide/gptComponents/generateQuestionToAsk/taskPrompt')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const reqBody = {
  category: 'Accommodation',
  chatMessages: [
    {
      content: 'hello?',
      role: 'user'
    } as OpenAI.ChatCompletionMessageParam
  ],
  dataPoints: ['Location']
}

const taskPrompt = 'Example task prompt'

const questionToAsk = 'How was your day?'

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)

  when(mockGetTaskPrompt)
    .calledWith(reqBody.category, reqBody.dataPoints)
    .mockReturnValue(taskPrompt)

  when(mockGetGptResponse)
    .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true)
    .mockResolvedValue({ questionToAsk })
})

describe('generateQuestionToAsk()', () => {
  it(`returns the 'questionToAsk' when the request is successful`, async () => {
    const response = await generateQuestionToAsk(reqBody)
    expect(response).toEqual({ questionToAsk })
  })

  it('throws a BadRequest when validateJson throws a BadRequest', async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockImplementation(() => {
        throw new BadRequest()
      })

    expect(async () => {
      await generateQuestionToAsk(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it('throws an error when an unhandled error is thrown', async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true)
      .mockImplementation(() => {
        throw Error('Unknown error.')
      })

    expect(async () => {
      await generateQuestionToAsk(reqBody)
    }).rejects.toThrow('Unknown error.')
  })

  it('throws a ServiceUnavailableError when GetGPTResponse throws a ServiceUnavailableError', async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true)
      .mockImplementation(() => {
        throw new ServiceUnavailable()
      })

    expect(async () => {
      await generateQuestionToAsk(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })
})
