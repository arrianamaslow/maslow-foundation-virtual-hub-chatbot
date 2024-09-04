import * as request from '@/serverSide/utils/validation/request'
import * as getTaskPrompt from '@/serverSide/gptComponents/generateRiskScore/taskPrompt'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { generateRiskScore } from '@/serverSide/gptComponents/generateRiskScore/generateRiskScore'
import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import { InternalServerError } from '@/lib/errors/InternalServerError'
import { when } from 'jest-when'
import { request_schema } from '@/serverSide/gptComponents/generateRiskScore/schema'
import { response_schema } from '@/serverSide/gptComponents/generateRiskScore/schema'
import OpenAI from 'openai'

jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/serverSide/gptComponents/generateRiskScore/taskPrompt')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const reqBody = {
  chatMessages: [
    {
      role: 'user',
      content: 'hi'
    } as OpenAI.ChatCompletionMessageParam
  ]
}

const taskPrompt = 'Example task prompt'
const riskScore = 5
const explanation = 'hello'

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)

  when(mockGetTaskPrompt).calledWith().mockReturnValue(taskPrompt)

  when(mockGetGptResponse)
    .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
    .mockResolvedValue({ riskScore, explanation })
})

describe('generateRiskScore()', () => {
  it(`returns as expected with the 'riskScore' and 'explanation' when the request is successful`, async () => {
    const response = await generateRiskScore(reqBody)
    expect(response.explanation).toBe(explanation)
    expect(response.riskScore).toBe(riskScore)
  })

  it('throws a BadRequest when validateJson throws a BadRequest', async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockImplementation(() => {
        throw new BadRequest()
      })

    expect(async () => {
      await generateRiskScore(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it(`throws ServiceUnavailable when getGptResponse throws ServiceUnavailable`, async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
      .mockRejectedValueOnce(new ServiceUnavailable())
    expect(async () => {
      await generateRiskScore(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })

  it(`throws InternalServerError when getGptResponse throws InternalServerError`, async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
      .mockRejectedValueOnce(new InternalServerError())
    expect(async () => {
      await generateRiskScore(reqBody)
    }).rejects.toThrow(InternalServerError)
  })
})
