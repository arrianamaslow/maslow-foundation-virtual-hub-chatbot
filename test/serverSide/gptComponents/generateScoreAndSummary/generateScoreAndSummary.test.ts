import OpenAI from 'openai'
import * as getTaskPrompt from '@/serverSide/gptComponents/generateScoreAndSummary/taskPrompt'
import * as request from '@/serverSide/utils/validation/request'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { when } from 'jest-when'
import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import { response_schema } from '@/serverSide/gptComponents/generateScoreAndSummary/schema'
import { request_schema } from '@/serverSide/gptComponents/generateScoreAndSummary/schema'
import { MaslowWheelCategory } from '@/lib/types/MaslowWheelCategory'
import { generateScoreAndSummary } from '@/serverSide/gptComponents/generateScoreAndSummary/generateScoreAndSummary'

jest.mock('@/serverSide/gptComponents/generateScoreAndSummary/taskPrompt')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
  { content: 'Hi', role: 'system' },
  {
    content: 'Hello',
    role: 'user'
  },
  { content: 'Good day', role: 'system' },
  {
    content: 'Hiya',
    role: 'user'
  }
]
const reqBody = { chatMessages, category: 'Finances' as MaslowWheelCategory }

const taskPrompt = 'Example task prompt'

const response = {
  score: 5,
  summary: 'example summary'
}

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)

  when(mockGetTaskPrompt).calledWith(reqBody.category).mockReturnValue(taskPrompt)

  when(mockGetGptResponse)
    .calledWith(chatMessages, taskPrompt, response_schema, true)
    .mockResolvedValue(response)
})

describe('generateScoreAndSummary()', () => {
  it(`returns a 'score' and 'summary' when the request is successful`, async () => {
    const response = await generateScoreAndSummary(reqBody)
    expect(response.score).toBe(5)
    expect(response.summary).toBe('example summary')
  })

  it(`returns default 'score' and 'summary' values when the 'category' in the request body is the string 'other'`, async () => {
    const reqBodyWithCategoryUndefined = {
      ...reqBody,
      category: 'Other'
    }

    when(mockValidateJson)
      .calledWith(reqBodyWithCategoryUndefined, request_schema)
      .mockResolvedValueOnce(reqBodyWithCategoryUndefined)

    const response = await generateScoreAndSummary(reqBodyWithCategoryUndefined)
    expect(response.score).toBe(0)
    expect(response.summary).toBe('Uncategorised')
  })

  it('throws a BadRequest when validateJson throws a BadRequest', async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockImplementationOnce(() => {
        throw new BadRequest()
      })
    expect(async () => {
      await generateScoreAndSummary(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it('throws when an unhandled error is thrown', async () => {
    when(mockGetGptResponse)
      .calledWith(chatMessages, taskPrompt, response_schema, true)
      .mockImplementationOnce(() => {
        throw Error('No generation received from the OpenAI API.')
      })
    expect(async () => {
      await generateScoreAndSummary(reqBody)
    }).rejects.toThrow()
  })

  it('throws a ServiceUnavailableError when GetGPTResponse throws a ServiceUnavailableError', async () => {
    when(mockGetGptResponse)
      .calledWith(chatMessages, taskPrompt, response_schema, true)
      .mockImplementationOnce(() => {
        throw new ServiceUnavailable()
      })
    expect(async () => {
      await generateScoreAndSummary(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })
})
