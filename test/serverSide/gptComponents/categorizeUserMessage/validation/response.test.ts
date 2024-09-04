import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { InternalServerError } from '@/lib/errors/InternalServerError'
import { response_schema } from '@/serverSide/gptComponents/categorizeUserMessage/schema'

describe('parseAndValidateResponse', () => {
  it(`returns the parsed response body if it has a valid value for 'categories'`, () => {
    const jsonString = '{"categories":["Offending","Skills & Vocation"]}'
    const result = parseAndValidateResponse(jsonString, response_schema)
    expect(result).toEqual({ categories: ['Offending', 'Skills & Vocation'] })
  })

  it(`throws an InternalServerError if the response body has no 'categories' key`, () => {
    const jsonString = '{"notCategories":["Offending","Skills & Vocation"]}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'categories' is the empty array`, () => {
    const jsonString = '{"categories":[]}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'categories' contains a invalid category`, () => {
    const jsonString = '{"categories":["Offending","Invalid category"]}'
    expect(() => {
      parseAndValidateResponse(jsonString, response_schema)
    }).toThrow(InternalServerError)
  })
})
