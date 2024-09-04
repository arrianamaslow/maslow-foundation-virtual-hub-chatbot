import { ChatBotState } from '@/lib/types/ChatBotState'
import { getMainBotResponse } from '@/serverSide/gptComponents/getMainBotResponse/getMainBotResponse'
import { determineIfConversationShouldEnd } from '@/serverSide/gptComponents/determineIfConversationShouldEnd/determineIfConversationShouldEnd'
import { generateEndConversationMessage } from '@/serverSide/gptComponents/generateEndConversationMessage/generateEndConversationMessage'
import { calculateFulfilmentValues } from './calculateFulfilmentValues'
import { updateCategoryFulfilmentStatus } from './updateCategoryFulfilmentStatus'
import { reviewProposedMessage } from './reviewProposedMessage'
import { fetchWithRetry } from '@/lib/requests/helpers/apiRetry'
import { generateRiskScore } from '@/serverSide/gptComponents/generateRiskScore/generateRiskScore'

export async function processMessageAndGetResponse(currentState: ChatBotState) {
  console.log(
    `### Conversation Message ${currentState.chatMessages.length / 2} processMessageAndGetResponse log ###`
  )

  try {
    await updateCategoryFulfilmentStatus(currentState)
  } catch (error: any) {
    console.error(error.message)
  }

  const {
    totalNumberOfCategories,
    numberOfCategoriesResolved,
    numberOfCategoriesRequiringAttention
  } = calculateFulfilmentValues(currentState.categoryFulfilment)

  console.log(`Status of conversation:
    Number of categories: ${totalNumberOfCategories}
    Number of categories resolved: ${numberOfCategoriesResolved}
    Number of categories requiring attention ${numberOfCategoriesRequiringAttention}
  `)

  let shouldEndConversation, justification

  try {
    ;({ shouldEndConversation, justification } = await determineIfConversationShouldEnd({
      chatMessages: currentState.chatMessages,
      numberOfCategoriesResolved,
      totalNumberOfCategories,
      numberOfCategoriesRequiringAttention,
      numberOfMessages: currentState.chatMessages.length
    }))
  } catch (error: any) {
    shouldEndConversation = false
    justification = ''
  }

  console.log(`
    should end conversation: ${shouldEndConversation}
    justification: ${justification}
  `)

  let message, thought

  if (shouldEndConversation) {
    currentState.ended = true
    ;({ message } = await fetchWithRetry({
      apiCall: () => {
        return generateEndConversationMessage({
          chatMessages: currentState.chatMessages
        })
      },
      maxRetries: 3
    }))

    const { riskScore, explanation } = await fetchWithRetry({
      apiCall: () => {
        return generateRiskScore({ chatMessages: currentState.chatMessages })
      },
      maxRetries: 3
    })
    console.log(`
      Risk score: ${riskScore}
      Explanation: ${explanation}
      `)
  } else {
    ;({ message, thought } = await fetchWithRetry({
      apiCall: () => {
        return getMainBotResponse({
          chatMessages: currentState.chatMessages,
          suggestions: ''
        })
      },
      maxRetries: 3
    }))

    let approvedStatus, suggestions

    try {
      ;({ approvedStatus, suggestions } = await reviewProposedMessage(currentState, message))
    } catch (error: any) {
      approvedStatus = true
      suggestions = ''
    }

    if (!approvedStatus) {
      ;({ message, thought } = await fetchWithRetry({
        apiCall: () => {
          return getMainBotResponse({
            chatMessages: currentState.chatMessages,
            suggestions
          })
        },
        maxRetries: 3
      }))
    }

    console.log(`
      user message: ${currentState.chatMessages[currentState.chatMessages.length - 1].content}
      bot reply ${suggestions && '(suggestions applied)'}: ${message}
      last message thought: ${thought}
    `)
  }

  currentState.chatMessages.push({
    content: message,
    role: 'assistant'
  })
}
