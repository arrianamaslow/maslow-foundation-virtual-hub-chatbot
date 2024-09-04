import OpenAI from 'openai'
import * as getTaskPrompt from '@/serverSide/gptComponents/categoryDetermination/taskPrompt'
import * as request from '@/serverSide/utils/validation/request'
import * as getGptResponse from '@/lib/functions/getGptResponse'
import { when } from 'jest-when'
import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import { request_schema } from '@/serverSide/gptComponents/categoryDetermination/schema'
import { response_schema } from '@/serverSide/gptComponents/categoryDetermination/schema'
import { categoryDetermination } from '@/serverSide/gptComponents/categoryDetermination/categoryDetermination'

jest.mock('@/serverSide/gptComponents/categoryDetermination/taskPrompt')
jest.mock('@/serverSide/utils/validation/request')
jest.mock('@/lib/functions/getGptResponse')

const mockValidateJson = jest.spyOn(request, 'validateJson')
const mockGetTaskPrompt = jest.spyOn(getTaskPrompt, 'getTaskPrompt')
const mockGetGptResponse = jest.spyOn(getGptResponse, 'getGptResponse')

const reqBody = {
  chatMessages: [
    {
      content: 'Hi',
      role: 'assistant'
    } as OpenAI.ChatCompletionMessageParam,
    {
      content: 'Okay',
      role: 'user'
    } as OpenAI.ChatCompletionMessageParam
  ],
  previousUserMessageCategories: [],
  categoryFulfilment: {
    Accommodation: { Conformability: 'Unfulfilled' },
    'Significant Relationships': { Pets: 'Unfulfilled' },
    'Social Connection & Impact': { 'Relationship with people they live with': 'Unfulfilled' },
    'Physical Wellbeing': { 'Exercise frequency': 'Unfulfilled' },
    'Skills & Vocation': { 'Previous jobs': 'Unfulfilled' },
    'Emotional & Mental Wellbeing': { 'Interest in new things': 'Unfulfilled' },
    'Drugs & Alcohol usage': { 'Control of usage': 'Unfulfilled' },
    Finances: { 'Consistency of income': 'Unfulfilled' },
    'Personal Growth': { 'Plans for the future': 'Unfulfilled' },
    Safety: { 'Feeling safe at work': 'Unfulfilled' },
    Offending: { 'history of criminal behavior': 'Unfulfilled' }
  },
  lastBotMessageCategory: 'Significant Relationships'
}

const taskPrompt = 'Example task prompt'

const chosen_category = 'Offending'
beforeEach(() => {
  when(mockValidateJson).calledWith(reqBody, request_schema).mockResolvedValue(reqBody)

  when(mockGetTaskPrompt)
    .calledWith([
      'Drugs & Alcohol usage',
      'Physical Wellbeing',
      'Emotional & Mental Wellbeing',
      'Personal Growth',
      'Social Connection & Impact',
      'Significant Relationships',
      'Accommodation',
      'Finances',
      'Safety',
      'Skills & Vocation',
      'Offending'
    ])
    .mockReturnValue(taskPrompt)

  when(mockGetGptResponse)
    .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
    .mockResolvedValue(chosen_category)
})

