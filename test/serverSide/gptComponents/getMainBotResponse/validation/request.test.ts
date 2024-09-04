import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/getMainBotResponse/schema'

describe('validateJson', () => {
  const reqBody = {
    chatMessages: [
      {
        role: 'user',
        content: 'hello'
      }
    ],
    suggestions: ''
  }

  it(`returns the parsed request body if it has valid values for 'chatMessages' and 'suggestions'`, async () => {
    const result = await validateJson(reqBody, request_schema)
    expect(result).toEqual(reqBody)
  })

  it(`throws a BadRequest if the request body has no 'chatMessages' key`, async () => {
    const reqBodyWithNoChatMessages = {
      notChatMessages: reqBody.chatMessages,
      suggestions: ''
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

  it(`throws a BadRequest if the request body has no 'suggestions' key`, async () => {
    const reqBodyWithNoSuggestionsKey = {
      chatMessages: reqBody.chatMessages,
      notSuggestions: reqBody.suggestions
    }

    await expect(validateJson(reqBodyWithNoSuggestionsKey, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest'
      })
    )
  })

  it(`throws a BadRequest if 'chatMessages' is an empty array`, async () => {
    const reqBodyWithEmptyChatMessages = {
      chatMessages: []
    }

    await expect(validateJson(reqBodyWithEmptyChatMessages, request_schema)).rejects.toThrow(
      expect.objectContaining({
        name: 'BadRequest',
        message: expect.stringContaining('The chat message array was empty')
      })
    )
  })
})
