import { categoryFulfilmentData } from '@/lib/CategoryPoints'
import { ChatBotState } from '@/lib/types/ChatBotState'
import { MaslowWheelCategories } from '@/lib/types/MaslowWheelCategory'
import { ScoreAndSummaryOverview } from '@/lib/types/ScoreAndSummaryOverview'
import { generateScoreAndSummaries } from '@/serverSide/utils/processMessageAndGetResponse/generateScoreAndSummaries'
import { when } from 'jest-when'
import OpenAI from 'openai'

import * as generateScoreAndSummary from '@/serverSide/gptComponents/generateScoreAndSummary/generateScoreAndSummary'
import { ScoreAndSummary } from '@/lib/types/ScoreAndSummary'
jest.mock('@/serverSide/gptComponents/generateScoreAndSummary/generateScoreAndSummary')
const mockGenerateScoreAndSummary = jest.spyOn(generateScoreAndSummary, 'generateScoreAndSummary')

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
const mockReturnScoreAndSummary = new ScoreAndSummary(5, 'Example summary')

const expectedScoreAndSummaries = {
  Accommodation: mockReturnScoreAndSummary,
  'Drugs_&_Alcohol_usage': mockReturnScoreAndSummary,
  'Emotional_&_Mental_Wellbeing': mockReturnScoreAndSummary,
  Finances: mockReturnScoreAndSummary,
  Personal_Growth: mockReturnScoreAndSummary,
  Physical_Wellbeing: mockReturnScoreAndSummary,
  Safety: mockReturnScoreAndSummary,
  Significant_Relationships: mockReturnScoreAndSummary,
  'Skills_&_Vocation': mockReturnScoreAndSummary,
  'Social_Connection_&_Impact': mockReturnScoreAndSummary
}

beforeEach(() => {
  when(mockGenerateScoreAndSummary)
    .calledWith({ chatMessages: mockCurrentState.chatMessages, category: expect.any(String) })
    .mockResolvedValue(mockReturnScoreAndSummary)
})

describe('generateScoreAndSummaries()', () => {
  it('creates a score and summary of all categories', async () => {
    const generatedScoreAndSummaries: ScoreAndSummaryOverview =
      await generateScoreAndSummaries(mockCurrentState)
    expect(mockGenerateScoreAndSummary).toHaveBeenCalledTimes(MaslowWheelCategories.length - 2)
    expect(generatedScoreAndSummaries).toEqual(expectedScoreAndSummaries)
  })
})
