import * as getMainBotResponse from '@/serverSide/gptComponents/getMainBotResponse/getMainBotResponse'
jest.mock('@/serverSide/gptComponents/getMainBotResponse/getMainBotResponse')
const mockGetMainBotResponse = jest.spyOn(getMainBotResponse, 'getMainBotResponse')

import * as determineIfConversationShouldEnd from '@/serverSide/gptComponents/determineIfConversationShouldEnd/determineIfConversationShouldEnd'
jest.mock(
  '@/serverSide/gptComponents/determineIfConversationShouldEnd/determineIfConversationShouldEnd'
)
const mockDetermineIfConversationShouldEnd = jest.spyOn(
  determineIfConversationShouldEnd,
  'determineIfConversationShouldEnd'
)

import * as generateEndConversationMessage from '@/serverSide/gptComponents/generateEndConversationMessage/generateEndConversationMessage'
jest.mock(
  '@/serverSide/gptComponents/generateEndConversationMessage/generateEndConversationMessage'
)
const mockGenerateEndConversationMessage = jest.spyOn(
  generateEndConversationMessage,
  'generateEndConversationMessage'
)

import * as calculateFulfilmentValues from '@/serverSide/utils/processMessageAndGetResponse/calculateFulfilmentValues'
jest.mock('@/serverSide/utils/processMessageAndGetResponse/calculateFulfilmentValues')
const mockCalculateFulfilmentValues = jest.spyOn(
  calculateFulfilmentValues,
  'calculateFulfilmentValues'
)

import * as generateRiskScore from '@/serverSide/gptComponents/generateRiskScore/generateRiskScore'
jest.mock('@/serverSide/gptComponents/generateRiskScore/generateRiskScore.ts')
const mockGenerateRiskScore = jest.spyOn(generateRiskScore, 'generateRiskScore')

import * as updateCategoryFulfilmentStatus from '@/serverSide/utils/processMessageAndGetResponse/updateCategoryFulfilmentStatus'
jest.mock('@/serverSide/utils/processMessageAndGetResponse/updateCategoryFulfilmentStatus')
const mockUpdateCategoryFulfilmentStatus = jest.spyOn(
  updateCategoryFulfilmentStatus,
  'updateCategoryFulfilmentStatus'
)

import * as reviewProposedMessage from '@/serverSide/utils/processMessageAndGetResponse/reviewProposedMessage'
jest.mock('@/serverSide/utils/processMessageAndGetResponse/reviewProposedMessage')
const mockReviewProposedMessage = jest.spyOn(reviewProposedMessage, 'reviewProposedMessage')

import OpenAI from 'openai'
import { ChatBotState } from '@/lib/types/ChatBotState'
import { categoryFulfilmentData } from '@/lib/CategoryPoints'
import { when } from 'jest-when'
import { processMessageAndGetResponse } from '@/serverSide/utils/processMessageAndGetResponse/processMessageAndGetReponse'

let mockCurrentState: ChatBotState

const mockMainBotResponse = { message: 'Example bot message', thought: 'Example thought' }
const mockEndConversationMessage = { message: 'Example end conversation message' }

const mockConversationShouldEndDecision = {
  shouldEndConversation: true,
  justification: 'Example justification'
}
const mockConversationShouldContinueDecision = {
  shouldEndConversation: false,
  justification: 'Example justification'
}

const mockReviewApproved = { approvedStatus: true, suggestions: 'None' }
const mockReviewRejected = { approvedStatus: false, suggestions: 'Example suggestion' }

const mockFulfilmentValues = {
  totalNumberOfCategories: 0,
  numberOfCategoriesResolved: 0,
  numberOfCategoriesRequiringAttention: 0
}

