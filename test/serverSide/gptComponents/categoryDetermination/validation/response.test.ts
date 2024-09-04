import { parseAndValidateResponse } from '@/serverSide/utils/validation/response'
import { InternalServerError } from '@/lib/errors/InternalServerError'
import { response_schema } from '@/serverSide/gptComponents/categoryDetermination/schema'
import { z } from 'zod'
describe('parseAndValidateResponse', () => {
  const defaultResponse: z.infer<typeof response_schema> = {
    category: 'Accommodation',
    dataPoints: []
  }

  it(`returns the parsed response body if it has a valid value for 'category'`, () => {
    const result = parseAndValidateResponse(JSON.stringify(defaultResponse), response_schema)
    expect(result).toEqual(defaultResponse)
  })

  it(`throws an InternalServerError if the response body has no 'category' key`, () => {
    const { category, ...invalidCategoryNameInJson } = defaultResponse

    expect(() => {
      parseAndValidateResponse(JSON.stringify(invalidCategoryNameInJson), response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if the response body has no 'dataPoints' key`, () => {
    const { dataPoints, ...invalidCategoryNameInJson } = defaultResponse

    expect(() => {
      parseAndValidateResponse(JSON.stringify(invalidCategoryNameInJson), response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'category' is the empty array`, () => {
    const invalidCategoryValueShapeInJson = { ...defaultResponse, category: [] }

    expect(() => {
      parseAndValidateResponse(JSON.stringify(invalidCategoryValueShapeInJson), response_schema)
    }).toThrow(InternalServerError)
  })

  it(`throws an InternalServerError if 'categories' contains a invalid category`, () => {
    const invalidCategoryValueInJson = { ...defaultResponse, category: 'Education' }

    expect(() => {
      parseAndValidateResponse(JSON.stringify(invalidCategoryValueInJson), response_schema)
    }).toThrow(InternalServerError)
  })
})
