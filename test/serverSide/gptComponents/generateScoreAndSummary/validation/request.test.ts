import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/generateScoreAndSummary/schema'
import { BadRequest } from '@/lib/errors/BadRequest'

describe('validateJson', () => {
  const reqBody = {
    chatMessages: [
      { role: 'system', content: 'hi' },
      {
        role: 'user',
        content: 'hello'
      },
      { role: 'system', content: 'hey' },
      {
        role: 'user',
        content: 'hiya'
      }
    ],
    category: 'Accommodation'
  }

  it(`returns the parsed request body if it has valid values for 'chatMessages' and 'category'`, async () => {
    const result = await validateJson(reqBody, request_schema)
    expect(result).toEqual(reqBody)
  })

  it(`throws a BadRequest if the request body has no 'chatMessages' key`, async () => {
    const reqBodyWithNoChatMessages = { category: reqBody.category }
    await expect(validateJson(reqBodyWithNoChatMessages, request_schema)).rejects.toThrow(
      BadRequest
    )
  })

  it(`throws a BadRequest if 'chatMessages' is an empty array`, async () => {
    const reqBodyWithEmptyChatMessages = {
      ...reqBody,
      chatMessages: []
    }
    await expect(validateJson(reqBodyWithEmptyChatMessages, request_schema)).rejects.toThrow(
      BadRequest
    )
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
})
