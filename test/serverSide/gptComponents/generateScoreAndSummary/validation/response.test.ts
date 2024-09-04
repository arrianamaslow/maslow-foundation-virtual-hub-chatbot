import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { response_schema } from '@/serverSide/gptComponents/generateScoreAndSummary/schema'
import { InternalServerError } from '../../../../../src/lib/errors/InternalServerError'

describe('parseAndValidateResponse', () => {
  it(`returns the parsed response body if it has valid values for 'score' and 'summary'`, () => {
    const jsonString = '{"score":5,"summary":"Example summary"}'
    const result = parseAndValidateResponse(jsonString, response_schema)
    expect(result).toEqual({ score: 5, summary: 'Example summary' })
  })

  it(`returns the parsed response body if it has a valid value for 'summary' and 'score' is 0`, () => {
    const jsonString = '{"score":0,"summary":"Example summary"}'
    const result = parseAndValidateResponse(jsonString, response_schema)
    expect(result).toEqual({ score: 0, summary: 'Example summary' })
  })

  it(`throws an InternalServerError if the response body has no 'score' key`, () => {
    const jsonString = '{"notScore":5,"summary":"Example summary"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'score' is less than 0`, () => {
    const jsonString = '{"score":-1,"summary":"Example summary"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'score' is greater than 10`, () => {
    const jsonString = '{"score":11,"summary":"Example summary"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if the response body has no 'summary' key`, () => {
    const jsonString = '{"score":5,"notSummary":"Example summary"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'summary' is the empty string`, () => {
    const jsonString = '{"score":5,"summary":""}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })
})
