import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/generateToneEmpathyReview/schema'
import { BadRequest } from '@/lib/errors/BadRequest'
import { z } from 'zod'

describe('validateJson', () => {
  const reqBody: z.infer<typeof request_schema> = {
    chatMessages: [
      {
        content: 'hello?',
        role: 'user'
      }
    ],
    generatedBotMessage: 'question here'
  }

  it(`returns the parsed request body if it has valid values for 'chatMessages' and 'generatedBotMessage'`, async () => {
    const result = await validateJson(reqBody, request_schema)
    expect(result).toEqual(reqBody)
  })

  it(`throws a BadRequest if the request body has no 'chatMessages' key`, async () => {
    const { chatMessages, ...reqBodyWithNoChatMessages } = reqBody
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

  it(`throws a BadRequest if the request body has no 'generatedBotMessage' key`, async () => {
    const { generatedBotMessage, ...reqBodyWithNoGeneratedBotMessage } = reqBody
    await expect(validateJson(reqBodyWithNoGeneratedBotMessage, request_schema)).rejects.toThrow(
      BadRequest
    )
  })
})
