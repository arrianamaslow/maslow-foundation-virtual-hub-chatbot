import { categoryFulfilmentData } from '@/lib/CategoryPoints'
import { updateCategoryFulfilmentStatus } from '@/serverSide/utils/processMessageAndGetResponse/updateCategoryFulfilmentStatus'
import { ChatBotState } from '@/lib/types/ChatBotState'
import { when } from 'jest-when'
import { response_schema } from '@/serverSide/gptComponents/getCategoryFulfilment/schema'
import { z } from 'zod'

import * as getCategoryFulfilment from '@/serverSide/gptComponents/getCategoryFulfilment/getCategoryFulfilment'
jest.mock('@/serverSide/gptComponents/getCategoryFulfilment/getCategoryFulfilment')
const mockGetCategoryFulfilment = jest.spyOn(getCategoryFulfilment, 'getCategoryFulfilment')

import * as categorizeUserMessage from '@/serverSide/gptComponents/categorizeUserMessage/categorizeUserMessage'
jest.mock('@/serverSide/gptComponents/categorizeUserMessage/categorizeUserMessage')
const mockCategorizeUserMessage = jest.spyOn(categorizeUserMessage, 'categorizeUserMessage')

let mockState: ChatBotState

beforeEach(() => {
  mockState = {
    chatMessages: [],
    lastBotMessageCategory: 'Other',
    categoryFulfilment: categoryFulfilmentData,
    ended: false
  }
  mockState.categoryFulfilment['Finances']['Debt'] = 'Fulfilled'
  when(mockCategorizeUserMessage)
    .calledWith({ chatMessages: mockState.chatMessages })
    .mockResolvedValue({ categories: ['Finances', 'Accommodation', 'Other'] })
  when(mockGetCategoryFulfilment).mockImplementation(
    async (body): Promise<z.infer<typeof response_schema>> => {
      switch (body.category) {
        case 'Finances':
          return {
            message: {
              Debt: 'Unfulfilled',
              Gambling: 'Unfulfilled',
              'Affordability of lifestyle': 'Requires attention',
              'Consistency of income': 'Fulfilled'
            }
          }
        case 'Accommodation':
          return {
            message: {
              Location: 'Fulfilled',
              'Quality of accommodation': 'Unfulfilled',
              'Long-term stability': 'Requires attention',
              Conformability: 'Fulfilled'
            }
          }
        default:
          return {
            message: {
              'Highest level of education': 'Fulfilled',
              'Skills in current job': 'Unfulfilled',
              'Current job': 'Requires attentions',
              'Previous jobs': 'Fulfilled'
            }
          }
      }
    }
  )
})

describe('updateCategoryFulfilmentStatus()', () => {
  it('will update category fulfilment data on multiple categories and will not overwrite datapoints with unfulfilled', async () => {
    await updateCategoryFulfilmentStatus(mockState)
    expect(mockState.categoryFulfilment.Finances['Debt']).toEqual('Fulfilled')
    expect(mockState.categoryFulfilment.Finances['Gambling']).toEqual('Unfulfilled')
    expect(mockState.categoryFulfilment.Finances['Affordability of lifestyle']).toEqual(
      'Requires attention'
    )
    expect(mockState.categoryFulfilment.Finances['Consistency of income']).toEqual('Fulfilled')

    expect(mockState.categoryFulfilment.Accommodation['Location']).toEqual('Fulfilled')
    expect(mockState.categoryFulfilment.Accommodation['Quality of accommodation']).toEqual(
      'Unfulfilled'
    )
    expect(mockState.categoryFulfilment.Accommodation['Long-term stability']).toEqual(
      'Requires attention'
    )
    expect(mockState.categoryFulfilment.Accommodation['Conformability']).toEqual('Fulfilled')
  })
})
