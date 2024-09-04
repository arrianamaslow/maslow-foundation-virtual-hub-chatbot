import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { response_schema } from '@/serverSide/gptComponents/generateRiskScore/schema'
import { InternalServerError } from '@/lib/errors/InternalServerError'

describe('parseAndValidateResponse', () => {
  it(`returns the parsed response body if it has a valid value for 'riskScore' and 'explanation`, () => {
    const jsonString = '{ "riskScore": "G1", "explanation": "hello" }'
    const result = parseAndValidateResponse(jsonString, response_schema)
    expect(result).toEqual(JSON.parse(jsonString))
  })

  it(`throws an InternalServerError if the response body has no 'riskScore' property`, () => {
    const jsonString = '{"explanation":"hello"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'riskScore' is not a string`, () => {
    const jsonString = '{"riskScore": true, "explanation": "hello" }'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'riskScore' does not have length of 2`, () => {
    const jsonString = '{"riskScore": "A long string", "explanation": "hello" }'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if the response body has no 'explanation' property`, () => {
    const jsonString = '{"riskScore": "G1"}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'explanation' is not a string`, () => {
    const jsonString = '{"riskScore": "G1", "explanation": 5 }'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'explanation' is an empty string`, () => {
    const jsonString = '{"riskScore": "G1", "explanation": "" }'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })
})
