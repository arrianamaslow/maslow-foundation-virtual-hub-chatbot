import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { InternalServerError } from '@/lib/errors/InternalServerError'
import { response_schema } from '@/serverSide/gptComponents/getMainBotResponse/schema'

describe('parseAndValidateResponse', () => {
  it(`returns the parsed response body if it has valid values for 'message' and 'thought'`, () => {
    const jsonResponse = { message: 'Hi', thought: 'None' }
    const result = parseAndValidateResponse(JSON.stringify(jsonResponse), response_schema)
    expect(result).toEqual(jsonResponse)
  })

  it(`throws an InternalServerError if the response body has no 'message' key`, () => {
    const jsonResponse = { thought: 'None' }
    expect(() => {
      parseAndValidateResponse(JSON.stringify(jsonResponse), response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if the response body has no 'thought' key`, () => {
    const jsonResponse = { message: 'Hi' }
    expect(() => {
      parseAndValidateResponse(JSON.stringify(jsonResponse), response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'message' is of the wrong format`, () => {
    const jsonResponse = { message: true, thought: 'None' }
    expect(() => {
      parseAndValidateResponse(JSON.stringify(jsonResponse), response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'thought' is of the wrong format`, () => {
    const jsonResponse = { message: 'Hi', thought: true }
    expect(() => {
      parseAndValidateResponse(JSON.stringify(jsonResponse), response_schema)
    }).toThrow(InternalServerError)
  })
})