beforeEach(() => {
  mockCurrentState = {
    chatMessages: [
      {
        content: `Example Message`,
        role: 'assistant'
      } as OpenAI.ChatCompletionMessageParam
    ],
    lastBotMessageCategory: 'Other',
    categoryFulfilment: categoryFulfilmentData,
    ended: false
  }
  when(mockCalculateFulfilmentValues)
    .calledWith(mockCurrentState.categoryFulfilment)
    .defaultReturnValue(mockFulfilmentValues)
  when(mockGetMainBotResponse)
    .calledWith({ chatMessages: mockCurrentState.chatMessages, suggestions: expect.any(String) })
    .mockResolvedValue(mockMainBotResponse)
  when(mockGenerateEndConversationMessage)
    .calledWith({ chatMessages: mockCurrentState.chatMessages })
    .mockResolvedValue(mockEndConversationMessage)
  when(mockGenerateRiskScore)
    .calledWith({ chatMessages: mockCurrentState.chatMessages })
    .mockResolvedValue({ riskScore: '', explanation: '' })
})

afterEach(() => {
  mockGetMainBotResponse.mockClear()
  mockGenerateEndConversationMessage.mockClear()
  jest.clearAllMocks()
})

describe('processMessageAndGetResponse()', () => {
  it('regenerates a bot response if approvalStatus is false', async () => {
    when(mockDetermineIfConversationShouldEnd)
      .calledWith({
        chatMessages: mockCurrentState.chatMessages,
        numberOfCategoriesResolved: 0,
        totalNumberOfCategories: 0,
        numberOfCategoriesRequiringAttention: 0,
        numberOfMessages: mockCurrentState.chatMessages.length
      })
      .mockResolvedValue(mockConversationShouldContinueDecision)
    when(mockReviewProposedMessage)
      .calledWith(mockCurrentState, mockMainBotResponse.message)
      .mockResolvedValue(mockReviewRejected)

    await processMessageAndGetResponse(mockCurrentState)

    expect(mockGetMainBotResponse).toHaveBeenCalledTimes(2)
    expect(mockCurrentState.ended).toBe(false)
    expect(mockGetMainBotResponse).toHaveBeenLastCalledWith({
      chatMessages: mockCurrentState.chatMessages,
      suggestions: 'Example suggestion'
    })
  })

  it('generates a single bot response if approvalStatus is true', async () => {
    when(mockDetermineIfConversationShouldEnd)
      .calledWith({
        chatMessages: mockCurrentState.chatMessages,
        numberOfCategoriesResolved: 0,
        totalNumberOfCategories: 0,
        numberOfCategoriesRequiringAttention: 0,
        numberOfMessages: mockCurrentState.chatMessages.length
      })
      .mockResolvedValue(mockConversationShouldContinueDecision)

    when(mockReviewProposedMessage)
      .calledWith(mockCurrentState, mockMainBotResponse.message)
      .mockResolvedValue(mockReviewApproved)

    await processMessageAndGetResponse(mockCurrentState)

    expect(mockGetMainBotResponse).toHaveBeenCalledTimes(1)
    expect(mockCurrentState.chatMessages.length).toBe(2)
    expect(mockCurrentState.ended).toBe(false)
    expect(mockCurrentState.chatMessages[1].content).toBe('Example bot message')
  })

  it('generates an ending response if the conversation is deemed to require ending', async () => {
    when(mockDetermineIfConversationShouldEnd)
      .calledWith({
        chatMessages: mockCurrentState.chatMessages,
        numberOfCategoriesResolved: 0,
        totalNumberOfCategories: 0,
        numberOfCategoriesRequiringAttention: 0,
        numberOfMessages: mockCurrentState.chatMessages.length
      })
      .mockResolvedValue(mockConversationShouldEndDecision)

    await processMessageAndGetResponse(mockCurrentState)

    expect(mockGenerateEndConversationMessage).toHaveBeenCalledTimes(1)
    expect(mockCurrentState.chatMessages.length).toBe(2)
    expect(mockCurrentState.ended).toBe(true)
    expect(mockCurrentState.chatMessages[1].content).toBe('Example end conversation message')
  })
})
