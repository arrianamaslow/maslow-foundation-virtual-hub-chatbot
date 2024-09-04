import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/categoryDetermination/schema'
import { BadRequest } from '@/lib/errors/BadRequest'

describe('validateJson', () => {
  const reqBody = {
    chatMessages: [
      {
        content: 'Hi',
        role: 'assistant'
      },
      {
        content: 'Okay',
        role: 'user'
      }
    ],
    previousUserMessageCategories: [],
    categoryFulfilment: {
      Accommodation: {
        Conformability: 'Unfulfilled'
      },
      'Significant Relationships': {
        Pets: 'Unfulfilled'
      },
      'Social Connection & Impact': {
        'Relationship with people they live with': 'Unfulfilled'
      },
      'Physical Wellbeing': {
        'Exercise frequency': 'Unfulfilled'
      },
      'Skills & Vocation': {
        'Previous jobs': 'Unfulfilled'
      },
      'Emotional & Mental Wellbeing': {
        'Interest in new things': 'Unfulfilled'
      },
      'Drugs & Alcohol usage': {
        'Control of usage': 'Unfulfilled'
      },
      Finances: {
        'Consistency of income': 'Unfulfilled'
      },
      'Personal Growth': {
        'Plans for the future': 'Unfulfilled'
      },
      Safety: {
        'Feeling safe at work': 'Unfulfilled'
      },
      Offending: {
        'history of criminal behavior': 'Unfulfilled'
      }
    },
    lastBotMessageCategory: 'Significant Relationships'
  }

  it(`returns the parsed request body if there are valid values for all input fields'`, async () => {
    const result = await validateJson(reqBody, request_schema)
    expect(result).toEqual(reqBody)
  })

  it(`throws a BadRequest if the request body has no 'chatMessages' key`, async () => {
    const reqBodyWithNoChatMessages = {
      notChatMessages: reqBody.chatMessages,
      previousUserMessageCategories: reqBody.previousUserMessageCategories,
      categoryFulfilment: reqBody.categoryFulfilment,
      lastBotMessageCategory: reqBody.lastBotMessageCategory
    }

    await expect(validateJson(reqBodyWithNoChatMessages, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest',
        message: expect.stringContaining(
          'The chatMessages were not received in correct array format'
        )
      })
    )
  })

  it(`throws a BadRequest if the request body has no 'CategoryFulfillment' key`, async () => {
    const reqBodyWithNoCategoryFulfillment = {
      chatMessages: reqBody.chatMessages,
      previousUserMessageCategories: reqBody.previousUserMessageCategories,
      notCategoryFulfilment: reqBody.categoryFulfilment,
      lastBotMessageCategory: reqBody.lastBotMessageCategory
    }

    await expect(validateJson(reqBodyWithNoCategoryFulfillment, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest'
      })
    )
  })

  it(`throws a BadRequest if the request body has no 'previousUserMessageCategories' key`, async () => {
    const reqBodyWithNoCategoryFulfillment = {
      chatMessages: reqBody.chatMessages,
      notPreviousUserMessageCategories: reqBody.previousUserMessageCategories,
      categoryFulfilment: reqBody.categoryFulfilment,
      lastBotMessageCategory: reqBody.lastBotMessageCategory
    }

    await expect(validateJson(reqBodyWithNoCategoryFulfillment, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest'
      })
    )
  })

  it(`throws a BadRequest if the request body has no 'lastBotMessageCategory' key`, async () => {
    const reqBodyWithNoCategoryFulfillment = {
      chatMessages: reqBody.chatMessages,
      previousUserMessageCategories: reqBody.previousUserMessageCategories,
      categoryFulfilment: reqBody.categoryFulfilment,
      notLastBotMessageCategory: reqBody.lastBotMessageCategory
    }

    await expect(validateJson(reqBodyWithNoCategoryFulfillment, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest'
      })
    )
  })

  it(`throws a BadRequest if 'chatMessages' is an empty array`, async () => {
    const reqBodyWithEmptyChatMessages = {
      ...reqBody,
      chatMessages: []
    }

    await expect(validateJson(reqBodyWithEmptyChatMessages, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest',
        message: expect.stringContaining('The chat message array was empty')
      })
    )
  })

  it(`throws a BadRequest if 'category fulfillment' formatting is wrong`, async () => {
    const reqBodyWithEmptyChatMessages = {
      ...reqBody,
      categoryFulfilment: { education: {} }
    }

    await expect(validateJson(reqBodyWithEmptyChatMessages, request_schema)).rejects.toThrow(
      BadRequest
    )
  })

  it(`throws a BadRequest if 'category fulfillment' does not contain sub category information for all the categories`, async () => {
    const reqBodyWithEmptyChatMessages = {
      ...reqBody,
      categoryFulfilment: {}
    }

    await expect(validateJson(reqBodyWithEmptyChatMessages, request_schema)).rejects.toThrow(
      BadRequest
    )
  })
})
