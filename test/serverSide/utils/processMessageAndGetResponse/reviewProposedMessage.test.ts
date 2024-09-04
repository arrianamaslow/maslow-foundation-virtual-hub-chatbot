import { when } from 'jest-when'
import { reviewProposedMessage } from '@/serverSide/utils/processMessageAndGetResponse/reviewProposedMessage'
import OpenAI from 'openai'
import { categoryFulfilmentData } from '@/lib/CategoryPoints'
import { ChatBotState } from '@/lib/types/ChatBotState'

import * as blockFalseInfoReviewer from '@/serverSide/gptComponents/blockFalseInfoReviewer/blockFalseInfoReviewer'
jest.mock('@/serverSide/gptComponents/blockFalseInfoReviewer/blockFalseInfoReviewer')
const mockBlockFalseInfoReviewer = jest.spyOn(blockFalseInfoReviewer, 'blockFalseInfoReviewer')

import * as generateToneEmpathyReview from '@/serverSide/gptComponents/generateToneEmpathyReview/generateToneEmpathyReview'
jest.mock('@/serverSide/gptComponents/generateToneEmpathyReview/generateToneEmpathyReview')
const mockGenerateToneEmpathyReview = jest.spyOn(
  generateToneEmpathyReview,
  'generateToneEmpathyReview'
)

const mockCurrentState: ChatBotState = {
  chatMessages: [
    {
      content: `Example Message`,
      role: 'assistant'
    } as OpenAI.ChatCompletionMessageParam
  ],
  lastBotMessageCategory: 'Other',
  categoryFulfilment: categoryFulfilmentData,
  ended: false
}
const mockMessage = 'Example message'

describe('reviewProposedMessage()', () => {
  it('approves if both reviewers approve', async () => {
    when(mockGenerateToneEmpathyReview)
      .calledWith({ chatMessages: mockCurrentState.chatMessages, generatedBotMessage: mockMessage })
      .mockResolvedValue({
        approved: true,
        suggestions: 'a'
      })
    when(mockBlockFalseInfoReviewer)
      .calledWith({ chatMessages: mockCurrentState.chatMessages, generatedBotMessage: mockMessage })
      .mockResolvedValue({ approved: true, suggestions: 'b' })

    const { approvedStatus, suggestions } = await reviewProposedMessage(
      mockCurrentState,
      mockMessage
    )
    expect(approvedStatus).toBe(true)
    expect(suggestions).toBe('')
  })

  it("doesn't approve if tone reviewer doesn't approve", async () => {
    when(mockGenerateToneEmpathyReview)
      .calledWith({ chatMessages: mockCurrentState.chatMessages, generatedBotMessage: mockMessage })
      .mockResolvedValue({
        approved: false,
        suggestions: 'a'
      })
    when(mockBlockFalseInfoReviewer)
      .calledWith({ chatMessages: mockCurrentState.chatMessages, generatedBotMessage: mockMessage })
      .mockResolvedValue({ approved: true, suggestions: 'b' })

    const { approvedStatus, suggestions } = await reviewProposedMessage(
      mockCurrentState,
      mockMessage
    )
    expect(approvedStatus).toBe(false)
    expect(suggestions).toContain('a\n')
    expect(suggestions).toContain(mockMessage)
  })

  it("doesn't approve if false info reviewer doesn't approve", async () => {
    when(mockGenerateToneEmpathyReview)
      .calledWith({ chatMessages: mockCurrentState.chatMessages, generatedBotMessage: mockMessage })
      .mockResolvedValue({
        approved: true,
        suggestions: 'a'
      })
    when(mockBlockFalseInfoReviewer)
      .calledWith({ chatMessages: mockCurrentState.chatMessages, generatedBotMessage: mockMessage })
      .mockResolvedValue({ approved: false, suggestions: 'b' })

    const { approvedStatus, suggestions } = await reviewProposedMessage(
      mockCurrentState,
      mockMessage
    )
    expect(approvedStatus).toBe(false)
    expect(suggestions).toContain('b\n')
    expect(suggestions).toContain(mockMessage)
  })

  it("doesn't approve if both reviewers don't approve", async () => {
    when(mockGenerateToneEmpathyReview)
      .calledWith({ chatMessages: mockCurrentState.chatMessages, generatedBotMessage: mockMessage })
      .mockResolvedValue({
        approved: false,
        suggestions: 'a'
      })
    when(mockBlockFalseInfoReviewer)
      .calledWith({ chatMessages: mockCurrentState.chatMessages, generatedBotMessage: mockMessage })
      .mockResolvedValue({ approved: false, suggestions: 'b' })

    const { approvedStatus, suggestions } = await reviewProposedMessage(
      mockCurrentState,
      mockMessage
    )
    expect(approvedStatus).toBe(false)
    expect(suggestions).toContain('a\nb\n')
    expect(suggestions).toContain(mockMessage)
  })
})
