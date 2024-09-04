import OpenAI from 'openai'
const messageArrayGenerator = require('../../../src/serverSide/utils/generateMessageArrayForGpt')

import * as getOverallPrompt from '@/serverSide/utils/overallPrompt'
import { when } from 'jest-when'
jest.mock('@/serverSide/utils/overallPrompt')
const mockGetOverallPrompt = jest.spyOn(getOverallPrompt, 'getOverallPrompt')

const overallPrompt = 'You are helpful.'
const taskPrompt: string = 'You are a friend of the user, who has just come back from work.'
const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
  {
    role: 'assistant',
    content: 'Hey user who has just come back from work, what can I help you with?'
  },
  {
    role: 'user',
    content: 'The dishes, please.'
  }
]

describe('generateMessageArrayForGpt()', () => {
  let env: NodeJS.ProcessEnv
  beforeAll(() => {
    when(mockGetOverallPrompt).calledWith().mockReturnValue(overallPrompt)
    env = process.env
    process.env = { NODE_ENV: 'test' }
  })

  it('returns an array of the correct type when context is required', () => {
    expect(
      messageArrayGenerator.generateMessageArrayForGpt(taskPrompt, chatMessages, true)
    ).toBeInstanceOf(Array<OpenAI.ChatCompletionMessageParam>)
  })

  it('returns an array of the correct type when context is not required', () => {
    expect(
      messageArrayGenerator.generateMessageArrayForGpt(taskPrompt, chatMessages, false)
    ).toBeInstanceOf(Array<OpenAI.ChatCompletionMessageParam>)
  })

  it('returns an array with the desired information when context is required', () => {
    expect(
      messageArrayGenerator.generateMessageArrayForGpt(taskPrompt, chatMessages, true)
    ).toStrictEqual([
      {
        role: 'system',
        content: overallPrompt
      },
      {
        role: 'system',
        content: taskPrompt
      },
      ...chatMessages
    ] as OpenAI.ChatCompletionMessageParam[])
  })

  it('returns an array with the desired information when context is not required', () => {
    expect(
      messageArrayGenerator.generateMessageArrayForGpt(taskPrompt, chatMessages, false)
    ).toStrictEqual([
      {
        role: 'system',
        content: taskPrompt
      },
      ...chatMessages
    ] as OpenAI.ChatCompletionMessageParam[])
  })

  afterAll(() => {
    process.env = env
  })
})
