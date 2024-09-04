import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { InternalServerError } from '@/lib/errors/InternalServerError'
import { response_schema } from '@/serverSide/gptComponents/blockFalseInfoReviewer/schema'

describe('parseAndValidateResponse', () => {
  it(`returns the parsed response body if it has a valid value for 'approved' and 'suggestions'`, () => {
    const jsonString = '{"approved":true, "suggestions":"None"}'
    const result = parseAndValidateResponse(jsonString, response_schema)
    expect(result).toEqual({ approved: true, suggestions: 'None' })
  })

  it(`throws an InternalServerError if the response body has no 'suggestions' key`, () => {
    const jsonString = '{"approved":true}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if the response body has no 'approved' key`, () => {
    const jsonString = '{"suggestions":"None"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'approved' is of the wrong format`, () => {
    const jsonString = '{"approved":"yes", "suggestions":"None"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })
})
