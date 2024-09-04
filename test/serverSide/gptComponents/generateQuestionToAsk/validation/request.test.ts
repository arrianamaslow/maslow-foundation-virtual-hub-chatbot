import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/generateQuestionToAsk/schema'
import { BadRequest } from '@/lib/errors/BadRequest'

describe('validateJson', () => {
  const reqBody = {
    category: 'Accommodation',
    chatMessages: [
      {
        content: 'Hello',
        role: 'user'
      }
    ],
    dataPoints: ['Long-term stability']
  }

  it(`returns the parsed request body if it has valid values for 'category' and 'summaryForCategory'`, async () => {
    const result = await validateJson(reqBody, request_schema)
    expect(result).toEqual(reqBody)
  })

  it(`throws a BadRequest if the request body has no 'category' key`, async () => {
    const reqBodyWithNoCategory = { chatMessages: reqBody.chatMessages }
    await expect(validateJson(reqBodyWithNoCategory, request_schema)).rejects.toThrow(BadRequest)
  })

  it(`throws a BadRequest if 'category' is the empty string`, async () => {
    const reqBodyWithEmptyCategory = {
      ...reqBody,
      category: ''
    }
    await expect(validateJson(reqBodyWithEmptyCategory, request_schema)).rejects.toThrow(BadRequest)
  })

  it(`throws a BadRequest if the request body has no 'summaryForCategory' key`, async () => {
    const reqBodyWithNoChatMessages = { category: reqBody.category }
    await expect(validateJson(reqBodyWithNoChatMessages, request_schema)).rejects.toThrow(
      BadRequest
    )
  })

  it(`throws a BadRequest if 'summaryForCategory' is the empty string`, async () => {
    const reqBodyWithEmptySummaryForCategory = {
      ...reqBody,
      chatMessages: []
    }

    await expect(validateJson(reqBodyWithEmptySummaryForCategory, request_schema)).rejects.toThrow(
      BadRequest
    )
  })
})
