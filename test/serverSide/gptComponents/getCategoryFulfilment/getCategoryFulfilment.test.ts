import OpenAI from 'openai'
import * as getTaskPrompt from '@/serverSide/gptComponents/getCategoryFulfilment/taskPrompt'
import * as request from '@/serverSide/utils/validation/request'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { when } from 'jest-when'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import { BadRequest } from '@/lib/errors/BadRequest'
import {
  request_schema,
  response_schema
} from '@/serverSide/gptComponents/getCategoryFulfilment/schema'
import { MaslowWheelCategory } from '@/lib/types/MaslowWheelCategory'
import { getCategoryFulfilment } from '@/serverSide/gptComponents/getCategoryFulfilment/getCategoryFulfilment'

jest.mock('@/serverSide/gptComponents/getCategoryFulfilment/taskPrompt')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const taskPrompt = 'Example task prompt'
const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
  { role: 'assistant', content: 'Hi' },
  {
    role: 'user',
    content: 'Hello'
  },
  { role: 'assistant', content: 'Hey' },
  {
    role: 'user',
    content: 'Good day'
  }
]
const mandatoryData = ['Friends', 'Family', 'Pets']
const category: MaslowWheelCategory = 'Significant Relationships'

const reqBody = {
  chatMessages: chatMessages,
  mandatoryData: mandatoryData,
  category: category
}

const returnValue = {
  message: {
    Friends: 'Fulfilled',
    Family: 'Requires attention',
    Pets: 'Unfulfilled'
  }
}

beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)
  when(mockGetTaskPrompt)
    .calledWith(reqBody.mandatoryData, reqBody.category)
    .mockReturnValue(taskPrompt)
  when(mockGetGptResponse)
    .calledWith(chatMessages, taskPrompt, response_schema, false)
    .mockResolvedValue(returnValue)
})

describe('getCategoryFulfilment()', () => {
  it(`returns the list of fulfilled dataPoints as expected`, async () => {
    const response = await getCategoryFulfilment(reqBody)
    expect(response).toEqual(returnValue)
  })

  it(`throws BadRequest when validateJson throws BadRequest`, async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockRejectedValueOnce(new BadRequest())
    expect(async () => {
      await getCategoryFulfilment(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it(`throws ServiceUnavailable when getGptResponse throws ServiceUnavailable`, async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
      .mockRejectedValueOnce(new ServiceUnavailable())
    expect(async () => {
      await getCategoryFulfilment(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })
})
