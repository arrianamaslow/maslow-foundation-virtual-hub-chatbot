import { ChatBotState } from '@/lib/types/ChatBotState'
import { blockFalseInfoReviewer } from '@/serverSide/gptComponents/blockFalseInfoReviewer/blockFalseInfoReviewer'
import { generateToneEmpathyReview } from '@/serverSide/gptComponents/generateToneEmpathyReview/generateToneEmpathyReview'

type approvalSummary = { approvedStatus: boolean; suggestions: string }

export const reviewProposedMessage = async (
  currentState: ChatBotState,
  generatedBotMessage: string
): Promise<approvalSummary> => {
  const [toneReviewResult, falseInfoReviewResult] = await Promise.all([
    generateToneEmpathyReview({ chatMessages: currentState.chatMessages, generatedBotMessage }),
    blockFalseInfoReviewer({ chatMessages: currentState.chatMessages, generatedBotMessage })
  ])

  let improvementsList = ''
  if (!toneReviewResult.approved) {
    improvementsList += toneReviewResult.suggestions + '\n'
  }
  if (!falseInfoReviewResult.approved) {
    improvementsList += falseInfoReviewResult.suggestions + '\n'
  }

  const approvedStatus = toneReviewResult.approved && falseInfoReviewResult.approved
  const suggestions = !approvedStatus
    ? `
    <example> 
        This is a bad response: ${generatedBotMessage}
        Must do improvements:
          ${improvementsList}
    <example>
  `
    : ``

  console.log(`
    reviewer approval: [TONE/EMPATHY (${toneReviewResult.approved}), FALSE INFO (${falseInfoReviewResult.approved})]
    suggestions: ${improvementsList}
  `)

  return { approvedStatus, suggestions }
}
