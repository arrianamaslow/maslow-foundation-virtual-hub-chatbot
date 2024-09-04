import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { InternalServerError } from '@/lib/errors/InternalServerError'
import { response_schema } from '@/serverSide/gptComponents/getCategoryFulfilment/schema'

describe('parseAndValidateResponse', () => {
  it(`returns the message if json structure is as expected`, () => {
    const validResponseFromChatGPT = {
      message: {
        'point 1': 'Fulfilled',
        'point 2': 'Unfulfilled',
        'point 3': 'Prefer not to say'
      }
    }

    const jsonString = JSON.stringify(validResponseFromChatGPT)
    const result = parseAndValidateResponse(jsonString, response_schema)
    expect(result).toEqual(validResponseFromChatGPT)
  })

  it(`returns error if 'message' not in chat GPT response`, () => {
    const invalidResponseFromChatGPT = {
      invalidKey: {
        'point 1': 'Fulfilled',
        'point 2': 'Unfulfilled',
        'point 3': 'Prefer not to say'
      }
    }

    const jsonString = JSON.stringify(invalidResponseFromChatGPT)

    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`returns error if point value status not provided as a string`, () => {
    const invalidResponseFromChatGPT = {
      message: {
        'point 1': 'true',
        'point 2': false,
        'point 3': false,
        'point 4': true
      }
    }

    const jsonString = JSON.stringify(invalidResponseFromChatGPT)

    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`returns error if no points listed in chat GPT response`, () => {
    const invalidResponseFromChatGPT = {
      message: {}
    }

    const jsonString = JSON.stringify(invalidResponseFromChatGPT)

    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })
})
