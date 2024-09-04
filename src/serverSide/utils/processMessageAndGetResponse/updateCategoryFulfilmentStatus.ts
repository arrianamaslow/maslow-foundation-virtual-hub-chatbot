import { mandatoryDataForAllCategories } from '@/lib/CategoryPoints'
import { ChatBotState } from '@/lib/types/ChatBotState'
import { categorizeUserMessage } from '@/serverSide/gptComponents/categorizeUserMessage/categorizeUserMessage'
import { getCategoryFulfilment } from '@/serverSide/gptComponents/getCategoryFulfilment/getCategoryFulfilment'

export const updateCategoryFulfilmentStatus = async (currentState: ChatBotState) => {
  const { categories } = await categorizeUserMessage({ chatMessages: currentState.chatMessages })

  const promises = categories.map(async (category) => {
    if (category === 'Other' || category === 'Offending') return

    if (category in currentState.categoryFulfilment) {
      const { message: fulfilmentForCategoryNewStatuses } = await getCategoryFulfilment({
        chatMessages: currentState.chatMessages,
        mandatoryData: mandatoryDataForAllCategories[category],
        category
      })

      const fulfilmentForCategory = currentState.categoryFulfilment[category]
      updateFulfilmentForCategoryWhereNewStatusNotUnfulfilled(
        fulfilmentForCategory,
        fulfilmentForCategoryNewStatuses
      )

      console.log(
        `${category} fulfilment: ${JSON.stringify(currentState.categoryFulfilment[category])}`
      )
    }
  })

  const updateFulfilmentForCategoryWhereNewStatusNotUnfulfilled = (
    fulfilmentForCategory: any,
    fulfilmentForCategoryNewStatuses: any
  ) => {
    Object.keys(fulfilmentForCategory).forEach((key) => {
      if (fulfilmentForCategoryNewStatuses.hasOwnProperty(key)) {
        if (fulfilmentForCategoryNewStatuses[key] !== 'Unfulfilled') {
          fulfilmentForCategory[key] = fulfilmentForCategoryNewStatuses[key]
        }
      }
    })
  }

  await Promise.all(promises)
}
