import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import { when } from 'jest-when'
import * as getTaskPrompt from '@/serverSide/gptComponents/generateEndConversationMessage/taskPrompt'
import * as request from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/generateEndConversationMessage/schema'
import { response_schema } from '@/serverSide/gptComponents/generateEndConversationMessage/schema'
import OpenAI from 'openai'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { generateEndConversationMessage } from '@/serverSide/gptComponents/generateEndConversationMessage/generateEndConversationMessage'

jest.mock('@/serverSide/gptComponents/generateEndConversationMessage/taskPrompt')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const reqBody = {
  chatMessages: [
    {
      content: 'I want to end the conversation',
      role: 'user'
    } as OpenAI.ChatCompletionMessageParam
  ]
}

const taskPrompt = 'Example task prompt'

const message = "Okay, let's book"

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)

  when(mockGetTaskPrompt).mockReturnValue(taskPrompt)

  when(mockGetGptResponse)
    .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true, {
      temperatureOverride: 0.5
    })
    .mockResolvedValue({ message })
})

describe('generateEndConversationMessage()', () => {
  it(`returns the 'message' when the request is successful`, async () => {
    const response = await generateEndConversationMessage(reqBody)
    expect(response.message).toBe(message)
  })

  it('throws a BadRequest when validateJson throws a BadRequest', async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockImplementation(() => {
        throw new BadRequest()
      })
    expect(async () => {
      await generateEndConversationMessage(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it('throws an error when an unhandled error is thrown', async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true, {
        temperatureOverride: 0.5
      })
      .mockImplementation(() => {
        throw Error('Unknown error.')
      })
    expect(async () => {
      await generateEndConversationMessage(reqBody)
    }).rejects.toThrow('Unknown error.')
  })

  it('throws a ServiceUnavailableError when GetGptResponse throws a ServiceUnavailableError', async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, true, {
        temperatureOverride: 0.5
      })
      .mockImplementation(() => {
        throw new ServiceUnavailable()
      })
    expect(async () => {
      await generateEndConversationMessage(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })
})
