import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { response_schema } from '@/serverSide/gptComponents/generateBotMessage/schema'
import { InternalServerError } from '@/lib/errors/InternalServerError'

describe('parseAndValidateResponse', () => {
  it(`returns the parsed response body if it has a valid value for 'message'`, () => {
    const jsonString = '{"message":"hello"}'
    const result = parseAndValidateResponse(jsonString, response_schema)
    expect(result).toEqual({ message: 'hello' })
  })

  it(`throws an InternalServerError if the response body has no 'message' key`, () => {
    const jsonString = '{"notMessage":"hello"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'message' is the empty string`, () => {
    const jsonString = '{"message":""}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })
})
