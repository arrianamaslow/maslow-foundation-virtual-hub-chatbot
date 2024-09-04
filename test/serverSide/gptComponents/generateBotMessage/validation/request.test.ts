import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/generateBotMessage/schema'
import { BadRequest } from '@/lib/errors/BadRequest'

describe('validateJson', () => {
  const reqBody = {
    chatMessages: [
      {
        content: 'hello',
        role: 'user'
      }
    ],
    questionToAsk: 'How was your day?'
  }

  it(`returns the parsed request body if it has valid values for 'chatMessages' and 'questionToAsk'`, async () => {
    const result = await validateJson(reqBody, request_schema)
    expect(result).toEqual(reqBody)
  })

  it(`throws a BadRequest if the request body has no 'chatMessages' key`, async () => {
    const reqBodyWithNoChatMessages = { questionToAsk: reqBody.questionToAsk }
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

  it(`throws a BadRequest if the request body has no 'questionToAsk' key`, async () => {
    const reqBodyWithNoQuestionToAsk = { chatMessages: reqBody.chatMessages }
    await expect(validateJson(reqBodyWithNoQuestionToAsk, request_schema)).rejects.toThrow(
      BadRequest
    )
  })

  it(`throws a BadRequest if 'questionToAsk' is the empty string`, async () => {
    const reqBodyWithEmptyQuestionToAsk = {
      ...reqBody,
      questionToAsk: ''
    }
    await expect(validateJson(reqBodyWithEmptyQuestionToAsk, request_schema)).rejects.toThrow(
      BadRequest
    )
  })
})
