import OpenAI from 'openai'
import * as request from '@/serverSide/utils/validation/request'
import * as getTaskPrompt from '@/serverSide/gptComponents/generateBotMessage/taskPrompt'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import { InternalServerError } from '@/lib/errors/InternalServerError'
import { when } from 'jest-when'
import {
  request_schema,
  response_schema
} from '@/serverSide/gptComponents/generateBotMessage/schema'
import { generateBotMessage } from '@/serverSide/gptComponents/generateBotMessage/generateBotMessage'

jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/serverSide/gptComponents/generateBotMessage/taskPrompt')
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
  ],
  questionToAsk: 'How was your day?'
}

const taskPrompt = 'Example task prompt'
const message = 'hello'

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)

  when(mockGetTaskPrompt).calledWith(reqBody.questionToAsk).mockReturnValue(taskPrompt)

  when(mockGetGptResponse)
    .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true)
    .mockResolvedValue({ message })
})

describe('generateBotMessage', () => {
  it(`returns as expected with the 'message' when the request is successful`, async () => {
    const response = await generateBotMessage(reqBody)
    expect(response.message).toBe(message)
  })

  it('throws a BadRequest when validateJson throws a BadRequest', async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockImplementation(() => {
        throw new BadRequest()
      })

    expect(async () => {
      await generateBotMessage(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it(`throws ServiceUnavailable when getGptResponse throws ServiceUnavailable`, async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true)
      .mockRejectedValueOnce(new ServiceUnavailable())
    expect(async () => {
      await generateBotMessage(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })

  it(`throws InternalServerError when getGptResponse throws InternalServerError`, async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true)
      .mockRejectedValueOnce(new InternalServerError())
    expect(async () => {
      await generateBotMessage(reqBody)
    }).rejects.toThrow(InternalServerError)
  })
})
