import { ChatBotState } from '@/lib/types/ChatBotState'
import { MaslowWheelCategories } from '@/lib/types/MaslowWheelCategory'
import { ScoreAndSummary } from '@/lib/types/ScoreAndSummary'
import { ScoreAndSummaryOverview } from '@/lib/types/ScoreAndSummaryOverview'
import { generateScoreAndSummary } from '@/serverSide/gptComponents/generateScoreAndSummary/generateScoreAndSummary'

const dbEncode = (unencoded: String) => {
  return unencoded.replace(/\s+/g, '_')
}

export const generateScoreAndSummaries = async (currentState: ChatBotState) => {
  let scoreAndSummaryOverview: ScoreAndSummaryOverview = {}

  const promises = MaslowWheelCategories.map(async (category) => {
    if (category === 'Other' || category === 'Offending') return

    if (category in currentState.categoryFulfilment) {
      const { score, summary } = await generateScoreAndSummary({
        chatMessages: currentState.chatMessages,
        category: category
      })
      scoreAndSummaryOverview[dbEncode(category)] = new ScoreAndSummary(score, summary)
    }
  })

  await Promise.all(promises)
  return scoreAndSummaryOverview
}
