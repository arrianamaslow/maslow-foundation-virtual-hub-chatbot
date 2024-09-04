import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { response_schema } from '@/serverSide/gptComponents/generateQuestionToAsk/schema'
import { InternalServerError } from '@/lib/errors/InternalServerError'

describe('parseAndValidateResponse', () => {
  it(`returns the parsed response body if it has a valid value for 'questionToAsk'`, () => {
    const jsonString = '{"questionToAsk":"How was your day?"}'
    const result = parseAndValidateResponse(jsonString, response_schema)
    expect(result).toEqual({ questionToAsk: 'How was your day?' })
  })

  it(`throws an InternalServerError if the response body has no 'questionToAsk' key`, () => {
    const jsonString = '{"notQuestionToAsk":"How was your day?"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'questionToAsk' is the empty string`, () => {
    const jsonString = '{"questionToAsk":""}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })
})
