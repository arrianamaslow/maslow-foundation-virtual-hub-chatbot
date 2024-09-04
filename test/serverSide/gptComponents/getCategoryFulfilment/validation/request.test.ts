import { validateJson } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/getCategoryFulfilment/schema'
import { BadRequest } from '@/lib/errors/BadRequest'

describe('validateJson', () => {
  const reqBody = {
    chatMessages: [
      { role: 'assistant', content: `What's your housing situation like? Is it good?` },
      {
        role: 'user',
        content: `Yeah it's okay`
      },
      { role: 'assistant', content: 'What kind of accommodation are you living in?' },
      {
        role: 'user',
        content: `I'm renting a flat`
      }
    ],
    mandatoryData: [
      'Location',
      'Quality of accommodation',
      'Long-term stability',
      'Conformability'
    ],
    category: 'Accommodation'
  }

  it(`returns the parsed request body if it has valid values for 'chatMessages' and 'mandatoryData'`, async () => {
    const result = await validateJson(reqBody, request_schema)

    expect(result).toEqual(reqBody)
  })

  it(`throws a BadRequest if the request body has no 'chatMessages' key`, async () => {
    const reqBodyWithNoChatMessages = { mandatoryData: reqBody.mandatoryData }
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

  it(`throws a BadRequest if the request body has no 'mandatoryData' key`, async () => {
    const reqBodyWithNoCategory = { mandatoryData: reqBody.mandatoryData }
    await expect(validateJson(reqBodyWithNoCategory, request_schema)).rejects.toThrow(BadRequest)
  })

  it(`throws a BadRequest if 'mandatoryData' is an empty array`, async () => {
    const reqBodyWithEmptyCategory = {
      ...reqBody,
      mandatoryData: []
    }
    await expect(validateJson(reqBodyWithEmptyCategory, request_schema)).rejects.toThrow(BadRequest)
  })
})
