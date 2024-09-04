import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/blockFalseInfoReviewer/schema'

describe('validateJson', () => {
  const reqBody = {
    chatMessages: [
      {
        role: 'user',
        content: 'hello'
      }
    ],
    generatedBotMessage: 'Hello. How are you?'
  }

  it(`returns the parsed request body if it has valid values for 'chatMessages' and 'generatedBotMessage'`, async () => {
    const result = await validateJson(reqBody, request_schema)
    expect(result).toEqual(reqBody)
  })

  it(`throws a BadRequest if the request body has no 'chatMessages' key`, async () => {
    const reqBodyWithNoChatMessages = {
      notChatMessages: reqBody.chatMessages,
      generatedBotMessage: reqBody.generatedBotMessage
    }

    await expect(validateJson(reqBodyWithNoChatMessages, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest',
        message: expect.stringContaining(
          'The chatMessages were not received in correct array format'
        )
      })
    )
  })

  it(`throws a BadRequest if 'chatMessages' is an empty array`, async () => {
    const reqBodyWithEmptyChatMessages = {
      chatMessages: [],
      generatedBotMessage: reqBody.generatedBotMessage
    }

    await expect(validateJson(reqBodyWithEmptyChatMessages, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest',
        message: expect.stringContaining('The chat message array was empty')
      })
    )
  })

  it(`throws a BadRequest if the request body has no 'generatedBotMessage' key`, async () => {
    const reqBodyWithNoGeneratedBotMessage = { chatMessages: reqBody.chatMessages }

    await expect(validateJson(reqBodyWithNoGeneratedBotMessage, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest',
        message: expect.stringContaining('Required')
      })
    )
  })
})
