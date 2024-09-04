import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { response_schema } from '@/serverSide/gptComponents/generateToneEmpathyReview/schema'
import { InternalServerError } from '@/lib/errors/InternalServerError'
import { z } from 'zod'

const responseBody: z.infer<typeof response_schema> = {
  approved: true,
  suggestions: 'None'
}

describe('parseAndValidateResponse', () => {
  it(`returns the parsed response body if it has a valid value for 'approved', 'suggestions'`, () => {
    const result = parseAndValidateResponse(JSON.stringify(responseBody), response_schema)
    expect(result).toEqual(responseBody)
  })

  it(`throws an InternalServerError if the response body has no 'approved' key`, () => {
    const { approved, ...responseBodyWithNoApprovedKey } = responseBody
    expect(() => {
      parseAndValidateResponse(JSON.stringify(responseBodyWithNoApprovedKey), response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if the response body has the wrong format of 'approved' key`, () => {
    const invalidResponseBody = { ...responseBody, approved: 'hello' }
    expect(() => {
      parseAndValidateResponse(JSON.stringify(invalidResponseBody), response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if the response body has no 'suggestions' key`, () => {
    const { suggestions, ...responseBodyWithNoSuggestionKey } = responseBody
    expect(() => {
      parseAndValidateResponse(JSON.stringify(responseBodyWithNoSuggestionKey), response_schema)
    }).toThrow(InternalServerError)
  })
})
