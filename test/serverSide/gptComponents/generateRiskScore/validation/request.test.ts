import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/generateRiskScore/schema'
import { BadRequest } from '@/lib/errors/BadRequest'

describe('validateJson', () => {
  const reqBody = {
    chatMessages: [
      {
        content: 'hello',
        role: 'user'
      }
    ]
  }

  it(`returns the parsed request body if it has valid values for 'chatMessages'`, async () => {
    const result = await validateJson(reqBody, request_schema)
    expect(result).toEqual(reqBody)
  })

  it(`throws a BadRequest if the request body has no 'chatMessages' key`, async () => {
    const reqBodyWithNoChatMessages = { someProperty: 'hello' }
    await expect(validateJson(reqBodyWithNoChatMessages, request_schema)).rejects.toThrow(
      BadRequest
    )
  })

  it(`throws a BadRequest if 'chatMessages' is an empty array`, async () => {
    const reqBodyWithEmptyChatMessages = {
      chatMessages: []
    }
    await expect(validateJson(reqBodyWithEmptyChatMessages, request_schema)).rejects.toThrow(
      BadRequest
    )
  })
})