describe('categoryDetermination()', () => {
  it(`returns the expected category when data feeding though to the gtp step is given`, async () => {
    const response = await categoryDetermination(reqBody)
    expect(response.category).toStrictEqual('Offending')
  })

  it('throws a bad request error when the gtp step is reached with invalid data', async () => {
    when(mockValidateJson)
      .calledWith(reqBody, request_schema)
      .mockImplementation(() => {
        throw new BadRequest()
      })
    expect(async () => {
      await categoryDetermination(reqBody)
    }).rejects.toThrow(BadRequest)
  })

  it('throws an error when an unhandled error is thrown', async () => {
    mockValidateJson.mockImplementation(() => {
      throw Error('No generation received from the OpenAI API.')
    })
    expect(async () => {
      await categoryDetermination(reqBody)
    }).rejects.toThrow()
  })

  it('throws a ServiceUnavailableError when GetGTPResponse throws a ServiceUnavailableError', async () => {
    when(mockGetGptResponse)
      .calledWith(reqBody.chatMessages, taskPrompt, response_schema, false)
      .mockImplementationOnce(() => {
        throw new ServiceUnavailable()
      })
    expect(async () => {
      await categoryDetermination(reqBody)
    }).rejects.toThrow(ServiceUnavailable)
  })

  it(`returns the Accommodation category when one of its sub-categories is flagged with Requires attention`, async () => {
    const reqBodyWithRequiresAttentionPoint = {
      ...reqBody,
      categoryFulfilment: {
        Accommodation: {
          Conformability: 'Requires attention'
        },
        'Significant Relationships': {},
        'Social Connection & Impact': {},
        'Physical Wellbeing': {},
        'Skills & Vocation': {},
        'Emotional & Mental Wellbeing': {},
        'Drugs & Alcohol usage': {},
        Finances: {},
        'Personal Growth': {},
        Safety: {},
        Offending: {}
      }
    }
    when(mockValidateJson)
      .calledWith(reqBodyWithRequiresAttentionPoint, request_schema)
      .mockResolvedValue(reqBodyWithRequiresAttentionPoint)

    const chosen_category_1 = 'Accommodation'
    const response = await categoryDetermination(reqBodyWithRequiresAttentionPoint)
    expect(response.category).toStrictEqual(chosen_category_1)
  })

  it(`returns the Significant Relationships category when it is one of the categories for the users last message, and of those it is the most fulfilled`, async () => {
    const reqBodyWithUserCategories = {
      ...reqBody,
      previousUserMessageCategories: [
        'Significant Relationships',
        'Social Connection & Impact',
        'Physical Wellbeing'
      ],
      categoryFulfilment: {
        Accommodation: {},
        'Significant Relationships': {
          'Frequency of contact with friends and family': 'Fulfilled',
          'Important people they rely on': 'Fulfilled',
          'Romantic relationship': 'Fulfilled',
          Pets: 'Unfulfilled'
        },
        'Social Connection & Impact': {
          'Relationship with people they live with': 'Unfulfilled',
          'Involvement in group activities': 'Unfulfilled',
          'Relationship with locals': 'Fulfilled'
        },
        'Physical Wellbeing': {
          'Impact of physical health on daily tasks': 'Unfulfilled',
          'Exercise frequency': 'Unfulfilled',
          'Balanced diet': 'Unfulfilled',
          'Sleep quality': 'Fulfilled'
        },
        'Skills & Vocation': {},
        'Emotional & Mental Wellbeing': {},
        'Drugs & Alcohol usage': {},
        Finances: {},
        'Personal Growth': {},
        Safety: {},
        Offending: {}
      }
    }

    when(mockValidateJson)
      .calledWith(reqBodyWithUserCategories, request_schema)
      .mockResolvedValue(reqBodyWithUserCategories)

    const chosen_category_2 = 'Significant Relationships'
    const response = await categoryDetermination(reqBodyWithUserCategories)
    expect(response.category).toStrictEqual(chosen_category_2)
  })

  it(`returns the Other category when all categories are fulfilled`, async () => {
    const reqBodyWithAllFulfilledCategories = {
      ...reqBody,
      categoryFulfilment: {
        Accommodation: { Conformability: 'Fulfilled' },
        'Significant Relationships': { Pets: 'Fulfilled' },
        'Social Connection & Impact': { 'Relationship with people they live with': 'Fulfilled' },
        'Physical Wellbeing': { 'Exercise frequency': 'Fulfilled' },
        'Skills & Vocation': { 'Previous jobs': 'Fulfilled' },
        'Emotional & Mental Wellbeing': { 'Interest in new things': 'Fulfilled' },
        'Drugs & Alcohol usage': { 'Control of usage': 'Fulfilled' },
        Finances: { 'Consistency of income': 'Fulfilled' },
        'Personal Growth': { 'Plans for the future': 'Fulfilled' },
        Safety: { 'Feeling safe at work': 'Fulfilled' },
        Offending: { 'history of criminal behavior': 'Fulfilled' }
      }
    }

    when(mockValidateJson)
      .calledWith(reqBodyWithAllFulfilledCategories, request_schema)
      .mockResolvedValue(reqBodyWithAllFulfilledCategories)

    const chosen_category_3 = 'Other'
    const response = await categoryDetermination(reqBodyWithAllFulfilledCategories)
    expect(response.category).toStrictEqual(chosen_category_3)
  })

  it(`returns the Social Connection & Impact category when there are no previous user categories and that category is the most fulfilled`, async () => {
    const reqBodyWithVariableFulfillmentCategories = {
      ...reqBody,
      categoryFulfilment: {
        Accommodation: {},
        'Significant Relationships': {
          'Frequency of contact with friends and family': 'Fulfilled',
          'Important people they rely on': 'Fulfilled',
          'Romantic relationship': 'Unfulfilled',
          Pets: 'Unfulfilled'
        },
        'Social Connection & Impact': {
          'Relationship with people they live with': 'Fulfilled',
          'Involvement in group activities': 'Unfulfilled',
          'Relationship with locals': 'Fulfilled'
        },
        'Physical Wellbeing': {
          'Impact of physical health on daily tasks': 'Unfulfilled',
          'Exercise frequency': 'Unfulfilled',
          'Balanced diet': 'Unfulfilled',
          'Sleep quality': 'Fulfilled'
        },
        'Skills & Vocation': {},
        'Emotional & Mental Wellbeing': {},
        'Drugs & Alcohol usage': {},
        Finances: {},
        'Personal Growth': {},
        Safety: {},
        Offending: {}
      }
    }

    when(mockValidateJson)
      .calledWith(reqBodyWithVariableFulfillmentCategories, request_schema)
      .mockResolvedValue(reqBodyWithVariableFulfillmentCategories)

    const chosen_category_4 = 'Social Connection & Impact'
    const response = await categoryDetermination(reqBodyWithVariableFulfillmentCategories)
    expect(response.category).toStrictEqual(chosen_category_4)
  })
})
